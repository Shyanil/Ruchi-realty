/* ============================================================
   Sections 2 — About · Why Choose Us · Video Testimonials (v2)
   ============================================================ */
const { useState: uS2, useEffect: uE2 } = React;

/* ---- About / Legacy ---- */
function About() {
  return (
    <section className="section-pad" id="about">
      <div className="rr-wrap">
        <div className="about-grid">
          <Reveal className="about-media">
            <RImg src={HERO_IMG.about} alt="A family at home" className="about-img" />
            {/* accent photo, framed, bleeding off the top-left corner */}
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
    </section>);

}

/* ---- Why Choose Us — interactive commitment ledger ---- */
function WhyChoose() {
  const [open, setOpen] = uS2(0);
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
    </section>);

}

/* ---- Video testimonials ---- */
const PlayGlyph = () =>
<svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5l12 7-12 7V5z" /></svg>;


function VideoLightbox({ v, onClose }) {
  uE2(() => {
    const onKey = (e) => {if (e.key === "Escape") onClose();};
    window.addEventListener("keydown", onKey);
    document.body.classList.add("nav-locked");
    return () => {window.removeEventListener("keydown", onKey);document.body.classList.remove("nav-locked");};
  }, []);
  return (
    <div className="vt-modal" onClick={onClose}>
      <div className="vt-modal__frame" onClick={(e) => e.stopPropagation()}>
        <button className="vt-modal__close" onClick={onClose} aria-label="Close film">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M6 6l12 12M18 6L6 18" /></svg>
        </button>
        <video className="vt-modal__video" src={window.SHOWREEL} poster={v.poster} controls autoPlay playsInline />
        <div className="vt-modal__cap">
          <div>
            <div className="vt-modal__name">{v.name}</div>
            <div className="vt-modal__proj">{v.project} · {v.city}</div>
          </div>
        </div>
      </div>
    </div>);

}

function Testimonials() {
  const [active, setActive] = uS2(null);
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
          <Reveal delay={120} className="vtcard vtcard--cta">
            <button className="vtcard__btn" onClick={() => setActive(-1)} aria-label="Play the full showreel">
              <span className="vtcard-cta__play"><PlayGlyph /></span>
              <span className="vtcard-cta__txt">Watch the<br />full reel <span>→</span></span>
            </button>
          </Reveal>
        </div>
      </div>
      {active !== null ? <VideoLightbox v={active === -1 ? reel : data[active]} onClose={() => setActive(null)} /> : null}
    </section>);

}

Object.assign(window, { About, WhyChoose, Testimonials });