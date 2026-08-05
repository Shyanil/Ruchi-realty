import ProjectSplitHero from "../components/ProjectSplitHero";
import { useState, useEffect, useCallback } from "react";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal, RImg } from "../components/shared";
import { PROJECT_OPTIONS } from "../data/projects";
import OtpVerification, { formatIndianPhoneForLead, isValidIndianPhone } from "../components/OtpVerification";

const BASE = "assets/projects/active-business-park";

function videoEmbedUrl(value = "") {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/youtube\.com\/embed\//i.test(text) || /player\.vimeo\.com\/video\//i.test(text)) return text;
  const vimeo = text.match(/vimeo\.com\/(?:video\/)?(\d+)/i);
  if (vimeo?.[1]) return `https://player.vimeo.com/video/${vimeo[1]}`;
  const watch = text.match(/[?&]v=([^&]+)/i);
  const short = text.match(/youtu\.be\/([^?&]+)/i);
  const shorts = text.match(/youtube\.com\/shorts\/([^?&]+)/i);
  const embed = text.match(/youtube\.com\/embed\/([^?&]+)/i);
  const id = watch?.[1] || short?.[1] || shorts?.[1] || embed?.[1] || (/^[A-Za-z0-9_-]{8,}$/.test(text) ? text : "");
  return id ? `https://www.youtube.com/embed/${id}` : text;
}

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "specifications", label: "Specifications" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "floor-plans", label: "Floor Plans" },
  { id: "gallery", label: "Gallery" },
];

const HIGHLIGHTS = [
  { label: "Commercial Spaces", desc: "For offices, banks, retail, health, wellness, food, IT/ITES and green industries.", icon: `${BASE}/icon-building.webp` },
  { label: "Ample Amenities", desc: "Passenger and freight lifts, security, parking, backup power and facility management.", icon: `${BASE}/icon-amenities.webp` },
  { label: "Prime Location", desc: "Centrally located in Kolkata, 1.2 km off E.M. Bypass.", icon: `${BASE}/icon-location.webp` },
  { label: "Value Package", desc: "Office spaces from 652 sq. ft. at Rs. 30 lakhs, with floor plates up to 33,000 sq. ft.", icon: `${BASE}/icon-value.webp` },
];

const SPECIFICATIONS = [
  {
    title: "Commercial & Business Hub",
    desc: "Designed for offices, banks, retail, health and wellness centres, food, IT/ITES and green industries. A hypermarket on the ground floor supports the daily needs of the neighbouring populace.",
    image: `${BASE}/hero-1.webp`
  },
  {
    title: "Strategic Connectivity",
    desc: "Centrally located 1.2 km off E.M. Bypass, right off the Ma flyover connecting Park Street, Esplanade, Alipore to Salt Lake Sector 5, Rajarhat, and the Airport. Over 5,000 premium residences within a 2 km radius.",
    image: `${BASE}/location-map.webp`
  },
  {
    title: "Infrastructure & Logistics",
    desc: "Passenger and freight lifts, CCTV cameras, intercom, power backup, water treatment, open and multi-level parking, 24 x 7 security, facility management, a 3.4 m clear floor height, fire alarm and a truck bay for unloading goods.",
    image: `${BASE}/hero-2.webp`
  },
  {
    title: "Flexible Workspaces & Value Pricing",
    desc: "Office spaces starting from 652 sq. ft. area at Rs 30 lakhs only, with single floor plate availability extending up to 33,000 sq. ft.",
    image: `${BASE}/hero-1.webp`
  },
  {
    title: "Project Details",
    desc: "Site Address: 54/10, D.C. Dey Road, Near ITC Sonar, off E.M. Bypass, Kolkata – 700015. WBRERA Number: HIRA/A/NOR/2018/000035.",
    image: `${BASE}/location-map.webp`
  }
];

