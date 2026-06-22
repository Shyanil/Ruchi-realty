/* ============================================================
   Ruchi Realty — Data layer (v2)
   Real lists + finished copy + curated stock photography.
   ============================================================ */

window.__rsrc = function (id, path) {
  return (window.__resources && window.__resources[id]) || path;
};

// Unsplash helper — each image is registered so the standalone bundler can inline it.
// When not bundled, window.__rsrc falls back to the live remote URL (live site unchanged).
let __uxN = 0;
const ux = (id, w = 1200) => {
  const u = `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
  return window.__rsrc("img" + (__uxN++), u);
};

// Ruchi Realty project imagery — actual project renders from ruchirealty.com.
// Registered through __rsrc (same as ux) so the standalone bundler can inline
// them; falls back to the live remote URL when not bundled. RImg degrades to a
// brand-gradient block if any asset fails to load.
let __rrN = 0;
const rr = (url) => window.__rsrc("rr" + (__rrN++), url);

// curated pools ------------------------------------------------
const IMG_TOWER = [
  ux("1545324418-cc1a3fa10c00"), // residential tower
  ux("1486406146926-c627a92ad1ab"), // glass facade
  ux("1512917774080-9991f1c4c750"), // white modern house
  ux("1480714378408-67cf0d13bc1b"), // city residential
  ux("1494526585095-c41746248156"), // modern home dusk
  ux("1460317442991-0ec209397118"), // contemporary house
  ux("1502005229762-cf1b2da7c5d6"), // apartment block
  ux("1564013799919-ab600027ffc6"), // modern villa
  ux("1497366216548-37526070297c"), // commercial interior
  ux("1496307653780-42ee777d4833"), // geometric building
  ux("1449844908441-8829872d2607"), // house exterior
  ux("1518005020951-eccb494ad742"), // tower from below
];
const IMG_LIVING = [
  ux("1493809842364-78817add7ffb"), // living room
  ux("1586023492125-27b2c045efd7"), // bright interior
  ux("1502672260266-1c1ef2d93688"), // cozy interior
];
const IMG_PEOPLE = [
  ux("1609220136736-443140cffec6"), // indian family
  ux("1611095973763-414019e72400"), // family home
  ux("1543269865-cbf427effbad"), // people together
  ux("1556157382-97eda2d62296"), // portrait
  ux("1573497019940-1c28c88b4f3e"), // woman portrait
];

// Real Ruchi Realty inventory. Status reconciled across the ready-to-move,
// ongoing and upcoming source pages; each project kept once, under its primary
// status, so the city tabs (homepage) and the city + status filters (All
// Projects page) all read true. Most addresses are Ready to Move, with a
// handful Ongoing and a few Upcoming.
const PROJECTS = [
  // --- Ongoing flagship + Ready to Move marquee (lead the default "All" view) ---
  { name: "One Victoria",         city: "New Town · Kolkata",     type: "Residential", status: "Ongoing",       img: rr("https://ruchirealty.com/wp-content/uploads/2024/01/victoria_kolkata.webp") },
  { name: "Oscar Billionaires",   city: "Indore",                 type: "Township",    status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/12/oscar_menu_new.webp") },
  { name: "Active Acres",         city: "Kolkata",                type: "Residential", status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/08/active_acres_p1.webp") },

  // --- Ready to Move · Kolkata ---
  { name: "One Rajarhat",         city: "Rajarhat · Kolkata",     type: "Residential", status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/12/one_rajarhut_updated.webp") },
  { name: "One Prime",            city: "New Town · Kolkata",     type: "Residential", status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/12/one_prime_business_menu_new.webp") },
  { name: "Active Business Park", city: "Kolkata",                type: "Commercial",  status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/08/Active_business_park_new.webp") },
  { name: "Active Green",         city: "Kolkata",                type: "Residential", status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/08/active_green_new.webp") },

  // --- Ready to Move · Indore ---
  { name: "Oscar Pride",          city: "Indore",                 type: "Township",    status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/08/oscar_pride_gate.webp") },
  { name: "Saatvik Vihar",        city: "Indore",                 type: "Township",    status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/08/saatvik_vihar_updated.webp") },
  { name: "Ruchi Lifescapes",     city: "Indore",                 type: "Township",    status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/12/ruchi_indoree.webp") },
  { name: "Saatvik Green",        city: "Indore",                 type: "Township",    status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/elementor/thumbs/saatvik_green1_slider-rkz8evvmdrbwhpudocva6oc5corg0v57ynrbextxmw.webp") },
  { name: "Anand Vihar",          city: "Indore",                 type: "Township",    status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/08/aannd_vihar_new.webp") },

  // --- Ready to Move · Bhopal ---
  { name: "Ruchi Lifescapes",     city: "Bhopal",                 type: "Residential", status: "Ready to Move", img: rr("https://ruchirealty.com/wp-content/uploads/2023/08/ruchi_Bhopal.webp") },

  // --- Ongoing ---
  { name: "Angelica",             city: "Active Acres · Kolkata", type: "Residential", status: "Ongoing",       img: rr("https://ruchirealty.com/wp-content/uploads/2023/08/active_acres_p1.webp") },
  { name: "Oscar Fort",           city: "Indore",                 type: "Township",    status: "Ongoing",       img: rr("https://ruchirealty.com/wp-content/uploads/2024/09/oscar_fort_menu.webp") },
  { name: "Oscar Sanctuary",      city: "Indore",                 type: "Township",    status: "Ongoing",       img: rr("https://ruchirealty.com/wp-content/uploads/2026/03/os-1.webp") },

  // --- Upcoming ---
  { name: "Oscar Palace",         city: "Indore",                 type: "Township",    status: "Upcoming",      img: rr("https://ruchirealty.com/wp-content/uploads/2026/03/Palace.webp") },
  { name: "Ruchi Enclave",        city: "Indore",                 type: "Township",    status: "Upcoming",      img: rr("https://ruchirealty.com/wp-content/uploads/elementor/thumbs/ruchi_enclave_slider-rkz7cpnktz2oztaikuupxb48vcwtfdlndpzfsefibs.webp") },
  { name: "Ruchi Hills",          city: "Indore",                 type: "Residential", status: "Upcoming",      img: rr("https://ruchirealty.com/wp-content/uploads/2023/08/new_project_new.webp") },
];

const PROJECT_OPTIONS = [
  "One Victoria — New Town, Kolkata",
  "One Rajarhat — Kolkata",
  "Active Acres — Kolkata",
  "One Prime — New Town, Kolkata",
  "Oscar Billionaires — Indore",
  "Oscar Pride — Indore",
  "Oscar Fort — Indore",
  "Ruchi Lifescapes — Bhopal",
  "Another project / Not sure yet",
];

const STATS = [
  { num: 38,  suffix: "",  label: "Years building in eastern and central India." },
  { num: 12,  suffix: "k", label: "Homes handed over to the families who waited for them." },
  { num: 40,  suffix: "+", label: "Residential, commercial, and township addresses delivered." },
  { num: 100, suffix: "%", label: "Of our projects are RERA-registered before a single visit is offered." },
];

const TRUST = [
  { icon: "shield-check", no: "01", title: "RERA-registered, every project",
    body: "Each address carries its own RERA number, registered before we invite you to a single site visit. The paperwork is open from the first conversation." },
  { icon: "ruler", no: "02", title: "Built to the specification you were shown",
    body: "The materials, the fittings, the finishes — written down, and met. What you are shown is what you are handed the keys to." },
  { icon: "handshake", no: "03", title: "We stay after the keys change hands",
    body: "The relationship does not end at possession. Service, support, and the same people you began with remain reachable." },
];

const QUOTES = [
  { text: "What they showed us in the model home is what we live in today. Nothing was quietly swapped, nothing was oversold.",
    name: "Sandip & Rituparna Ghosh", project: "Active Acres, Kolkata" },
  { text: "When a question came up two years after handover, the same person who sold us the home picked up the call. That is rare.",
    name: "Dr. Meera Iyer", project: "Oscar Billionaires, Indore" },
  { text: "Nothing was oversold. What they showed us in the specification is exactly what we live in now.",
    name: "Arvind Khandelwal", project: "Ruchi Lifescapes, Bhopal" },
];

const AWARDS = [
  { name: "Mega Property Expo Award", year: "2025" },
  { name: "Mega Property Expo Award", year: "2024" },
  { name: "Ultra-High Luxury Developer of the Year", year: "" },
  { name: "Luxury Project of the Year", year: "" },
  { name: "Golden Brick Award", year: "" },
  { name: "Company of the Year", year: "" },
  { name: "Times Property Show Award", year: "" },
  { name: "Property Show Award · CREDAI", year: "" },
  { name: "Property Fair Awards · HDFC", year: "" },
  { name: "Malwa Vyapar Awards", year: "" },
  { name: "Vishisht Atithi Awards", year: "" },
  { name: "Real Estate Fair Award", year: "" },
  { name: "Most Prestigious Property Exhibition", year: "" },
  { name: "Property Auto Expo Award", year: "" },
  { name: "Property & Auto Fair Awards", year: "" },
];

const PRESS = [
  { date: "Jul 2024", head: "A tree-plantation drive takes root at Saatvik Green, Indore.", img: IMG_TOWER[5] },
  { date: "Jun 2024", head: "One Victoria, our New Town, Kolkata residence, is unveiled at Novotel.", img: IMG_TOWER[0] },
  { date: "May 2023", head: "Ruchi Group reports its FY23 results.", img: IMG_TOWER[8] },
  { date: "May 2023", head: "Westminster City Council clears a Ruchi Group redevelopment in Indore.", img: IMG_TOWER[1] },
  { date: "Feb 2023", head: "Innovative Marketing Concept of the Year 2022 goes to Ruchi Group.", img: IMG_LIVING[1] },
  { date: "Feb 2023", head: "Ruchi Group acquires a 60-acre land parcel in Kolkata.", img: IMG_TOWER[3] },
  { date: "Apr 2016", head: "Active Acres named Outstanding Project of the Year — Golden Brick Awards, Dubai.", img: IMG_TOWER[2] },
  { date: "Mar 2015", head: "Active Acres receives the NDTV Premium Apartment Project of the Year, Central & East India.", img: IMG_TOWER[6] },
];

const BLOG = [
  { cat: "On building", title: "How we choose a site before we build on it", date: "May 2026",
    excerpt: "An address has to make sense in ten years, not just on the day you sign. Here is what we look for first.", img: IMG_LIVING[0] },
  { cat: "New Town, Kolkata", title: "Reading One Victoria's plan, room by room", date: "Apr 2026",
    excerpt: "Light, air, and the unglamorous decisions that make a home easy to live in for decades.", img: IMG_TOWER[0] },
  { cat: "Materials", title: "What goes into a wall you never see", date: "Mar 2026",
    excerpt: "The choices behind the finishes — and why the ones you cannot see matter most.", img: IMG_LIVING[1] },
  { cat: "Saatvik Green, Indore", title: "Planting before we pour", date: "Feb 2026",
    excerpt: "A township that begins with shade. Notes from the plantation drive at Saatvik Green.", img: IMG_TOWER[5] },
  { cat: "After handover", title: "The relationship that begins at the keys", date: "Jan 2026",
    excerpt: "What it means to stay reachable long after a project is closed and sold.", img: IMG_PEOPLE[1] },
];

// hero stills for sections
const HERO_IMG = {
  about: window.__rsrc("aboutFamily", "assets/about-family.png"),
  aboutAlt: IMG_LIVING[0],
  testimonial: IMG_PEOPLE[1],
  contact: IMG_TOWER[4],
};

// Video testimonials — short films from families after handover.
// `poster` is the still; the films stream from the brand showreel as a stand-in
// until each family's own clip is linked.
const VIDEO_TESTIMONIALS = [
  { name: "Sandip & Rituparna Ghosh", project: "Active Acres", city: "Kolkata", dur: "2:14", line: "We moved in on the date in our agreement.", poster: IMG_PEOPLE[0] },
  { name: "Dr. Meera Iyer",           project: "Oscar Billionaires", city: "Indore", dur: "1:48", line: "The same person still picks up the phone.", poster: IMG_PEOPLE[3] },
  { name: "Arvind Khandelwal",        project: "Ruchi Lifescapes", city: "Bhopal", dur: "2:32", line: "Exactly what the specification showed us.", poster: IMG_PEOPLE[2] },
  { name: "The Banerjee Family",      project: "One Prime", city: "Kolkata", dur: "3:05", line: "A home our children grew into.", poster: IMG_PEOPLE[1] },
  { name: "Pooja & Nikhil Verma",     project: "Oscar Fort", city: "Indore", dur: "1:57", line: "Handed over, exactly as promised.", poster: IMG_LIVING[0] },
  { name: "Sucharita Bose",           project: "One Victoria", city: "Kolkata", dur: "2:41", line: "Light and air in every room.", poster: IMG_PEOPLE[4] },
  { name: "Rajesh & Anita Malhotra",  project: "Saatvik Green", city: "Indore", dur: "2:09", line: "A township that began with shade.", poster: IMG_LIVING[2] },
  { name: "Imtiaz & Farida Sheikh",   project: "Active Greens", city: "Kolkata", dur: "1:39", line: "Trust we could check before we signed.", poster: IMG_LIVING[1] },
];

// brand showreel, reused by the hero and the testimonial lightbox
window.SHOWREEL = window.__rsrc("heroVideo", "https://ruchirealty.com/wp-content/uploads/2023/12/video_ruchi_1-1.mp4");

Object.assign(window, {
  PROJECTS, PROJECT_OPTIONS, STATS, TRUST, QUOTES, AWARDS, PRESS, BLOG,
  IMG_TOWER, IMG_LIVING, IMG_PEOPLE, HERO_IMG, VIDEO_TESTIMONIALS,
});
