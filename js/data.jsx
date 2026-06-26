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
  { name: "One Victoria", city: "New Town · Kolkata", type: "Residential", status: "Ongoing", url: "https://ruchirealty.com/one-victoria/", img: "assets/projects/one-victoria.webp" },
  { name: "Oscar Billionaires", city: "Indore", type: "Township", status: "Ready to Move", url: "https://ruchirealty.com/oscar-indore/", img: "assets/projects/oscar-billionaires.webp" },
  { name: "Active Acres", city: "Kolkata", type: "Residential", status: "Ready to Move", url: "https://ruchirealty.com/active-acres/", img: "assets/projects/active-acres.webp" },

  // --- Ready to Move · Kolkata ---
  { name: "One Rajarhat", city: "Rajarhat · Kolkata", type: "Residential", status: "Ready to Move", url: "https://ruchirealty.com/one-rajarhat/", img: "assets/projects/one-rajarhat.webp" },
  { name: "One Prime", city: "New Town · Kolkata", type: "Residential", status: "Ready to Move", url: "https://ruchirealty.com/one-prime-residential/", img: "assets/projects/one-prime.webp" },
  { name: "Active Business Park", city: "Kolkata", type: "Commercial", status: "Ready to Move", url: "https://ruchirealty.com/active-business-park/", img: "assets/projects/active-business-park.webp" },
  { name: "Active Green", city: "Kolkata", type: "Residential", status: "Ready to Move", url: "https://ruchirealty.com/active-greens/", img: "assets/projects/active-green.webp" },

  // --- Ready to Move · Indore ---
  { name: "Oscar Pride", city: "Indore", type: "Township", status: "Ready to Move", url: "https://ruchirealty.com/oscar-pride/", img: "assets/projects/oscar-pride.webp" },
  { name: "Saatvik Vihar", city: "Indore", type: "Township", status: "Ready to Move", url: "https://ruchirealty.com/saatvik-vihar/", img: "assets/projects/saatvik-vihar.webp" },
  { name: "Ruchi Lifescapes", city: "Indore", type: "Township", status: "Ready to Move", url: "https://ruchirealty.com/ruchi-lifescapes-indore/", img: "assets/projects/ruchi-lifescapes-indore.webp" },
  { name: "Saatvik Green", city: "Indore", type: "Township", status: "Ready to Move", url: "https://ruchirealty.com/saatvikgreen-indore/", img: "assets/projects/saatvik-green.webp" },
  { name: "Anand Vihar", city: "Indore", type: "Township", status: "Ready to Move", url: "https://ruchirealty.com/anand-vihar/", img: "assets/projects/anand-vihar.webp" },

  // --- Ready to Move · Bhopal ---
  { name: "Ruchi Lifescapes", city: "Bhopal", type: "Residential", status: "Ready to Move", url: "https://ruchirealty.com/lifescapes-bhopal/", img: "assets/projects/ruchi-lifescapes-bhopal.webp" },

  // --- Ongoing ---
  { name: "Angelica", city: "Active Acres · Kolkata", type: "Residential", status: "Ongoing", url: "https://ruchirealty.com/angelica/", img: "assets/projects/active-acres.webp" },
  { name: "Oscar Fort", city: "Indore", type: "Township", status: "Ongoing", url: "https://ruchirealty.com/oscar-fort/", img: "assets/projects/oscar-fort.webp" },
  { name: "Oscar Sanctuary", city: "Indore", type: "Township", status: "Ongoing", img: "assets/projects/oscar-sanctuary.webp" },

  // --- Upcoming ---
  { name: "Oscar Palace", city: "Indore", type: "Township", status: "Upcoming", url: "https://ruchirealty.com/oscar-palace/", img: "assets/projects/oscar-palace.webp" },
  { name: "Ruchi Enclave", city: "Indore", type: "Township", status: "Upcoming", img: "assets/projects/ruchi-enclave.webp" },
  { name: "Ruchi Hills", city: "Indore", type: "Residential", status: "Upcoming", img: "assets/projects/ruchi-hills.webp" },
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
  { num: 38, suffix: "", label: "Years building in eastern and central India." },
  { num: 12, suffix: "k", label: "Homes handed over to the families who waited for them." },
  { num: 40, suffix: "+", label: "Residential, commercial, and township addresses delivered." },
  { num: 100, suffix: "%", label: "Of our projects are RERA-registered before a single visit is offered." },
];

