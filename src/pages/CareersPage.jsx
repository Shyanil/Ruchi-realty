import { useState, useEffect } from "react";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";

const JOBS = [
  {
    slug: "technical-head",
    title: "Technical Head",
    dept: "Civil Engineering",
    type: "Full-time",
    desc: "Lead civil engineering execution, site coordination, construction quality, and project delivery.",
    dropdownVal: "Technical Head \u2014 Civil Engineering",
    overview: "We are looking for an experienced Technical Head to lead our civil engineering division. You will supervise project execution, quality control, site coordination, and structural compliance across our active construction sites.",
    responsibilities: [
      "Supervise construction milestones, contractor execution, and material delivery schedules.",
      "Review structural designs, blueprints, and ensure high engineering standards are met.",
      "Perform regular site quality audits and safety checks.",
      "Coordinate with architects, structural consultants, and government inspectors.",
      "Manage engineering budget and resolve technical challenges on-site."
    ],
    requirements: [
      "Bachelor's or Master's degree in Civil Engineering.",
      "10+ years of hands-on experience in real estate project construction.",
      "Strong leadership, structural blueprint interpretation, and project management skills.",
      "Experience with high-rise structures is highly preferred."
    ]
  },
  {
    slug: "telecaller",
    title: "Telecaller",
    dept: "Customer Support",
    type: "Full-time",
    desc: "Handle customer calls, project enquiries, follow-ups, site visit coordination, and support the sales team.",
    dropdownVal: "Telecaller \u2014 Customer Support",
    overview: "Join our customer relationship team to handle incoming project enquiries, follow-ups, and coordinate customer site visits. You are the first point of contact for our potential homebuyers.",
    responsibilities: [
      "Handle customer enquiries received through digital campaigns and website forms.",
      "Explain project configurations, pricing, and locations clearly.",
      "Coordinate with the sales team to schedule site viewings.",
      "Maintain customer status records in CRM software.",
      "Follow up with leads politely to assist in their purchase journey."
    ],
    requirements: [
      "Excellent verbal communication skills in English and Hindi (Bengali is a plus).",
      "1-3 years of telecalling or customer relationship experience.",
      "Basic computer skills and familiarity with CRM tools.",
      "Polite, patient, and customer-centric attitude."
    ]
  },
  {
    slug: "sales-manager",
    title: "Sales Manager",
    dept: "Sales",
    type: "Full-time",
    desc: "Lead sales conversations, manage client relationships, coordinate site visits, and support business growth.",
    dropdownVal: "Sales Manager \u2014 Sales",
    overview: "Lead our sales efforts by conducting site presentations, negotiating terms, and guiding homebuyers through booking procedures.",
    responsibilities: [
      "Conduct premium face-to-face site presentations and guide prospective buyers.",
      "Negotiate pricing terms within company guidelines to close sales.",
      "Build and maintain long-term relationships with real estate brokers.",
      "Coordinate with the billing and CRM teams for booking documentation.",
      "Meet monthly and quarterly sales targets."
    ],
    requirements: [
      "MBA in Marketing or equivalent degree.",
      "5+ years of experience in residential/commercial real estate sales.",
      "Strong negotiation, communication, and relationship-building skills.",
      "Proven track record of high-ticket real estate closures."
    ]
  },
  {
    slug: "sales-executive",
    title: "Sales Executive",
    dept: "Sales",
    type: "Full-time",
    desc: "Assist customers with property enquiries, explain project details, follow up with leads, and support conversions.",
    dropdownVal: "Sales Executive \u2014 Sales",
    overview: "Assist homebuyers during site visits, provide project information, and support Sales Managers in closing bookings.",
    responsibilities: [
      "Welcome walk-in clients and explain housing layout specifications.",
      "Accompany buyers during physical site viewings.",
      "Follow up with prospective leads via calls and emails.",
      "Assist in organizing customer property booking files.",
      "Support marketing activities and broker meets."
    ],
    requirements: [
      "Bachelor's degree in any field.",
      "1-3 years of experience in real estate sales or customer service.",
      "High energy, excellent communication, and client presentation skills.",
      "Enthusiastic about real estate and customer interaction."
    ]
  },
  {
    slug: "open-application",
    title: "Open Application",
    dept: "Other",
    type: "Future Opportunity",
    desc: "Send your profile for future opportunities across engineering, sales, CRM, operations, and administration.",
    dropdownVal: "Open Application \u2014 Other",
    overview: "Don't see an open role that matches your profile? Submit your resume here. We are always looking for talented individuals across project planning, operations, design, finance, and CRM.",
    responsibilities: [
      "Collaborate with different departments depending on matching profiles.",
      "Participate in training sessions and take ownership of tasks.",
      "Bring fresh ideas and digital capabilities to Ruchi Realty."
    ],
    requirements: [
      "Passion for real estate development and urban planning.",
      "Relevant educational qualifications depending on the department.",
      "Highly self-motivated and team-oriented."
    ]
  }
];

