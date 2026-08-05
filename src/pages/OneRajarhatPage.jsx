import ProjectSplitHero from "../components/ProjectSplitHero";
import { useState, useEffect, useCallback, useRef } from "react";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";
import { PROJECT_OPTIONS } from "../data/projects";
import OtpVerification, { formatIndianPhoneForLead, isValidIndianPhone } from "../components/OtpVerification";

// Helper to extract custom specifications fields
function extractSpecsAndCustomData(specsArray = []) {
  const result = {
    specifications: [],
    heroMobileUrl: "",
    companyLogoUrl: "",
    locationMapUrl: "",
    gmbGoogleIconUrl: "",
    gmbStarIconUrl: "",
    floorPlans: [],
    videoSection: null,
    gmbReviews: null
  };

  specsArray.forEach((item) => {
    if (item.title === "__hero_mobile_url__") {
      result.heroMobileUrl = item.desc;
    } else if (item.title === "__company_logo_url__") {
      result.companyLogoUrl = item.desc;
    } else if (item.title === "__location_map_url__") {
      result.locationMapUrl = item.desc;
    } else if (item.title === "__gmb_google_icon_url__") {
      result.gmbGoogleIconUrl = item.desc;
    } else if (item.title === "__gmb_star_icon_url__") {
      result.gmbStarIconUrl = item.desc;
    } else if (item.title === "__floor_plans__") {
      try {
        result.floorPlans = JSON.parse(item.desc);
      } catch (e) {
        console.error("Error parsing floor plans spec:", e);
      }
    } else if (item.title === "__video_section__") {
      try {
        result.videoSection = JSON.parse(item.desc);
      } catch (e) {
        console.error("Error parsing video section spec:", e);
      }
    } else if (item.title === "__gmb_reviews__") {
      try {
        result.gmbReviews = JSON.parse(item.desc);
      } catch (e) {
        console.error("Error parsing GMB reviews spec:", e);
      }
    } else {
      result.specifications.push(item);
    }
  });

  return result;
}

// Helper to parse video url
function parseVideoUrl(url = "") {
  if (!url) return null;
  let id = "";
  if (url.includes("youtube.com/embed/")) {
    id = url.split("embed/")[1]?.split("?")[0];
  } else if (url.includes("youtu.be/")) {
    id = url.split("youtu.be/")[1]?.split("?")[0];
  } else if (url.includes("youtube.com/watch")) {
    id = url.split("v=")[1]?.split("&")[0];
  }
  if (id) {
    return {
      embedUrl: `https://www.youtube.com/embed/${id}?autoplay=1&mute=1&controls=0&disablekb=1&fs=0&iv_load_policy=3&modestbranding=1&playsinline=1&rel=0&enablejsapi=1&loop=1&playlist=${id}`,
      thumbnail: `https://img.youtube.com/vi/${id}/maxresdefault.jpg`
    };
  }
  return { embedUrl: url, thumbnail: "" };
}


