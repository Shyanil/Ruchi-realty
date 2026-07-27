import ProjectSplitHero from "../components/ProjectSplitHero";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal, RImg } from "../components/shared";

// Parse Video helper supporting youtube, youtu.be, embed, and direct video URLs
function parseVideoUrl(url) {
  if (!url) return null;
  const ytRegex = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(ytRegex);
  if (match && match[2].length === 11) {
    return {
      type: "youtube",
      embedUrl: `https://www.youtube.com/embed/${match[2]}?rel=0&autoplay=1`,
      thumbnail: `https://img.youtube.com/vi/${match[2]}/maxresdefault.jpg`
    };
  }
  return {
    type: "direct",
    url,
    thumbnail: null
  };
}

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

export const ACTIVE_GREENS_FALLBACK = {
  heroTitle: "Active Greens",
  heroTagline: "In the heart of the city, away from the concrete jungle",
  heroLogo: "/projects/active-greens/logo.webp",
  heroBg: "/projects/active-greens/thumbnail.webp",
  heroMobileUrl: "/projects/active-greens/thumbnail.webp",
  companyLogoUrl: "/projects/active-greens/ruchi-logo.webp",
  locationMapUrl: "/projects/active-greens/location-map.webp",
  gmbGoogleIconUrl: "",
  gmbStarIconUrl: "",
  overviewParagraphs: [
    "Having set it’s footprints in Kolkata, Ruchi Realty comes up with its second project Active Greens full with green environment. Located off E.M. Bypass it offers approximately 100 units ranging from 1065-1555 sq. ft. area in the two spectacular residential towers.",
    "We have worked to achieve the nearest semblance to your dream home. The focus has been to provide you with lifestyle amenities so that the whole living space resonate the vigor of liveliness. Its blue pool and green gardens will make your spirit feel liberated. Active Greens is not just a home, it is freedom from the concrete jungle, right in the heart of the city."
  ],
  overviewHighlights: [
    { label: "2 Residential Towers", desc: "Two spectacular residential structures.", icon: "assets/projects/oscar/icon-infrastructure.webp" },
    { label: "100 Units", desc: "Premium units from 1065-1555 sq. ft.", icon: "assets/projects/oscar/icon-size.webp" },
    { label: "Prime Location", desc: "Located off E.M. Bypass, Kolkata.", icon: "assets/projects/oscar/icon-location.webp" },
    { label: "Ample Amenities", desc: "Swimming pool, gym & landscaped gardens.", icon: "assets/projects/oscar/icon-amenities.webp" }
  ],
  amenities: [
    { name: "Children Playground", icon: "playground" },
    { name: "Swimming Pool", icon: "pool" },
    { name: "Gymnasium", icon: "gym" },
    { name: "Community Hall", icon: "hall" },
    { name: "Library", icon: "library" },
    { name: "TV Lounge", icon: "lounge" },
    { name: "Landscape Garden", icon: "garden" },
    { name: "Water Supply", icon: "water" },
    { name: "Indoor Games", icon: "games" },
    { name: "Security", icon: "security" },
    { name: "Pool Table", icon: "snooker" },
    { name: "Elevator", icon: "elevator" },
    { name: "Lobby", icon: "lobby" },
    { name: "Fire Alarm", icon: "fire" },
    { name: "Internal Road", icon: "road" },
    { name: "Facility Management", icon: "management" },
    { name: "Generator Backup", icon: "generator" },
    { name: "Intercom", icon: "intercom" },
    { name: "CCTV Camera", icon: "cctv" }
  ],
  specifications: [
    { title: "STRUCTURE", desc: "RCC frame structure on pile foundation." },
    { title: "WALLS", desc: "Brickwork with Cement Plastering." },
    { title: "CEILING", desc: "Plaster of Paris." },
    { title: "FLOORING", desc: "All Rooms / Living / Dining – 2’*2’ Vitrified tiles. Kitchen - Vitrified tiles. Toilets- Ceramic tiles. Lift Lobby- Vitrified tiles." },
    { title: "KITCHEN", desc: "Dado of ceramic tiles, up to a height of two feet from the platform. Kitchen platform with granite counter top. Stainless steel sink. Piped Gas Supply. Hot/ Cold water line." },
    { title: "TOILET", desc: "Standard ceramic tiles on the wall up to 7ft height. Premium quality bathroom fittings & sanitary ware. CP fittings of premium quality. Provision for geyser. Hot/ Cold water point." },
    { title: "DOORS & WINDOWS", desc: "Entrance Door - Solid molded & polished. Internal Door - Flush doors solid core with frames. Anodized aluminum windows." },
    { title: "WALL FINISH", desc: "Interior – Plaster of Paris. Exterior - Combination of Textured Paint/ Brush Finish." },
    { title: "ELECTRICAL", desc: "Modular switches of superior brands. ISI approved brand of concealed wiring for electricity, telephone and television." },
    { title: "GENERAL AMENITIES", desc: "Fully Air Conditioned ground floor lobby. 24X7 Power Back – up for essentials services like lift, lobby, common area and general lighting. Closed circuit TV at the ground level. Automatic high speed elevators of superior make. Intercom facility & infrastructure for DTH TV service. In – house sewerage plant for entire complex. State-of-the-art fire fighting arrangement and extinguishers as required by law. Extensively landscaped garden and driveways. 24 hours treated water supply. Overhead illuminated for compound and street lighting inside the complex." }
  ],
  floorPlans: [
    { title: "Tulip Tower", desc: "/projects/active-greens/plan-tulip.webp" },
    { title: "Orchid Tower", desc: "/projects/active-greens/plan-orchid.webp" }
  ],
  locationImage: "/projects/active-greens/location-map.webp",
  locationMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3684.636603099951!2d88.38883597603706!3d22.555291233633633!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a02768f51a44c79%3A0xe5a13318281cb9f2!2sActive%20Acres!5e0!3m2!1sen!2sin!4v1691752959217!5m2!1sen!2sin",
  locationDestinations: [
    { name: "JW Marriott", dist: "1.0 km" },
    { name: "Hyatt Regency", dist: "1.0 km" },
    { name: "Mani Square Mall", dist: "0.5 km" },
    { name: "LA Martiniere School", dist: "2.0 km" },
    { name: "Sealdah Station", dist: "2.5 km" },
    { name: "Ruby Hospital", dist: "3.0 km" },
    { name: "Fortis Hospital", dist: "3.0 km" },
    { name: "Airport", dist: "20.0 km" }
  ],
  gmbReviews: {
    enabled: false,
    googleIconUrl: "",
    starIconUrl: "",
    reviews: []
  },
  galleryImages: [
    { src: "/projects/active-greens/gallery-bedroom.webp", alt: "Show Flat Bedroom" },
    { src: "/projects/active-greens/gallery-living-room.webp", alt: "Show Flat Living Room" },
    { src: "/projects/active-greens/gallery-project-view.webp", alt: "Active Greens Project View" },
    { src: "/projects/active-greens/gallery-1.webp", alt: "Active Greens Exterior Perspective" },
    { src: "/projects/active-greens/gallery-2.webp", alt: "Active Greens Entrance Gate" },
    { src: "/projects/active-greens/gallery-3.webp", alt: "Active Greens Landscaped Garden" },
    { src: "/projects/active-greens/gallery-4.webp", alt: "Active Greens Clubhouse Interiors" },
    { src: "/projects/active-greens/gallery-5.webp", alt: "Active Greens Evening Perspective" }
  ],
  brochureUrl: "/projects/active-greens/brochure.pdf",
  metaTitle: "Active Greens | Luxury 2 & 3 BHK Apartments off E.M. Bypass, Kolkata | Ruchi Realty",
  metaDescription: "Discover Active Greens by Ruchi Realty. Offers 2 & 3 BHK premium apartments off E.M. Bypass, Kolkata, set inside a serene green environment with modern amenities.",
  isPublished: true
};

