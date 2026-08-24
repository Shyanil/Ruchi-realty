export const SITE_URL = "https://ruchirealty.com";
export const ORGANIZATION_ID = `${SITE_URL}/#organization`;

export const ORGANIZATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": ORGANIZATION_ID,
  name: "Ruchi Realty",
  legalName: "Ruchi Realty Holdings Limited",
  url: `${SITE_URL}/`,
  logo: {
    "@type": "ImageObject",
    url: `${SITE_URL}/assets/logo-h.webp`,
  },
  foundingDate: "2008",
  telephone: "+91 89292 25275",
  email: "emarketing@ruchirealty.com",
  sameAs: [
    "https://www.facebook.com/RuchiRealty",
    "https://www.instagram.com/ruchi_realty",
    "https://www.linkedin.com/company/ruchi-realty-holdings-limited/",
    "https://www.youtube.com/@ruchirealtygroup",
  ],
};

export const REAL_ESTATE_AGENT_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "RealEstateAgent",
  "@id": `${SITE_URL}/#real-estate-agent`,
  name: "Ruchi Realty",
  url: `${SITE_URL}/`,
  image: `${SITE_URL}/assets/logo-h.webp`,
  telephone: "+91 89292 25275",
  email: "emarketing@ruchirealty.com",
  priceRange: "Contact for current project pricing",
  areaServed: ["Kolkata", "Indore", "Bhopal"],
  parentOrganization: { "@id": ORGANIZATION_ID },
};

const office = ({ id, name, streetAddress, locality, region, postalCode, telephone }) => ({
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/contact#${id}`,
  name,
  url: `${SITE_URL}/contact#${id}`,
  image: `${SITE_URL}/assets/logo-h.webp`,
  telephone,
  priceRange: "Contact for current project pricing",
  parentOrganization: { "@id": ORGANIZATION_ID },
  address: {
    "@type": "PostalAddress",
    streetAddress,
    addressLocality: locality,
    addressRegion: region,
    postalCode,
    addressCountry: "IN",
  },
});

export const LOCAL_BUSINESS_SCHEMAS = [
  office({
    id: "indore-office",
    name: "Ruchi Realty Indore Office",
    streetAddress: "2/1, South Tukoganj, Behind High Court",
    locality: "Indore",
    region: "Madhya Pradesh",
    postalCode: "452001",
    telephone: "+91 89292 25275",
  }),
  office({
    id: "kolkata-office",
    name: "Ruchi Realty Kolkata Office",
    streetAddress: "54, 10, Debendra Chandra Dey Road, near ITC Sonar, Tangra",
    locality: "Kolkata",
    region: "West Bengal",
    postalCode: "700015",
    telephone: "+91 98364 18000",
  }),
  office({
    id: "bhopal-office",
    name: "Ruchi Realty Bhopal Office",
    streetAddress: "Behind Bhabha College, Jatkhedi, Hoshangabad Road",
    locality: "Bhopal",
    region: "Madhya Pradesh",
    postalCode: "462026",
    telephone: "+91 89292 25275",
  }),
];

export function absoluteUrl(value = "/") {
  try {
    return new URL(value, SITE_URL).toString();
  } catch {
    return `${SITE_URL}/`;
  }
}

export function breadcrumbSchema(items = []) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  };
}

export function faqSchema(items = []) {
  const questions = items.filter((item) => item?.question && item?.answer);
  if (!questions.length) return null;
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: questions.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

const PROJECT_ROUTES = {
  "Active Acres": "/projects/active-acres-angelica",
  "Saatvik Vihar": "/projects/saatvik-vihar-indore",
  "Ruchi Lifescapes": "/projects/ruchi-lifescapes-indore-project",
  "One Victoria": "/projects/one-victoria-new-town",
};

export function testimonialReviewSchema(testimonial = {}) {
  const route = PROJECT_ROUTES[testimonial.project] || "/projects";
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    name: `${testimonial.project} resident testimonial`,
    reviewBody: testimonial.quote,
    author: { "@type": "Person", name: testimonial.customerName },
    itemReviewed: {
      "@type": "Product",
      "@id": `${absoluteUrl(route)}#product`,
      name: testimonial.project,
      url: absoluteUrl(route),
      brand: { "@id": ORGANIZATION_ID },
    },
    video: testimonial.video ? {
      "@type": "VideoObject",
      name: `${testimonial.project} resident testimonial`,
      description: testimonial.quote,
      thumbnailUrl: absoluteUrl(testimonial.poster),
      embedUrl: testimonial.video,
    } : undefined,
  };
}
