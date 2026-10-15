import assert from 'node:assert/strict';
import { test } from 'node:test';
import blogComments from '../pages/api/blog-comments.js';
import handler from '../netlify/functions/blog-comments.mjs';

test('blog comment config GET returns the existing public site key', async () => {
  const previous = process.env.TURNSTILE_SITE_KEY;
  process.env.TURNSTILE_SITE_KEY = '0x-test-site-key';
  try {
    const response = { statusCode: 0, headers: {}, setHeader(key, value) { this.headers[key] = value; }, status(code) { this.statusCode = code; return this; }, send(body) { this.body = body; } };
    await blogComments({ method: 'GET', headers: { host: 'localhost:3000' }, body: {} }, response);
    assert.equal(response.statusCode, 200);
    assert.deepEqual(JSON.parse(response.body), { siteKey: '0x-test-site-key' });
  } finally {
    if (previous === undefined) delete process.env.TURNSTILE_SITE_KEY;
    else process.env.TURNSTILE_SITE_KEY = previous;
  }
});

test('server verifies action and hostname before saving a comment', async () => {
  const keys = ['TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY', 'TURNSTILE_HOSTNAMES', 'SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'];
  const previous = Object.fromEntries(keys.map((key) => [key, process.env[key]]));
  const originalFetch = global.fetch;
  Object.assign(process.env, {
    TURNSTILE_SITE_KEY: '0x-test-site-key', TURNSTILE_SECRET_KEY: 'test-secret',
    TURNSTILE_HOSTNAMES: 'ruchi-realty.shyanilsquashcode.workers.dev',
    SUPABASE_URL: 'https://example.supabase.co', SUPABASE_SERVICE_ROLE_KEY: 'test-service-key',
  });
  const calls = [];
  let hostname = 'other.example.com';
  global.fetch = async (url, options) => {
    calls.push(String(url));
    if (String(url).includes('/siteverify')) {
      assert.equal(new URLSearchParams(options.body).get('response'), 'valid-shaped-token');
      return new Response(JSON.stringify({ success: true, action: 'blog_comment', hostname }), { status: 200 });
    }
    return new Response(null, { status: 201 });
  };
  try {
    const request = () => new Request('https://ruchi-realty.shyanilsquashcode.workers.dev/api/blog-comments', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId: '11111111-1111-4111-8111-111111111111', name: 'QA User', email: 'qa@example.com', comment: 'A valid length comment', turnstileToken: 'valid-shaped-token' }),
    });
    assert.equal((await handler(request())).status, 400);
    assert.equal(calls.length, 1);
    hostname = 'ruchi-realty.shyanilsquashcode.workers.dev';
    assert.equal((await handler(request())).status, 200);
    assert.equal(calls.length, 3);
  } finally {
    global.fetch = originalFetch;
    for (const key of keys) {
      if (previous[key] === undefined) delete process.env[key];
      else process.env[key] = previous[key];
    }
  }
});