export const ONE_RAJARHAT_FALLBACK = {
  heroTitle: "One Rajarhat",
  heroTagline: "For a world-class living at the heart of the city of joy, step into the one!",
  heroLogo: "/projects/one-rajarhat/logo.webp",
  heroBg: "assets/projects/one-rajarhat/hero.webp",
  heroMobileUrl: "assets/projects/one-rajarhat/hero.webp",
  companyLogoUrl: "/projects/one-rajarhat/ruchi-logo.webp",
  locationMapUrl: "/projects/one-rajarhat/location-map.webp",
  gmbGoogleIconUrl: "",
  gmbStarIconUrl: "",
  overviewParagraphs: [
    "The lavish property of ONE RAJARHAT is situated in the smart and planned area of Rajarhat, Kolkata. The luxury residential apartments consist of 3 BHK and 4 BHK apartments and the serviced apartments consist of 1 BHK, 2 BHK and 3 BHK apartments and come with premium floorings and furnishings, making the destination a plush home for one and all.",
    "Designed by the renowned Rajinder Kumar Associates (RKA), One Rajarhat offers premium specifications, double-height lobbies, and a massive clubhouse with world-class facilities. Enjoy unmatched connectivity to the IT Hub of Sector V, financial complexes, shopping malls, and the Netaji Subhash Chandra Bose International Airport."
  ],
  overviewHighlights: [
    { label: "Residential & Serviced", desc: "Premium luxury & serviced suites.", icon: "residential" },
    { label: "1, 2, 3 & 4 BHK", desc: "Apartments from 900-3000 sq. ft.", icon: "apartment" },
    { label: "Prime Rajarhat Location", desc: "In the heart of Rajarhat, Kolkata.", icon: "location" },
    { label: "RKA Architecture", desc: "Designed by Rajinder Kumar Associates.", icon: "amenities" }
  ],
  amenities: [
    { name: "Gymnasium", icon: "gym" },
    { name: "Badminton Court", icon: "badminton" },
    { name: "Swimming Pool", icon: "pool" },
    { name: "Table Tennis Room", icon: "table-tennis" },
    { name: "Yoga/Meditation Area", icon: "yoga" },
    { name: "Steam/Sauna Room", icon: "wellness" },
    { name: "Pool and Snooker Table", icon: "snooker" },
    { name: "Jogging Track", icon: "jogging" },
    { name: "Library", icon: "library" }
  ],
  specifications: [
    {
      title: "Earthquake-Resistant Structure & Masonry",
      desc: "Engineered RCC frame structure built for maximum earthquake safety. Precision brickwork and AAC block walls with smooth Plaster of Paris interior finishing.",
      image: "/projects/one-rajarhat/gallery-aerial-photo.webp"
    },
    {
      title: "Imported Marble & Hardwood Flooring",
      desc: "Living and dining areas featuring imported marble and premium vitrified tiles. Master bedrooms with warm wooden laminate flooring, anti-skid ceramic tiles in kitchens and bathrooms, and veneer finish main entrance doors.",
      image: "/projects/one-rajarhat/gallery-living-room.webp"
    },
    {
      title: "High-End Sanitary & Modular Fittings",
      desc: "Premium sanitary ware and CP fittings from Kohler/Toto/Jaquar. Polished granite kitchen countertops with stainless steel sinks and designer ceramic wall tiles up to 7 feet.",
      image: "/projects/one-rajarhat/gallery-master-bedroom.webp"
    },
    {
      title: "Advanced Electrification & Common Facilities",
      desc: "Concealed copper wiring with modular switches (Havells/Legrand), VRV/split AC provision, double-height grand entrance lobby, 24/7 CCTV surveillance, high-speed elevators, and 100% power backup for common areas.",
      image: "/projects/one-rajarhat/gallery-lobby.webp"
    }
  ],
  floorPlans: [
    { title: "Master Plan", desc: "/projects/one-rajarhat/master-plan.webp" },
    { title: "Typical Floor Plan", desc: "/projects/one-rajarhat/floor-plan.webp" }
  ],
  locationImage: "/projects/one-rajarhat/location-map.webp",
  locationMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.0931557008127!2d88.47352331535198!3d22.57608198518174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02753a8cca9bbf%3A0xb351b88e1465e94b!2sOne%20Rajarhat!5e0!3m2!1sen!2sin!4v1691753123456!5m2!1sen!2sin",
  locationDestinations: [
    { name: "Sector V IT Hub", dist: "2.0 km" },
    { name: "City Centre II", dist: "3.5 km" },
    { name: "Tata Medical Centre", dist: "1.5 km" },
    { name: "Eco Park", dist: "1.0 km" },
    { name: "NSCB International Airport", dist: "10.0 km" },
    { name: "Mother's Wax Museum", dist: "1.2 km" },
    { name: "Ohio Hospital", dist: "1.8 km" },
    { name: "DLF IT Park", dist: "2.2 km" }
  ],
  videoSection: {
    enabled: true,
    videoUrl: "https://youtu.be/sathFPYaJ6A",
    thumbnailUrl: ""
  },
  gmbReviews: {
    enabled: false,
    googleIconUrl: "",
    starIconUrl: "",
    reviews: []
  },
  galleryImages: [
    { src: "/projects/one-rajarhat/gallery-swimming-pool.webp", alt: "Swimming Pool" },
    { src: "/projects/one-rajarhat/gallery-car-parking.webp", alt: "Car Parking" },
    { src: "/projects/one-rajarhat/gallery-terrace-view.webp", alt: "Terrace View" },
    { src: "/projects/one-rajarhat/gallery-badminton-court.webp", alt: "Badminton Court" },
    { src: "/projects/one-rajarhat/gallery-banquet.webp", alt: "Banquet" },
    { src: "/projects/one-rajarhat/gallery-gym.webp", alt: "Gymnassium" },
    { src: "/projects/one-rajarhat/gallery-living-room.webp", alt: "Living Room" },
    { src: "/projects/one-rajarhat/gallery-lobby.webp", alt: "Lobby" },
    { src: "/projects/one-rajarhat/gallery-master-bedroom.webp", alt: "Master Bedroom" },
    { src: "/projects/one-rajarhat/gallery-aerial-photo.webp", alt: "Aerial Photo" },
    { src: "/projects/one-rajarhat/gallery-night-view.webp", alt: "Night View" }
  ],
  brochureUrl: "/projects/one-rajarhat/brochure.pdf",
  metaTitle: "One Rajarhat — Luxury Residential & Serviced Apartments in Rajarhat, Kolkata | Ruchi Realty",
  metaDescription: "Discover One Rajarhat by Ruchi Realty. Offers ultra-luxury 1, 2, 3 & 4 BHK residential and serviced apartments in Rajarhat, Kolkata, featuring world-class amenities.",
  isPublished: true
};

