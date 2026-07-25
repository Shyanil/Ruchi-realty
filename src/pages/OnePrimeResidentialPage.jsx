import ProjectSplitHero from "../components/ProjectSplitHero";
import { useCallback, useEffect, useState } from "react";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";
import { PROJECT_OPTIONS } from "../data/projects";

const BASE = "/projects/one-prime-residential";

const fallbackData = {
  heroTitle: "One Prime Residential",
  heroTagline: "A Smart Upgrade To Premium Living",
  heroLogo: `${BASE}/logo.webp`,
  heroBg: `${BASE}/card.webp`,
  heroMobileUrl: `${BASE}/card.webp`,
  overviewParagraphs: [
    "Give your busy lifestyle the antidote of nature, luxury, relaxation and ease for a blissful living experience. Step inside a space encapsulating the essence of extravagance with world-class specifications at One Prime residential part, an exclusive community hub by Revera Developers LLP. Strategically located at Newtown Action Area 1, find a large selection of commercial facilities just a few steps away from your abode to add the quintessential touch of elegance and convenience to your lifestyle unlike anywhere else.",
  ],
  overviewHighlights: [
    { label: "2,3 BHK Apartments", desc: "Premium residential apartments.", icon: "size" },
    { label: "Ample Amenities", desc: "State-of-the-art amenities for daily comfort.", icon: "amenities" },
    { label: "Prime Location", desc: "Newtown Action Area 1, Kolkata.", icon: "location" },
    { label: "Commercial & Residential", desc: "Mixed-use convenience around your home.", icon: "infrastructure" },
  ],
  amenitiesIntro: "To unwind yourself from your hectic everyday timetable, Revera Developers LLP created the One Prime residential part in Newtown Action Area 1, that boosts its State-of-the-Art amenities to make your day to day life go a lot smoother. Come and discover a new meaning of luxurious life from here.",
  amenities: [
    { name: "AC Lobby with High Speed Lifts", icon: "lobby" },
    { name: "Open Gym with Terrace", icon: "gym" },
    { name: "Meditation / Yoga Deck", icon: "yoga" },
    { name: "Open / Mechanical Car Park", icon: "parking" },
    { name: "Basement Car Park", icon: "parking" },
    { name: "Air Conditioned Apartments", icon: "home" },
    { name: "Modular Kitchen", icon: "kitchen" },
    { name: "Premium Tiles", icon: "tiles" },
    { name: "Modular Switches", icon: "switches" },
    { name: "Concealed Copper Wiring", icon: "electrical" },
  ],
  floorPlans: [
    { title: "10th Floor Plan", desc: `${BASE}/floor-plan-10th.webp`, config: "3.5 BHK" },
    { title: "11th Floor Plan", desc: `${BASE}/floor-plan-11th.webp`, config: "3.5 BHK" },
    { title: "12th Floor Plan", desc: `${BASE}/floor-plan-12th.webp`, config: "3.5 BHK" },
    { title: "13th Floor Plan", desc: `${BASE}/floor-plan-13th.webp`, config: "3.5 BHK" },
  ],
  locationIntro: "At One Prime, the best of East Kolkata is outside your doorstep. Whether you travel by metro, cab or flight, commuting from one place to another will be simplified beyond your expectations.",
  locationImage: `${BASE}/location-map.webp`,
  locationMapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d58943.32244774187!2d88.39105543124995!3d22.580687100000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a027515da72333d%3A0xe9a61d7d963987a2!2sONE%20PRIME!5e0!3m2!1sen!2sin!4v1691433745244!5m2!1sen!2sin",
  locationDestinations: [],
  videoSection: { enabled: true, videos: [
    { title: "Project Walkthrough", videoUrl: "https://youtu.be/7ofcd0vT3mw?si=rt4CLfOuXuTZLiy7", thumbnailUrl: "" },
    { title: "Construction Walkthrough", videoUrl: "https://youtu.be/UFmTMObIIbg?si=c_f5qHcwfJGREMpm", thumbnailUrl: "" },
  ] },
  galleryImages: [1, 2, 3, 4, 5].map((n) => ({ src: `${BASE}/gallery-${n}.webp`, alt: `One Prime Residential gallery image ${n}` })),
  constructionUpdates: [
    ["construction-2026-04.webp", "One Prime construction update April 2026"],
    ["construction-2024-07.webp", "One Prime construction update July 2024"],
    ["construction-1.webp", "One Prime construction update 1"],
    ["construction-2.webp", "One Prime construction update 2"],
    ["construction-3.webp", "One Prime construction update 3"],
    ["construction-4.webp", "One Prime construction update 4"],
    ["construction-5.webp", "One Prime construction update 5"],
    ["construction-6.webp", "One Prime construction update 6"],
    ["construction-7.webp", "One Prime construction update 7"],
    ["construction-2022-11.webp", "One Prime construction update November 2022"],
    ["construction-op-12.webp", "One Prime construction update OP 12"],
    ["construction-op-17.webp", "One Prime construction update OP 17"],
    ["construction-op-19.webp", "One Prime construction update OP 19"],
  ].map(([file, alt]) => ({ src: `${BASE}/${file}`, alt })),
  brochureUrl: `${BASE}/brochure.pdf`,
  metaTitle: "One Prime Residential - Ruchi Realty",
  metaDescription: "Experience luxury living at One Prime Residential, offering exquisite 2, 3 BHK apartments with world-class amenities in Newtown Action Area 1.",
};

