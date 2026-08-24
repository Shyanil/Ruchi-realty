import { useState } from "react";
import LeadCaptureFlow, { inferLeadCity } from "./LeadCaptureFlow";

export default function BrochureLeadPopup({ project, city = "", slug, source, brochureUrl = "", onClose }) {
  const [complete, setComplete] = useState(false);

  const deliver = () => {
    setComplete(true);
    if (!brochureUrl) return;
    const link = document.createElement("a");
    link.href = brochureUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className="osc-popup-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-label={brochureUrl ? "Download brochure" : "Project enquiry"}>
      <div className="osc-popup" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="osc-popup__close" onClick={onClose} aria-label="Close">×</button>
        {complete ? <>
          <h3>Thank You!</h3>
          <p>{brochureUrl ? "Your brochure is ready. If it did not open automatically, use the button below. Your verified request has also been shared with our project team." : "Your mobile number is verified. Our project team will contact you shortly."}</p>
          {brochureUrl ? <a className="submit-btn" href={brochureUrl} target="_blank" rel="noopener noreferrer" style={{ width: "100%", justifyContent: "center", boxSizing: "border-box" }}>Open Brochure<span className="ar" aria-hidden="true">→</span></a> : null}
          <button className="submit-btn" type="button" onClick={onClose} style={{ width: "100%", justifyContent: "center" }}>Close<span className="ar" aria-hidden="true">→</span></button>
        </> : <>
          <h3>{brochureUrl ? "Download Brochure" : "Get Project Details"}</h3>
          <p>Share your details first, then verify your mobile number to {brochureUrl ? "start the download" : "complete your request"}.</p>
          <LeadCaptureFlow initialProject={project} initialCity={city || inferLeadCity(project, slug)} projectSlug={slug} source={source} leadAction={brochureUrl ? "brochure" : "project_details"} buttonLabel={brochureUrl ? "Continue to Download" : "Get Project Details"} purpose="brochure" projectLocked onVerified={deliver} />
        </>}
      </div>
    </div>
  );
}
