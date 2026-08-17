import { useEffect } from "react";
import Nav from "../components/Nav";
import Hero from "../components/Hero";
import Intro from "../components/Intro";
import { ProjectsSection } from "../components/ProjectsSection";
import { About } from "../components/About";
import { WhyChoose } from "../components/WhyChoose";
import { Testimonials } from "../components/Testimonials";
import { Awards } from "../components/Awards";
import { Press } from "../components/Press";
import { BlogSection } from "../components/BlogSection";
import { HOME_FAQS } from "../components/Faq";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import SEO from "../components/SEO";

const HOME_SCHEMAS = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Ruchi Realty",
    url: "https://ruchirealty.com/",
    logo: "https://ruchirealty.com/assets/logo-h.webp",
    foundingDate: "2008",
    sameAs: [
      "https://www.facebook.com/RuchiRealty",
      "https://www.instagram.com/ruchi_realty",
      "https://www.linkedin.com/company/ruchi-realty-holdings-limited/",
      "https://www.youtube.com/@ruchirealty.comrealestatec8583",
    ],
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ruchi Realty",
    url: "https://ruchirealty.com/",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  },
];

export default function HomePage() {
  useEffect(() => {
    if (window.location.hash) {
      const h = window.location.hash;
      setTimeout(() => {
        const el = document.querySelector(h);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 80);
    }
  }, []);

  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <SEO title="Ruchi Realty | Real Estate Developer in Kolkata, Indore & Bhopal" description="Explore residential, commercial and plotted projects by Ruchi Realty across Kolkata, Indore and Bhopal. View locations, status and enquiry options." canonical="https://ruchirealty.com/" image="/uploads/hero-one-victoria.webp" />
      {HOME_SCHEMAS.map((schema) => (
        <script
          key={schema["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
        />
      ))}
      <Nav onContact={scrollToContact} heroSound solidAt={1} />
      <main>
        <Hero />
        <Intro />
        <ProjectsSection />
        <About />
        <WhyChoose />
        <Testimonials />
        <Awards />
        <Press />
        <BlogSection />
        <Contact
          eyebrow="Get in Touch"
          heading="Plan Your Site Visit"
          lead="Tell us which real estate project you'd like to explore. Share your preferred city, Indore, Kolkata or Bhopal, along with your project and contact details, and our team will reach out to answer questions or arrange a visit."
        />
      </main>
      <Footer />
    </>
  );
}
