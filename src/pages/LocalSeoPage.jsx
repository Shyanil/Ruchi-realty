import { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import LeadCaptureFlow from "../components/LeadCaptureFlow";
import { ProjectTile } from "../components/ProjectsSection";
import SEO from "../components/SEO";
import { Reveal, RImg } from "../components/shared";
import { PROJECTS } from "../data/projects";
import { BLOG } from "../data/siteData";
import { LOCAL_SEO_PAGES } from "../data/localSeoPages";
import { ORGANIZATION_ID, absoluteUrl, breadcrumbSchema, faqSchema } from "../data/structuredData";

const PROJECT_FACTS = {
  "/projects/one-victoria-new-town": { location: "Action Area 1, New Town", configuration: "3 & 4 BHK apartments" },
  "/projects/one-prime-residential": { location: "New Town, Kolkata", configuration: "2 & 3 BHK apartments" },
  "/projects/active-acres-angelica": { location: "Kolkata", configuration: "2, 3 & 4 BHK homes" },
  "/projects/one-rajarhat": { location: "Rajarhat, Kolkata", configuration: "1, 2, 3 & 4 BHK apartments" },
  "/projects/active-business-park": { location: "Kolkata", configuration: "Offices, retail & commercial spaces" },
  "/projects/active-greens": { location: "Kolkata", configuration: "2 & 3 BHK apartments" },
  "/projects/oscar-indore": { location: "Indore", configuration: "Premium residential plots" },
  "/projects/oscar-pride-indore": { location: "Indore", configuration: "Residential plots" },
  "/projects/saatvik-vihar-indore": { location: "Mangliya Sadak, Indore", configuration: "Residential plots" },
  "/projects/ruchi-lifescapes-indore-project": { location: "Jhalariya, Indore", configuration: "Villa plots" },
  "/projects/saatvikgreen-indore": { location: "Rahukhedi, Mangliya", configuration: "Residential & commercial plots" },
  "/projects/anand-vihar-indore": { location: "Morod, Indore", configuration: "Premium residential plots" },
  "/projects/oscar-fort-indore": { location: "Indore", configuration: "Residential plots" },
  "/projects/oscar-sanctuary-indore": { location: "Indore", configuration: "Residential plots" },
  "/projects/oscar-palace": { location: "Indore", configuration: "Premium residential plots" },
  "/projects/ruchi-enclave-indore": { location: "Indore", configuration: "Residential plots" },
  "/projects/lifescapes-bhopal": { location: "Bhopal, Madhya Pradesh", configuration: "2.5 & 3 BHK, row houses & shops" },
};

function projectUrl(project = {}) {
  if (project.url) return String(project.url).replace(/^https?:\/\/[^/]+/i, "").replace(/\/$/, "");
  if (project.slug) return `/projects/${String(project.slug).replace(/^\/+|\/+$/g, "")}`;
  return "";
}

function projectsForPage(config, items) {
  return config.projectUrls.map((url) => (
    items.find((project) => projectUrl(project) === url)
    || PROJECTS.find((project) => projectUrl(project) === url)
  )).filter(Boolean);
}

function comparisonValue(project, field) {
  const url = projectUrl(project);
  const facts = PROJECT_FACTS[url] || {};
  if (field === "location") return facts.location || project.city || "Contact project team";
  if (field === "configuration") return facts.configuration || project.configuration || (project.type === "Commercial" ? "Commercial spaces" : "Residential property");
  return project[field] || "Contact project team";
}

function SplitGradientHeading({ text, accentWords = 2 }) {
  const words = String(text || "").trim().split(/\s+/).filter(Boolean);
  const splitAt = Math.max(1, words.length - accentWords);
  const plain = words.slice(0, splitAt).join(" ");
  const accent = words.slice(splitAt).join(" ");
  return <>{plain}{plain && accent ? " " : ""}<span className="rr-grad">{accent}</span></>;
}

function LocalBlogCard({ blog }) {
  return (
    <article className="local-seo-blog-card">
      <Link to={`/blogs/${blog.slug}`} className="local-seo-blog-card__image" aria-label={`Read ${blog.title}`}>
        <RImg src={blog.img} alt={blog.imageAlt || blog.title} />
      </Link>
      <div className="local-seo-blog-card__body">
        <span>{blog.cat || "Real estate insights"}</span>
        <h3><Link to={`/blogs/${blog.slug}`}>{blog.title}</Link></h3>
        <p>{blog.excerpt}</p>
        <Link className="local-seo-text-link" to={`/blogs/${blog.slug}`}>Read article <span aria-hidden="true">&rarr;</span></Link>
      </div>
    </article>
  );
}

export default function LocalSeoPage() {
  const { pathname } = useLocation();
  const config = LOCAL_SEO_PAGES[pathname.replace(/\/$/, "") || "/"];
  const [items, setItems] = useState(PROJECTS);
  const [sent, setSent] = useState(false);
  const [leadName, setLeadName] = useState("");

  useEffect(() => {
    let active = true;
    if (window.RuchiBackend?.projects) {
      window.RuchiBackend.projects.getPublicProjects().then(({ data }) => {
        if (active && Array.isArray(data) && data.length) setItems(data);
      });
    }
    return () => { active = false; };
  }, []);

  const projects = config ? projectsForPage(config, items) : [];
  const blogs = config ? config.blogSlugs.map((slug) => BLOG.find((blog) => blog.slug === slug)).filter(Boolean) : [];
  const schemas = useMemo(() => {
    if (!config) return [];
    const listedProjects = projectsForPage(config, PROJECTS);
    return [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "@id": `${absoluteUrl(config.path)}#webpage`,
        name: config.heading,
        description: config.description,
        url: absoluteUrl(config.path),
        about: { "@type": "City", name: config.city },
        isPartOf: { "@id": `${absoluteUrl("/")}#website` },
        provider: { "@id": ORGANIZATION_ID },
      },
      {
        "@context": "https://schema.org",
        "@type": "ItemList",
        name: `${config.heading} available projects`,
        numberOfItems: listedProjects.length,
        itemListElement: listedProjects.map((project, index) => {
          const url = absoluteUrl(projectUrl(project));
          return {
            "@type": "ListItem",
            position: index + 1,
            url,
            item: {
              "@type": "Product",
              "@id": `${url}#product`,
              name: project.name || project.title,
              category: comparisonValue(project, "configuration"),
              url,
              image: absoluteUrl(project.img || project.image_url || "/assets/logo-h.webp"),
              brand: { "@id": ORGANIZATION_ID },
            },
          };
        }),
      },
      breadcrumbSchema([
        { name: "Home", url: "/" },
        { name: "Projects", url: "/projects" },
        { name: config.heading, url: config.path },
      ]),
      faqSchema(config.faqs),
    ];
  }, [config]);

  if (!config) return <Navigate to="/projects" replace />;

  const scrollToEnquiry = () => document.getElementById("enquire")?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <>
      <SEO title={config.title} description={config.description} canonical={absoluteUrl(config.path)} image={projects[0]?.img || projects[0]?.image_url || "/assets/projects/one-victoria.webp"} schemas={schemas} />
      <Nav onContact={scrollToEnquiry} solidAt={40} />
      <main className="local-seo-page">
        <header className="local-seo-hero">
          <div className="local-seo-hero__glow" aria-hidden="true" />
          <div className="rr-wrap local-seo-hero__inner">
            <nav className="local-seo-breadcrumb" aria-label="Breadcrumb"><Link to="/">Home</Link><span>/</span><Link to="/projects">Projects</Link><span>/</span><span>{config.city}</span></nav>
            <Reveal>
              <span className="eyebrow">{config.eyebrow}</span>
              <h1><SplitGradientHeading text={config.heading} /></h1>
              <p>{config.description}</p>
              <div className="local-seo-hero__actions">
                <a href="#available-projects" className="local-seo-button local-seo-button--primary">Explore projects</a>
                <button type="button" className="local-seo-button local-seo-button--ghost" onClick={scrollToEnquiry}>Enquire now</button>
              </div>
            </Reveal>
          </div>
        </header>

        <section className="section-pad local-seo-intro">
          <div className="rr-wrap local-seo-intro__grid">
            <Reveal>
              <span className="eyebrow">Local property guide</span>
              <h2><SplitGradientHeading text={config.introTitle} /></h2>
            </Reveal>
            <Reveal delay={80} className="local-seo-intro__copy">
              {config.intro.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <Link className="local-seo-text-link" to={`/projects#city=${config.city}`}>View the complete {config.city} project filter <span aria-hidden="true">&rarr;</span></Link>
            </Reveal>
          </div>
        </section>

        <section className="section-pad local-seo-projects" id="available-projects">
          <div className="rr-wrap">
            <Reveal>
              <div className="local-seo-section-head">
                <span className="eyebrow">Available developments</span>
                <h2>Projects to <span className="rr-grad">explore and compare</span></h2>
                <p>Open any project to review its detailed location, plans, amenities, RERA information where applicable, and enquiry options.</p>
              </div>
            </Reveal>
            <div className={`pgrid${projects.length === 1 ? " pgrid--single" : ""}`}>
              {projects.map((project, index) => (
                <Reveal key={projectUrl(project)} delay={(index % 3) * 70}>
                  <ProjectTile p={project} i={index} n={index} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad local-seo-benefits">
          <div className="rr-wrap">
            <Reveal><div className="local-seo-section-head"><span className="eyebrow">Location benefits</span><h2>What to consider in <span className="rr-grad">{config.city}</span></h2></div></Reveal>
            <div className="local-seo-benefits__grid">
              {config.benefits.map((benefit, index) => (
                <Reveal key={benefit.title} delay={index * 60} className="local-seo-benefit">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                  <h3>{benefit.title}</h3>
                  <p>{benefit.text}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad local-seo-comparison" aria-labelledby="project-comparison-heading">
          <div className="rr-wrap">
            <Reveal><div className="local-seo-section-head"><span className="eyebrow">At a glance</span><h2 id="project-comparison-heading">Project <span className="rr-grad">comparison</span></h2><p>Use this overview for initial shortlisting. Confirm current inventory, specifications and status with the relevant project team.</p></div></Reveal>
            <Reveal delay={80} className="local-seo-table-wrap">
              <table>
                <thead><tr><th>Project</th><th>Location</th><th>Property / configuration</th><th>Status</th><th><span className="sr-only">View project</span></th></tr></thead>
                <tbody>
                  {projects.map((project) => (
                    <tr key={`compare-${projectUrl(project)}`}>
                      <th scope="row">{project.name || project.title}</th>
                      <td>{comparisonValue(project, "location")}</td>
                      <td>{comparisonValue(project, "configuration")}</td>
                      <td><span className="local-seo-status">{project.status || "Contact project team"}</span></td>
                      <td><Link to={projectUrl(project)} aria-label={`View ${project.name || project.title}`}>View <span aria-hidden="true">&rarr;</span></Link></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </Reveal>
          </div>
        </section>

        <section className="section-pad local-seo-blogs">
          <div className="rr-wrap">
            <Reveal><div className="local-seo-section-head local-seo-section-head--split"><div><span className="eyebrow">Buyer resources</span><h2>Related <span className="rr-grad">real estate insights</span></h2></div><Link className="local-seo-text-link" to="/blogs">View all articles <span aria-hidden="true">&rarr;</span></Link></div></Reveal>
            <div className="local-seo-blogs__grid">
              {blogs.map((blog, index) => <Reveal key={blog.slug} delay={index * 70}><LocalBlogCard blog={blog} /></Reveal>)}
            </div>
          </div>
        </section>

        <section className="section-pad project-section project-faq local-seo-faq" id="faqs">
          <div className="rr-wrap">
            <div className="project-section__head">
              <span className="eyebrow">Frequently Asked Questions</span>
              <h2>{config.city} property <span className="rr-grad">questions answered</span></h2>
              <p className="project-section__description">Useful answers for comparing projects and planning your next step.</p>
            </div>
            <div className="project-faq__list">
              {config.faqs.map((item, index) => <details key={item.question} open={index === 0}><summary>{item.question}<span aria-hidden="true">+</span></summary><div><p>{item.answer}</p></div></details>)}
            </div>
          </div>
        </section>

        <section className="section-pad local-seo-enquiry" id="enquire">
          <div className="rr-wrap local-seo-enquiry__grid">
            <Reveal className="local-seo-enquiry__copy">
              <span className="eyebrow">Project enquiry</span>
              <h2><SplitGradientHeading text={config.ctaTitle} /></h2>
              <p>{config.ctaText}</p>
              <div className="local-seo-enquiry__contact"><a href="tel:+918929225275">Call +91 89292 25275</a><a href="https://wa.me/919630096112" target="_blank" rel="noopener noreferrer">WhatsApp our team</a></div>
            </Reveal>
            <Reveal delay={80} className="contact-card local-seo-enquiry__card">
              {sent ? <div className="contact-thanks"><h3>Thank you, {leadName.split(" ")[0] || "there"}</h3><p>Your enquiry has been received. The relevant project team will contact you shortly.</p></div> : <div className="contact-form"><LeadCaptureFlow source={`Local SEO page - ${config.path}`} leadAction="callback" buttonLabel="Request Project Details" purpose="local-seo" onVerified={({ form }) => { setLeadName(form.name); setSent(true); }} /></div>}
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
