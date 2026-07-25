import ProjectSplitHero from "../components/ProjectSplitHero";
import { useState, useEffect, useCallback } from "react";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";
import { PROJECT_OPTIONS } from "../data/projects";

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

const fallbackData = {
  heroTitle: "Active Acres Angelica",
  heroTagline: "Premium High-Rise Residential Living",
  heroLogo: "assets/projects/active-acres-angelica/logo.png",
  heroBg: "assets/projects/active-acres-angelica/hero.webp",
  heroMobileUrl: "assets/projects/active-acres-angelica/hero-sm.webp",
  companyLogoUrl: "assets/projects/active-acres-angelica/ruchi_logo.png",
  locationMapUrl: "assets/projects/active-acres-angelica/location-map.jpg",
  gmbGoogleIconUrl: "assets/projects/active-acres-angelica/g-icon.png",
  gmbStarIconUrl: "assets/projects/active-acres-angelica/5-star.png",
  overviewParagraphs: [
    "Angelica is the premium high-rise residential tower at Active Acres, Kolkata. Located strategically in Tangra, it offers beautifully crafted 3 BHK and 4 BHK residences designed for modern families seeking a balance of luxury, community, and serenity.",
    "With sprawling green landscape features, state-of-the-art amenities, and unmatched connectivity to E.M. Bypass, Salt Lake Sector V, and Park Street, Angelica is the ultimate address to grow, live, and create beautiful memories with your loved ones."
  ],
  overviewHighlights: [
    { label: "Prime Location", desc: "Located in Tangra, just off the E.M. Bypass connector.", icon: "location" },
    { label: "Spacious Living", desc: "Thoughtfully designed 3 BHK & 4 BHK apartments.", icon: "home" },
    { label: "Rich Amenities", desc: "Exclusive gymnasium, library, and table tennis.", icon: "amenities" },
    { label: "Secure Living", desc: "24/7 gated security with CCTV surveillance.", icon: "security" }
  ],
  amenities: [
    { name: "Gymnasium", icon: "gym" },
    { name: "Library", icon: "library" },
    { name: "Table Tennis", icon: "table-tennis" }
  ],
  specifications: [
    { title: "Lush Central Lawn", desc: "Beautifully manicured lawns providing open green spaces for residents." },
    { title: "Kids Play Area", desc: "A safe and vibrant outdoor play area designed for children." },
    { title: "Senior Citizen Corner", desc: "Quiet, comfortable seating zones set in landscaped surroundings." },
    { title: "Paved Walkways", desc: "Dedicated jogging and walking tracks running throughout the community." }
  ],
  floorPlans: [
    { title: "3 BHK Unit Plan", desc: "assets/projects/active-acres-angelica/location-map.jpg" },
    { title: "4 BHK Unit Plan", desc: "assets/projects/active-acres-angelica/location-map.jpg" }
  ],
  locationImage: "assets/projects/active-acres-angelica/location-map.jpg",
  locationMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.636603099951!2d88.38883597603706!3d22.555291233633633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768f51a44c79%3A0xe5a13318281cb9f2!2sActive%20Acres!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin",
  locationDestinations: [
    { name: "E.M. Bypass", dist: "1.0 km" },
    { name: "ITC Sonar", dist: "1.5 km" },
    { name: "Science City", dist: "2.0 km" },
    { name: "Park Street", dist: "4.5 km" },
    { name: "Kolkata Airport", dist: "16.0 km" }
  ],
  videoSection: {
    enabled: true,
    videoUrl: "https://youtu.be/GTYs3ZynAQU",
    thumbnailUrl: "assets/projects/active-acres-angelica/video-thumbnail.jpg"
  },
  gmbReviews: {
    enabled: true,
    googleIconUrl: "assets/projects/active-acres-angelica/g-icon.png",
    starIconUrl: "assets/projects/active-acres-angelica/5-star.png",
    reviews: [
      { author: "Ramesh Kumar", rating: 5, text: "Excellent residential tower inside Active Acres. The construction quality is top-notch, and the amenities like the library and table tennis are very well maintained. Extremely peaceful environment.", time: "1 month ago" },
      { author: "Ananya Sen", rating: 5, text: "Beautiful landscape gardens and wide roads. The new Angelica tower has a great location in Tangra, Kolkata, with very good connectivity to IT hubs and E.M. Bypass.", time: "2 weeks ago" },
      { author: "Debabrata Bose", rating: 5, text: "The layout of the apartment is very spacious with plenty of natural light and ventilation. Very satisfied with the Ruchi Realty team and their customer service.", time: "3 months ago" }
    ]
  },
  galleryImages: [
    { src: "assets/projects/active-acres-angelica/gallery-1.webp", alt: "Angelica Exterior Perspective" },
    { src: "assets/projects/active-acres-angelica/gallery-2.webp", alt: "Angelica Entrance Lobby" },
    { src: "assets/projects/active-acres-angelica/gallery-3.webp", alt: "Angelica Landscape View" },
    { src: "assets/projects/active-acres-angelica/gallery-4.webp", alt: "Angelica Clubhouse Interiors" },
    { src: "assets/projects/active-acres-angelica/gallery-5.webp", alt: "Angelica Show Flat Bedroom" },
    { src: "assets/projects/active-acres-angelica/gallery-6.webp", alt: "Angelica Show Flat Living Room" }
  ],
  brochureUrl: "assets/projects/active-acres-angelica/brochure.pdf",
  metaTitle: "Active Acres Angelica | Premium 3 & 4 BHK Apartments in Kolkata | Ruchi Realty",
  metaDescription: "Explore Active Acres Angelica by Ruchi Realty. Located in Kolkata, this premium residential project offers luxury 3 BHK and 4 BHK apartments with world-class amenities."
};

