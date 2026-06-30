import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal, RImg } from "../components/shared";

const LEDGER_ITEMS = [
  {
    no: "01",
    title: "Environmental Sustainability",
    desc: "Integrating green spaces, eco-friendly materials, and energy efficiency to build responsibly for future generations. We prioritize low-impact construction footprints and water recycling systems.",
    img: "assets/projects/one-rajarhat.webp"
  },
  {
    no: "02",
    title: "Innovative Designs",
    desc: "Crafting modern layouts, spatial flow optimization, and architectural elegance that redefine contemporary living. Our designs focus on maximum natural light ventilation and modular flexibility.",
    img: "assets/projects/one-victoria.webp"
  },
  {
    no: "03",
    title: "Customer Satisfaction",
    desc: "Fostering absolute transparency, customer-first service, and lifelong support. We establish direct communication channels and active post-handover support teams to keep you covered.",
    img: "assets/projects/active-acres.webp"
  },
  {
    no: "04",
    title: "Timely Completion",
    desc: "Strict adherence to project timelines and rigorous phase planning. We manage milestones transparently, ensuring key handovers are met exactly as scheduled.",
    img: "uploads/hero-active-acres.webp"
  },
  {
    no: "05",
    title: "Quality Construction",
    desc: "Sourcing premium raw materials and conducting multi-stage engineering audits. From structural steel to finishing joints, our audits ensure unmatched structural integrity.",
    img: "assets/projects/oscar-fort.webp"
  }
];

const ABOUT_PROJECTS = {
  Kolkata: [
    { name: "Active Acres", desc: "G+23 stories across 6 high-rise towers within a 16.37-acre area.", status: "Completed", img: "assets/projects/active-acres.webp" },
    { name: "Active Green", desc: "Luxury apartments near ITC Sonar, off E.M. Bypass.", status: "Completed", img: "assets/projects/active-green.webp" },
    { name: "Angelica Tower", desc: "Modern apartments at D.C. Dey Road, Tangra.", status: "Ongoing", img: "assets/projects/active-acres.webp" },
    { name: "Active Business Park", desc: "Commercial complex over 2.25 lakh sq. ft.", status: "Completed", img: "assets/projects/active-business-park.webp" },
    { name: "One Rajarhat", desc: "G+23 stories across 3 high-rise towers in New Town.", status: "Completed", img: "assets/projects/one-rajarhat.webp" },
    { name: "One Prime", desc: "Mixed-use apartments in New Town.", status: "Ongoing", img: "assets/projects/one-prime.webp" },
    { name: "One Victoria", desc: "Ultra-luxury 3 & 4 BHK apartments at Action Area-1, New Town.", status: "Ongoing", img: "assets/projects/one-victoria.webp" }
  ],
  Indore: [
    { name: "Oscar The Billionaire\u2019s Destination", desc: "Ultra-premium luxury plotted development on 24 acres.", status: "Completed", img: "assets/projects/oscar-billionaires.webp" },
    { name: "Oscar Pride", desc: "Ultra-premium luxury plots across 8 acres.", status: "Completed", img: "assets/projects/oscar-pride.webp" },
    { name: "Oscar Fort", desc: "A leisure-focused premium development designed around dreams and happiness.", status: "Completed", img: "assets/projects/oscar-fort.webp" },
    { name: "Oscar Palace", desc: "Royal-themed project designed like a majestic kingdom palace.", status: "Ongoing", img: "assets/projects/oscar-palace.webp" },
    { name: "Oscar Sanctuary", desc: "Nature-themed residential plotting project with rivers, hills, gardens, and micro forests.", status: "Upcoming", img: "assets/projects/oscar-sanctuary.webp" },
    { name: "Ruchi Lifescapes", desc: "Luxury plots spanning 73 acres with 700 plots.", status: "Completed", img: "assets/projects/ruchi-lifescapes-indore.webp" },
    { name: "Ruchi Enclave", desc: "Residential plotting project near Bypass Road.", status: "Completed", img: "assets/projects/ruchi-enclave.webp" },
    { name: "Saatvik Vihar", desc: "Luxury plots across 31 acres with 698 plots.", status: "Completed", img: "assets/projects/saatvik-vihar.webp" },
    { name: "Saatvik Green", desc: "Premium plotting project across 28 acres.", status: "Ongoing", img: "assets/projects/saatvik-green.webp" },
    { name: "Anand Vihar", desc: "Premium plotting project with 900 plots.", status: "Completed", img: "assets/projects/anand-vihar.webp" }
  ],
  Bhopal: [
    { name: "Ruchi Lifescapes", desc: "Mixed-use township on Hoshangabad Road with plots, duplexes, villas, and apartments across 85 acres.", status: "Completed", img: "assets/projects/ruchi-lifescapes-bhopal.webp" }
  ]
};

