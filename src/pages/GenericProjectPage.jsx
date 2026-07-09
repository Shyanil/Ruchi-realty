import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";
import { CardArrow } from "../components/ProjectsSection";

const ICONS = {
  location: "assets/projects/oscar/icon-location.webp",
  amenities: "assets/projects/oscar/icon-amenities.webp",
  infrastructure: "assets/projects/oscar/icon-infrastructure.webp",
  size: "assets/projects/oscar/icon-size.webp",
};

const FALLBACK_SUBPAGES = {
  "oscar-fort-indore": {
    "heroTitle": "Oscar Fort",
    "heroTagline": "Your Journey To a Royal Living begins here",
    "heroLogo": "/projects/oscar-fort-indore/logo.png",
    "heroBg": "/projects/oscar-fort-indore/hero.jpg",
    "overviewParagraphs": [
      "Memorable moments with a royal touch make all the difference. Each occasion of your life deserves a royal welcome. It is time that you get it every single day of your life. It is your time to rule."
    ],
    "overviewHighlights": [
      {
        "label": "Premium Township",
        "desc": "A premium township close to the city.",
        "icon": "infrastructure"
      },
      {
        "label": "Limited Edition Plots",
        "desc": "A limited-edition plotted community for the privileged few.",
        "icon": "size"
      },
      {
        "label": "Gated Community",
        "desc": "A planned community with security and everyday comfort.",
        "icon": "location"
      },
      {
        "label": "Royal Living",
        "desc": "A lifestyle crafted around memorable everyday moments.",
        "icon": "amenities"
      }
    ],
    "amenities": [
      {
        "name": "Highly Secured Fort Wall",
        "icon": "security"
      },
      {
        "name": "Zero Edge Swimming Pool",
        "icon": "pool"
      },
      {
        "name": "Jacuzzi / Steam / Sauna",
        "icon": "spa"
      },
      {
        "name": "Yoga & Meditation Area",
        "icon": "yoga"
      },
      {
        "name": "Amphitheatre",
        "icon": "club"
      },
      {
        "name": "Indoor & Outdoor Gym",
        "icon": "gym"
      },
      {
        "name": "Kids Play Area",
        "icon": "playground"
      },
      {
        "name": "Senior Citizen Garden",
        "icon": "garden"
      },
      {
        "name": "Outdoor Games Area",
        "icon": "tennis"
      },
      {
        "name": "Library",
        "icon": "library"
      },
      {
        "name": "All Modern Securities System",
        "icon": "security"
      },
      {
        "name": "CCTV Surveillance",
        "icon": "security"
      },
      {
        "name": "Banquet Hall",
        "icon": "hall"
      },
      {
        "name": "Fort Grand Entry",
        "icon": "infrastructure"
      },
      {
        "name": "Avenue Water Features",
        "icon": "garden"
      },
      {
        "name": "Outdoor Games (Cricket Mini Turf / Basketball Court)",
        "icon": "tennis"
      },
      {
        "name": "Underground Services (Electric & Wifi Cables)",
        "icon": "infrastructure"
      },
      {
        "name": "Indoor Games Room (Chess / Carrom / Card Room / Table Tennis / Billiards)",
        "icon": "table"
      }
    ],
    "specifications": [
      {
        "title": "A Unique Abode for You",
        "desc": "Your Highness: For those whose life has a distinct flavour of royalty, here's an opportunity crafted just for you. A dwelling for the privileged few, it's a limited edition. Just a few plots at this premium township close to the city. Come, live the royal life."
      },
      {
        "title": "Rule Your Fort",
        "desc": "Your Highness: Oscar Fort offers more than just materialistic supremacy. It will have a deeper meaning - it will be your kingdom of dreams and happiness. With a whole new approach to leisure spaces, you can express your joy without interruptions."
      },
      {
        "title": "Vast Expanses Beckon You",
        "desc": "Your Highness: Oscar Fort sprawls over several acres with the serenity of a country township and modern amenities of city life. Functional areas for all age groups make Oscar Fort a one-in-a-kind gated community."
      },
      {
        "title": "A Royal Canvas",
        "desc": "Your Highness: A breathtaking landscape with lush green surroundings and well-kept grounds make it a perfect home sweet home community for the kings and queens, princes and princesses."
      },
      {
        "title": "Home Loan Available from HDFC",
        "desc": "Banking partner section found in the source. Logo asset: /projects/oscar-fort-indore/hdfc-home-loan-logo.png"
      },
      {
        "title": "Project Address",
        "desc": "Oscar Fort, Bicholi Hapsi, Near Mayank Blue Water Park, Indore. RERA: P-IND-22-3414."
      },
      {
        "title": "Layout Legend",
        "desc": "Entrance Court, Formal Garden-01, Roads, Plots, Formal Garden-02, Active Area-01 (MUGA), Baoli Style Amphitheatre, Kids Play Zone, Avenue, Active Area-02, Leisure Garden, Project Signage, Guard Room, Parterres, Lawns, Water Feature Wall, Baradari."
      },
      {
        "title": "__floor_plans__",
        "desc": "[{\"title\":\"Layout Plan\",\"desc\":\"/projects/oscar-fort-indore/layout-plan.jpg\"},{\"title\":\"Exciting Location\",\"desc\":\"/projects/oscar-fort-indore/exciting-location.jpg\"},{\"title\":\"Upcoming Phase\",\"desc\":\"/projects/oscar-fort-indore/upcoming-phase.jpg\"}]"
      },
      {
        "title": "__video_section__",
        "desc": "{\"enabled\":true,\"title\":\"Walk Through\",\"videoUrl\":\"https://player.vimeo.com/video/735387729?h=0982bb9b19\",\"thumbnailUrl\":\"/projects/oscar-fort-indore/hero.jpg\"}"
      }
    ],
    "locationImage": "/projects/oscar-fort-indore/exciting-location.jpg",
    "locationMapEmbed": "",
    "locationDestinations": [
      {
        "name": "Bicholi Hapsi",
        "dist": "Indore"
      },
      {
        "name": "Mayank Blue Water Park",
        "dist": "Nearby"
      },
      {
        "name": "RERA",
        "dist": "P-IND-22-3414"
      }
    ],
    "walkthroughVideoId": "https://player.vimeo.com/video/735387729?h=0982bb9b19",
    "galleryImages": [
      {
        "src": "/projects/oscar-fort-indore/gallery-1.jpg",
        "alt": "Oscar Fort gallery image 1"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-2.jpg",
        "alt": "Oscar Fort gallery image 2"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-3.jpg",
        "alt": "Oscar Fort gallery image 3"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-4.jpg",
        "alt": "Oscar Fort gallery image 4"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-5.jpg",
        "alt": "Oscar Fort gallery image 5"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-6.jpg",
        "alt": "Oscar Fort gallery image 6"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-7.jpg",
        "alt": "Oscar Fort gallery image 7"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-8.jpg",
        "alt": "Oscar Fort gallery image 8"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-9.jpg",
        "alt": "Oscar Fort gallery image 9"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-10.jpg",
        "alt": "Oscar Fort gallery image 10"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-11.jpg",
        "alt": "Oscar Fort gallery image 11"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-12.jpg",
        "alt": "Oscar Fort gallery image 12"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-13.jpg",
        "alt": "Oscar Fort gallery image 13"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-14.jpg",
        "alt": "Oscar Fort gallery image 14"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-15.jpg",
        "alt": "Oscar Fort gallery image 15"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-16.jpg",
        "alt": "Oscar Fort gallery image 16"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-17.jpg",
        "alt": "Oscar Fort gallery image 17"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-18.jpg",
        "alt": "Oscar Fort gallery image 18"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-19.jpg",
        "alt": "Oscar Fort gallery image 19"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-20.jpg",
        "alt": "Oscar Fort gallery image 20"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-21.jpg",
        "alt": "Oscar Fort gallery image 21"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-22.jpg",
        "alt": "Oscar Fort gallery image 22"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-23.jpg",
        "alt": "Oscar Fort gallery image 23"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-24.jpg",
        "alt": "Oscar Fort gallery image 24"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-25.jpg",
        "alt": "Oscar Fort gallery image 25"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-26.jpg",
        "alt": "Oscar Fort gallery image 26"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-27.jpg",
        "alt": "Oscar Fort gallery image 27"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-28.jpg",
        "alt": "Oscar Fort gallery image 28"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-29.jpg",
        "alt": "Oscar Fort gallery image 29"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-30.jpg",
        "alt": "Oscar Fort gallery image 30"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-31.jpg",
        "alt": "Oscar Fort gallery image 31"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-32.jpg",
        "alt": "Oscar Fort gallery image 32"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-33.jpg",
        "alt": "Oscar Fort gallery image 33"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-34.jpg",
        "alt": "Oscar Fort gallery image 34"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-35.jpg",
        "alt": "Oscar Fort gallery image 35"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-36.jpg",
        "alt": "Oscar Fort gallery image 36"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-37.jpg",
        "alt": "Oscar Fort gallery image 37"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-38.jpg",
        "alt": "Oscar Fort gallery image 38"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-39.jpg",
        "alt": "Oscar Fort gallery image 39"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-40.jpg",
        "alt": "Oscar Fort gallery image 40"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-41.jpg",
        "alt": "Oscar Fort gallery image 41"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-42.jpg",
        "alt": "Oscar Fort gallery image 42"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-43.jpg",
        "alt": "Oscar Fort gallery image 43"
      }
    ],
    "brochureUrl": "",
    "metaTitle": "Oscar Fort Indore - Ruchi Realty",
    "metaDescription": "Experience royal living at Oscar Fort, a premium gated township in Indore with limited-edition plots, green open spaces, modern amenities, and a lifestyle crafted for memorable everyday moments."
  },
  "lifescapes-bhopal": {
    heroTitle: "Ruchi Lifescapes",
    heroTagline: "Discover luxury living at Ruchi Lifescapes Bhopal, offering residential options from 1000 to 4000 sqft. and ample amenities.",
    heroLogo: "/projects/lifescapes-bhopal/logo.png",
    heroBg: "/projects/lifescapes-bhopal/card.webp",
    overviewParagraphs: [
      "Discover the pinnacle of luxury living at Ruchi Lifescapes Bhopal, where every aspect of convenience and elegance converges seamlessly. Situated in the heart of Bhopal, Madhya Pradesh, this prestigious real estate project offers a lifestyle that surpasses all expectations.",
      "Spanning across one of the most sought-after areas in the city, Ruchi Lifescapes Bhopal presents a diverse range of living spaces, including row houses, apartments, and shops, with sizes ranging from 1000 to 4000 square feet. Whether you are seeking a cozy abode or a spacious dwelling, our project caters to all preferences.",
      "What sets Ruchi Lifescapes apart is not just its luxurious accommodations but also its extensive array of amenities designed to enhance your quality of life. Enjoy leisurely strolls in lush parks, rejuvenate your senses in the swimming pool, maintain your fitness regime in the well-equipped gymnasium, or seek solace in the serene temple. Additionally, engage in friendly matches at the tennis court, spend quality time with your little ones in the children's park, or unwind with a game of squash.",
      "Furthermore, Ruchi Lifescapes Bhopal boasts an enviable location, providing easy access to key destinations such as hotels, schools, hospitals, malls, and railway stations. Whether you are commuting for work or leisure, you will appreciate the convenience of our prime location.",
      "To embark on your journey towards luxury living, schedule a site visit to explore our meticulously crafted residences and amenities. Our team is ready to assist you in registering for discussions or addressing any inquiries you may have. Simply call us to take the first step towards securing your dream home.",
      "At Ruchi Lifescapes Bhopal, we redefine urban living by combining comfort, convenience, and sophistication, ensuring that every moment spent within our premises is nothing short of extraordinary."
    ],
    overviewHighlights: [
      { label: "1000-4000 sqft. & Shops", desc: "Residential options and shops planned across practical sizes.", icon: "size" },
      { label: "Row Houses & Apartments", desc: "A mix of row houses, apartments, and shops.", icon: "infrastructure" },
      { label: "Ample Amenities", desc: "Lifestyle amenities for daily comfort and recreation.", icon: "amenities" },
      { label: "Prime Location", desc: "Connected Bhopal address close to key destinations.", icon: "location" }
    ],
    amenities: [
      { name: "Tennis Court", icon: "tennis" },
      { name: "Swimming Pool", icon: "pool" },
      { name: "Gymnasium", icon: "gym" },
      { name: "Temple", icon: "temple" },
      { name: "Children Park", icon: "playground" },
      { name: "Club House", icon: "club" },
      { name: "Park", icon: "garden" },
      { name: "Squash", icon: "tennis" }
    ],
    specifications: [
      { title: "__floor_plans__", desc: "[{\"title\":\"Master Layout\",\"desc\":\"/projects/lifescapes-bhopal/floor-master.jpg\"},{\"title\":\"2.5 BHK\",\"desc\":\"/projects/lifescapes-bhopal/floor-2-5-bhk.jpg\"},{\"title\":\"3 BHK\",\"desc\":\"/projects/lifescapes-bhopal/floor-3-bhk.jpg\"},{\"title\":\"Orchid Row House\",\"desc\":\"/projects/lifescapes-bhopal/floor-orchid-row-house.jpg\"},{\"title\":\"Orchid Row House 2\",\"desc\":\"/projects/lifescapes-bhopal/floor-orchid-row-house-2.jpg\"},{\"title\":\"Tulip Twin Bungalow\",\"desc\":\"/projects/lifescapes-bhopal/floor-tulip-twin-bungalow.jpg\"},{\"title\":\"Villa\",\"desc\":\"/projects/lifescapes-bhopal/floor-villa.jpg\"}]" },
      { title: "__video_section__", desc: "{\"enabled\":false,\"videoUrl\":\"\",\"thumbnailUrl\":\"\"}" }
    ],
    locationImage: "/projects/lifescapes-bhopal/card.webp",
    locationMapEmbed: "https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d29343.66289393302!2d77.480543!3d23.171738!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x397c4151987d099f%3A0x67b31fc6a7762900!2sRuchi%20Lifescape%2C%20Jatkhedi%2C%20Bhopal%2C%20Madhya%20Pradesh%20462047%2C%20India!5e0!3m2!1sen!2sus!4v1691840678888!5m2!1sen!2sus",
    locationDestinations: [
      { name: "Hotel", dist: "1 km" },
      { name: "School", dist: "2 km" },
      { name: "Airport", dist: "18 km" },
      { name: "Hospital", dist: "3 km" },
      { name: "Mall", dist: "9 km" },
      { name: "Railway Station", dist: "7 km" }
    ],
    galleryImages: [
      { src: "/projects/lifescapes-bhopal/gallery-1.jpg", alt: "Ruchi Lifescapes Bhopal gallery image 1" },
      { src: "/projects/lifescapes-bhopal/gallery-2.jpg", alt: "Ruchi Lifescapes Bhopal gallery image 2" },
      { src: "/projects/lifescapes-bhopal/gallery-3.jpg", alt: "Ruchi Lifescapes Bhopal gallery image 3" },
      { src: "/projects/lifescapes-bhopal/gallery-4.jpg", alt: "Ruchi Lifescapes Bhopal gallery image 4" },
      { src: "/projects/lifescapes-bhopal/gallery-5.jpg", alt: "Ruchi Lifescapes Bhopal gallery image 5" },
      { src: "/projects/lifescapes-bhopal/gallery-6.jpg", alt: "Ruchi Lifescapes Bhopal gallery image 6" }
    ],
    brochureUrl: "/projects/lifescapes-bhopal/brochure.pdf",
    metaTitle: "Ruchi Lifescapes Bhopal - Ruchi Realty",
    metaDescription: "Discover luxury living at Ruchi Lifescapes Bhopal, offering residential options from 1000 to 4000 sqft. and ample amenities.",
  },
};
const DEFAULT_HIGHLIGHTS = [
  { label: "Prime Location", desc: "Well-connected address with everyday conveniences close by.", icon: "location" },
  { label: "Lifestyle Amenities", desc: "Thoughtfully planned spaces for daily comfort and community living.", icon: "amenities" },
  { label: "Quality Infrastructure", desc: "Designed with dependable services, security, and long-term usability.", icon: "infrastructure" },
  { label: "Flexible Spaces", desc: "Practical layouts planned for modern residential and investment needs.", icon: "size" },
];

