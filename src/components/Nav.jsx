import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RImg } from "./shared";
import { BLOG, IMG_TOWER } from "../data/siteData";
import { PROJECTS } from "../data/projects";

const ROUTE_MAP = {
  "Projects.html": "/projects",
  "About.html": "/about",
  "Awards.html": "/awards",
  "Blog.html": "/blog",
  "Careers.html": "/careers",
  "Contact.html": "/contact",
  "Media.html": "/media",
  "index.html": "/",
};

const MEGA = (() => {
  const insightItems = BLOG.slice(0, 4).map((b) => [b.title, "Blog.html"]);
  const insightFeat = {
    kind: "blog",
    eyebrow: BLOG[0]?.cat || "Industry Insights",
    title: BLOG[0]?.title || "Industry insights",
    sub: "Read the piece →",
    href: "Blog.html",
  };
  return {
    Projects: {
      href: "Projects.html",
      projectNested: true,
      blurb: "Residential and commercial projects across three cities, each carried from drawing to handover.",
      cols: [
        { h: "By city", items: [
          ["Kolkata", "Projects.html#city=Kolkata"],
          ["Indore", "Projects.html#city=Indore"],
          ["Bhopal", "Projects.html#city=Bhopal"],
          ["All projects", "Projects.html"],
        ]},
      ],
      feat: {
        kind: "project", eyebrow: "Now unveiling", title: "One Victoria", sub: "New Town · Kolkata", href: "/projects/one-victoria-new-town",
        img: "/projects/one-victoria-new-town/hero.webp",
      },
      feats: [
        { kind: "project", eyebrow: "Discover", title: "Latest Updates", sub: "News from Ruchi Realty", href: "/media/press-releases", img: "/assets/media/gallery/bhaskar-event-1.webp" },
        { kind: "project", eyebrow: "What's on", title: "Latest Events", sub: "Explore recent moments", href: "/media/events-awards", img: "/assets/media/gallery/credai-event-2.webp" },
      ],
    },
    About: {
      href: "About.html",
      blurb: "Nearly four decades of treating a home as a promise, built with intent and held to long after the keys change hands.",
      cols: [
        { h: "The firm", items: [["Our approach", "About.html"], ["The proof, not the promise", "#why"], ["People & culture", "About.html#team"], ["Careers", "Careers.html"]] },
      ],
      feat: { kind: "statement", eyebrow: "Committed to you", title: "Thirty-eight years of keeping our word.", sub: "Read the story →", href: "About.html" },
    },
    Blogs: {
      href: "Blog.html",
      blurb: "Industry insights written plainly, covering materials, plans, and the relationships that begin at the keys.",
      cols: [
        { h: "Latest insights", items: insightItems },
      ],
      feat: insightFeat,
    },
    Media: {
      href: "Media.html",
      blurb: "Project galleries, official press updates, events, awards, and the milestone moments that shape the Ruchi Realty story.",
      cols: [
        { h: "Media", items: [["Gallery", "/media/gallery"], ["Press Releases", "/media/press-releases"], ["Events & Awards", "/media/events-awards"]] },
        { h: "Discover", items: [["Latest gallery", "/media/gallery"], ["Company updates", "/media/press-releases"], ["Recognitions", "/media/events-awards"]] },
      ],
      feat: { kind: "project", eyebrow: "Inside Ruchi Realty", title: "Media", sub: "Explore the collection →", href: "/media", img: "/assets/media/gallery/gallery-1.webp" },
    },
    Contact: {
      href: "Contact.html",
      blurb: "Tell us a little about what you're looking for. Someone who knows the projects, not a call centre, will write back.",
      cols: [
        { h: "Offices", items: [["Indore Office", "Contact.html#indore-office"], ["Kolkata Office", "Contact.html#kolkata-office"], ["Bhopal Office", "Contact.html#bhopal-office"]] },
        { h: "Reach us", items: [["+91 89292 25275", "tel:+918929225275"], ["ruchirealty.com", "#contact"], ["Indore · Kolkata · Bhopal", "#contact"]] },
      ],
      feat: { kind: "cta", eyebrow: "Get in touch", title: "Contact us", sub: "A real person, not a call centre.", href: "Contact.html#indore-office" },
    },
  };
})();

const MEGA_ORDER = ["Projects", "About", "Blogs", "Media", "Contact"];

function smoothTo(href) {
  const el = document.querySelector(href);
  if (el) {
    el.scrollIntoView({ behavior: "smooth" });
  } else if (window.__HOME_URL) {
    window.location.href = window.__HOME_URL + href;
  }
}

