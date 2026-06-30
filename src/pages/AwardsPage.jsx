import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import { Reveal } from "../components/shared";

const AWARDS_DATA = [
  { title: "Malwa Vyapar Awards", img: "assets/media/award-malwa-vyapar.jpg" },
  { title: "Company of the Year Award", img: "assets/media/award-company-of-the-year.jpg" },
  { title: "Vishesh Atithi Awards", img: "assets/media/award-vishesh-atithi.jpg" },
  { title: "Most Prestigious Property Exhibition", img: "assets/media/award-prestigious-property-exhibition.jpg" },
  { title: "Excellence in Real Estate Planning", img: "assets/media/award-real-estate-planning.jpg" },
  { title: "Property Auto Expo Award", img: "assets/media/award-property-auto-expo.jpg" },
  { title: "Property Show Award by CREDAI", img: "assets/media/award-credai-property-show.jpg" },
  { title: "Property Fair Awards by HDFC", img: "assets/media/award-hdfc-property-fair.jpg" },
  { title: "Property & Auto Fair Awards", img: "assets/media/award-property-auto-fair.jpg" },
  { title: "Times Property Show Award", img: "assets/media/award-times-property-show.jpg" },
  { title: "Ultra High Luxury Developer of the Year Award", img: "assets/media/award-ultra-high-luxury-developer.jpg" },
  { title: "Mega Property Expo Award", img: "assets/media/award-mega-property-expo-2025.jpg" },
  { title: "Real Estate Fair Award", img: "assets/media/award-real-estate-fair-2025.jpg" },
  { title: "Golden Brick Award", img: "assets/media/award-luxury-project-golden-brick-2025.jpg" }
];

function AwardsHero() {
  const scrollToSection = (target) => {
    const nextEl = document.querySelector(target);
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
            <h1 className="awd-hero__title">Awards & Recognition</h1>
            <p className="awd-hero__sub">
              Trust, quality, and progress.
            </p>
            <div className="awd-hero__actions">
              <button type="button" className="awd-hero__btn awd-hero__btn--primary" onClick={() => scrollToSection("#awards")}>
                View Awards <span className="ar">\u2192</span>
              </button>
              <button type="button" className="awd-hero__btn awd-hero__btn--ghost" onClick={() => { window.location.href = "/projects"; }}>
                Our Projects <span className="ar">\u2192</span>
              </button>
            </div>
          </Reveal>
        </div>
      </div>

      <div className="hero__scroll" onClick={() => scrollToSection("#awards")} style={{ cursor: "pointer" }}>
        <div className="dot-track"></div>
        <span>Explore</span>
      </div>
    </section>
  );
}

function AwardsShowcase() {
  return (
    <section className="awd-showcase section-pad" id="awards">
      <div className="awd-showcase__sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <div className="awd-showcase__header">
          <div className="eyebrow awd-showcase__label">AWARDS &amp; RECOGNITION</div>
          <h2 className="awd-showcase__title">Celebrating milestones of trust and excellence.</h2>
          <p className="awd-showcase__lead">Honours and recognitions that reflect Ruchi Realty\u2019s commitment to quality, innovation, and landmark development.</p>
        </div>

        <div className="awd-simple-grid" aria-label="Ruchi Realty awards">
          {AWARDS_DATA.map((award) => (
            <article className="awd-simple-card" key={award.title}>
              <div className="awd-simple-card__media">
                <img src={award.img} alt={award.title} loading="eager" decoding="async" />
              </div>
              <div className="awd-simple-card__body">
                <h3>{award.title}</h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default function AwardsPage() {
  return (
    <div className="awd-page">
      <Nav onContact={() => {
        if (window.smoothTo) window.smoothTo("#contact");
      }} />
      <AwardsHero />
      <AwardsShowcase />
      <Footer />
    </div>
  );
}