function parseVideoUrl(url = "") {
  if (!url) return null;
  let id = "";
  if (url.includes("youtube.com/embed/")) id = url.split("embed/")[1]?.split("?")[0];
  else if (url.includes("youtu.be/")) id = url.split("youtu.be/")[1]?.split("?")[0];
  else if (url.includes("youtube.com/watch")) id = url.split("v=")[1]?.split("&")[0];
  return id ? { embedUrl: `https://www.youtube.com/embed/${id}?rel=0`, thumbnail: `https://img.youtube.com/vi/${id}/hqdefault.jpg` } : { embedUrl: url, thumbnail: "" };
}

function getVideoItems(videoSection) {
  if (!videoSection?.enabled) return [];
  const items = Array.isArray(videoSection.videos) && videoSection.videos.length
    ? videoSection.videos
    : videoSection.videoUrl
      ? [{ title: "Project Walkthrough", videoUrl: videoSection.videoUrl, thumbnailUrl: videoSection.thumbnailUrl || "" }]
      : [];
  return items.filter((item) => item?.videoUrl).map((item, index) => {
    const parsed = parseVideoUrl(item.videoUrl);
    return {
      title: item.title || `Walkthrough ${index + 1}`,
      embedUrl: parsed?.embedUrl || item.videoUrl,
      thumbnail: item.thumbnailUrl || parsed?.thumbnail || "",
    };
  });
}

function CtaArrow() {
  return null;
}

function extractSpecsAndCustomData(specsArray = []) {
  const result = { specifications: [], heroMobileUrl: "", floorPlans: [], videoSection: null, constructionUpdates: [] };
  specsArray.forEach((item) => {
    if (item.title === "__hero_mobile_url__") result.heroMobileUrl = item.desc;
    else if (item.title === "__floor_plans__") { try { result.floorPlans = JSON.parse(item.desc); } catch { result.floorPlans = []; } }
    else if (item.title === "__video_section__") { try { result.videoSection = JSON.parse(item.desc); } catch { result.videoSection = null; } }
    else if (item.title === "__construction_updates__") { try { result.constructionUpdates = JSON.parse(item.desc); } catch { result.constructionUpdates = []; } }
    else if (!String(item.title || "").startsWith("__")) result.specifications.push(item);
  });
  return result;
}

function HighlightIcon({ icon }) {
  const icons = {
    location: "/assets/projects/oscar/icon-location.webp",
    amenities: "/assets/projects/oscar/icon-amenities.webp",
    infrastructure: "/assets/projects/oscar/icon-infrastructure.webp",
    size: "/assets/projects/oscar/icon-size.webp",
  };
  return <img src={icons[String(icon || "").toLowerCase()] || icons.location} alt="" style={{ width: 28, height: 28, objectFit: "contain", marginBottom: 4 }} />;
}

function amenityKey(item) {
  const raw = String(item.icon || item.name || "").toLowerCase();
  if (raw.includes("gym")) return "gym";
  if (raw.includes("yoga") || raw.includes("meditation")) return "yoga";
  if (raw.includes("park")) return "parking";
  if (raw.includes("lobby") || raw.includes("lift")) return "lobby";
  if (raw.includes("kitchen")) return "kitchen";
  if (raw.includes("tile")) return "tiles";
  if (raw.includes("switch")) return "switches";
  if (raw.includes("wire") || raw.includes("electrical")) return "electrical";
  if (raw.includes("air") || raw.includes("apartment") || raw.includes("home")) return "home";
  return raw;
}