const TEAM_MEMBERS = [
  {
    name: "Mr. Manish Shahra",
    role: "Managing Director",
    img: "uploads/manish-shahra.webp",
    bio: "Industrial Production Engineering graduate with a Master\u2019s in Management from IMS Indore. He brings vast experience across agri-commodities, edible oils, dairy, real estate, wind energy, infrastructure, power, mining, housing development, and international trade.",
    fullBio: "Mr. Manish Shahra is the Managing Director of Ruchi Realty. He holds a degree in Industrial Production Engineering and a Master's in Management from IMS Indore. Over the past few decades, he has spearheaded the diversification of the Ruchi Group into real estate, infrastructure, green wind energy, power generation, mining, and international trade. His visionary leadership has been the driving force behind the company's expansion into tier-1 and tier-2 Indian cities, establishing Ruchi Realty as a pioneer in quality housing and integrated townships."
  },
  {
    name: "Mr. Rishabh Mahajan",
    role: "Executive Director",
    img: "uploads/rishabh-mahajan.webp",
    bio: "A Chartered Accountant with deep experience in finance and commercial operations. He has played an instrumental role in the growth of Ruchi Realty and its expansion across multiple locations in India.",
    fullBio: "Mr. Rishabh Mahajan serves as Executive Director at Ruchi Realty. A qualified Chartered Accountant, he oversees corporate finance, commercial operations, and legal compliance. Mr. Mahajan has been key to establishing robust financial controls and raising capital for various residential and commercial flagships. Under his stewardship, the company has completed projects with tight financial discipline and optimized handovers, building a solid foundation of trust with institutional partners and homeowners alike."
  },
  {
    name: "Ms. Sonakshi Shahra",
    role: "Executive Director",
    img: "uploads/sonakshi-shahra.webp",
    bio: "A new-generation real estate leader with a Bachelor\u2019s degree in Real Estate from New York University and a Master\u2019s degree from ISB Hyderabad. She brings global education, strategic thinking, and a strong understanding of modern real estate markets.",
    fullBio: "Ms. Sonakshi Shahra brings global expertise and new-age strategy to Ruchi Realty. She completed her Bachelor's degree in Real Estate at New York University (NYU) and earned her Master's degree from the Indian School of Business (ISB), Hyderabad. At Ruchi Realty, Ms. Shahra leads project strategy, corporate communications, and digital transformation. She is dedicated to bringing architectural innovation, customer-centric software tools, and sustainable building systems to all upcoming residential developments, aligning the brand with global luxury standards."
  },
  {
    name: "Mr. Nimishek Ved",
    role: "Director",
    img: "uploads/nimishek-ved.webp",
    bio: "A Chartered Accountant and all-India rank holder with more than 24 years of experience across infrastructure, dairy, real estate, telecom, mergers and acquisitions, transaction advisory, IBC matters, and business strategy.",
    fullBio: "Mr. Nimishek Ved is a Director at Ruchi Realty. He is an all-India rank holder Chartered Accountant with a distinguished career of over 24 years. His extensive background spans corporate restructuring, transaction advisory, mergers and acquisitions, telecommunications, and strategic business planning. His legal and strategic insights guide Ruchi Realty's corporate governance, joint ventures, and long-term land acquisition policies, steering the organization through responsible, risk-managed expansion."
  },
  {
    name: "Mr. Niroj Mishra",
    role: "Chief Executive Officer",
    img: "uploads/niroj-mishra.webp",
    bio: "A certified business assessor and civil engineering professional with around 21 years of experience across business development, construction management, project management, contract management, marketing, sales, safety, quality, and operations.",
    fullBio: "Mr. Niroj Mishra is the Chief Executive Officer (CEO) of Ruchi Realty. A civil engineering professional and certified business assessor, he holds more than 21 years of experience in real estate and infrastructure development. He leads the operational machinery of the firm, supervising everything from architectural feasibility studies and raw material audits to site safety, contract administration, and sales execution. His disciplined approach ensures that projects meet rigorous quality benchmarks and safety standard protocols."
  },
  {
    name: "Mr. Akshay Chandre",
    role: "Asst. V.P. Sales, Marketing & CRM",
    img: "uploads/akshay-chandre.webp",
    bio: "A real estate professional with over 20 years of expertise in sales, marketing, business strategy, and CRM across residential, commercial, retail, and plotted developments. He has worked with leading brands including Mahindra Lifespaces and Tata Realty.",
    fullBio: "Mr. Akshay Chandre leads the Sales, Marketing, and Customer Relationship Management (CRM) divisions at Ruchi Realty. With over 20 years of hands-on expertise in the real estate sector, he has previously managed portfolios for prominent developers including Tata Realty and Mahindra Lifespaces. Mr. Chandre focuses on aligning sales strategies with customer expectations and establishing premium post-possession support teams, ensuring that Ruchi Realty's dedication to buyers is felt long after the keys are delivered."
  }
];