function HighlightIcon({ icon }) {
  const key = String(icon || "").toLowerCase();
  const iconMap = {
    residential: "/projects/one-rajarhat/icon-residential.webp",
    apartment: "/projects/one-rajarhat/icon-apartment.webp",
    home: "/projects/one-rajarhat/icon-residential.webp",
    building: "/projects/one-rajarhat/icon-apartment.webp",
    location: "/projects/one-rajarhat/icon-location.webp",
    "map-pin": "/projects/one-rajarhat/icon-location.webp",
    amenities: "/projects/one-rajarhat/icon-amenities.webp",
  };

  if (iconMap[key]) {
    return <img src={iconMap[key]} alt="" className="one-raj-highlight-icon" />;
  }

  return (
    <svg className="one-raj-highlight-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="24" cy="24" r="18" />
      <path d="M12 24h24M24 12v24" />
    </svg>
  );
}

function normalizeAmenityIcon(item) {
  const raw = String(item.icon || item.image_url || item.img || item.name || "").toLowerCase();
  if (raw.includes("pool") && !raw.includes("snooker")) return "pool";
  if (raw.includes("gym")) return "gym";
  if (raw.includes("badminton")) return "badminton";
  if (raw.includes("table") || raw.includes("tennis")) return "table-tennis";
  if (raw.includes("yoga") || raw.includes("meditation")) return "yoga";
  if (raw.includes("sauna") || raw.includes("steam")) return "wellness";
  if (raw.includes("snooker") || raw.includes("pool")) return "snooker";
  if (raw.includes("jogging") || raw.includes("track")) return "jogging";
  if (raw.includes("library")) return "library";
  return "amenity";
}

function AmenityIcon({ icon }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {icon === "pool" && <path d="M6 40h36M6 36h36M10 36V20a6 6 0 0 1 12 0v16M26 36V20a6 6 0 0 1 12 0v16M10 28h12M26 28h12" />}
      {icon === "gym" && <path d="M6 26h36M10 22v8M14 18v12M24 14v20M34 18v12M38 22v8" />}
      {icon === "badminton" && <><circle cx="24" cy="24" r="2" fill="currentColor" /><path d="M24 22V6M24 26v16M14 14l14 14M20 10l14 14M34 14l-14 14" /></>}
      {icon === "table-tennis" && <><circle cx="20" cy="20" r="6" /><path d="M14 26l-5 5M20 20l4 4" /><circle cx="34" cy="14" r="3" /></>}
      {icon === "yoga" && <circle cx="24" cy="24" r="18" />}
      {icon === "wellness" && <path d="M12 24h24M24 12v24" />}
      {icon === "snooker" && <circle cx="24" cy="24" r="18" />}
      {icon === "jogging" && <path d="M12 24h24M24 12v24" />}
      {icon === "library" && <path d="M8 39.5A2.5 2.5 0 0 1 10.5 37H40M8 39.5A2.5 2.5 0 0 0 10.5 42H40M8 39.5v-30A2.5 2.5 0 0 1 10.5 7H40v30H10.5A2.5 2.5 0 0 1 8 39.5z" />}
      {!["pool", "gym", "badminton", "table-tennis", "yoga", "wellness", "snooker", "jogging", "library"].includes(icon) && (
        <><circle cx="24" cy="24" r="18" /><path d="M12 24h24M24 12v24" /></>
      )}
    </svg>
  );
}