const AMENITIES = [
  { name: "24 x 7 Security", icon: `${BASE}/amenity-security.webp` },
  { name: "Open & Multi-Level Car Parking", icon: `${BASE}/amenity-parking.webp` },
  { name: "Intercom Facility", icon: `${BASE}/amenity-intercom.webp` },
  { name: "CCTV Cameras", icon: `${BASE}/amenity-cctv.webp` },
  { name: "Water Treatment Plant", icon: `${BASE}/amenity-water.webp` },
  { name: "Power Back Up Management Services", icon: `${BASE}/amenity-generator.webp` },
  { name: "Fire Alarm & Suppression", icon: `${BASE}/amenity-fire.webp` },
  { name: "Floor Height of min 3.4 mtrs", icon: `${BASE}/amenity-floor-height.webp` },
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
];

export const ACTIVE_BUSINESS_PARK_FALLBACK = {
  heroTitle: "Active Business Park",
  heroTagline: "Designed for your business to reach new heights",
  heroLogo: `${BASE}/logo.webp`,
  heroBg: `${BASE}/hero-1.webp`,
  overviewParagraphs: [
    "Active Business Park is designed not only as a commercial space, but as a space for concoction of business activities: offices, banks, retail, health, wellness centers, food, IT/ITES, green industries, etc. It is conceived as a workplace for growing corporate and business entrepreneurs in the city.",
    "A strategic location, in the centre of various external economies, i.e., proximity of their business location to 5 star hotels, shopping malls, schools, airport, railway station and CBDs. Centrally located in the city, 1.2 km off Eastern Metropolitan Bypass, just off the “Ma” flyover, the speedway – which links the old CBD - Park Street, Esplanade, Alipore to the IT Hub in Salt Lake Sector 5, Rajarhat extending straight up to the airport. The area as on date has 5000 premium residences within a radius of 2 km.",
    "Modern day amenities like: passenger and freight lift, CCTV cameras, intercom facility, power back up, water treatment plant, open and multi level car parking, 24 x 7 security, facility management system, clear floor height of 3.4 metres, fire alarm & truck bay for unloading of goods, Hypermarket on the ground floor will meet the daily needs of the neighboring populace.",
    "Finally, all of the above in a value package: office spaces start from 652 sq ft area at the price of Rs 30 lakhs only. Spaces can stretch up to 33,000 sq ft on a single floor."
  ],
  overviewHighlights: HIGHLIGHTS,
  amenities: AMENITIES,
  specifications: [
    ...SPECIFICATIONS,
    { title: "__floor_plans__", desc: JSON.stringify(FLOOR_PLANS) }
  ],
  floorPlans: FLOOR_PLANS,
  locationImage: `${BASE}/location-map.webp`,
  locationMapEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d7369.203955889171!2d88.390084!3d22.556578!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768ef7551e65%3A0xd82fba81a29c5969!2sActive%20Business%20Park!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin",
  locationDestinations: DESTINATIONS,
  walkthroughVideoId: "",
  galleryImages: GALLERY_IMAGES,
  brochureUrl: `${BASE}/brochure.pdf`,
  metaTitle: "Active Business Park - Ruchi Realty",
  metaDescription: "Active Business Park is a commercial development near ITC Sonar in Kolkata, 1.2 km off E.M. Bypass, with office spaces from 652 sq. ft. and business-ready amenities."
};

function HeroSection({ subpage, onBrochureClick }) {
  return <ProjectSplitHero subpage={subpage} title="Active Business Park" location="Kolkata" type="Commercial" slug="active-business-park" onBrochure={onBrochureClick} />;
}

