import { Reveal, RImg, StatCounter } from "./shared";
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
                Since 2008, Ruchi Realty has developed residential, commercial and plotted communities across Kolkata, Indore and Bhopal, bringing together considered locations, practical planning, responsible construction and support beyond possession.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <div className="about-stats" aria-label="Ruchi Realty at a glance">
                {STATS.map((s, i) =>
                <div key={i} className="about-stat">
                    <div className="about-stat__num"><StatCounter value={s.num} suffix={s.suffix} /></div>
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
