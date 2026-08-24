import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { RImg } from "./shared";
import { BLOG, IMG_TOWER } from "../data/siteData";
import { PROJECTS } from "../data/projects";

const ROUTE_MAP = {
  "Projects.html": "/projects",
  "About.html": "/about",
  "Awards.html": "/awards",
  "Blog.html": "/blogs",
  "Careers.html": "/careers",
  "Contact.html": "/contact",
  "Media.html": "/media",
  "index.html": "/",
};

function canonicalHref(href) {
  for (const [oldRoute, newRoute] of Object.entries(ROUTE_MAP)) {
    if (href === oldRoute) return newRoute;
    if (href.startsWith(oldRoute + "#")) return newRoute + href.slice(href.indexOf("#"));
  }
  return href;
}

const MEGA = (() => {
  const insightItems = BLOG.slice(0, 4).map((b) => [b.title, `/blogs/${b.slug}`]);
  const insightFeat = {
    kind: "blog",
    eyebrow: BLOG[0]?.cat || "Industry Insights",
    title: BLOG[0]?.title || "Industry insights",
    sub: "Read the piece",
    href: `/blogs/${BLOG[0]?.slug || ""}`,
  };
  return {
    Projects: {
      href: "Projects.html",
      projectNested: true,
      blurb: [
        "Explore thoughtfully planned homes, commercial spaces and plotted communities across Kolkata, Indore and Bhopal.",
        "Discover projects shaped around practical design, connected locations and lasting value.",
      ],
      cols: [
        { h: "By city", items: [
          ["Kolkata", "Projects.html#city=Kolkata"],
          ["Indore", "Projects.html#city=Indore"],
          ["Bhopal", "Projects.html#city=Bhopal"],
          ["All projects", "Projects.html"],
        ]},
      ],
      feat: {
        kind: "project", eyebrow: "Now unveiling", title: "One Victoria", sub: "New Town, Kolkata", href: "/projects/one-victoria-new-town",
        img: "/projects/one-victoria-new-town/hero.webp",
      },
      feats: [
        { kind: "project", eyebrow: "What's on", title: "Latest Events", sub: "Explore recent moments", href: "/media/events-awards", img: "/assets/media/gallery/credai-event-2.webp" },
        { kind: "project", eyebrow: "Stay informed", title: "Latest Updates", sub: "Read the latest news", href: "/media/press-releases", img: "/assets/media/gallery/bhaskar-event-1.webp" },
      ],
    },
    About: {
      href: "About.html",
      blurb: [
        "Learn about Ruchi Realty's journey in residential, commercial and plotted development since 2008.",
        "Meet the people and principles behind places built with clarity, quality and long term commitment.",
      ],
      cols: [
        { h: "Company", items: [["About Us", "About.html"], ["Our Team", "About.html#team"], ["Careers", "Careers.html"]] },
      ],
      feat: { kind: "project", eyebrow: "Committed to you", title: "Building with clarity and long term commitment.", sub: "Read the story", href: "About.html", img: "/assets/about-committed-to-you.webp" },
    },
    Blogs: {
      href: "/blogs",
      blurb: [
        "Explore clear, practical guidance on homebuying, property investment and changing real estate markets.",
        "Read useful perspectives that help you compare locations, plans, value and everyday livability.",
      ],
      cols: [
        { h: "Latest insights", items: insightItems },
      ],
      feat: insightFeat,
    },
    Media: {
      href: "/media",
      blurb: [
        "See project galleries, company news, events and recognitions from across Ruchi Realty.",
        "Follow the moments, milestones and updates shaping our work in every city.",
      ],
      cols: [
        { h: "Media", items: [["Gallery", "/media/gallery"], ["Press Releases", "/media/press-releases"], ["Events & Awards", "/media/events-awards"]] },
        { h: "Discover", items: [["Recognitions", "/media/events-awards"]] },
      ],
      feat: { kind: "project", eyebrow: "Inside Ruchi Realty", title: "Media", sub: "Explore the collection", href: "/media", img: "/assets/media/gallery/gallery-1.webp" },
    },
    Contact: {
      href: "Contact.html",
      contactLayout: true,
      blurb: [
        "Connect with our teams in Indore, Kolkata and Bhopal for project information and site visits.",
        "Share what you are looking for and the right team will help you take the next step.",
      ],
      cols: [
        { h: "Offices", items: [["Indore Office", "Contact.html#indore-office"], ["Kolkata Office", "Contact.html#kolkata-office"], ["Bhopal Office", "Contact.html#bhopal-office"]] },
      ],
      feat: { kind: "project", eyebrow: "Get in touch", title: "Contact our team", sub: "Project details, pricing and site visits", href: "Contact.html", img: "/assets/contact-us.webp" },
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
      <a className="mega-feat mega-feat--media" href={canonicalHref(f.href)} onClick={(e) => go(e, f.href)}>
        <RImg src={src} alt={f.title} className="mega-feat__img" grade priority />
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
      <a className="mega-feat mega-feat--media" href={canonicalHref(f.href)} onClick={(e) => go(e, f.href)}>
        <RImg src={BLOG[0].img} alt={f.title} className="mega-feat__img" grade priority />
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
    <a className="mega-feat mega-feat--brand" href={canonicalHref(f.href)} onClick={(e) => go(e, f.href)}>
      <div className="mega-feat__sig" aria-hidden="true"></div>
      <span className="mega-feat__eyebrow">{f.eyebrow}</span>
      <span className="mega-feat__title">{f.title}</span>
      <span className="mega-feat__sub mega-feat__sub--link">{f.sub}</span>
    </a>
  );
}

const PROJECT_CITIES = ["Kolkata", "Indore", "Bhopal"];

function projectFilterHref(city) {
  const params = new URLSearchParams();
  if (city) params.set("city", city);
  return `/projects#${params.toString()}`;
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

  const totalPages = Math.ceil(total / VISIBLE_COUNT);

  const prevSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => {
      const nextIdx = prev - VISIBLE_COUNT;
      return nextIdx >= 0 ? nextIdx : (totalPages - 1) * VISIBLE_COUNT;
    });
  };

  const nextSlide = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentIndex((prev) => {
      const nextIdx = prev + VISIBLE_COUNT;
      return nextIdx < total ? nextIdx : 0;
    });
  };

  const visibleProjects = filteredProjects.slice(currentIndex, currentIndex + VISIBLE_COUNT);

  return (
    <div className="mega-project-carousel">
      <div className="mega-project-carousel__header">
        <div className="mega-project-carousel__title">
          <span>{status ? `${status} in ` : ""}{city || "All Projects"}</span>
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
              &#8249;
            </button>
            <span className="mega-project-carousel__page">
              {Math.floor(currentIndex / VISIBLE_COUNT) + 1} / {totalPages}
            </span>
            <button
              type="button"
              className="mega-project-carousel__arrow"
              onClick={nextSlide}
              aria-label="Next projects"
            >
              &#8250;
            </button>
          </div>
        )}
      </div>

      <div className="mega-project-carousel__grid">
        {visibleProjects.map((proj, index) => (
          <a
            key={proj.name}
            className="mega-project-card"
            href={canonicalHref(proj.url || "Projects.html")}
            onClick={(e) => go(e, proj.url || "Projects.html")}
          >
            <div className="mega-project-card__img-wrap">
              <RImg src={proj.img || IMG_TOWER[0]} alt={proj.name} className="mega-project-card__img" grade priority />
              <span className={`mega-project-card__badge mega-project-card__badge--${proj.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                {proj.status}
              </span>
              <span className="mega-project-card__number" aria-label={`Project ${currentIndex + index + 1} of ${total}`}>
                {String(currentIndex + index + 1).padStart(2, "0")}
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

function ProjectNestedMenu({ go, activeCity, onCityHover, onAllProjectsHover }) {
  return (
    <div className="project-menu">
      <div className="mega-col__h">By City</div>
      <ul className="project-menu__cities" aria-label="Filter projects by city">
        {PROJECT_CITIES.map((city) => (
          <li
            className={`project-menu__city ${activeCity === city ? "is-active" : ""}`}
            key={city}
            onMouseEnter={() => onCityHover(city)}
            onFocus={() => onCityHover(city)}
          >
            <a href={projectFilterHref(city)} onClick={(event) => go(event, projectFilterHref(city))}>
              {city}
            </a>
          </li>
        ))}
        <li className={!activeCity ? "is-active" : ""}>
          <a
            href="/projects"
            onMouseEnter={onAllProjectsHover}
            onFocus={onAllProjectsHover}
            onClick={(e) => go(e, "Projects.html")}
          >
            All projects
          </a>
        </li>
      </ul>
    </div>
  );
}

function ContactMegaLinks({ cols, go }) {
  const offices = cols[0]?.items || [];
  return (
    <div className="contact-mega-links">
      <div className="contact-mega-offices">
        <div className="mega-col__h">Visit an office</div>
        <ul>
          {offices.map(([label, href]) => (
            <li key={label}>
              <a href={canonicalHref(href)} onClick={(e) => go(e, href)}>
                <span>{label}</span><span aria-hidden="true">&rarr;</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      <div className="contact-mega-reach">
        <div className="mega-col__h">Reach us directly</div>
        <a className="contact-mega-action" href="tel:+918929225275">
          <span className="contact-mega-action__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M7.1 3.5 9.6 7l-1.8 2.1a14.2 14.2 0 0 0 7.1 7.1l2.1-1.8 3.5 2.5-.8 3a2 2 0 0 1-2 1.5C9.4 20.5 3.5 14.6 2.6 6.3a2 2 0 0 1 1.5-2l3-.8Z"/></svg>
          </span>
          <span className="contact-mega-action__copy"><small>Call our sales team</small><strong>+91 89292 25275</strong></span>
          <span className="contact-mega-action__arrow" aria-hidden="true">&rarr;</span>
        </a>
        <a className="contact-mega-action" href="mailto:emarketing@ruchirealty.com">
          <span className="contact-mega-action__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24"><path d="M3.5 6.5h17v11h-17z"/><path d="m4 7 8 6 8-6"/></svg>
          </span>
          <span className="contact-mega-action__copy"><small>Email us</small><strong>emarketing@ruchirealty.com</strong></span>
          <span className="contact-mega-action__arrow" aria-hidden="true">&rarr;</span>
        </a>
        <a className="contact-mega-enquire" href="/contact" onClick={(e) => go(e, "/contact")}>
          Send an enquiry <span aria-hidden="true">&rarr;</span>
        </a>
      </div>
    </div>
  );
}

function ProjectMobileMenu({ go }) {
  return (
    <div className="mobile-project-menu">
      {PROJECT_CITIES.map((city) => (
        <a className="mobile-project-menu__city" key={city} href={projectFilterHref(city)} onClick={(event) => go(event, projectFilterHref(city))}>{city}</a>
      ))}
      <a className="mobile-project-menu__all" href="/projects" onClick={(e) => go(e, "Projects.html")}>All projects</a>
    </div>
  );
}

function MegaPanel({ cfg, go }) {
  const [activeCity, setActiveCity] = useState(null);
  const [activeStatus, setActiveStatus] = useState(null);
  const [showProjectCards, setShowProjectCards] = useState(false);

  const handleCityHover = (city) => {
    setActiveCity(city);
    setActiveStatus(null);
    setShowProjectCards(true);
  };

  const handleStatusHover = (status) => {
    setActiveStatus(status);
  };

  const handleAllProjectsHover = () => {
    setActiveCity(null);
    setActiveStatus(null);
    setShowProjectCards(true);
  };

  const handleDefaultPreview = () => {
    setActiveCity(null);
    setActiveStatus(null);
    setShowProjectCards(false);
  };

  return (
    <div className={`mega__inner rr-wrap ${cfg.projectNested ? "mega__inner--projects" : ""} ${cfg === MEGA.About ? "mega__inner--about" : ""} ${cfg.contactLayout ? "mega__inner--contact" : ""}`}>
      <div className="mega__lead" onMouseEnter={handleDefaultPreview}>
        <div className="mega__blurbs">
          {(Array.isArray(cfg.blurb) ? cfg.blurb : [cfg.blurb]).map((paragraph, index) => (
            <p className="mega__blurb" key={`${cfg.href}-blurb-${index}`}>{paragraph}</p>
          ))}
        </div>
        <a className="mega__all" href={canonicalHref(cfg.href)} onClick={(e) => go(e, cfg.href)}>
          View section<span className="ar">&rarr;</span>
        </a>
      </div>
      <div className="mega__cols">
        {cfg.projectNested ? (
          <ProjectNestedMenu
            go={go}
            activeCity={activeCity}
            activeStatus={activeStatus}
            onCityHover={handleCityHover}
            onStatusHover={handleStatusHover}
            onAllProjectsHover={handleAllProjectsHover}
          />
        ) : cfg.contactLayout ? (
          <ContactMegaLinks cols={cfg.cols} go={go} />
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
      {cfg.projectNested ? (
        <div className="mega-project-feature-pane">
          {showProjectCards ? <ProjectCarouselFeature city={activeCity} status={activeStatus} go={go} /> : <div className="mega-feats">{cfg.feats.map((feat) => <MegaFeat key={feat.title} feat={feat} go={go} />)}</div>}
        </div>
      ) : cfg.feats ? (
        <div className="mega-feats">{cfg.feats.map((feat) => <MegaFeat key={feat.title} feat={feat} go={go} />)}</div>
      ) : (
        <MegaFeat feat={cfg.feat} go={go} />
      )}
    </div>
  );
}

export default function Nav({ onContact, hidden, solid: forceSolid = false, solidAt, heroSound = false }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const closeTimer = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const cancelMenuClose = () => {
    if (closeTimer.current) window.clearTimeout(closeTimer.current);
    closeTimer.current = null;
  };

  const scheduleMenuClose = () => {
    cancelMenuClose();
    closeTimer.current = window.setTimeout(() => {
      setOpen(null);
      closeTimer.current = null;
    }, 140);
  };

  useEffect(() => () => cancelMenuClose(), []);

  useEffect(() => {
    const mediaRoute = location.pathname.startsWith("/media");
    const blogRoute = location.pathname.startsWith("/blogs");
    const mobileViewport = window.matchMedia("(max-width: 900px)").matches;
    const threshold = mobileViewport || mediaRoute ? 24 : (blogRoute ? 24 : (solidAt ?? (window.__NAV_SOLID_AT != null ? window.__NAV_SOLID_AT : window.innerHeight - 90)));
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
    cancelMenuClose();
    setOpen(null);
    setMobile(false);
    if (!href) return;
    href = canonicalHref(href);

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

    if (href.startsWith("/")) {
      if (e) e.preventDefault();
      navigate(href);
      return;
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
  const topContext = !forceSolid && !routeNeedsSolidHeader && !solid;
  const dark = topContext && !open;

  const isActive = (label) => {
    const href = MEGA[label]?.href;
    if (!href) return false;
    if (href.startsWith("#")) return location.pathname === "/" && !open;
    const route = ROUTE_MAP[href];
    return route ? location.pathname === route && !open : false;
  };

  return (
    <header
      className={`nav ${dark ? "nav--top" : "nav--solid"} ${topContext ? "nav--top-context" : ""} ${open ? "nav--mega" : ""} ${hidden ? "nav--hidden" : ""}`}
      onMouseEnter={cancelMenuClose}
      onMouseLeave={scheduleMenuClose}>
      <div className="nav__bar">
        <a className="nav__brand" href="#top" onClick={(e) => go(e, "#top")} aria-label="Ruchi Realty home">
          <img className="nav__logo"
            src={dark ? "/assets/logo-h-white.webp" : "/assets/logo-h.webp"}
            alt="Ruchi Realty" loading="eager" decoding="async" />
        </a>
        <nav className="nav__links" aria-label="Primary">
          <div className="nav__item" onMouseEnter={scheduleMenuClose}>
            <a
              className={`nav__link ${location.pathname === "/" && !open ? "is-active" : ""}`}
              href="/"
              onClick={(e) => go(e, "/")}>
              Home
            </a>
          </div>
          {MEGA_ORDER.map((label) => (
            <div className="nav__item" key={label} onMouseEnter={() => { cancelMenuClose(); setOpen(label); }}>
              <a className={`nav__link ${open === label ? "is-open" : ""} ${isActive(label) ? "is-active" : ""}`}
                href={canonicalHref(MEGA[label].href)} onClick={(e) => go(e, MEGA[label].href)}>
                {label}
                <svg className="nav__chev" width="9" height="9" viewBox="0 0 10 10" aria-hidden="true">
                  <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>
          ))}
        </nav>
        <div className="nav__actions">
          {heroSound ? <div className="nav__sound-slot" data-hero-sound-slot /> : null}
          <button className="nav__cta" onClick={() => navigate("/#contact")}>Schedule a Site Visit</button>
        </div>
        <button className={`nav__burger ${mobile ? "is-open" : ""}`} onClick={() => setMobile((m) => !m)} aria-label="Menu">
          <span></span><span></span><span></span>
        </button>
      </div>

      <div className="mega" aria-hidden={!open}>
        {open ? <MegaPanel cfg={MEGA[open]} go={go} /> : null}
      </div>

      <div className={`mobile ${mobile ? "is-open" : ""}`}>
        <div className="mobile__inner">
          <div className="mobile-group">
            <a className="mobile-group__h" href="/" onClick={(e) => go(e, "/")}>Home</a>
          </div>
          {MEGA_ORDER.map((label) => (
            <div className="mobile-group" key={label}>
              <a className="mobile-group__h" href={canonicalHref(MEGA[label].href)} onClick={(e) => go(e, MEGA[label].href)}>{label}</a>
              {label === "Projects" ? <ProjectMobileMenu go={go} /> : <div className="mobile-group__links">
                {MEGA[label].cols.flatMap((c) => c.items).slice(0, 5).map(([l, h]) => (
                  <a key={l} href={canonicalHref(h)} onClick={(e) => go(e, h)}>{l}</a>
                ))}
              </div>}
            </div>
          ))}
          <button className="mobile__cta" onClick={() => { setMobile(false); navigate("/#contact"); }}>Schedule a Site Visit</button>
        </div>
      </div>
    </header>
  );
}
