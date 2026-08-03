import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal, RImg } from "../components/shared";
import { CardArrow, ProjectTile } from "../components/ProjectsSection";
import { PROJECTS } from "../data/projects";
import { OSCAR_PRIDE_FALLBACK } from "../data/oscarPride";
import { OSCAR_PALACE_FALLBACK } from "../data/oscarPalace";
import { RUCHI_LIFESCAPES_INDORE_FALLBACK } from "../data/ruchiLifescapesIndore";
import { ANAND_VIHAR_INDORE_FALLBACK } from "../data/anandViharIndore";
import { SAATVIK_GREEN_INDORE_FALLBACK } from "../data/saatvikGreenIndore";
import { SAATVIK_VIHAR_INDORE_FALLBACK } from "../data/saatvikViharIndore";
import { RUCHI_ENCLAVE_INDORE_FALLBACK } from "../data/ruchiEnclaveIndore";
import { ONE_VICTORIA_FALLBACK } from "../data/oneVictoria";
import { OSCAR_SANCTUARY_INDORE_FALLBACK } from "../data/oscarSanctuaryIndore";
import { OSCAR_FALLBACK } from "./OscarPage";
import { ACTIVE_BUSINESS_PARK_FALLBACK } from "./ActiveBusinessParkPage";
import { ACTIVE_ACRES_ANGELICA_FALLBACK } from "./ActiveAcresAngelicaPage";
import { ACTIVE_GREENS_FALLBACK } from "./ActiveGreensPage";
import { ONE_RAJARHAT_FALLBACK } from "./OneRajarhatPage";
import { ONE_PRIME_RESIDENTIAL_FALLBACK } from "./OnePrimeResidentialPage";

const PROJECT_LEGACY_META = {
  "oscar-indore": { city: "Indore", type: "Premium Plotted Development" },
  "active-business-park": { city: "Kolkata", type: "Commercial" },
  "active-acres-angelica": { city: "Kolkata", type: "Residential" },
  "active-greens": { city: "Kolkata", type: "Residential" },
  "one-rajarhat": { city: "Rajarhat, Kolkata", type: "Residential" },
  "one-prime-residential": { city: "New Town, Kolkata", type: "Residential" },
};
const ICONS = {
  location: "assets/projects/oscar/icon-location.webp",
  amenities: "assets/projects/oscar/icon-amenities.webp",
  infrastructure: "assets/projects/oscar/icon-infrastructure.webp",
  size: "assets/projects/oscar/icon-size.webp",
};