function HeroSection({ subpage, onBrochureClick }) {
  return <ProjectSplitHero subpage={subpage} title="One Rajarhat" location="Kolkata" type="Residential" slug="one-rajarhat" onBrochure={onBrochureClick} />;
}

function StickyNav({ subpage }) {
  const [active, setActive] = useState("overview");
  const sections = [
    { id: "overview", label: "Overview" },
    subpage.amenities?.length > 0 && { id: "amenities", label: "Amenities" },
    subpage.specifications?.length > 0 && { id: "landscape", label: "Specifications" },
    subpage.floorPlans?.length > 0 && { id: "floor-plans", label: "Floor Plans" },
    (subpage.videoSection?.enabled && subpage.videoSection?.videoUrl) && { id: "walkthrough", label: "Walkthrough" },
    subpage.galleryImages?.length > 0 && { id: "gallery", label: "Gallery" },
    subpage.locationImage && { id: "location", label: "Location" },
    (subpage.gmbReviews?.enabled && subpage.gmbReviews?.reviews?.length > 0) && { id: "reviews", label: "Reviews" }
  ].filter(Boolean);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActive(entry.target.id);
      });
    }, { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" });

    sections.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [sections.map(({ id }) => id).join("|")]);

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
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
            Spacious residences<br /><span className="rr-grad">crafted for elevated living</span>
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

