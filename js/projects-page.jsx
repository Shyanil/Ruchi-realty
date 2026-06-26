/* ============================================================
   All Projects page — the full catalogue, filterable
   ============================================================ */
const { useState: uSP, useEffect: uEP } = React;

const PP_CITIES = ["All", "Kolkata", "Indore", "Bhopal"];
const PP_STATUS = ["All", "Ready to Move", "Ongoing", "Upcoming"];

// Read an initial filter handed over from the header mega-menu, e.g.
// "...All Projects.html#city=Kolkata" or "#status=Ready+to+Move" or "#type=Township".
function ppHashFilter() {
  const raw = (typeof location !== "undefined" ? location.hash : "").replace(/^#/, "");
  const q = new URLSearchParams(raw);
  const city = q.get("city"), status = q.get("status"), type = q.get("type");
  return {
    city: PP_CITIES.includes(city) ? city : "All",
    status: PP_STATUS.includes(status) ? status : "All",
    type: type || "All",
  };
}

function AllProjectsPage() {
  const init = ppHashFilter();
  const [city, setCity] = uSP(init.city);
  const [status, setStatus] = uSP(init.status);
  const [items, setItems] = uSP(() => PROJECTS);
  // Optional pre-filter from the header menu (e.g. Townships). The page has no
  // type chip, so any city/status click clears it back to the normal two-axis view.
  const [type, setType] = uSP(init.type);
  const pickCity = (c) => { setCity(c); setType("All"); };
  const pickStatus = (s) => { setStatus(s); setType("All"); };
  uEP(() => {
    let active = true;
    if (window.RuchiBackend?.projects) {
      window.RuchiBackend.projects.getPublicProjects().then(({ data }) => {
        if (active && Array.isArray(data) && data.length) setItems(data);
      });
    }
    return () => { active = false; };
  }, []);

  const pool = items.length ? items : PROJECTS;
  const list = pool.filter((p) =>
    (city === "All" || cityOf(p) === city) &&
    (status === "All" || p.status === status) &&
    (type === "All" || p.type === type));
  const onContact = () => smoothTo("#contact");

  // When arriving with a filter from the header, drop straight to the results.
  uEP(() => {
    if (init.city !== "All" || init.status !== "All" || init.type !== "All") {
      const t = setTimeout(() => smoothTo("#projects"), 60);
      return () => clearTimeout(t);
    }
  }, []);

  // Update filters if the hash changes while on the page
  uEP(() => {
    const handleHashChange = () => {
      const updated = ppHashFilter();
      setCity(updated.city);
      setStatus(updated.status);
      setType(updated.type);
      smoothTo("#projects");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  return (
    <React.Fragment>
      <Nav onContact={onContact} />
      <main>
        <header className="pp-hero" data-screen-label="All Projects">
          <div className="pp-hero__sig" aria-hidden="true"></div>
          <div className="rr-wrap">
            <Reveal>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Our Projects</div>
              <h1 className="pp-head">Every address,<br /><span className="rr-grad">across three cities.</span></h1>
              <p className="pp-lead">
                Residences, commercial space, and townships in Kolkata, Indore, and Bhopal — each one carried from drawing to handover with the same care.
              </p>
            </Reveal>
          </div>
        </header>

        <section className="pp-body section-pad" id="projects">
          <div className="rr-wrap">
            <Reveal>
              <div className="ptabs" role="tablist" aria-label="Filter projects by city">
                {PP_CITIES.map((c) => {
                  const n = c === "All" ? pool.length : pool.filter((p) => cityOf(p) === c).length;
                  return (
                    <button key={c} role="tab" type="button" aria-selected={city === c}
                      className={`ptab ${city === c ? "is-active" : ""}`} onClick={() => pickCity(c)}>
                      {c}<span className="ptab__count">{n}</span>
                    </button>
                  );
                })}
              </div>
              <div className="pp-status" role="group" aria-label="Filter projects by status">
                {PP_STATUS.map((s) =>
                  <button key={s} type="button" className={`pp-chip ${status === s ? "is-active" : ""}`}
                    aria-pressed={status === s} onClick={() => pickStatus(s)}>
                    {s === "All" ? "Any status" : s}
                  </button>
                )}
              </div>
            </Reveal>
            <div className="pgrid" key={`${city}-${status}`}>
              {list.map((p, i) =>
                <Reveal key={`${p.name}-${p.city}-${i}`} delay={(i % 3) * 70}>
                  <ProjectTile p={p} i={i} n={i} />
                </Reveal>
              )}
            </div>
            {list.length === 0 ?
              <p className="pp-empty">Nothing here yet — try a different city or status.</p> : null}
            <p className="pp-count">
              {list.length} {list.length === 1 ? "address" : "addresses"}
              {type === "All" ? "" : ` · ${type}s`}
              {city === "All" ? "" : ` in ${city}`}
              {status === "All" ? "" : ` · ${status}`}
            </p>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </React.Fragment>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AllProjectsPage />);
