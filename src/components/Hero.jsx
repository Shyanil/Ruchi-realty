import { useEffect, useRef } from "react";
import { SHOWREEL } from "../data/siteData";

export default function Hero() {
  const vid = useRef(null);

  useEffect(() => {
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        const heroHeight = window.innerHeight * 0.75;

        if (vid.current) {
          if (y < window.innerHeight && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const scale = 1 + Math.min(y / window.innerHeight, 1) * 0.14;
            vid.current.style.transform = `scale(${scale.toFixed(4)})`;
          }

          // Sound OFF when scrolled down past hero section
          // Sound ON when user is on the hero section
          if (y >= heroHeight) {
            if (!vid.current.muted) {
              vid.current.muted = true;
            }
          } else {
            if (vid.current.muted) {
              vid.current.muted = false;
              vid.current.play().catch(() => {});
            }
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    if (vid.current) {
      vid.current.muted = false;
      const playPromise = vid.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Unmuted autoplay restricted by browser policy. Sound will activate on user gesture.", err);
          const enableAudio = () => {
            if (vid.current && window.scrollY < window.innerHeight * 0.75) {
              vid.current.muted = false;
              vid.current.play().catch(() => {});
            }
          };
          window.addEventListener("click", enableAudio, { once: true });
          window.addEventListener("keydown", enableAudio, { once: true });
          window.addEventListener("touchstart", enableAudio, { once: true });
        });
      }
    }
  }, []);

  return (
    <section className="hero" id="top">
      <video
        ref={vid}
        className="hero__video"
        src={SHOWREEL}
        autoPlay
        loop
        playsInline
        preload="auto"
        aria-label="Ruchi Realty showreel"
      />
      <div className="hero__scrim"></div>

      <a className="hero__scroll" href="#intro"
         onClick={(e) => { e.preventDefault(); document.querySelector("#intro").scrollIntoView({ behavior: "smooth" }); }}
         aria-label="Scroll to explore">
        <div className="hero__mouse" aria-hidden="true"><span></span></div>
        <div className="dot-track"></div>
        <span>Scroll down</span>
      </a>
    </section>
  );
}
