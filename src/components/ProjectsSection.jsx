import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal, RImg } from "./shared";
import { PROJECTS } from "../data/projects";

const PROJECT_CITIES = ["All", "Kolkata", "Indore", "Bhopal"];
const PROJECTS_PER_PAGE = 3;

export function cityOf(p) {
  const c = p.city || "";
  if (c.includes("Kolkata")) return "Kolkata";
  if (c.includes("Indore")) return "Indore";
  if (c.includes("Bhopal")) return "Bhopal";
  return "Other";
}

function projectUrl(p) {
  const name = String(p?.name || p?.title || "").toLowerCase();
  const city = String(p?.city || p?.location || "").toLowerCase();
  if (name.includes("one victoria") && city.includes("kolkata")) {
    return "/projects/one-victoria-new-town";
  }
  if (name.includes("ruchi lifescapes") && city.includes("bhopal")) {
    return "/projects/lifescapes-bhopal";
  }
  if (name.includes("ruchi lifescapes") && city.includes("indore")) {
    return "/projects/ruchi-lifescapes-indore-project";
  }
  if (name.includes("anand vihar") && city.includes("indore")) {
    return "/projects/anand-vihar-indore";
  }
  if (name.includes("saatvik green") && city.includes("indore")) {
    return "/projects/saatvikgreen-indore";
  }
  if (name.includes("saatvik vihar") && city.includes("indore")) {
    return "/projects/saatvik-vihar-indore";
  }
  if (name.includes("ruchi enclave") && city.includes("indore")) {
    return "/projects/ruchi-enclave-indore";
  }
  if (name.includes("oscar sanctuary") && city.includes("indore")) {
    return "/projects/oscar-sanctuary-indore";
  }
  if (name.includes("oscar fort") && city.includes("indore")) {
    return "/projects/oscar-fort-indore";
  }
  if (name.includes("oscar pride") && city.includes("indore")) return "/projects/oscar-pride-indore";
  if (name.includes("oscar palace") && city.includes("indore")) return "/projects/oscar-palace";
  return p?.url || "";
}

export function prioritizeOnePrime(items = []) {
  return items;
}

function orderValue(value) {
  return value === null || value === undefined || value === "" || Number.isNaN(Number(value)) ? 9999 : Number(value);
}

function orderFeaturedProjects(items = []) {
  return [...items].sort((a, b) => {
    const featureDiff = orderValue(a.feature_order) - orderValue(b.feature_order);
    if (featureDiff !== 0) return featureDiff;
    const sortDiff = orderValue(a.sort_order) - orderValue(b.sort_order);
    if (sortDiff !== 0) return sortDiff;
    return String(a.name || a.title || "").localeCompare(String(b.name || b.title || ""));
  });
}

export function CardArrow() {
  return (
    <svg className="ptile__arrow" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: 8, verticalAlign: "-3px" }}>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </svg>
  );
}

export function ProjectTile({ p, i, n }) {
  const cls = p.status === "Ready to Move" ? "status--ready"
    : p.status === "Ongoing" ? "status--ongoing" : "status--upcoming";
  const url = projectUrl(p);
  const isInternal = url && url.startsWith("/");

  if (isInternal) {
    return (
      <Link className="ptile" data-cursor="View" to={url}>
        <RImg src={p.img} alt={`${p.name}, ${p.city}`} className="ptile__media" grade />
        <div className="ptile__scrim"></div>
        <div className="ptile__top">
          <span className={`status ${cls}`}><span className="dot"></span>{p.status}</span>
          <span className="ptile__typetag">{p.type}</span>
        </div>
        <div className="ptile__body">
          <div className="ptile__loc">{p.city}</div>
          <div className="ptile__name">{p.name}</div>
          <span className="ptile__view">View project<CardArrow /></span>
        </div>
      </Link>
    );
  }

  const Tile = url ? "a" : "article";
  return (
    <Tile className="ptile" data-cursor={url ? "View" : undefined} href={url || undefined}>
      <RImg src={p.img} alt={`${p.name}, ${p.city}`} className="ptile__media" grade />
      <div className="ptile__scrim"></div>
      <div className="ptile__top">
        <span className={`status ${cls}`}><span className="dot"></span>{p.status}</span>
        <span className="ptile__typetag">{p.type}</span>
      </div>
      <div className="ptile__body">
        <div className="ptile__loc">{p.city}</div>
        <div className="ptile__name">{p.name}</div>
        <span className="ptile__view">View project<CardArrow /></span>
      </div>
    </Tile>
  );
}

export function ProjectsSection() {
  const [city, setCity] = useState("All");
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(() => PROJECTS);
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
  const filterPool = (selectedCity) => pool.filter((p) => selectedCity === "All" || cityOf(p) === selectedCity);
  const filteredProjects = orderFeaturedProjects(filterPool(city));
  const pageCount = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const currentPage = Math.min(page, pageCount - 1);
  const firstProject = currentPage * PROJECTS_PER_PAGE;
  const shown = filteredProjects.slice(firstProject, firstProject + PROJECTS_PER_PAGE);
  const changeCity = (selectedCity) => { setCity(selectedCity); setPage(0); };
  return (
    <section className="projects section-pad" id="projects">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark">
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Our Projects</div>
              <h2>Addresses we build,<br /><span className="rr-grad">and then stand by.</span></h2>
            </div>
            <p className="sec-head__lead">
              Residential and commercial projects across Kolkata, Indore, and Bhopal, each carried from drawing to handover with the same care.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="ptabs" role="tablist" aria-label="Filter projects by city">
            {PROJECT_CITIES.map((c) => {
              return (
                <button key={c} role="tab" type="button" aria-selected={city === c}
                  className={`ptab ${city === c ? "is-active" : ""}`} onClick={() => changeCity(c)}>
                  {c}
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
      <div className="projects__sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <div className="projects__carousel">
          <div className="pgrid" key={`${city}-${currentPage}`} aria-live="polite">
            {shown.map((p, i) =>
              <Reveal key={`${city}-${p.name}-${p.city}`} delay={i * 80}>
                <ProjectTile p={p} i={i} n={firstProject + i} />
              </Reveal>
            )}
          </div>
        </div>
        <div className="projects__controls" aria-label="Project carousel controls">
          <button className="projects__arrow" type="button" aria-label="Show previous projects" disabled={currentPage === 0} onClick={() => setPage((v) => Math.max(0, v - 1))}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
          </button>
          <button className="projects__arrow" type="button" aria-label="Show next projects" disabled={currentPage >= pageCount - 1} onClick={() => setPage((v) => Math.min(pageCount - 1, v + 1))}>
            <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
          </button>
        </div>
        <Reveal className="projects__more">
          <Link className="projects__allbtn" to="/projects">View All Projects<CardArrow /></Link>
        </Reveal>
      </div>
    </section>
  );
}
