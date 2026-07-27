import ProjectSplitHero from "../components/ProjectSplitHero";
import { useState, useEffect, useCallback } from "react";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";
import { PROJECT_OPTIONS } from "../data/projects";

const BASE = "assets/projects/oscar";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "amenities", label: "Amenities" },
  { id: "specifications", label: "Specifications" },
  { id: "location", label: "Location" },
  { id: "walkthrough", label: "Walkthrough" },
  { id: "gallery", label: "Gallery" },
];

const HIGHLIGHTS = [
  { label: "Prime Location", desc: "Located on Indore Bypass, connected to the city's best addresses.", icon: `${BASE}/icon-location.webp` },
  { label: "Ample Amenities", desc: "Club house, tennis court, gazebos, jogging tracks and more.", icon: `${BASE}/icon-amenities.webp` },
  { label: "Urban Infrastructure", desc: "Storm water mgmt, roadway engineering & electrification.", icon: `${BASE}/icon-infrastructure.webp` },
  { label: "4,000-12,500 SQ. FT.", desc: "Generous plot sizes crafted for premium living.", icon: `${BASE}/icon-size.webp` },
];

const AMENITIES = [
  { name: "Swimming Pool", icon: "pool" },
  { name: "Gymnasium", icon: "gym" },
  { name: "Multi-purpose Hall", icon: "hall" },
  { name: "Badminton Court", icon: "badminton" },
  { name: "Tennis Court", icon: "tennis" },
];

const SPECS = [
  { title: "Storm Water, Drainage & Waste Water Management", desc: "Scientific storm water drainage network with efficient waste water management systems ensuring a clean and safe environment throughout the development." },
  { title: "Roadway Engineering", desc: "Wide, well-planned internal roads with proper gradients, sub-base preparation, and quality pavement designed for lasting durability." },
  { title: "Communication Network", desc: "Underground ducting for telephone, internet, and cable TV lines, keeping the landscape clean and future-ready." },
  { title: "Electrification", desc: "Underground power distribution with adequate street lighting, individual metering, and dedicated feeder pillars." },
];

const DESTINATIONS = [
  { name: "Om Managalam Restaurant", dist: "1 km" },
  { name: "Vidyasagar School", dist: "5 km" },
  { name: "Akash Hospital", dist: "5 km" },
  { name: "Indore Railway Station", dist: "5 km" },
  { name: "TI Mall", dist: "6.5 km" },
  { name: "Devi Ahilyabai Holkar Airport", dist: "16.5 km" },
];

const GALLERY_IMAGES = [
  { src: `${BASE}/tennis-court.webp`, alt: "Tennis Court at Oscar Indore" },
  { src: `${BASE}/boundary-wall.webp`, alt: "11 Feet Boundary Wall at Oscar Indore" },
  { src: `${BASE}/accupressure-track.webp`, alt: "Accupressure Track at Oscar Indore" },
  { src: `${BASE}/central-gazebo.webp`, alt: "Central Gazebo at Oscar Indore" },
  { src: `${BASE}/garden-gazebo.webp`, alt: "Garden Gazebo at Oscar Indore" },
  { src: `${BASE}/roundabout.webp`, alt: "Roundabout at Oscar Indore" },
  { src: `${BASE}/street-view.webp`, alt: "Street View of Oscar Indore" },
  { src: `${BASE}/temple.webp`, alt: "Temple at Oscar Indore" },
];

export const OSCAR_FALLBACK = {
  heroTitle: "Oscar / Oscar Billionaires",
  heroTagline: "A Smart Upgrade To Premium Living",
  heroLogo: `${BASE}/logo.webp`,
  heroBg: `${BASE}/hero.webp`,
  overviewParagraphs: [
    "A Plotted development project, Oscar presents us with the first opportunity to share our definition of what a residential enclave should truly embody. A unique presentation of empirical lifestyle experience, architecturally the concept for the project reflects the traditional heritage living coupled with design influences that are current and appeals to the taste of modern generation.",
    "Conveniently located on the Indore ByPass it is for the city-dwellers looking for quietude. The project's relative sparsity, ample open spaces and oneness with nature are a huge draw for a quick retreat. Here, peace and privacy are as much a function of design as demand."
  ],
  overviewHighlights: HIGHLIGHTS,
  amenities: AMENITIES,
  specifications: SPECS,
  locationImage: `${BASE}/location.webp`,
  locationMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58871.16254808635!2d75.81428517089842!3d22.7295231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcbaf1440857%3A0xab5e3a8f6c4c5d5e!2sIndore%2C+Madhya+Pradesh!5e0!3m2!1sen!2sin!4v1",
  locationDestinations: DESTINATIONS,
  walkthroughVideoId: "HDft2VxWI9k",
  galleryImages: GALLERY_IMAGES,
  brochureUrl: `${BASE}/brochure.pdf`,
  metaTitle: "Oscar / Oscar Billionaires | Premium Plotted Development in Indore | Ruchi Realty",
  metaDescription: "Explore Oscar / Oscar Billionaires in Indore, a premium plotted development with prime location, world-class amenities, and plots from 4,000-12,500 sq. ft."
};

