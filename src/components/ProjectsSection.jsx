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
  const name = String(p?.name || p?.title || "").toLowerCase().trim();
  const city = String(p?.city || p?.location || "").toLowerCase();
  if (name === "active acres" && city.includes("kolkata")) {
    return "/projects/active-acres-angelica";
  }
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

function projectFallbackImage(p) {
  const url = projectUrl(p);
  const byUrl = PROJECTS.find((project) => projectUrl(project) === url && project.img);
  if (byUrl?.img) return byUrl.img;
  const name = String(p?.name || p?.title || "").toLowerCase().trim();
  const city = cityOf(p);
  return PROJECTS.find((project) => String(project.name || "").toLowerCase().trim() === name && cityOf(project) === city)?.img || "";
}

const PROJECT_CARD_DETAILS = {
  "/projects/one-victoria-new-town": { configuration: "3 & 4 BHK luxury apartments" },
  "/projects/one-prime-residential": { configuration: "2 & 3 BHK apartments" },
  "/projects/oscar-indore": { configuration: "Premium residential plots", sizeRange: "4,000–12,500 sq. ft." },
  "/projects/one-rajarhat": { configuration: "1, 2, 3 & 4 BHK apartments", sizeRange: "900–3,000 sq. ft." },
  "/projects/active-business-park": { configuration: "Offices, retail & commercial spaces", sizeRange: "652–33,000 sq. ft." },
  "/projects/active-greens": { configuration: "2 & 3 BHK apartments", sizeRange: "1,065–1,555 sq. ft." },
  "/projects/oscar-pride-indore": { configuration: "Residential plots", sizeRange: "1,250–3,200 sq. ft." },
  "/projects/saatvik-vihar-indore": { configuration: "Residential plots", sizeRange: "600–1,800 sq. ft." },
  "/projects/ruchi-lifescapes-indore-project": { configuration: "Villa plots", sizeRange: "1,400–10,000 sq. ft." },
  "/projects/saatvikgreen-indore": { configuration: "Residential & commercial plots", sizeRange: "850–3,500 sq. ft." },
  "/projects/anand-vihar-indore": { configuration: "Premium residential plots" },
  "/projects/lifescapes-bhopal": { configuration: "2.5 & 3 BHK, row houses & shops", sizeRange: "1,000–4,000 sq. ft." },
  "/projects/oscar-fort-indore": { configuration: "Limited-edition residential plots" },
  "/projects/oscar-palace": { configuration: "Premium residential plots", sizeRange: "3,500–20,000 sq. ft." },
};