const FALLBACK_SUBPAGES = {
  "oscar-indore": OSCAR_FALLBACK,
  "active-business-park": ACTIVE_BUSINESS_PARK_FALLBACK,
  "active-acres-angelica": ACTIVE_ACRES_ANGELICA_FALLBACK,
  "active-greens": ACTIVE_GREENS_FALLBACK,
  "one-rajarhat": ONE_RAJARHAT_FALLBACK,
  "one-prime-residential": ONE_PRIME_RESIDENTIAL_FALLBACK,
  "oscar-sanctuary-indore": OSCAR_SANCTUARY_INDORE_FALLBACK,
  "one-victoria-new-town": ONE_VICTORIA_FALLBACK,
  "oscar-pride-indore": OSCAR_PRIDE_FALLBACK,
  "oscar-palace": OSCAR_PALACE_FALLBACK,
  "ruchi-lifescapes-indore-project": RUCHI_LIFESCAPES_INDORE_FALLBACK,
  "anand-vihar-indore": ANAND_VIHAR_INDORE_FALLBACK,
  "saatvikgreen-indore": SAATVIK_GREEN_INDORE_FALLBACK,
  "saatvik-vihar-indore": SAATVIK_VIHAR_INDORE_FALLBACK,
  "ruchi-enclave-indore": RUCHI_ENCLAVE_INDORE_FALLBACK,
  "oscar-fort-indore": {
    "heroTitle": "Oscar Fort",
    "heroTagline": "Your Journey To a Royal Living begins here",
    "heroLogo": "/projects/oscar-fort-indore/logo.webp",
    "heroBg": "/projects/oscar-fort-indore/hero.webp",
    "overviewParagraphs": [
      "Memorable moments with a royal touch make all the difference. Each occasion of your life deserves a royal welcome. It is time that you get it every single day of your life. It is your time to rule."
    ],
    "overviewHighlights": [
      {
        "label": "Residential",
        "desc": "A premium residential development close to the city.",
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
        "desc": "Your Highness: For those whose life has a distinct flavour of royalty, here's an opportunity crafted just for you. A dwelling for the privileged few, it's a limited edition. Just a few plots at this premium residential development close to the city. Come, live the royal life."
      },
      {
        "title": "Rule Your Fort",
        "desc": "Your Highness: Oscar Fort offers more than just materialistic supremacy. It will have a deeper meaning - it will be your kingdom of dreams and happiness. With a whole new approach to leisure spaces, you can express your joy without interruptions."
      },
      {
        "title": "Vast Expanses Beckon You",
        "desc": "Your Highness: Oscar Fort sprawls over several acres with peaceful surroundings and modern amenities of city life. Functional areas for all age groups make Oscar Fort a one-in-a-kind gated community."
      },
      {
        "title": "A Royal Canvas",
        "desc": "Your Highness: A breathtaking landscape with lush green surroundings and well-kept grounds make it a perfect home sweet home community for the kings and queens, princes and princesses."
      },
      {
        "title": "Home Loan Available from HDFC",
        "desc": "Banking partner section found in the source. Logo asset: /projects/oscar-fort-indore/hdfc-home-loan-logo.webp"
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
        "desc": "[{\"title\":\"Layout Plan\",\"desc\":\"/projects/oscar-fort-indore/layout-plan.webp\"},{\"title\":\"Exciting Location\",\"desc\":\"/projects/oscar-fort-indore/exciting-location.webp\"},{\"title\":\"Upcoming Phase\",\"desc\":\"/projects/oscar-fort-indore/upcoming-phase.webp\"}]"
      },
      {
        "title": "__video_section__",
        "desc": "{\"enabled\":true,\"title\":\"Walk Through\",\"videoUrl\":\"https://player.vimeo.com/video/735387729?h=0982bb9b19\",\"thumbnailUrl\":\"/projects/oscar-fort-indore/hero.webp\"}"
      }
    ],
    "locationImage": "/projects/oscar-fort-indore/exciting-location.webp",
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
        "src": "/projects/oscar-fort-indore/gallery-1.webp",
        "alt": "Oscar Fort gallery image 1"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-2.webp",
        "alt": "Oscar Fort gallery image 2"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-3.webp",
        "alt": "Oscar Fort gallery image 3"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-4.webp",
        "alt": "Oscar Fort gallery image 4"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-5.webp",
        "alt": "Oscar Fort gallery image 5"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-6.webp",
        "alt": "Oscar Fort gallery image 6"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-7.webp",
        "alt": "Oscar Fort gallery image 7"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-8.webp",
        "alt": "Oscar Fort gallery image 8"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-9.webp",
        "alt": "Oscar Fort gallery image 9"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-10.webp",
        "alt": "Oscar Fort gallery image 10"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-11.webp",
        "alt": "Oscar Fort gallery image 11"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-12.webp",
        "alt": "Oscar Fort gallery image 12"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-13.webp",
        "alt": "Oscar Fort gallery image 13"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-14.webp",
        "alt": "Oscar Fort gallery image 14"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-15.webp",
        "alt": "Oscar Fort gallery image 15"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-16.webp",
        "alt": "Oscar Fort gallery image 16"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-17.webp",
        "alt": "Oscar Fort gallery image 17"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-18.webp",
        "alt": "Oscar Fort gallery image 18"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-19.webp",
        "alt": "Oscar Fort gallery image 19"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-20.webp",
        "alt": "Oscar Fort gallery image 20"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-21.webp",
        "alt": "Oscar Fort gallery image 21"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-22.webp",
        "alt": "Oscar Fort gallery image 22"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-23.webp",
        "alt": "Oscar Fort gallery image 23"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-24.webp",
        "alt": "Oscar Fort gallery image 24"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-25.webp",
        "alt": "Oscar Fort gallery image 25"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-26.webp",
        "alt": "Oscar Fort gallery image 26"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-27.webp",
        "alt": "Oscar Fort gallery image 27"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-28.webp",
        "alt": "Oscar Fort gallery image 28"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-29.webp",
        "alt": "Oscar Fort gallery image 29"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-30.webp",
        "alt": "Oscar Fort gallery image 30"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-31.webp",
        "alt": "Oscar Fort gallery image 31"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-32.webp",
        "alt": "Oscar Fort gallery image 32"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-33.webp",
        "alt": "Oscar Fort gallery image 33"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-34.webp",
        "alt": "Oscar Fort gallery image 34"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-35.webp",
        "alt": "Oscar Fort gallery image 35"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-36.webp",
        "alt": "Oscar Fort gallery image 36"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-37.webp",
        "alt": "Oscar Fort gallery image 37"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-38.webp",
        "alt": "Oscar Fort gallery image 38"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-39.webp",
        "alt": "Oscar Fort gallery image 39"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-40.webp",
        "alt": "Oscar Fort gallery image 40"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-41.webp",
        "alt": "Oscar Fort gallery image 41"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-42.webp",
        "alt": "Oscar Fort gallery image 42"
      },
      {
        "src": "/projects/oscar-fort-indore/gallery-43.webp",
        "alt": "Oscar Fort gallery image 43"
      }
    ],
    "brochureUrl": "",
    "metaTitle": "Oscar Fort Indore - Ruchi Realty",
    "metaDescription": "Experience royal living at Oscar Fort, a premium gated residential development in Indore with limited-edition plots, green open spaces, modern amenities, and a lifestyle crafted for memorable everyday moments."
  },
  "lifescapes-bhopal": {
    heroTitle: "Ruchi Lifescapes",
    heroTagline: "Discover luxury living at Ruchi Lifescapes Bhopal, offering residential options from 1000 to 4000 sqft. and ample amenities.",
    heroLogo: "/projects/lifescapes-bhopal/logo.webp",
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
      { title: "__floor_plans__", desc: "[{\"title\":\"Master Layout\",\"desc\":\"/projects/lifescapes-bhopal/floor-master.webp\"},{\"title\":\"2.5 BHK\",\"desc\":\"/projects/lifescapes-bhopal/floor-2-5-bhk.webp\"},{\"title\":\"3 BHK\",\"desc\":\"/projects/lifescapes-bhopal/floor-3-bhk.webp\"},{\"title\":\"Orchid Row House\",\"desc\":\"/projects/lifescapes-bhopal/floor-orchid-row-house.webp\"},{\"title\":\"Orchid Row House 2\",\"desc\":\"/projects/lifescapes-bhopal/floor-orchid-row-house-2.webp\"},{\"title\":\"Tulip Twin Bungalow\",\"desc\":\"/projects/lifescapes-bhopal/floor-tulip-twin-bungalow.webp\"},{\"title\":\"Villa\",\"desc\":\"/projects/lifescapes-bhopal/floor-villa.webp\"}]" },
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
      { src: "/projects/lifescapes-bhopal/gallery-1.webp", alt: "Ruchi Lifescapes Bhopal gallery image 1" },
      { src: "/projects/lifescapes-bhopal/gallery-2.webp", alt: "Ruchi Lifescapes Bhopal gallery image 2" },
      { src: "/projects/lifescapes-bhopal/gallery-3.webp", alt: "Ruchi Lifescapes Bhopal gallery image 3" },
      { src: "/projects/lifescapes-bhopal/gallery-4.webp", alt: "Ruchi Lifescapes Bhopal gallery image 4" },
      { src: "/projects/lifescapes-bhopal/gallery-5.webp", alt: "Ruchi Lifescapes Bhopal gallery image 5" },
      { src: "/projects/lifescapes-bhopal/gallery-6.webp", alt: "Ruchi Lifescapes Bhopal gallery image 6" }
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

function mergeProjectSubpage(fallback, remote) {
  if (!fallback) return remote || null;
  if (!remote) return fallback;
  const preferArray = (remoteValue, fallbackValue) => Array.isArray(remoteValue) && remoteValue.length ? remoteValue : (fallbackValue || []);
  const preferText = (remoteValue, fallbackValue) => String(remoteValue || "").trim() ? remoteValue : (fallbackValue || "");
  return {
    ...fallback,
    ...remote,
    heroTitle: preferText(remote.heroTitle, fallback.heroTitle),
    heroTagline: preferText(remote.heroTagline, fallback.heroTagline),
    heroLogo: preferText(remote.heroLogo, fallback.heroLogo),
    heroBg: preferText(remote.heroBg, fallback.heroBg),
    heroMobileUrl: preferText(remote.heroMobileUrl, fallback.heroMobileUrl),
    overviewParagraphs: preferArray(remote.overviewParagraphs, fallback.overviewParagraphs),
    overviewHighlights: preferArray(remote.overviewHighlights, fallback.overviewHighlights),
    amenities: preferArray(remote.amenities, fallback.amenities),
    specifications: preferArray(remote.specifications, fallback.specifications),
    specificationImage: preferText(remote.specificationImage, fallback.specificationImage),
    floorPlans: preferArray(remote.floorPlans, fallback.floorPlans),
    locationImage: preferText(remote.locationImage, fallback.locationImage),
    locationMapEmbed: preferText(remote.locationMapEmbed, fallback.locationMapEmbed),
    locationDestinations: preferArray(remote.locationDestinations, fallback.locationDestinations),
    walkthroughVideoId: preferText(remote.walkthroughVideoId, fallback.walkthroughVideoId),
    videos: preferArray(remote.videos, fallback.videos),
    galleryImages: preferArray(remote.galleryImages, fallback.galleryImages),
    constructionUpdates: preferArray(remote.constructionUpdates, fallback.constructionUpdates),
    brochureUrl: preferText(remote.brochureUrl, fallback.brochureUrl),
    faqs: preferArray(remote.faqs, fallback.faqs),
    relatedProjectSlugs: preferArray(remote.relatedProjectSlugs, fallback.relatedProjectSlugs),
    ctaLabels: { ...(fallback.ctaLabels || {}), ...(remote.ctaLabels || {}) },
    ogImage: preferText(remote.ogImage, fallback.ogImage),
    metaTitle: preferText(remote.metaTitle, fallback.metaTitle),
    metaDescription: preferText(remote.metaDescription, fallback.metaDescription),
  };
}

function parseJson(value, fallback) {
  try {
    if (typeof value === "object" && value !== null) return value;
    const parsed = JSON.parse(value || "");
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function extractCustomSpecs(specifications = []) {
  const custom = { specifications: [], floorPlans: [], constructionUpdates: [], videoSection: null, heroMedia: null, heroMobileUrl: "", locationMapUrl: "" };
  specifications.forEach((item) => {
    if (item.title === "__floor_plans__") custom.floorPlans = parseJson(item.desc, []);
    else if (item.title === "__construction_updates__") custom.constructionUpdates = parseJson(item.desc, []);
    else if (item.title === "__video_section__") custom.videoSection = parseJson(item.desc, null);
    else if (item.title === "__hero_media__") custom.heroMedia = parseJson(item.desc, null);
    else if (item.title === "__hero_mobile_url__") custom.heroMobileUrl = item.desc || "";
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

function highlightIconSrc(icon, index) {
  const key = String(icon || DEFAULT_HIGHLIGHTS[index]?.icon || "").toLowerCase();
  if (ICONS[key]) return assetUrl(ICONS[key]);
  if (/^https?:\/\//.test(icon) || String(icon || "").includes("/")) return assetUrl(icon);
  return assetUrl(ICONS[DEFAULT_HIGHLIGHTS[index]?.icon] || ICONS.location);
}

function normalizeProjectSubpage(project, sp, fallbackSp = null) {
  const custom = extractCustomSpecs(sp?.specifications || []);
  const fallbackCustom = extractCustomSpecs(fallbackSp?.specifications || []);
  const title = sp?.heroTitle || project?.title || project?.name || "Project";
  const description = project?.description || "Explore this Ruchi Realty project with thoughtfully planned spaces, dependable execution, and a location selected for everyday convenience.";
  const videoSection = custom.videoSection || {};
  const legacyVideoUrl = (videoSection.videoUrl || "").trim() || (sp?.walkthroughVideoId || "").trim();
  const videoItems = Array.isArray(sp?.videos) && sp.videos.length ? sp.videos : legacyVideoUrl ? [{ ...videoSection, videoUrl: legacyVideoUrl }] : [];
  const fallbackVideoItems = Array.isArray(fallbackSp?.videos) && fallbackSp.videos.length ? fallbackSp.videos : [];
  const videos = videoItems
    .filter((item) => item?.videoUrl || item?.url)
    .map((item, index) => ({ title: item.title || `Project video ${index + 1}`, videoUrl: videoEmbedUrl(item.videoUrl || item.url), thumbnailUrl: assetUrl(item.thumbnailUrl || item.poster || ""), thumbnailFallbackUrl: assetUrl(fallbackVideoItems[index]?.thumbnailUrl || fallbackVideoItems[index]?.poster || "") }));
  const clean = (items, predicate) => (Array.isArray(items) ? items : []).filter(predicate);
  const normalizeImages = (items, fallbackItems = []) => clean(items, (img) => img?.src || img?.image)
    .map((img, index) => ({ ...img, src: assetUrl(img.src || img.image), fallbackSrc: assetUrl(fallbackItems[index]?.src || fallbackItems[index]?.image || "") }));
  const rawGalleryImages = normalizeImages(sp?.galleryImages || [], fallbackSp?.galleryImages || []);
  const isConstructionImage = (img) => /construction|progress|update/i.test(String(img?.category || ""));
  const galleryImages = rawGalleryImages.filter((img) => !isConstructionImage(img));
  const constructionUpdates = [...normalizeImages(sp?.constructionUpdates || [], fallbackSp?.constructionUpdates || []), ...normalizeImages(custom.constructionUpdates, fallbackCustom.constructionUpdates), ...rawGalleryImages.filter(isConstructionImage)]
    .filter((img, index, items) => items.findIndex((candidate) => candidate.src === img.src) === index);
  return {
    title,
    type: project?.type || "Residential",
    slug: project?.slug || "",
    location: project?.location || project?.city || "",
    tag: sp?.heroTagline || project?.tag || description,
    heroLogo: project?.slug === "ruchi-lifescapes-indore-project" ? "/projects/ruchi-lifescapes-indore-project/logo.webp" : assetUrl(sp?.heroLogo || ""),
    heroBg: assetUrl(sp?.heroBg || project?.image_url || project?.img || "assets/projects/oscar-billionaires.webp"),
    heroFallbackLogo: assetUrl(fallbackSp?.heroLogo || ""),
    heroFallbackBg: assetUrl(fallbackSp?.heroBg || project?.img || "assets/projects/oscar-billionaires.webp"),
    heroMobileUrl: assetUrl(custom.heroMobileUrl || sp?.heroMobileUrl || ""),
    heroImagePosition: sp?.heroImagePosition || "center center",
    heroImageFit: ["cover", "contain"].includes(sp?.heroImageFit) ? sp.heroImageFit : "cover",
    heroMedia: custom.heroMedia,
    status: project?.status || sp?.status || "",
    overviewParagraphs: clean(sp?.overviewParagraphs, (item) => typeof item === "string" && item.trim()),
    overviewHighlights: clean(sp?.overviewHighlights, (item) => item?.label || item?.desc).slice(0, 4),
    amenities: clean(sp?.amenities, (item) => item?.name),
    specifications: clean(custom.specifications, (item) => item?.title && (item?.desc || item?.details || item?.value)),
    specificationImage: assetUrl(sp?.specificationImage || ""),
    specificationFallbackImage: assetUrl(fallbackSp?.specificationImage || ""),
    floorPlans: (custom.floorPlans?.length ? custom.floorPlans : (sp?.floorPlans || [])).filter((plan) => plan?.desc || plan?.image).map((plan, index) => { const fallbackPlans = fallbackCustom.floorPlans?.length ? fallbackCustom.floorPlans : (fallbackSp?.floorPlans || []); return { ...plan, desc: assetUrl(plan.desc || plan.image), fallbackDesc: assetUrl(fallbackPlans[index]?.desc || fallbackPlans[index]?.image || "") }; }),
    videos,
    videoSection: videos[0] || { title: "", videoUrl: "", thumbnailUrl: "" },
    locationImage: assetUrl(sp?.locationImage || custom.locationMapUrl || ""),
    locationFallbackImage: assetUrl(fallbackSp?.locationImage || fallbackCustom.locationMapUrl || ""),
    locationMapEmbed: embedSrc(sp?.locationMapEmbed || ""),
    locationDestinations: Array.isArray(sp?.locationDestinations) ? sp.locationDestinations : [],
    galleryImages,
    constructionUpdates,
    brochureUrl: assetUrl(sp?.brochureUrl || ""),
    faqs: clean(sp?.faqs, (item) => item?.question && item?.answer),
    relatedProjectSlugs: clean(sp?.relatedProjectSlugs, (item) => typeof item === "string" && item.trim()),
    ctaLabels: { brochure: sp?.ctaLabels?.brochure || "Download Brochure", visit: sp?.ctaLabels?.visit || "Book a Visit" },
    ogImage: assetUrl(sp?.ogImage || sp?.heroBg || project?.image_url || ""),
    metaTitle: sp?.metaTitle || `${title} | Ruchi Realty`,
    metaDescription: sp?.metaDescription || description,
  };
}

function CtaArrow() {
  return <CardArrow />;
}

function HeroEnquiryForm({ title, onSubmit }) {
  const [form, setForm] = useState({ name: String(), phone: String(), email: String() });
  const field = (key) => (e) => setForm({ ...form, [key]: e.target.value });
  return <form className={`victoria-hero-form`} onSubmit={(e) => { e.preventDefault(); onSubmit(form); }}>
    <div className="victoria-hero-form__head"><span className="victoria-hero-form__mark" aria-hidden="true"></span><span className={`eyebrow`}>Private Enquiry</span></div>
    <h2>Discover life<br />at {title}</h2>
    <p>Receive current pricing, plans and availability directly from our project team.</p>
    <div className="victoria-hero-form__fields">
      <label className="is-wide"><span>Full name</span><input value={form.name} onChange={field(`name`)} placeholder={`Enter your name`} autoComplete="name" required /></label>
      <label><span>Phone number</span><input type="tel" value={form.phone} onChange={field(`phone`)} placeholder={`+91 00000 00000`} autoComplete="tel" required /></label>
      <label><span>Email address</span><input type={`email`} value={form.email} onChange={field(`email`)} placeholder={`name@email.com`} autoComplete="email" /></label>
    </div>
    <button className={`submit-btn`} type={`submit`}>Request Project Details<CtaArrow /></button>
    <small className="victoria-hero-form__privacy">Your information remains private and is only used to respond to this enquiry.</small>
  </form>;
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

function SectionNav({ data, visible = false }) {
  const [active, setActive] = useState("overview");
  const sections = useMemo(() => {
    return [
      ["overview", "Overview", data.overviewParagraphs?.length],

      ["specifications", "Specifications", data.specifications?.length],
      ["amenities", "Amenities", data.amenities?.length],
      ["walkthrough", "Walkthrough", data.videos?.length],
      ["gallery", "Gallery", data.galleryImages?.length],
      ["construction-updates", "Construction", data.constructionUpdates?.length],
      ["floor-plans", "Floor Plans", data.floorPlans?.length],
      ["location", "Location", data.locationMapEmbed || data.locationImage || data.locationDestinations?.length],
      ["faq", "FAQ", data.faqs?.length],

    ].filter(([, , show]) => Boolean(show)).map(([id, label]) => ({ id, label }));
  }, [data]);

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
      const navHeight = document.querySelector(".osc-sticky-nav")?.offsetHeight || 0;
      window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - navHeight - 8, behavior: "smooth" });
    }
  };

  return (
    <nav className={`osc-sticky-nav osc-sticky-nav--project-header${visible ? " is-visible" : ""}`} aria-label="Project sections" aria-hidden={!visible}>
      <div className="rr-wrap"><div className="osc-sticky-nav__inner">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            tabIndex={visible ? 0 : -1}
            className={`osc-sticky-nav__btn ${active === id ? "is-active" : ""}`}
            onClick={() => scrollTo(id)}
          >
            {label}
          </button>
        ))}
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
          <h2 className="osc-section__title" style={{ marginBottom: "16px" }}>{title}<br /><span className="rr-grad">Download the brochure</span></h2>
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
  return <section className="section-pad osc-section" id="floor-plans"><div className="rr-wrap"><Reveal><div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: 16 }}>Floor Plans</div><h2 className="osc-section__title">Floor plans<br /><span className="rr-grad">for planned living</span></h2></Reveal><div style={{ marginTop: 36 }}><Reveal style={{ display: "flex", gap: 12, marginBottom: 28, flexWrap: "wrap" }}>{plans.map((p, idx) => <button key={p.title || idx} type="button" className={`submit-btn ${active === idx ? "" : "ab-btn-outline"}`} style={{ padding: "10px 20px", background: active === idx ? "var(--rr-indigo)" : "transparent", color: active === idx ? "#fff" : "var(--rr-ink)", border: "1px solid var(--rr-indigo)" }} onClick={() => setActive(idx)}>{p.title || `Plan ${idx + 1}`}{p.config ? ` - ${p.config}` : ""}</button>)}</Reveal><Reveal key={active} style={{ background: "rgba(20,18,26,0.03)", padding: "clamp(16px,4vw,32px)", border: "1px solid rgba(20,18,26,0.08)", borderRadius: 8, display: "grid", placeItems: "center" }}><img src={plan.desc} alt={plan.title || `${title} floor plan`} onError={(event) => { if (plan.fallbackDesc && event.currentTarget.src !== new URL(plan.fallbackDesc, window.location.origin).href) event.currentTarget.src = plan.fallbackDesc; else event.currentTarget.hidden = true; }} style={{ maxWidth: "100%", maxHeight: 560, objectFit: "contain", borderRadius: 4 }} /></Reveal></div></div></section>;
}

