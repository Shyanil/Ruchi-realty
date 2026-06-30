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
  { label: "Prime Location", desc: "Located on Indore Bypass, connected to the city's best addresses." },
  { label: "Ample Amenities", desc: "Club house, tennis court, gazebos, jogging tracks and more." },
  { label: "Urban Infrastructure", desc: "Storm water mgmt, roadway engineering & electrification." },
  { label: "4,000-12,500 SQ. FT.", desc: "Generous plot sizes crafted for premium living." },
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

function HeroSection({ onBrochureClick }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <header className="osc-hero" data-screen-label="Oscar Billionaires">
      <div className="osc-hero__bg">
        <img src={`${BASE}/hero.webp`} alt="Oscar Billionaires Indore" />
      </div>
      <div className="osc-hero__overlay"></div>
      <div className="osc-hero__sig" aria-hidden="true"></div>
      <div className="rr-wrap osc-hero__wrap">
        <Reveal>
          <div className="osc-hero__content">
            <img className="osc-hero__logo" src={`${BASE}/logo.webp`} alt="Oscar Logo" loading="eager" />
            <h1 className="osc-hero__title">Oscar / Oscar Billionaires</h1>
            <p className="osc-hero__city">Indore</p>
            <p className="osc-hero__tagline">A Smart Upgrade To Premium Living</p>
            <div className="osc-hero__actions">
              <button className="submit-btn" onClick={() => { window.location.href = "/projects"; }}>
                More Projects<span className="ar">→</span>
              </button>
              <button className="ab-btn-outline ab-btn-outline--white" onClick={onBrochureClick}>
                Download Brochure<span className="ar">→</span>
              </button>
            </div>
          </div>
        </Reveal>
      </div>
      <div className="osc-hero__chips">
        {HIGHLIGHTS.map((h, i) => (
          <Reveal key={h.label} delay={i * 80} className="osc-chip">
            <span className="osc-chip__label">{h.label}</span>
            <span className="osc-chip__desc">{h.desc}</span>
          </Reveal>
        ))}
      </div>
    </header>
  );
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