const TRUST = [
  {
    icon: "shield-check", no: "01", title: "RERA-registered, every project",
    body: "Each address carries its own RERA number, registered before we invite you to a single site visit. The paperwork is open from the first conversation."
  },
  {
    icon: "ruler", no: "02", title: "Built to the specification you were shown",
    body: "The materials, the fittings, the finishes — written down, and met. What you are shown is what you are handed the keys to."
  },
  {
    icon: "handshake", no: "03", title: "We stay after the keys change hands",
    body: "The relationship does not end at possession. Service, support, and the same people you began with remain reachable."
  },
];

const QUOTES = [
  {
    text: "What they showed us in the model home is what we live in today. Nothing was quietly swapped, nothing was oversold.",
    name: "Sandip & Rituparna Ghosh", project: "Active Acres, Kolkata"
  },
  {
    text: "When a question came up two years after handover, the same person who sold us the home picked up the call. That is rare.",
    name: "Dr. Meera Iyer", project: "Oscar Billionaires, Indore"
  },
  {
    text: "Nothing was oversold. What they showed us in the specification is exactly what we live in now.",
    name: "Arvind Khandelwal", project: "Ruchi Lifescapes, Bhopal"
  },
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
  {
    cat: "Kolkata luxury projects",
    title: "Luxury living at One Victoria, New Town Kolkata",
    date: "Dec 2024",
    author: "deepak ruchi_realty",
    slug: "one-victoria-kolkata-luxury-living",
    url: "https://ruchirealty.com/one-victoria-kolkata-the-future-of-real-estate-unveiling-growth-in-indore-and-kolkatas-new-town/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2024/12/One-Victoria-Kolkata.jpg",
    imageAlt: "One Victoria Kolkata",
    img: "assets/blogs/one-victoria-kolkata.webp",
    excerpt: "A premium look at One Victoria as a high-rise residential address in New Town, Kolkata, with 3 BHK and 4 BHK homes shaped around connectivity, lifestyle, and long-term value.",
    content: "One Victoria is positioned as a premium high-rise residential project in New Town, Kolkata, with modern 3 BHK and 4 BHK apartments for buyers seeking skyline-oriented living.\n\nThe article frames New Town as a strong residential address because of its access to IT hubs, retail, education, healthcare, and airport connectivity.\n\nIt also highlights lifestyle amenities such as a sky deck, infinity pool, clubhouse, gym, yoga and jogging spaces, and landscaped gardens, presenting the project as both a lifestyle upgrade and a long-term investment opportunity.",
    cta: "Read Original",
    internalLink: "Projects.html#city=Kolkata",
  },
  {
    cat: "Market growth / investment",
    title: "Real estate growth in Indore and Kolkata New Town",
    date: "Dec 2024",
    author: "Ruchi Realty",
    slug: "real-estate-growth-indore-kolkata-new-town",
    url: "https://ruchirealty.com/the-future-of-real-estate-unveiling-growth-in-indore-and-kolkatas-new-town/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2024/09/real-estate-growth.png",
    imageAlt: "Real Estate Growth",
    img: "assets/blogs/real-estate-growth-indore-kolkata.webp",
    excerpt: "A market explainer on two strategic growth corridors: Indore and Kolkata's New Town, and why both matter for homebuyers and investors.",
    content: "This article frames India's real-estate growth through Indore and Kolkata New Town, two markets shaped by infrastructure, connectivity, and rising residential demand.\n\nIndore is presented as a Tier-2 growth hub with central location advantages, industrial momentum, infrastructure upgrades, and Smart City development.\n\nNew Town, Kolkata is positioned as a planned urban corridor supported by IT activity, connectivity, and demand for well-located residential communities.",
    cta: "Read Original",
    internalLink: "Projects.html",
  },
  {
    cat: "Kolkata luxury projects",
    title: "Top 5 residential projects in Kolkata by Ruchi Realty",
    date: "Dec 2024",
    author: "Ruchi Realty",
    slug: "top-5-residential-projects-kolkata",
    url: "https://ruchirealty.com/top-5-residential-projects-in-kolkata-by-ruchi-realty/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2024/07/Top-5-Residential-Projects-in-Kolkata-by-Ruchi-Realty.webp",
    imageAlt: "Top 5 Residential Projects in Kolkata by Ruchi Realty",
    img: "assets/blogs/top-5-residential-projects-kolkata.webp",
    excerpt: "A project-discovery guide covering Active Acres, One Victoria, One Prime, One Rajarhat, and Angelica across Kolkata.",
    content: "This listicle introduces five Ruchi Realty residential projects in Kolkata: Active Acres, One Victoria, One Prime, One Rajarhat, and Angelica.\n\nThe focus is on location, lifestyle value, everyday convenience, and amenities, helping buyers compare multiple Ruchi Realty addresses in one place.\n\nIt is useful for project discovery, internal linking, and search-led content around residential projects in Kolkata.",
    cta: "Read Original",
    internalLink: "Projects.html#city=Kolkata",
  },
  {
    cat: "Plot buyer education",
    title: "How to evaluate the value of a plot",
    date: "Jun 2024",
    author: "Ruchi Realty",
    slug: "how-to-evaluate-plot-value",
    url: "https://ruchirealty.com/how-to-evaluate-the-value-of-a-plot/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2024/06/Plot.png",
    imageAlt: "Plot value evaluation guide",
    img: "assets/blogs/evaluate-plot-value.webp",
    excerpt: "A practical buyer guide explaining why plot value depends on more than size and asking price.",
    content: "This educational guide explains that plot value depends on location, accessibility, zoning, dimensions, soil, topography, utilities, and surrounding development.\n\nIt encourages buyers to check infrastructure, nearby amenities, legal documents, and market trends before committing to land or plotted developments.\n\nThe article works well as trust-building content for buyers evaluating plotted townships or long-term land investments.",
    cta: "Read Original",
    internalLink: "Projects.html#type=Township",
  },
  {
    cat: "Market growth / investment",
    title: "Investment advantages in Indore real estate",
    date: "May 2024",
    author: "Ruchi Realty",
    slug: "investment-advantages-indore-real-estate",
    url: "https://ruchirealty.com/investment-advantages-in-real-estate-sector-2/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2024/05/Investment-Advantages-in-Real-Estate-Sector.webp",
    imageAlt: "Investment Advantages in Real Estate Sector",
    img: "assets/blogs/indore-real-estate-investment.webp",
    excerpt: "A focused look at why Indore's infrastructure, connectivity, industrial growth, and planned development are attracting property investors.",
    content: "The article positions Indore as a fast-growing real-estate market with strong infrastructure, economic appeal, and central location advantages.\n\nIt highlights connectivity, industrial growth, planned development, residential demand, rental potential, and appreciation possibilities as investment drivers.\n\nRuchi Realty's presence in Indore is connected with trusted development, prime locations, amenities, and long-term value.",
    cta: "Read Original",
    internalLink: "Projects.html#city=Indore",
  },
  {
    cat: "Project-led Indore content",
    title: "Ruchi Lifescapes Indore and premium plotted living",
    date: "May 2024",
    author: "Ruchi Realty",
    slug: "ruchi-lifescapes-indore-premium-plots",
    url: "https://ruchirealty.com/premium-plots-in-indore-2/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2024/05/ruchi-life-min.png",
    imageAlt: "Ruchi Lifescapes Indore premium plots",
    img: "assets/blogs/ruchi-lifescapes-indore-premium-plots.webp",
    excerpt: "A project-led article presenting Ruchi Lifescapes Indore as a premium plotted township in Jhalaria.",
    content: "Ruchi Lifescapes Indore is introduced as a premium plotted development in Jhalaria, Indore, with plots, villas, and row-house style lifestyle possibilities.\n\nThe article mentions amenities such as clubhouse, pool, gardens, gym, children's play areas, basketball, and tennis.\n\nIt positions the development around convenience, safety, greenery, community lifestyle, and future value.",
    cta: "Read Original",
    internalLink: "Projects.html#city=Indore",
  },
  {
    cat: "Plot buyer education",
    title: "First-time property buyer's guide",
    date: "Apr 2024",
    author: "Ruchi Realty",
    slug: "first-time-property-buyer-guide",
    url: "https://ruchirealty.com/buying-property-for-the-first-time-heres-your-buyers-guide-to-the-right-purchase/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2023/12/blog9.webp",
    imageAlt: "Buying Property",
    img: "assets/blogs/first-time-property-buyer-guide.webp",
    excerpt: "A beginner-friendly guide covering budgeting, additional costs, location, property type, amenities, and long-term livability.",
    content: "This buyer guide walks first-time property buyers through budgeting, additional costs, location decisions, property type, and lifestyle fit.\n\nIt explains the importance of amenities, long-term livability, connectivity, convenience, and appreciation potential.\n\nRuchi Lifescapes is referenced as an example of a feature-rich residential option for buyers comparing long-term choices.",
    cta: "Read Original",
    internalLink: "#contact",
  },
  {
    cat: "Project-led Indore content",
    title: "Oscar Pride as an Indore investment opportunity",
    date: "Apr 2024",
    author: "Ruchi Realty",
    slug: "oscar-pride-indore-investment",
    url: "https://ruchirealty.com/unleash-the-potential-of-oscar-pridea-wise-investment-for-growing-returns/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2023/12/blog6.webp",
    imageAlt: "Oscar Pride Investment",
    img: "assets/blogs/oscar-pride-investment.webp",
    excerpt: "An investment-focused article on Oscar Pride, its Kanadia Main Road context, Bypass connectivity, and long-term growth potential.",
    content: "Oscar Pride is presented as a residential investment opportunity in Indore, with attention to Kanadia Main Road and Bypass connectivity.\n\nThe article mentions nearby lifestyle and education anchors, including schools and retail destinations, while emphasizing design, amenities, and appreciation potential.\n\nIt frames Oscar Pride as a smart choice for buyers seeking growing returns in Indore.",
    cta: "Read Original",
    internalLink: "Projects.html#city=Indore",
  },
  {
    cat: "Project-led Indore content",
    title: "Ruchi Lifescapes and serene township living",
    date: "Mar 2024",
    author: "Ruchi Realty",
    slug: "ruchi-lifescapes-serene-lifestyle",
    url: "https://ruchirealty.com/ruchi-lifescapes-an-epitome-of-serene-lifestyle/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2023/09/ruchi_lifespace_blog2.webp",
    imageAlt: "Ruchi Lifescapes Bhopal",
    img: "assets/blogs/ruchi-lifescapes-serene-lifestyle.webp",
    excerpt: "A lifestyle-led piece around peaceful living, green open spaces, and community-focused township design.",
    content: "This article highlights peaceful living, green open spaces, and community-focused township planning at Ruchi Lifescapes.\n\nIt mentions amenities such as clubhouse, wide roads, gardens, pool, gym, children's areas, basketball, and security.\n\nThe piece connects lifestyle comfort with connectivity to highways, malls, and schools.",
    cta: "Read Original",
    internalLink: "Projects.html#type=Township",
  },
  {
    cat: "Project-led Indore content",
    title: "Benefits of gated community living at Oscar Pride",
    date: "Mar 2024",
    author: "Ruchi Realty",
    slug: "oscar-pride-gated-community-living",
    url: "https://ruchirealty.com/owning-a-home-at-oscar-pride-the-benefits-of-gated-community-living/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2023/12/blog_5.webp",
    imageAlt: "Oscar Pride Park",
    img: "assets/blogs/oscar-pride-gated-community.webp",
    excerpt: "A clear guide to gated-community benefits, using Oscar Pride's secure, amenity-led environment as the example.",
    content: "The article explains gated community benefits such as security, privacy, shared amenities, and a stronger community environment.\n\nOscar Pride is described around its 8-acre setting near Kanadia Main Road, Indore, with guarded entry, CCTV, controlled access, and safe play areas.\n\nLifestyle amenities mentioned include gym, lily pond, temple, kids' play area, selfie wall, BBQ space, jogging track, and senior garden.",
    cta: "Read Original",
    internalLink: "Projects.html#city=Indore",
  },
  {
    cat: "Market growth / investment",
    title: "Why invest in real estate in 2024",
    date: "Feb 2024",
    author: "Ruchi Realty",
    slug: "why-invest-in-real-estate-2024",
    url: "https://ruchirealty.com/why-should-you-invest-in-real-estate-in-2023/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2023/09/Real-Estate_blog1.webp",
    imageAlt: "Growth Ruchi Realty",
    img: "assets/blogs/invest-in-real-estate-2024.webp",
    excerpt: "A top-funnel investment article covering infrastructure, market recovery, Tier-2 growth, and plotted investment demand.",
    content: "This investment article discusses real-estate opportunity in India with focus on Tier-2 and Tier-3 growth markets.\n\nIt mentions infrastructure development, government initiatives, market recovery, and plotted investment demand.\n\nIndore is used as an example market, with references to Ruchi Lifescapes, Oscar Pride, and Saatvik Vihar. The original URL ends in 2023 while the visible title references 2024, so any migration should preserve or redirect carefully.",
    cta: "Read Original",
    internalLink: "Projects.html#city=Indore",
  },
  {
    cat: "Project-led Indore content",
    title: "Luxury living at Ruchi Lifescapes",
    date: "Feb 2024",
    author: "Ruchi Realty",
    slug: "ruchi-lifescapes-luxury-living",
    url: "https://ruchirealty.com/experience-luxury-living-at-ruchi-lifescapes-discover-your-dream-plot/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2024/05/ruchi-life-min.png",
    imageAlt: "Ruchi Lifescapes luxury plotted community",
    img: "assets/blogs/ruchi-lifescapes-luxury-living.webp",
    excerpt: "An aspiration-led plot-buying article about building a future home in a planned, green, amenity-rich community.",
    content: "Ruchi Lifescapes is positioned as a luxury plotted community for buyers who want to build a dream home around future lifestyle needs.\n\nThe article highlights planned township living, green landscapes, connectivity, amenities, and peaceful surroundings.\n\nIt blends lifestyle aspiration with investment value for plot buyers.",
    cta: "Read Original",
    internalLink: "Projects.html#type=Township",
  },
  {
    cat: "Plot buyer education",
    title: "How to know if you are getting a good property price",
    date: "Dec 2023",
    author: "Ruchi Realty",
    slug: "good-property-price-guide",
    url: "https://ruchirealty.com/how-to-know-youre-getting-a-good-price/",
    originalImage: "https://ruchirealty.com/wp-content/uploads/2023/12/blog10.webp",
    imageAlt: "Investment Opportunity",
    img: "assets/blogs/good-property-price.webp",
    excerpt: "A buyer education piece on comparing similar properties, understanding local demand, and evaluating whether a price is fair.",
    content: "This guide explains how buyers can assess whether a property is priced fairly before negotiating or closing a deal.\n\nIt recommends comparing similar properties, reviewing listings, and understanding local supply and demand.\n\nThe article also suggests considering future development prospects, lender valuation, inspection findings, and repair or improvement costs.",
    cta: "Read Original",
    internalLink: "#contact",
  },
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
  { name: "Ruchi Realty", project: "Active Acres", city: "Kolkata", dur: "2:14", line: "We moved in on the date in our agreement.", poster: "assets/testimonial_1.webp", video: "https://www.youtube.com/embed/GTYs3ZynAQU?feature=oembed&autoplay=1&rel=0&controls=0" },
  { name: "Saatvik Vihar Review", project: "Oscar Billionaires", city: "Indore", dur: "1:48", line: "The same person still picks up the phone.", poster: "assets/testimonial_2.webp", video: "https://www.youtube.com/embed/S4hnOtmQA9s?feature=oembed&autoplay=1&rel=0&controls=0" },
  { name: "Ruchi Realty", project: "Ruchi Lifescapes", city: "Bhopal", dur: "2:32", line: "Exactly what the specification showed us.", poster: "assets/testimonial_3.webp", video: "https://www.youtube.com/embed/ZDJWHNFzjXc?feature=oembed&autoplay=1&rel=0&controls=0" },
  { name: "Ruchi Realty", project: "One Prime", city: "Kolkata", dur: "3:05", line: "A home our children grew into.", poster: "assets/testimonial_4.webp", video: "https://www.youtube.com/embed/rRzZ4gAwLjY?feature=oembed&autoplay=1&rel=0&controls=0" },
  { name: "Ruchi Realty", project: "Oscar Fort", city: "Indore", dur: "1:57", line: "Handed over, exactly as promised.", poster: "assets/testimonial_5.webp", video: "https://www.youtube.com/embed/Gsv3Kwl4k8U?feature=oembed&autoplay=1&rel=0&controls=0" },
  { name: "OV Review", project: "One Victoria", city: "Kolkata", dur: "2:41", line: "Light and air in every room.", poster: "assets/testimonial_6.webp", video: "https://player.vimeo.com/video/1106022712?autoplay=1&rel=0&controls=0#t=" },
  { name: "One Victoria Review", project: "Saatvik Green", city: "Indore", dur: "2:09", line: "A township that began with shade.", poster: "assets/testimonial_7.webp", video: "https://player.vimeo.com/video/1106028174?autoplay=1&rel=0&controls=0#t=" },
  { name: "OV Review 3", project: "Active Greens", city: "Kolkata", dur: "1:39", line: "Trust we could check before we signed.", poster: "assets/testimonial_8.webp", video: "https://player.vimeo.com/video/1106030671?autoplay=1&rel=0&controls=0#t=" },
  { name: "rrr4", project: "One Victoria", city: "Kolkata", dur: "1:39", line: "Trust we could check before we signed.", poster: "assets/testimonial_9.webp", video: "https://player.vimeo.com/video/1106031951?autoplay=1&rel=0&controls=0#t=" },
];

// brand showreel, reused by the hero and the testimonial lightbox
window.SHOWREEL = window.__rsrc("heroVideo", "https://ruchirealty.com/wp-content/uploads/2023/12/video_ruchi_1-1.mp4");

Object.assign(window, {
  PROJECTS, PROJECT_OPTIONS, STATS, TRUST, QUOTES, AWARDS, PRESS, BLOG,
  IMG_TOWER, IMG_LIVING, IMG_PEOPLE, HERO_IMG, VIDEO_TESTIMONIALS,
});
