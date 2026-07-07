import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Contact } from "../components/Contact";
import { Reveal } from "../components/shared";

const ICONS = {
  location: "assets/projects/oscar/icon-location.webp",
  amenities: "assets/projects/oscar/icon-amenities.webp",
  infrastructure: "assets/projects/oscar/icon-infrastructure.webp",
  size: "assets/projects/oscar/icon-size.webp",
};

const DEFAULT_HIGHLIGHTS = [
  { label: "Prime Location", desc: "Well-connected address with everyday conveniences close by.", icon: "location" },
  { label: "Lifestyle Amenities", desc: "Thoughtfully planned spaces for daily comfort and community living.", icon: "amenities" },
  { label: "Quality Infrastructure", desc: "Designed with dependable services, security, and long-term usability.", icon: "infrastructure" },
  { label: "Flexible Spaces", desc: "Practical layouts planned for modern residential and investment needs.", icon: "size" },
];

function highlightIconSrc(icon, index) {
  const key = String(icon || DEFAULT_HIGHLIGHTS[index]?.icon || "").toLowerCase();
  if (ICONS[key]) return ICONS[key];
  if (/^https?:\/\//.test(icon) || String(icon || "").includes("/")) return icon;
  return ICONS[DEFAULT_HIGHLIGHTS[index]?.icon] || ICONS.location;
}

function normalizeProjectSubpage(project, sp) {
  const title = sp?.heroTitle || project?.title || project?.name || "Project";
  const description = project?.description || "Explore this Ruchi Realty project with thoughtfully planned spaces, dependable execution, and a location selected for everyday convenience.";
  return {
    title,
    location: project?.location || project?.city || "",
    tag: sp?.heroTagline || project?.tag || description,
    heroBg: sp?.heroBg || project?.image_url || project?.img || "assets/projects/oscar-billionaires.webp",
    overviewParagraphs: sp?.overviewParagraphs?.length ? sp.overviewParagraphs : [description],
    overviewHighlights: sp?.overviewHighlights?.length ? sp.overviewHighlights.slice(0, 4) : DEFAULT_HIGHLIGHTS,
    amenities: sp?.amenities || [],
    specifications: (sp?.specifications || []).filter((item) => !String(item.title || "").startsWith("__")),
    locationImage: sp?.locationImage || "",
    locationMapEmbed: sp?.locationMapEmbed || "",
    locationDestinations: sp?.locationDestinations || [],
    galleryImages: sp?.galleryImages || [],
    brochureUrl: sp?.brochureUrl || "",
    metaTitle: sp?.metaTitle || `${title} | Ruchi Realty`,
    metaDescription: sp?.metaDescription || description,
  };
}

function SectionNav() {
  const sections = ["overview", "amenities", "specifications", "location", "gallery", "contact"];
  return (
    <nav className="osc-sticky-nav" aria-label="Project sections">
      <div className="rr-wrap">
        <div className="osc-sticky-nav__inner">
          {sections.map((id) => (
            <button key={id} type="button" className="osc-sticky-nav__btn" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}>
              {id[0].toUpperCase() + id.slice(1)}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

export default function GenericProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [subpage, setSubpage] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoaded(false);
      const { data: found } = await window.RuchiBackend.projects.getProjectBySlug(slug);
      if (!active) return;
      setProject(found);
      if (found?.id) {
        const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(found.id);
        if (active) setSubpage(sp);
      }
      if (active) setLoaded(true);
    }
    load();
    return () => { active = false; };
  }, [slug]);

  const data = useMemo(() => normalizeProjectSubpage(project, subpage), [project, subpage]);

  useEffect(() => {
    document.title = data.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = data.metaDescription;
  }, [data.metaTitle, data.metaDescription]);

  const onContact = () => document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });

  if (!loaded) {
    return (
      <>
        <Nav onContact={onContact} />
        <main className="section-pad rr-light">
          <div className="rr-wrap" style={{ paddingTop: 120 }}>
            <p className="eyebrow" style={{ color: "var(--rr-indigo)" }}>Project</p>
            <h1 className="osc-section__title">Loading project...</h1>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!project) {
    return (
      <>
        <Nav onContact={onContact} />
        <main className="section-pad rr-light">
          <div className="rr-wrap" style={{ paddingTop: 120 }}>
            <p className="eyebrow" style={{ color: "var(--rr-indigo)" }}>Project</p>
            <h1 className="osc-section__title">Project not found.</h1>
            <Link className="submit-btn" to="/projects">View all projects<span className="ar">-&gt;</span></Link>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Nav onContact={onContact} />
      <main>
        <header className="osc-hero" data-screen-label={data.title}>
          <div className="osc-hero__bg"><img src={data.heroBg} alt={data.title} /></div>
          <div className="osc-hero__overlay"></div>
          <div className="osc-hero__sig" aria-hidden="true"></div>
          <div className="rr-wrap osc-hero__wrap">
            <Reveal>
              <div className="osc-hero__content">
                <h1 className="osc-hero__title">{data.title}</h1>
                {data.location ? <p className="osc-hero__city">{data.location}</p> : null}
                <p className="osc-hero__tagline">{data.tag}</p>
                <div className="osc-hero__actions">
                  <Link className="submit-btn" to="/projects">More Projects<span className="ar">-&gt;</span></Link>
                  {data.brochureUrl ? <a className="ab-btn-outline ab-btn-outline--white" href={data.brochureUrl} target="_blank" rel="noreferrer">Download Brochure<span className="ar">-&gt;</span></a> : null}
                </div>
              </div>
            </Reveal>
          </div>
          <div className="osc-hero__chips">
            {data.overviewHighlights.map((h, i) => (
              <Reveal key={h.label || i} delay={i * 80} className="osc-chip">
                <img src={highlightIconSrc(h.icon, i)} alt="" style={{ width: 24, height: 24, marginBottom: 4, objectFit: "contain" }} />
                <span className="osc-chip__label">{h.label}</span>
                <span className="osc-chip__desc">{h.desc}</span>
              </Reveal>
            ))}
          </div>
        </header>

        <SectionNav />

        <section className="section-pad osc-section" id="overview">
          <div className="rr-wrap">
            <Reveal>
              <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: 16 }}>Overview</div>
              <h2 className="osc-section__title">Designed for everyday living,<br /><span className="rr-grad">backed by Ruchi Realty.</span></h2>
            </Reveal>
            <div className="osc-overview__grid">
              <Reveal className="osc-overview__text">{data.overviewParagraphs.map((p, i) => <p key={i}>{p}</p>)}</Reveal>
              <div className="osc-overview__stats">
                {data.overviewHighlights.map((h, i) => (
                  <Reveal key={h.label || i} delay={i * 70} className="osc-stat-card">
                    <span className="osc-stat-card__label">{h.label}</span>
                    <span className="osc-stat-card__desc">{h.desc}</span>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {data.amenities.length ? <section className="section-pad osc-section osc-section--dark" id="amenities"><div className="rr-wrap"><div className="sec-head sec-head--dark" style={{ marginBottom: 48 }}><div><div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Amenities</div><h2>Project amenities,<br /><span className="rr-grad">planned around daily life.</span></h2></div></div><div className="osc-amenities__grid">{data.amenities.map((a, i) => <Reveal key={a.name || i} delay={i * 50} className="osc-amenity-card"><div className="osc-amenity-card__icon"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="24" cy="24" r="18"/><path d="M12 24h24M24 12v24"/></svg></div><h4 className="osc-amenity-card__name">{a.name}</h4></Reveal>)}</div></div></section> : null}

        {data.specifications.length ? <section className="section-pad osc-section" id="specifications"><div className="rr-wrap"><div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: 16 }}>Specifications</div><h2 className="osc-section__title">Built with practical,<br /><span className="rr-grad">durable specifications.</span></h2><div className="osc-specs__cards" style={{ marginTop: 32 }}>{data.specifications.map((s, i) => <Reveal key={s.title || i} delay={i * 50} className="osc-spec-card"><h4 className="osc-spec-card__title">{s.title}</h4><p className="osc-spec-card__desc">{s.desc}</p></Reveal>)}</div></div></section> : null}

        {(data.locationImage || data.locationMapEmbed || data.locationDestinations.length) ? <section className="section-pad osc-section osc-section--dark" id="location"><div className="rr-wrap"><div className="sec-head sec-head--dark" style={{ marginBottom: 48 }}><div><div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Location</div><h2>Connected location,<br /><span className="rr-grad">made for everyday access.</span></h2></div></div><div className="osc-location__grid">{data.locationImage ? <Reveal className="osc-location__visual"><img src={data.locationImage} alt={`${data.title} location`} className="osc-location__img" /></Reveal> : null}<Reveal className="osc-location__info"><div className="osc-location__list">{data.locationDestinations.map((d, i) => <div key={d.name || i} className="osc-location__item"><span className="osc-location__name">{d.name}</span><span className="osc-location__dist">{d.dist}</span></div>)}</div>{data.locationMapEmbed ? <div className="osc-location__map-wrap"><iframe title={`${data.title} location map`} src={data.locationMapEmbed} width="100%" height="240" style={{ border: 0 }} loading="lazy" /></div> : null}</Reveal></div></div></section> : null}

        {data.galleryImages.length ? <section className="section-pad osc-section" id="gallery"><div className="rr-wrap"><div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: 16 }}>Gallery</div><h2 className="osc-section__title">A closer look<br /><span className="rr-grad">at the project.</span></h2><div className="osc-gallery__grid" style={{ marginTop: 32 }}>{data.galleryImages.map((img, i) => <Reveal key={img.src || i} delay={(i % 4) * 50} className={`osc-gallery__item ${i === 0 ? "osc-gallery__item--wide" : ""}`}><div className="osc-gallery__btn"><img src={img.src} alt={img.alt || data.title} className="osc-gallery__img" loading="lazy" /></div></Reveal>)}</div></div></section> : null}

        <Contact />
      </main>
      <Footer />
    </>
  );
}