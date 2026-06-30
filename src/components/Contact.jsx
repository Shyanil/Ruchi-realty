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
        <div className="contact-grid">
          <div className="contact-left">
            <Reveal>
              <div className="eyebrow sec-eyebrow">Talk to us</div>
              <h2 className="contact-head">Come and see<br /><span className="rr-grad">for yourself.</span></h2>
              <p className="contact-lead">
                Tell us a little about what you are looking for. Someone who knows the projects — not a call centre — will write back.
              </p>
            </Reveal>
            <Reveal delay={90}>
              <div className="visit-list">
                {[
                ["Experience Centre", "Walk through plans, finishes, and materials with our team."],
                ["Private Viewings", "See a ready home or a project as it takes shape, by appointment."],
                ["Enquiries", "Prefer to write? Reach us and we will follow up, calmly."]].
                map(([t, d]) =>
                <div className="visit-opt" key={t}>
                    <div className="visit-opt__t">{t}</div>
                    <div className="visit-opt__d">{d}</div>
                  </div>
                )}
              </div>
            </Reveal>
          </div>

          <Reveal delay={60} className="contact-right">
            <div className="contact-card">
              {sent ?
              <div className="contact-thanks">
                  <div className="contact-thanks__tick">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#231f20" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12l4 4 10-10" /></svg>
                  </div>
                  <h3>Thank you, {f.name.split(" ")[0] || "there"}.</h3>
                  <p>We have your note. Someone from our team will be in touch — without the hard sell.</p>
                </div> :

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
                    <textarea rows={3} value={f.message} onChange={set("message")} placeholder="A short note is enough — we'll write back." /></div>
                  <div className="contact-actions">
                    <button className="submit-btn" onClick={submit} disabled={!valid || sending}>
                      {sending ? "Sending..." : "Send enquiry"}<span className="ar">→</span>
                    </button>
                    <span className="contact-note">No marketing. We reply within two working days.</span>
                  </div>
                  {error ? <p className="contact-error">{error}</p> : null}
                </div>
              }
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
