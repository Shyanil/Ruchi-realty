import { useState, useEffect, useCallback } from "react";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";
import { PROJECT_OPTIONS } from "../data/projects";

const BASE = "assets/projects/active-business-park";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "amenities", label: "Amenities" },
  { id: "floor-plans", label: "Floor Plans" },
  { id: "location", label: "Location" },
  { id: "gallery", label: "Gallery" },
];

const HIGHLIGHTS = [
  { label: "Commercial Spaces", desc: "Premium workspaces designed for corporate growth.", icon: `${BASE}/icon-building.webp` },
  { label: "Ample Amenities", desc: "Modern infrastructure, backup power and parking.", icon: `${BASE}/icon-amenities.webp` },
  { label: "Prime Location", desc: "Centrally located in Kolkata, 1.2 km off E.M. Bypass.", icon: `${BASE}/icon-location.webp` },
  { label: "Value Package", desc: "Office spaces starting at competitive pricing.", icon: `${BASE}/icon-value.webp` },
];

const AMENITIES = [
  { name: "24 x 7 Security", icon: `${BASE}/amenity-security.webp` },
  { name: "Open & Multi-Level Parking", icon: `${BASE}/amenity-parking.webp` },
  { name: "Intercom Facility", icon: `${BASE}/amenity-intercom.webp` },
  { name: "CCTV Cameras", icon: `${BASE}/amenity-cctv.webp` },
  { name: "Water Treatment Plant", icon: `${BASE}/amenity-water.webp` },
  { name: "Power Back Up Services", icon: `${BASE}/amenity-generator.webp` },
  { name: "Fire Alarm & Suppression", icon: `${BASE}/amenity-fire.webp` },
  { name: "Min 3.4m Floor Height", icon: `${BASE}/amenity-floor-height.webp` },
];

const FLOOR_PLANS = [
  { title: "Ground Floor", desc: `${BASE}/floor-ground.webp` },
  { title: "First Floor", desc: `${BASE}/floor-1st.webp` },
  { title: "Second Floor", desc: `${BASE}/floor-2nd.webp` },
  { title: "3rd - 6th Floor", desc: `${BASE}/floor-3rd-6th.webp` },
];

const DESTINATIONS = [
  { name: "E.M. Bypass", dist: "1.2 km" },
  { name: "Sealdah Station", dist: "2.5 km" },
  { name: "Salt Lake", dist: "10 mins" },
  { name: "Park Street", dist: "10 mins" },
  { name: "Netaji Subhash Chandra Bose Int Airport", dist: "20 mins" },
];

const GALLERY_IMAGES = [
  { src: `${BASE}/hero-1.webp`, alt: "Active Business Park - Main Exterior View" },
  { src: `${BASE}/hero-2.webp`, alt: "Active Business Park - Perspective View" },
  { src: `${BASE}/floor-ground.webp`, alt: "Ground Floor Plan" },
  { src: `${BASE}/floor-1st.webp`, alt: "First Floor Plan" },
  { src: `${BASE}/floor-2nd.webp`, alt: "Second Floor Plan" },
  { src: `${BASE}/floor-3rd-6th.webp`, alt: "3rd - 6th Floor Plan" },
];

const fallbackData = {
  heroTitle: "Active Business Park",
  heroTagline: "Designed for your business to reach new heights",
  heroLogo: `${BASE}/logo.webp`,
  heroBg: `${BASE}/hero-1.webp`,
  overviewParagraphs: [
    "Active Business Park is designed not only as a commercial space, but as a space for business activities: offices, banks, retail, health, wellness centers, food, IT/ITES, green industries, etc. It is conceived as a workplace for growing corporate and business entrepreneurs in the city.",
    "Strategic location near 5-star hotels, shopping malls, schools, airport, railway station, and CBDs. Centrally located in Kolkata, 1.2 km off Eastern Metropolitan Bypass, just off the Ma flyover. Connects Park Street, Esplanade, Alipore, Salt Lake Sector 5, Rajarhat, and airport route. Around 5000 premium residences within 2 km radius. Office spaces start from 652 sq ft at Rs 30 lakhs. Spaces can stretch up to 33,000 sq ft on a single floor."
  ],
  overviewHighlights: HIGHLIGHTS,
  amenities: AMENITIES,
  specifications: FLOOR_PLANS,
  locationImage: `${BASE}/location-map.webp`,
  locationMapEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7369.203955889171!2d88.390084!3d22.556578!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768ef7551e65%3A0xd82fba81a29c5969!2sActive%20Business%20Park!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin",
  locationDestinations: DESTINATIONS,
  walkthroughVideoId: "",
  galleryImages: GALLERY_IMAGES,
  brochureUrl: `${BASE}/brochure.pdf`,
  metaTitle: "Active Business Park - Ruchi Realty",
  metaDescription: "Discover Active Business Park: Prime commercial spaces in a strategic location. Modern amenities. Reach new heights for your business!"
};

