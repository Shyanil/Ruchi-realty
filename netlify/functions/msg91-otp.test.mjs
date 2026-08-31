import assert from "node:assert/strict";
import { after, before, test } from "node:test";
import otpHandler from "./msg91-otp.mjs";

const originalFetch = globalThis.fetch;

before(() => {
  process.env.MSG91_AUTH_KEY = "test-auth-key";
  process.env.MSG91_TEMPLATE_ID = "test-template-id";
  process.env.VITE_SUPABASE_URL = "https://example.supabase.co";
  process.env.VITE_SUPABASE_ANON_KEY = "test-anon-key";
});

after(() => {
  globalThis.fetch = originalFetch;
});

function verifyRequest(otp = "123456") {
  return new Request("https://example.com/api/otp", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      action: "verify",
      mobile: "9876543210",
      otp,
      leadId: "11111111-1111-4111-8111-111111111111",
    }),
  });
}

test("accepts a valid MSG91 OTP even if secondary lead persistence fails", async () => {
  let call = 0;
  globalThis.fetch = async () => {
    call += 1;
    if (call === 1) return new Response(JSON.stringify({ type: "success", message: "OTP verified successfully" }), { status: 200 });
    return new Response("[]", { status: 200 });
  };

  const response = await otpHandler(verifyRequest());
  const payload = await response.json();

  assert.equal(response.status, 200);
  assert.equal(payload.success, true);
  assert.equal(payload.verified, true);
  assert.equal(payload.storageStatus, "failed");
});

test("recognizes normalized MSG91 success fields", async () => {
  let call = 0;
  globalThis.fetch = async () => {
    call += 1;
    if (call === 1) return new Response(JSON.stringify({ status: "ok", message: "otp_verified" }), { status: 200 });
    return new Response("[]", { status: 200 });
  };

  const response = await otpHandler(verifyRequest());
  assert.equal(response.status, 200);
});

test("returns a validation response instead of 502 for an incorrect OTP", async () => {
  globalThis.fetch = async () => new Response(JSON.stringify({ type: "error", message: "OTP not match" }), { status: 200 });

  const response = await otpHandler(verifyRequest("654321"));
  const payload = await response.json();

  assert.equal(response.status, 422);
  assert.match(payload.error, /incorrect/i);
});

