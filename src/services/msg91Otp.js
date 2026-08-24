const OTP_API_URL = "/api/otp";

async function requestOtp(action, mobile, otp = "", leadId = "") {
  const response = await fetch(OTP_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, mobile, ...(otp ? { otp } : {}), ...(leadId ? { leadId } : {}) }),
  });

  let payload = {};
  try {
    payload = await response.json();
  } catch {
    // A deployment or proxy error may return a non-JSON response.
  }

  if (!response.ok || !payload.success) {
    throw new Error(payload.error || "The OTP service is temporarily unavailable. Please try again.");
  }
  return payload;
}

export function sendMsg91Otp(mobile) {
  return requestOtp("send", mobile);
}

export function verifyMsg91Otp(mobile, otp, leadId = "") {
  return requestOtp("verify", mobile, otp, leadId);
}

export function resendMsg91Otp(mobile) {
  return requestOtp("resend", mobile);
}

export function getMsg91ErrorMessage(error, action = "send") {
  const raw = typeof error === "string" ? error : error?.message;
  if (raw) return String(raw);
  if (action === "verify") return "Could not verify the OTP. Please try again.";
  if (action === "resend") return "Could not resend the OTP. Please try again.";
  return "Could not send the OTP. Please try again.";
}
