import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";
import { ProjectTile, cityOf, ProjectsSection } from "../components/ProjectsSection";
import { PROJECTS } from "../data/projects";

const PP_CITIES = ["All", "Kolkata", "Indore", "Bhopal"];
const PP_STATUS = ["All", "Ready to Move", "Ongoing", "Upcoming"];

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

export default function ProjectsPage() {
  const init = ppHashFilter();
  const [city, setCity] = useState(init.city);
  const [status, setStatus] = useState(init.status);
  const [items, setItems] = useState(() => PROJECTS);
  const [type, setType] = useState(init.type);

  const pickCity = (c) => { setCity(c); setType("All"); };
  const pickStatus = (s) => { setStatus(s); setType("All"); };

  useEffect(() => {
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

  useEffect(() => {
    if (init.city !== "All" || init.status !== "All" || init.type !== "All") {
      const t = setTimeout(() => {
        if (window.smoothTo) window.smoothTo("#projects");
      }, 60);
      return () => clearTimeout(t);
    }
  }, []);

  useEffect(() => {
    const handleHashChange = () => {
      const updated = ppHashFilter();
      setCity(updated.city);
      setStatus(updated.status);
      setType(updated.type);
      if (window.smoothTo) window.smoothTo("#projects");
    };
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const onContact = () => {
    if (window.smoothTo) window.smoothTo("#contact");
  };

  return (
    <>
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
    </>
  );
}
