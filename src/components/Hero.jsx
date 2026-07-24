import { useEffect, useRef, useState } from "react";
import { SHOWREEL } from "../data/siteData";

export default function Hero() {
  const vid = useRef(null);
  const [isMuted, setIsMuted] = useState(false);
  const userManuallyToggledRef = useRef(false);

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
              setIsMuted(true);
            }
          } else {
            if (!userManuallyToggledRef.current && vid.current.muted) {
              vid.current.muted = false;
              setIsMuted(false);
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
      setIsMuted(false);
      const playPromise = vid.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn("Unmuted autoplay restricted by browser policy. Sound will activate on user gesture.", err);
          const enableAudio = () => {
            if (vid.current && window.scrollY < window.innerHeight * 0.75) {
              vid.current.muted = false;
              setIsMuted(false);
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

  const toggleSound = () => {
    if (vid.current) {
      const nextMuted = !vid.current.muted;
      vid.current.muted = nextMuted;
      setIsMuted(nextMuted);
      userManuallyToggledRef.current = nextMuted;
    }
  };

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
      <div className="hero__mono" aria-hidden="true"></div>

      <button
        type="button"
        className="hero__sound-btn"
        onClick={toggleSound}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        title={isMuted ? "Unmute Sound" : "Mute Sound"}
      >
        {isMuted ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <line x1="23" y1="9" x2="17" y2="15" />
            <line x1="17" y1="9" x2="23" y2="15" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07" />
          </svg>
        )}
        <span>{isMuted ? "Sound Off" : "Sound On"}</span>
      </button>

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