function normalizeIconKey(item) {
  const raw = String((typeof item === "string" ? item : item?.icon || item?.image_url || item?.img || item?.name) || "").toLowerCase();
  if (raw.includes("tower") || raw.includes("building") || raw.includes("home")) return "building";
  if (raw.includes("unit") || raw.includes("size")) return "units";
  if (raw.includes("location") || raw.includes("map")) return "location";
  if (raw.includes("amenit") || raw.includes("garden")) return "amenities";
  if (raw.includes("play")) return "playground";
  if (raw.includes("pool-table") || raw.includes("snooker")) return "snooker";
  if (raw.includes("pool")) return "pool";
  if (raw.includes("gym")) return "gym";
  if (raw.includes("hall")) return "hall";
  if (raw.includes("library")) return "library";
  if (raw.includes("lounge") || raw.includes("tv")) return "lounge";
  if (raw.includes("landscape") || raw.includes("garden")) return "garden";
  if (raw.includes("water")) return "water";
  if (raw.includes("indoor") || raw.includes("games")) return "games";
  if (raw.includes("security") || raw.includes("shield")) return "security";
  if (raw.includes("elevator") || raw.includes("lift")) return "elevator";
  if (raw.includes("lobby")) return "lobby";
  if (raw.includes("fire")) return "fire";
  if (raw.includes("road")) return "road";
  if (raw.includes("facility") || raw.includes("management")) return "management";
  if (raw.includes("generator") || raw.includes("backup")) return "generator";
  if (raw.includes("intercom")) return "intercom";
  if (raw.includes("cctv") || raw.includes("camera")) return "cctv";
  return raw;
}