function WalkthroughSection({ video }) {
  if (!video?.videoUrl) return null;
  return <section className="section-pad osc-section osc-section--dark" id="walkthrough"><div className="rr-wrap"><Reveal><div className="sec-head sec-head--dark" style={{ marginBottom: 40 }}><div><div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Walkthrough</div><h2>{video.title || "Construction Walkthrough"}<br /><span className="rr-grad">project video</span></h2></div></div></Reveal><Reveal><div className="osc-modern-video-frame" style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#111", borderRadius: 8, overflow: "hidden", boxShadow: "0 24px 70px rgba(0,0,0,.28)" }}><iframe title={video.title || "Project walkthrough"} src={video.videoUrl} width="100%" height="100%" style={{ border: 0, position: "absolute", inset: 0 }} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen loading="lazy" /></div></Reveal></div></section>;
}

function ProjectOverview({ data }) {
  const paragraphs = (data.overviewParagraphs || []).filter(Boolean);
  if (!paragraphs.length) return null;
  const substantiveCopy = paragraphs.filter((text) => text.trim().length > 80);
  const overviewCopy = (substantiveCopy.length ? substantiveCopy : paragraphs).slice(0, 2);
  const fallbackFacts = [{ label: "Project Type", desc: data.type }, { label: "Location", desc: data.location }, { label: "Status", desc: data.status }];
  const facts = [...(data.overviewHighlights || []), ...fallbackFacts]
    .filter((item, index, items) => item?.desc && items.findIndex((candidate) => candidate?.label === item.label) === index)
    .slice(0, 4);
  return (
    <section className="section-pad project-section" id="overview"><div className="rr-wrap">
      <div className="project-section__head project-section__head--overview"><span className="eyebrow">Project Overview</span><h2>Designed with purpose,<br/><span className="rr-grad">made for everyday life</span></h2></div>
      <div className="project-overview__layout">
        <div className="project-overview__copy">{overviewCopy.map((text,index)=><p key={index}>{text}</p>)}</div>
        {facts.length ? <aside className="project-overview__facts" aria-label={`${data.title} overview details`}>
          <div className="project-overview__facts-head"><span>Project Details</span></div>
          <div className="project-overview__facts-list">{facts.map((fact, index) => <div className="project-overview__fact" key={`${fact.label}-${index}`}><span>{String(index + 1).padStart(2, "0")}</span><div><small>{fact.label}</small><strong>{fact.desc}</strong></div></div>)}</div>
        </aside> : null}
      </div>
    </div></section>
  );
}

