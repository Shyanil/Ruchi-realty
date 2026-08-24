const KOLKATA_PROJECTS = [
  "/projects/one-victoria-new-town",
  "/projects/one-prime-residential",
  "/projects/active-acres-angelica",
  "/projects/one-rajarhat",
  "/projects/active-business-park",
  "/projects/active-greens",
];

const KOLKATA_RESIDENTIAL = KOLKATA_PROJECTS.filter((url) => url !== "/projects/active-business-park");
const INDORE_PROJECTS = [
  "/projects/oscar-indore",
  "/projects/oscar-pride-indore",
  "/projects/saatvik-vihar-indore",
  "/projects/ruchi-lifescapes-indore-project",
  "/projects/saatvikgreen-indore",
  "/projects/anand-vihar-indore",
  "/projects/oscar-fort-indore",
  "/projects/oscar-sanctuary-indore",
  "/projects/oscar-palace",
  "/projects/ruchi-enclave-indore",
];

const KOLKATA_BLOGS = [
  "top-5-residential-projects-kolkata",
  "one-victoria-kolkata-luxury-living",
  "real-estate-growth-indore-kolkata-new-town",
];

const INDORE_BLOGS = [
  "investment-advantages-indore-real-estate",
  "how-to-evaluate-plot-value",
  "ruchi-lifescapes-indore-premium-plots",
];

const BHOPAL_BLOGS = [
  "first-time-property-buyer-guide",
  "good-property-price-guide",
  "why-invest-in-real-estate-2024",
];

const commonFaq = (city) => [
  {
    question: `How can I check current project prices and availability in ${city}?`,
    answer: `Use the enquiry form on this page or open the relevant project page. The Ruchi Realty team will share the latest price, inventory, configuration and site-visit information for ${city}.`,
  },
  {
    question: `Can I schedule a Ruchi Realty site visit in ${city} online?`,
    answer: `Yes. Submit the enquiry form with your preferred project and contact details, and the relevant team will coordinate a suitable site-visit time.`,
  },
  {
    question: "Where can I find RERA details for a project?",
    answer: "Open the individual project page to view the RERA registration number when applicable and available. Buyers should also verify the details on the relevant state RERA portal.",
  },
];

