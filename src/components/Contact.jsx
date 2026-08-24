import { useState } from "react";
import { Reveal } from "./shared";
import LeadCaptureFlow from "./LeadCaptureFlow";

export function Contact({
  eyebrow = "Plan your visit",
  heading = <>Tell us which project<br /><span className="rr-grad">you would like to explore.</span></>,
  lead = "Share your preferred city, project and contact details. A member of the relevant project team will get in touch to answer questions or arrange a site visit.",
}) {
  const [sent, setSent] = useState(false);
  const [leadName, setLeadName] = useState("");

  return (
    <section className="contact section-pad" id="contact" style={{ backgroundColor: "rgb(245, 244, 241)" }}>
      <div className="contact__sig" aria-hidden="true"></div>
      <div className="rr-wrap">
        <div className="contact-header-centered">
          <Reveal>
            <div className="eyebrow sec-eyebrow">{eyebrow}</div>
            <h2 className="contact-head">{heading}</h2>
            <p className="contact-lead">{lead}</p>
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
                  <h3>Thank you, {leadName.split(" ")[0] || "there"}</h3>
                  <p>We have your note. Someone from our team will be in touch without the hard sell.</p>
                </div>
              ) : (
                <div className="contact-form"><LeadCaptureFlow source="Contact form" leadAction="callback" buttonLabel="Request Callback" purpose="contact" onVerified={({ form }) => { setLeadName(form.name); setSent(true); }} /></div>
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
