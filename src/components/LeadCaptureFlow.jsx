import { useMemo, useState } from "react";
import { PROJECT_OPTIONS } from "../data/projects";
import OtpVerification, { formatIndianPhoneForLead, getIndianPhoneDigits, isValidIndianPhone } from "./OtpVerification";

const CITY_OPTIONS = ["Kolkata", "Indore", "Bhopal"];

export function inferLeadCity(...values) {
  const text = values.filter(Boolean).join(" ").toLowerCase();
  if (text.includes("kolkata") || text.includes("new town") || text.includes("rajarhat") || text.includes("active acres")) return "Kolkata";
  if (text.includes("indore")) return "Indore";
  if (text.includes("bhopal")) return "Bhopal";
  return "";
}

export default function LeadCaptureFlow({
  initialProject = "",
  initialCity = "",
  projectSlug = null,
  source = "Website enquiry",
  leadAction = "callback",
  buttonLabel = "Request Callback",
  purpose = "enquiry",
  projectLocked = false,
  compact = false,
  onVerified,
}) {
  const resolvedCity = useMemo(() => initialCity || inferLeadCity(initialProject, projectSlug), [initialCity, initialProject, projectSlug]);
  const [form, setForm] = useState({ name: "", phone: "", project: initialProject, city: resolvedCity, message: "" });
  const [step, setStep] = useState("capture");
  const [leadId, setLeadId] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const field = (key) => (event) => setForm((current) => ({ ...current, [key]: event.target.value }));
  const valid = form.name.trim().length >= 2 && isValidIndianPhone(form.phone) && form.project.trim() && form.city.trim();

  const capture = async (event) => {
    event?.preventDefault();
    if (!valid || sending) return;
    if (!window.RuchiBackend?.leads) {
      setError("The enquiry service is temporarily unavailable. Please try again.");
      return;
    }
    setSending(true);
    setError("");
    const result = await window.RuchiBackend.leads.submitLead({
      name: form.name,
      phone: formatIndianPhoneForLead(form.phone),
      interest: form.project,
      city: form.city,
      notes: form.message,
      source,
      project_slug: projectSlug,
      lead_action: leadAction,
    });
    setSending(false);
    if (result?.error || !result?.data?.id) {
      setError(result?.error?.message || "Could not capture your request. Please try again.");
      return;
    }
    setLeadId(result.data.id);
    setStep("verify");
  };

  if (step === "verify") {
    return (
      <div className={`lead-verification-step ${compact ? "is-compact" : ""}`}>
        <span className="lead-step-label">Step 2 of 2</span>
        <h3>Verify your mobile number</h3>
        <p>Your request has been saved. Enter the OTP sent to +91 {getIndianPhoneDigits(form.phone)} to complete verification.</p>
        <OtpVerification
          value={form.phone}
          onChange={() => {}}
          onVerificationChange={(details) => {
            if (!details.verified) return;
            setStep("complete");
            onVerified?.({ ...details, leadId, form });
          }}
          purpose={purpose}
          leadId={leadId}
          autoSend
          phoneLocked
        />
        <small className="lead-capture-note">Your lead is already saved even if you complete verification later.</small>
      </div>
    );
  }

  if (step === "complete") {
    return (
      <div className="lead-flow-complete" role="status">
        <span aria-hidden="true">✓</span>
        <h3>Mobile number verified</h3>
        <p>Thank you. Our team will connect with you shortly.</p>
      </div>
    );
  }

  return (
    <form className={`lead-capture-form ${compact ? "is-compact" : ""}`} onSubmit={capture}>
      <span className="lead-step-label">Step 1 of 2</span>
      <div className="field lead-capture-field"><label>Name</label><input value={form.name} onChange={field("name")} placeholder="Your full name" required /></div>
      <div className="field lead-capture-field"><label>Phone</label><div className="otp-phone-input"><span className="otp-country-code" aria-label="India country code">+91</span><input type="tel" inputMode="numeric" autoComplete="tel-national" pattern="[6-9][0-9]{9}" value={getIndianPhoneDigits(form.phone)} onChange={(event) => setForm((current) => ({ ...current, phone: getIndianPhoneDigits(event.target.value) }))} placeholder="10-digit mobile number" required /></div></div>
      <div className="field lead-capture-field"><label>Project of interest</label>{projectLocked ? <input value={form.project} readOnly /> : <select value={form.project} onChange={field("project")} required><option value="">Select a project</option>{PROJECT_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}</select>}</div>
      <div className="field lead-capture-field"><label>City</label><select value={form.city} onChange={field("city")} required><option value="">Select a city</option>{CITY_OPTIONS.map((city) => <option key={city} value={city}>{city}</option>)}</select></div>
      <div className="field lead-capture-field lead-capture-message"><label>Message <small>(optional)</small></label><textarea rows={compact ? 2 : 3} value={form.message} onChange={field("message")} placeholder="How can we help?" /></div>
      <button className="submit-btn lead-capture-submit" type="submit" disabled={!valid || sending}>{sending ? "Saving your request..." : buttonLabel}<span className="ar" aria-hidden="true">→</span></button>
      <small className="lead-capture-note">We save your request first, then verify your mobile number.</small>
      {error ? <p className="contact-error" role="alert">{error}</p> : null}
    </form>
  );
}