export const LOCAL_SEO_PAGES = {
  "/projects/kolkata": {
    path: "/projects/kolkata",
    city: "Kolkata",
    eyebrow: "Kolkata portfolio",
    heading: "Ruchi Realty Projects in Kolkata",
    title: "Ruchi Realty Projects in Kolkata | Residential & Commercial",
    description: "Explore Ruchi Realty projects in Kolkata, including apartments in New Town and Rajarhat and commercial property. Compare location, type, status and enquiry options.",
    introTitle: "Explore Ruchi Realty's Kolkata portfolio",
    intro: [
      "Kolkata offers a varied real estate landscape, from established residential neighbourhoods to the planned growth corridors of New Town and Rajarhat. Ruchi Realty's city portfolio includes apartments, premium residences and commercial spaces for different buyer requirements.",
      "Use this page to review available projects, compare their location and current status, and move directly to project details, brochures, floor plans or a site-visit enquiry.",
    ],
    benefits: [
      { title: "Connected locations", text: "Explore projects positioned across Kolkata, New Town and Rajarhat, with access to established social and business infrastructure." },
      { title: "Choice of property types", text: "Compare residential apartments, premium residences and commercial spaces within one city portfolio." },
      { title: "Clear project discovery", text: "Review project status, configuration and location before opening the detailed project page." },
      { title: "Direct buyer support", text: "Request current availability, pricing, brochures and a coordinated site visit from the relevant project team." },
    ],
    projectUrls: KOLKATA_PROJECTS,
    blogSlugs: KOLKATA_BLOGS,
    faqs: [
      { question: "Which Ruchi Realty projects are available in Kolkata?", answer: "The Kolkata portfolio shown here includes One Victoria, One Prime Residential, Active Acres, One Rajarhat, Active Business Park and Active Greens. Availability can change, so confirm current inventory with the project team." },
      { question: "Does Ruchi Realty offer both residential and commercial projects in Kolkata?", answer: "Yes. The portfolio includes residential apartment communities as well as Active Business Park for buyers and businesses exploring commercial property." },
      ...commonFaq("Kolkata"),
    ],
    ctaTitle: "Shortlist a Kolkata project",
    ctaText: "Tell us what you are looking for and our Kolkata team will help with current availability, project information and a site visit.",
  },
  "/projects/indore": {
    path: "/projects/indore",
    city: "Indore",
    eyebrow: "Indore portfolio",
    heading: "Ruchi Realty Projects in Indore",
    title: "Ruchi Realty Projects in Indore | Plots & Communities",
    description: "Explore Ruchi Realty projects and plotted developments in Indore. Compare locations, configurations, project status, brochures, availability and site-visit options.",
    introTitle: "Planned developments across Indore",
    intro: [
      "Indore continues to attract homebuyers and land buyers seeking planned communities, road connectivity and long-term flexibility. Ruchi Realty's Indore portfolio is centred on residential plots and community-led developments across multiple city growth corridors.",
      "Compare ready-to-move, ongoing and upcoming projects below, then open an individual project page for amenities, plans, RERA information and the latest availability.",
    ],
    benefits: [
      { title: "Multiple growth corridors", text: "Review developments in locations including Jhalariya, Mangliya, Morod and other parts of the Indore market." },
      { title: "Plot-size choice", text: "Explore a range of plotted developments suited to different home-building and long-term ownership plans." },
      { title: "Different project stages", text: "Compare ready-to-move, ongoing and upcoming communities according to your preferred buying timeline." },
      { title: "Guided next steps", text: "Request current plot availability, plans, pricing and a site visit directly from the project team." },
    ],
    projectUrls: INDORE_PROJECTS,
    blogSlugs: INDORE_BLOGS,
    faqs: [
      { question: "Which plotted developments does Ruchi Realty offer in Indore?", answer: "The Indore portfolio includes Oscar Billionaires, Oscar Pride, Saatvik Vihar, Ruchi Lifescapes, Saatvik Green, Anand Vihar, Oscar Fort, Oscar Sanctuary, Oscar Palace and Ruchi Enclave. Check each project page for its current status and availability." },
      { question: "Are ready-to-move plots available in Indore?", answer: "Several Indore projects are listed as ready to move, while others are ongoing or upcoming. Use the comparison table and confirm the latest plot inventory with the sales team." },
      ...commonFaq("Indore"),
    ],
    ctaTitle: "Find the right project in Indore",
    ctaText: "Share your preferred location, plot requirement and timeline. Our team will help you compare suitable developments and arrange a visit.",
  },
  "/projects/bhopal": {
    path: "/projects/bhopal",
    city: "Bhopal",
    eyebrow: "Bhopal portfolio",
    heading: "Ruchi Realty Projects in Bhopal",
    title: "Ruchi Realty Projects in Bhopal | Homes, Row Houses & Shops",
    description: "Explore Ruchi Lifescapes Bhopal by Ruchi Realty. Review its location, residential configurations, project status, details and site-visit enquiry options.",
    introTitle: "Discover Ruchi Realty in Bhopal",
    intro: [
      "Bhopal combines an established urban core with expanding residential corridors. Ruchi Lifescapes presents a mixed residential community for buyers comparing apartments, row houses and supporting commercial convenience within one development.",
      "Review the featured project below and open its detail page for specifications, amenities, RERA information and the latest availability from the Bhopal team.",
    ],
    benefits: [
      { title: "Residential choice", text: "Compare apartment and row-house formats within the featured Ruchi Lifescapes community." },
      { title: "Everyday convenience", text: "The project mix includes residential options and shops intended to support daily community needs." },
      { title: "Project transparency", text: "Open the project page for available specifications, amenities, plans and RERA information." },
      { title: "Local assistance", text: "Connect with the project team for current inventory, pricing and a coordinated site visit." },
    ],
    projectUrls: ["/projects/lifescapes-bhopal"],
    blogSlugs: BHOPAL_BLOGS,
    faqs: [
      { question: "Which Ruchi Realty project is available in Bhopal?", answer: "Ruchi Lifescapes is the featured Ruchi Realty development in Bhopal, with residential formats and shops. Open the project page for the latest details." },
      { question: "What property configurations are listed at Ruchi Lifescapes Bhopal?", answer: "The current project summary includes 2.5 and 3 BHK homes, row houses and shops. Confirm current inventory and specifications with the project team." },
      ...commonFaq("Bhopal"),
    ],
    ctaTitle: "Enquire about Ruchi Lifescapes Bhopal",
    ctaText: "Ask for current configurations, availability, pricing or a site visit and the Bhopal project team will assist you.",
  },
  "/residential-projects-in-kolkata": {
    path: "/residential-projects-in-kolkata",
    city: "Kolkata",
    eyebrow: "Kolkata homes",
    heading: "Residential Projects in Kolkata",
    title: "Residential Projects in Kolkata | Ruchi Realty Apartments",
    description: "Compare residential projects and apartments by Ruchi Realty across Kolkata, New Town and Rajarhat. View configurations, status, project details and enquiry options.",
    introTitle: "Compare homes across Kolkata",
    intro: [
      "Ruchi Realty's residential portfolio in Kolkata covers established neighbourhoods as well as New Town and Rajarhat. Buyers can compare apartment communities, premium residences and different possession stages in one place.",
      "Each project page provides deeper information about its homes, amenities, location, RERA registration where available, brochures and enquiry options.",
    ],
    benefits: [
      { title: "Multiple residential formats", text: "Compare practical apartment configurations with premium and larger-format residences." },
      { title: "Kolkata location choice", text: "Explore projects across Kolkata, New Town and Rajarhat based on your daily travel and neighbourhood preferences." },
      { title: "Ready and ongoing options", text: "Use current project status as an initial guide when matching a home to your buying timeline." },
      { title: "One enquiry route", text: "Ask for availability, prices, floor plans, brochures or site visits from the appropriate project team." },
    ],
    projectUrls: KOLKATA_RESIDENTIAL,
    blogSlugs: KOLKATA_BLOGS,
    faqs: [
      { question: "Which residential projects does Ruchi Realty offer in Kolkata?", answer: "The residential portfolio shown here includes One Victoria, One Prime Residential, Active Acres, One Rajarhat and Active Greens. Confirm live unit availability with the relevant team." },
      { question: "Are ready-to-move apartments available in Kolkata?", answer: "Several listed Kolkata projects are marked ready to move, while One Victoria is currently shown as ongoing. Project status and inventory should be reconfirmed before making a decision." },
      ...commonFaq("Kolkata"),
    ],
    ctaTitle: "Compare Kolkata residential projects",
    ctaText: "Tell us your preferred location, home configuration and timeline for a focused project shortlist and site-visit assistance.",
  },
  "/plots-in-indore": {
    path: "/plots-in-indore",
    city: "Indore",
    eyebrow: "Indore plotted developments",
    heading: "Residential Plots in Indore",
    title: "Residential Plots in Indore | Ruchi Realty Developments",
    description: "Explore residential plots and plotted developments by Ruchi Realty in Indore. Compare locations, plot configurations, project status, RERA details and availability.",
    introTitle: "Find a plotted development in Indore",
    intro: [
      "A residential plot gives buyers flexibility to plan a home around their needs, but the surrounding layout, access, utilities, documentation and development status remain important considerations. Ruchi Realty offers plotted communities across several Indore locations.",
      "Use the project comparison below as a starting point, then review the individual project page and speak with the team before selecting a plot.",
    ],
    benefits: [
      { title: "Flexible home planning", text: "Choose a plot as the foundation for a home designed around your space and future requirements." },
      { title: "Range of developments", text: "Compare multiple project locations, plot-size ranges and development stages across Indore." },
      { title: "Due-diligence support", text: "Review available plans and RERA details, and request documentation from the project team." },
      { title: "On-ground evaluation", text: "Arrange a site visit to understand access, surroundings and the development before deciding." },
    ],
    projectUrls: INDORE_PROJECTS,
    blogSlugs: ["how-to-evaluate-plot-value", "ruchi-lifescapes-indore-premium-plots", "oscar-pride-indore-investment"],
    faqs: [
      { question: "Where can I find Ruchi Realty plots in Indore?", answer: "Ruchi Realty's plotted portfolio spans several Indore locations, including Jhalariya, Mangliya, Morod and other growth corridors. The cards and comparison table on this page show the currently listed projects." },
      { question: "What should I compare before buying a residential plot?", answer: "Compare location and access, plot dimensions, development status, available infrastructure, approved plans, legal documents, RERA information and the total purchase cost." },
      ...commonFaq("Indore"),
    ],
    ctaTitle: "Ask about available plots in Indore",
    ctaText: "Share your preferred area, approximate plot requirement and budget range to receive a relevant project shortlist.",
  },
  "/commercial-property-in-kolkata": {
    path: "/commercial-property-in-kolkata",
    city: "Kolkata",
    eyebrow: "Kolkata commercial property",
    heading: "Commercial Property in Kolkata",
    title: "Commercial Property in Kolkata | Active Business Park",
    description: "Explore Active Business Park, Ruchi Realty's commercial property in Kolkata, with office, retail and commercial spaces. Request plans, availability and a site visit.",
    introTitle: "A commercial address for Kolkata businesses",
    intro: [
      "Commercial property selection depends on access, usable space, business visibility, building infrastructure and fit with long-term operational needs. Active Business Park brings Ruchi Realty's commercial offering into one dedicated Kolkata development.",
      "Review the project summary below, then open the project page or enquire for current office and retail availability, size options, plans and visit coordination.",
    ],
    benefits: [
      { title: "Flexible space formats", text: "Explore office, retail and commercial space options for different business requirements." },
      { title: "Kolkata business access", text: "Evaluate the location in relation to customers, teams, suppliers and the wider city network." },
      { title: "Project information", text: "Review specifications, status and available documentation on the detailed project page." },
      { title: "Assisted shortlisting", text: "Request current inventory and plans based on your preferred use and approximate space requirement." },
    ],
    projectUrls: ["/projects/active-business-park"],
    blogSlugs: ["real-estate-growth-indore-kolkata-new-town", "good-property-price-guide", "why-invest-in-real-estate-2024"],
    faqs: [
      { question: "Which commercial project does Ruchi Realty offer in Kolkata?", answer: "Active Business Park is Ruchi Realty's listed commercial development in Kolkata, offering office, retail and other commercial spaces." },
      { question: "How can I check commercial space sizes and availability?", answer: "Open the Active Business Park project page or submit the enquiry form with your preferred space type and approximate requirement. The team will share current options." },
      ...commonFaq("Kolkata"),
    ],
    ctaTitle: "Discuss your commercial space requirement",
    ctaText: "Tell us whether you need office, retail or another commercial format and the team will share suitable current options.",
  },
  "/flats-in-new-town-kolkata": {
    path: "/flats-in-new-town-kolkata",
    city: "Kolkata",
    eyebrow: "New Town residences",
    heading: "Flats in New Town, Kolkata",
    title: "Flats in New Town Kolkata | One Victoria & One Prime",
    description: "Explore Ruchi Realty flats in New Town, Kolkata at One Victoria and One Prime Residential. Compare configurations, status, project details and site visits.",
    introTitle: "Explore Ruchi Realty homes in New Town",
    intro: [
      "New Town is a planned Kolkata district where residential neighbourhoods sit close to business, education, healthcare and lifestyle destinations. Ruchi Realty's One Victoria and One Prime Residential offer two different apartment choices in this part of the city.",
      "Compare their configurations and project status below, then open each project for detailed amenities, plans, brochures and availability.",
    ],
    benefits: [
      { title: "Planned urban setting", text: "Consider homes within New Town's organised residential and commercial environment." },
      { title: "Apartment choice", text: "Compare 2 and 3 BHK homes at One Prime with 3 and 4 BHK residences at One Victoria." },
      { title: "Different buying timelines", text: "Review a ready-to-move option alongside an ongoing development." },
      { title: "Project-level details", text: "Open each page for amenities, plans, RERA information, brochures and current availability." },
    ],
    projectUrls: ["/projects/one-victoria-new-town", "/projects/one-prime-residential"],
    blogSlugs: ["one-victoria-kolkata-luxury-living", "top-5-residential-projects-kolkata", "real-estate-growth-indore-kolkata-new-town"],
    faqs: [
      { question: "Which Ruchi Realty projects are available in New Town, Kolkata?", answer: "One Victoria in Action Area 1 and One Prime Residential in New Town are the two projects featured on this page." },
      { question: "What flat configurations are available in these New Town projects?", answer: "The current project summaries list 3 and 4 BHK residences at One Victoria and 2 and 3 BHK apartments at One Prime Residential. Confirm live unit availability with the project team." },
      ...commonFaq("New Town, Kolkata"),
    ],
    ctaTitle: "Find a flat in New Town",
    ctaText: "Share your preferred configuration and buying timeline to compare One Victoria and One Prime Residential with the project team.",
  },
  "/real-estate-developer-in-indore": {
    path: "/real-estate-developer-in-indore",
    city: "Indore",
    eyebrow: "Ruchi Realty Indore",
    heading: "Real Estate Developer in Indore",
    title: "Real Estate Developer in Indore | Ruchi Realty",
    description: "Learn about Ruchi Realty's real estate developments in Indore since 2008. Explore plotted communities, compare projects and request current availability or a site visit.",
    introTitle: "Ruchi Realty's development presence in Indore",
    intro: [
      "Since 2008, Ruchi Realty has developed residential, commercial and plotted communities across its markets. In Indore, the portfolio brings together multiple plotted developments designed for buyers comparing location, community planning and different possession stages.",
      "This page provides a city-level view of the current Indore portfolio, with direct routes to project details, buyer guides and the local enquiry team.",
    ],
    benefits: [
      { title: "Experience since 2008", text: "Explore developments from a real estate brand active across Indore, Kolkata and Bhopal." },
      { title: "Indore project range", text: "Compare several plotted communities across different locations and project stages." },
      { title: "Information-led buying", text: "Access project details, plans, RERA information where available and practical buyer resources." },
      { title: "Support beyond discovery", text: "Connect with the team for availability, documentation, site visits and next-step guidance." },
    ],
    projectUrls: INDORE_PROJECTS,
    blogSlugs: INDORE_BLOGS,
    faqs: [
      { question: "How long has Ruchi Realty operated as a real estate developer?", answer: "Ruchi Realty has developed residential, commercial and plotted communities since 2008, with a presence across Indore, Kolkata and Bhopal." },
      { question: "What does Ruchi Realty develop in Indore?", answer: "The Indore portfolio currently focuses on plotted residential communities across a range of locations, plot configurations and development stages." },
      ...commonFaq("Indore"),
    ],
    ctaTitle: "Speak with Ruchi Realty in Indore",
    ctaText: "Ask about current projects, plotted development options, documentation or site visits in Indore.",
  },
  "/real-estate-developer-in-kolkata": {
    path: "/real-estate-developer-in-kolkata",
    city: "Kolkata",
    eyebrow: "Ruchi Realty Kolkata",
    heading: "Real Estate Developer in Kolkata",
    title: "Real Estate Developer in Kolkata | Ruchi Realty",
    description: "Explore Ruchi Realty's residential and commercial developments in Kolkata since 2008. Compare projects in Kolkata, New Town and Rajarhat and enquire online.",
    introTitle: "Ruchi Realty's development presence in Kolkata",
    intro: [
      "Since 2008, Ruchi Realty has developed residential, commercial and plotted communities across its markets. The Kolkata portfolio includes apartment communities, premium residences and commercial property across Kolkata, New Town and Rajarhat.",
      "Explore the full city portfolio below, compare projects and continue to individual pages for specifications, amenities, RERA information, brochures and enquiries.",
    ],
    benefits: [
      { title: "Experience since 2008", text: "Review a development track record spanning residential, commercial and plotted real estate." },
      { title: "Kolkata portfolio depth", text: "Compare homes and commercial property across several city locations and buyer requirements." },
      { title: "Transparent discovery", text: "Move from a city overview to detailed project information, available documentation and FAQs." },
      { title: "Connected assistance", text: "Use one enquiry route for current prices, inventory, brochures, plans and site visits." },
    ],
    projectUrls: KOLKATA_PROJECTS,
    blogSlugs: KOLKATA_BLOGS,
    faqs: [
      { question: "How long has Ruchi Realty operated as a real estate developer?", answer: "Ruchi Realty has developed residential, commercial and plotted communities since 2008, with projects across Kolkata, Indore and Bhopal." },
      { question: "What types of property does Ruchi Realty develop in Kolkata?", answer: "Ruchi Realty's Kolkata portfolio includes residential apartments, premium residences and commercial spaces across Kolkata, New Town and Rajarhat." },
      ...commonFaq("Kolkata"),
    ],
    ctaTitle: "Speak with Ruchi Realty in Kolkata",
    ctaText: "Tell us whether you are comparing a home or commercial property and our Kolkata team will guide the next steps.",
  },
};

export const LOCAL_SEO_PAGE_LIST = Object.values(LOCAL_SEO_PAGES);

