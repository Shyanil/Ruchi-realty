import { Reveal, RImg } from "./shared";
import { AWARDS } from "../data/siteData";

const AWARD_WREATH = "assets/award-wreath.jpg";

function AwardCard({ a, hidden }) {
  return (
    <div className="awcard" aria-hidden={hidden ? "true" : undefined}>
      <div className="awcard__wreath">
        <img src={AWARD_WREATH} alt="" loading="lazy" />
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
            <div className="eyebrow sec-eyebrow">Recognition</div>
            <h2 className="awards__head">Quietly <span className="rr-grad">acknowledged</span>,<br />over the years.</h2>
            <p className="awards__lead">
              We don't build for awards. We are grateful when the work is noticed all the same.
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
