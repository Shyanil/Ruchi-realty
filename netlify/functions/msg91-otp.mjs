const MSG91_BASE_URL = "https://control.msg91.com/api/v5/otp";
const env = (name) => globalThis?.process?.env?.[name] || globalThis?.Netlify?.env?.get?.(name) || "";
const JSON_HEADERS = { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store" };
function json(status, body) { return new Response(JSON.stringify(body), { status, headers: JSON_HEADERS }); }
function normalizeIndianMobile(value) { const digits = String(value || "").replace(/\D/g, ""); const local = digits.length === 12 && digits.startsWith("91") ? digits.slice(2) : digits; return /^[6-9]\d{9}$/.test(local) ? `91${local}` : ""; }
function providerSucceeded(payload) { const type = String(payload?.type || payload?.status || "").toLowerCase(); const message = String(payload?.message || payload?.error || "").toLowerCase(); const failed = type === "error" || type === "failed" || type === "failure" || message.includes("invalid auth") || message.includes("unauthorized") || message.includes("error"); return !failed && (type === "success" || payload?.verified === true || message.includes("otp verified success") || message.includes("otp sent") || message.includes("success")); }
function providerError(payload, fallback) {
  const message = String(payload?.message || payload?.error || "").toLowerCase();
  if (message.includes("ip is not whitelisted") || message.includes("ip whitelist")) return "MSG91 is blocking this server IP. Disable IP whitelisting in MSG91 or whitelist your hosting server, then try again.";
  if (message.includes("expired")) return "This OTP has expired. Please request a new OTP.";
  if (message.includes("invalid") || message.includes("incorrect") || message.includes("mismatch")) return "The OTP is incorrect. Please check it and try again.";
  if (message.includes("retry") || message.includes("maximum") || message.includes("limit")) return "Too many OTP attempts. Please wait and try again later.";
  return fallback;
}
async function callMsg91(action, mobile, otp, authKey, templateId) {
  const url = new URL(action === "verify" ? `${MSG91_BASE_URL}/verify` : action === "resend" ? `${MSG91_BASE_URL}/retry` : MSG91_BASE_URL);
  url.searchParams.set("mobile", mobile); url.searchParams.set("authkey", authKey);
  const request = { headers: { Accept: "application/json", authkey: authKey } };
  if (action === "send") { url.searchParams.set("template_id", templateId); request.method = "POST"; request.headers["Content-Type"] = "application/json"; request.body = "{}"; }
  else if (action === "verify") { url.searchParams.set("otp", otp); request.method = "GET"; }
  else { url.searchParams.set("retrytype", "text"); request.method = "GET"; }
  const response = await fetch(url, request); const text = await response.text(); let payload = {};
  try { payload = text ? JSON.parse(text) : {}; } catch { payload = { message: text }; }
  return { ok: response.ok && providerSucceeded(payload), payload };
}
export default async (request) => {
  if (request.method !== "POST") return json(405, { error: "Method not allowed." });
  const authKey = env("MSG91_AUTH_KEY"); const templateId = env("MSG91_TEMPLATE_ID");
  if (!authKey || !templateId) return json(503, { error: "OTP service is not configured." });
  let body; try { body = await request.json(); } catch { return json(400, { error: "Invalid request." }); }
  const action = String(body?.action || "").toLowerCase(); if (!["send", "verify", "resend"].includes(action)) return json(400, { error: "Invalid OTP action." });
  const mobile = normalizeIndianMobile(body?.mobile); if (!mobile) return json(400, { error: "Enter a valid 10-digit Indian mobile number." });
  const otp = String(body?.otp || "").trim(); if (action === "verify" && !/^\d{4,8}$/.test(otp)) return json(400, { error: "Enter the OTP sent to your mobile number." });
  try { const result = await callMsg91(action, mobile, otp, authKey, templateId); if (!result.ok) { const fallback = action === "verify" ? "Could not verify the OTP. Please try again." : action === "resend" ? "Could not resend the OTP. Please try again." : "Could not send the OTP. Please try again."; return json(502, { error: providerError(result.payload, fallback) }); } return json(200, { success: true, verified: action === "verify" }); } catch { return json(502, { error: "The OTP service is temporarily unavailable. Please try again." }); }
};
export const config = { path: "/api/otp", rateLimit: { windowLimit: 10, windowSize: 60, aggregateBy: ["ip", "domain"] } };
