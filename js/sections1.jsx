/* ============================================================
   Sections 1 — Nav · Hero · Intro · Projects (v2 redesign)
   ============================================================ */
const { useState: uS1, useEffect: uE1, useRef: uR1 } = React;

const HERO_VIDEO = window.__rsrc("heroVideo", "https://ruchirealty.com/wp-content/uploads/2023/12/video_ruchi_1-1.mp4");

/* ---- Mega-menu content map ---- */
const MEGA = {
  Projects: {
    href: "#projects",
    blurb: "Residences, commercial space, and townships across three cities — each carried from drawing to handover.",
    cols: [
      { h: "By city", items: [
        ["Kolkata", "Projects.html#city=Kolkata"],
        ["Indore", "Projects.html#city=Indore"],
        ["Bhopal", "Projects.html#city=Bhopal"],
        ["All projects", "Projects.html"]] },
      { h: "By status", items: [
        ["Ready to Move", "Projects.html#status=Ready+to+Move"],
        ["Ongoing", "Projects.html#status=Ongoing"],
        ["Upcoming", "Projects.html#status=Upcoming"],
        ["Townships", "Projects.html#type=Township"]] },
    ],
    feat: { kind: "project", eyebrow: "Now unveiling", title: "One Victoria", sub: "New Town · Kolkata", href: "#projects",
      img: "https://ruchirealty.com/wp-content/uploads/elementor/thumbs/VIEW_004_ELEVATION_VIEW_DAY_LIGHT_2024.01.18_HIRES-r0uodbh7ro4cp8vdge1k5i90cm98yiqhxmm5z0edmw.png" },
  },
  About: {
    href: "About.html",
    blurb: "Nearly four decades of treating a home as a promise — built with intent, held to long after the keys change hands.",
    cols: [
      { h: "The firm", items: [["Our approach", "About.html"], ["The proof, not the promise", "#why"], ["People & culture", "About.html#team"], ["Careers", "Careers.html"]] },
      { h: "Recognition", items: [["Awards & events", "Awards.html"], ["Press & media", "#press"]] },
    ],
    feat: { kind: "statement", eyebrow: "Committed to you", title: "Thirty-eight years of keeping our word.", sub: "Read the story →", href: "About.html" },
  },
  Insights: {
    href: "Blog.html",
    blurb: "Industry insights, written plainly — materials, plans, and the relationships that begin at the keys.",
    cols: [
      { h: "Latest insights", items: (window.BLOG || []).slice(0, 4).map((b) => [b.title, "Blog.html"]) },
      { h: "Topics", items: [["On building", "Blog.html"], ["Materials", "Blog.html"], ["After handover", "Blog.html"]] },
    ],
    feat: { kind: "blog", eyebrow: (window.BLOG && BLOG[0].cat) || "Industry Insights", title: (window.BLOG && BLOG[0].title) || "Industry insights", sub: "Read the piece →", href: "Blog.html" },
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
const MEGA_ORDER = ["Projects", "About", "Insights", "Contact"];

function smoothTo(href) {
  const el = document.querySelector(href);
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: "smooth" });
  else if (window.__HOME_URL) window.location.href = window.__HOME_URL + href;
}