function projectCardDetails(project) {
  const url = projectUrl(project);
  const configured = PROJECT_CARD_DETAILS[url] || {};
  const name = String(project.name || project.title || "").toLowerCase();
  if (url === "/projects/active-acres-angelica") {
    return name.includes("angelica")
      ? { configuration: "4 BHK luxury residences" }
      : { configuration: "2, 3 & 4 BHK apartments & penthouses" };
  }
  return {
    configuration: project.configuration || project.card_configuration || configured.configuration || (project.type === "Commercial" ? "Commercial spaces" : "Residential homes"),
    sizeRange: project.sizeRange || project.size_range || configured.sizeRange || "",
  };
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

function projectViewLabel(p) {
  const city = String(p.city || "").replace(", Madhya Pradesh", "");
  const category = p.type === "Commercial" ? "Commercial Office Space" : p.city?.includes("Bhopal") ? "Residential Project" : "Luxury Apartments";
  const specific = {
    "One Victoria": "Luxury Apartments",
    "Active Acres": "Luxury Flats",
    "Active Business Park": "Commercial Office Space",
    "Saatvik Vihar": "Residential Plots",
    "Oscar Fort": "Premium Township",
  }[p.name] || (p.name === "Ruchi Lifescapes" && !p.city?.includes("Bhopal") ? "Premium Plots" : category);
  return `View ${p.name}: ${specific} in ${city}`;
}

export function ProjectTile({ p, i, n }) {
  const cls = p.status === "Ready to Move" ? "status--ready"
    : p.status === "Ongoing" ? "status--ongoing" : "status--upcoming";
  const url = projectUrl(p);
  const isInternal = url && url.startsWith("/");
  const fallbackImg = projectFallbackImage(p);
  const hasBrightImage = String(p.name || "").toLowerCase().includes("oscar fort");
  const primaryImg = hasBrightImage ? "/projects/oscar-fort-indore/hero.webp" : p.img;
  const tileClass = hasBrightImage ? "ptile ptile--bright-image" : "ptile";
  const cardDetails = projectCardDetails(p);
  const detailsMarkup = <div className="ptile__facts">
    <span><small>Configuration</small><strong>{cardDetails.configuration}</strong></span>
    {cardDetails.sizeRange ? <span><small>Size range</small><strong>{cardDetails.sizeRange}</strong></span> : null}
  </div>;

  if (isInternal) {
    return (
      <Link className={tileClass} data-cursor="View" to={url}>
        <RImg src={primaryImg} fallbackSrc={fallbackImg} alt={`${p.name}, ${p.city}`} className="ptile__media" grade={!hasBrightImage} />
        <div className="ptile__scrim"></div>
        <div className="ptile__top">
          <span className={`status ${cls}`}><span className="dot"></span>{p.status}</span>
          <span className="ptile__typetag">{p.type}</span>
        </div>
        <div className="ptile__body">
          <div className="ptile__loc">{p.city}</div>
          <div className="ptile__name">{p.name}</div>
          {detailsMarkup}
          <span className="ptile__view" aria-label={projectViewLabel(p)}>View Details<CardArrow /></span>
        </div>
      </Link>
    );
  }

  const Tile = url ? "a" : "article";
  return (
    <Tile className={tileClass} data-cursor={url ? "View" : undefined} href={url || undefined}>
      <RImg src={primaryImg} fallbackSrc={fallbackImg} alt={`${p.name}, ${p.city}`} className="ptile__media" grade={!hasBrightImage} />
      <div className="ptile__scrim"></div>
      <div className="ptile__top">
        <span className={`status ${cls}`}><span className="dot"></span>{p.status}</span>
        <span className="ptile__typetag">{p.type}</span>
      </div>
      <div className="ptile__body">
        <div className="ptile__loc">{p.city}</div>
        <div className="ptile__name">{p.name}</div>
        {detailsMarkup}
        <span className="ptile__view" aria-label={projectViewLabel(p)}>View Details<CardArrow /></span>
      </div>
    </Tile>
  );
}

export function ProjectsSection() {
  const [city, setCity] = useState("All");
  const [page, setPage] = useState(0);
  const [items, setItems] = useState(() => PROJECTS);
  const [moving, setMoving] = useState(false);
  const [paused, setPaused] = useState(false);
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
  const changePage = (direction = 1) => {
    if (moving || pageCount < 2) return;
    setMoving(true);
    window.setTimeout(() => {
      setPage((current) => (current + direction + pageCount) % pageCount);
      setMoving(false);
    }, 360);
  };
  const changeCity = (selectedCity) => {
    setMoving(false);
    setCity(selectedCity);
    setPage(0);
  };
  useEffect(() => {
    if (paused || moving || pageCount < 2) return undefined;
    const timer = window.setTimeout(() => changePage(1), 3200);
    return () => window.clearTimeout(timer);
  }, [currentPage, pageCount, paused, moving, city]);
  return (
    <section className="projects section-pad" id="projects">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark">
            <div className="projects__intro">
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Explore our projects</div>
              <h2>Find the Right Project in<br /><span className="rr-grad">Your Preferred City</span></h2>
            </div>
            <p className="sec-head__lead">
              Browse luxury apartments, residential plots and commercial spaces in Kolkata, Indore and Bhopal. Filter by city to find the right next step.
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
        <div className="projects__carousel"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocusCapture={() => setPaused(true)}
          onBlurCapture={() => setPaused(false)}>
          <div className={`pgrid projects__page ${moving ? "projects__page--out" : "projects__page--in"}`}
            key={`${city}-${currentPage}`} aria-live="polite">
            {shown.map((p, i) =>
              <Reveal key={`${city}-${p.name}-${p.city}`} delay={i * 80}>
                <ProjectTile p={p} i={i} n={firstProject + i} />
              </Reveal>
            )}
          </div>
        </div>
        <div className="projects__actions">
          <div className="projects__controls" aria-label="Project carousel controls">
            <button className="projects__arrow" type="button" aria-label="Show previous projects" disabled={pageCount < 2 || moving} onClick={() => changePage(-1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M19 12H5m6-6-6 6 6 6" /></svg>
            </button>
            <span className="projects__page-count">{String(currentPage + 1).padStart(2, "0")} / {String(pageCount).padStart(2, "0")}</span>
            <button className="projects__arrow" type="button" aria-label="Show next projects" disabled={pageCount < 2 || moving} onClick={() => changePage(1)}>
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h14m-6-6 6 6-6 6" /></svg>
            </button>
          </div>
          <Reveal className="projects__more">
            <Link className="projects__allbtn" to="/projects">View All Projects<CardArrow /></Link>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
