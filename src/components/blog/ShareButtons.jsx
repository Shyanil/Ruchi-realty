import { useState } from "react";

const icons = {
  whatsapp: <><path d="M15 3.2A11.3 11.3 0 0 0 5.3 20.3L3.8 26l5.9-1.5A11.3 11.3 0 1 0 15 3.2Z" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M10.1 9.1c.3-.5.6-.5.9-.5h.7c.2 0 .4.1.5.5l1 2.4c.1.3.1.5-.1.8l-.8 1c-.2.2-.1.5 0 .7.9 1.6 2.2 2.8 3.9 3.6.3.1.5.1.7-.1l1-1.2c.2-.3.5-.3.8-.2l2.3 1.1c.3.2.5.3.5.5 0 .3-.2 1.7-1.1 2.5-.7.7-1.8 1-2.8.8-1.2-.2-3.1-.8-5.2-2.6-2.5-2.1-4.1-4.8-4.5-6.2-.4-1.2.1-2.4.7-3.1Z" /></>,
  facebook: <path d="M14 8h3V4.2c-.5-.1-2.3-.2-4.3-.2C8.6 4 7 6.5 7 9.7V13H3v4h4v11h5V17h4l.7-4H12V10c0-1.2.3-2 2-2Z" />,
  x: <path d="M18.9 3h4.6l-10 11.4L25.2 29H16l-7.2-9.4L.6 29H-4l10.7-12.2L-4.5 3H5l6.5 8.6L18.9 3Zm-1.6 23.4h2.5L3.6 5.5H.9l16.4 20.9Z" transform="translate(5)" />,
  linkedin: <path d="M5 3.5A2.5 2.5 0 1 0 5 8a2.5 2.5 0 0 0 0-4.5ZM3 10h4v14H3V10Zm7 0h4v2c.8-1.3 2.1-2.4 4.4-2.4 4.3 0 5.1 2.8 5.1 6.5V24h-4v-7c0-1.7 0-3.8-2.4-3.8s-2.7 1.8-2.7 3.7V24h-4V10Z" />,
  email: <path d="M3 6h22a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2Zm11 11L3.5 9v14h21V9L14 17Zm0-3 7.8-6H6.2l7.8 6Z" />,
  copy: <path d="M10 8V5a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v12a3 3 0 0 1-3 3h-3v5a3 3 0 0 1-3 3H7a3 3 0 0 1-3-3V11a3 3 0 0 1 3-3h3Zm3 0h6a3 3 0 0 1 3 3v6h3V5H13v3Zm-6 3v14h12V11H7Z" />,
  share: <path d="M23 20a4 4 0 0 0-3.2 1.6l-9-5a4 4 0 0 0 0-2.2l9-5A4 4 0 1 0 18.4 7l-9 5A4 4 0 1 0 9.4 19l9 5A4 4 0 1 0 23 20Z" />,
};
function Icon({ name }) { return <svg viewBox="0 0 30 30" aria-hidden="true">{icons[name]}</svg>; }
export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false); const encodedUrl = encodeURIComponent(url); const encodedTitle = encodeURIComponent(title);
  const open = (href) => window.open(href, "_blank", "noopener,noreferrer,width=720,height=620");
  const copy = async () => { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1800); };
  const item = (name, label, action) => <button className={`share-button share-button--${name}`} onClick={action} aria-label={`Share on ${label}`} title={label}><Icon name={name} /><span>{label}</span></button>;
  return <div className="share-buttons" aria-label="Share this article"><span className="share-buttons__label">Share</span>{item("whatsapp", "WhatsApp", () => open(`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`))}{item("facebook", "Facebook", () => open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`))}{item("x", "X", () => open(`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`))}{item("linkedin", "LinkedIn", () => open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`))}<a className="share-button share-button--email" href={`mailto:?subject=${encodedTitle}&body=${encodedUrl}`} aria-label="Share by email" title="Email"><Icon name="email" /><span>Email</span></a>{item("copy", copied ? "Copied" : "Copy link", copy)}{navigator.share && item("share", "More", () => navigator.share({ title, url }))}</div>;
}