function assetUrl(src = "") {
  if (!src) return "";
  if (/^(https?:|data:|blob:|\/)/.test(src)) return src;
  return `/${src.replace(/^\.\//, "")}`;
}

function parseJson(value, fallback) {
  try {
    const parsed = JSON.parse(value || "");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function extractCustomSpecs(specifications = []) {
  const custom = { specifications: [], floorPlans: [], videoSection: null, locationMapUrl: "" };
  specifications.forEach((item) => {
    if (item.title === "__floor_plans__") custom.floorPlans = parseJson(item.desc, []);
    else if (item.title === "__video_section__") custom.videoSection = parseJson(item.desc, null);
    else if (item.title === "__location_map_url__") custom.locationMapUrl = item.desc || "";
    else if (!String(item.title || "").startsWith("__")) custom.specifications.push(item);
  });
  return custom;
}

function embedSrc(value = "") {
  const text = String(value || "").trim();
  if (!text) return "";
  const match = text.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : text;
}

function videoEmbedUrl(value = "") {
  const text = String(value || "").trim();
  if (!text) return "";
  if (/youtube\.com\/embed\//i.test(text)) return text;
  const watch = text.match(/[?&]v=([^&]+)/i);
  const short = text.match(/youtu\.be\/([^?&]+)/i);
  const id = watch?.[1] || short?.[1] || (/^[A-Za-z0-9_-]{8,}$/.test(text) ? text : "");
  return id ? `https://www.youtube.com/embed/${id}` : text;
}

function highlightIconSrc(icon, index) {
  const key = String(icon || DEFAULT_HIGHLIGHTS[index]?.icon || "").toLowerCase();
  if (ICONS[key]) return assetUrl(ICONS[key]);
  if (/^https?:\/\//.test(icon) || String(icon || "").includes("/")) return assetUrl(icon);
  return assetUrl(ICONS[DEFAULT_HIGHLIGHTS[index]?.icon] || ICONS.location);
}

function normalizeProjectSubpage(project, sp) {
  const custom = extractCustomSpecs(sp?.specifications || []);
  const title = sp?.heroTitle || project?.title || project?.name || "Project";
  const description = project?.description || "Explore this Ruchi Realty project with thoughtfully planned spaces, dependable execution, and a location selected for everyday convenience.";
  const videoSection = custom.videoSection || {};
  const videoUrl = videoSection.enabled === false ? "" : (videoSection.videoUrl || sp?.walkthroughVideoId || "");
  return {
    title,
    type: project?.type || "Residential",
    slug: project?.slug || "",
    location: project?.location || project?.city || "",
    tag: sp?.heroTagline || project?.tag || description,
    heroLogo: assetUrl(sp?.heroLogo || ""),
    heroBg: assetUrl(sp?.heroBg || project?.image_url || project?.img || "assets/projects/oscar-billionaires.webp"),
    overviewParagraphs: sp?.overviewParagraphs?.length ? sp.overviewParagraphs : [description],
    overviewHighlights: sp?.overviewHighlights?.length ? sp.overviewHighlights.slice(0, 4) : DEFAULT_HIGHLIGHTS,
    amenities: Array.isArray(sp?.amenities) ? sp.amenities : [],
    specifications: custom.specifications,
    floorPlans: (custom.floorPlans || []).filter((plan) => plan?.desc).map((plan) => ({ ...plan, desc: assetUrl(plan.desc) })),
    videoSection: {
      title: videoSection.title || "Construction Walkthrough",
      videoUrl: videoEmbedUrl(videoUrl),
      thumbnailUrl: assetUrl(videoSection.thumbnailUrl || ""),
    },
    locationImage: assetUrl(sp?.locationImage || custom.locationMapUrl || ""),
    locationMapEmbed: embedSrc(sp?.locationMapEmbed || ""),
    locationDestinations: Array.isArray(sp?.locationDestinations) ? sp.locationDestinations : [],
    galleryImages: (sp?.galleryImages || []).map((img) => ({ ...img, src: assetUrl(img.src) })),
    brochureUrl: assetUrl(sp?.brochureUrl || ""),
    metaTitle: sp?.metaTitle || `${title} | Ruchi Realty`,
    metaDescription: sp?.metaDescription || description,
  };
}

function CtaArrow() {
  return <CardArrow />;
}

function AmenityIcon({ icon, name }) {
  const key = String(icon || name || "").toLowerCase();
  const common = { viewBox: "0 0 48 48", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round" };
  if (key.includes("pool") || key.includes("swim")) return <svg {...common}><path d="M7 31c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3"/><path d="M7 38c4 0 4-3 8-3s4 3 8 3 4-3 8-3 4 3 8 3"/><path d="M18 24V10a5 5 0 0 1 10 0"/><path d="M18 16h12"/></svg>;
  if (key.includes("gym") || key.includes("fitness")) return <svg {...common}><path d="M8 24h32"/><path d="M13 18v12M18 16v16M30 16v16M35 18v12"/></svg>;
  if (key.includes("badminton") || key.includes("tennis")) return <svg {...common}><circle cx="17" cy="17" r="8"/><path d="M23 23l14 14"/><path d="M12 17h10M17 12v10"/></svg>;
  if (key.includes("table")) return <svg {...common}><path d="M9 18h30v12H9z"/><path d="M24 18v12M14 30l-3 9M34 30l3 9"/><circle cx="34" cy="13" r="3"/></svg>;
  if (key.includes("yoga") || key.includes("meditation")) return <svg {...common}><circle cx="24" cy="11" r="4"/><path d="M24 17v10M14 23l10 4 10-4M16 37l8-10 8 10"/></svg>;
  if (key.includes("jog")) return <svg {...common}><circle cx="29" cy="10" r="4"/><path d="M25 17l-5 8 8 3 4 10"/><path d="M20 25l-7 3M28 28l-8 10"/></svg>;
  if (key.includes("library")) return <svg {...common}><path d="M10 11h11v28H10zM27 11h11v28H27z"/><path d="M14 17h3M31 17h3M14 33h3M31 33h3"/></svg>;
  if (key.includes("hall") || key.includes("club")) return <svg {...common}><path d="M8 21l16-11 16 11"/><path d="M13 20v18h22V20"/><path d="M20 38V27h8v11"/></svg>;
  if (key.includes("play")) return <svg {...common}><path d="M12 35l12-22 12 22"/><path d="M18 25h12M15 35h18"/><circle cx="24" cy="13" r="3"/></svg>;
  if (key.includes("landscape") || key.includes("garden")) return <svg {...common}><path d="M24 39V21"/><path d="M24 21c-8 0-12-5-12-12 8 0 12 5 12 12Z"/><path d="M24 25c8 0 12-5 12-12-8 0-12 5-12 12Z"/></svg>;
  if (key.includes("parking")) return <svg {...common}><path d="M16 39V9h11a9 9 0 0 1 0 18H16"/><path d="M16 27h11"/></svg>;
  if (key.includes("security")) return <svg {...common}><path d="M24 6l15 6v10c0 10-6 17-15 20-9-3-15-10-15-20V12l15-6Z"/><path d="M18 24l4 4 8-9"/></svg>;
  if (key.includes("generator") || key.includes("power")) return <svg {...common}><path d="M14 14h20v24H14z"/><path d="M19 14V9h10v5"/><path d="M26 20l-5 8h6l-5 8"/></svg>;
  return <svg {...common}><circle cx="24" cy="24" r="17"/><path d="M16 27l5 5 12-15"/></svg>;
}

function SectionNav({ data }) {
  const sections = [
    ["overview", true],
    ["amenities", data.amenities.length],
    ["specifications", data.specifications.length],
    ["floor-plans", data.floorPlans.length],
    ["walkthrough", data.videoSection.videoUrl],
    ["location", data.locationMapEmbed || data.locationImage || data.locationDestinations.length],
    ["gallery", data.galleryImages.length],
  ].filter(([, show]) => Boolean(show)).map(([id]) => id);
  return (
    <nav className="osc-sticky-nav" aria-label="Project sections">
      <div className="rr-wrap"><div className="osc-sticky-nav__inner">
        {sections.map((id) => <button key={id} type="button" className="osc-sticky-nav__btn" onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })}>{id.split("-").map((part) => part[0].toUpperCase() + part.slice(1)).join(" ")}</button>)}
      </div></div>
    </nav>
  );
}

function BrochurePopup({ data, onClose }) {
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const valid = form.name.trim() && form.phone.trim();
  const set = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const submit = async () => {
    if (!valid || sending) return;
    setSending(true);
    setError("");
    try {
      const result = await window.RuchiBackend.leads.submitLead({
        name: form.name,
        phone: form.phone,
        email: form.email,
        interest: data.title,
        source: `${data.title} brochure popup`,
        project_slug: data.slug,
        message: form.message || "Brochure/enquiry request from project subpage.",
      });
      if (result?.error) throw result.error;
      setSent(true);
      if (data.brochureUrl) window.open(data.brochureUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      setError(err?.message || "Could not submit your enquiry. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="osc-popup-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label="Download brochure">
      <div className="osc-popup" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="osc-popup__close" onClick={onClose} aria-label="Close">x</button>
        {sent ? <>
          <h3>Thank You!</h3>
          <p>{data.brochureUrl ? "Your brochure is opening in a new tab. Our team will reach out shortly." : "Your enquiry has been received. Our team will reach out shortly."}</p>
          <button className="submit-btn" type="button" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>Close<CtaArrow /></button>
        </> : <>
          <h3>Download Brochure</h3>
          <p>Enter your details to receive information about {data.title}.</p>
          <div className="field"><label>Name</label><input value={form.name} onChange={set("name")} placeholder="Your full name" /></div>
          <div className="field"><label>Phone</label><input value={form.phone} onChange={set("phone")} placeholder="+91" /></div>
          <div className="field"><label>Email</label><input type="email" value={form.email} onChange={set("email")} placeholder="you@email.com" /></div>
          <div className="field"><label>Message</label><input value={form.message} onChange={set("message")} placeholder="I would like to know more." /></div>
          <button className="submit-btn" type="button" onClick={submit} disabled={!valid || sending} style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}>{sending ? "Sending..." : data.brochureUrl ? "Download Now" : "Enquire Now"}<CtaArrow /></button>
          {error ? <p className="contact-error" style={{ margin: "12px 0 0", fontSize: "13px" }}>{error}</p> : null}
        </>}
      </div>
    </div>
  );
}

function BrochureCta({ data, onBrochure }) {
  const title = data.type === "Commercial" ? "Ready to grow your business?" : "Ready to own your dream residence?";
  return (
    <section className="section-pad osc-section" id="brochure-cta">
      <div className="rr-wrap" style={{ textAlign: "center" }}>
        <Reveal>
          <h2 className="osc-section__title" style={{ marginBottom: "16px" }}>{title}<br /><span className="rr-grad">Download the brochure.</span></h2>
          <p style={{ fontSize: "var(--rr-fs-lead)", color: "rgba(35,31,32,0.62)", lineHeight: "1.6", margin: "0 auto 36px", maxWidth: "48ch" }}>
            Get detailed information about {data.title} including unit plans, pricing, and project specifications.
          </p>
          <button className="submit-btn" type="button" onClick={onBrochure}>Download Brochure<CtaArrow /></button>
        </Reveal>
      </div>
    </section>
  );
}

function FloorPlansSection({ plans, title }) {
  const [active, setActive] = useState(0);
  if (!plans.length) return null;
  const plan = plans[Math.min(active, plans.length - 1)];
  return <section className="section-pad osc-section" id="floor-plans"><div className="rr-wrap"><Reveal><div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: 16 }}>Floor Plans</div><h2 className="osc-section__title">Floor plans<br /><span className="rr-grad">for planned living.</span></h2></Reveal><div style={{ marginTop: 36 }}><Reveal style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>{plans.map((p, idx) => <button key={p.title || idx} type="button" className={`submit-btn ${active === idx ? "" : "ab-btn-outline"}`} style={{ padding: "10px 20px", background: active === idx ? "var(--rr-indigo)" : "transparent", color: active === idx ? "#fff" : "var(--rr-ink)", border: "1px solid var(--rr-indigo)" }} onClick={() => setActive(idx)}>{p.title || `Plan ${idx + 1}`}{p.config ? ` - ${p.config}` : ""}</button>)}</Reveal><Reveal key={active} style={{ background: "rgba(20,18,26,0.03)", padding: "clamp(16px,4vw,32px)", border: "1px solid rgba(20,18,26,0.08)", borderRadius: 8, display: "grid", placeItems: "center" }}><img src={plan.desc} alt={plan.title || `${title} floor plan`} style={{ maxWidth: "100%", maxHeight: 560, objectFit: "contain", borderRadius: 4 }} /></Reveal></div></div></section>;
}

function WalkthroughSection({ video }) {
  if (!video?.videoUrl) return null;
  return <section className="section-pad osc-section osc-section--dark" id="walkthrough"><div className="rr-wrap"><Reveal><div className="sec-head sec-head--dark" style={{ marginBottom: 40 }}><div><div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Walkthrough</div><h2>{video.title || "Construction Walkthrough"}<br /><span className="rr-grad">project video.</span></h2></div></div></Reveal><Reveal><div style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#111", borderRadius: 8, overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,.28)" }}><iframe title={video.title || "Project walkthrough"} src={video.videoUrl} width="100%" height="100%" style={{ border: 0, position: "absolute", inset: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div></Reveal></div></section>;
}

export default function GenericProjectPage() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [subpage, setSubpage] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [brochurePopup, setBrochurePopup] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoaded(false);
      const { data: found } = await window.RuchiBackend.projects.getProjectBySlug(slug);
      if (!active) return;
      setProject(found);
      if (found?.id) {
        const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(found.id);
        if (active) setSubpage(sp || FALLBACK_SUBPAGES[slug] || null);
      }
      if (active) setLoaded(true);
    }
    load();
    return () => { active = false; };
  }, [slug]);

  const data = useMemo(() => normalizeProjectSubpage(project, subpage), [project, subpage]);
  const onBrochure = () => setBrochurePopup(true);

  useEffect(() => {
    document.title = data.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = data.metaDescription;
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/projects/${slug}`;
  }, [data.metaTitle, data.metaDescription, slug]);

  if (!loaded) {
    return <><Nav onContact={onBrochure} /><main className="section-pad rr-light"><div className="rr-wrap" style={{ paddingTop: 120 }}><p className="eyebrow" style={{ color: "var(--rr-indigo)" }}>Project</p><h1 className="osc-section__title">Loading project...</h1></div></main><Footer /></>;
  }

  if (!project) {
    return <><Nav onContact={onBrochure} /><main className="section-pad rr-light"><div className="rr-wrap" style={{ paddingTop: 120 }}><p className="eyebrow" style={{ color: "var(--rr-indigo)" }}>Project</p><h1 className="osc-section__title">Project not found.</h1><Link className="submit-btn" to="/projects">View all projects<CtaArrow /></Link></div></main><Footer /></>;
  }

  return (
    <>
      <Nav onContact={onBrochure} />
      <main>
        <header className="osc-hero" data-screen-label={data.title}>
          <div className="osc-hero__bg"><img src={data.heroBg} alt={data.title} /></div>
          <div className="osc-hero__overlay"></div>
          <div className="osc-hero__sig" aria-hidden="true"></div>
          <div className="rr-wrap osc-hero__wrap">
            <Reveal><div className="osc-hero__content">
              {data.heroLogo ? <img src={data.heroLogo} alt={`${data.title} logo`} style={{ maxWidth: "min(260px,70vw)", maxHeight: 90, objectFit: "contain", marginBottom: 18 }} /> : null}
              <h1 className="osc-hero__title">{data.title}</h1>
              {data.location ? <p className="osc-hero__city">{data.location}</p> : null}
              <p className="osc-hero__tagline">{data.tag}</p>
              <div className="osc-hero__actions"><Link className="submit-btn" to="/projects">More Projects<CtaArrow /></Link><button className="ab-btn-outline ab-btn-outline--white" type="button" onClick={onBrochure}>Download Brochure<CtaArrow /></button></div>
            </div></Reveal>
          </div>
          <div className="osc-hero__chips">{data.overviewHighlights.map((h, i) => <Reveal key={h.label || i} delay={i * 80} className="osc-chip"><img src={highlightIconSrc(h.icon, i)} alt="" style={{ width: 24, height: 24, marginBottom: 4, objectFit: "contain" }} /><span className="osc-chip__label">{h.label}</span><span className="osc-chip__desc">{h.desc}</span></Reveal>)}</div>
        </header>

        <SectionNav data={data} />

        <section className="section-pad osc-section" id="overview"><div className="rr-wrap"><Reveal><div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: 16 }}>Overview</div><h2 className="osc-section__title">Designed for everyday living,<br /><span className="rr-grad">backed by Ruchi Realty.</span></h2></Reveal><div className="osc-overview__grid"><Reveal className="osc-overview__text">{data.overviewParagraphs.map((p, i) => <p key={i}>{p}</p>)}</Reveal><div className="osc-overview__stats">{data.overviewHighlights.map((h, i) => <Reveal key={h.label || i} delay={i * 70} className="osc-stat-card"><span className="osc-stat-card__label">{h.label}</span><span className="osc-stat-card__desc">{h.desc}</span></Reveal>)}</div></div></div></section>

        {data.amenities.length ? <section className="section-pad osc-section osc-section--dark" id="amenities"><div className="rr-wrap"><div className="sec-head sec-head--dark" style={{ marginBottom: 48 }}><div><div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Amenities</div><h2>Project amenities,<br /><span className="rr-grad">planned around daily life.</span></h2></div></div><div className="osc-amenities__grid">{data.amenities.map((a, i) => <Reveal key={a.name || i} delay={i * 50} className="osc-amenity-card"><div className="osc-amenity-card__icon"><AmenityIcon icon={a.icon} name={a.name} /></div><h4 className="osc-amenity-card__name">{a.name}</h4></Reveal>)}</div></div></section> : null}

        {data.specifications.length ? <section className="section-pad osc-section" id="specifications"><div className="rr-wrap"><div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: 16 }}>Specifications</div><h2 className="osc-section__title">Built with practical,<br /><span className="rr-grad">durable specifications.</span></h2><div className="osc-specs__cards" style={{ marginTop: 32 }}>{data.specifications.map((s, i) => <Reveal key={s.title || i} delay={i * 50} className="osc-spec-card"><h4 className="osc-spec-card__title">{s.title}</h4><p className="osc-spec-card__desc">{s.desc}</p></Reveal>)}</div></div></section> : null}

        <FloorPlansSection plans={data.floorPlans} title={data.title} />
        <WalkthroughSection video={data.videoSection} />

        {(data.locationImage || data.locationMapEmbed || data.locationDestinations.length) ? <section className="section-pad osc-section osc-section--dark" id="location"><div className="rr-wrap"><div className="sec-head sec-head--dark" style={{ marginBottom: 48 }}><div><div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Location</div><h2>Connected location,<br /><span className="rr-grad">made for everyday access.</span></h2></div></div><div className="osc-location__grid">{data.locationImage ? <Reveal className="osc-location__visual"><img src={data.locationImage} alt={`${data.title} location`} className="osc-location__img" /></Reveal> : null}<Reveal className="osc-location__info"><div className="osc-location__list">{data.locationDestinations.map((d, i) => <div key={d.name || i} className="osc-location__item"><span className="osc-location__name">{d.name}</span><span className="osc-location__dist">{d.dist}</span></div>)}</div>{data.locationMapEmbed ? <div className="osc-location__map-wrap"><iframe title={`${data.title} location map`} src={data.locationMapEmbed} width="100%" height="300" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" /></div> : null}</Reveal></div></div></section> : null}

        {data.galleryImages.length ? <section className="section-pad osc-section" id="gallery"><div className="rr-wrap"><div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: 16 }}>Gallery</div><h2 className="osc-section__title">A closer look<br /><span className="rr-grad">at the project.</span></h2><div className="osc-gallery__grid" style={{ marginTop: 32 }}>{data.galleryImages.map((img, i) => <Reveal key={img.src || i} delay={(i % 4) * 50} className={`osc-gallery__item ${i === 0 ? "osc-gallery__item--wide" : ""}`}><div className="osc-gallery__btn"><img src={img.src} alt={img.alt || data.title} className="osc-gallery__img" loading="lazy" /></div></Reveal>)}</div></div></section> : null}

        <BrochureCta data={data} onBrochure={onBrochure} />
      </main>
      <Footer />
      {brochurePopup ? <BrochurePopup data={data} onClose={() => setBrochurePopup(false)} /> : null}
    </>
  );
}
