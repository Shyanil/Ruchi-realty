import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import LeadCaptureFlow from "./LeadCaptureFlow";

const CALL_URL = "tel:+918929225275";
const WHATSAPP_URL = "https://wa.me/919630096112?text=Hello%20Ruchi%20Realty%2C%20I%20would%20like%20to%20know%20more%20about%20your%20projects.";

const ICONS = {
  call: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.2 3.5 4.8 4.6c-.9.4-1.3 1.4-1 2.3 2.1 6.1 7.1 11.1 13.2 13.2.9.3 1.9-.1 2.3-1l1.1-2.4c.4-.9.1-1.9-.8-2.4l-3-1.7c-.8-.4-1.7-.3-2.3.4l-1.1 1.3a13.5 13.5 0 0 1-3.6-3.6l1.3-1.1c.7-.6.8-1.5.4-2.3l-1.7-3c-.5-.9-1.5-1.2-2.4-.8Z" /></svg>,
  whatsapp: <svg viewBox="0 0 32 32" aria-hidden="true"><path d="M16 3.2A12.7 12.7 0 0 0 5.1 22.5L3.3 29l6.7-1.8A12.7 12.7 0 1 0 16 3.2Zm0 23a10.2 10.2 0 0 1-5.2-1.4l-.4-.2-4 1 1.1-3.9-.2-.4A10.3 10.3 0 1 1 16 26.2Zm5.6-7.7c-.3-.2-1.8-.9-2.1-1-.3-.1-.5-.2-.7.1-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.3-.5-2.4-1.5a9.1 9.1 0 0 1-1.7-2.1c-.2-.3 0-.5.1-.6l.5-.6c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-.9-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1.1 1-1.1 2.5s1.1 3 1.3 3.2c.1.2 2.1 3.3 5.2 4.6.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.8-.7 2.1-1.5.2-.7.2-1.3.2-1.4-.1-.2-.3-.2-.6-.4Z" /></svg>,
  enquire: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 3.5h10a2 2 0 0 1 2 2v5.7M8 8h6M8 12h3M6 20.5H5a2 2 0 0 1-2-2v-13a2 2 0 0 1 2-2"/><path d="m13.4 18.7 5.8-5.8 1.9 1.9-5.8 5.8-2.7.7.8-2.6Z"/></svg>,
  chat: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 3v-3a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2Z"/><path d="M7 9h10M7 13h6"/></svg>,
};

function HouseIcon() {
  return <svg className="conversion-house" viewBox="0 0 48 48" aria-hidden="true">
    <path className="conversion-house__roof" d="M5 22 24 6l19 16" />
    <path className="conversion-house__body" d="M10 20v22h28V20" />
    <path className="conversion-house__door conversion-house__door--left" d="M19 28h5v14h-5Z" />
    <path className="conversion-house__door conversion-house__door--right" d="M24 28h5v14h-5Z" />
  </svg>;
}

const LOCAL_SEO_ROUTES = new Set([
  "/residential-projects-in-kolkata",
  "/plots-in-indore",
  "/commercial-property-in-kolkata",
  "/flats-in-new-town-kolkata",
  "/real-estate-developer-in-indore",
  "/real-estate-developer-in-kolkata",
]);

const isConversionRoute = (pathname) => pathname === "/" || pathname === "/projects" || pathname.startsWith("/projects/") || pathname === "/blogs" || pathname.startsWith("/blogs/") || pathname === "/media" || pathname.startsWith("/media/") || pathname === "/Projects.html" || LOCAL_SEO_ROUTES.has(pathname);

export default function WhatsAppChat() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const visible = isConversionRoute(pathname);

  useEffect(() => {
    setOpen(false);
    setChatOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.classList.toggle("has-mobile-conversion-bar", visible);
    return () => document.body.classList.remove("has-mobile-conversion-bar");
  }, [visible]);

  useEffect(() => {
    if (!chatOpen) return undefined;
    const onKeyDown = (event) => { if (event.key === "Escape") setChatOpen(false); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [chatOpen]);

  if (!visible) return null;

  const enquire = () => {
    setOpen(false);
    const target = document.querySelector("#enquire, #contact, #project-details .victoria-hero-form, .contact-form");
    if (target) target.scrollIntoView({ behavior: "smooth", block: "start" });
    else navigate("/contact#enquiries");
  };

  const actions = <>
    <a className="conversion-action conversion-action--call" href={CALL_URL} aria-label="Call Ruchi Realty">{ICONS.call}<span>Call</span></a>
    <a className="conversion-action conversion-action--whatsapp" href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp Ruchi Realty">{ICONS.whatsapp}<span>W/P</span></a>
    <button className="conversion-action conversion-action--enquire" type="button" onClick={enquire} aria-label="Open enquiry form">{ICONS.enquire}<span>Enquire</span></button>
    <button className="conversion-action conversion-action--chat" type="button" onClick={() => { setOpen(false); setChatOpen(true); }} aria-label="Chat with the Ruchi Realty sales team">{ICONS.chat}<span>Chat</span></button>
  </>;

  return <>
    <nav className="mobile-conversion-bar" aria-label="Quick contact options">{actions}</nav>
    <div className={`desktop-conversion-dock${open ? " is-open" : ""}`}>
      <nav className="desktop-conversion-dock__actions" aria-label="Quick contact options">{actions}</nav>
      <button className="desktop-conversion-dock__launcher" type="button" aria-expanded={open} aria-label={open ? "Close contact options" : "Open contact options"} onClick={() => setOpen((value) => !value)}><HouseIcon /></button>
    </div>
    {chatOpen ? <div className="conversion-chat-layer" role="dialog" aria-modal="true" aria-label="Chat with Ruchi Realty" onClick={() => setChatOpen(false)}>
      <section className="conversion-chat-panel" onClick={(event) => event.stopPropagation()}>
        <header><div><span>Sales assistance</span><h2>Chat with our team</h2><p>Leave your details and message. Our team will contact you shortly.</p></div><button type="button" onClick={() => setChatOpen(false)} aria-label="Close chat">&times;</button></header>
        <LeadCaptureFlow source={`Sticky chat - ${pathname}`} leadAction="callback" buttonLabel="Start Conversation" purpose="sticky-chat" compact />
      </section>
    </div> : null}
  </>;
}
