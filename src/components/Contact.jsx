import { useState } from "react";
import { Reveal } from "./shared";
import { PROJECT_OPTIONS } from "../data/projects";

export function Contact() {
  const [f, setF] = useState({ name: "", phone: "", email: "", project: "", message: "" });
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const valid = f.name.trim() && f.phone.trim() && f.email.trim();
  const submit = async () => {
    if (!valid || sending) return;
    setSending(true);
    setError("");
    if (window.RuchiBackend?.leads) {
      const { error: submitError } = await window.RuchiBackend.leads.submitLead({
        ...f,
        interest: f.project || "General",
        notes: f.message,
        source: "Contact form",
      });
      if (submitError) {
        setError(submitError.message || "Could not send enquiry. Please try again.");
        setSending(false);
        return;
      }
    }
    setSending(false);
    setSent(true);
  };

  return (
    <section className="contact section-pad" id="contact" style={{ backgroundColor: "rgb(245, 244, 241)" }}>
      <div className="contact__sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <div className="contact-header-centered">
          <Reveal>
            <div className="eyebrow sec-eyebrow">Plan your visit</div>
            <h2 className="contact-head">
              Tell us which project<br /><span className="rr-grad">you would like to explore.</span>
            </h2>
            <p className="contact-lead">
              Share your preferred city, project and contact details. A member of the relevant project team will get in touch to answer questions or arrange a site visit.
            </p>
          </Reveal>
        </div>

        <div className="contact-grid">
          <Reveal delay={60} className="contact-left">
            <div className="contact-card">
              {sent ? (
                <div className="contact-thanks">
                  <div className="contact-thanks__tick">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#231f20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
                  </div>
                  <h3>Thank you, {f.name.split(" ")[0] || "there"}.</h3>
                  <p>We have your note. Someone from our team will be in touch without the hard sell.</p>
                </div>
              ) : (
                <div className="contact-form">
                  <div className="cf-row">
                    <div className="field"><label>Name</label>
                      <input value={f.name} onChange={set("name")} placeholder="Your full name" /></div>
                    <div className="field"><label>Phone</label>
                      <input value={f.phone} onChange={set("phone")} placeholder="+91" /></div>
                  </div>
                  <div className="field"><label>Email</label>
                    <input type="email" value={f.email} onChange={set("email")} placeholder="you@email.com" /></div>
                  <div className="field"><label>Project of interest</label>
                    <select value={f.project} onChange={set("project")}>
                      <option value="">Select a project</option>
                      {PROJECT_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select></div>
                  <div className="field"><label>Message</label>
                    <textarea rows={3} value={f.message} onChange={set("message")} placeholder="A short note is enough. We'll write back." /></div>
                  <div className="contact-actions">
                    <button className="submit-btn" onClick={submit} disabled={!valid || sending}>
                      {sending ? "Sending..." : "Send enquiry"}<span className="ar">→</span>
                    </button>
                    <span className="contact-note">No marketing. We reply within two working days.</span>
                  </div>
                  {error ? <p className="contact-error">{error}</p> : null}
                </div>
              )}
            </div>
          </Reveal>

          <div className="contact-right">
            <Reveal delay={90}>
              <div className="contact-map-card">
                <div className="contact-address-box">
                  <h3 className="contact-address-title">Ruchi Realty</h3>
                  <p className="contact-address-text">
                    Plot No. 2, 1, behind High Court, opp. Hotel Balwas, South Tukoganj, Indore, Madhya Pradesh 452001
                  </p>
                </div>
                <div className="contact-map-frame">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7537068.85098889!2d66.64855957031249!3d22.720457009025907!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3962fd15dbda96a9%3A0x765d5c8b1015c1f9!2sRuchi%20Realty!5e0!3m2!1sen!2sin!4v1784608322744!5m2!1sen!2sin"
                    width="100%"
                    height="380"
                    style={{ border: 0, borderRadius: "12px" }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                    title="Ruchi Realty Map"
                  ></iframe>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
