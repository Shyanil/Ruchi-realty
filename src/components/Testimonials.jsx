import { useState, useEffect } from "react";
import { Reveal, RImg } from "./shared";
import { VIDEO_TESTIMONIALS } from "../data/siteData";

const PlayGlyph = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7V5z" /></svg>
);

function VideoLightbox({ v, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    document.body.classList.add("nav-locked");
    return () => { window.removeEventListener("keydown", onKey); document.body.classList.remove("nav-locked"); };
  }, []);
  return (
    <div className="vt-modal" onClick={onClose}>
      <div className="vt-modal__frame" onClick={(e) => e.stopPropagation()}>
        <button className="vt-modal__close" onClick={onClose} aria-label="Close film">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <iframe className="vt-modal__video" src={v.video} title={`${v.customerName} — ${v.project} testimonial`} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe>
        <div className="vt-modal__cap">
          <div>
            <div className="vt-modal__name">{v.customerName}</div>
            <div className="vt-modal__proj">{v.customerRole} · {v.project} · {v.city}</div>
          </div>
          <p className="vt-modal__quote">“{v.quote}”</p>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(null);
  const data = VIDEO_TESTIMONIALS;
  return (
    <section className="testimonials section-pad" id="testimonials">
      <div className="testi-sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <Reveal>
          <div className="testi-headrow">
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Resident stories</div>
              <h2 className="testi-head">Resident Stories from<br /><span className="rr-grad">Ruchi Realty Communities</span></h2>
            </div>
            <p className="testi-intro">
              Hear directly from residents about the buying experience, their neighbourhood and life after moving in.
            </p>
          </div>
        </Reveal>
        <div className="vtgrid">
          {data.map((v, i) =>
            <Reveal key={i} delay={i % 4 * 60} className={`vtcard ${i === 0 ? "vtcard--feat" : ""}`}>
              <button className="vtcard__btn" data-cursor="Play" onClick={() => setActive(i)} aria-label={`Play testimonial from ${v.customerName} at ${v.project}`}>
                <RImg src={v.poster} alt={`${v.customerName}, ${v.customerRole} at ${v.project}, ${v.city}`} className="vtcard__media" grade />
                <div className="vtcard__scrim"></div>
                <span className="vtcard__play"><PlayGlyph /></span>
                <span className="vtcard__proof">Video testimonial</span>
                <span className="vtcard__dur">{v.dur}</span>
                <div className="vtcard__body">
                  <span className="vtcard__line">“{v.quote}”</span>
                  <span className="vtcard__name">{v.customerName}</span>
                  <span className="vtcard__role">{v.customerRole}</span>
                  <span className="vtcard__proj">{v.project} · {v.city}</span>
                </div>
              </button>
            </Reveal>
          )}
        </div>
      </div>
      {active !== null ? <VideoLightbox v={data[active]} onClose={() => setActive(null)} /> : null}
    </section>
  );
}
