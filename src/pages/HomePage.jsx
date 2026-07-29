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
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { CustomCursor } from "../components/shared";
import SEO from "../components/SEO";

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
      <SEO title="Ruchi Realty | Real Estate Developer in Kolkata, Indore & Bhopal" description="Founded in 2008, Ruchi Realty has delivered residential, commercial and plotted developments across Kolkata, Indore and Bhopal. Explore 20+ projects." canonical="https://ruchirealty.com/" image="/uploads/hero-one-victoria.webp" />
      <CustomCursor />
      <Nav onContact={scrollToContact} />
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
        <Contact />
      </main>
      <Footer />
    </>
  );
}
