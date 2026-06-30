import { useState, useEffect } from "react";
import { Reveal, RImg } from "./shared";
import { VIDEO_TESTIMONIALS, IMG_TOWER, SHOWREEL } from "../data/siteData";

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
        {v.video ?
          <iframe className="vt-modal__video" src={v.video} title={v.name} allow="autoplay; fullscreen; picture-in-picture" allowFullScreen></iframe> :
          <video className="vt-modal__video" src={SHOWREEL} poster={v.poster} controls autoPlay playsInline />}
        <div className="vt-modal__cap">
          <div>
            <div className="vt-modal__name">{v.name}</div>
            <div className="vt-modal__proj">{v.project} · {v.city}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Testimonials() {
  const [active, setActive] = useState(null);
  const data = VIDEO_TESTIMONIALS;
  const reel = { name: "Ruchi Realty", project: "The full film", city: "Committed to You", line: "Thirty-eight years, in two minutes.", poster: IMG_TOWER[4] };
  return (
    <section className="testimonials section-pad" id="testimonials">
      <div className="testi-sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <Reveal>
          <div className="testi-headrow">
            <div>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>In their words</div>
              <h2 className="testi-head">The families who live<br /><span className="rr-grad">in what we promised.</span></h2>
            </div>
            <p className="testi-intro">
              No scripts, no actors. Eight families, filmed in the homes we handed them — speaking about the part that mattered.
            </p>
          </div>
        </Reveal>
        <div className="vtgrid">
          {data.map((v, i) =>
            <Reveal key={i} delay={i % 4 * 60} className={`vtcard ${i === 0 ? "vtcard--feat" : ""}`}>
              <button className="vtcard__btn" data-cursor="Play" onClick={() => setActive(i)} aria-label={`Play ${v.name}'s film`}>
                <RImg src={v.poster} alt={v.name} className="vtcard__media" grade />
                <div className="vtcard__scrim"></div>
                <span className="vtcard__play"><PlayGlyph /></span>
                <span className="vtcard__dur">{v.dur}</span>
                <div className="vtcard__body">
                  <span className="vtcard__name">{v.name}</span>
                  <span className="vtcard__proj">{v.project} · {v.city}</span>
                </div>
              </button>
            </Reveal>
          )}
        </div>
      </div>
      {active !== null ? <VideoLightbox v={active === -1 ? reel : data[active]} onClose={() => setActive(null)} /> : null}
    </section>
  );
}
