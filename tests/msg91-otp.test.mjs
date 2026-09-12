import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import otpHandler from "../netlify/functions/msg91-otp.mjs";

const originalFetch = globalThis.fetch;
const LEAD_ID = "11111111-1111-4111-8111-111111111111";
const LEAD = {
  id: LEAD_ID,
  name: "Test Lead",
  phone: "+919876543210",
  verification_status: "unverified",
  crm_status: "not_sent",
};

before(() => {
  process.env.MSG91_AUTH_KEY = "test-auth-key";
  process.env.MSG91_TEMPLATE_ID = "test-template-id";
  process.env.SUPABASE_URL = "https://example.supabase.co";
  process.env.SUPABASE_SECRET_KEY = "sb_secret_test-key";
});

after(() => {
  globalThis.fetch = originalFetch;
});

function verifyRequest(otp = "123456") {
  return new Request("https://example.com/api/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action: "verify", mobile: "9876543210", otp, leadId: LEAD_ID }),
  });
}

function isLeadRequest(url) {
  return String(url).includes("/rest/v1/leads");
}

test("marks a captured lead verified with the server-only Supabase secret", async () => {
  const requests = [];
  globalThis.fetch = async (url, options = {}) => {
    requests.push({ url: String(url), options });
    if (isLeadRequest(url) && options.method === "GET") {
      assert.equal(options.headers.apikey, "sb_secret_test-key");
      assert.equal(options.headers.Authorization, undefined);
      return new Response(JSON.stringify([LEAD]), { status: 200 });
    }
    if (String(url).includes("control.msg91.com")) {
      return new Response(JSON.stringify({ type: "success", message: "OTP verified successfully" }), { status: 200 });
    }
    if (isLeadRequest(url) && options.method === "PATCH") {
      const update = JSON.parse(options.body);
      assert.equal(update.verification_status, "verified");
      assert.ok(update.verified_at);
      return new Response(null, { status: 204 });
    }
    throw new Error(`Unexpected request: ${url}`);
  };

  const response = await otpHandler(verifyRequest());
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.verified, true);
  assert.equal(payload.storageStatus, "saved");
  assert.ok(requests[0].url.includes("/rest/v1/leads"), "storage must be checked before MSG91 consumes the OTP");
});

test("does not report a false success when the database update fails", async () => {
  globalThis.fetch = async (url, options = {}) => {
    if (isLeadRequest(url) && options.method === "GET") return new Response(JSON.stringify([LEAD]), { status: 200 });
    if (String(url).includes("control.msg91.com")) return new Response(JSON.stringify({ status: "ok", message: "otp_verified" }), { status: 200 });
    if (isLeadRequest(url) && options.method === "PATCH") return new Response(JSON.stringify({ message: "write failed" }), { status: 500 });
    throw new Error(`Unexpected request: ${url}`);
  };

  const response = await otpHandler(verifyRequest());
  const payload = await response.json();

  assert.equal(response.status, 502);
  assert.equal(payload.success, false);
  assert.equal(payload.verified, false);
  assert.equal(payload.otpVerified, true);
  assert.equal(payload.storageStatus, "failed");
});

test("returns a validation response for an incorrect OTP", async () => {
  globalThis.fetch = async (url, options = {}) => {
    if (isLeadRequest(url) && options.method === "GET") return new Response(JSON.stringify([LEAD]), { status: 200 });
    return new Response(JSON.stringify({ type: "error", message: "OTP not match" }), { status: 200 });
  };

  const response = await otpHandler(verifyRequest("654321"));
  const payload = await response.json();

  assert.equal(response.status, 422);
  assert.match(payload.error, /incorrect/i);
});

test("requires a server-only Supabase key before consuming an OTP", async () => {
  const secret = process.env.SUPABASE_SECRET_KEY;
  const legacySecret = process.env.SUPABASE_SERVICE_ROLE_KEY;
  delete process.env.SUPABASE_SECRET_KEY;
  delete process.env.SUPABASE_SERVICE_ROLE_KEY;
  let calls = 0;
  globalThis.fetch = async () => { calls += 1; return new Response("{}", { status: 200 }); };

  const response = await otpHandler(verifyRequest());
  const payload = await response.json();

  process.env.SUPABASE_SECRET_KEY = secret;
  if (legacySecret) process.env.SUPABASE_SERVICE_ROLE_KEY = legacySecret;
  assert.equal(response.status, 503);
  assert.match(payload.error, /SUPABASE_SECRET_KEY/);
  assert.equal(calls, 0);
});
