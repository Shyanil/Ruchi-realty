import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";
import { ProjectTile, cityOf } from "../components/ProjectsSection";
import SEO from "../components/SEO";
import { PROJECTS } from "../data/projects";

const PP_CITIES = ["All", "Kolkata", "Indore", "Bhopal"];
const PP_STATUS = ["All", "Ready to Move", "Ongoing", "Upcoming"];

function ppHashFilter(hash = typeof location !== "undefined" ? location.hash : "") {
  const raw = hash.replace(/^#/, "");
  const q = new URLSearchParams(raw);
  const city = q.get("city"), status = q.get("status"), type = q.get("type");
  const selectedCity = PP_CITIES.includes(city) ? city : "All";
  return {
    city: selectedCity,
    status: selectedCity !== "All" && PP_STATUS.includes(status) ? status : "All",
    type: type || "All",
  };
}

function scrollToProjects() {
  const projects = document.getElementById("projects");
  if (!projects) return;
  const headerOffset = 80;
  window.scrollTo({
    top: projects.getBoundingClientRect().top + window.scrollY - headerOffset,
    behavior: "smooth",
  });
}

export default function ProjectsPage() {
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const init = ppHashFilter(routeLocation.hash);
  const [city, setCity] = useState(init.city);
  const [status, setStatus] = useState(init.status);
  const [items, setItems] = useState(() => PROJECTS);
  const [type, setType] = useState(init.type);

  const updateFilters = (nextCity, nextStatus) => {
    const normalizedStatus = nextCity === "All" ? "All" : nextStatus;
    setCity(nextCity);
    setStatus(normalizedStatus);
    setType("All");
    const params = new URLSearchParams();
    if (nextCity !== "All") params.set("city", nextCity);
    if (normalizedStatus !== "All") params.set("status", normalizedStatus);
    navigate(`/projects${params.size ? `#${params.toString()}` : ""}`, { replace: true });
  };
  const pickCity = (c) => updateFilters(c, status);
  const pickStatus = (s) => updateFilters(city, s);

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
    const updated = ppHashFilter(routeLocation.hash);
    setCity(updated.city);
    setStatus(updated.status);
    setType(updated.type);
    if (routeLocation.hash) {
      const timer = window.setTimeout(scrollToProjects, 60);
      return () => window.clearTimeout(timer);
    }
  }, [routeLocation.hash]);

  const onContact = () => {
    if (window.smoothTo) window.smoothTo("#contact");
  };

  return (
    <>
      <SEO title="Real Estate Projects in Indore, Kolkata & Bhopal | Ruchi Realty" description="Explore residential, commercial and plotted real estate projects by Ruchi Realty across Indore, Kolkata and Bhopal. Filter by city, ready to move, ongoing or upcoming." canonical="https://ruchirealty.com/projects" image="/assets/projects/one-victoria.webp" />
      <Nav onContact={onContact} solidAt={60} />
      <main>
        <header className="pp-hero" data-screen-label="All Projects">
          <div className="pp-hero__sig" aria-hidden="true"></div>
          <div className="rr-wrap">
            <Reveal>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Our Projects</div>
              <h1 className="pp-head">Real Estate Projects in Indore, Kolkata <span className="rr-grad">&amp; Bhopal</span></h1>
              <p className="pp-lead">
                Ruchi Realty was never just about building homes. It was always about creating better ways of living.
              </p>
              <p className="pp-lead pp-lead--keywords">Browse luxury apartments, residential plots and commercial spaces, from ready to move homes to upcoming launches.</p>
            </Reveal>
          </div>
        </header>

        <section className="pp-body section-pad" id="projects">
          <div className="rr-wrap">
            <Reveal>
              <div className="ptabs" role="tablist" aria-label="Filter projects by city">
                {PP_CITIES.map((c) => {
                  return (
                    <button key={c} role="tab" type="button" aria-selected={city === c}
                      className={`ptab ${city === c ? "is-active" : ""}`} aria-label={c === "All" ? "Show all projects" : `Filter projects by ${c}`} onClick={() => pickCity(c)}>
                      {c}
                    </button>
                  );
                })}
              </div>
              {city !== "All" ? <div className="pp-status" role="group" aria-label="Filter projects by status">
                {PP_STATUS.map((s) =>
                  <button key={s} type="button" className={`pp-chip ${status === s ? "is-active" : ""}`}
                    aria-pressed={status === s} onClick={() => pickStatus(s)}>
                    {s === "All" ? "Any status" : s}
                  </button>
                )}
              </div> : null}
            </Reveal>
            <div className="pgrid" key={`${city}-${status}`}>
              {list.map((p, i) =>
                <Reveal key={`${p.name}-${p.city}-${i}`} delay={(i % 3) * 70}>
                  <ProjectTile p={p} i={i} n={i} />
                </Reveal>
              )}
            </div>
            {list.length === 0 ?
              <p className="pp-empty">Nothing here yet - try a different city or status.</p> : null}
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