/* ---- Featured block inside a mega panel ---- */
function MegaFeat({ feat, go }) {
  const f = feat;
  if (f.kind === "project") {
    // Use the real project render from the data layer, matched by name.
    const proj = (window.PROJECTS || []).find((p) => p.name === f.title);
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
  // statement / cta — gradient monogram panel
  return (
    <a className="mega-feat mega-feat--brand" href={f.href} onClick={(e) => go(e, f.href)}>
      <div className="mega-feat__sig" aria-hidden="true"></div>
      <span className="mega-feat__eyebrow">{f.eyebrow}</span>
      <span className="mega-feat__title">{f.title}</span>
      <span className="mega-feat__sub mega-feat__sub--link">{f.sub}</span>
    </a>
  );
}

/* ---- Mega panel ---- */
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

/* ---- Nav (mega menu) ---- */
function Nav({ onContact }) {
  const [solid, setSolid] = uS1(false);
  const [open, setOpen] = uS1(null);
  const [mobile, setMobile] = uS1(false);
  uE1(() => {
    const onScroll = () => setSolid(window.scrollY > (window.__NAV_SOLID_AT != null ? window.__NAV_SOLID_AT : window.innerHeight - 90));
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  uE1(() => {
    const onKey = (e) => { if (e.key === "Escape") { setOpen(null); setMobile(false); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  uE1(() => { document.body.classList.toggle("nav-locked", mobile); }, [mobile]);

  const go = (e, href) => {
    setOpen(null); setMobile(false);
    if (href && !href.startsWith("#")) return; // real page link — let the browser navigate
    if (e) e.preventDefault();
    if (href === "#contact") { onContact(); return; }
    smoothTo(href);
  };
  const dark = !solid && !open;

  return (
    <header
      className={`nav ${dark ? "nav--top" : "nav--solid"} ${open ? "nav--mega" : ""}`}
      onMouseLeave={() => setOpen(null)}>
      <div className="nav__bar">
        <a className="nav__brand" href="#top" onClick={(e) => go(e, "#top")} aria-label="Ruchi Realty — home">
          <img className="nav__logo"
            src={dark ? window.__rsrc("logoHW", "assets/logo-h-white.png") : window.__rsrc("logoH", "assets/logo-h.png")}
            alt="Ruchi Realty" />
        </a>
        <nav className="nav__links" aria-label="Primary">
          {MEGA_ORDER.map((label) => (
            <div className="nav__item" key={label} onMouseEnter={() => setOpen(label)}>
              <a className={`nav__link ${open === label ? "is-open" : ""}`}
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

/* ---- Hero (video + monogram graphic device) ---- */
function Hero() {
  const vid = uR1(null);
  uE1(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (vid.current && y < window.innerHeight) {
          const scale = 1 + Math.min(y / window.innerHeight, 1) * 0.14;
          vid.current.style.transform = `scale(${scale.toFixed(4)})`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section className="hero" id="top">
      <video ref={vid} className="hero__video" src={HERO_VIDEO}
        autoPlay muted loop playsInline preload="auto" aria-label="Ruchi Realty showreel" />
      <div className="hero__scrim"></div>
      <div className="hero__mono" aria-hidden="true"></div>
      <a className="hero__scroll" href="#intro"
         onClick={(e) => { e.preventDefault(); document.querySelector("#intro").scrollIntoView({ behavior: "smooth" }); }}
         aria-label="Scroll to explore">
        <div className="dot-track"></div>
        <span>Scroll</span>
      </a>
    </section>
  );
}

/* ---- Intro / brand statement band ---- */
function Intro() {
  return (
    <section className="intro section-pad" id="intro">
      <div className="intro__sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <Reveal>
          <div className="intro__eyebrow eyebrow sec-eyebrow">Committed to You</div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="intro__head">
            We don't just build homes.<br />
            <span className="intro__grad">We stand by them.</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="intro__sub">
            For nearly four decades, across Kolkata, Indore, and Bhopal, we have treated the home as a promise — built with intent, handed over with care, and held to long after the keys change hands.
          </p>
        </Reveal>
      </div>
    </section>
  );
}

/* ---- Project tile (editorial, photographic) ---- */
function ProjectTile({ p, i, n }) {
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

/* ---- Projects carousel ---- */
const PROJECT_CITIES = ["All", "Kolkata", "Indore", "Bhopal"];
function cityOf(p) {
  const c = p.city || "";
  if (c.includes("Kolkata")) return "Kolkata";
  if (c.includes("Indore")) return "Indore";
  if (c.includes("Bhopal")) return "Bhopal";
  return "Other";
}
function projectsIn(city) {
  return city === "All" ? PROJECTS : PROJECTS.filter((p) => cityOf(p) === city);
}

function Projects() {
  const [city, setCity] = uS1("All");
  const [items, setItems] = uS1(() => PROJECTS);
  uE1(() => {
    let active = true;
    if (window.RuchiBackend?.projects) {
      window.RuchiBackend.projects.getPublicProjects().then(({ data }) => {
        if (active && Array.isArray(data) && data.length) setItems(data);
      });
    }
    return () => { active = false; };
  }, []);
  const pool = items.length ? items : PROJECTS;
  const projectsForCity = (selectedCity) =>
    selectedCity === "All" ? pool : pool.filter((p) => cityOf(p) === selectedCity);
  const filtered = projectsIn(city);
  const shown = projectsForCity(city).slice(0, 3);
  const filteredCount = projectsForCity(city).length;
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
              const n = projectsForCity(c).length;
              return (
                <button key={c} role="tab" type="button" aria-selected={city === c}
                  className={`ptab ${city === c ? "is-active" : ""}`} onClick={() => setCity(c)}>
                  {c}<span className="ptab__count">{n}</span>
                </button>
              );
            })}
          </div>
        </Reveal>
      </div>
      <div className="projects__sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <div className="pgrid" key={city}>
          {shown.map((p, i) =>
            <Reveal key={`${city}-${p.name}-${p.city}`} delay={i * 80}>
              <ProjectTile p={p} i={i} n={i} />
            </Reveal>
          )}
        </div>
        <div className="projects__legend">
          <LegendDot cls="status--ready" label="Ready to Move" />
          <LegendDot cls="status--ongoing" label="Ongoing" />
          <LegendDot cls="status--upcoming" label="Upcoming" />
          <span className="projects__hint">
            Showing {shown.length} of {filteredCount} {filteredCount === 1 ? "address" : "addresses"}{city === "All" ? "" : ` in ${city}`}
          </span>
        </div>
        <Reveal className="projects__more">
          <a className="projects__allbtn" href="Projects.html">View All Projects<span className="ar">→</span></a>
        </Reveal>
      </div>
    </section>
  );
}
function LegendDot({ cls, label }) {
  return <span className={`status ${cls}`} style={{ cursor: "default" }}><span className="dot"></span>{label}</span>;
}

Object.assign(window, { Nav, Hero, Intro, Projects, ProjectTile, LegendDot, cityOf, projectsIn, smoothTo });