function CareersHero({ onApply }) {
  const scrollPositions = () => {
    const el = document.querySelector("#open-roles");
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 80, behavior: "smooth" });
  };

  return (
    <section className="cr-hero">
      <div className="rr-wrap cr-hero__wrap">
        <div className="cr-hero__content">
          <Reveal>
            <div className="cr-hero__badge">CAREERS AT RUCHI REALTY</div>
            <h1 className="cr-hero__title">Build landmarks. Grow with purpose.</h1>
            <p className="cr-hero__lead">
              Join a team that shapes residential, commercial, and plotted developments across India with engineering excellence, thoughtful planning, and a culture built on learning.
            </p>
            <div className="cr-hero__ctas">
              <button type="button" className="submit-btn" onClick={scrollPositions} style={{ background: "var(--rr-indigo)", color: "#fff" }}>
                View Open Roles
              </button>
              <button type="button" className="ab-btn-outline" onClick={onApply}>
                Apply Now
              </button>
            </div>
          </Reveal>
        </div>

        <div className="cr-hero__collage">
          <Reveal>
            <div className="cr-collage__card cr-collage__card--main">
              <img src="uploads/careers_hero_main.png" alt="Luxury Residential Tower" />
              <div className="cr-collage__chip cr-collage__chip--top">
                <span className="num">17+</span>
                <span className="lbl">Years</span>
              </div>
            </div>

            <div className="cr-collage__card cr-collage__card--team">
              <img src="uploads/careers_hero_team.png" alt="Team Planning Session" />
              <div className="cr-collage__chip cr-collage__chip--bottom">
                <span className="num">3</span>
                <span className="lbl">Key Cities</span>
              </div>
            </div>

            <div className="cr-collage__card cr-collage__card--comm">
              <img src="uploads/careers_hero_commercial.png" alt="Commercial Development" />
              <div className="cr-collage__chip cr-collage__chip--side">
                <span className="lbl">Real Estate Careers</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

function CareersCulture() {
  return (
    <section className="cr-culture section-pad">
      <div className="rr-wrap">
        <div className="cr-culture__grid">
          <div className="cr-culture__text">
            <Reveal>
              <div className="eyebrow">WORK CULTURE</div>
              <h2 className="cr-culture__title">A culture that focuses on learning, ownership, and excellence.</h2>
              <p className="cr-culture__lead">
                At Ruchi Realty, careers are built through responsibility, collaboration, and the opportunity to work on meaningful real estate developments. We value people who are curious, disciplined, customer-focused, and ready to grow with every project they touch.
              </p>

              <div className="cr-culture__quote-card">
                <p className="cr-culture__quote">
                  \u201cGreat spaces are built by people who keep learning, keep improving, and take pride in every detail.\u201d
                </p>
              </div>
            </Reveal>
          </div>

          <div className="cr-culture__media">
            <Reveal>
              <div className="cr-culture__img-wrap">
                <img src="uploads/careers_culture.png" alt="Indian Real Estate Project Team" className="cr-culture__img" />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

function CareersPositions({ jobs, onSelectJob }) {
  return (
    <section className="cr-positions section-pad" id="open-roles">
      <div className="rr-wrap">
        <div className="cr-positions__header">
          <Reveal>
            <div className="eyebrow" style={{ color: "var(--rr-indigo)" }}>OPEN POSITIONS</div>
            <h2 className="cr-positions__title">Current opportunities</h2>
            <p className="cr-positions__lead">
              Explore current openings at Ruchi Realty. Click on a position to view detailed job descriptions, responsibilities, and requirements.
            </p>
          </Reveal>
        </div>

        <div className="cr-positions__grid">
          {jobs.map((job) => (
            <div className="cr-job-card" key={job.title} onClick={() => onSelectJob(job)} style={{ cursor: "pointer" }}>
              <Reveal>
                <div className="cr-job-card__meta">
                  <span className="cr-job-card__dept">{job.dept}</span>
                  <span className="cr-job-card__type">{job.type}</span>
                </div>
                <h3 className="cr-job-card__title">{job.title}</h3>
                <p className="cr-job-card__desc">{job.desc}</p>
                <button type="button" className="cr-job-card__btn">
                  Read More & Apply <span className="ar">\u2192</span>
                </button>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CareersFormInner({ jobSlug, selectedPosition }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    city: "",
    candidateProfile: "",
    message: ""
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const maxSize = 30 * 1024;
    if (file.size > maxSize) {
      setError("Resume must be 30 KB or smaller. Please compress and try again.");
      e.target.value = "";
      return;
    }
    const allowed = [".pdf", ".doc", ".docx"];
    const ext = "." + file.name.split(".").pop().toLowerCase();
    if (!allowed.includes(ext)) {
      setError("Only .pdf, .doc, and .docx files are accepted.");
      e.target.value = "";
      return;
    }
    setResumeFile(file);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.phone) {
      setError("Please fill out all required fields.");
      return;
    }
    if (!resumeFile) {
      setError("Please upload your CV / Resume.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let resumeUrl = "";
      let resumeName = resumeFile.name;
      if (window.RuchiBackend?.uploadResume) {
        const upload = await window.RuchiBackend.uploadResume(resumeFile);
        resumeUrl = upload.url;
        resumeName = upload.name;
      }

      if (window.RuchiBackend?.careerApplications) {
        const { error: submitError } = await window.RuchiBackend.careerApplications.submit({
          job_slug: jobSlug,
          job_title: selectedPosition,
          full_name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          city: formData.city,
          candidate_profile: formData.candidateProfile,
          message: formData.message,
          resume_url: resumeUrl,
          resume_name: resumeName,
        });

        if (submitError) throw submitError;
        setSuccess(true);
      } else {
        setTimeout(() => {
          setSuccess(true);
        }, 1000);
      }
    } catch (err) {
      setError(err.message || "An error occurred while submitting your application.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="cr-form__success">
        <div className="cr-success-icon">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="var(--rr-lime)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h3>Application Received</h3>
        <p>Thank you for your interest in Ruchi Realty. Our team will review your application and contact you if there is a match.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="cr-form">
      {error && <div className="cr-form__error">{error}</div>}

      <div className="cr-form__group">
        <label htmlFor="fullName">Full Name *</label>
        <input type="text" id="fullName" name="fullName" required value={formData.fullName} onChange={handleInputChange} placeholder="e.g. Rahul Sharma" />
      </div>

      <div className="cr-form__group">
        <label htmlFor="email">Email Address *</label>
        <input type="email" id="email" name="email" required value={formData.email} onChange={handleInputChange} placeholder="e.g. rahul@example.com" />
      </div>

      <div className="cr-form__group">
        <label htmlFor="phone">Phone Number *</label>
        <input type="tel" id="phone" name="phone" required value={formData.phone} onChange={handleInputChange} placeholder="e.g. +91 98765 43210" />
      </div>

      <div className="cr-form__group">
        <label htmlFor="city">Current City</label>
        <input type="text" id="city" name="city" value={formData.city} onChange={handleInputChange} placeholder="e.g. Kolkata" />
      </div>

      <div className="cr-form__group">
        <label htmlFor="position-static">Job Position / Applying For</label>
        <input type="text" id="position-static" value={selectedPosition} disabled style={{ color: "rgba(35, 31, 32, 0.5)", borderBottomStyle: "dashed" }} />
      </div>

      <div className="cr-form__group">
        <label htmlFor="candidateProfile">Candidate Profile</label>
        <textarea id="candidateProfile" name="candidateProfile" rows="2" value={formData.candidateProfile} onChange={handleInputChange} placeholder="Briefly describe your professional profile (experience, skills, industry)..." />
      </div>

      <div className="cr-form__group">
        <label htmlFor="resume">Upload CV / Resume * <span style={{ fontWeight: 400, fontSize: 11, opacity: 0.6 }}>(max 30 KB)</span></label>
        <div className="cr-file-input">
          <input type="file" id="resume" name="resume" accept=".pdf,.doc,.docx" required onChange={handleFileChange} style={{ display: "none" }} />
          <button type="button" className="cr-file-btn" onClick={() => document.getElementById("resume").click()}>
            {resumeFile ? "Change File" : "Choose File"}
          </button>
          <span className="cr-file-name" style={{ maxWidth: "160px" }}>{resumeFile ? resumeFile.name : "Choose .pdf/.docx"}</span>
        </div>
      </div>

      <div className="cr-form__group">
        <label htmlFor="message">Message</label>
        <textarea id="message" name="message" rows="3" value={formData.message} onChange={handleInputChange} placeholder="Briefly cover your relevant experience..." />
      </div>

      <button type="submit" className="submit-btn cr-submit-btn" style={{ width: "100%" }} disabled={loading}>
        {loading ? "Submitting..." : "Submit Application"}
      </button>
    </form>
  );
}

function JobDetailView({ job, onBack }) {
  return (
    <div className="cr-detail-page section-pad" style={{ background: "var(--rr-paper)", paddingTop: "140px" }}>
      <div className="rr-wrap">
        <button type="button" className="cr-back-btn" onClick={onBack}>
          <span className="ar">\u2190</span> Back to all open positions
        </button>

        <div className="cr-detail-grid">
          <div className="cr-detail__info">
            <Reveal>
              <div className="cr-job-card__meta" style={{ marginBottom: "16px" }}>
                <span className="cr-job-card__dept">{job.dept}</span>
                <span className="cr-job-card__type" style={{ marginLeft: "12px" }}>{job.type}</span>
              </div>
              <h1 className="cr-detail__title">{job.title}</h1>

              <div className="cr-detail__section">
                <h3>Role Overview</h3>
                <p className="cr-detail__text">{job.overview}</p>
              </div>

              <div className="cr-detail__section">
                <h3>Core Responsibilities</h3>
                <ul className="cr-detail__list">
                  {job.responsibilities.map((resp, idx) => (
                    <li key={idx}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div className="cr-detail__section">
                <h3>Candidate Requirements</h3>
                <ul className="cr-detail__list">
                  {job.requirements.map((req, idx) => (
                    <li key={idx}>{req}</li>
                  ))}
                </ul>
              </div>
            </Reveal>
          </div>

          <div className="cr-detail__sidebar">
            <Reveal>
              <div className="cr-sidebar__card">
                <h3>Apply for this role</h3>
                <p>Complete the form below to submit your application for the <strong>{job.title}</strong> position.</p>
                <CareersFormInner jobSlug={job.slug} selectedPosition={job.dropdownVal} />
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CareersPage() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (window.RuchiBackend?.careers) {
      window.RuchiBackend.careers.getActive().then(({ data }) => {
        const activeJobs = data && data.length ? data : JOBS;
        setJobs(activeJobs);
      });
    } else {
      setJobs(JOBS);
    }
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const jobSlug = params.get("job");
    if (jobSlug && jobs.length) {
      const match = jobs.find(j => j.slug === jobSlug);
      if (match) setSelectedJob(match);
    }

    const handlePopState = () => {
      const p = new URLSearchParams(window.location.search);
      const s = p.get("job");
      if (s) {
        const m = jobs.find(j => j.slug === s);
        setSelectedJob(m || null);
      } else {
        setSelectedJob(null);
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [jobs]);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    const newUrl = job ? `${window.location.pathname}?job=${job.slug}` : window.location.pathname;
    window.history.pushState({}, "", newUrl);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="cr-page">
      <Nav onContact={() => {
        if (window.smoothTo) window.smoothTo("#contact");
      }} />

      {selectedJob ? (
        <JobDetailView job={selectedJob} onBack={() => handleSelectJob(null)} />
      ) : (
        <>
          <CareersHero onApply={() => jobs[4] && handleSelectJob(jobs[4])} />
          <CareersCulture />
          <CareersPositions jobs={jobs} onSelectJob={handleSelectJob} />
        </>
      )}

      <Footer />
    </div>
  );
}
