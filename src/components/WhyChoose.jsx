import { useState } from "react";
import { Reveal } from "./shared";
import { HOME_FAQS } from "./Faq";

export function WhyChoose() {
  const [open, setOpen] = useState(0);
  return (
    <section className="section-pad why" id="why">
      <div className="rr-wrap why2">
        <Reveal className="why2__aside">
          <div className="eyebrow sec-eyebrow">FAQ</div>
          <h2 className="why2__head">Your questions,<br /><span className="rr-grad">clearly answered</span></h2>
          <p className="why2__lead">
            Helpful information for every stage of your property search.
          </p>
          <div className="why2__mark" aria-hidden="true"></div>
        </Reveal>
        <Reveal className="why2__list" delay={120}>
          {HOME_FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <div className={`wacc ${isOpen ? "is-open" : ""}`} key={item.question}>
                <button className="wacc__head" type="button" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? -1 : i)}>
                  <span className="wacc__no">{String(i + 1).padStart(2, "0")}</span>
                  <span className="wacc__title">{item.question}</span>
                  <span className="wacc__toggle" aria-hidden="true">
                    <svg width="15" height="15" viewBox="0 0 16 16"><path d="M8 1.5v13M1.5 8h13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" /></svg>
                  </span>
                </button>
                <div className="wacc__panel">
                  <div className="wacc__panelin">
                    <p>{i === 2 ? <>Click &ldquo;Book a Visit&rdquo; on the website or submit an enquiry form. Our team will contact you to arrange a convenient time.</> : item.answer}</p>
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
