import { useEffect, useRef, useState } from "react";
import { SHOWREEL } from "../data/siteData";

export default function Hero() {
  const vid = useRef(null);
  const retryTimer = useRef(null);
  const audioUnlocked = useRef(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

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

          // Keep audio off once the showreel is no longer the focus.
          if (y >= heroHeight) {
            if (!vid.current.muted) {
              vid.current.muted = true;
              setSoundOn(false);
            }
          } else if (audioUnlocked.current && vid.current.muted) {
            vid.current.muted = false;
            setSoundOn(true);
            vid.current.play().catch(() => {
              vid.current.muted = true;
              setSoundOn(false);
            });
          }
        }
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => {
    const video = vid.current;
    if (!video) return undefined;

    // Request audible playback first. Browsers that allow it start with sound;
    // when policy blocks it, keep the showreel reliable by falling back to mute.
    video.defaultMuted = false;
    video.muted = false;
    video.play().then(() => {
      audioUnlocked.current = true;
      setSoundOn(true);
    }).catch(() => {
      video.muted = true;
      setSoundOn(false);
      video.play().catch(() => {
        retryTimer.current = window.setTimeout(() => {
          video.load();
          video.play().catch(() => setVideoFailed(true));
        }, 1200);
      });
    });

    return () => {
      window.clearTimeout(retryTimer.current);
    };
  }, []);

  const toggleAudio = () => {
    const video = vid.current;
    if (!video || window.scrollY >= window.innerHeight * 0.75) return;
    if (!video.muted) {
      video.muted = true;
      setSoundOn(false);
      return;
    }
    audioUnlocked.current = true;
    video.muted = false;
    video.play().catch(() => {
      video.muted = true;
      setSoundOn(false);
    });
    setSoundOn(true);
  };

  const handlePlaying = () => {
    setVideoReady(true);
    setVideoFailed(false);
  };

  const handleVideoError = () => {
    setVideoReady(false);
    setVideoFailed(true);
  };

  return (
    <section className={`hero${videoReady ? " hero--video-ready" : ""}${videoFailed ? " hero--video-fallback" : ""}`} id="top">
      <video
        ref={vid}
        className="hero__video"
        src={SHOWREEL}
        autoPlay
        loop
        playsInline
        preload="metadata"
        onPlaying={handlePlaying}
        onLoadedData={handlePlaying}
        onError={handleVideoError}
        aria-label="Ruchi Realty showreel"
      />
      <div className="hero__scrim"></div>

      <button className={`hero__sound${soundOn ? " is-on" : ""}`} type="button"
        onClick={toggleAudio} aria-pressed={soundOn} aria-label={soundOn ? "Mute hero video" : "Play hero video sound"}>
        <span className="hero__sound-icon" aria-hidden="true">
          {soundOn ? (
            <svg viewBox="0 0 24 24"><path d="M11 5 6.8 9H3v6h3.8l4.2 4V5Z"/><path d="M15 9.2a4 4 0 0 1 0 5.6"/><path d="M17.8 6.5a7.7 7.7 0 0 1 0 11"/></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path d="M11 5 6.8 9H3v6h3.8l4.2 4V5Z"/><path d="m16 9 5 5M21 9l-5 5"/></svg>
          )}
        </span>
        <span>{soundOn ? "Sound on" : "Sound off"}</span>
      </button>

      <a className="hero__scroll" href="#intro"
         onClick={(e) => { e.preventDefault(); document.querySelector("#intro").scrollIntoView({ behavior: "smooth" }); }}
         aria-label="Scroll down to explore">
        <span className="hero__scroll-copy">Scroll down</span>
        <span className="hero__scroll-arrow" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M12 4v15"></path>
            <path d="m6.5 13.5 5.5 5.5 5.5-5.5"></path>
          </svg>
        </span>
      </a>
    </section>
  );
}