function specificationParts(value) {
  return String(value||"").split(/\n+|\s*[•;]\s*/).map(part=>part.trim()).filter(Boolean);
}

function ProjectSpecifications({ data }) {
  const specs=(data.specifications||[]).filter(item=>item?.title&&(item?.desc||item?.details));
  if (!specs.length) return null;
  const content=<div className="project-spec-grid">{specs.map((spec,index)=>{const parts=specificationParts(spec.desc||spec.details||spec.value);return <article className="project-spec-card" key={`${spec.title}-${index}`}><span>{String(index+1).padStart(2,"0")}</span><h3>{spec.title}</h3><div className="project-spec-points">{parts.map((part,partIndex)=>{const colon=part.indexOf(":");return colon>0?<p key={partIndex}><strong>{part.slice(0,colon)}</strong><em>{part.slice(colon+1).trim()}</em></p>:<p key={partIndex}><em>{part}</em></p>})}</div></article>})}</div>;
  return <section className="section-pad project-section project-specifications" id="specifications"><div className="rr-wrap"><div className="project-section__head"><span className="eyebrow">Specifications</span><h2>Materials and details,<br/><span className="rr-grad">presented clearly</span></h2></div>{data.specificationImage?<div className="project-spec-layout"><RImg className="project-spec-layout__image" src={data.specificationImage} fallbackSrc={data.specificationFallbackImage} alt={`${data.title} specifications`}/>{content}</div>:content}</div></section>;
}

