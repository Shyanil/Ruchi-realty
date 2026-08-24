import { Reveal } from "./shared";

export default function Intro() {
  return (
    <section className="intro section-pad" id="intro">
      <div className="intro__sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <Reveal>
          <div className="intro__eyebrow eyebrow sec-eyebrow">Welcome to Ruchi Realty — Built on commitment</div>
        </Reveal>
        <Reveal delay={80}>
          <h1 className="intro__head">
            <span className="intro__line">Find Homes, Workspaces and Investment</span>
            <span className="intro__grad intro__line">Opportunities Across Kolkata, Indore and Bhopal</span>
          </h1>
        </Reveal>
        <Reveal delay={160}>
          <p className="intro__sub">
            Ruchi Realty develops homes, commercial spaces and plotted communities across Kolkata, Indore and Bhopal, with attention to location, practical design, construction quality and clear communication.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
