/* ============================================================
   Events & Awards Page Component - Ruchi Realty
   ============================================================ */
const { useState: uSP, useEffect: uEP, useRef: uRF } = React;

const AWARDS_DATA = [
  { title: "Malwa Vyapar Awards", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award1.jpg" },
  { title: "Company of the Year Award", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award5.jpg" },
  { title: "Vishesh Atithi Awards", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award2.jpg" },
  { title: "Most Prestigious Property Exhibition", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award9.jpg" },
  { title: "Excellence in Real Estate Planning", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award10.jpg" },
  { title: "Property Auto Expo Award", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award11.jpg" },
  { title: "Property Show Award by CREDAI", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award6.jpg" },
  { title: "Property Fair Awards by HDFC", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award7.jpg" },
  { title: "Property & Auto Fair Awards", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award12.jpg" },
  { title: "Times Property Show Award", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award14.jpg" },
  { title: "Ultra High Luxury Developer of the Year Award", img: "https://ruchirealty.com/wp-content/uploads/2023/09/award4.jpg" },
  { title: "Mega Property Expo Award", img: "https://ruchirealty.com/wp-content/uploads/2025/07/award11.jpg" },
  { title: "Real Estate Fair Award", img: "https://ruchirealty.com/wp-content/uploads/2025/07/award12.jpg" },
  { title: "Luxury Project of the Year Award", img: "https://ruchirealty.com/wp-content/uploads/2025/07/award14.jpg" },
  { title: "Golden Brick Award", img: "https://ruchirealty.com/wp-content/uploads/2025/07/award14.jpg" }
];

const EVENT_IMAGES = [
  "https://ruchirealty.com/wp-content/uploads/2023/09/award1.jpg",
  "https://ruchirealty.com/wp-content/uploads/2023/09/award4.jpg",
  "https://ruchirealty.com/wp-content/uploads/2025/07/award14.jpg"
];

function AwardsPage() {
  const [lightboxOpen, setLightboxOpen] = uSP(false);

  return (
    <div className="awd-page">
      <Nav onContact={() => {
        const contactEl = document.querySelector("#contact");
        if (contactEl) smoothTo("#contact");
      }} />

      <AwardsHero />

      <AwardsIntro />

      <AwardsGrid />

      <AwardsEvents onPlayVideo={() => setLightboxOpen(true)} />

      <AwardsFinalCTA />

      {lightboxOpen && (
        <VideoLightbox onClose={() => setLightboxOpen(false)} />
      )}

      <Footer />
    </div>
  );
}

// ---------------------------------------------------------------- HERO
function AwardsHero() {
  const handleScrollDown = () => {
    const nextEl = document.querySelector("#intro");
    if (nextEl) {
      window.scrollTo({
        top: nextEl.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="hero awd-hero">
      <video
        className="hero__video"
        src="https://ruchirealty.com/wp-content/uploads/2023/08/Awards.mp4"
        autoPlay
        muted
        loop
        playsInline
        poster="https://ruchirealty.com/wp-content/uploads/2023/09/award1.jpg"
      />
      <div className="hero__scrim"></div>
      
      <div className="rr-wrap awd-hero__wrap">
        <div className="awd-hero__content">
          <Reveal>
            <div className="eyebrow" style={{ color: "var(--rr-lime)", letterSpacing: "0.22em", marginBottom: "20px" }}>
              EVENTS & AWARDS
            </div>
            <h1 className="awd-hero__title">Milestones that reflect trust, recognition, and growth.</h1>
            <p className="awd-hero__sub">
              Explore the events, recognitions, and awards that celebrate Ruchi Realty’s journey in creating landmark residential, commercial, and plotted developments.
            </p>
          </Reveal>
        </div>
      </div>

      <div className="hero__scroll" onClick={handleScrollDown} style={{ cursor: "pointer" }}>
        <div className="dot-track"></div>
        <span>Explore</span>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- INTRO / RECOGNITION
function AwardsIntro() {
  return (
    <section className="awd-intro section-pad" id="intro" style={{ background: "var(--rr-paper)" }}>
      <div className="rr-wrap">
        <div className="awd-intro__layout">
          <div className="awd-intro__left">
            <Reveal>
              <div className="eyebrow sec-eyebrow">RECOGNITION</div>
              <h2 className="awd-intro__title">Celebrating moments of excellence</h2>
            </Reveal>
          </div>
          
          <div className="awd-intro__right">
            <Reveal>
              <p className="awd-intro__body">
                Ruchi Realty’s awards and events reflect years of dedication to quality, customer trust, thoughtful planning, and real estate development across key Indian cities. From property exhibitions to real estate excellence recognitions, each milestone represents the company’s continued commitment to building spaces of lasting value.
              </p>
              
              <div className="awd-intro__chips">
                <div className="awd-chip">
                  <span className="dot"></span> Real Estate Excellence
                </div>
                <div className="awd-chip">
                  <span className="dot"></span> Industry Recognition
                </div>
                <div className="awd-chip">
                  <span className="dot"></span> Landmark Developments
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- AWARDS GRID
function AwardsGrid() {
  return (
    <section className="awd-grid-section section-pad" style={{ background: "var(--rr-mist)" }}>
      <div className="rr-wrap">
        <div className="awd-grid__header">
          <Reveal>
            <div className="eyebrow sec-eyebrow">AWARDS</div>
            <h2 className="awd-grid__title">Recognitions across the real estate journey</h2>
          </Reveal>
        </div>

        <div className="awd-grid">
          {AWARDS_DATA.map((award, index) => (
            <div className="awd-card" key={index}>
              <Reveal>
                <div className="awd-card__img-container">
                  <img src={award.img} alt={award.title} className="awd-card__img" loading="lazy" />
                </div>
                <div className="awd-card__body">
                  <span className="awd-card__label">Recognition</span>
                  <h3 className="awd-card__title">{award.title}</h3>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- EVENTS / MEDIA
function AwardsEvents({ onPlayVideo }) {
  return (
    <section className="awd-events section-pad" style={{ background: "var(--rr-paper)" }}>
      <div className="rr-wrap">
        <div className="awd-events__header">
          <Reveal>
            <div className="eyebrow sec-eyebrow">EVENTS</div>
            <h2 className="awd-events__title">Moments from the Ruchi Realty journey</h2>
            <p className="awd-events__lead">
              From property exhibitions to industry forums, Ruchi Realty’s event presence reflects an ongoing connection with buyers, partners, and the wider real estate community.
            </p>
          </Reveal>
        </div>

        <div className="awd-events__strip">
          {/* Featured Video Card */}
          <div className="awd-event-card awd-event-card--video" onClick={onPlayVideo}>
            <Reveal>
              <div className="awd-event-card__img-wrap">
                <img src="https://ruchirealty.com/wp-content/uploads/2023/09/award1.jpg" alt="Featured Video Poster" />
                <div className="awd-event-card__scrim"></div>
                <div className="awd-event-card__play">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5 3 19 12 5 21 5 3" />
                  </svg>
                </div>
              </div>
              <div className="awd-event-card__body">
                <span className="awd-card__label">Featured Video</span>
                <h3 className="awd-event-card__title">Annual Recognition & Highlights Reel</h3>
              </div>
            </Reveal>
          </div>

          {/* Static Image Cards */}
          {EVENT_IMAGES.map((imgUrl, idx) => (
            <div className="awd-event-card" key={idx}>
              <Reveal>
                <div className="awd-event-card__img-wrap">
                  <img src={imgUrl} alt={`Event Moment ${idx + 1}`} loading="lazy" />
                </div>
                <div className="awd-event-card__body">
                  <span className="awd-card__label">Gallery Moment</span>
                  <h3 className="awd-event-card__title">Exhibition & Launch Highlights</h3>
                </div>
              </Reveal>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- FINAL CTA
function AwardsFinalCTA() {
  const handleExplore = () => {
    window.location.href = "index.html#projects";
  };

  const handleContact = () => {
    const contactEl = document.querySelector("#contact");
    if (contactEl) {
      window.scrollTo({
        top: contactEl.getBoundingClientRect().top + window.scrollY - 80,
        behavior: "smooth"
      });
    }
  };

  return (
    <section className="awd-cta section-pad">
      <div className="rr-wrap awd-cta__wrap">
        <div className="awd-cta__left">
          <Reveal>
            <h2 className="awd-cta__title">Building recognition through consistency.</h2>
            <p className="awd-cta__sub">
              Explore Ruchi Realty’s projects across residential, commercial, and plotted developments, crafted with engineering excellence and long-term value.
            </p>
            <div className="awd-cta__buttons">
              <button type="button" className="submit-btn" onClick={handleExplore} style={{ background: "var(--rr-lime)", color: "var(--rr-ink)" }}>
                Explore Projects
              </button>
              <button type="button" className="ab-btn-outline ab-btn-outline--white" onClick={handleContact}>
                Contact Us
              </button>
            </div>
          </Reveal>
        </div>

        {/* Subtle Award Collage on the Right */}
        <div className="awd-cta__right">
          <Reveal>
            <div className="awd-cta__collage">
              <div className="awd-cta__img-card awd-cta__img-card--1">
                <img src="https://ruchirealty.com/wp-content/uploads/2023/09/award1.jpg" alt="Award 1" />
              </div>
              <div className="awd-cta__img-card awd-cta__img-card--2">
                <img src="https://ruchirealty.com/wp-content/uploads/2023/09/award5.jpg" alt="Award 5" />
              </div>
              <div className="awd-cta__img-card awd-cta__img-card--3">
                <img src="https://ruchirealty.com/wp-content/uploads/2023/09/award2.jpg" alt="Award 2" />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ---------------------------------------------------------------- LIGHTBOX
function VideoLightbox({ onClose }) {
  return (
    <div className="vt-modal" onClick={onClose}>
      <div className="vt-modal__frame" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="vt-modal__close" onClick={onClose} aria-label="Close Modal">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
        <video
          className="vt-modal__video"
          src="https://ruchirealty.com/wp-content/uploads/2023/08/Awards.mp4"
          controls
          autoPlay
          playsInline
        />
        <div className="vt-modal__cap">
          <div>
            <div className="vt-modal__name">Ruchi Realty Highlights & Recognitions</div>
            <div className="vt-modal__proj">Real Estate Milestones Video</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------- MOUNT
const container = document.getElementById("root");
const root = ReactDOM.createRoot(container);
root.render(<AwardsPage />);