function ProjectAmenities({ amenities }) {
  const valid=(amenities||[]).filter(item=>item?.name);
  if (!valid.length) return null;
  return <section className="section-pad project-section project-amenities" id="amenities"><div className="rr-wrap"><div className="project-section__head"><span className="eyebrow">Amenities</span><h2>Spaces that support<br/><span className="rr-grad">better everyday living</span></h2></div><div className="project-amenities-grid">{valid.map((item,index)=><article className="project-amenity-card" key={`${item.name}-${index}`}><div className="project-amenity-card__icon"><AmenityIcon icon={item.icon} name={item.name}/></div><h3>{item.name}</h3></article>)}</div></div></section>;
}
function ProjectLocation({ data }) {
  const destinations=(data.locationDestinations||[]).filter(item=>item?.name);
  if (!data.locationImage&&!data.locationMapEmbed&&!destinations.length) return null;
  return <section className="section-pad project-section project-location" id="location"><div className="rr-wrap"><div className="project-section__head"><span className="eyebrow">Location &amp; Connectivity</span><h2>A connected address,<br/><span className="rr-grad">close to what matters</span></h2></div><div className="project-location__grid">{data.locationImage?<RImg className="project-location__image" src={data.locationImage} fallbackSrc={data.locationFallbackImage} alt={`${data.title} location map`} mono/>:null}<div className="project-location__content">{destinations.length?<div className="project-location__list">{destinations.map((item,index)=><div key={`${item.name}-${index}`}><span>{item.name}</span><strong>{item.dist||item.distance||"Nearby"}</strong></div>)}</div>:null}{data.locationMapEmbed?<iframe title={`${data.title} map`} src={data.locationMapEmbed} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/>:null}</div></div></div></section>;
}

