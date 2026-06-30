import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal, RImg } from "./shared";
import { PROJECTS } from "../data/projects";

const PROJECT_CITIES = ["All", "Kolkata", "Indore", "Bhopal"];
const PROJECT_STATUSES = ["All", "Ready to Move", "Ongoing", "Upcoming"];

export function cityOf(p) {
  const c = p.city || "";
  if (c.includes("Kolkata")) return "Kolkata";
  if (c.includes("Indore")) return "Indore";
  if (c.includes("Bhopal")) return "Bhopal";
  return "Other";
}

function statusCls(s) {
  return s === "Ready to Move" ? "status--ready" : s === "Ongoing" ? "status--ongoing" : "status--upcoming";
}

export function ProjectTile({ p, i, n }) {
  const cls = p.status === "Ready to Move" ? "status--ready"
    : p.status === "Ongoing" ? "status--ongoing" : "status--upcoming";
  const idx = String((n % 20) + 1).padStart(2, "0");
  const Tile = p.url ? "a" : "article";
  return (
    <Tile className="ptile" data-cursor={p.url ? "View" : undefined} href={p.url || undefined}>
      <RImg src={p.img} alt={`${p.name}, ${p.city}`} className="ptile__media" grade />
      <div className="ptile__scrim"></div>
      <div className="ptile__idx">{idx}</div>
      <div className="ptile__top">
        <span className={`status ${cls}`}><span className="dot"></span>{p.status}</span>
        <span className="ptile__typetag">{p.type}</span>
      </div>
      <div className="ptile__body">
        <div className="ptile__loc">{p.city}</div>
        <div className="ptile__name">{p.name}</div>
        <span className="ptile__view">View project<span className="ar">→</span></span>
      </div>
    </Tile>
  );
}

export function ProjectsSection() {
  const [city, setCity] = useState("All");
  const [status, setStatus] = useState("All");
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
  const filterPool = (selCity, selStatus) =>
    pool.filter((p) =>
      (selCity === "All" || cityOf(p) === selCity) &&
      (selStatus === "All" || p.status === selStatus)
    );
  const shown = filterPool(city, status).slice(0, 3);
  const filteredCount = filterPool(city, "All").length;
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
              Residences, commercial space, and townships across Kolkata, Indore, and Bhopal — each one carried from drawing to handover with the same care.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80}>
          <div className="ptabs" role="tablist" aria-label="Filter projects by city">
            {PROJECT_CITIES.map((c) => {
              const n = filterPool(c, "All").length;
              return (
                <button key={c} role="tab" type="button" aria-selected={city === c}
                  className={`ptab ${city === c ? "is-active" : ""}`} onClick={() => setCity(c)}>
                  {c}<span className="ptab__count">{n}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <div className="ptabs ptabs--status" role="group" aria-label="Filter projects by status">
            {PROJECT_STATUSES.map((s) => {
              const n = filterPool(city, s).length;
              const cls = s === "All" ? "" : statusCls(s);
              return (
                <button key={s} type="button" aria-pressed={status === s}
                  className={`ptab ${status === s ? "is-active" : ""}`} onClick={() => setStatus(s)}>
                  {s === "All" ? null : <span className={`dot ${cls}`}></span>}
                  {s === "All" ? "All" : s}<span className="ptab__count">{n}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
      <div className="projects__sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <div className="pgrid" key={`${city}-${status}`}>
          {shown.map((p, i) =>
            <Reveal key={`${city}-${status}-${p.name}-${p.city}`} delay={i * 80}>
              <ProjectTile p={p} i={i} n={i} />
            </Reveal>
          )}
        </div>
        <div className="projects__legend">
          <span className="projects__hint">
            Showing {shown.length} of {filteredCount} {filteredCount === 1 ? "address" : "addresses"}{city === "All" ? "" : ` in ${city}`}
          </span>
        </div>
        <Reveal className="projects__more">
          <Link className="projects__allbtn" to="/projects">View All Projects<span className="ar">→</span></Link>
        </Reveal>
      </div>
    </section>
  );
}
