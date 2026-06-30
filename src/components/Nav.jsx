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
      href: "#projects",
      blurb: "Residences, commercial space, and townships across three cities — each carried from drawing to handover.",
      cols: [
        { h: "By city", items: [
          ["Kolkata", "Projects.html#city=Kolkata"],
          ["Indore", "Projects.html#city=Indore"],
          ["Bhopal", "Projects.html#city=Bhopal"],
          ["All projects", "Projects.html"],
        ]},
        { h: "By status", items: [
          ["Ready to Move", "Projects.html#status=Ready+to+Move"],
          ["Ongoing", "Projects.html#status=Ongoing"],
          ["Upcoming", "Projects.html#status=Upcoming"],
          ["Townships", "Projects.html#type=Township"],
        ]},
      ],
      feat: {
        kind: "project", eyebrow: "Now unveiling", title: "One Victoria", sub: "New Town · Kolkata", href: "#projects",
        img: "https://ruchirealty.com/wp-content/uploads/elementor/thumbs/VIEW_004_ELEVATION_VIEW_DAY_LIGHT_2024.01.18_HIRES-r0uodbh7ro4cp8vdge1k5i90cm98yiqhxmm5z0edmw.png",
      },
    },
    About: {
      href: "About.html",
      blurb: "Nearly four decades of treating a home as a promise — built with intent, held to long after the keys change hands.",
      cols: [
        { h: "The firm", items: [["Our approach", "About.html"], ["The proof, not the promise", "#why"], ["People & culture", "About.html#team"], ["Careers", "Careers.html"]] },
        { h: "Recognition", items: [["Awards", "Awards.html"], ["Press & media", "#press"]] },
      ],
      feat: { kind: "statement", eyebrow: "Committed to you", title: "Thirty-eight years of keeping our word.", sub: "Read the story →", href: "About.html" },
    },
    Insights: {
      href: "Blog.html",
      blurb: "Industry insights, written plainly — materials, plans, and the relationships that begin at the keys.",
      cols: [
        { h: "Latest insights", items: insightItems },
        { h: "Topics", items: [["On building", "Blog.html"], ["Materials", "Blog.html"], ["After handover", "Blog.html"]] },
      ],
      feat: insightFeat,
    },
    Contact: {
      href: "#contact",
      blurb: "Tell us a little about what you're looking for. Someone who knows the projects — not a call centre — will write back.",
      cols: [
        { h: "Visit", items: [["Experience Centre", "#contact"], ["Private viewings", "#contact"], ["Enquiries", "#contact"]] },
        { h: "Reach us", items: [["+91 892 922 5275", "#contact"], ["ruchirealty.com", "#contact"], ["Tangra · Kolkata 700015", "#contact"]] },
      ],
      feat: { kind: "cta", eyebrow: "Come and see", title: "Book a visit", sub: "A real person, not a call centre.", href: "#contact" },
    },
  };
})();

const MEGA_ORDER = ["Projects", "About", "Insights", "Contact"];

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

function MegaPanel({ cfg, go }) {
  return (
    <div className="mega__inner rr-wrap">
      <div className="mega__lead">
        <p className="mega__blurb">{cfg.blurb}</p>
        <a className="mega__all" href={cfg.href} onClick={(e) => go(e, cfg.href)}>
          View section<span className="ar">→</span>
        </a>
      </div>
      <div className="mega__cols">
        {cfg.cols.map((c) => (
          <div className="mega-col" key={c.h}>
            <div className="mega-col__h">{c.h}</div>
            <ul>
              {c.items.map(([label, href]) => (
                <li key={label}><a href={href} onClick={(e) => go(e, href)}>{label}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <MegaFeat feat={cfg.feat} go={go} />
    </div>
  );
}

export default function Nav({ onContact, hidden }) {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(null);
  const [mobile, setMobile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > (window.__NAV_SOLID_AT != null ? window.__NAV_SOLID_AT : window.innerHeight - 90));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
      if (href === "#contact") { onContact(); return; }
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else if (window.__HOME_URL) {
        window.location.href = window.__HOME_URL + href;
      }
      return;
    }
  };

  const dark = !solid && !open;

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
        <a className="nav__brand" href="#top" onClick={(e) => go(e, "#top")} aria-label="Ruchi Realty — home">
          <img className="nav__logo"
            src={dark ? "assets/logo-h-white.png" : "assets/logo-h.png"}
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
        <button className="nav__cta" onClick={onContact}>Book a Visit<span className="ar">→</span></button>
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
              <div className="mobile-group__links">
                {MEGA[label].cols.flatMap((c) => c.items).slice(0, 5).map(([l, h]) => (
                  <a key={l} href={h} onClick={(e) => go(e, h)}>{l}</a>
                ))}
              </div>
            </div>
          ))}
          <button className="mobile__cta" onClick={() => { setMobile(false); onContact(); }}>Book a Visit<span className="ar">→</span></button>
        </div>
      </div>
    </header>
  );
}
