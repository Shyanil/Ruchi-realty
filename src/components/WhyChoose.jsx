import { useState } from "react";
import { Reveal, Icon } from "./shared";
import { TRUST } from "../data/siteData";

export function WhyChoose() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section-pad why" id="why">
      <div className="rr-wrap why2">
        <Reveal className="why2__aside">
          <div className="eyebrow sec-eyebrow">What commitment looks like</div>
          <h2 className="why2__head">The <span className="rr-grad">proof</span>,<br />not the promise.</h2>
          <p className="why2__lead">
            Trust is earned, never claimed. These are the things we hold ourselves to — and the things you can check for yourself, before you decide.
          </p>
          <div className="why2__mark" aria-hidden="true"></div>
        </Reveal>
        <Reveal className="why2__list" delay={120}>
          {TRUST.map((t, i) => {
            const isOpen = open === i;
            return (
              <div className={`wacc ${isOpen ? "is-open" : ""}`} key={i}>
                <button className="wacc__head" type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="wacc__no">{t.no}</span>
                  <Icon name={t.icon} className="wacc__pico" />
                  <span className="wacc__title">{t.title}</span>
                  <span className="wacc__toggle" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 16 16"><path d="M8 1.5v13M1.5 8h13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </span>
                </button>
                <div className="wacc__panel">
                  <div className="wacc__panelin">
                    <p>{t.body}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