function AboutHero() {
  return (
    <header className="ab-hero" data-screen-label="About us">
      <div className="ab-hero__sig" aria-hidden="true"></div>
      <div className="rr-wrap ab-hero__grid">
        <Reveal>
          <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>About Us</div>
          <h1 className="ab-hero__title">
            About<br /><span className="rr-grad">Ruchi Realty</span>
          </h1>
          <p className="ab-hero__lead">
            Building trust through landmark spaces across India.
          </p>
        </Reveal>
      </div>
    </header>
  );
}

function AboutLegacy() {
  return (
    <section className="ab-legacy section-pad" id="legacy">
      <div className="rr-wrap">
        <div className="ab-legacy__grid">
          <div className="ab-legacy__left">
            <Reveal>
              <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>LEGACY</div>
              <h2 className="ab-legacy__title">
                Trusted legacy of engineering excellence
              </h2>
              <p className="ab-legacy__intro">
                Welcome to Ruchi Realty, where excellence in real estate meets a commitment to crafting exceptional spaces. For over 17 years, the company has developed, managed, and sold residential, commercial, and retail properties across India.
              </p>
              <p className="ab-legacy__body">
                Founded in 2008, Ruchi Realty has built a strong presence through modern design, superior construction quality, thoughtful amenities, and a customer-first approach. The company\u2019s portfolio spans Kolkata, Indore, and Bhopal, with landmark projects across apartments, townships, commercial spaces, and plotted developments.
              </p>
            </Reveal>
          </div>

          <div className="ab-legacy__right">
            <Reveal delay={80} className="ab-legacy__media-container">
              <div className="ab-legacy__media-stack">
                <img className="ab-legacy__stack-img ab-legacy__stack-img--base" src="assets/projects/one-victoria.webp" alt="One Victoria" />
                <img className="ab-legacy__stack-img ab-legacy__stack-img--1" src="uploads/hero-active-acres.webp" alt="Active Acres Concept" />
                <img className="ab-legacy__stack-img ab-legacy__stack-img--2" src="assets/projects/active-acres.webp" alt="Active Acres Realized" />

                <div className="ab-legacy__stats-glass">
                  <div className="ab-glass-stat">
                    <span className="ab-glass-stat__val">17+</span>
                    <span className="ab-glass-stat__lbl">Years of Real Estate Expertise</span>
                  </div>
                  <div className="ab-glass-stat">
                    <span className="ab-glass-stat__val">3</span>
                    <span className="ab-glass-stat__lbl">Key Indian Cities</span>
                  </div>
                  <div className="ab-glass-stat">
                    <span className="ab-glass-stat__val">40+</span>
                    <span className="ab-glass-stat__lbl">Landmark Addresses Delivered</span>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function AboutPhilosophy() {
  const [activeLedger, setActiveLedger] = useState(0);

  return (
    <section className="ab-philosophy section-pad" id="philosophy">
      <div className="rr-wrap">
        <div className="ab-philosophy__header">
          <Reveal>
            <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>PHILOSOPHY</div>
            <h2 className="ab-philosophy__title">
              A philosophy built on trust, quality, and responsible growth
            </h2>
            <p className="ab-philosophy__lead">
              Ruchi Realty believes in ethical trade practices, high-quality residences, innovation, timely delivery, and a deeply customer-centric approach.
            </p>
          </Reveal>
        </div>

        <div className="ab-philosophy__split">
          <Reveal className="ab-philosophy__image-panel">
            {LEDGER_ITEMS.map((item, idx) => (
              <img
                key={idx}
                src={item.img}
                alt={item.title}
                className={`ab-philosophy__panel-img ${activeLedger === idx ? "is-visible" : ""}`}
              />
            ))}
            <div className="ab-philosophy__image-overlay"></div>
            <div className="ab-philosophy__image-caption">
              <span>{LEDGER_ITEMS[activeLedger].title}</span>
              <p>Designing and constructing around values, sustainability, and long-term asset value.</p>
            </div>
          </Reveal>

          <Reveal delay={120} className="ab-philosophy__ledger">
            {LEDGER_ITEMS.map((item, index) => {
              const isOpen = activeLedger === index;
              return (
                <div key={index}
                  className={`ab-ledger-item ${isOpen ? "is-active" : ""}`}
                  onMouseEnter={() => setActiveLedger(index)}
                  onClick={() => setActiveLedger(index)}>
                  <div className="ab-ledger-item__header">
                    <span className="ab-ledger-item__no">{item.no}</span>
                    <h3 className="ab-ledger-item__title">{item.title}</h3>
                    <span className="ab-ledger-item__indicator"></span>
                  </div>
                  <div className="ab-ledger-item__body">
                    <p className="ab-ledger-item__desc">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AboutVisionMission() {
  return (
    <section className="ab-vm section-pad" id="vision-mission">
      <div className="rr-wrap">
        <div className="ab-vm__grid">
          <Reveal className="ab-vm-card ab-vm-card--dark">
            <div className="ab-vm-card__bg" style={{ backgroundImage: "url('uploads/hero-active-acres.webp')" }}></div>
            <div className="ab-vm-card__overlay"></div>
            <div className="ab-vm-card__content">
              <div className="ab-vm-card__eyebrow">MISSION</div>
              <h3 className="ab-vm-card__title">Empowering lives through exceptional spaces</h3>
              <p className="ab-vm-card__text">
                Ruchi Realty is dedicated to crafting residential, commercial, and mixed-use projects that redefine modern living. With a legacy built on over 17 years of expertise and dedication, the company aims to exceed expectations, foster healthy communities, and create environments where contentment flourishes.
              </p>
              <blockquote className="ab-vm-card__quote">
                &ldquo;To build real estate marvels across residential and commercial developments while setting new standards in quality and architectural excellence.&rdquo;
              </blockquote>
            </div>
          </Reveal>

          <Reveal className="ab-vm-card ab-vm-card--light" delay={120}>
            <div className="ab-vm-card__bg" style={{ backgroundImage: "url('assets/projects/one-rajarhat.webp')" }}></div>
            <div className="ab-vm-card__overlay"></div>
            <div className="ab-vm-card__content">
              <div className="ab-vm-card__eyebrow">VISION</div>
              <h3 className="ab-vm-card__title">To lead tomorrow together</h3>
              <p className="ab-vm-card__text">
                Transforming the real estate landscape with innovation, sustainability, and excellence, crafting spaces where joy and vibrancy thrive.
              </p>
              <blockquote className="ab-vm-card__quote">
                &ldquo;To contribute significantly to building a stronger nation and become the country\u2019s trusted real estate company.&rdquo;
              </blockquote>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function AboutProjects() {
  const [city, setCity] = useState("Kolkata");
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const activeProjects = ABOUT_PROJECTS[city];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setActiveIdx(0);
  }, [city]);

  const next = () => {
    setActiveIdx((prev) => (prev + 1) % activeProjects.length);
  };

  const prev = () => {
    setActiveIdx((prev) => (prev - 1 + activeProjects.length) % activeProjects.length);
  };

  const cardWidth = isMobile ? 280 : 370;
  const gap = isMobile ? 20 : 28;
  const step = cardWidth + gap;
  const trackTransform = `translateX(-${activeIdx * step}px)`;

  return (
    <section className="ab-projects section-pad" id="footprint">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head sec-head--dark ab-projects__header">
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>FOOTPRINT</div>
              <h2 className="ab-projects__title">Landmark addresses,<br /><span className="rr-grad">across key cities.</span></h2>
            </div>
            <p className="ab-projects__lead">
              Ruchi Realty\u2019s portfolio includes landmark residential towers, commercial spaces, plotted developments, and townships across major Indian cities.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <div className="ab-tabs" role="tablist" aria-label="Projects by city">
            {Object.keys(ABOUT_PROJECTS).map((c) => (
              <button key={c} role="tab" type="button" aria-selected={city === c}
                className={`ab-tab ${city === c ? "is-active" : ""}`} onClick={() => setCity(c)}>
                {c} <span className="ab-tab__count">{ABOUT_PROJECTS[c].length}</span>
              </button>
            ))}
          </div>
        </Reveal>
      </div>

      <div className="projects__sig ab-projects__sig" aria-hidden="true"></div>

      <div className="ab-flat-slider" key={city}>
        <div className="ab-flat-viewport">
          <div className="ab-flat-track" style={{ transform: trackTransform }}>
            {activeProjects.map((p, i) => {
              const isActive = i === activeIdx;
              const statusSlug = p.status.toLowerCase().replace(/\s+/g, '-');
              return (
                <div
                  key={`${p.name}-${i}`}
                  className={`ab-proj-tile ab-proj-tile--flat ${isActive ? "is-active" : ""}`}
                  onClick={() => setActiveIdx(i)}>
                  <div className="ab-proj-tile__media">
                    <RImg src={p.img} alt={p.name} className="ab-proj-tile__img" />
                    <div className="ab-proj-tile__shade"></div>
                    <div className="ab-proj-tile__top">
                      <span className="ab-proj-tile__city">{city}</span>
                      <span className={`ab-proj-tile__status ab-proj-tile__status--${statusSlug}`}>
                        {p.status}
                      </span>
                    </div>
                    <span className="ab-proj-tile__idx">{String(i + 1).padStart(2, "0")}</span>
                    <div className="ab-proj-tile__content">
                      <h3 className="ab-proj-tile__name">{p.name}</h3>
                      <p className="ab-proj-tile__desc">{p.desc}</p>
                      <span className="ab-proj-tile__view">Select address <span className="ar">\u2192</span></span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {activeProjects.length > 1 && (
            <>
              <button type="button" className="ab-flat-arrow ab-flat-arrow--prev" onClick={prev} aria-label="Previous Project">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
                </svg>
              </button>
              <button type="button" className="ab-flat-arrow ab-flat-arrow--next" onClick={next} aria-label="Next Project">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </button>
            </>
          )}
        </div>

        {activeProjects.length > 1 && (
          <div className="ab-flat-dots">
            {activeProjects.map((_, i) => (
              <button
                key={i}
                type="button"
                className={`ab-flat-dot ${activeIdx === i ? "is-active" : ""}`}
                onClick={() => setActiveIdx(i)}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        )}

        <div className="ab-projects__footer">
          <span className="ab-projects__hint">
            Showing {activeIdx + 1} of {activeProjects.length} {activeProjects.length === 1 ? "address" : "addresses"} in {city}
          </span>
          <a className="projects__allbtn ab-projects__allbtn" href={`/projects?city=${city}`}>
            View All Projects<span className="ar">\u2192</span>
          </a>
        </div>
      </div>
    </section>
  );
}

function TeamModal({ member, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKeyDown);
    document.body.classList.add("nav-locked");
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.classList.remove("nav-locked");
    };
  }, [onClose]);

  const stopProp = (e) => e.stopPropagation();

  return (
    <div className="ab-modal-overlay" onClick={onClose}>
      <div className="ab-modal" onClick={stopProp}>
        <button type="button" className="ab-modal__close" onClick={onClose} aria-label="Close modal">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <div className="ab-modal__layout">
          <div className="ab-modal__media">
            <img src={member.img} alt={member.name} className="ab-modal__img" />
          </div>
          <div className="ab-modal__content">
            <span className="ab-modal__role">{member.role}</span>
            <h3 className="ab-modal__name">{member.name}</h3>
            <div className="ab-modal__body">
              <p>{member.fullBio}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AboutTeam() {
  const [selectedMember, setSelectedMember] = useState(null);

  return (
    <section className="ab-team section-pad" id="team">
      <div className="rr-wrap">
        <div className="ab-team__header">
          <Reveal>
            <div className="eyebrow" style={{ color: "var(--rr-indigo)", marginBottom: "16px" }}>LEADERSHIP</div>
            <h2 className="ab-team__title">Meet the people shaping Ruchi Realty</h2>
            <p className="ab-team__lead">
              Our leaders don\u2019t just plan and strategize. They bring the expertise, discipline, and vision to execute landmark developments with consistency and care.
            </p>
          </Reveal>
        </div>

        <div className="ab-team-grid">
          {TEAM_MEMBERS.map((m, i) => (
            <Reveal key={m.name} delay={i * 80} className="ab-team-card">
              <div className="ab-team-card__media">
                <img src={m.img} alt={m.name} className="ab-team-card__img" />
              </div>
              <div className="ab-team-card__content">
                <h3 className="ab-team-card__name">{m.name}</h3>
                <span className="ab-team-card__role">{m.role}</span>
                <p className="ab-team-card__bio">{m.bio}</p>
                <button type="button" className="ab-team-card__btn" onClick={() => setSelectedMember(m)}>
                  Read Full Bio <span className="ar">\u2192</span>
                </button>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {selectedMember && (
        <TeamModal member={selectedMember} onClose={() => setSelectedMember(null)} />
      )}
    </section>
  );
}

function AboutCTA() {
  const onExplore = (e) => {
    e.preventDefault();
    if (window.smoothTo) window.smoothTo("#footprint");
  };
  const onContact = (e) => {
    e.preventDefault();
    if (window.smoothTo) window.smoothTo("#contact");
  };

  return (
    <section className="ab-cta">
      <div className="ab-cta__bg" style={{ backgroundImage: "url('assets/projects/one-victoria.webp')" }}></div>
      <div className="ab-cta__overlay"></div>
      <div className="rr-wrap ab-cta__wrap">
        <Reveal className="ab-cta__content">
          <h2 className="ab-cta__title">Let\u2019s build your next address with confidence.</h2>
          <p className="ab-cta__lead">
            Explore Ruchi Realty\u2019s landmark developments across Kolkata, Indore, and Bhopal \u2014 crafted with engineering excellence, thoughtful design, and long-term value.
          </p>
          <div className="ab-cta__buttons">
            <a href="#footprint" className="submit-btn" onClick={onExplore} style={{ background: "var(--rr-lime)", color: "var(--rr-ink)" }}>
              Explore Projects <span className="ar">\u2192</span>
            </a>
            <a href="#contact" className="ab-btn-outline" onClick={onContact} style={{ color: "#fff", borderColor: "rgba(255,255,255,0.4)" }}>
              Contact Us <span className="ar">\u2192</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default function AboutPage() {
  const onContact = () => {
    if (window.smoothTo) window.smoothTo("#contact");
  };

  return (
    <>
      <Nav onContact={onContact} />
      <main>
        <AboutHero />
        <AboutLegacy />
        <AboutPhilosophy />
        <AboutVisionMission />
        <AboutProjects />
        <AboutTeam />
      </main>
      <Footer />
    </>
  );
}
