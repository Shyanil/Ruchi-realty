import ProjectSplitHero from "../components/ProjectSplitHero";
import { useState, useEffect, useCallback } from "react";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";
import BrochureLeadPopup from "../components/BrochureLeadPopup";

// Helper to parse video URLs to embeddable formats or direct sources
function parseVideoUrl(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    return {
      type: "youtube",
      id: match[2],
      embedUrl: `https://www.youtube.com/embed/${match[2]}?rel=0&autoplay=1`,
      thumbnail: `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`,
    };
  }
  // Direct file extensions
  if (/\.(mp4|webm|mov|ogg)($|\?)/i.test(url)) {
    return {
      type: "direct",
      url: url,
    };
  }
  // YouTube short format support
  if (url.includes("youtube.com/shorts/")) {
    const parts = url.split("/shorts/");
    const id = parts[1]?.split("?")[0];
    if (id && id.length === 11) {
      return {
        type: "youtube",
        id: id,
        embedUrl: `https://www.youtube.com/embed/${id}?rel=0&autoplay=1`,
        thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg`,
      };
    }
  }
  return {
    type: "unknown",
    url: url,
  };
}

// Extraction helper for specs and custom data
function extractSpecsAndCustomData(specifications) {
  const specs = [];
  let gmbReviews = null;
  let videoSection = null;
  let heroMobileUrl = "";
  let companyLogoUrl = "";
  let gmbGoogleIconUrl = "";
  let gmbStarIconUrl = "";
  let locationMapUrl = "";
  let floorPlans = [];

  (specifications || []).forEach((s) => {
    if (s.title === "__gmb_reviews__") {
      try { gmbReviews = JSON.parse(s.desc); } catch (e) {}
    } else if (s.title === "__video_section__") {
      try { videoSection = JSON.parse(s.desc); } catch (e) {}
    } else if (s.title === "__hero_mobile_url__") {
      heroMobileUrl = s.desc;
    } else if (s.title === "__company_logo_url__") {
      companyLogoUrl = s.desc;
    } else if (s.title === "__gmb_google_icon_url__") {
      gmbGoogleIconUrl = s.desc;
    } else if (s.title === "__gmb_star_icon_url__") {
      gmbStarIconUrl = s.desc;
    } else if (s.title === "__location_map_url__") {
      locationMapUrl = s.desc;
    } else if (s.title === "__floor_plans__") {
      try { floorPlans = JSON.parse(s.desc); } catch (e) {}
    } else {
      specs.push(s);
    }
  });

  return {
    specifications: specs,
    gmbReviews,
    videoSection,
    heroMobileUrl,
    companyLogoUrl,
    gmbGoogleIconUrl,
    gmbStarIconUrl,
    locationMapUrl,
    floorPlans,
  };
}

const ACTIVE_ACRES_ASSET_BASE = "/projects/active-acres-angelica";

export const ACTIVE_ACRES_ANGELICA_FALLBACK = {
  heroTitle: "Angelica - Active Acres",
  heroTagline: "Starting from Rs. 2.30 Cr.*",
  heroLogo: `${ACTIVE_ACRES_ASSET_BASE}/logo.webp`,
  heroBg: `${ACTIVE_ACRES_ASSET_BASE}/hero.webp`,
  heroMobileUrl: `${ACTIVE_ACRES_ASSET_BASE}/hero-mobile.webp`,
  companyLogoUrl: `${ACTIVE_ACRES_ASSET_BASE}/ruchi-logo.webp`,
  locationMapUrl: `${ACTIVE_ACRES_ASSET_BASE}/location.webp`,
  gmbGoogleIconUrl: `${ACTIVE_ACRES_ASSET_BASE}/g-icon.webp`,
  gmbStarIconUrl: `${ACTIVE_ACRES_ASSET_BASE}/5-star.webp`,
  overviewParagraphs: [
    "One of the largest condominium projects of Kolkata, Active Acres, is spread over 16.38 acres. It has 6 towers of G+22 comprising 1,050 apartments, with a mix of 2, 3 and 4 BHK homes and penthouses. The idea behind Active Acres has been to provide residents with a superior quality of life.",
    "Architects at Agarwal and Agarwal have used their skill and innovation to bring to life a revolutionary residential complex. Angelica is located behind JW Marriott, Kolkata, with six acres of outdoor space for activity, sports, fun and relaxation."
  ],
  overviewHighlights: [
    { label: "Possession", desc: "September 2026", icon: "location" },
    { label: "Location", desc: "Behind JW Marriott, Kolkata", icon: "home" },
    { label: "Flats Type", desc: "4 BHK from Rs. 2.30 Cr.*", icon: "amenities" },
    { label: "Outdoor Space", desc: "6 Acres", icon: "security" }
  ],
  amenities: [
    { name: "Gymnasium", icon: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-1.webp` },
    { name: "Library", icon: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-2.webp` },
    { name: "Table Tennis", icon: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-3.webp` },
    { name: "Meditation Room", icon: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-4.webp` },
    { name: "Lounge", icon: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-5.webp` },
    { name: "Squash Courts", icon: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-6.webp` },
    { name: "Pool Table", icon: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-7.webp` },
    { name: "Air Hockey", icon: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-8.webp` },
    { name: "Football Ground", icon: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-9.webp` },
    { name: "Play Zone - Billiards Table", icon: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-10.webp` }
  ],
  specifications: [
    { title: "High Speed Elevators", desc: "High-speed elevators and 24 hours treated water supply support comfortable everyday living.", image: `${ACTIVE_ACRES_ASSET_BASE}/gallery/gallery-1.webp` },
    { title: "Safety & Connectivity", desc: "CCTV surveillance, intercom facility, underground electric cabling and fire-fighting arrangements provide reliable support.", image: `${ACTIVE_ACRES_ASSET_BASE}/gallery/gallery-2.webp` },
    { title: "Infrastructure", desc: "Concrete and interlocking pebble roads, plus power back-up for common areas, create a well-planned residential environment.", image: `${ACTIVE_ACRES_ASSET_BASE}/gallery/gallery-3.webp` },
    { title: "Project Details", desc: "HIRA Registration No: HIRA/P/KOL/2020/000778. Contact: 033 6902 9144 | emarketing@ruchirealty.com.", image: `${ACTIVE_ACRES_ASSET_BASE}/gallery/gallery-4.webp` }
  ],
  floorPlans: [
    { title: "Master Plan 1", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/master-1.webp` },
    { title: "Master Plan 2", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/master-2.webp` },
    { title: "Master Plan 3", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/master-3.webp` },
    { title: "4 BHK Plan 1", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/4bhk-1.webp` },
    { title: "4 BHK Plan 2", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/4bhk-2.webp` },
    { title: "3 BHK Plan 1", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/3bhk-1.webp` },
    { title: "3 BHK Plan 2", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/3bhk-2.webp` },
    { title: "3 BHK Plan 3", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/3bhk-3.webp` },
    { title: "3 BHK Plan 4", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/3bhk-4.webp` },
    { title: "2 BHK Plan 1", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/2bhk-1.webp` },
    { title: "2 BHK Plan 2", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/2bhk-2.webp` },
    { title: "2 BHK Plan 3", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/2bhk-3.webp` },
    { title: "2 BHK Plan 4", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/2bhk-4.webp` },
    { title: "2 BHK Plan 5", desc: `${ACTIVE_ACRES_ASSET_BASE}/plans/2bhk-5.webp` }
  ],
  locationImage: `${ACTIVE_ACRES_ASSET_BASE}/location.webp`,
  locationMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.636603099951!2d88.38883597603706!3d22.555291233633633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768f51a44c79%3A0xe5a13318281cb9f2!2sActive%20Acres!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin",
  locationDestinations: [
    { name: "JW Marriott", dist: "1 km" }, { name: "Hospital", dist: "3 km" },
    { name: "Well Known Schools", dist: "2 km" }, { name: "Mall", dist: "2 km" },
    { name: "International Airport", dist: "20 km" }
  ],
  videoSection: { enabled: true, videoUrl: "https://youtu.be/GTYs3ZynAQU", thumbnailUrl: `${ACTIVE_ACRES_ASSET_BASE}/testimonial-thumbnail.webp` },
  gmbReviews: {
    enabled: true, googleIconUrl: `${ACTIVE_ACRES_ASSET_BASE}/g-icon.webp`, starIconUrl: `${ACTIVE_ACRES_ASSET_BASE}/5-star.webp`,
    reviews: [
      { author: "Jyotirmoy Hajra", avatar: `${ACTIVE_ACRES_ASSET_BASE}/reviews/user-1.webp`, rating: 5, time: "7 years ago", text: "One of the largest condominium projects of Kolkata, Active Acres is spread over 16.38 acres. Its six towers offer 2, 3 and 4 BHK apartments and penthouses, with a focus on activity, outdoor sports, fun and relaxation." },
      { author: "MD FAIYAZ", avatar: `${ACTIVE_ACRES_ASSET_BASE}/reviews/user-2.webp`, rating: 5, time: "7 months ago", text: "Great location and connectivity. The society is great to live in with all amenities, huge indoor and outdoor sports activities, and six acres of land." },
      { author: "Shristy Ranka", avatar: `${ACTIVE_ACRES_ASSET_BASE}/reviews/user-3.webp`, rating: 5, time: "7 months ago", text: "One of the best projects in Kolkata, with good connectivity. Schools, hospitals and markets are very close to the project." },
      { author: "Sandip Banerjee", avatar: `${ACTIVE_ACRES_ASSET_BASE}/reviews/user-4.webp`, rating: 5, time: "a year ago", text: "An extraordinary project in central Kolkata with six acres of open green space, big trees, football, cricket, tennis and basketball, closely connected with the city and airport." }
    ]
  },
  galleryImages: [
    ...Array.from({ length: 6 }, (_, index) => ({
      src: `${ACTIVE_ACRES_ASSET_BASE}/gallery/gallery-${index + 1}.webp`,
      largeSrc: `${ACTIVE_ACRES_ASSET_BASE}/gallery/gallery-${index + 1}-large.webp`,
      alt: `Angelica Active Acres gallery image ${index + 1}`
    })),
    ...Array.from({ length: 10 }, (_, index) => ({
      src: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-${index + 1}.webp`,
      largeSrc: `${ACTIVE_ACRES_ASSET_BASE}/amenities/amenity-${index + 1}.webp`,
      alt: `Active Acres Angelica amenity ${index + 1}`
    }))
  ],
  brochureUrl: "",
  metaTitle: "Angelica - Active Acres | 4 BHK Apartments in Kolkata | Ruchi Realty",
  metaDescription: "Angelica at Active Acres offers 4 BHK residences from Rs. 2.30 Cr.* behind JW Marriott, Kolkata, with six acres of outdoor space and a September 2026 possession timeline."
};

function HeroSection({ subpage, onBrochureClick }) {
  return <ProjectSplitHero subpage={subpage} title="Angelica - Active Acres" location="Behind JW Marriott, Kolkata" type="Residential" slug="active-acres-angelica" onBrochure={onBrochureClick} />;
}

function StickyNav({ subpage }) {
  const [active, setActive] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview" },
    subpage.specifications?.length > 0 && { id: "specifications", label: "Specifications" },
    subpage.amenities?.length > 0 && { id: "amenities", label: "Amenities" },
    subpage.floorPlans?.length > 0 && { id: "floor-plans", label: "Floor Plans" },
    subpage.galleryImages?.length > 0 && { id: "gallery", label: "Gallery" },
    (subpage.videoSection?.enabled && subpage.videoSection?.videoUrl) && { id: "walkthrough", label: "Testimonials" },
    (subpage.gmbReviews?.enabled && subpage.gmbReviews?.reviews?.length > 0) && { id: "reviews", label: "Reviews" },
    subpage.locationImage && { id: "location", label: "Location" }
  ].filter(Boolean);

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
            One of Kolkata's Largest Condominiums,<br /><span className="rr-grad">spread over 16.38 Acres</span>
          </h2>
        </Reveal>
        <div className="osc-overview__grid">
          <Reveal className="osc-overview__text">
            {(subpage.overviewParagraphs || []).map((p, idx) => (
              <p key={idx}>{p}</p>
            ))}
          </Reveal>
          {subpage.overviewHighlights?.length > 0 && (
            <div className="osc-overview__stats">
              {subpage.overviewHighlights.map((h, i) => (
                <Reveal key={h.label || i} delay={i * 70} className="osc-stat-card">
                  <span className="osc-stat-card__label">{h.label}</span>
                  <span className="osc-stat-card__desc">{h.desc}</span>
                </Reveal>
              ))}
            </div>
          )}
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
            <h2>Architecture and features,<br /><span className="rr-grad">crafted to perfection</span></h2>
          </div>
        </Reveal>
        <div className="project-spec-list">
          {specs.map((spec, index) => {
            const image = spec.image || spec.img || spec.src || `assets/projects/active-acres-angelica/gallery-${(index % 4) + 1}.webp`;
            const descText = spec.desc || spec.details || "";
            return (
              <article className={`project-spec-row ${index % 2 ? "is-reversed" : ""}`} key={spec.title || index}>
                <div className="project-spec-row__visual">
                  <img decoding="async" src={image} alt={`Angelica ${spec.title}`} loading="lazy" />
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
  if (!subpage.amenities || !subpage.amenities.length) return null;

  return (
    <section className="section-pad osc-section osc-section--dark" id="amenities">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: "48px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>AMENITIES</div>
              <h2>World-class amenities,<br /><span className="rr-grad">tailored for complete luxury</span></h2>
            </div>
            <p className="sec-head__lead">
              Active Acres Angelica features a rich array of indoor and outdoor leisure facilities designed for wellness, sports, and recreation.
            </p>
          </div>
        </Reveal>
        <div className="osc-amenities__grid">
          {subpage.amenities.map((a, i) => {
            const iconKey = a.icon || a.image_url || a.img || "";
            const isUrl = iconKey.startsWith("http") || iconKey.includes(".") || iconKey.includes("/");
            
            return (
              <Reveal key={a.name || i} delay={i * 70} className="osc-amenity-card">
                <div className="osc-amenity-card__icon" style={{ display: "flex", justifyContent: "center", alignItems: "center", background: "rgba(245,244,241,0.08)", padding: "10px", borderRadius: "50%", width: "52px", height: "52px", color: "var(--rr-paper)" }}>
                  {isUrl ? (
                    <img decoding="async" loading="lazy" src={iconKey} alt={a.name} style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                  ) : (
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                      <circle cx="24" cy="24" r="18" />
                      <path d="M12 24h24M24 12v24" />
                    </svg>
                  )}
                </div>
                <h4 className="osc-amenity-card__name" style={{ marginTop: "12px", fontSize: "14px", fontWeight: "var(--rr-w-medium)", color: "var(--rr-paper)" }}>{a.name}</h4>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FloorPlansSection({ subpage }) {
  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const plans = subpage.floorPlans || [];

  if (!plans.length) return null;

  return (
    <section className="section-pad osc-section osc-section--dark" id="floor-plans">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: "32px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>FLOOR PLANS</div>
              <h2>Spacious layouts,<br /><span className="rr-grad">carefully planned structures</span></h2>
            </div>
          </div>
        </Reveal>

        <div className="osc-floorplans__layout" style={{ marginTop: "24px" }}>
          <Reveal className="osc-floorplans__tabs" style={{ display: "flex", gap: "12px", marginBottom: "30px", flexWrap: "wrap" }}>
            {plans.map((p, idx) => (
              <button
                key={p.title || idx}
                type="button"
                className={`submit-btn ${activePlanIdx === idx ? "" : "ab-btn-outline ab-btn-outline--white"}`}
                style={{
                  padding: "10px 24px",
                  fontSize: "13px",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  background: activePlanIdx === idx ? "var(--rr-lime)" : "transparent",
                  color: activePlanIdx === idx ? "var(--rr-ink)" : "#fff",
                  border: "1px solid var(--rr-lime)",
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

          <Reveal key={activePlanIdx} className="osc-floorplans__viewer" style={{ background: "rgba(255,255,255,0.03)", padding: "20px", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "center", alignItems: "center" }}>
            {plans[activePlanIdx] && plans[activePlanIdx].desc && (
              <img decoding="async" loading="lazy"
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
              <h2>A glimpse into<br /><span className="rr-grad">the Angelica lifestyle</span></h2>
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
                aria-label={`Open ${img.alt || `Angelica gallery image ${imgIdx + 1}`}`}
              >
                <div className="rimg" style={{ width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden" }}>
                  <img decoding="async"
                    src={img.src}
                    alt={img.alt || `Angelica gallery ${imgIdx + 1}`}
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
            <img decoding="async" loading="lazy" src={images[lightboxIndex].largeSrc || images[lightboxIndex].src} alt={images[lightboxIndex].alt || `Gallery image ${lightboxIndex + 1}`} style={{ width: "100%", height: "100%", objectFit: "contain", background: "transparent" }} />
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

function WalkthroughSection({ subpage }) {
  const [playing, setPlaying] = useState(false);
  const video = parseVideoUrl(subpage.videoSection?.videoUrl);
  const thumbnail = subpage.videoSection?.thumbnailUrl || video?.thumbnail;

  if (!subpage.videoSection?.enabled || !subpage.videoSection?.videoUrl) return null;

  return (
    <section className="section-pad osc-section" id="walkthrough">
      <div className="rr-wrap">
        <Reveal>
          <div className="osc-walkthrough__header" style={{ marginBottom: "40px" }}>
            <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>TESTIMONIALS</div>
            <h2 className="osc-section__title">
              Hear from our community<br /><span className="rr-grad">at Active Acres Angelica</span>
            </h2>
            <p className="osc-walkthrough__lead" style={{ color: "rgba(35,31,32,0.62)" }}>
              Watch a testimonial from the Active Acres community and discover the experience of living here.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80} className="osc-walkthrough__video-wrap">
          <div className="osc-walkthrough__frame">
            {playing && video ? (
              video.type === "youtube" ? (
                <iframe
                  src={video.embedUrl}
                  title="Active Acres testimonial video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={video.url} controls autoPlay style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )
            ) : (
              <button type="button" className="osc-walkthrough__play-btn" onClick={() => setPlaying(true)} aria-label="Play testimonial video">
                <img decoding="async" src={thumbnail || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"} alt="Active Acres testimonial video thumbnail" loading="lazy" />
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

function GmbReviewsSection({ subpage }) {
  const gmb = subpage.gmbReviews;
  if (!gmb || !gmb.enabled || !gmb.reviews || !gmb.reviews.length) return null;

  return (
    <section className="section-pad osc-section" id="reviews" style={{ backgroundColor: "rgba(20,18,26,0.02)" }}>
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head" style={{ marginBottom: "48px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "8px" }}>
              {gmb.googleIconUrl && <img decoding="async" loading="lazy" src={gmb.googleIconUrl} alt="Google" style={{ width: "24px", height: "24px", objectFit: "contain" }} />}
              <div className="eyebrow" style={{ color: "var(--rr-indigo)", margin: 0 }}>GOOGLE REVIEWS</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
              <h2>What our clients say<br /><span className="rr-grad">about Active Acres</span></h2>
              {gmb.starIconUrl && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(20,18,26,0.04)", padding: "10px 16px", borderRadius: "30px", border: "1px solid rgba(20,18,26,0.08)" }}>
                  <img decoding="async" loading="lazy" src={gmb.starIconUrl} alt="5 Stars" style={{ height: "18px", objectFit: "contain" }} />
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>4.8 / 5 Rating</span>
                </div>
              )}
            </div>
          </div>
        </Reveal>

        <div className="gmb-reviews__grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          {gmb.reviews.map((r, i) => (
            <Reveal key={i} delay={i * 80} className="gmb-review-card" style={{ background: "var(--rr-paper-pure)", padding: "24px", borderRadius: "12px", boxShadow: "0 10px 30px rgba(20,18,26,0.04)", border: "1px solid rgba(20,18,26,0.06)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                  <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                    {r.avatar ? (
                      <img decoding="async" loading="lazy" src={r.avatar} alt="" style={{ width: "40px", height: "40px", borderRadius: "50%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--rr-indigo)", color: "#fff", display: "grid", placeItems: "center", fontWeight: "600", fontSize: "16px" }}>
                        {r.author ? r.author.charAt(0) : "G"}
                      </div>
                    )}
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--rr-ink)" }}>{r.author}</h4>
                      <span style={{ fontSize: "12px", color: "rgba(20,18,26,0.5)" }}>{r.time || "Recent"}</span>
                    </div>
                  </div>
                  {gmb.starIconUrl && <img decoding="async" loading="lazy" src={gmb.starIconUrl} alt="Stars" style={{ height: "14px", objectFit: "contain" }} />}
                </div>
                <p style={{ fontSize: "14px", lineHeight: "1.6", color: "rgba(20,18,26,0.7)", fontStyle: "italic", margin: 0 }}>
                  "{r.text}"
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection({ subpage }) {
  const mapUrl = subpage.locationImage || subpage.locationMapUrl || ACTIVE_ACRES_ANGELICA_FALLBACK.locationMapUrl;

  return (
    <section className="section-pad osc-section osc-section--dark" id="location">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: "48px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>LOCATION</div>
              <h2>Prime location,<br /><span className="rr-grad">unmatched connectivity</span></h2>
            </div>
          </div>
        </Reveal>
        <div className="osc-location__grid">
          {mapUrl && (
            <Reveal className="osc-location__visual">
              <img decoding="async" src={mapUrl} alt="Active Acres Location Map" loading="lazy" className="osc-location__img" />
            </Reveal>
          )}
          <Reveal delay={80} className="osc-location__info">
            <h3 className="osc-location__heading">Key Destinations</h3>
            <p style={{ color: "rgba(245,244,241,0.62)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>
              At Active Acres, the best of East Kolkata is outside your doorstep. Whether you are traveling by metro, cab, or train, commuting from one place to another is extremely simple. Located at a very prompt location connecting everywhere.
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
                  title="Active Acres location map embed"
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

function BrochurePopup({ subpage, onClose }) {
  return <BrochureLeadPopup project="Active Acres - Kolkata" city="Kolkata" slug="active-acres-angelica" source="Angelica page brochure download" brochureUrl={subpage.brochureUrl || ACTIVE_ACRES_ANGELICA_FALLBACK.brochureUrl} onClose={onClose} />;
}

function CtaSection({ subpage, onBrochureClick }) {
  return (
    <section className="section-pad osc-section" id="brochure-cta">
      <div className="rr-wrap" style={{ textAlign: "center" }}>
        <Reveal>
          <h2 className="osc-section__title" style={{ marginBottom: "16px" }}>
            Ready to own your dream residence?<br /><span className="rr-grad">Download the brochure</span>
          </h2>
          <p style={{ fontSize: "var(--rr-fs-lead)", color: "rgba(35,31,32,0.62)", lineHeight: "1.6", margin: "0 auto 36px", maxWidth: "48ch" }}>
            Get detailed information about Active Acres Angelica including unit plans, pricing, and project specifications.
          </p>
          <button className="submit-btn" onClick={onBrochureClick} style={{ display: "inline-flex" }}>
            Download Brochure<span className="ar">→</span>
          </button>
          <p style={{ fontSize: "12px", color: "rgba(35,31,32,0.45)", marginTop: "24px" }}>
            HIRA Registration No: HIRA/P/KOL/2020/000778 | Contact: 03369029144 | emarketing@ruchirealty.com
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function MobileFixedCta({ onBrochureClick }) {
  return (
    <div className="mobile-fixed-cta">
      <button className="submit-btn" onClick={onBrochureClick} style={{ width: "100%", justifyContent: "center" }}>
        Enquire Now <span className="ar">→</span>
      </button>
    </div>
  );
}

export default function ActiveAcresAngelicaPage() {
  const [brochurePopup, setBrochurePopup] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [subpage, setSubpage] = useState(ACTIVE_ACRES_ANGELICA_FALLBACK);

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
          (p) => p.url === "/active-acres-angelica" || p.url === "/projects/active-acres-angelica" || p.title === "Active Acres Angelica" || p.title === "Active Acres" || p.slug === "active-acres-angelica" || p.slug === "active-acres-kolkata"
        );
        
        if (project) {
          const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(project.id);
          if (!active) return;
          if (sp) {
            const extracted = extractSpecsAndCustomData(sp.specifications);

            setSubpage({
              heroTitle: sp.heroTitle || ACTIVE_ACRES_ANGELICA_FALLBACK.heroTitle,
              heroTagline: sp.heroTagline || ACTIVE_ACRES_ANGELICA_FALLBACK.heroTagline,
              heroLogo: sp.heroLogo || ACTIVE_ACRES_ANGELICA_FALLBACK.heroLogo,
              heroBg: sp.heroBg || ACTIVE_ACRES_ANGELICA_FALLBACK.heroBg,
              heroMobileUrl: extracted.heroMobileUrl || ACTIVE_ACRES_ANGELICA_FALLBACK.heroMobileUrl,
              companyLogoUrl: extracted.companyLogoUrl || ACTIVE_ACRES_ANGELICA_FALLBACK.companyLogoUrl,
              locationMapUrl: extracted.locationMapUrl || ACTIVE_ACRES_ANGELICA_FALLBACK.locationMapUrl,
              gmbGoogleIconUrl: extracted.gmbGoogleIconUrl || ACTIVE_ACRES_ANGELICA_FALLBACK.gmbGoogleIconUrl,
              gmbStarIconUrl: extracted.gmbStarIconUrl || ACTIVE_ACRES_ANGELICA_FALLBACK.gmbStarIconUrl,
              overviewParagraphs: sp.overviewParagraphs?.length ? sp.overviewParagraphs : ACTIVE_ACRES_ANGELICA_FALLBACK.overviewParagraphs,
              overviewHighlights: sp.overviewHighlights?.length ? sp.overviewHighlights : ACTIVE_ACRES_ANGELICA_FALLBACK.overviewHighlights,
              amenities: sp.amenities?.length ? sp.amenities : ACTIVE_ACRES_ANGELICA_FALLBACK.amenities,
              specifications: extracted.specifications?.length ? extracted.specifications : ACTIVE_ACRES_ANGELICA_FALLBACK.specifications,
              floorPlans: extracted.floorPlans?.length ? extracted.floorPlans : ACTIVE_ACRES_ANGELICA_FALLBACK.floorPlans,
              locationImage: sp.locationImage || ACTIVE_ACRES_ANGELICA_FALLBACK.locationImage,
              locationMapEmbed: sp.locationMapEmbed || ACTIVE_ACRES_ANGELICA_FALLBACK.locationMapEmbed,
              locationDestinations: sp.locationDestinations?.length ? sp.locationDestinations : ACTIVE_ACRES_ANGELICA_FALLBACK.locationDestinations,
              videoSection: extracted.videoSection || ACTIVE_ACRES_ANGELICA_FALLBACK.videoSection,
              gmbReviews: extracted.gmbReviews || ACTIVE_ACRES_ANGELICA_FALLBACK.gmbReviews,
              galleryImages: sp.galleryImages?.length ? sp.galleryImages : ACTIVE_ACRES_ANGELICA_FALLBACK.galleryImages,
              brochureUrl: sp.brochureUrl || ACTIVE_ACRES_ANGELICA_FALLBACK.brochureUrl,
              metaTitle: sp.metaTitle || ACTIVE_ACRES_ANGELICA_FALLBACK.metaTitle,
              metaDescription: sp.metaDescription || ACTIVE_ACRES_ANGELICA_FALLBACK.metaDescription,
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
    document.title = subpage.metaTitle || ACTIVE_ACRES_ANGELICA_FALLBACK.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      created = true;
    }
    meta.content = subpage.metaDescription || ACTIVE_ACRES_ANGELICA_FALLBACK.metaDescription;
    if (created) {
      document.head.appendChild(meta);
    }
    return () => {
      if (created) meta.remove();
    };
  }, [subpage.metaTitle, subpage.metaDescription]);

  return (
    <>
      <style>{`
        .mobile-fixed-cta {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: var(--rr-paper);
          border-top: 1px solid rgba(20,18,26,0.08);
          padding: 12px 16px;
          z-index: 99;
          display: flex;
          justify-content: center;
          box-shadow: 0 -4px 20px rgba(0,0,0,0.05);
        }
        @media (min-width: 641px) {
          .mobile-fixed-cta {
            display: none;
          }
        }
        body {
          padding-bottom: 70px;
        }
        @media (min-width: 641px) {
          body {
            padding-bottom: 0;
          }
        }
      `}</style>
      <Nav onContact={onContact} hidden={navHidden} solid />
      <main>
        <HeroSection subpage={subpage} onBrochureClick={() => setBrochurePopup(true)} />
        <StickyNav subpage={subpage} />
        <OverviewSection subpage={subpage} />
        <SpecificationsSection subpage={subpage} />
        <AmenitiesSection subpage={subpage} />
        <FloorPlansSection subpage={subpage} />
        <WalkthroughSection subpage={subpage} />
        <GallerySection subpage={subpage} />
        <GmbReviewsSection subpage={subpage} />
        <LocationSection subpage={subpage} />
        <CtaSection subpage={subpage} onBrochureClick={() => setBrochurePopup(true)} />
      </main>
      <Footer />
      {brochurePopup && <BrochurePopup subpage={subpage} onClose={() => setBrochurePopup(false)} />}
      <MobileFixedCta onBrochureClick={() => setBrochurePopup(true)} />
    </>
  );
}
