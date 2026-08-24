import { Reveal, RImg } from "./shared";
import { HERO_IMG, IMG_TOWER, STATS } from "../data/siteData";

export function About() {
  return (
    <section className="section-pad" id="about">
      <div className="rr-wrap">
        <div className="about-grid">
          <Reveal className="about-media">
            <RImg src={HERO_IMG.about} alt="A family at home" className="about-img" />
            <RImg src={IMG_TOWER[0]} alt="A Ruchi Realty residence" className="about-img-3" />
            <RImg src={HERO_IMG.aboutAlt} alt="A bright, lived-in room" className="about-img-2" />
          </Reveal>
          <div className="about-copy section-intro--left">
            <Reveal>
              <div className="eyebrow sec-eyebrow">About Ruchi Realty</div>
              <h2 className="about-head">Trusted Real Estate Developer <span className="rr-grad">Since 2008</span></h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="about-lead">
                Since 2008, Ruchi Realty has developed residential, commercial and plotted communities across Kolkata, Indore and Bhopal. Our developments combine strategic locations, thoughtful planning, quality construction and customer support that continues beyond possession.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <div className="about-stats" aria-label="Ruchi Realty at a glance">
                {STATS.map((s, i) =>
                <div key={i} className="about-stat">
                    <div className="about-stat__top">
                      <span className="about-stat__index">{String(i + 1).padStart(2, "0")}</span>
                      <span className="about-stat__rule" aria-hidden="true"></span>
                    </div>
                    <div className="about-stat__num">{s.num}<span className="suffix">{s.suffix}</span></div>
                    <div className="about-stat__label">{s.label}</div>
                  </div>
                )}
              </div>
              <a className="about-more" href="/about">Our story and leadership →</a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