function ActiveGreensIcon({ icon, size = 48 }) {
  const rawIcon = typeof icon === "string" ? icon : icon?.icon || icon?.image_url || icon?.img || "";
  if (rawIcon.includes("assets/projects/oscar/")) {
    return <img src={rawIcon} alt="" style={{ width: size, height: size, objectFit: "contain", marginBottom: size <= 32 ? "4px" : undefined }} />;
  }

  const key = normalizeIconKey(icon);
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ width: size, height: size, color: "var(--rr-lime)", marginBottom: size <= 32 ? "4px" : undefined }} aria-hidden="true">
      {key === "building" && <><path d="M10 42V8h20v34" /><path d="M30 20h8v22" /><path d="M16 14h2M22 14h2M16 21h2M22 21h2M16 28h2M22 28h2" /><path d="M6 42h36" /></>}
      {key === "units" && <><rect x="8" y="10" width="32" height="28" rx="2" /><path d="M8 20h32M18 10v28M29 10v28" /></>}
      {key === "location" && <><path d="M38 20c0 10-14 22-14 22S10 30 10 20a14 14 0 0 1 28 0z" /><circle cx="24" cy="20" r="5" /></>}
      {key === "amenities" && <><circle cx="24" cy="24" r="16" /><path d="M24 10v28M10 24h28" /><path d="M14 14l20 20M34 14 14 34" /></>}
      {key === "playground" && <><path d="M8 38h32" /><path d="M14 38l10-24 10 24" /><path d="M18 28h12" /><path d="M24 14l12 24" /><circle cx="36" cy="36" r="4" /></>}
      {key === "pool" && <><path d="M6 40h36M6 36h36" /><path d="M10 36V20a6 6 0 0 1 12 0v16M26 36V20a6 6 0 0 1 12 0v16" /><path d="M10 28h12M26 28h12" /></>}
      {key === "gym" && <><path d="M6 26h36" /><path d="M10 22v8" /><path d="M14 18v12" /><path d="M24 14v20" /><path d="M34 18v12" /><path d="M38 22v8" /></>}
      {key === "hall" && <><rect x="6" y="14" width="36" height="20" rx="2" /><path d="M6 34v4h36v-4" /><path d="M22 20h4v8h-4z" /></>}
      {key === "library" && <><path d="M8 39.5A2.5 2.5 0 0 1 10.5 37H40M8 39.5A2.5 2.5 0 0 0 10.5 42H40M8 39.5v-30A2.5 2.5 0 0 1 10.5 7H40v30H10.5A2.5 2.5 0 0 1 8 39.5z" /></>}
      {key === "lounge" && <><rect x="8" y="12" width="32" height="20" rx="2" /><path d="M18 40h12M24 32v8" /><path d="M16 20h16" /></>}
      {key === "garden" && <><path d="M24 40V18" /><path d="M24 20c-8 0-12-5-12-10 8 0 12 5 12 10z" /><path d="M24 24c8 0 12-5 12-10-8 0-12 5-12 10z" /><path d="M10 40h28" /></>}
      {key === "water" && <><path d="M24 6s12 13 12 23a12 12 0 0 1-24 0C12 19 24 6 24 6z" /><path d="M18 30a6 6 0 0 0 10 4" /></>}
      {key === "games" && <><rect x="10" y="16" width="28" height="18" rx="6" /><circle cx="18" cy="25" r="2" /><path d="M30 23v4M28 25h4" /></>}
      {key === "security" && <><path d="M24 42s14-7 14-18V10L24 5 10 10v14c0 11 14 18 14 18z" /><path d="M18 24l4 4 8-9" /></>}
      {key === "snooker" && <><circle cx="17" cy="20" r="5" /><circle cx="29" cy="28" r="5" /><path d="M36 12 12 36" /><path d="M38 10l2-2" /></>}
      {key === "elevator" && <><rect x="14" y="6" width="20" height="36" rx="2" /><path d="M24 14v20M19 19l5-5 5 5M19 29l5 5 5-5" /></>}
      {key === "lobby" && <><path d="M8 40V16l16-8 16 8v24" /><path d="M16 40V24h16v16" /><path d="M6 40h36" /></>}
      {key === "fire" && <><path d="M24 42c8 0 13-5 13-12 0-6-4-10-8-14 0 5-3 8-6 9 1-7-2-12-7-17 1 9-5 13-5 22 0 7 5 12 13 12z" /><path d="M24 36c3 0 5-2 5-5 0-2-1-4-4-7 0 3-2 4-4 5 0 4 0 7 3 7z" /></>}
      {key === "road" && <><path d="M18 42 23 6M30 42 25 6" /><path d="M24 38v-5M24 27v-5M24 16v-4" /></>}
      {key === "management" && <><circle cx="24" cy="18" r="6" /><path d="M12 40c2-8 7-12 12-12s10 4 12 12" /><path d="M38 16l4 2-4 2M10 16l-4 2 4 2" /></>}
      {key === "generator" && <><rect x="8" y="16" width="32" height="20" rx="3" /><path d="M14 16v-4h10v4" /><path d="M24 20l-4 7h6l-4 7" /><circle cx="34" cy="26" r="2" /></>}
      {key === "intercom" && <><rect x="16" y="6" width="16" height="36" rx="3" /><path d="M21 14h6M21 22h6M21 30h6" /><path d="M34 14c4 4 4 16 0 20" /></>}
      {key === "cctv" && <><path d="M8 22l18-8 4 10-18 8z" /><path d="M30 24l10 4" /><path d="M18 30v8M12 38h12" /></>}
      {!(["building","units","location","amenities","playground","pool","gym","hall","library","lounge","garden","water","games","security","snooker","elevator","lobby","fire","road","management","generator","intercom","cctv"].includes(key)) && <><circle cx="24" cy="24" r="18" /><path d="M12 24h24M24 12v24" /></>}
    </svg>
  );
}