function OverviewSection() {
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
            <p>
              A Plotted development project, Oscar presents us with the first opportunity to share our definition of what a residential enclave should truly embody. A unique presentation of empirical lifestyle experience, architecturally the concept for the project reflects the traditional heritage living coupled with design influences that are current and appeals to the taste of modern generation.
            </p>
            <p>
              Conveniently located on the Indore ByPass it is for the city-dwellers looking for quietude. The project&rsquo;s relative sparsity, ample open spaces and oneness with nature are a huge draw for a quick retreat. Here, peace and privacy are as much a function of design as demand.
            </p>
          </Reveal>
          <div className="osc-overview__stats">
            {HIGHLIGHTS.map((h, i) => (
              <Reveal key={h.label} delay={i * 70} className="osc-stat-card">
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

function AmenitiesSection() {
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
          {AMENITIES.map((a, i) => (
            <Reveal key={a.name} delay={i * 70} className="osc-amenity-card">
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

function SpecificationsSection() {
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
            {SPECS.map((s, i) => (
              <Reveal key={s.title} delay={i * 70} className="osc-spec-card">
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

function LocationSection() {
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
            <img src={`${BASE}/location.webp`} alt="Oscar Location Map" loading="lazy" className="osc-location__img" />
          </Reveal>
          <Reveal delay={80} className="osc-location__info">
            <h3 className="osc-location__heading">Key Destinations</h3>
            <div className="osc-location__list">
              {DESTINATIONS.map((d) => (
                <div key={d.name} className="osc-location__item">
                  <span className="osc-location__name">{d.name}</span>
                  <span className="osc-location__dist">{d.dist}</span>
                </div>
              ))}
            </div>
            <div className="osc-location__map-wrap">
              <iframe
                title="Oscar Indore Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58871.16254808635!2d75.81428517089842!3d22.7295231!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fcbaf1440857%3A0xab5e3a8f6c4c5d5e!2sIndore%2C+Madhya+Pradesh!5e0!3m2!1sen!2sin!4v1"
                width="100%" height="240" style={{ border: 0 }}
                allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function WalkthroughSection() {
  const [playing, setPlaying] = useState(false);
  const videoId = "HDft2VxWI9k";

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
            {playing ? (
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?rel=0&autoplay=1`}
                title="Oscar Walkthrough Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <button type="button" className="osc-walkthrough__play-btn" onClick={() => setPlaying(true)} aria-label="Play walkthrough video">
                <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt="Walkthrough thumbnail" loading="lazy" />
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

function GallerySection() {
  const [lightbox, setLightbox] = useState(null);

  useEffect(() => {
    if (lightbox !== null) {
      document.body.classList.add("nav-locked");
      const onKey = (e) => { if (e.key === "Escape") setLightbox(null); };
      window.addEventListener("keydown", onKey);
      return () => { document.body.classList.remove("nav-locked"); window.removeEventListener("keydown", onKey); };
    }
  }, [lightbox]);

  return (
    <section className="section-pad osc-section osc-section--dark" id="gallery">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: "48px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>GALLERY</div>
              <h2>A glimpse into<br /><span className="rr-grad">the Oscar lifestyle.</span></h2>
            </div>
          </div>
        </Reveal>
        <div className="osc-gallery__grid">
          {GALLERY_IMAGES.map((img, i) => (
            <Reveal key={img.src} delay={(i % 4) * 60} className={`osc-gallery__item ${i === 0 ? "osc-gallery__item--wide" : ""}`}>
              <button type="button" className="osc-gallery__btn" onClick={() => setLightbox(i)} aria-label={`View ${img.alt}`}>
                <img src={img.src} alt={img.alt} loading="lazy" className="osc-gallery__img" />
                <span className="osc-gallery__zoom">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6M8 11h6" />
                  </svg>
                </span>
              </button>
            </Reveal>
          ))}
        </div>
      </div>

      {lightbox !== null && (
        <div className="osc-lightbox" onClick={() => setLightbox(null)}>
          <button type="button" className="osc-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close gallery">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button type="button" className="osc-lightbox__arrow osc-lightbox__arrow--prev" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p === 0 ? GALLERY_IMAGES.length - 1 : p - 1)); }} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div className="osc-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img src={GALLERY_IMAGES[lightbox].src} alt={GALLERY_IMAGES[lightbox].alt} className="osc-lightbox__img" />
            <p className="osc-lightbox__caption">{GALLERY_IMAGES[lightbox].alt}</p>
          </div>
          <button type="button" className="osc-lightbox__arrow osc-lightbox__arrow--next" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p === GALLERY_IMAGES.length - 1 ? 0 : p + 1)); }} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

function BrochurePopup({ onClose }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", project: "Oscar Billionaires — Indore", message: "" });
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
    window.open(`${BASE}/brochure.pdf`, "_blank");
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
            <p>Enter your details to receive the Oscar &mdash; Indore brochure.</p>
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
              <textarea rows={3} value={f.message} onChange={set("message")} placeholder="I&rsquo;d like to know more about Oscar &mdash; Indore." /></div>
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

function CtaSection({ onBrochureClick }) {
  return (
    <section className="section-pad osc-section" id="brochure-cta">
      <div className="rr-wrap" style={{ textAlign: "center" }}>
        <Reveal>
          <h2 className="osc-section__title" style={{ marginBottom: "16px" }}>
            Ready to own your dream plot?<br /><span className="rr-grad">Download the brochure.</span>
          </h2>
          <p style={{ fontSize: "var(--rr-fs-lead)", color: "rgba(35,31,32,0.62)", lineHeight: "1.6", margin: "0 auto 36px", maxWidth: "48ch" }}>
            Get detailed information about Oscar &mdash; Indore including plot sizes, pricing, and payment plans.
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
  const onContact = useCallback(() => {
    setBrochurePopup(true);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setNavHidden(window.scrollY > window.innerHeight - 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.title = "Oscar / Oscar Billionaires — Premium Plotted Development in Indore | Ruchi Realty";
    const meta = document.createElement("meta");
    meta.name = "description";
    meta.content = "Explore Oscar / Oscar Billionaires in Indore — a premium plotted development with prime location, world-class amenities, and plots from 4,000-12,500 sq. ft.";
    document.head.appendChild(meta);
    return () => meta.remove();
  }, []);

  return (
    <>
      <Nav onContact={onContact} hidden={navHidden} />
      <main>
        <HeroSection onBrochureClick={() => setBrochurePopup(true)} />
        <StickyNav />
        <OverviewSection />
        <AmenitiesSection />
        <SpecificationsSection />
        <LocationSection />
        <WalkthroughSection />
        <GallerySection />
        <CtaSection onBrochureClick={() => setBrochurePopup(true)} />
      </main>
      <Footer />
      {brochurePopup && <BrochurePopup onClose={() => setBrochurePopup(false)} />}
    </>
  );
}