function AmenityIcon({ icon }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      {icon === "gym" && <><path d="M6 26h36" /><path d="M10 22v8" /><path d="M14 18v12" /><path d="M24 14v20" /><path d="M34 18v12" /><path d="M38 22v8" /></>}
      {icon === "yoga" && <><circle cx="24" cy="10" r="4" /><path d="M24 14v10M12 24h24M16 38l8-14 8 14M11 34h26" /></>}
      {icon === "parking" && <><rect x="10" y="8" width="28" height="32" rx="2" /><path d="M18 40v-8h12v8M18 14h9a7 7 0 0 1 0 14h-9V14z" /></>}
      {icon === "lobby" && <><path d="M8 40V16l16-8 16 8v24" /><path d="M16 40V24h16v16" /><path d="M6 40h36" /></>}
      {icon === "kitchen" && <><rect x="9" y="12" width="30" height="24" rx="2" /><path d="M9 22h30M17 12v24M26 28h8" /></>}
      {icon === "tiles" && <><rect x="8" y="8" width="14" height="14" /><rect x="26" y="8" width="14" height="14" /><rect x="8" y="26" width="14" height="14" /><rect x="26" y="26" width="14" height="14" /></>}
      {icon === "switches" && <><rect x="12" y="8" width="24" height="32" rx="3" /><path d="M20 16h8M20 24h8M20 32h8" /></>}
      {icon === "electrical" && <path d="M25 4 12 26h11l-2 18 15-24H25l0-16z" />}
      {icon === "home" && <><path d="M8 24 24 10l16 14" /><path d="M12 22v18h24V22" /><path d="M20 40V28h8v12" /></>}
      {!['gym', 'yoga', 'parking', 'lobby', 'kitchen', 'tiles', 'switches', 'electrical', 'home'].includes(icon) && <><circle cx="24" cy="24" r="18" /><path d="M12 24h24M24 12v24" /></>}
    </svg>
  );
}

function HeroSection({ subpage, onBrochureClick }) {
  return <ProjectSplitHero subpage={subpage} title="One Prime Residential" location="Kolkata" type="Residential" slug="one-prime-residential" onBrochure={onBrochureClick} />;
}