function AmenitiesSection({ subpage }) {
  const list = subpage.amenities || [];
  if (!list.length) return null;

  return (
    <section className="section-pad osc-section osc-section--dark" id="amenities">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: "48px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>AMENITIES</div>
              <h2>Premium leisure,<br /><span className="rr-grad">tailored for you</span></h2>
            </div>
            <p className="sec-head__lead">
              One Rajarhat features a thoughtful array of modern amenities designed to refresh, connect, and elevate your daily routine.
            </p>
          </div>
        </Reveal>
        <div className="osc-amenities__grid">
          {list.map((a, i) => (
            <Reveal key={a.name || i} delay={i * 70} className="osc-amenity-card">
              <div className="osc-amenity-card__icon">
                <AmenityIcon icon={normalizeAmenityIcon(a)} />
              </div>
              <h4 className="osc-amenity-card__name">{a.name}</h4>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandscapeFeaturesSection({ subpage }) {
  const rawSpecs = subpage.specifications || [];
  const specs = rawSpecs.filter(
    (item) => item?.title && !String(item.title).startsWith("__") && (item.desc || item.details)
  );
  if (!specs.length) return null;

  return (
    <section className="section-pad project-section project-specifications" id="landscape">
      <div className="rr-wrap">
        <Reveal>
          <div className="project-section__head">
            <span className="eyebrow">SPECIFICATIONS</span>
            <h2>Meticulous specifications,<br /><span className="rr-grad">engineered for luxury</span></h2>
          </div>
        </Reveal>
        <div className="project-spec-list">
          {specs.map((spec, index) => {
            const fallbackImgs = [
              "/projects/one-rajarhat/gallery-living-room.webp",
              "/projects/one-rajarhat/gallery-master-bedroom.webp",
              "/projects/one-rajarhat/gallery-lobby.webp",
              "/projects/one-rajarhat/gallery-aerial-photo.webp"
            ];
            const image = spec.image || spec.img || spec.src || fallbackImgs[index % fallbackImgs.length];
            const descText = spec.desc || spec.details || "";
            return (
              <article className={`project-spec-row ${index % 2 ? "is-reversed" : ""}`} key={spec.title || index}>
                <div className="project-spec-row__visual">
                  <img src={image} alt={`One Rajarhat ${spec.title}`} loading="lazy" />
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
              <h2>A closer look<br /><span className="rr-grad">at the One Rajarhat lifestyle</span></h2>
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
                aria-label={`Open ${img.alt || `One Rajarhat gallery image ${imgIdx + 1}`}`}
              >
                <div className="rimg" style={{ width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden" }}>
                  <img
                    src={img.src}
                    alt={img.alt || `One Rajarhat gallery ${imgIdx + 1}`}
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

function WalkthroughSection({ subpage }) {
  const [playing, setPlaying] = useState(true);
  const playerRef = useRef(null);
  const video = parseVideoUrl(subpage.videoSection?.videoUrl);

  const togglePlayback = () => {
    const command = playing ? "stopVideo" : "playVideo";
    playerRef.current?.contentWindow?.postMessage(JSON.stringify({ event: "command", func: command, args: [] }), "*");
    setPlaying((value) => !value);
  };

  if (!subpage.videoSection?.enabled || !subpage.videoSection?.videoUrl) return null;

  return (
    <section className="section-pad osc-section" id="walkthrough">
      <div className="rr-wrap">
        <Reveal>
          <div className="osc-walkthrough__header">
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>WALKTHROUGH</div>
              <h2 className="osc-section__title">Experience the project<br /><span className="rr-grad">through a virtual tour</span></h2>
            </div>
          </div>
        </Reveal>
        <Reveal delay={100} className="osc-video__visual">
          <div className="osc-video__frame-wrap one-rajarhat-autoplay-video">
            <iframe
              ref={playerRef}
              title="One Rajarhat walkthrough video"
              src={video?.embedUrl}
              tabIndex="-1"
              aria-hidden="true"
              style={{ pointerEvents: "none" }}
              allow="autoplay; encrypted-media"
            />
            <div className="one-rajarhat-autoplay-video__status" aria-hidden="true">
              <span className={playing ? "is-live" : ""} />{playing ? "Now playing" : "Tour stopped"}
            </div>
            <button className="one-rajarhat-autoplay-video__control" type="button" onClick={togglePlayback} aria-label={playing ? "Stop walkthrough video" : "Restart walkthrough video"}>
              {playing ? <><span className="stop-square" aria-hidden="true" />Stop tour</> : <><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="6 3 20 12 6 21" /></svg>Restart tour</>}
            </button>
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
              {gmb.googleIconUrl && <img src={gmb.googleIconUrl} alt="Google" style={{ width: "24px", height: "24px", objectFit: "contain" }} />}
              <div className="eyebrow" style={{ color: "var(--rr-indigo)", margin: 0 }}>GOOGLE REVIEWS</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
              <h2>What our clients say<br /><span className="rr-grad">about One Rajarhat</span></h2>
              {gmb.starIconUrl && (
                <div style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(20,18,26,0.04)", padding: "10px 16px", borderRadius: "30px", border: "1px solid rgba(20,18,26,0.08)" }}>
                  <img src={gmb.starIconUrl} alt="5 Stars" style={{ height: "18px", objectFit: "contain" }} />
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
                    <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "var(--rr-indigo)", color: "#fff", display: "grid", placeItems: "center", fontWeight: "600", fontSize: "16px" }}>
                      {r.author ? r.author.charAt(0) : "G"}
                    </div>
                    <div>
                      <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--rr-ink)" }}>{r.author}</h4>
                      <span style={{ fontSize: "12px", color: "rgba(20,18,26,0.5)" }}>{r.time || "Recent"}</span>
                    </div>
                  </div>
                  {gmb.starIconUrl && <img src={gmb.starIconUrl} alt="Stars" style={{ height: "14px", objectFit: "contain" }} />}
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
  const visualUrl = subpage.locationImage || ONE_RAJARHAT_FALLBACK.locationImage;
  const detailedMapUrl = subpage.locationMapUrl || ONE_RAJARHAT_FALLBACK.locationMapUrl;

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
          {visualUrl && (
            <Reveal className="osc-location__visual">
              <a href={detailedMapUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", position: "relative" }}>
                <img
                  src={visualUrl}
                  alt="One Rajarhat Location Map"
                  loading="lazy"
                  className="osc-location__img"
                  style={{ width: "100%", height: "100%", minHeight: "350px", objectFit: "cover", borderRadius: "12px" }}
                />
                <span
                  className="osc-map-zoom"
                  style={{
                    position: "absolute",
                    bottom: "16px",
                    right: "16px",
                    background: "rgba(20,18,26,0.85)",
                    color: "#fff",
                    padding: "8px 16px",
                    borderRadius: "20px",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255,255,255,0.15)"
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                  View Route Map
                </span>
              </a>
            </Reveal>
          )}
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
              <div className="osc-location__map-wrap" style={{ marginTop: "24px" }}>
                <iframe
                  title="One Rajarhat location map embed"
                  src={subpage.locationMapEmbed}
                  width="100%" height="240" style={{ border: 0, borderRadius: "8px" }}
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

function CtaSection({ subpage, onBrochureClick }) {
  return (
    <section className="section-pad osc-section" id="brochure-cta">
      <div className="rr-wrap" style={{ textAlign: "center" }}>
        <Reveal>
          <h2 className="osc-section__title" style={{ marginBottom: "16px" }}>
            Ready to own your dream residence?<br /><span className="rr-grad">Download the brochure</span>
          </h2>
          <p style={{ fontSize: "var(--rr-fs-lead)", color: "rgba(35,31,32,0.62)", lineHeight: "1.6", margin: "0 auto 36px", maxWidth: "48ch" }}>
            Get detailed information about One Rajarhat including unit plans, pricing, and project specifications.
          </p>
          <button className="submit-btn" onClick={onBrochureClick} style={{ display: "inline-flex" }}>
            Download Brochure<span className="ar">→</span>
          </button>
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

function BrochurePopup({ subpage, onClose }) {
  const [f, setF] = useState({ name: "", phone: "", email: "", project: "One Rajarhat - Kolkata", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const valid = f.name.trim() && isValidIndianPhone(f.phone) && f.email.trim() && otpVerified;

  const submit = async () => {
    if (!valid || sending) return;
    setSending(true);
    setError("");
    try {
      if (window.RuchiBackend) {
        await window.RuchiBackend.leads.createLead({
          name: f.name,
          phone: formatIndianPhoneForLead(f.phone),
          email: f.email,
          project: f.project,
          message: f.message
        });
      }
      setSent(true);
      const link = document.createElement("a");
      link.href = subpage.brochureUrl || ONE_RAJARHAT_FALLBACK.brochureUrl;
      link.download = "One-Rajarhat-Brochure.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) {
      console.error(e);
      setError("Failed to submit enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="osc-popup-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Download brochure">
      <div className="osc-popup" onClick={(e) => e.stopPropagation()}>
        <button className="osc-popup__close" onClick={onClose} aria-label="Close modal">×</button>
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
              <textarea rows={3} value={f.message} onChange={set("message")} placeholder="I'd like to know more about the project." /></div>
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

export default function OneRajarhatPage() {
  const [brochurePopup, setBrochurePopup] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const [subpage, setSubpage] = useState(ONE_RAJARHAT_FALLBACK);

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
          (p) => p.url === "/one-rajarhat" || p.title === "One Rajarhat" || p.slug === "one-rajarhat"
        );
        
        if (project) {
          const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(project.id);
          if (!active) return;
          if (sp) {
            const extracted = extractSpecsAndCustomData(sp.specifications);

            setSubpage({
              heroTitle: sp.heroTitle || ONE_RAJARHAT_FALLBACK.heroTitle,
              heroTagline: sp.heroTagline || ONE_RAJARHAT_FALLBACK.heroTagline,
              heroLogo: sp.heroLogo || ONE_RAJARHAT_FALLBACK.heroLogo,
              heroBg: sp.heroBg || ONE_RAJARHAT_FALLBACK.heroBg,
              heroMobileUrl: extracted.heroMobileUrl || ONE_RAJARHAT_FALLBACK.heroMobileUrl,
              companyLogoUrl: extracted.companyLogoUrl || ONE_RAJARHAT_FALLBACK.companyLogoUrl,
              locationMapUrl: extracted.locationMapUrl || ONE_RAJARHAT_FALLBACK.locationMapUrl,
              gmbGoogleIconUrl: extracted.gmbGoogleIconUrl || ONE_RAJARHAT_FALLBACK.gmbGoogleIconUrl,
              gmbStarIconUrl: extracted.gmbStarIconUrl || ONE_RAJARHAT_FALLBACK.gmbStarIconUrl,
              overviewParagraphs: sp.overviewParagraphs?.length ? sp.overviewParagraphs : ONE_RAJARHAT_FALLBACK.overviewParagraphs,
              overviewHighlights: sp.overviewHighlights?.length ? sp.overviewHighlights : ONE_RAJARHAT_FALLBACK.overviewHighlights,
              amenities: sp.amenities?.length ? sp.amenities : ONE_RAJARHAT_FALLBACK.amenities,
              specifications: extracted.specifications?.length ? extracted.specifications : ONE_RAJARHAT_FALLBACK.specifications,
              floorPlans: extracted.floorPlans?.length ? extracted.floorPlans : ONE_RAJARHAT_FALLBACK.floorPlans,
              locationImage: sp.locationImage || ONE_RAJARHAT_FALLBACK.locationImage,
              locationMapEmbed: sp.locationMapEmbed || ONE_RAJARHAT_FALLBACK.locationMapEmbed,
              locationDestinations: sp.locationDestinations?.length ? sp.locationDestinations : ONE_RAJARHAT_FALLBACK.locationDestinations,
              videoSection: extracted.videoSection || ONE_RAJARHAT_FALLBACK.videoSection,
              gmbReviews: extracted.gmbReviews || ONE_RAJARHAT_FALLBACK.gmbReviews,
              galleryImages: sp.galleryImages?.length ? sp.galleryImages : ONE_RAJARHAT_FALLBACK.galleryImages,
              brochureUrl: sp.brochureUrl || ONE_RAJARHAT_FALLBACK.brochureUrl,
              metaTitle: sp.metaTitle || ONE_RAJARHAT_FALLBACK.metaTitle,
              metaDescription: sp.metaDescription || ONE_RAJARHAT_FALLBACK.metaDescription,
            });
          }
        }
      } catch (err) {
        console.error("Error loading One Rajarhat subpage details:", err);
      }
    };

    fetchSubpage();
    return () => { active = false; };
  }, []);

  // Sync tab/doc meta title and description
  useEffect(() => {
    document.title = subpage.metaTitle || ONE_RAJARHAT_FALLBACK.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      created = true;
    }
    meta.content = subpage.metaDescription || ONE_RAJARHAT_FALLBACK.metaDescription;
    if (created) {
      document.head.appendChild(meta);
    }
    return () => {
      if (created) meta.remove();
    };
  }, [subpage.metaTitle, subpage.metaDescription]);

  useEffect(() => {
    const onScroll = () => {
      setNavHidden(brochurePopup || window.scrollY > window.innerHeight - 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [brochurePopup]);

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
        .one-raj-hero .osc-hero__bg img {
          object-fit: cover;
          object-position: center 46%;
          transform: scale(1.01);
        }
        .one-raj-hero .osc-hero__wrap {
          padding-top: clamp(170px, 22vh, 230px);
          padding-bottom: clamp(90px, 10vh, 120px);
        }
        .one-raj-hero__logo {
          height: clamp(58px, 7vw, 86px);
          max-width: min(320px, 80vw);
          object-fit: contain;
        }
        .one-raj-highlight-icon {
          width: 28px;
          height: 28px;
          object-fit: contain;
          color: var(--rr-lime);
          margin-bottom: 4px;
          filter: saturate(1.15);
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
        <AmenitiesSection subpage={subpage} />
        <LandscapeFeaturesSection subpage={subpage} />
        <FloorPlansSection subpage={subpage} />
        <WalkthroughSection subpage={subpage} />
        <GallerySection subpage={subpage} />
        <LocationSection subpage={subpage} />
        <GmbReviewsSection subpage={subpage} />
        <CtaSection subpage={subpage} onBrochureClick={() => setBrochurePopup(true)} />
      </main>
      <Footer />
      {brochurePopup && <BrochurePopup subpage={subpage} onClose={() => setBrochurePopup(false)} />}
      <MobileFixedCta onBrochureClick={() => setBrochurePopup(true)} />
    </>
  );
}
