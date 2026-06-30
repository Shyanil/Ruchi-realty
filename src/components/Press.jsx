import { Reveal, RImg } from "./shared";
import { PRESS } from "../data/siteData";

const PRESS_URL = "https://ruchirealty.com/press-releases/";

export function Press() {
  const items = PRESS.slice(0, 4);
  const feat = items[0];
  const rest = items.slice(1);
  return (
    <section className="section-pad press" id="press">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow sec-eyebrow">Press &amp; Media</div>
              <h2 className="press__head">A name that finds its<br />way into <span className="rr-grad">the news.</span></h2>
            </div>
            <a className="press__all" href={PRESS_URL} target="_blank" rel="noopener noreferrer">
              View all press releases<span className="ar">↗</span>
            </a>
          </div>
        </Reveal>
        <div className="press-grid">
          <Reveal>
            <a className="press-feat" href={PRESS_URL} target="_blank" rel="noopener noreferrer">
              <RImg src={feat.img} alt={feat.head} className="press-feat__media" grade />
              <div className="press-feat__body">
                <span className="press-date">{feat.date}</span>
                <h3 className="press-feat__head">{feat.head}</h3>
                <span className="press-read">Read the story<span className="ar">↗</span></span>
              </div>
            </a>
          </Reveal>
          <div className="press-side">
            {rest.map((p, i) =>
              <Reveal key={i} delay={(i + 1) * 70}>
                <a className="press-mini" href={PRESS_URL} target="_blank" rel="noopener noreferrer">
                  <RImg src={p.img} alt={p.head} className="press-mini__media" grade />
                  <div className="press-mini__body">
                    <span className="press-date">{p.date}</span>
                    <h3 className="press-mini__head">{p.head}</h3>
                  </div>
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