function MegaFeat({ feat, go }) {
  const f = feat;
  if (f.kind === "project") {
    const proj = PROJECTS.find((p) => p.name === f.title);
    const src = f.img || (proj && proj.img) || IMG_TOWER[0];
    return (
      <a className="mega-feat mega-feat--media" href={f.href} onClick={(e) => go(e, f.href)}>
        <RImg src={src} alt={f.title} className="mega-feat__img" grade />
        <div className="mega-feat__scrim"></div>
        <div className="mega-feat__body">
          <span className="mega-feat__eyebrow">{f.eyebrow}</span>
          <span className="mega-feat__title">{f.title}</span>
          <span className="mega-feat__sub">{f.sub}</span>
        </div>
      </a>
    );
  }
  if (f.kind === "blog") {
    return (
      <a className="mega-feat mega-feat--media" href={f.href} onClick={(e) => go(e, f.href)}>
        <RImg src={BLOG[0].img} alt={f.title} className="mega-feat__img" grade />
        <div className="mega-feat__scrim"></div>
        <div className="mega-feat__body">
          <span className="mega-feat__eyebrow">{f.eyebrow}</span>
          <span className="mega-feat__title">{f.title}</span>
          <span className="mega-feat__sub">{f.sub}</span>
        </div>
      </a>
    );
  }
  return (
    <a className="mega-feat mega-feat--brand" href={f.href} onClick={(e) => go(e, f.href)}>
      <div className="mega-feat__sig" aria-hidden="true"></div>
      <span className="mega-feat__eyebrow">{f.eyebrow}</span>
      <span className="mega-feat__title">{f.title}</span>
      <span className="mega-feat__sub mega-feat__sub--link">{f.sub}</span>
    </a>
  );
}

const PROJECT_CITIES = ["Kolkata", "Indore", "Bhopal"];
const PROJECT_STATUSES = ["Ready to Move", "Ongoing", "Upcoming"];

function projectFilterHref(city, status) {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  if (status) params.set("status", status);
  return `Projects.html#${params.toString()}`;
}

