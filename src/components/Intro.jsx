import { Reveal } from "./shared";

export default function Intro() {
  return (
    <section className="intro section-pad" id="intro">
      <div className="intro__sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <Reveal>
          <div className="intro__eyebrow eyebrow sec-eyebrow">Committed to You</div>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="intro__head">
            We don't just build homes.<br />
            <span className="intro__grad">We stand by them.</span>
          </h2>
        </Reveal>
        <Reveal delay={160}>
          <p className="intro__sub">
            For nearly four decades, across Kolkata, Indore, and Bhopal, we have treated the home as a promise — built with intent, handed over with care, and held to long after the keys change hands.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
