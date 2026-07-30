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
          <div className="about-copy">
            <Reveal>
              <div className="eyebrow sec-eyebrow">About Ruchi Realty</div>
              <h2 className="about-head">
                Built around quality, clarity and <span className="rr-grad">long term relationships.</span>
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="about-lead" style={{ fontSize: "16px", color: "rgba(35, 31, 32, 0.6)", height: "89px", lineHeight: "1.65" }}>
                Since 2008, Ruchi Realty has created residential, commercial and plotted developments across Kolkata, Indore and Bhopal.
              </p>
              <p className="about-body" style={{ lineHeight: "1.9" }}>
                Our work brings together considered locations, practical planning, responsible construction and support that continues beyond possession.
              </p>
            </Reveal>
            <Reveal delay={140}>
              <div className="stat-grid">
                {STATS.map((s, i) =>
                <div key={i} className="stat">
                    <div className="stat__num"><StatCounter value={s.num} suffix={s.suffix} /></div>
                    <div className="stat__label">{s.label}</div>
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
