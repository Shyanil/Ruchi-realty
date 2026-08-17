import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MOBILE_SHOWREEL, SHOWREEL } from "../data/siteData";

const SOUND_HEADER_SCROLL_THRESHOLD = 1;

export default function Hero() {
  const vid = useRef(null);
  const retryTimer = useRef(null);
  const audioUnlocked = useRef(false);
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [soundHost, setSoundHost] = useState(null);

  useEffect(() => {
    setSoundHost(document.querySelector("[data-hero-sound-slot]"));
  }, []);

  useEffect(() => {
    let raf;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (vid.current) {
          if (y < window.innerHeight && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            const scale = 1 + Math.min(y / window.innerHeight, 1) * 0.14;
            vid.current.style.transform = `scale(${scale.toFixed(4)})`;
          }

          // The sound control leaves with the transparent hero header, so mute
          // the video at the same point to avoid audio without a visible control.
          if (y > SOUND_HEADER_SCROLL_THRESHOLD) {
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

    // Mobile browsers only guarantee autoplay when muted is present from the
    // first paint. Audio remains available through the explicit sound button.
    video.defaultMuted = true;
    video.muted = true;
    setSoundOn(false);
    const retryPlayback = () => {
      video.muted = true;
      video.play().catch(() => {
        // Keep the poster visible when autoplay is blocked. A later user
        // interaction can still start playback through the sound control.
      });
    };

    video.play().catch(() => {
      retryTimer.current = window.setTimeout(() => {
        retryPlayback();
      }, 400);
    });

    video.addEventListener("canplay", retryPlayback, { once: true });

    return () => {
      window.clearTimeout(retryTimer.current);
      video.removeEventListener("canplay", retryPlayback);
    };
  }, []);

  const toggleAudio = () => {
    const video = vid.current;
    if (!video || window.scrollY > SOUND_HEADER_SCROLL_THRESHOLD) return;
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
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        poster="/assets/hero-poster.webp"
        onPlaying={handlePlaying}
        onError={handleVideoError}
        aria-label="Ruchi Realty showreel"
      >
        <source media="(max-width: 720px)" src={MOBILE_SHOWREEL} type="video/mp4" />
        <source src={SHOWREEL} type="video/mp4" />
      </video>
      {soundHost ? createPortal(<button className={`hero__sound${soundOn ? " is-on" : ""}`} type="button"
        onClick={toggleAudio} aria-pressed={soundOn} aria-label={soundOn ? "Mute hero video" : "Play hero video sound"}>
        <span className="hero__sound-icon" aria-hidden="true">
          {soundOn ? (
            <svg viewBox="0 0 24 24"><path d="M11 5 6.8 9H3v6h3.8l4.2 4V5Z"/><path d="M15 9.2a4 4 0 0 1 0 5.6"/><path d="M17.8 6.5a7.7 7.7 0 0 1 0 11"/></svg>
          ) : (
            <svg viewBox="0 0 24 24"><path d="M11 5 6.8 9H3v6h3.8l4.2 4V5Z"/><path d="m16 9 5 5M21 9l-5 5"/></svg>
          )}
        </span>
      </button>, soundHost) : null}

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