function StickyNav({ subpage }) {
  const [active, setActive] = useState("overview");
  const sections = [
    { id: "overview", label: "Overview" },
    subpage.amenities?.length && { id: "amenities", label: "Amenities" },
    subpage.floorPlans?.length && { id: "floor-plans", label: "Floor Plans" },
    getVideoItems(subpage.videoSection).length && { id: "walkthrough", label: "Walkthrough" },
    (subpage.galleryImages?.length || subpage.constructionUpdates?.length) && { id: "gallery", label: "Gallery" },
    subpage.locationImage && { id: "location", label: "Location" },
  ].filter(Boolean);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); }), { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" });
    sections.forEach(({ id }) => { const el = document.getElementById(id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [sections.map(({ id }) => id).join("|")]);

  return <nav className="osc-sticky-nav" aria-label="Section navigation"><div className="rr-wrap"><div className="osc-sticky-nav__inner">{sections.map(({ id, label }) => <button key={id} type="button" className={`osc-sticky-nav__btn ${active === id ? "is-active" : ""}`} onClick={() => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" }); }}>{label}</button>)}</div></div></nav>;
}

function OverviewSection({ subpage }) {
  return <section className="section-pad osc-section" id="overview"><div className="rr-wrap"><Reveal><div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>OVERVIEW</div><h2 className="osc-section__title">A smart upgrade<br /><span className="rr-grad">to premium living.</span></h2></Reveal><div className="osc-overview__grid"><Reveal className="osc-overview__text">{(subpage.overviewParagraphs || []).map((p, i) => <p key={i}>{p}</p>)}</Reveal><div className="osc-overview__stats">{(subpage.overviewHighlights || []).map((h, i) => <Reveal key={h.label || i} delay={i * 70} className="osc-stat-card"><span className="osc-stat-card__label">{h.label}</span><span className="osc-stat-card__desc">{h.desc}</span></Reveal>)}</div></div></div></section>;
}

function AmenitiesSection({ subpage }) {
  if (!subpage.amenities?.length) return null;
  return <section className="section-pad osc-section osc-section--dark" id="amenities"><div className="rr-wrap"><Reveal><div className="sec-head sec-head--dark" style={{ marginBottom: "48px" }}><div><div className="eyebrow" style={{ color: "var(--rr-lime)" }}>AMENITIES</div><h2>Amenities & Facilities<br /><span className="rr-grad">for smoother everyday life.</span></h2></div><p className="sec-head__lead">{subpage.amenitiesIntro || fallbackData.amenitiesIntro}</p></div></Reveal><div className="osc-amenities__grid">{subpage.amenities.map((a, i) => <Reveal key={a.name || i} delay={i * 70} className="osc-amenity-card"><div className="osc-amenity-card__icon"><AmenityIcon icon={amenityKey(a)} /></div><h4 className="osc-amenity-card__name">{a.name}</h4></Reveal>)}</div></div></section>;
}

function FloorPlansSection({ subpage }) {
  const [activePlanIdx, setActivePlanIdx] = useState(0);
  const plans = subpage.floorPlans || [];
  if (!plans.length) return null;
  return <section className="section-pad osc-section" id="floor-plans"><div className="rr-wrap"><Reveal><div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>FLOOR PLANS</div><h2 className="osc-section__title">Floor plans<br /><span className="rr-grad">for planned living.</span></h2></Reveal><div className="osc-floorplans__layout" style={{ marginTop: "40px" }}><Reveal className="osc-floorplans__tabs" style={{ display: "flex", gap: "12px", marginBottom: "30px", flexWrap: "wrap" }}>{plans.map((p, idx) => <button key={p.title || idx} type="button" className={`submit-btn ${activePlanIdx === idx ? "" : "ab-btn-outline"}`} style={{ padding: "10px 24px", fontSize: "13px", textTransform: "uppercase", background: activePlanIdx === idx ? "var(--rr-indigo)" : "transparent", color: activePlanIdx === idx ? "#fff" : "var(--rr-ink)", border: "1px solid var(--rr-indigo)", borderRadius: "20px" }} onClick={() => setActivePlanIdx(idx)}>{p.title}{p.config ? ` - ${p.config}` : ""}</button>)}</Reveal><Reveal key={activePlanIdx} className="osc-floorplans__viewer" style={{ background: "rgba(20,18,26,0.03)", padding: "30px", borderRadius: "12px", border: "1px solid rgba(20,18,26,0.08)", display: "flex", justifyContent: "center", alignItems: "center" }}><img src={plans[activePlanIdx].desc} alt={plans[activePlanIdx].title} style={{ maxWidth: "100%", maxHeight: "550px", objectFit: "contain", borderRadius: "4px" }} /></Reveal></div></div></section>;
}

function WalkthroughSection({ subpage }) {
  const videos = getVideoItems(subpage.videoSection);
  if (!videos.length) return null;
  return <section className="section-pad osc-section" id="walkthrough"><div className="rr-wrap"><Reveal><div className="sec-head" style={{ marginBottom: "40px" }}><div><div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>WALKTHROUGH</div><h2>Experience the project<br /><span className="rr-grad">through virtual tours.</span></h2></div></div></Reveal><div className="one-prime-videos">{videos.map((video, index) => <Reveal key={video.embedUrl} delay={index * 100} className="osc-video__visual one-prime-video"><h3 className="one-prime-video__title">{video.title}</h3><div className="one-prime-video__frame"><iframe title={`One Prime Residential ${video.title}`} src={video.embedUrl} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen /></div></Reveal>)}</div></div></section>;
}

function ImageGridSection({ id, eyebrow, title, accent, images, dark = false }) {
  const [lightbox, setLightbox] = useState(null);
  useEffect(() => {
    if (lightbox === null) return undefined;
    document.body.classList.add("nav-locked");
    const onKey = (e) => { if (e.key === "Escape") setLightbox(null); };
    window.addEventListener("keydown", onKey);
    return () => { document.body.classList.remove("nav-locked"); window.removeEventListener("keydown", onKey); };
  }, [lightbox]);
  if (!images?.length) return null;
  return <section className={`section-pad osc-section ${dark ? "one-prime-gallery-section" : ""}`} id={id}><div className="rr-wrap"><Reveal><div className={`sec-head ${dark ? "sec-head--dark" : ""}`} style={{ marginBottom: "48px" }}><div><div className="eyebrow" style={{ color: dark ? "var(--rr-lime)" : "var(--rr-indigo)" }}>{eyebrow}</div><h2>{title}<br /><span className="rr-grad">{accent}</span></h2></div></div></Reveal><div className="osc-gallery__grid">{images.map((img, i) => <Reveal key={img.src || i} delay={(i % 4) * 60} className={`osc-gallery__item ${i === 0 ? "osc-gallery__item--wide" : ""}`}><button type="button" className="osc-gallery__btn" onClick={() => setLightbox(i)} aria-label={`View ${img.alt}`}><img src={img.src} alt={img.alt} loading="lazy" className="osc-gallery__img" /><span className="osc-gallery__zoom"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" /><path d="M11 8v6M8 11h6" /></svg></span></button></Reveal>)}</div></div>{lightbox !== null && images[lightbox] ? <div className="osc-lightbox" onClick={() => setLightbox(null)}><button type="button" className="osc-lightbox__close" onClick={() => setLightbox(null)} aria-label="Close gallery">x</button><button type="button" className="osc-lightbox__arrow osc-lightbox__arrow--prev" onClick={(e) => { e.stopPropagation(); setLightbox(lightbox === 0 ? images.length - 1 : lightbox - 1); }} aria-label="Previous">&lt;</button><div className="osc-lightbox__content" onClick={(e) => e.stopPropagation()}><img src={images[lightbox].src} alt={images[lightbox].alt} className="osc-lightbox__img" /><p className="osc-lightbox__caption">{images[lightbox].alt}</p></div><button type="button" className="osc-lightbox__arrow osc-lightbox__arrow--next" onClick={(e) => { e.stopPropagation(); setLightbox(lightbox === images.length - 1 ? 0 : lightbox + 1); }} aria-label="Next">&gt;</button></div> : null}</section>;
}

function LocationSection({ subpage }) {
  return <section className="section-pad osc-section osc-section--dark" id="location"><div className="rr-wrap"><Reveal><div className="sec-head sec-head--dark" style={{ marginBottom: "48px" }}><div><div className="eyebrow" style={{ color: "var(--rr-lime)" }}>LOCATION</div><h2>Prime location,<br /><span className="rr-grad">unmatched connectivity.</span></h2></div></div></Reveal><div className="osc-location__grid"><Reveal className="osc-location__visual"><img src={subpage.locationImage} alt="One Prime Residential location map" loading="lazy" className="osc-location__img" /></Reveal><Reveal delay={80} className="osc-location__info"><h3 className="osc-location__heading">Newtown Action Area 1</h3><p style={{ color: "rgba(245,244,241,0.62)", fontSize: "14px", lineHeight: "1.6", marginBottom: "24px" }}>{subpage.locationIntro || fallbackData.locationIntro}</p>{subpage.locationDestinations?.length ? <div className="osc-location__list">{subpage.locationDestinations.map((d, i) => <div key={d.name || i} className="osc-location__item"><span className="osc-location__name">{d.name}</span><span className="osc-location__dist">{d.dist}</span></div>)}</div> : null}{subpage.locationMapEmbed ? <div className="osc-location__map-wrap"><iframe title="One Prime Residential location map" src={subpage.locationMapEmbed} width="100%" height="240" style={{ border: 0 }} allowFullScreen="" loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div> : null}</Reveal></div></div></section>;
}

function BrochurePopup({ subpage, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", project: "One Prime Residential - New Town, Kolkata", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const set = (key) => (e) => setForm((prev) => ({ ...prev, [key]: e.target.value }));
  const valid = form.name.trim() && form.phone.trim() && form.email.trim();
  const submit = async () => {
    if (!valid || sending) return;
    setSending(true); setError("");
    try {
      if (window.RuchiBackend?.leads) {
        const { error: leadError } = await window.RuchiBackend.leads.submitLead({ ...form, interest: form.project, notes: form.message, source: "One Prime Residential page brochure download", project_slug: "one-prime-residential" });
        if (leadError) throw leadError;
      }
      setSent(true); window.open(subpage.brochureUrl || fallbackData.brochureUrl, "_blank");
    } catch (err) { setError(err.message || "Failed to submit enquiry. Please try again."); }
    finally { setSending(false); }
  };
  return <div className="osc-popup-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Download brochure"><div className="osc-popup" onClick={(e) => e.stopPropagation()}><button type="button" className="osc-popup__close" onClick={onClose} aria-label="Close">x</button>{sent ? <><h3>Thank You!</h3><p>Your brochure is being downloaded. A team member will also reach out to you shortly.</p><button className="submit-btn" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>Close<CtaArrow /></button></> : <><h3>Download Brochure</h3><p>Enter your details to receive the brochure.</p><div className="field"><label>Name</label><input value={form.name} onChange={set("name")} placeholder="Your full name" /></div><div className="field"><label>Phone</label><input value={form.phone} onChange={set("phone")} placeholder="+91" /></div><div className="field"><label>Email</label><input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" /></div><div className="field"><label>Project of interest</label><select value={form.project} onChange={set("project")}>{PROJECT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}</select></div><div className="field"><label>Message</label><textarea rows={3} value={form.message} onChange={set("message")} placeholder="I'd like to know more about the project." /></div><button className="submit-btn" onClick={submit} disabled={!valid || sending} style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>{sending ? "Sending..." : "Download Now"}<CtaArrow /></button>{error ? <p className="contact-error" style={{ margin: "12px 0 0", fontSize: "13px" }}>{error}</p> : null}</>}</div></div>;
}

function MobileFixedCta({ onBrochureClick }) {
  return <div className="mobile-fixed-cta"><button className="submit-btn" onClick={onBrochureClick} style={{ width: "100%", justifyContent: "center" }}>Enquire Now <CtaArrow /></button></div>;
}

export default function OnePrimeResidentialPage() {
  const [subpage, setSubpage] = useState(fallbackData);
  const [brochurePopup, setBrochurePopup] = useState(false);
  const [navHidden, setNavHidden] = useState(false);
  const onContact = useCallback(() => setBrochurePopup(true), []);

  useEffect(() => {
    let active = true;
    const fetchSubpage = async () => {
      if (!window.RuchiBackend) return;
      try {
        const { data: projects } = await window.RuchiBackend.projects.getPublicProjects();
        if (!active) return;
        const project = (projects || []).find((p) => p.url === "/one-prime-residential" || p.url === "/projects/one-prime-residential" || p.title === "One Prime Residential" || p.slug === "one-prime-residential");
        if (!project) return;
        const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(project.id);
        if (!active || !sp) return;
        const extracted = extractSpecsAndCustomData(sp.specifications);
        const walkthroughVideoSection = sp.walkthroughVideoId
          ? { enabled: true, videos: [{ title: "Project Walkthrough", videoUrl: sp.walkthroughVideoId.length === 11 ? `https://www.youtube.com/watch?v=${sp.walkthroughVideoId}` : sp.walkthroughVideoId, thumbnailUrl: "" }] }
          : null;
        setSubpage({ ...fallbackData, heroTitle: sp.heroTitle || fallbackData.heroTitle, heroTagline: sp.heroTagline || fallbackData.heroTagline, heroLogo: sp.heroLogo || fallbackData.heroLogo, heroBg: sp.heroBg || fallbackData.heroBg, heroMobileUrl: extracted.heroMobileUrl || fallbackData.heroMobileUrl, overviewParagraphs: sp.overviewParagraphs?.length ? sp.overviewParagraphs : fallbackData.overviewParagraphs, overviewHighlights: sp.overviewHighlights?.length ? sp.overviewHighlights : fallbackData.overviewHighlights, amenities: sp.amenities?.length ? sp.amenities : fallbackData.amenities, floorPlans: extracted.floorPlans?.length ? extracted.floorPlans : fallbackData.floorPlans, locationImage: sp.locationImage || fallbackData.locationImage, locationMapEmbed: sp.locationMapEmbed || fallbackData.locationMapEmbed, locationDestinations: sp.locationDestinations?.length ? sp.locationDestinations : fallbackData.locationDestinations, videoSection: extracted.videoSection || walkthroughVideoSection || fallbackData.videoSection, galleryImages: sp.galleryImages?.length ? sp.galleryImages : fallbackData.galleryImages, constructionUpdates: extracted.constructionUpdates?.length ? extracted.constructionUpdates : fallbackData.constructionUpdates, brochureUrl: sp.brochureUrl || fallbackData.brochureUrl, metaTitle: sp.metaTitle || fallbackData.metaTitle, metaDescription: sp.metaDescription || fallbackData.metaDescription });
      } catch (err) { console.error("Error loading One Prime Residential subpage details:", err); }
    };
    fetchSubpage();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    document.title = subpage.metaTitle || fallbackData.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    let created = false;
    if (!meta) { meta = document.createElement("meta"); meta.name = "description"; created = true; }
    meta.content = subpage.metaDescription || fallbackData.metaDescription;
    if (created) document.head.appendChild(meta);
    return () => { if (created) meta.remove(); };
  }, [subpage.metaTitle, subpage.metaDescription]);

  useEffect(() => {
    const onScroll = () => setNavHidden(brochurePopup || window.scrollY > window.innerHeight - 100);
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [brochurePopup]);

  return <><style>{`.mobile-fixed-cta{position:fixed;bottom:0;left:0;right:0;background:var(--rr-paper);border-top:1px solid rgba(20,18,26,.08);padding:12px 16px;z-index:99;display:flex;justify-content:center;box-shadow:0 -4px 20px rgba(0,0,0,.05)}body{padding-bottom:70px}.one-prime-hero .osc-hero__bg img{object-fit:cover;object-position:center;transform:scale(1.01)}.one-prime-hero__logo{height:clamp(58px,7vw,86px);max-width:min(320px,80vw);object-fit:contain}.one-prime-videos{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:24px}.one-prime-video__title{font-size:clamp(18px,2vw,24px);margin:0 0 14px;color:var(--rr-ink)}.one-prime-video__frame{position:relative;padding-bottom:56.25%;height:0;overflow:hidden;border-radius:12px;background:#111;box-shadow:0 24px 60px rgba(20,18,26,.18)}.one-prime-video__frame iframe{position:absolute;inset:0;width:100%;height:100%;border:0}.one-prime-gallery-section{background:var(--rr-indigo);color:#fff}.one-prime-gallery-section .rr-grad{background:none;-webkit-background-clip:initial;background-clip:initial;-webkit-text-fill-color:var(--rr-lime);color:var(--rr-lime)}.one-prime-gallery-section .osc-gallery__btn{box-shadow:0 18px 48px rgba(0,0,0,.22)}.one-prime-video__button{cursor:pointer;position:relative;border-radius:12px;overflow:hidden;border:0;padding:0;width:100%;background:#111;display:block}.one-prime-video__button img{width:100%;aspect-ratio:16/9;min-height:260px;object-fit:cover;display:block}.one-prime-video__overlay{position:absolute;inset:0;display:grid;place-items:center;background:rgba(20,18,26,.3)}.one-prime-video__play{width:72px;height:72px;border-radius:50%;background:var(--rr-lime);display:grid;place-items:center;color:var(--rr-ink)}@media (max-width:760px){.one-prime-videos{grid-template-columns:1fr}.one-prime-video__button img{min-height:220px}}@media (min-width:641px){.mobile-fixed-cta{display:none}body{padding-bottom:0}}`}</style><Nav onContact={onContact} hidden={navHidden} solid /><main><HeroSection subpage={subpage} onBrochureClick={() => setBrochurePopup(true)} /><StickyNav subpage={subpage} /><OverviewSection subpage={subpage} /><AmenitiesSection subpage={subpage} /><FloorPlansSection subpage={subpage} /><WalkthroughSection subpage={subpage} /><ImageGridSection id="gallery" eyebrow="GALLERY" title="Gallery and construction updates" accent="from One Prime Residential." images={[...(subpage.galleryImages || []), ...(subpage.constructionUpdates || [])]} dark /><LocationSection subpage={subpage} /><section className="section-pad osc-section" id="brochure-cta"><div className="rr-wrap" style={{ textAlign: "center" }}><Reveal><h2 className="osc-section__title" style={{ marginBottom: "16px" }}>Ready to explore One Prime?<br /><span className="rr-grad">Download the brochure.</span></h2><p style={{ fontSize: "var(--rr-fs-lead)", color: "rgba(35,31,32,0.62)", lineHeight: "1.6", margin: "0 auto 36px", maxWidth: "48ch" }}>Get detailed information about One Prime Residential including amenities, floor plans, and project specifications.</p><button className="submit-btn" onClick={() => setBrochurePopup(true)} style={{ display: "inline-flex" }}>Download Brochure<CtaArrow /></button></Reveal></div></section></main><Footer />{brochurePopup ? <BrochurePopup subpage={subpage} onClose={() => setBrochurePopup(false)} /> : null}<MobileFixedCta onBrochureClick={() => setBrochurePopup(true)} /></>;
}
