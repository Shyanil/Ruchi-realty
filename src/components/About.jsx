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
              <div className="eyebrow sec-eyebrow">Why we build</div>
              <h2 className="about-head">
                A home is the largest <span className="rr-grad">trust</span> a family ever gives.
              </h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="about-lead" style={{ fontSize: "16px", color: "rgba(35, 31, 32, 0.6)", height: "89px", lineHeight: "1.65" }}>
                We have treated that trust as the work itself for nearly four decades. Not products — environments, meant to last: chosen sites, written specifications, finishes we honour.
              </p>
              <p className="about-body" style={{ lineHeight: "1.9" }}>
                Because a home should keep its promises long after the keys change hands, we build with intent and stay reachable after. That is what we mean when we say we are committed to you.
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
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
