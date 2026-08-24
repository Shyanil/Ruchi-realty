import { Link } from "react-router-dom";
import { CardArrow } from "./ProjectsSection";
import LeadCaptureFlow, { inferLeadCity } from "./LeadCaptureFlow";

function asset(src) { return !src || /^(https?:|data:|\/)/i.test(src) ? src : `/${src.replace(/^\.\//, "")}`; }

function LeadForm({ title, slug, location }) {
  return <div className="victoria-hero-form"><span className="eyebrow">Enquire now</span><h2>Find your place<br />at {title}</h2><p>Share your details for pricing, plans, and availability.</p><LeadCaptureFlow initialProject={title} initialCity={inferLeadCity(location, title, slug)} projectSlug={slug} source={`${title} hero enquiry`} leadAction="project_details" buttonLabel="Get Project Details" purpose="project-enquiry" projectLocked compact /></div>;
}

export default function ProjectSplitHero({ subpage, title, location, type = "Residential", slug, onBrochure }) {
  const name = subpage.heroTitle || title;
  const facts = subpage.overviewHighlights || [];
  return <><header className={`osc-hero victoria-hero project-hero--${slug}`} data-screen-label={name}><div className="osc-hero__bg"><picture>{subpage.heroMobileUrl ? <source media="(max-width: 640px)" srcSet={asset(subpage.heroMobileUrl)} /> : null}<img src={asset(subpage.heroBg)} alt={name} loading="eager" decoding="async" fetchpriority="high" /></picture></div><div className="osc-hero__overlay"/><div className="rr-wrap victoria-hero__form-wrap"><LeadForm title={name} slug={slug} location={location} /></div></header><section className="victoria-intro" id="project-details"><div className="rr-wrap victoria-intro__top"><div className="victoria-intro__identity">{subpage.heroLogo ? <img src={asset(subpage.heroLogo)} alt={`${name} logo`} loading="lazy" decoding="async" /> : null}<div><span className="eyebrow">{type}</span><h1>{name}</h1><p>{location}</p><strong>{subpage.heroTagline}</strong></div></div><div className="victoria-intro__actions"><Link className="ab-btn-outline ab-btn-outline--white" to="/projects">More Projects<CardArrow /></Link><button className="submit-btn victoria-intro__brochure" type="button" onClick={onBrochure}>Download Brochure<CardArrow /></button></div></div><div className="rr-wrap victoria-intro__facts">{facts.map((fact,index)=><div className="victoria-fact" key={fact.label || index}><span>{String(index+1).padStart(2,"0")}</span><div><small>{fact.label}</small><strong>{fact.desc}</strong></div></div>)}</div></section></>;
}