function HeroSection({ subpage, onBrochureClick }) {
  const bg = subpage.heroBg || fallbackData.heroBg;
  return (
    <header className="osc-hero" data-screen-label="Active Business Park">
      <div className="osc-hero__bg">
        <img src={bg} alt={subpage.heroTitle} />
      </div>
      <div className="osc-hero__overlay"></div>
      <div className="osc-hero__sig" aria-hidden="true"></div>
      <div className="rr-wrap osc-hero__wrap">
        <Reveal>
          <div className="osc-hero__content">
            {subpage.heroLogo && <img className="osc-hero__logo" src={subpage.heroLogo} alt="Active Business Park Logo" loading="eager" style={{ height: "auto", maxHeight: "80px", maxWidth: "260px", objectFit: "contain" }} />}
            <h1 className="osc-hero__title">{subpage.heroTitle}</h1>
            <p className="osc-hero__city">Kolkata</p>
            <p className="osc-hero__tagline">{subpage.heroTagline}</p>
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
        {(subpage.overviewHighlights || []).map((h, i) => (
          <Reveal key={h.label || i} delay={i * 80} className="osc-chip">
            {h.icon && <img src={h.icon} alt="" style={{ width: "24px", height: "24px", marginBottom: "4px", objectFit: "contain" }} />}
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

function OverviewSection({ subpage }) {
  return (
    <section className="section-pad osc-section" id="overview">
      <div className="rr-wrap">
        <Reveal>
          <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>OVERVIEW</div>
          <h2 className="osc-section__title">
            Designed for your business<br /><span className="rr-grad">to reach new heights.</span>
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
              <h2>Premium amenities,<br /><span className="rr-grad">crafted for business growth.</span></h2>
            </div>
            <p className="sec-head__lead">
              Active Business Park offers a workplace designed for growing corporate and business entrepreneurs in the city with premium facilities.
            </p>
          </div>
        </Reveal>
        <div className="osc-amenities__grid">
          {(subpage.amenities || []).map((a, i) => (
            <Reveal key={a.name || i} delay={i * 70} className="osc-amenity-card">
              <div className="osc-amenity-card__icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(245,244,241,0.08)", padding: "10px", borderRadius: "50%", width: "52px", height: "52px" }}>
                {a.icon && (a.icon.startsWith("assets/") || a.icon.includes(".")) ? (
                  <img src={a.icon} alt={a.name} style={{ width: "32px", height: "32px", objectFit: "contain", filter: "brightness(1) invert(0)" }} />
                ) : (
                  <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                    <circle cx="24" cy="24" r="18" /><path d="M12 24h24M24 12v24" />
                  </svg>
                )}
              </div>
              <h4 className="osc-amenity-card__name" style={{ marginTop: "12px", fontSize: "14px", fontWeight: "var(--rr-w-medium)", color: "var(--rr-paper)" }}>{a.name}</h4>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function FloorPlansSection({ subpage }) {
  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const plans = subpage.specifications || [];

  if (!plans.length) return null;

  return (
    <section className="section-pad osc-section" id="floor-plans">
      <div className="rr-wrap">
        <Reveal>
          <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>FLOOR PLANS</div>
          <h2 className="osc-section__title">
            Floor Plans<br /><span className="rr-grad">Strategically designed floor plans</span>
          </h2>
        </Reveal>

        <div className="osc-floorplans__layout" style={{ marginTop: "40px" }}>
          <Reveal className="osc-floorplans__tabs" style={{ display: "flex", gap: "12px", marginBottom: "30px", flexWrap: "wrap" }}>
            {plans.map((p, idx) => (
              <button
                key={p.title || idx}
                type="button"
                className={`submit-btn ${activePlanIdx === idx ? "" : "ab-btn-outline"}`}
                style={{
                  padding: "10px 24px",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: activePlanIdx === idx ? "var(--rr-indigo)" : "transparent",
                  color: activePlanIdx === idx ? "#fff" : "var(--rr-ink)",
                  border: "1px solid var(--rr-indigo)",
                  borderRadius: "20px",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onClick={() => setActivePlanIdx(idx)}
              >
                {p.title}
              </button>
            ))}
          </Reveal>

          <Reveal key={activePlanIdx} className="osc-floorplans__viewer" style={{ background: "rgba(20,18,26,0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(20,18,26,0.08)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {plans[activePlanIdx] && (
              <img
                src={plans[activePlanIdx].desc}
                alt={plans[activePlanIdx].title}
                style={{ maxWidth: "100%", maxHeight: "550px", objectFit: "contain", borderRadius: "4px" }}
              />
            )}
          </Reveal>
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
              <h2>Strategic location,<br /><span className="rr-grad">unmatched connectivity.</span></h2>
            </div>
          </div>
        </Reveal>
        <div className="osc-location__grid">
          <Reveal className="osc-location__visual">
            <img src={subpage.locationImage} alt="Active Business Park Location Map" loading="lazy" className="osc-location__img" />
          </Reveal>
          <Reveal delay={80} className="osc-location__info">
            <h3 className="osc-location__heading">Key Destinations</h3>
            <p style={{ color: "rgba(245,244,241,0.62)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
              Strategically located in the centre of the city, close to 5-star hotels, shopping malls, schools, airport, railway station and CBDs. 1.2 km off Eastern Metropolitan Bypass, just off the Ma flyover.
            </p>
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
                  title="Active Business Park Location Map"
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

function GallerySection({ subpage }) {
  const [lightbox, setLightbox] = useState(null);
  const images = subpage.galleryImages || [];

  useEffect(() => {
    if (lightbox !== null) {
      document.body.classList.add("nav-locked");
      const onKey = (e) => { if (e.key === "Escape") setLightbox(null); };
      window.addEventListener("keydown", onKey);
      return () => { document.body.classList.remove("nav-locked"); window.removeEventListener("keydown", onKey); };
    }
  }, [lightbox]);

  if (!images.length) return null;

  return (
    <section className="section-pad osc-section" id="gallery">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head" style={{ marginBottom: "48px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-indigo)" }}>GALLERY</div>
              <h2>A glimpse into<br /><span className="rr-grad">Active Business Park.</span></h2>
            </div>
          </div>
        </Reveal>
        <div className="osc-gallery__grid">
          {images.map((img, i) => (
            <Reveal key={img.src || i} delay={(i % 4) * 60} className={`osc-gallery__item ${i === 0 ? "osc-gallery__item--wide" : ""}`}>
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

      {lightbox !== null && images[lightbox] && (
        <div className="osc-lightbox" onClick={() => setLightbox(null)}>
          <button type="button" className="osc-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close gallery">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
          <button type="button" className="osc-lightbox__arrow osc-lightbox__arrow--prev" onClick={(e) => { e.stopPropagation(); setLightbox(lightbox === 0 ? images.length - 1 : lightbox - 1); }} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div className="osc-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightbox].src} alt={images[lightbox].alt} className="osc-lightbox__img" />
            <p className="osc-lightbox__caption">{images[lightbox].alt}</p>
          </div>
          <button type="button" className="osc-lightbox__arrow osc-lightbox__arrow--next" onClick={(e) => { e.stopPropagation(); setLightbox(lightbox === images.length - 1 ? 0 : lightbox + 1); }} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}

function BrochurePopup({ subpage, onClose }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", project: "Active Business Park — Kolkata", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");

  const set = (key) => (e) => setF((prev) => ({ ...prev, [key]: e.target.value }));
  const valid = f.name.trim() && f.phone.trim() && f.email.trim();

  const submit = async () => {
    if (!valid || sending) return;
    setSending(true);
    setErr("");
    if (window.RuchiBackend?.leads) {
      const { error } = await window.RuchiBackend.leads.submitLead({
        ...f,
        interest: f.project || "Active Business Park",
        notes: f.message,
        source: "Active Business Park page brochure download"
      });
      if (error) {
        setErr(error.message || "Could not submit. Please try again.");
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
            {err ? <p className="contact-error" style={{ margin: "12px 0 0", fontSize: "13px" }}>{err}</p> : null}
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
            Ready to grow your business?<br /><span className="rr-grad">Download the brochure.</span>
          </h2>
          <p style={{ fontSize: "var(--rr-fs-lead)", color: "rgba(35,31,32,0.62)", lineHeight: "1.6", margin: "0 auto 36px", maxWidth: "48ch" }}>
            Get detailed information about Active Business Park including space availability, pricing, and project specifications.
          </p>
          <button className="submit-btn" onClick={onBrochureClick} style={{ display: "inline-flex" }}>
            Download Brochure<span className="ar">→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

export default function ActiveBusinessParkPage() {
  const [brochurePopup, setBrochurePopup] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [subpage, setSubpage] = useState(fallbackData);

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
        
        const project = (projects || []).find(
          (p) => p.url === "/active-business-park" || p.title === "Active Business Park"
        );
        
        if (project) {
          const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(project.id);
          if (!active) return;
          if (sp) {
            setSubpage({
              heroTitle: sp.heroTitle || fallbackData.heroTitle,
              heroTagline: sp.heroTagline || fallbackData.heroTagline,
              heroLogo: sp.heroLogo || fallbackData.heroLogo,
              heroBg: sp.heroBg || fallbackData.heroBg,
              overviewParagraphs: sp.overviewParagraphs?.length ? sp.overviewParagraphs : fallbackData.overviewParagraphs,
              overviewHighlights: sp.overviewHighlights?.length ? sp.overviewHighlights : fallbackData.overviewHighlights,
              amenities: sp.amenities?.length ? sp.amenities : fallbackData.amenities,
              specifications: sp.specifications?.length ? sp.specifications : fallbackData.specifications,
              locationImage: sp.locationImage || fallbackData.locationImage,
              locationMapEmbed: sp.locationMapEmbed || fallbackData.locationMapEmbed,
              locationDestinations: sp.locationDestinations?.length ? sp.locationDestinations : fallbackData.locationDestinations,
              walkthroughVideoId: sp.walkthroughVideoId || fallbackData.walkthroughVideoId,
              galleryImages: sp.galleryImages?.length ? sp.galleryImages : fallbackData.galleryImages,
              brochureUrl: sp.brochureUrl || fallbackData.brochureUrl,
              metaTitle: sp.metaTitle || fallbackData.metaTitle,
              metaDescription: sp.metaDescription || fallbackData.metaDescription,
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
      setNavHidden(window.scrollY > window.innerHeight - 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.title = subpage.metaTitle || fallbackData.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      created = true;
    }
    meta.content = subpage.metaDescription || fallbackData.metaDescription;
    if (created) {
      document.head.appendChild(meta);
    }
    return () => {
      if (created) meta.remove();
    };
  }, [subpage.metaTitle, subpage.metaDescription]);

  return (
    <>
      <Nav onContact={onContact} hidden={navHidden} />
      <main>
        <HeroSection subpage={subpage} onBrochureClick={() => setBrochurePopup(true)} />
        <StickyNav />
        <OverviewSection subpage={subpage} />
        <AmenitiesSection subpage={subpage} />
        <FloorPlansSection subpage={subpage} />
        <LocationSection subpage={subpage} />
        <GallerySection subpage={subpage} />
        <CtaSection subpage={subpage} onBrochureClick={() => setBrochurePopup(true)} />
      </main>
      <Footer />
      {brochurePopup && <BrochurePopup subpage={subpage} onClose={() => setBrochurePopup(false)} />}
    </>
  );
}