function HeroSection({ subpage, onBrochureClick }) {
  return <ProjectSplitHero subpage={subpage} title="Oscar Billionaires" location="Indore" type="Premium Plotted Development" slug="oscar-indore" onBrochure={onBrochureClick} />;
}

function StickyNav() {
  const [active, setActive] = useState("overview");

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" });

    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="osc-sticky-nav" aria-label="Section navigation">
      <div className="rr-wrap">
        <div className="osc-sticky-nav__inner">
          {SECTIONS.map(({ id, label }) => (
            <button
              key={id}
              type="button"
              className={`osc-sticky-nav__btn ${active === id ? "is-active" : ""}`}
              onClick={() => scrollTo(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

function OverviewSection({ subpage }) {
  return (
    <section className="section-pad osc-section" id="overview">
      <div className="rr-wrap">
        <Reveal>
          <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>OVERVIEW</div>
          <h2 className="osc-section__title">
            A plotted development,<br /><span className="rr-grad">redefining premium living.</span>
          </h2>
        </Reveal>
        <div className="osc-overview__grid">
          <Reveal className="osc-overview__text">
            {(subpage.overviewParagraphs || []).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </Reveal>
          <div className="osc-overview__stats">
            {(subpage.overviewHighlights || []).map((h, i) => (
              <Reveal key={h.label || i} delay={i * 70} className="osc-stat-card">
                <span className="osc-stat-card__label">{h.label}</span>
                <span className="osc-stat-card__desc">{h.desc}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AmenitiesSection({ subpage }) {
  return (
    <section className="section-pad osc-section osc-section--dark" id="amenities">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: "48px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>AMENITIES</div>
              <h2>Premium amenities,<br /><span className="rr-grad">crafted for your lifestyle.</span></h2>
            </div>
            <p className="sec-head__lead">
              The hub of sports and leisure, the Club House is a spaced area to pamper oneself with some stress-busting activities and to collect oodles of joyous moments for one&rsquo;s family.
            </p>
          </div>
        </Reveal>
        <div className="osc-amenities__grid">
          {(subpage.amenities || []).map((a, i) => (
            <Reveal key={a.name || i} delay={i * 70} className="osc-amenity-card">
              <div className="osc-amenity-card__icon">
                <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  {a.icon === "pool" && <>
                    <path d="M6 40h36M6 36h36" /><path d="M10 36V20a6 6 0 0 1 12 0v16M26 36V20a6 6 0 0 1 12 0v16" /><path d="M10 28h12M26 28h12" />
                  </>}
                  {a.icon === "gym" && <>
                    <path d="M6 26h36" /><path d="M10 22v8" /><path d="M14 18v12" /><path d="M24 14v20" /><path d="M34 18v12" /><path d="M38 22v8" />
                  </>}
                  {a.icon === "hall" && <>
                    <rect x="6" y="14" width="36" height="20" rx="2" /><path d="M6 34v4h36v-4" /><path d="M22 20h4v8h-4z" />
                  </>}
                  {a.icon === "badminton" && <>
                    <circle cx="24" cy="24" r="2" fill="currentColor" /><path d="M24 22V6M24 26v16M14 14l14 14M20 10l14 14" /><path d="M34 14l-14 14" />
                  </>}
                  {a.icon === "tennis" && <>
                    <circle cx="24" cy="24" r="18" /><path d="M24 6a18 18 0 0 0 0 36" /><path d="M6 24h36" />
                  </>}
                  {!["pool", "gym", "hall", "badminton", "tennis"].includes(a.icon) && <>
                    <circle cx="24" cy="24" r="18" /><path d="M12 24h24M24 12v24" />
                  </>}
                </svg>
              </div>
              <h4 className="osc-amenity-card__name">{a.name}</h4>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function SpecificationsSection({ subpage }) {
  return (
    <section className="section-pad osc-section" id="specifications">
      <div className="rr-wrap">
        <Reveal>
          <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>SPECIFICATIONS</div>
          <h2 className="osc-section__title">
            Built to the highest<br /><span className="rr-grad">standards of quality.</span>
          </h2>
        </Reveal>
        <div className="osc-specs__layout">
          <Reveal className="osc-specs__visual">
            <img src={`${BASE}/specification.webp`} alt="Oscar Specifications" loading="lazy" className="osc-specs__img" />
          </Reveal>
          <div className="osc-specs__cards">
            {(subpage.specifications || []).map((s, i) => (
              <Reveal key={s.title || i} delay={i * 70} className="osc-spec-card">
                <h4 className="osc-spec-card__title">{s.title}</h4>
                <p className="osc-spec-card__desc">{s.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function LocationSection({ subpage }) {
  return (
    <section className="section-pad osc-section osc-section--dark" id="location">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: "48px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>LOCATION</div>
              <h2>Prime location,<br /><span className="rr-grad">unmatched connectivity.</span></h2>
            </div>
          </div>
        </Reveal>
        <div className="osc-location__grid">
          <Reveal className="osc-location__visual">
            <img src={subpage.locationImage} alt="Oscar Location Map" loading="lazy" className="osc-location__img" />
          </Reveal>
          <Reveal delay={80} className="osc-location__info">
            <h3 className="osc-location__heading">Key Destinations</h3>
            <div className="osc-location__list">
              {(subpage.locationDestinations || []).map((d, i) => (
                <div key={d.name || i} className="osc-location__item">
                  <span className="osc-location__name">{d.name}</span>
                  <span className="osc-location__dist">{d.dist}</span>
                </div>
              ))}
            </div>
            {subpage.locationMapEmbed && (
              <div className="osc-location__map-wrap">
                <iframe
                  title="Oscar Indore Location"
                  src={subpage.locationMapEmbed}
                  width="100%" height="240" style={{ border: 0 }}
                  allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function WalkthroughSection({ subpage }) {
  const [playing, setPlaying] = useState(false);
  const videoId = subpage.walkthroughVideoId;

  return (
    <section className="section-pad osc-section" id="walkthrough">
      <div className="rr-wrap">
        <Reveal>
          <div className="osc-walkthrough__header">
            <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>WALKTHROUGH</div>
            <h2 className="osc-section__title">
              Oscar Walkthrough<br /><span className="rr-grad">experience the space.</span>
            </h2>
            <p className="osc-walkthrough__lead">
              Tailored to meet your expectations, walk around the exceptional living.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80} className="osc-walkthrough__video-wrap">
          <div className="osc-walkthrough__frame">
            {playing && videoId ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
                title="Oscar Walkthrough Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button type="button" className="osc-walkthrough__play-btn" onClick={() => setPlaying(true)} aria-label="Play walkthrough video">
                <img src={videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : `https://img.youtube.com/vi/HDft2VxWI9k/maxresdefault.jpg`} alt="Walkthrough thumbnail" loading="lazy" />
                <span className="osc-walkthrough__play-icon">
                  <svg width="72" height="72" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10" />
                    <polygon points="10,8 16,12 10,16" fill="currentColor" stroke="none" />
                  </svg>
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function GallerySection({ subpage }) {
  const images = (subpage.galleryImages || []).filter((img) => img?.src);
  const [galleryStart, setGalleryStart] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => {
    if (lightboxIndex !== null) {
      document.body.classList.add("nav-locked");
      const onKey = (e) => {
        if (e.key === "Escape") setLightboxIndex(null);
        if (e.key === "ArrowLeft") setLightboxIndex((p) => (p === 0 ? images.length - 1 : p - 1));
        if (e.key === "ArrowRight") setLightboxIndex((p) => (p === images.length - 1 ? 0 : p + 1));
      };
      window.addEventListener("keydown", onKey);
      return () => {
        document.body.classList.remove("nav-locked");
        window.removeEventListener("keydown", onKey);
      };
    }
  }, [lightboxIndex, images.length]);

  if (!images.length) return null;

  const visibleIndexes = Array.from(
    { length: Math.min(3, images.length) },
    (_, idx) => (galleryStart + idx) % images.length
  );

  const moveGallery = (dir) => {
    setGalleryStart((prev) => (prev + dir + images.length) % images.length);
  };

  const moveLightbox = (dir) => {
    setLightboxIndex((prev) => (prev + dir + images.length) % images.length);
  };

  return (
    <section className="section-pad project-section project-gallery osc-section osc-section--dark" id="gallery">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: "40px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>GALLERY</div>
              <h2>A closer look<br /><span className="rr-grad">at the Oscar lifestyle.</span></h2>
            </div>
          </div>
        </Reveal>

        <Reveal className="project-gallery-trio">
          {visibleIndexes.map((imgIdx) => {
            const img = images[imgIdx];
            return (
              <button
                type="button"
                key={`${img.src}-${imgIdx}`}
                onClick={() => setLightboxIndex(imgIdx)}
                aria-label={`Open ${img.alt || `Oscar gallery image ${imgIdx + 1}`}`}
              >
                <div className="rimg" style={{ width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden" }}>
                  <img
                    src={img.src}
                    alt={img.alt || `Oscar gallery ${imgIdx + 1}`}
                    loading="lazy"
                    className="rimg__img"
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                </div>
              </button>
            );
          })}
        </Reveal>

        {images.length > 3 && (
          <Reveal className="project-gallery-trio__controls">
            <span>
              {String(galleryStart + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
            <button
              type="button"
              onClick={() => moveGallery(-1)}
              aria-label="Previous gallery images"
            >
              ←
            </button>
            <button
              type="button"
              onClick={() => moveGallery(1)}
              aria-label="Next gallery images"
            >
              →
            </button>
          </Reveal>
        )}
      </div>

      {lightboxIndex !== null && images[lightboxIndex] && (
        <div className="project-gallery-lightbox" role="dialog" aria-modal="true" onClick={() => setLightboxIndex(null)}>
          <button type="button" className="project-gallery-lightbox__close" onClick={() => setLightboxIndex(null)} aria-label="Close">
            ×
          </button>
          {images.length > 1 && (
            <button
              type="button"
              className="project-gallery-lightbox__arrow is-prev"
              onClick={(e) => { e.stopPropagation(); moveLightbox(-1); }}
              aria-label="Previous image"
            >
              ←
            </button>
          )}
          <div className="project-gallery-lightbox__image" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightboxIndex].src} alt={images[lightboxIndex].alt || `Gallery image ${lightboxIndex + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            <span>
              {String(lightboxIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
            </span>
          </div>
          {images.length > 1 && (
            <button
              type="button"
              className="project-gallery-lightbox__arrow is-next"
              onClick={(e) => { e.stopPropagation(); moveLightbox(1); }}
              aria-label="Next image"
            >
              →
            </button>
          )}
        </div>
      )}
    </section>
  );
}

function BrochurePopup({ subpage, onClose }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", project: "Oscar Billionaires - Indore", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const valid = f.name.trim() && f.phone.trim() && f.email.trim();

  const submit = async () => {
    if (!valid || sending) return;
    setSending(true);
    setError("");
    if (window.RuchiBackend?.leads) {
      const { error: submitError } = await window.RuchiBackend.leads.submitLead({
        ...f,
        interest: f.project || "Oscar Billionaires",
        notes: f.message,
        source: "Oscar page brochure download",
      });
      if (submitError) {
        setError(submitError.message || "Could not submit. Please try again.");
        setSending(false);
        return;
      }
    }
    setSending(false);
    setSent(true);
    window.open(subpage.brochureUrl, "_blank");
  };

  return (
    <div className="osc-popup-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Download brochure">
      <div className="osc-popup" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="osc-popup__close" onClick={onClose} aria-label="Close">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {sent ? (
          <>
            <h3>Thank You!</h3>
            <p>Your brochure is being downloaded. A team member will also reach out to you shortly.</p>
            <button className="submit-btn" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>
              Close<span className="ar">→</span>
            </button>
          </>
        ) : (
          <>
            <h3>Download Brochure</h3>
            <p>Enter your details to receive the brochure.</p>
            <div className="field"><label>Name</label>
              <input value={f.name} onChange={set("name")} placeholder="Your full name" /></div>
            <div className="field"><label>Phone</label>
              <input value={f.phone} onChange={set("phone")} placeholder="+91" /></div>
            <div className="field"><label>Email</label>
              <input type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" /></div>
            <div className="field"><label>Project of interest</label>
              <select value={f.project} onChange={set("project")}>
                {PROJECT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select></div>
            <div className="field"><label>Message</label>
              <textarea rows={3} value={f.message} onChange={set("message")} placeholder={`I'd like to know more about the project.`} /></div>
            <button className="submit-btn" onClick={submit} disabled={!valid || sending} style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
              {sending ? "Sending..." : "Download Now"}<span className="ar">→</span>
            </button>
            {error ? <p className="contact-error" style={{ margin: "12px 0 0", fontSize: "13px" }}>{error}</p> : null}
          </>
        )}
      </div>
    </div>
  );
}

function CtaSection({ subpage, onBrochureClick }) {
  return (
    <section className="section-pad osc-section" id="brochure-cta">
      <div className="rr-wrap" style={{ textAlign: "center" }}>
        <Reveal>
          <h2 className="osc-section__title" style={{ marginBottom: "16px" }}>
            Ready to own your dream plot?<br /><span className="rr-grad">Download the brochure.</span>
          </h2>
          <p style={{ fontSize: "var(--rr-fs-lead)", color: "rgba(35,31,32,0.62)", lineHeight: "1.6", margin: "0 auto 36px", maxWidth: "48ch" }}>
            Get detailed information about the project including plot sizes, pricing, and payment plans.
          </p>
          <button className="submit-btn" onClick={onBrochureClick} style={{ display: "inline-flex" }}>
            Download Brochure<span className="ar">→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

export default function OscarPage() {
  const [brochurePopup, setBrochurePopup] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [subpage, setSubpage] = useState(OSCAR_FALLBACK);

  const onContact = useCallback(() => {
    setBrochurePopup(true);
  }, []);

  useEffect(() => {
    let active = true;
    const fetchSubpage = async () => {
      if (!window.RuchiBackend) return;
      try {
        const { data: projects } = await window.RuchiBackend.projects.getPublicProjects();
        if (!active) return;
        
        // Find the project matching url "/oscar-indore" or title "Oscar Billionaires"
        const project = (projects || []).find(
          (p) => p.url === "/oscar-indore" || p.title === "Oscar Billionaires"
        );
        
        if (project) {
          const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(project.id);
          if (!active) return;
          if (sp) {
            setSubpage({
              heroTitle: sp.heroTitle || OSCAR_FALLBACK.heroTitle,
              heroTagline: sp.heroTagline || OSCAR_FALLBACK.heroTagline,
              heroLogo: sp.heroLogo || OSCAR_FALLBACK.heroLogo,
              heroBg: sp.heroBg || OSCAR_FALLBACK.heroBg,
              overviewParagraphs: sp.overviewParagraphs?.length ? sp.overviewParagraphs : OSCAR_FALLBACK.overviewParagraphs,
              overviewHighlights: sp.overviewHighlights?.length ? sp.overviewHighlights : OSCAR_FALLBACK.overviewHighlights,
              amenities: sp.amenities?.length ? sp.amenities : OSCAR_FALLBACK.amenities,
              specifications: sp.specifications?.length ? sp.specifications : OSCAR_FALLBACK.specifications,
              locationImage: sp.locationImage || OSCAR_FALLBACK.locationImage,
              locationMapEmbed: sp.locationMapEmbed || OSCAR_FALLBACK.locationMapEmbed,
              locationDestinations: sp.locationDestinations?.length ? sp.locationDestinations : OSCAR_FALLBACK.locationDestinations,
              walkthroughVideoId: sp.walkthroughVideoId || OSCAR_FALLBACK.walkthroughVideoId,
              galleryImages: sp.galleryImages?.length ? sp.galleryImages : OSCAR_FALLBACK.galleryImages,
              brochureUrl: sp.brochureUrl || OSCAR_FALLBACK.brochureUrl,
              metaTitle: sp.metaTitle || OSCAR_FALLBACK.metaTitle,
              metaDescription: sp.metaDescription || OSCAR_FALLBACK.metaDescription,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load project subpage:", err);
      }
    };
    
    fetchSubpage();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setNavHidden(brochurePopup || window.scrollY > window.innerHeight - 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [brochurePopup]);

  useEffect(() => {
    document.title = subpage.metaTitle || OSCAR_FALLBACK.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      created = true;
    }
    meta.content = subpage.metaDescription || OSCAR_FALLBACK.metaDescription;
    if (created) {
      document.head.appendChild(meta);
    }
    return () => {
      if (created) meta.remove();
    };
  }, [subpage.metaTitle, subpage.metaDescription]);

  return (
    <>
      <Nav onContact={onContact} hidden={navHidden} solid />
      <main>
        <HeroSection subpage={subpage} onBrochureClick={() => setBrochurePopup(true)} />
        <StickyNav />
        <OverviewSection subpage={subpage} />
        <AmenitiesSection subpage={subpage} />
        <SpecificationsSection subpage={subpage} />
        <LocationSection subpage={subpage} />
        <WalkthroughSection subpage={subpage} />
        <GallerySection subpage={subpage} />
        <CtaSection subpage={subpage} onBrochureClick={() => setBrochurePopup(true)} />
      </main>
      <Footer />
      {brochurePopup && <BrochurePopup subpage={subpage} onClose={() => setBrochurePopup(false)} />}
    </>
  );
}