function HeroSection({ subpage, onBrochureClick }) {
  return <ProjectSplitHero subpage={subpage} title="Active Greens" location="Kolkata" type="Residential" slug="active-greens" onBrochure={onBrochureClick} />;
}

function StickyNav({ subpage }) {
  const [active, setActive] = useState("overview");
  const sections = useMemo(() => {
    return [
      { id: "overview", label: "Overview" },
      subpage.amenities?.length > 0 && { id: "amenities", label: "Amenities" },
      subpage.specifications?.length > 0 && { id: "landscape", label: "Specifications" },
      subpage.floorPlans?.length > 0 && { id: "floor-plans", label: "Floor Plans" },
      subpage.galleryImages?.length > 0 && { id: "gallery", label: "Gallery" },
      subpage.locationImage && { id: "location", label: "Location" },
      (subpage.videoSection?.enabled && subpage.videoSection?.videoUrl) && { id: "walkthrough", label: "Walkthrough" },
      (subpage.gmbReviews?.enabled && subpage.gmbReviews?.reviews?.length > 0) && { id: "reviews", label: "Reviews" }
    ].filter(Boolean);
  }, [subpage]);

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
    if (el) {
      const offset = 80; // height of sticky bar
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="osc-sticky-nav">
      <div className="rr-wrap osc-sticky-nav__wrap">
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
              Active Greens features a thoughtful array of modern amenities designed to refresh, connect, and elevate your daily routine.
            </p>
          </div>
        </Reveal>
        <div className="osc-amenities__grid">
          {subpage.amenities.map((a, i) => (
            <Reveal key={a.name || i} delay={i * 70} className="osc-amenity-card">
              <div className="osc-amenity-card__icon">
                <ActiveGreensIcon icon={a} />
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
  if (!subpage.specifications || !subpage.specifications.length) return null;

  return (
    <section className="section-pad osc-section" id="landscape">
      <div className="rr-wrap">
        <Reveal>
          <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>SPECIFICATIONS</div>
          <h2 className="osc-section__title">
            Exceptional planning<br /><span className="rr-grad">and high quality specifications.</span>
          </h2>
        </Reveal>
        <div className="osc-specs__layout">
          <Reveal className="osc-specs__visual">
            <img src={subpage.galleryImages?.[0]?.src || subpage.heroBg || ACTIVE_GREENS_FALLBACK.heroBg} alt="Active Greens Specifications Visual" loading="lazy" className="osc-specs__img" />
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
              <h2>A closer look<br /><span className="rr-grad">at the Active Greens lifestyle.</span></h2>
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
                aria-label={`Open ${img.alt || `Active Greens gallery image ${imgIdx + 1}`}`}
              >
                <div className="rimg" style={{ width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden" }}>
                  <img
                    src={img.src}
                    alt={img.alt || `Active Greens gallery ${imgIdx + 1}`}
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
              Active Greens Video Walkthrough<br /><span className="rr-grad">experience the community.</span>
            </h2>
            <p className="osc-walkthrough__lead" style={{ color: "rgba(35,31,32,0.62)" }}>
              Take a virtual walkthrough of our project to explore the green spaces, planning, and residences.
            </p>
          </div>
        </Reveal>
        <Reveal delay={80} className="osc-walkthrough__video-wrap">
          <div className="osc-walkthrough__frame">
            {playing && video ? (
              video.type === "youtube" ? (
                <iframe
                  src={video.embedUrl}
                  title="Active Greens Walkthrough Video"
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
  if (!subpage.gmbReviews?.enabled || !subpage.gmbReviews?.reviews?.length) return null;
  const reviews = subpage.gmbReviews.reviews;

  return (
    <section className="section-pad osc-section" id="reviews" style={{ background: "#fbfaf7" }}>
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head" style={{ marginBottom: "48px" }}>
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-indigo)" }}>REVIEWS</div>
              <h2>Google Reviews<br /><span className="rr-grad">what our residents say.</span></h2>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              {subpage.gmbReviews.googleIconUrl && (
                <img src={subpage.gmbReviews.googleIconUrl} alt="Google" style={{ height: "24px", objectFit: "contain" }} />
              )}
              {subpage.gmbReviews.starIconUrl ? (
                <img src={subpage.gmbReviews.starIconUrl} alt="5 stars" style={{ height: "20px", objectFit: "contain" }} />
              ) : (
                <span style={{ color: "#f39c12", fontWeight: "bold" }}>★★★★★</span>
              )}
            </div>
          </div>
        </Reveal>
        <div className="osc-reviews__grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
          {reviews.map((rev, i) => (
            <Reveal key={i} delay={i * 60} className="osc-review-card" style={{ padding: "24px", background: "#fff", border: "1px solid rgba(0,0,0,0.06)", borderRadius: "8px", display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <strong style={{ fontSize: "15px", color: "var(--rr-ink)" }}>{rev.author}</strong>
                <span style={{ fontSize: "12px", opacity: 0.5 }}>{rev.time}</span>
              </div>
              <div style={{ color: "#f39c12", fontSize: "14px" }}>
                {"★".repeat(rev.rating || 5)}
              </div>
              <p style={{ margin: 0, fontSize: "13.5px", lineHeight: "1.5", color: "rgba(35,31,32,0.8)" }}>{rev.text}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function LocationSection({ subpage }) {
  const visualUrl = subpage.locationImage || ACTIVE_GREENS_FALLBACK.locationImage;
  const detailedMapUrl = subpage.locationMapUrl || ACTIVE_GREENS_FALLBACK.locationMapUrl;

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
          {visualUrl && (
            <Reveal className="osc-location__visual">
              <a href={detailedMapUrl} target="_blank" rel="noopener noreferrer" style={{ display: "block", position: "relative" }}>
                <img
                  src={visualUrl}
                  alt="Active Greens Location"
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
                  title="Active Greens location map embed"
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
            Ready to own your dream residence?<br /><span className="rr-grad">Download the brochure.</span>
          </h2>
          <p style={{ fontSize: "var(--rr-fs-lead)", color: "rgba(35,31,32,0.62)", lineHeight: "1.6", margin: "0 auto 36px", maxWidth: "48ch" }}>
            Get detailed information about Active Greens including unit plans, pricing, and project specifications.
          </p>
          <button className="submit-btn" onClick={onBrochureClick} style={{ display: "inline-flex" }}>
            Download Brochure<span className="ar">→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

function BrochurePopup({ subpage, onClose }) {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", project: "Active Greens", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    try {
      if (window.RuchiBackend?.leads) {
        await window.RuchiBackend.leads.submitLead({
          ...form,
          source: "Project Subpage Brochure",
          project_slug: "active-greens"
        });
      }
      setSubmitted(true);
      // Trigger brochure download
      const link = document.createElement("a");
      link.href = subpage.brochureUrl || ACTIVE_GREENS_FALLBACK.brochureUrl;
      link.download = "Active_Greens_Brochure.pdf";
      link.target = "_blank";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error(err);
      alert("Submission failed, please try again.");
    } finally {
      setLoading(false);
    }
  };

  const valid = form.name.trim() && form.phone.trim() && form.email.trim();

  return (
    <div className="osc-popup-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Download brochure">
      <div className="osc-popup" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="osc-popup__close" onClick={onClose} aria-label="Close form">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        {submitted ? (
          <>
            <h3>Thank You!</h3>
            <p>Your details have been submitted. Your brochure download has started automatically.</p>
            <button type="button" className="submit-btn" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>
              Close Window<span className="ar">→</span>
            </button>
          </>
        ) : (
          <>
            <h3>Download Brochure</h3>
            <p>Enter your details below to receive the brochure.</p>
            <div className="field">
              <label>Name</label>
              <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
            </div>
            <div className="field">
              <label>Phone</label>
              <input required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+91" />
            </div>
            <div className="field">
              <label>Email</label>
              <input required type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@email.com" />
            </div>
            <div className="field">
              <label>Project of interest</label>
              <select value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })}>
                <option value="Active Greens">Active Greens</option>
              </select>
            </div>
            <div className="field">
              <label>Message</label>
              <textarea rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="I'd like to know more about the project." />
            </div>
            <button className="submit-btn" onClick={handleSubmit} disabled={!valid || loading} style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>
              {loading ? "Sending..." : "Download Now"}<span className="ar">→</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function MobileFixedCta({ onBrochureClick }) {
  return (
    <div className="mobile-fixed-cta">
      <button type="button" className="submit-btn" onClick={onBrochureClick} style={{ width: "100%", justifyContent: "center" }}>
        Enquire & Download Brochure<span className="ar">→</span>
      </button>
    </div>
  );
}

export default function ActiveGreensPage() {
  const [subpage, setSubpage] = useState(ACTIVE_GREENS_FALLBACK);
  const [brochurePopup, setBrochurePopup] = useState(false);
  const [navHidden, setNavHidden] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setNavHidden(brochurePopup || window.scrollY > window.innerHeight - 100);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [brochurePopup]);

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
          (p) => p.url === "/active-greens" || p.title === "Active Greens" || p.slug === "active-greens"
        );
        
        if (project) {
          const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(project.id);
          if (!active) return;
          if (sp) {
            const extracted = extractSpecsAndCustomData(sp.specifications);

            setSubpage({
              heroTitle: sp.heroTitle || ACTIVE_GREENS_FALLBACK.heroTitle,
              heroTagline: sp.heroTagline || ACTIVE_GREENS_FALLBACK.heroTagline,
              heroLogo: sp.heroLogo || ACTIVE_GREENS_FALLBACK.heroLogo,
              heroBg: sp.heroBg || ACTIVE_GREENS_FALLBACK.heroBg,
              heroMobileUrl: extracted.heroMobileUrl || ACTIVE_GREENS_FALLBACK.heroMobileUrl,
              companyLogoUrl: extracted.companyLogoUrl || ACTIVE_GREENS_FALLBACK.companyLogoUrl,
              locationMapUrl: extracted.locationMapUrl || ACTIVE_GREENS_FALLBACK.locationMapUrl,
              gmbGoogleIconUrl: extracted.gmbGoogleIconUrl || ACTIVE_GREENS_FALLBACK.gmbGoogleIconUrl,
              gmbStarIconUrl: extracted.gmbStarIconUrl || ACTIVE_GREENS_FALLBACK.gmbStarIconUrl,
              overviewParagraphs: sp.overviewParagraphs?.length ? sp.overviewParagraphs : ACTIVE_GREENS_FALLBACK.overviewParagraphs,
              overviewHighlights: sp.overviewHighlights?.length ? sp.overviewHighlights : ACTIVE_GREENS_FALLBACK.overviewHighlights,
              amenities: sp.amenities?.length ? sp.amenities : ACTIVE_GREENS_FALLBACK.amenities,
              specifications: extracted.specifications?.length ? extracted.specifications : ACTIVE_GREENS_FALLBACK.specifications,
              floorPlans: extracted.floorPlans?.length ? extracted.floorPlans : ACTIVE_GREENS_FALLBACK.floorPlans,
              locationImage: sp.locationImage || ACTIVE_GREENS_FALLBACK.locationImage,
              locationMapEmbed: sp.locationMapEmbed || ACTIVE_GREENS_FALLBACK.locationMapEmbed,
              locationDestinations: sp.locationDestinations?.length ? sp.locationDestinations : ACTIVE_GREENS_FALLBACK.locationDestinations,
              videoSection: extracted.videoSection || ACTIVE_GREENS_FALLBACK.videoSection,
              gmbReviews: extracted.gmbReviews || ACTIVE_GREENS_FALLBACK.gmbReviews,
              galleryImages: sp.galleryImages?.length ? sp.galleryImages : ACTIVE_GREENS_FALLBACK.galleryImages,
              brochureUrl: sp.brochureUrl || ACTIVE_GREENS_FALLBACK.brochureUrl,
              metaTitle: sp.metaTitle || ACTIVE_GREENS_FALLBACK.metaTitle,
              metaDescription: sp.metaDescription || ACTIVE_GREENS_FALLBACK.metaDescription,
            });
          }
        }
      } catch (err) {
        console.error("Error loading Active Greens subpage details:", err);
      }
    };

    fetchSubpage();
    return () => { active = false; };
  }, []);

  // Sync tab/doc meta title and description
  useEffect(() => {
    document.title = subpage.metaTitle || ACTIVE_GREENS_FALLBACK.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      created = true;
    }
    meta.content = subpage.metaDescription || ACTIVE_GREENS_FALLBACK.metaDescription;
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
        <GallerySection subpage={subpage} />
        <LocationSection subpage={subpage} />
        <WalkthroughSection subpage={subpage} />
        <GmbReviewsSection subpage={subpage} />
        <CtaSection subpage={subpage} onBrochureClick={() => setBrochurePopup(true)} />
      </main>
      <Footer />
      {brochurePopup && <BrochurePopup subpage={subpage} onClose={() => setBrochurePopup(false)} />}
      <MobileFixedCta onBrochureClick={() => setBrochurePopup(true)} />
    </>
  );
}