function ProjectWalkthrough({ data }) {
  const videos=data.videos||[];
  if (!videos.length) return null;
  return <section className="section-pad project-section project-walkthrough" id="walkthrough"><div className="rr-wrap"><div className="project-section__head"><span className="eyebrow">{videos.length>1?"Project Videos":"Walkthrough Video"}</span><h2>Explore the project<br/><span className="rr-grad">from wherever you are</span></h2></div><div className={`project-video-grid ${videos.length===1?"is-single":""}`}>{videos.map((video,index)=><article className="project-video-card" key={`${video.videoUrl}-${index}`}>{videos.length>1?<h3>{video.title}</h3>:null}<div className="project-walkthrough__frame">{video.thumbnailUrl?<RImg src={video.thumbnailUrl} fallbackSrc={video.thumbnailFallbackUrl} alt=""/>:null}<iframe title={video.title||`${data.title} walkthrough ${index+1}`} src={video.videoUrl} loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen/></div></article>)}</div></div></section>;
}

function ProjectFaq({ data }) {
  if (!data.faqs?.length) return null;
  return <section className="section-pad project-section project-faq" id="faq"><div className="rr-wrap"><div className="project-section__head"><span className="eyebrow">Frequently Asked Questions</span><h2>Helpful project<br/><span className="rr-grad">information</span></h2></div><div className="project-faq__list">{data.faqs.map((item,index)=><details key={`${item.question}-${index}`}><summary>{item.question}<span aria-hidden="true">+</span></summary><div><p>{item.answer}</p></div></details>)}</div></div></section>;
}
function ProjectGallery({ data, construction = false }) {
  const images=((construction ? data.constructionUpdates : data.galleryImages) || []).filter(image=>image?.src);
  const [galleryStart,setGalleryStart]=useState(0);
  const [lightboxIndex,setLightboxIndex]=useState(null);
  if (!images.length) return null;
  const sectionId = construction ? "construction-updates" : "gallery";
  const sectionLabel = construction ? "Construction Updates" : "Project Gallery";
  const title = construction ? "See the latest progress" : "A closer look";
  const accent = construction ? "as the project takes shape." : "at the project.";
  const imageLabel = construction ? "construction update" : "gallery image";
  const useThreeBoxGallery=images.length>0;
  const visibleIndexes=useThreeBoxGallery?Array.from({length:Math.min(3,images.length)},(_,index)=>(galleryStart+index)%images.length):images.map((_,index)=>index);
  const moveGallery=(direction)=>setGalleryStart(index=>(index+direction+images.length)%images.length);
  const moveLightbox=(direction)=>setLightboxIndex(index=>(index+direction+images.length)%images.length);
  return <section className={`section-pad project-section project-gallery${construction ? " project-construction" : ""}`} id={sectionId}><div className="rr-wrap"><div className="project-section__head"><span className="eyebrow">{sectionLabel}</span><h2>{title}<br/><span className="rr-grad">{accent}</span></h2></div>{visibleIndexes.length?<><div className={useThreeBoxGallery?"project-gallery-trio":"project-gallery-grid"}>{visibleIndexes.map((imageIndex,position)=>{const image=images[imageIndex];return useThreeBoxGallery?<button type="button" onClick={()=>setLightboxIndex(imageIndex)} aria-label={`Open ${image.alt||`${data.title} ${imageLabel} ${imageIndex+1}`}`} key={`${image.src}-${imageIndex}`}><RImg src={image.src} fallbackSrc={image.fallbackSrc} alt={image.alt||`${data.title} ${imageLabel} ${imageIndex+1}`}/></button>:<a href={image.src} target="_blank" rel="noreferrer" className={position===0?"is-featured":""} key={`${image.src}-${imageIndex}`}><RImg src={image.src} fallbackSrc={image.fallbackSrc} alt={image.alt||`${data.title} ${imageLabel} ${imageIndex+1}`}/></a>})}</div>{useThreeBoxGallery&&images.length>3?<div className="project-gallery-trio__controls"><span>{String(galleryStart+1).padStart(2,"0")} / {String(images.length).padStart(2,"0")}</span><button type="button" onClick={()=>moveGallery(-1)} aria-label={`Previous ${sectionLabel.toLowerCase()} images`}>&#8592;</button><button type="button" onClick={()=>moveGallery(1)} aria-label={`Next ${sectionLabel.toLowerCase()} images`}>&#8594;</button></div>:null}</>:null}</div>{lightboxIndex!==null?<div className="project-gallery-lightbox" role="dialog" aria-modal="true" aria-label={`${data.title} ${sectionLabel.toLowerCase()} preview`} onClick={()=>setLightboxIndex(null)}><button className="project-gallery-lightbox__close" type="button" onClick={()=>setLightboxIndex(null)} aria-label="Close image preview">&#215;</button>{images.length>1?<button className="project-gallery-lightbox__arrow is-prev" type="button" onClick={event=>{event.stopPropagation();moveLightbox(-1)}} aria-label="Previous image">&#8592;</button>:null}<div className="project-gallery-lightbox__image" onClick={event=>event.stopPropagation()}><RImg src={images[lightboxIndex].src} fallbackSrc={images[lightboxIndex].fallbackSrc} alt={images[lightboxIndex].alt||`${data.title} ${imageLabel} ${lightboxIndex+1}`}/><span>{String(lightboxIndex+1).padStart(2,"0")} / {String(images.length).padStart(2,"0")}</span></div>{images.length>1?<button className="project-gallery-lightbox__arrow is-next" type="button" onClick={event=>{event.stopPropagation();moveLightbox(1)}} aria-label="Next image">&#8594;</button>:null}</div>:null}</section>;
}
function RelatedProjects({ slug, preferredSlugs=[] }) {
  const available=PROJECTS.filter(project=>project.url&&project.url!==`/projects/${slug}`&&!project.url.endsWith(`/${slug}`));
  const preferred=preferredSlugs.map(item=>available.find(project=>project.url.endsWith(`/${item}`))).filter(Boolean);
  const items=[...preferred,...available.filter(item=>!preferred.includes(item))].slice(0,3);
  if (!items.length) return null;
  return <section className="section-pad project-section project-related" id="more-projects"><div className="rr-wrap"><div className="project-section__head"><span className="eyebrow">More Projects</span><h2>Continue exploring<br/><span className="rr-grad">Ruchi Realty</span></h2></div><div className="pgrid">{items.map((item,index)=><ProjectTile p={item} i={index} n={index} key={`${item.name}-${item.url}`}/>)}</div></div></section>;
}

function ProjectEnquiryCTA({ data, onEnquire }) {
  return <section className="section-pad project-final-cta" id="enquire"><div className="rr-wrap project-final-cta__inner"><span className="eyebrow">Take a Closer Look</span><h2>Discover {data.title}<br/><span>in complete detail</span></h2><p>{data.brochureUrl?"Download the project brochure for plans, amenities, specifications and location highlights—all in one place.":"Share your details and our project team will help with plans, availability and a site visit."}</p><button className="submit-btn" type="button" onClick={onEnquire}>{data.brochureUrl?data.ctaLabels.brochure:data.ctaLabels.visit}<CtaArrow/></button></div></section>;
}
export default function GenericProjectPage({ slugOverride = "" }) {
  const params = useParams();
  const slug = slugOverride || params.slug;
  const fallback = FALLBACK_SUBPAGES[slug] || null;
  const fallbackListing = PROJECTS.find((item) => item.url?.endsWith(`/${slug}`));
  const fallbackMeta = PROJECT_LEGACY_META[slug] || {};
  const fallbackProject = fallback ? {
    slug,
    title: fallback.heroTitle || fallbackListing?.name,
    name: fallback.heroTitle || fallbackListing?.name,
    city: fallbackMeta.city || fallbackListing?.city || "",
    location: fallbackMeta.city || fallbackListing?.city || "",
    type: fallbackMeta.type || fallbackListing?.type || "Residential",
  } : null;
  const [project, setProject] = useState(fallbackProject);
  const [subpage, setSubpage] = useState(fallback);
  const [loaded, setLoaded] = useState(Boolean(fallback));
  const [brochurePopup, setBrochurePopup] = useState(false);
  const [heroPassed, setHeroPassed] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      setLoaded(false);
      try {
        const fallback = FALLBACK_SUBPAGES[slug] || null;
        const meta = PROJECT_LEGACY_META[slug] || {};
        const { data: found } = await window.RuchiBackend.projects.getProjectBySlug(slug);
        if (!active) return;
        setProject(found || (fallback ? { slug, title: fallback.heroTitle, name: fallback.heroTitle, city: meta.city || "", location: meta.city || "", type: meta.type || "Residential" } : null));
        if (found?.id) {
          const { data: sp } = await window.RuchiBackend.projectSubpages.getByProjectId(found.id);
          if (active) setSubpage(mergeProjectSubpage(fallback, sp));
        } else if (active) {
          setSubpage(fallback);
        }
      } catch (err) {
        console.error("Error loading project subpage:", err);
        const fallback = FALLBACK_SUBPAGES[slug] || null;
        const meta = PROJECT_LEGACY_META[slug] || {};
        if (active) {
          setProject(fallback ? { slug, title: fallback.heroTitle, name: fallback.heroTitle, city: meta.city || "", location: meta.city || "", type: meta.type || "Residential" } : null);
          setSubpage(fallback);
        }
      } finally {
        if (active) setLoaded(true);
      }
    }
    load();
    return () => { active = false; };
  }, [slug]);

  const data = useMemo(() => normalizeProjectSubpage(project, subpage, fallback), [project, subpage, fallback]);
  const onBrochure = () => setBrochurePopup(true);
  const useSplitHero = true;
  const submitHeroLead = async (form) => {
    const result = await window.RuchiBackend.leads.submitLead({ ...form, interest: data.title, source: `${data.title} hero enquiry`, project_slug: data.slug, message: `Hero enquiry` });
    if (result?.error) window.alert(`Could not submit your enquiry. Please try again.`);
    else window.alert(`Thank you. Our team will connect with you shortly.`);
  };

  useEffect(() => {
    const onScroll = () => {
      const hero = document.querySelector(".osc-hero");
      const heroHasPassed = hero ? hero.getBoundingClientRect().bottom <= 1 : false;
      setHeroPassed(heroHasPassed);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [loaded]);

  useEffect(() => {
    document.title = data.metaTitle;
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "description";
      document.head.appendChild(meta);
    }
    meta.content = data.metaDescription;
    const setOg = (property, content) => {
      if (!content) return;
      let element = document.querySelector(`meta[property="${property}"]`);
      if (!element) { element = document.createElement("meta"); element.setAttribute("property", property); document.head.appendChild(element); }
      element.content = content;
    };
    setOg("og:title", data.metaTitle);
    setOg("og:description", data.metaDescription);
    setOg("og:image", data.ogImage);
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}/projects/${slug}`;
  }, [data.metaTitle, data.metaDescription, data.ogImage, slug]);

  if (!loaded) {
    return <><Nav onContact={onBrochure} /><main className="section-pad rr-light"><div className="rr-wrap" style={{ paddingTop: 120 }}><p className="eyebrow" style={{ color: "var(--rr-indigo)" }}>Project</p><h1 className="osc-section__title">Loading project</h1></div></main><Footer /></>;
  }

  if (!project) {
    return <><Nav onContact={onBrochure} /><main className="section-pad rr-light"><div className="rr-wrap" style={{ paddingTop: 120 }}><p className="eyebrow" style={{ color: "var(--rr-indigo)" }}>Project</p><h1 className="osc-section__title">Project not found</h1><Link className="submit-btn" to="/projects">View all projects<CtaArrow /></Link></div></main><Footer /></>;
  }

  return (
    <>
      <Nav onContact={onBrochure} hidden={brochurePopup || heroPassed} solid={useSplitHero} />
      <main>
        <header className={`osc-hero ${useSplitHero ? `victoria-hero project-hero--${data.slug}` : String()}`} data-screen-label={data.title}>
          <div className={`osc-hero__bg project-hero-media project-hero-media--${data.heroImageFit}`} style={{ "--project-hero-position": data.heroImagePosition }}><picture>{data.heroMobileUrl ? <source media="(max-width: 720px)" srcSet={data.heroMobileUrl} /> : null}<img src={data.heroBg} alt={`${data.title} project view`} fetchPriority="high" onError={(event) => { const fallbackSrc = data.heroFallbackBg; if (fallbackSrc && event.currentTarget.src !== new URL(fallbackSrc, window.location.origin).href) { event.currentTarget.parentElement?.querySelectorAll("source").forEach((source) => source.removeAttribute("srcset")); event.currentTarget.src = fallbackSrc; } }} /></picture>{data.heroMedia?.type === "youtube_video" && data.heroMedia.url ? <iframe className="osc-hero__video" src={data.heroMedia.url} title={`${data.title} hero video`} allow="autoplay; encrypted-media" tabIndex="-1" aria-hidden="true" /> : null}</div>
          <div className="osc-hero__overlay"></div>
          <div className="osc-hero__sig" aria-hidden="true"></div>
          {useSplitHero ? <div className={`rr-wrap victoria-hero__form-wrap`}><HeroEnquiryForm title={data.title} onSubmit={submitHeroLead} /></div> : <div className="rr-wrap osc-hero__wrap">
            <Reveal><div className="osc-hero__content">
              {data.heroLogo ? <img src={data.heroLogo} alt={`${data.title} logo`} onError={(event) => { if (data.heroFallbackLogo && event.currentTarget.src !== new URL(data.heroFallbackLogo, window.location.origin).href) event.currentTarget.src = data.heroFallbackLogo; else event.currentTarget.hidden = true; }} style={{ maxWidth: "min(260px,70vw)", maxHeight: 90, objectFit: "contain", marginBottom: 18 }} /> : null}
              <h1 className="osc-hero__title">{data.title}</h1>
              {data.location ? <p className="osc-hero__city">{data.location}</p> : null}
              <p className="osc-hero__tagline">{data.tag}</p>
              <div className="osc-hero__actions"><Link className="submit-btn" to="/projects">More Projects<CtaArrow /></Link><button className="ab-btn-outline ab-btn-outline--white" type="button" onClick={onBrochure}>Download Brochure<CtaArrow /></button></div>
            </div></Reveal>
          </div>}
        </header>

        <SectionNav data={data} visible={heroPassed && !brochurePopup} />

        {useSplitHero ? <section className={`victoria-intro`} id={`project-details`}><div className={`rr-wrap victoria-intro__top`}><div className={`victoria-intro__identity`}>{data.heroLogo ? <img src={data.heroLogo} alt={`${data.title} logo`} onError={(event)=>{if (data.heroFallbackLogo && event.currentTarget.src !== new URL(data.heroFallbackLogo, window.location.origin).href) event.currentTarget.src = data.heroFallbackLogo; else event.currentTarget.hidden=true;}} /> : null}<div><span className={`eyebrow`}>{data.type}</span><h1>{data.title}</h1>{data.location?<p>{data.location}</p>:null}<strong>{data.tag}</strong></div></div><div className={`victoria-intro__actions`}><Link className={`ab-btn-outline ab-btn-outline--white`} to={`/projects`}>More Projects<CtaArrow /></Link><button className={`submit-btn victoria-intro__brochure`} type={`button`} onClick={onBrochure}>{data.brochureUrl?data.ctaLabels.brochure:data.ctaLabels.visit}<CtaArrow /></button></div></div>{data.overviewHighlights.length?<div className={`rr-wrap victoria-intro__facts`}>{data.overviewHighlights.map((h, i) => <div className={`victoria-fact`} key={h.label || i}><span>{String(i + 1).padStart(2, `0`)}</span><div><small>{h.label}</small><strong>{h.desc}</strong></div></div>)}</div>:null}</section> : null}

        <ProjectOverview data={data} />

        <ProjectSpecifications data={data} />
        <ProjectAmenities amenities={data.amenities} />
        <ProjectWalkthrough data={data} />
        <ProjectGallery data={data} />
        <ProjectGallery data={data} construction />
        <FloorPlansSection plans={data.floorPlans} title={data.title} />
        <ProjectLocation data={data} />
        <ProjectEnquiryCTA data={data} onEnquire={onBrochure} />
        <ProjectFaq data={data} />
        <RelatedProjects slug={data.slug} preferredSlugs={data.relatedProjectSlugs} />
      </main>
      <Footer />
      {brochurePopup ? <BrochurePopup data={data} onClose={() => setBrochurePopup(false)} /> : null}
    </>
  );
}
