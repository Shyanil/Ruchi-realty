import { Reveal, RImg } from "./shared";
import { AWARDS } from "../data/siteData";

const AWARD_WREATH = "assets/award-wreath.webp";

function AwardCard({ a, hidden }) {
  return (
    <div className="awcard" aria-hidden={hidden ? "true" : undefined}>
      <div className="awcard__wreath">
        <img decoding="async" src={AWARD_WREATH} alt="" loading="lazy" />
        {a.year ?
          <span className="awcard__inwreath">{a.year}</span> :
          <svg className="awcard__star" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.5l2.47 5.01 5.53.8-4 3.9.94 5.5L12 16.11l-4.94 2.6.94-5.5-4-3.9 5.53-.8z"></path>
          </svg>
        }
      </div>
      <div className="awcard__name">{a.name}</div>
    </div>
  );
}

export function Awards() {
  const loop = AWARDS.concat(AWARDS);
  return (
    <section className="section-pad awards" id="awards">
      <div className="rr-wrap">
        <Reveal>
          <div className="awards__intro">
            <div className="eyebrow sec-eyebrow">Awards and recognition</div>
            <h2 className="awards__head">Ruchi Realty Awards: Celebrating<br /><span className="rr-grad">Excellence Across Indian Cities</span></h2>
            <p className="awards__lead">
              Explore the milestones, real estate honors, and prestigious recognition our projects have earned over the years.
            </p>
          </div>
        </Reveal>
      </div>
      <Reveal>
        <div className="awmq" aria-label="Awards received by Ruchi Realty">
          <div className="awmq__track">
            {loop.map((a, i) => <AwardCard key={i} a={a} hidden={i >= AWARDS.length} />)}
          </div>
        </div>
      </Reveal>
    </section>
  );
}