function ProjectCarouselFeature({ city, status, go }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredProjects = PROJECTS.filter((p) => {
    const cityMatch = !city || p.city.toLowerCase().includes(city.toLowerCase());
    const statusMatch = !status || p.status.toLowerCase() === status.toLowerCase();
    return cityMatch && statusMatch;
  });

  useEffect(() => {
    setCurrentIndex(0);
  }, [city, status]);

  if (!filteredProjects.length) {
    return (
      <div className="mega-project-feature mega-project-feature--empty">
        <p className="mega-project-empty">No projects match this selection.</p>
      </div>
    );
  }

  const VISIBLE_COUNT = 2;
  const total = filteredProjects.length;

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : Math.max(0, total - VISIBLE_COUNT)));
  };

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + VISIBLE_COUNT < total ? prev + 1 : 0));
  };

  const visibleProjects = filteredProjects.slice(currentIndex, currentIndex + VISIBLE_COUNT);

  return (
    <div className="mega-project-carousel">
      <div className="mega-project-carousel__header">
        <div className="mega-project-carousel__title">
          <span>{status ? `${status} in ` : ""}{city || "All Cities"}</span>
          <span className="mega-project-carousel__count">({total} project{total > 1 ? "s" : ""})</span>
        </div>
        {total > VISIBLE_COUNT && (
          <div className="mega-project-carousel__nav">
            <button
              type="button"
              className="mega-project-carousel__arrow"
              onClick={prevSlide}
              aria-label="Previous projects"
            >
              ‹
            </button>
            <span className="mega-project-carousel__page">
              {Math.floor(currentIndex / VISIBLE_COUNT) + 1} / {Math.ceil(total / VISIBLE_COUNT)}
            </span>
            <button
              type="button"
              className="mega-project-carousel__arrow"
              onClick={nextSlide}
              aria-label="Next projects"
            >
              ›
            </button>
          </div>
        )}
      </div>

      <div className="mega-project-carousel__grid">
        {visibleProjects.map((proj) => (
          <a
            key={proj.name}
            className="mega-project-card"
            href={proj.url || "Projects.html"}
            onClick={(e) => go(e, proj.url || "Projects.html")}
          >
            <div className="mega-project-card__img-wrap">
              <RImg src={proj.img || IMG_TOWER[0]} alt={proj.name} className="mega-project-card__img" grade />
              <span className={`mega-project-card__badge mega-project-card__badge--${proj.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                {proj.status}
              </span>
            </div>
            <div className="mega-project-card__body">
              <span className="mega-project-card__eyebrow">{proj.type || "Residential"}</span>
              <h4 className="mega-project-card__title">{proj.name}</h4>
              <span className="mega-project-card__loc">{proj.city}</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

function ProjectNestedMenu({ go, onFilterChange }) {
  const [activeCity, setActiveCity] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);

  const handleCityHover = (city) => {
    setActiveCity(city);
    onFilterChange(city, activeStatus);
  };

  const handleStatusHover = (status) => {
    setActiveStatus(status);
    onFilterChange(activeCity, status);
  };

  const handleMouseLeave = () => {
    setActiveCity(null);
    setActiveStatus(null);
    onFilterChange(null, null);
  };

  return (
    <div className="project-menu" onMouseLeave={handleMouseLeave}>
      <div className="mega-col__h">By City</div>
      <ul className="project-menu__cities" aria-label="Filter projects by city">
        {PROJECT_CITIES.map((city) => (
          <li
            className={`project-menu__city ${activeCity === city ? "is-active" : ""}`}
            key={city}
            onMouseEnter={() => handleCityHover(city)}
            onFocus={() => handleCityHover(city)}
          >
            <a href={projectFilterHref(city)} onClick={(e) => go(e, projectFilterHref(city))}>
              {city}<span aria-hidden="true">›</span>
            </a>
          </li>
        ))}
        <li className={!activeCity ? "is-active" : ""}>
          <a
            href="Projects.html"
            onMouseEnter={() => handleCityHover(null)}
            onClick={(e) => go(e, "Projects.html")}
          >
            All projects
          </a>
        </li>
      </ul>
      <div className={`project-menu__status-panel ${activeCity ? "is-visible" : ""}`} aria-live="polite">
        <div className="project-menu__label">By Status{activeCity ? ` · ${activeCity}` : ""}</div>
        {activeCity ? (
          <>
            <a
              className={!activeStatus ? "is-active" : ""}
              href={projectFilterHref(activeCity)}
              onMouseEnter={() => handleStatusHover(null)}
              onClick={(e) => go(e, projectFilterHref(activeCity))}
            >
              All statuses
            </a>
            {PROJECT_STATUSES.map((status) => (
              <a
                key={status}
                className={activeStatus === status ? "is-active" : ""}
                href={projectFilterHref(activeCity, status)}
                onMouseEnter={() => handleStatusHover(status)}
                onClick={(e) => go(e, projectFilterHref(activeCity, status))}
              >
                {status}
              </a>
            ))}
          </>
        ) : null}
      </div>
    </div>
  );
}

function ProjectMobileMenu({ go }) {
  return (
    <div className="mobile-project-menu">
      {PROJECT_CITIES.map((city) => (
        <details key={city}>
          <summary>{city}<span aria-hidden="true">+</span></summary>
          <div>
            <a href={projectFilterHref(city)} onClick={(e) => go(e, projectFilterHref(city))}>All statuses</a>
            {PROJECT_STATUSES.map((status) => (
              <a key={status} href={projectFilterHref(city, status)} onClick={(e) => go(e, projectFilterHref(city, status))}>{status}</a>
            ))}
          </div>
        </details>
      ))}
      <a className="mobile-project-menu__all" href="Projects.html" onClick={(e) => go(e, "Projects.html")}>All projects</a>
    </div>
  );
}

function MegaPanel({ cfg, go }) {
  const [filter, setFilter] = useState({ city: null, status: null });

  const handleFilterChange = (city, status) => {
    setFilter({ city, status });
  };

  const isFiltering = cfg.projectNested && (filter.city || filter.status);

  return (
    <div className={`mega__inner rr-wrap ${cfg.projectNested ? "mega__inner--projects" : ""}`}>
      <div className="mega__lead">
        <p className="mega__blurb">{cfg.blurb}</p>
        <a className="mega__all" href={cfg.href} onClick={(e) => go(e, cfg.href)}>
          View section<span className="ar">→</span>
        </a>
      </div>
      <div className="mega__cols">
        {cfg.projectNested ? (
          <ProjectNestedMenu go={go} onFilterChange={handleFilterChange} />
        ) : (
          cfg.cols.map((c) => (
            <div className="mega-col" key={c.h}>
              <div className="mega-col__h">{c.h}</div>
              <ul>
                {c.items.map(([label, href]) => (
                  <li key={label}><a href={href} onClick={(e) => go(e, href)}>{label}</a></li>
                ))}
              </ul>
            </div>
          ))
        )}
      </div>
      {isFiltering ? (
        <div className="mega-project-feature-pane">
          <ProjectCarouselFeature city={filter.city} status={filter.status} go={go} />
        </div>
      ) : cfg.feats ? (
        <div className="mega-feats">{cfg.feats.map((feat) => <MegaFeat key={feat.title} feat={feat} go={go} />)}</div>
      ) : (
        <MegaFeat feat={cfg.feat} go={go} />
      )}
    </div>
  );
}

export default function Nav({ onContact, hidden, solid: forceSolid = false, solidAt }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const mediaRoute = location.pathname.startsWith("/media");
    const threshold = mediaRoute ? 0 : (solidAt ?? (window.__NAV_SOLID_AT != null ? window.__NAV_SOLID_AT : window.innerHeight - 90));
    const onScroll = () => setSolid(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [solidAt, location.pathname]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    document.body.classList.toggle("nav-locked", mobile);
  }, [mobile]);

  const go = (e, href) => {
    setOpen(null);
    setMobile(false);
    if (!href) return;

    for (const [oldRoute, newRoute] of Object.entries(ROUTE_MAP)) {
      if (href === oldRoute) {
        if (e) e.preventDefault();
        navigate(newRoute);
        return;
      }
      if (href.startsWith(oldRoute + "#")) {
        if (e) e.preventDefault();
        const hash = href.slice(href.indexOf("#"));
        navigate(newRoute + hash);
        return;
      }
    }

    if (href.startsWith("#")) {
      if (e) e.preventDefault();
      if (href === "#contact") { if (onContact) onContact(); else navigate("/contact"); return; }
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (window.__HOME_URL) {
        window.location.href = window.__HOME_URL + href;
      }
      return;
    }
  };

  const routeNeedsSolidHeader = location.pathname.startsWith("/media/press-releases");
  const dark = !forceSolid && !routeNeedsSolidHeader && !solid && !open;

  const isActive = (label) => {
    const href = MEGA[label]?.href;
    if (!href) return false;
    if (href.startsWith("#")) return location.pathname === "/" && !open;
    const route = ROUTE_MAP[href];
    return route ? location.pathname === route && !open : false;
  };

  return (
    <header
      className={`nav ${dark ? "nav--top" : "nav--solid"} ${open ? "nav--mega" : ""} ${hidden ? "nav--hidden" : ""}`}
      onMouseLeave={() => setOpen(null)}>
      <div className="nav__bar">
        <a className="nav__brand" href="#top" onClick={(e) => go(e, "#top")} aria-label="Ruchi Realty home">
          <img className="nav__logo"
            src={dark ? "/assets/logo-h-white.png" : "/assets/logo-h.png"}
            alt="Ruchi Realty" />
        </a>
        <nav className="nav__links" aria-label="Primary">
          {MEGA_ORDER.map((label) => (
            <div className="nav__item" key={label} onMouseEnter={() => setOpen(label)}>
              <a className={`nav__link ${open === label ? "is-open" : ""} ${isActive(label) ? "is-active" : ""}`}
                href={MEGA[label].href} onClick={(e) => go(e, MEGA[label].href)}>
                {label}
                <svg className="nav__chev" width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          ))}
        </nav>
        <button className="nav__cta" onClick={() => navigate("/#contact")}>Book a Visit</button>
        <button className={`nav__burger ${mobile ? "is-open" : ""}`} onClick={() => setMobile((m) => !m)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className="mega" aria-hidden={!open}>
        {open ? <MegaPanel cfg={MEGA[open]} go={go} /> : null}
      </div>

      <div className={`mobile ${mobile ? "is-open" : ""}`}>
        <div className="mobile__inner">
          {MEGA_ORDER.map((label) => (
            <div className="mobile-group" key={label}>
              <a className="mobile-group__h" href={MEGA[label].href} onClick={(e) => go(e, MEGA[label].href)}>{label}</a>
              {label === "Projects" ? <ProjectMobileMenu go={go} /> : <div className="mobile-group__links">
                {MEGA[label].cols.flatMap((c) => c.items).slice(0, 5).map(([l, h]) => (
                  <a key={l} href={h} onClick={(e) => go(e, h)}>{l}</a>
                ))}
              </div>}
            </div>
          ))}
          <button className="mobile__cta" onClick={() => { setMobile(false); navigate("/#contact"); }}>Book a Visit</button>
        </div>
      </div>
    </header>
  );
}
