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
import { VIDEO_TESTIMONIALS } from "../data/siteData";
import { LOCAL_BUSINESS_SCHEMAS, ORGANIZATION_SCHEMA, REAL_ESTATE_AGENT_SCHEMA, faqSchema, testimonialReviewSchema } from "../data/structuredData";

const HOME_SCHEMAS = [
  ORGANIZATION_SCHEMA,
  REAL_ESTATE_AGENT_SCHEMA,
  ...LOCAL_BUSINESS_SCHEMAS,
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Ruchi Realty",
    url: "https://ruchirealty.com/",
  },
  faqSchema(HOME_FAQS),
  ...VIDEO_TESTIMONIALS.map(testimonialReviewSchema),
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
      <SEO title="Ruchi Realty | Real Estate Developer in Kolkata, Indore & Bhopal" description="Explore residential apartments, commercial spaces and plotted developments by Ruchi Realty across Kolkata, Indore and Bhopal. View project details, locations, status, brochures and site visit options." canonical="https://ruchirealty.com/" image="/uploads/hero-one-victoria.webp" schemas={HOME_SCHEMAS} />
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
