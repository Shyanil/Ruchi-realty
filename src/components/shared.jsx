import React, { useState, useEffect, useRef, useId } from "react";

/* ---- Scroll reveal ---- */
export function Reveal({ children, delay = 0, as = "div", className = "", style = {}, ...props }) {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { setSeen(true); io.unobserve(el); } });
    }, { threshold: 0.14, rootMargin: "0px 0px -7% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Tag = as;
  return (
    <Tag ref={ref} className={`reveal ${seen ? "in" : ""} ${className}`} {...props}
      style={{ transitionDelay: `${delay}ms`, ...style }}>
      {children}
    </Tag>
  );
}

/* ---- Resilient image: brand-gradient + monogram fallback ---- */
export function RImg({ src, alt = "", className = "", style = {}, grade = false, mono = true }) {
  const [ok, setOk] = useState(true);
  return (
    <div className={`rimg ${className}`} style={{ background: "var(--rr-gradient-brand)", ...style }}>
      {ok ? (
        <img src={src} alt={alt} loading="lazy" onError={() => setOk(false)}
          className="rimg__img" style={grade ? { filter: "brightness(0.92)" } : null} />
      ) : (
        mono ? <div className="rimg__mono" /> : null
      )}
    </div>
  );
}

/* ---- Animated stat counter ---- */
export function StatCounter({ value, suffix }) {
  const ref = useRef(null);
  const [n, setN] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let started = false;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !started) {
          started = true;
          if (reduce) { setN(value); io.disconnect(); return; }
          const dur = 1500, t0 = performance.now();
          const tick = (t) => {
            const p = Math.min(1, (t - t0) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            setN(Math.round(value * eased));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        }
      });
    }, { threshold: 0.5 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref}>{n.toLocaleString("en-US")}<span className="suffix">{suffix}</span></span>;
}

/* ---- Award seal: thin gradient ring + star, refined & quiet ---- */
export function AwardSeal({ id, year }) {
  const uid = useId();
  return (
    <svg viewBox="0 0 100 100" fill="none" aria-hidden="true" className="seal">
      <defs>
        <linearGradient id={`sl-${id || uid}`} x1="82%" y1="6%" x2="14%" y2="94%">
          <stop offset="0" stopColor="#c4d63f" />
          <stop offset="0.42" stopColor="#8cc06b" />
          <stop offset="0.74" stopColor="#5aa79f" />
          <stop offset="1" stopColor="#4a9fb8" />
        </linearGradient>
      </defs>
      {/* outer hairline ring */}
      <circle cx="50" cy="50" r="44" stroke={`url(#sl-${id || uid})`} strokeWidth="1.25" />
      {/* inner ring with small notches */}
      <circle cx="50" cy="50" r="36" stroke={`url(#sl-${id || uid})`} strokeWidth="0.75" strokeOpacity="0.55" strokeDasharray="1.5 4.5" />
      {/* center star */}
      <path d="M50 33 l3.6 7.4 8.1 1.1 -5.9 5.7 1.4 8.1 -7.2 -3.8 -7.2 3.8 1.4 -8.1 -5.9 -5.7 8.1 -1.1z"
        fill={`url(#sl-${id || uid})`} fillOpacity="0.9" />
      {/* twin laurel ticks at base */}
      <path d="M34 70 q6 6 16 6 q10 0 16 -6" stroke={`url(#sl-${id || uid})`} strokeWidth="1" strokeLinecap="round" fill="none" />
    </svg>
  );
}

/* ---- Why-choose icons (Lucide-style, 1.5 stroke) ---- */
const ICON_PATHS = {
  "shield-check": '<path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"/><path d="M9 12l2 2 4-4"/>',
  "calendar-check": '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18"/><path d="M9 15l2 2 4-4"/>',
  "file-text": '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 17h6"/>',
  "ruler": '<path d="M3 15l6 6 12-12-6-6L3 15z"/><path d="M8 10l2 2M11 7l2 2M14 4l2 2M5 13l2 2"/>',
  "map-pin": '<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  "handshake": '<path d="M11 17l2 2a1.4 1.4 0 0 0 2-2"/><path d="M13 19l2 2a1.4 1.4 0 0 0 2-2l1-1"/><path d="M3 11l3 3 4-4 3 3"/><path d="M18 16l3-3-5-5-3 1H8L3 9"/>',
};

export function Icon({ name, className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24"
      dangerouslySetInnerHTML={{ __html: ICON_PATHS[name] || "" }}
      strokeLinecap="round" strokeLinejoin="round" />
  );
}

/* ---- Custom cursor ---- */
export function CustomCursor() {
  const ring = useRef(null), dot = useRef(null);
  const [mode, setMode] = useState("");
  const [label, setLabel] = useState("");
  useEffect(() => {
    if (window.matchMedia("(hover: none)").matches) return;
    let rx = 0, ry = 0, dx = 0, dy = 0, raf;
    const move = (e) => {
      dx = e.clientX; dy = e.clientY;
      if (dot.current) dot.current.style.transform = `translate(${dx}px,${dy}px) translate(-50%,-50%)`;
      const t = e.target.closest("[data-cursor]");
      if (t) { setMode("label"); setLabel(t.getAttribute("data-cursor")); }
      else { setMode(""); setLabel(""); }
      ring.current && ring.current.classList.add("show");
      dot.current && dot.current.classList.add("show");
    };
    const loop = () => {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      if (ring.current) ring.current.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
      raf = requestAnimationFrame(loop);
    };
    const leave = () => { ring.current && ring.current.classList.remove("show"); dot.current && dot.current.classList.remove("show"); };
    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    raf = requestAnimationFrame(loop);
    return () => { window.removeEventListener("mousemove", move); document.removeEventListener("mouseleave", leave); cancelAnimationFrame(raf); };
  }, []);
  return (
    <>
      <div ref={ring} className={`cursor-ring ${mode === "label" ? "label" : ""}`}>
        <span className="cursor-ring__txt">{label}</span>
      </div>
      <div ref={dot} className="cursor-dot"></div>
    </>
  );
}