function StickyNav({ subpage }) {
  const [active, setActive] = useState("overview");
  const hasVideo = Boolean(videoEmbedUrl(subpage?.videoSection?.videoUrl || subpage?.walkthroughVideoId));
  const sections = [
    { id: "overview", label: "Overview" },
    { id: "specifications", label: "Specifications" },
    { id: "amenities", label: "Amenities" },
    { id: "location", label: "Location" },
    { id: "floor-plans", label: "Floor Plans" },
    ...(hasVideo ? [{ id: "walkthrough", label: "Walkthrough" }] : []),
    { id: "gallery", label: "Gallery" },
  ];

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(e.target.id);
      });
    }, { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" });

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="osc-sticky-nav" aria-label="Section navigation">
      <div className="rr-wrap">
        <div className="osc-sticky-nav__inner">
          {sections.map(({ id, label }) => (
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
            Designed for your business<br /><span className="rr-grad">to reach new heights</span>
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

function SpecificationsSection({ subpage }) {
  const rawSpecs = subpage.specifications || [];
  const specs = rawSpecs.filter(
    (item) => item?.title && !String(item.title).startsWith("__") && (item.desc || item.details)
  );
  if (!specs.length) return null;

  return (
    <section className="section-pad project-section project-specifications" id="specifications">
      <div className="rr-wrap">
        <Reveal>
          <div className="project-section__head">
            <span className="eyebrow">Specifications</span>
            <h2>Materials and details,<br /><span className="rr-grad">presented clearly</span></h2>
          </div>
        </Reveal>
        <div className="project-spec-list">
          {specs.map((spec, index) => {
            const image = spec.image || spec.img || spec.src || `${BASE}/hero-1.webp`;
            const descText = spec.desc || spec.details || "";
            return (
              <article className={`project-spec-row ${index % 2 ? "is-reversed" : ""}`} key={spec.title || index}>
                <div className="project-spec-row__visual">
                  <RImg src={image} alt={`Active Business Park ${spec.title}`} />
                </div>
                <div className="project-spec-row__content">
                  <span className="project-spec-row__number">{String(index + 1).padStart(2, "0")}</span>
                  <h3>{spec.title}</h3>
                  <div className="project-spec-points">
                    <p><span>{descText}</span></p>
                  </div>
                </div>
              </article>
            );
          })}
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
              <h2>Premium amenities,<br /><span className="rr-grad">crafted for business growth</span></h2>
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
  const plans = subpage.floorPlans?.length ? subpage.floorPlans : FLOOR_PLANS;

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

function WalkthroughSection({ subpage }) {
  const videoUrl = subpage.videoSection?.videoUrl || subpage.walkthroughVideoId || "";
  const embed = videoEmbedUrl(videoUrl);
  if (!embed) return null;

  return (
    <section className="section-pad osc-section osc-section--dark" id="walkthrough">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: 40 }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Walkthrough</div>
              <h2>{subpage.videoSection?.title || "Construction Walkthrough"}<br /><span className="rr-grad">project video</span></h2>
            </div>
          </div>
        </Reveal>
        <Reveal>
          <div className="osc-modern-video-frame" style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#111", borderRadius: 8, overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,.28)" }}>
            <iframe
              title={subpage.videoSection?.title || "Active Business Park Walkthrough"}
              src={embed}
              width="100%"
              height="100%"
              style={{ border: 0, position: "absolute", inset: 0 }}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </Reveal>
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
              <h2>Strategic location,<br /><span className="rr-grad">unmatched connectivity</span></h2>
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
    <section className="section-pad project-section project-gallery osc-section" id="gallery">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head" style={{ marginBottom: "40px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-indigo)" }}>GALLERY</div>
              <h2>A closer look<br /><span className="rr-grad">at Active Business Park</span></h2>
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
                aria-label={`Open ${img.alt || `Active Business Park gallery image ${imgIdx + 1}`}`}
              >
                <div className="rimg" style={{ width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden" }}>
                  <img
                    src={img.src}
                    alt={img.alt || `Active Business Park gallery ${imgIdx + 1}`}
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
  const [f, setF] = useState({ name: "", phone: "", email: "", project: "Active Business Park - Kolkata", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const set = (key) => (e) => setF((prev) => ({ ...prev, [key]: e.target.value }));
  const valid = f.name.trim() && isValidIndianPhone(f.phone) && f.email.trim() && otpVerified;

  const submit = async () => {
    if (!valid || sending) return;
    setSending(true);
    setErr("");
    if (window.RuchiBackend?.leads) {
      const { error } = await window.RuchiBackend.leads.submitLead({
        ...f,
        phone: formatIndianPhoneForLead(f.phone),
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
            <OtpVerification value={f.phone} onChange={(phone) => setF((current) => ({ ...current, phone }))} onVerificationChange={({ verified }) => setOtpVerified(verified)} purpose="brochure" />
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
            Ready to grow your business?<br /><span className="rr-grad">Download the brochure</span>
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
  const [subpage, setSubpage] = useState(ACTIVE_BUSINESS_PARK_FALLBACK);

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
          (p) => p.url === "/active-business-park" || p.url === "/projects/active-business-park" || p.title === "Active Business Park"
        );
        
        if (project) {
          const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(project.id);
          if (!active) return;
          if (sp) {
            const custom = { specifications: [], floorPlans: [], videoSection: null };
            (sp.specifications || []).forEach((item) => {
              if (item.title === "__floor_plans__") {
                try { custom.floorPlans = JSON.parse(item.desc || "[]"); } catch {}
              } else if (item.title === "__video_section__") {
                try { custom.videoSection = JSON.parse(item.desc || "{}"); } catch {}
              } else if (!String(item.title || "").startsWith("__")) {
                custom.specifications.push(item);
              }
            });

            const videoUrl = custom.videoSection?.videoUrl || sp.walkthroughVideoId || "";

            setSubpage({
              heroTitle: sp.heroTitle || ACTIVE_BUSINESS_PARK_FALLBACK.heroTitle,
              heroTagline: sp.heroTagline || ACTIVE_BUSINESS_PARK_FALLBACK.heroTagline,
              heroLogo: sp.heroLogo || ACTIVE_BUSINESS_PARK_FALLBACK.heroLogo,
              heroBg: sp.heroBg || ACTIVE_BUSINESS_PARK_FALLBACK.heroBg,
              overviewParagraphs: sp.overviewParagraphs?.length ? sp.overviewParagraphs : ACTIVE_BUSINESS_PARK_FALLBACK.overviewParagraphs,
              overviewHighlights: sp.overviewHighlights?.length ? sp.overviewHighlights : ACTIVE_BUSINESS_PARK_FALLBACK.overviewHighlights,
              amenities: sp.amenities?.length ? sp.amenities : ACTIVE_BUSINESS_PARK_FALLBACK.amenities,
              specifications: custom.specifications.length ? custom.specifications : (sp.specifications?.length ? sp.specifications : ACTIVE_BUSINESS_PARK_FALLBACK.specifications),
              floorPlans: custom.floorPlans.length ? custom.floorPlans : (sp.floorPlans?.length ? sp.floorPlans : ACTIVE_BUSINESS_PARK_FALLBACK.floorPlans),
              locationImage: sp.locationImage || ACTIVE_BUSINESS_PARK_FALLBACK.locationImage,
              locationMapEmbed: sp.locationMapEmbed || ACTIVE_BUSINESS_PARK_FALLBACK.locationMapEmbed,
              locationDestinations: sp.locationDestinations?.length ? sp.locationDestinations : ACTIVE_BUSINESS_PARK_FALLBACK.locationDestinations,
              walkthroughVideoId: videoUrl,
              videoSection: custom.videoSection || { enabled: Boolean(videoUrl), title: "Construction Walkthrough", videoUrl },
              galleryImages: sp.galleryImages?.length ? sp.galleryImages.filter(img => !img.src?.includes("floor-")) : ACTIVE_BUSINESS_PARK_FALLBACK.galleryImages,
              brochureUrl: sp.brochureUrl || ACTIVE_BUSINESS_PARK_FALLBACK.brochureUrl,
              metaTitle: sp.metaTitle || ACTIVE_BUSINESS_PARK_FALLBACK.metaTitle,
              metaDescription: sp.metaDescription || ACTIVE_BUSINESS_PARK_FALLBACK.metaDescription,
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
    document.title = subpage.metaTitle || ACTIVE_BUSINESS_PARK_FALLBACK.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      created = true;
    }
    meta.content = subpage.metaDescription || ACTIVE_BUSINESS_PARK_FALLBACK.metaDescription;
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
        <StickyNav subpage={subpage} />
        <OverviewSection subpage={subpage} />
        <SpecificationsSection subpage={subpage} />
        <AmenitiesSection subpage={subpage} />
        <LocationSection subpage={subpage} />
        <FloorPlansSection subpage={subpage} />
        <WalkthroughSection subpage={subpage} />
        <GallerySection subpage={subpage} />
        <CtaSection subpage={subpage} onBrochureClick={() => setBrochurePopup(true)} />
      </main>
      <Footer />
      {brochurePopup && <BrochurePopup subpage={subpage} onClose={() => setBrochurePopup(false)} />}
    </>
  );
}
