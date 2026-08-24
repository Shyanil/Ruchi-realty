import { useState, useEffect, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Nav from "../components/Nav";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";
import { ProjectTile, cityOf } from "../components/ProjectsSection";
import SEO from "../components/SEO";
import { PROJECTS } from "../data/projects";
import { ORGANIZATION_ID, absoluteUrl, breadcrumbSchema, faqSchema } from "../data/structuredData";

const PP_CITIES = ["All", "Kolkata", "Indore", "Bhopal"];
const PP_STATUS = ["All", "Ready to Move", "Ongoing", "Upcoming"];
const PP_TYPES = ["All", "Residential", "Commercial", "Plotted Development", "Apartments"];
const PLOTTED_PROJECT_SLUGS = new Set([
  "oscar-indore",
  "oscar-pride-indore",
  "saatvik-vihar-indore",
  "ruchi-lifescapes-indore-project",
  "saatvikgreen-indore",
  "anand-vihar-indore",
  "oscar-fort-indore",
  "oscar-sanctuary-indore",
  "oscar-palace",
  "ruchi-enclave-indore",
  "ruchi-hills",
]);
const APARTMENT_PROJECT_SLUGS = new Set([
  "one-victoria-new-town",
  "one-prime-residential",
  "active-acres-angelica",
  "one-rajarhat",
  "active-greens",
]);

const PROJECTS_FAQS = [
  {
    question: "How can I find a Ruchi Realty project in my preferred city?",
    answer: "Use the city filters on this page to view Ruchi Realty projects in Kolkata, Indore or Bhopal, then open a project to review its location, status, amenities and enquiry options.",
  },
  {
    question: "What types of Ruchi Realty projects can I compare?",
    answer: "The portfolio includes residential apartments, plotted developments and commercial properties. Use the property-type filter to narrow the list to the kind of real estate you are considering.",
  },
  {
    question: "How do I find ready-to-move Ruchi Realty projects?",
    answer: "Select Ready to Move under the Status filter. The results will show projects currently listed in that category; confirm the latest unit or plot availability with the relevant project team.",
  },
  {
    question: "Where can I find a project's RERA number?",
    answer: "Open the relevant project detail page to view its RERA registration number when applicable and available. Buyers should also verify registration details on the official state RERA portal.",
  },
  {
    question: "How can I get project prices, plans and availability?",
    answer: "Open a project and submit its enquiry form. The project team will share current pricing, available configurations or plots, floor plans and site-visit options.",
  },
];

const LOCAL_PROJECT_GUIDES = [
  { to: "/projects/kolkata", label: "Projects in Kolkata", meta: "Residential & commercial" },
  { to: "/projects/indore", label: "Projects in Indore", meta: "Plotted communities" },
  { to: "/projects/bhopal", label: "Projects in Bhopal", meta: "Homes, row houses & shops" },
  { to: "/residential-projects-in-kolkata", label: "Residential projects in Kolkata", meta: "Compare apartment communities" },
  { to: "/plots-in-indore", label: "Plots in Indore", meta: "Compare plotted developments" },
  { to: "/commercial-property-in-kolkata", label: "Commercial property in Kolkata", meta: "Office & retail spaces" },
  { to: "/flats-in-new-town-kolkata", label: "Flats in New Town, Kolkata", meta: "One Victoria & One Prime" },
  { to: "/real-estate-developer-in-indore", label: "Ruchi Realty in Indore", meta: "Developer profile & projects" },
  { to: "/real-estate-developer-in-kolkata", label: "Ruchi Realty in Kolkata", meta: "Developer profile & projects" },
];

function projectSlug(project = {}) {
  const routeSlug = String(project.slug || project.url || "").replace(/^.*\/projects\//, "").replace(/^\/+|\/+$/g, "").toLowerCase();
  if (routeSlug) return routeSlug;
  return String(project.name || project.title || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function matchesPropertyType(project, selectedType) {
  if (selectedType === "All") return true;
  const broadType = String(project.type || "Residential").toLowerCase();
  if (selectedType === "Residential") return broadType === "residential";
  if (selectedType === "Commercial") return broadType === "commercial";
  const slug = projectSlug(project);
  const searchable = `${project.name || project.title || ""} ${project.description || ""} ${project.tag || ""}`.toLowerCase();
  if (selectedType === "Plotted Development") return PLOTTED_PROJECT_SLUGS.has(slug) || /\b(plotted|plots?|land)\b/.test(searchable);
  if (selectedType === "Apartments") return APARTMENT_PROJECT_SLUGS.has(slug) || /\b(apartments?|flats?|bhk)\b/.test(searchable);
  return true;
}

function ppHashFilter(hash = typeof location !== "undefined" ? location.hash : "") {
  const raw = hash.replace(/^#/, "");
  const q = new URLSearchParams(raw);
  const city = q.get("city"), status = q.get("status"), type = q.get("type");
  const selectedCity = PP_CITIES.includes(city) ? city : "All";
  return {
    city: selectedCity,
    status: PP_STATUS.includes(status) ? status : "All",
    type: PP_TYPES.includes(type) ? type : "All",
  };
}

function scrollToProjects() {
  const projects = document.getElementById("projects");
  if (!projects) return;
  const headerOffset = 80;
  window.scrollTo({
    top: projects.getBoundingClientRect().top + window.scrollY - headerOffset,
    behavior: "smooth",
  });
}

export default function ProjectsPage() {
  const routeLocation = useLocation();
  const navigate = useNavigate();
  const init = ppHashFilter(routeLocation.hash);
  const [city, setCity] = useState(init.city);
  const [status, setStatus] = useState(init.status);
  const [items, setItems] = useState(() => PROJECTS);
  const [type, setType] = useState(init.type);

  const updateFilters = ({ nextCity = city, nextStatus = status, nextType = type } = {}) => {
    setCity(nextCity);
    setStatus(nextStatus);
    setType(nextType);
    const params = new URLSearchParams();
    if (nextCity !== "All") params.set("city", nextCity);
    if (nextType !== "All") params.set("type", nextType);
    if (nextStatus !== "All") params.set("status", nextStatus);
    navigate(`/projects${params.size ? `#${params.toString()}` : ""}`, { replace: true });
  };
  const pickCity = (nextCity) => updateFilters({ nextCity });
  const pickStatus = (nextStatus) => updateFilters({ nextStatus });
  const pickType = (nextType) => updateFilters({ nextType });
  const clearFilters = () => updateFilters({ nextCity: "All", nextStatus: "All", nextType: "All" });

  useEffect(() => {
    let active = true;
    if (window.RuchiBackend?.projects) {
      window.RuchiBackend.projects.getPublicProjects().then(({ data }) => {
        if (active && Array.isArray(data) && data.length) setItems(data);
      });
    }
    return () => { active = false; };
  }, []);

  const pool = items.length ? items : PROJECTS;
  const list = pool.filter((p) =>
    (city === "All" || cityOf(p) === city) &&
    (status === "All" || p.status === status) &&
    matchesPropertyType(p, type));
  const projectSchemas = useMemo(() => [{
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ruchi Realty projects",
    numberOfItems: pool.filter((project) => project.url || project.slug).length,
    itemListElement: pool.filter((project) => project.url || project.slug).map((project, index) => {
      const url = absoluteUrl(project.url || `/projects/${project.slug}`);
      return {
        "@type": "ListItem",
        position: index + 1,
        url,
        item: {
          "@type": "Product",
          "@id": `${url}#product`,
          name: project.title || project.name,
          url,
          image: absoluteUrl(project.image_url || project.img || "/assets/logo-h.webp"),
          category: project.type || "Real estate development",
          brand: { "@id": ORGANIZATION_ID },
        },
      };
    }),
  }, breadcrumbSchema([
    { name: "Home", url: "/" },
    { name: "Projects", url: "/projects" },
  ]), faqSchema(PROJECTS_FAQS)], [pool]);

  useEffect(() => {
    const updated = ppHashFilter(routeLocation.hash);
    setCity(updated.city);
    setStatus(updated.status);
    setType(updated.type);
    if (routeLocation.hash) {
      const timer = window.setTimeout(scrollToProjects, 60);
      return () => window.clearTimeout(timer);
    }
  }, [routeLocation.hash]);

  const onContact = () => {
    if (window.smoothTo) window.smoothTo("#contact");
  };

  return (
    <>
      <SEO title="Real Estate Projects in Indore, Kolkata & Bhopal | Ruchi Realty" description="Explore residential apartments, commercial properties and plotted developments by Ruchi Realty across Indore, Kolkata and Bhopal. Filter by city, property type and project status." canonical="https://ruchirealty.com/projects" image="/assets/projects/one-victoria.webp" schemas={projectSchemas} />
      <Nav onContact={onContact} solidAt={60} />
      <main>
        <header className="pp-hero" data-screen-label="All Projects">
          <div className="pp-hero__sig" aria-hidden="true"></div>
          <div className="rr-wrap">
            <Reveal>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Our Projects</div>
              <h1 className="pp-head">Real Estate Projects Across Indore, Kolkata <span className="rr-grad">&amp; Bhopal</span></h1>
              <p className="pp-lead">
                Ruchi Realty was never just about building homes. It was always about creating better ways of living. Browse luxury apartments, residential plots and commercial spaces, from ready to move homes to upcoming launches.
              </p>
            </Reveal>
          </div>
        </header>

        <section className="pp-body section-pad" id="projects">
          <div className="rr-wrap">
            <Reveal>
              <div className="pp-filter-panel" aria-label="Project discovery filters">
                <div className="pp-filter-panel__head">
                  <div><span className="eyebrow">Find your project</span><h2>Project Discovery</h2></div>
                  <button type="button" className="pp-filter-clear" onClick={clearFilters} disabled={city === "All" && type === "All" && status === "All"}>Clear filters</button>
                </div>
                <div className="pp-filter-group">
                  <span className="pp-filter-label">City</span>
                  <div className="pp-filter-options" role="group" aria-label="Filter projects by city">
                    {PP_CITIES.map((option) => <button key={option} type="button" className={`pp-filter-chip ${city === option ? "is-active" : ""}`} aria-pressed={city === option} onClick={() => pickCity(option)}>{option}</button>)}
                  </div>
                </div>
                <div className="pp-filter-group">
                  <span className="pp-filter-label">Property type</span>
                  <div className="pp-filter-options" role="group" aria-label="Filter projects by property type">
                    {PP_TYPES.map((option) => <button key={option} type="button" className={`pp-filter-chip ${type === option ? "is-active" : ""}`} aria-pressed={type === option} onClick={() => pickType(option)}>{option === "All" ? "All types" : option}</button>)}
                  </div>
                </div>
                <div className="pp-filter-group">
                  <span className="pp-filter-label">Status</span>
                  <div className="pp-filter-options" role="group" aria-label="Filter projects by status">
                    {PP_STATUS.map((option) => <button key={option} type="button" className={`pp-filter-chip ${status === option ? "is-active" : ""}`} aria-pressed={status === option} onClick={() => pickStatus(option)}>{option === "All" ? "Any status" : option}</button>)}
                  </div>
                </div>
              </div>
              <div className="pp-results-summary" role="status"><strong>{list.length}</strong> {list.length === 1 ? "project" : "projects"} found{city !== "All" ? ` in ${city}` : ""}</div>
            </Reveal>
            <div className={`pgrid${list.length === 1 ? " pgrid--single" : ""}`} key={`${city}-${type}-${status}`}>
              {list.map((p, i) =>
                <Reveal key={`${p.name}-${p.city}-${i}`} delay={(i % 3) * 70}>
                  <ProjectTile p={p} i={i} n={i} />
                </Reveal>
              )}
            </div>
            {list.length === 0 ?
              <div className="pp-empty"><strong>No projects match these filters.</strong><span>Try another city, property type or status.</span><button type="button" onClick={clearFilters}>Show all projects</button></div> : null}
          </div>
        </section>

        <section className="section-pad local-guide-hub" aria-labelledby="local-project-guides-heading">
          <div className="rr-wrap">
            <Reveal>
              <div className="local-guide-hub__head">
                <span className="eyebrow">Explore by location</span>
                <h2 id="local-project-guides-heading">Local project guides</h2>
                <p>Compare Ruchi Realty developments by city, property type and local buying requirement.</p>
              </div>
            </Reveal>
            <div className="local-guide-hub__grid">
              {LOCAL_PROJECT_GUIDES.map((guide, index) => (
                <Reveal key={guide.to} delay={(index % 3) * 50}>
                  <Link to={guide.to}><span>{guide.meta}</span><strong>{guide.label}</strong><i aria-hidden="true">&rarr;</i></Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        <section className="section-pad project-section project-faq projects-index-faq" id="project-faqs">
          <div className="rr-wrap">
            <div className="project-section__head">
              <span className="eyebrow">Frequently Asked Questions</span>
              <h2>Find the right <span className="rr-grad">Ruchi Realty project</span></h2>
              <p className="project-section__description">Answers to common questions about exploring and comparing our real estate portfolio.</p>
            </div>
            <div className="project-faq__list">
              {PROJECTS_FAQS.map((item, index) => (
                <details key={item.question} open={index === 0}>
                  <summary>{item.question}<span aria-hidden="true">+</span></summary>
                  <div><p>{item.answer}</p></div>
                </details>
              ))}
            </div>
          </div>
        </section>

        <Contact />
      </main>
      <Footer />
    </>
  );
}
