const TURNSTILE_VERIFY_URL = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
const TEST_SITE_KEY = "1x00000000000000000000AA";
const TEST_SECRET_KEY = "1x0000000000000000000000000000000AA";
const DEFAULT_SUPABASE_URL = "https://dychmqnydalfthfxzpnl.supabase.co";
const JSON_HEADERS = {
  "Content-Type": "application/json; charset=utf-8",
  "Cache-Control": "no-store",
};

const env = (name) => globalThis?.process?.env?.[name] || globalThis?.Netlify?.env?.get?.(name) || "";
const json = (status, body) => new Response(JSON.stringify(body), { status, headers: JSON_HEADERS });
const isLocalRequest = (request) => ["localhost", "127.0.0.1", "0.0.0.0"].includes(new URL(request.url).hostname);

function clientIp(request) {
  return String(
    request.headers.get("x-nf-client-connection-ip") ||
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    "",
  ).split(",")[0].trim();
}

async function verifyTurnstile(token, secret, remoteIp) {
  const payload = new URLSearchParams({ secret, response: token });
  if (remoteIp) payload.set("remoteip", remoteIp);

  const response = await fetch(TURNSTILE_VERIFY_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: payload,
  });
  if (!response.ok) throw new Error("Turnstile verification service returned an error.");
  return response.json();
}

async function insertComment(comment) {
  const supabaseUrl = env("SUPABASE_URL") || DEFAULT_SUPABASE_URL;
  const serviceRoleKey = env("SUPABASE_SERVICE_ROLE_KEY");
  if (!serviceRoleKey) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");

  const response = await fetch(`${supabaseUrl}/rest/v1/blog_comments`, {
    method: "POST",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal",
    },
    body: JSON.stringify(comment),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error("Comment insert failed:", response.status, details);
    throw new Error("Could not save the comment.");
  }
}

export default async (request) => {
  const local = isLocalRequest(request);
  const siteKey = env("TURNSTILE_SITE_KEY") || (local ? TEST_SITE_KEY : "");

  if (request.method === "GET") {
    if (!siteKey) return json(503, { error: "Comment verification is not configured." });
    return json(200, { siteKey });
  }

  if (request.method !== "POST") return json(405, { error: "Method not allowed." });

  let body;
  try {
    body = await request.json();
  } catch {
    return json(400, { error: "Invalid request." });
  }

  const blogId = String(body?.blogId || "").trim();
  const name = String(body?.name || "").trim().slice(0, 80);
  const email = String(body?.email || "").trim().toLowerCase().slice(0, 160);
  const comment = String(body?.comment || "").trim().slice(0, 3000);
  const website = String(body?.website || "").trim();
  const turnstileToken = String(body?.turnstileToken || "").trim();

  if (website) return json(200, { success: true });
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(blogId)) {
    return json(400, { error: "Invalid blog article." });
  }
  if (name.length < 2) return json(400, { error: "Please enter your name." });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { error: "Please enter a valid email address." });
  if (comment.length < 10) return json(400, { error: "Please write at least 10 characters." });
  if (!turnstileToken || turnstileToken.length > 2048) {
    return json(400, { error: "Please complete the security verification." });
  }

  const secretKey = env("TURNSTILE_SECRET_KEY") || (local ? TEST_SECRET_KEY : "");
  if (!siteKey || !secretKey) return json(503, { error: "Comment verification is not configured." });

  try {
    const verification = await verifyTurnstile(turnstileToken, secretKey, clientIp(request));
    const actionIsValid = secretKey === TEST_SECRET_KEY || verification.action === "blog_comment";
    if (!verification.success || !actionIsValid) {
      console.warn("Turnstile rejected a blog comment:", verification["error-codes"] || [], verification.action || "");
      return json(400, { error: "Security verification failed or expired. Please try again." });
    }

    await insertComment({ blog_id: blogId, name, email, comment, status: "pending" });
    return json(200, { success: true });
  } catch (error) {
    console.error("Protected comment submission failed:", error?.message || error);
    return json(502, { error: "Comment submission is temporarily unavailable. Please try again." });
  }
};

export const config = {
  path: "/api/blog-comments",
  rateLimit: { windowLimit: 20, windowSize: 60, aggregateBy: ["ip", "domain"] },
};