function HeroSection({ subpage, onBrochureClick }) {
  return <ProjectSplitHero subpage={subpage} title="Active Acres Angelica" location="Kolkata" type="Residential" slug="active-acres-angelica" onBrochure={onBrochureClick} />;
}

function StickyNav({ subpage }) {
  const [active, setActive] = useState("overview");

  const sections = [
    { id: "overview", label: "Overview" },
    subpage.amenities?.length > 0 && { id: "amenities", label: "Amenities" },
    subpage.specifications?.length > 0 && { id: "landscape", label: "Landscape" },
    subpage.floorPlans?.length > 0 && { id: "floor-plans", label: "Floor Plans" },
    subpage.galleryImages?.length > 0 && { id: "gallery", label: "Gallery" },
    (subpage.videoSection?.enabled && subpage.videoSection?.videoUrl) && { id: "walkthrough", label: "Walkthrough" },
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
            Spacious residences<br /><span className="rr-grad">crafted for elevated living.</span>
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
  if (!subpage.amenities || !subpage.amenities.length) return null;

  return (
    <section className="section-pad osc-section osc-section--dark" id="amenities">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: "48px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>AMENITIES</div>
              <h2>Premium leisure,<br /><span className="rr-grad">tailored for you.</span></h2>
            </div>
            <p className="sec-head__lead">
              Active Acres Angelica features a thoughtful array of modern amenities designed to refresh, connect, and elevate your daily routine.
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
                    <img src={iconKey} alt={a.name} style={{ width: "32px", height: "32px", objectFit: "contain" }} />
                  ) : (
                    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: "24px", height: "24px" }}>
                      {iconKey === "pool" && (
                        <>
                          <path d="M6 40h36M6 36h36" />
                          <path d="M10 36V20a6 6 0 0 1 12 0v16M26 36V20a6 6 0 0 1 12 0v16" />
                          <path d="M10 28h12M26 28h12" />
                        </>
                      )}
                      {iconKey === "gym" && (
                        <>
                          <path d="M6 26h36" />
                          <path d="M10 22v8" />
                          <path d="M14 18v12" />
                          <path d="M24 14v20" />
                          <path d="M34 18v12" />
                          <path d="M38 22v8" />
                        </>
                      )}
                      {iconKey === "library" && (
                        <path d="M8 39.5A2.5 2.5 0 0 1 10.5 37H40M8 39.5A2.5 2.5 0 0 0 10.5 42H40M8 39.5v-30A2.5 2.5 0 0 1 10.5 7H40v30H10.5A2.5 2.5 0 0 1 8 39.5z" />
                      )}
                      {iconKey === "table-tennis" && (
                        <>
                          <circle cx="20" cy="20" r="6" />
                          <path d="M14 26l-5 5M20 20l4 4" />
                          <circle cx="34" cy="14" r="3" />
                        </>
                      )}
                      {iconKey === "hall" && (
                        <>
                          <rect x="6" y="14" width="36" height="20" rx="2" />
                          <path d="M6 34v4h36v-4" />
                          <path d="M22 20h4v8h-4z" />
                        </>
                      )}
                      {iconKey === "badminton" && (
                        <>
                          <circle cx="24" cy="24" r="2" fill="currentColor" />
                          <path d="M24 22V6M24 26v16M14 14l14 14M20 10l14 14" />
                          <path d="M34 14l-14 14" />
                        </>
                      )}
                      {iconKey === "tennis" && (
                        <>
                          <circle cx="24" cy="24" r="18" />
                          <path d="M24 6a18 18 0 0 0 0 36" />
                          <path d="M6 24h36" />
                        </>
                      )}
                      {!["pool", "gym", "library", "table-tennis", "hall", "badminton", "tennis"].includes(iconKey) && (
                        <>
                          <circle cx="24" cy="24" r="18" />
                          <path d="M12 24h24M24 12v24" />
                        </>
                      )}
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

function LandscapeFeaturesSection({ subpage }) {
  if (!subpage.specifications || !subpage.specifications.length) return null;

  return (
    <section className="section-pad osc-section" id="landscape">
      <div className="rr-wrap">
        <Reveal>
          <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>LANDSCAPE</div>
          <h2 className="osc-section__title">
            Natural landscape<br /><span className="rr-grad">and modern features.</span>
          </h2>
        </Reveal>
        <div className="osc-specs__layout">
          <Reveal className="osc-specs__visual">
            <img src={subpage.galleryImages?.[2]?.src || subpage.heroBg || fallbackData.heroBg} alt="Angelica Landscape" loading="lazy" className="osc-specs__img" />
          </Reveal>
          <div className="osc-specs__cards">
            {subpage.specifications.map((s, i) => (
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
              <h2>Spacious layouts,<br /><span className="rr-grad">carefully planned structures.</span></h2>
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
    <section className="section-pad osc-section osc-section--dark" id="gallery">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark" style={{ marginBottom: "48px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>GALLERY</div>
              <h2>A glimpse into<br /><span className="rr-grad">the Angelica lifestyle.</span></h2>
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
          <button type="button" className="osc-lightbox__arrow osc-lightbox__arrow--prev" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p === 0 ? images.length - 1 : p - 1)); }} aria-label="Previous">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
            </svg>
          </button>
          <div className="osc-lightbox__content" onClick={(e) => e.stopPropagation()}>
            <img src={images[lightbox].src} alt={images[lightbox].alt} className="osc-lightbox__img" />
            <p className="osc-lightbox__caption">{images[lightbox].alt}</p>
          </div>
          <button type="button" className="osc-lightbox__arrow osc-lightbox__arrow--next" onClick={(e) => { e.stopPropagation(); setLightbox((p) => (p === images.length - 1 ? 0 : p + 1)); }} aria-label="Next">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </button>
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
            <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>WALKTHROUGH</div>
            <h2 className="osc-section__title">
              Angelica Video Walkthrough<br /><span className="rr-grad">experience the residences.</span>
            </h2>
            <p className="osc-walkthrough__lead" style={{ color: "rgba(35,31,32,0.62)" }}>
              Take a virtual walkthrough of our project to explore premium finishes, layout, and landscaping.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80} className="osc-walkthrough__video-wrap">
          <div className="osc-walkthrough__frame">
            {playing && video ? (
              video.type === "youtube" ? (
                <iframe
                  src={video.embedUrl}
                  title="Angelica Walkthrough Video"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video src={video.url} controls autoPlay style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )
            ) : (
              <button type="button" className="osc-walkthrough__play-btn" onClick={() => setPlaying(true)} aria-label="Play walkthrough video">
                <img src={thumbnail || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"} alt="Walkthrough thumbnail" loading="lazy" />
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
              {gmb.googleIconUrl && <img src={gmb.googleIconUrl} alt="Google" style={{ width: "24px", height: "24px", objectFit: "contain" }} />}
              <div className="eyebrow" style={{ color: "var(--rr-indigo)", margin: 0 }}>GOOGLE REVIEWS</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", flexWrap: "wrap", gap: "20px" }}>
              <h2>What our clients say<br /><span className="rr-grad">about Active Acres.</span></h2>
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
  const mapUrl = subpage.locationImage || subpage.locationMapUrl || fallbackData.locationMapUrl;

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
          {mapUrl && (
            <Reveal className="osc-location__visual">
              <img src={mapUrl} alt="Active Acres Location Map" loading="lazy" className="osc-location__img" />
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
  const [f, setF] = useState({ name: "", phone: "", email: "", project: "Active Acres - Kolkata", message: "" });
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
        interest: f.project || "Active Acres Angelica",
        notes: f.message,
        source: "Angelica page brochure download",
      });
      if (submitError) {
        setError(submitError.message || "Could not submit. Please try again.");
        setSending(false);
        return;
      }
    }
    setSending(false);
    setSent(true);
    if (subpage.brochureUrl) {
      window.open(subpage.brochureUrl, "_blank");
    }
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

function CtaSection({ subpage, onBrochureClick }) {
  return (
    <section className="section-pad osc-section" id="brochure-cta">
      <div className="rr-wrap" style={{ textAlign: "center" }}>
        <Reveal>
          <h2 className="osc-section__title" style={{ marginBottom: "16px" }}>
            Ready to own your dream residence?<br /><span className="rr-grad">Download the brochure.</span>
          </h2>
          <p style={{ fontSize: "var(--rr-fs-lead)", color: "rgba(35,31,32,0.62)", lineHeight: "1.6", margin: "0 auto 36px", maxWidth: "48ch" }}>
            Get detailed information about Active Acres Angelica including unit plans, pricing, and project specifications.
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

export default function ActiveAcresAngelicaPage() {
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
          (p) => p.url === "/active-acres-angelica" || p.title === "Active Acres Angelica" || p.slug === "active-acres-angelica"
        );
        
        if (project) {
          const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(project.id);
          if (!active) return;
          if (sp) {
            // Extract custom serialized specs fields
            const extracted = extractSpecsAndCustomData(sp.specifications);

            setSubpage({
              heroTitle: sp.heroTitle || fallbackData.heroTitle,
              heroTagline: sp.heroTagline || fallbackData.heroTagline,
              heroLogo: sp.heroLogo || fallbackData.heroLogo,
              heroBg: sp.heroBg || fallbackData.heroBg,
              heroMobileUrl: extracted.heroMobileUrl || fallbackData.heroMobileUrl,
              companyLogoUrl: extracted.companyLogoUrl || fallbackData.companyLogoUrl,
              locationMapUrl: extracted.locationMapUrl || fallbackData.locationMapUrl,
              gmbGoogleIconUrl: extracted.gmbGoogleIconUrl || fallbackData.gmbGoogleIconUrl,
              gmbStarIconUrl: extracted.gmbStarIconUrl || fallbackData.gmbStarIconUrl,
              overviewParagraphs: sp.overviewParagraphs?.length ? sp.overviewParagraphs : fallbackData.overviewParagraphs,
              overviewHighlights: sp.overviewHighlights?.length ? sp.overviewHighlights : fallbackData.overviewHighlights,
              amenities: sp.amenities?.length ? sp.amenities : fallbackData.amenities,
              specifications: extracted.specifications?.length ? extracted.specifications : fallbackData.specifications,
              floorPlans: extracted.floorPlans?.length ? extracted.floorPlans : fallbackData.floorPlans,
              locationImage: sp.locationImage || fallbackData.locationImage,
              locationMapEmbed: sp.locationMapEmbed || fallbackData.locationMapEmbed,
              locationDestinations: sp.locationDestinations?.length ? sp.locationDestinations : fallbackData.locationDestinations,
              videoSection: extracted.videoSection || fallbackData.videoSection,
              gmbReviews: extracted.gmbReviews || fallbackData.gmbReviews,
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
      setNavHidden(brochurePopup || window.scrollY > window.innerHeight - 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [brochurePopup]);

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
        <AmenitiesSection subpage={subpage} />
        <LandscapeFeaturesSection subpage={subpage} />
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
