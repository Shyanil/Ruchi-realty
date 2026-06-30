import { useEffect, useRef } from "react";
import { SHOWREEL } from "../data/siteData";

export default function Hero() {
  const vid = useRef(null);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (vid.current && y < window.innerHeight) {
          const scale = 1 + Math.min(y / window.innerHeight, 1) * 0.14;
          vid.current.style.transform = `scale(${scale.toFixed(4)})`;
        }
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  return (
    <section className="hero" id="top">
      <video ref={vid} className="hero__video" src={SHOWREEL}
        autoPlay muted loop playsInline preload="auto" aria-label="Ruchi Realty showreel" />
      <div className="hero__scrim"></div>
      <div className="hero__mono" aria-hidden="true"></div>
      <a className="hero__scroll" href="#intro"
         onClick={(e) => { e.preventDefault(); document.querySelector("#intro").scrollIntoView({ behavior: "smooth" }); }}
         aria-label="Scroll to explore">
        <div className="dot-track"></div>
        <span>Scroll</span>
      </a>
    </section>
  );
}
