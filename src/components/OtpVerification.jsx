import { useEffect, useId, useMemo, useState } from "react";
import {
  getMsg91ErrorMessage,
  resendMsg91Otp,
  sendMsg91Otp,
  verifyMsg91Otp,
} from "../services/msg91Otp";

const RESEND_SECONDS = 30;

export function getIndianPhoneDigits(value) {
  const digits = String(value || "").replace(/\D/g, "");
  if (digits.length > 10 && digits.startsWith("91")) return digits.slice(2, 12);
  return digits.slice(0, 10);
}

export function isValidIndianPhone(value) {
  return /^[6-9]\d{9}$/.test(getIndianPhoneDigits(value));
}

export function formatIndianPhoneForLead(value) {
  const digits = getIndianPhoneDigits(value);
  return digits ? `+91${digits}` : "";
}

export default function OtpVerification({
  value,
  onChange,
  onVerificationChange,
  purpose = "enquiry",
  label = "Phone",
  className = "field",
  required = true,
}) {
  const reactId = useId();
  const safeId = useMemo(() => `${purpose}-${reactId}`.replace(/[^a-zA-Z0-9_-]/g, ""), [purpose, reactId]);
  const inputId = `mobile-${safeId}`;
  const localPhone = getIndianPhoneDigits(value);
  const [phase, setPhase] = useState("idle");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(0);

  const verified = phase === "verified";
  const busy = phase === "sending" || phase === "verifying" || phase === "resending";

  useEffect(() => {
    if (!countdown) return undefined;
    const timer = window.setInterval(() => setCountdown((current) => Math.max(0, current - 1)), 1000);
    return () => window.clearInterval(timer);
  }, [countdown > 0]);

  const notifyVerification = (nextVerified) => {
    onVerificationChange?.({
      verified: nextVerified,
      normalizedPhone: localPhone ? `91${localPhone}` : "",
      purpose,
    });
  };

  const clearVerification = () => {
    setPhase("idle");
    setOtp("");
    setMessage("");
    setCountdown(0);
    notifyVerification(false);
  };

  const changePhone = (event) => {
    const nextPhone = getIndianPhoneDigits(event.target.value);
    if (nextPhone !== localPhone && phase !== "idle") clearVerification();
    onChange(nextPhone);
  };

  const sendOtp = async () => {
    if (busy || phase === "sent" || verified) return;
    if (!isValidIndianPhone(localPhone)) {
      setMessage("Enter a valid 10-digit Indian mobile number.");
      return;
    }
    setPhase("sending");
    setMessage("");
    try {
      await sendMsg91Otp(localPhone);
      setPhase("sent");
      setMessage("OTP sent successfully. Please check your mobile.");
      setCountdown(RESEND_SECONDS);
    } catch (error) {
      setPhase("idle");
      setMessage(getMsg91ErrorMessage(error, "send"));
    }
  };

  const verifyOtp = async () => {
    if (busy || !/^\d{4,8}$/.test(otp)) {
      if (!busy) setMessage("Enter the OTP sent to your mobile number.");
      return;
    }
    setPhase("verifying");
    setMessage("");
    try {
      await verifyMsg91Otp(localPhone, otp);
      setPhase("verified");
      setMessage("Mobile number verified");
      notifyVerification(true);
    } catch (error) {
      setPhase("sent");
      setMessage(getMsg91ErrorMessage(error, "verify"));
    }
  };

  const resendOtp = async () => {
    if (busy || countdown > 0 || verified) return;
    setPhase("resending");
    setMessage("");
    try {
      await resendMsg91Otp(localPhone);
      setPhase("sent");
      setOtp("");
      setMessage("A new OTP has been sent.");
      setCountdown(RESEND_SECONDS);
    } catch (error) {
      setPhase("sent");
      setMessage(getMsg91ErrorMessage(error, "resend"));
    }
  };

  return (
    <div className={`otp-verification ${className}`.trim()} data-otp-purpose={purpose}>
      <label htmlFor={inputId}><span>{label}</span></label>
      <div className="otp-send-row">
        <div className="otp-phone-input">
          <span className="otp-country-code" aria-label="India country code">+91</span>
          <input
            id={inputId}
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            pattern="[6-9][0-9]{9}"
            required={required}
            value={localPhone}
            onChange={changePhone}
            placeholder="10-digit mobile number"
            aria-describedby={`${inputId}-hint ${inputId}-status`}
          />
        </div>
        {phase === "idle" || phase === "sending" ? (
          <button className="otp-action" type="button" onClick={sendOtp} disabled={busy || !isValidIndianPhone(localPhone)}>
            {phase === "sending" ? "Sending OTP..." : "Send OTP"}
          </button>
        ) : null}
      </div>
      <small className="otp-hint" id={`${inputId}-hint`}>Enter only your 10-digit Indian mobile number.</small>

      {phase === "sent" || phase === "verifying" || phase === "resending" ? (
        <div className="otp-challenge">
          <label htmlFor={`${inputId}-otp`}><span>Enter OTP</span></label>
          <div className="otp-verify-row">
            <input
              id={`${inputId}-otp`}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={8}
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 8))}
              placeholder="OTP"
            />
            <button className="otp-action" type="button" onClick={verifyOtp} disabled={busy || !/^\d{4,8}$/.test(otp)}>
              {phase === "verifying" ? "Verifying..." : "Verify OTP"}
            </button>
          </div>
          <button className="otp-resend" type="button" onClick={resendOtp} disabled={busy || countdown > 0}>
            {phase === "resending" ? "Resending..." : countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
          </button>
        </div>
      ) : null}

      {verified ? <p className="otp-status is-success" id={`${inputId}-status`} role="status">✓ Mobile number verified</p> : null}
      {!verified && message ? <p className={`otp-status ${message.toLowerCase().includes("sent") ? "is-info" : "is-error"}`} id={`${inputId}-status`} role="status">{message}</p> : null}
    </div>
  );
}
