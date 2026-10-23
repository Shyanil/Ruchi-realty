import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';

test('career form text areas are saved as responsibility and requirement lists', async () => {
  const requests = [];
  const session = { access_token: 'test-token', expires_at: Math.floor(Date.now() / 1000) + 3600 };
  const storage = new Map([['ruchi_supabase_session', JSON.stringify(session)]]);
  const window = {
    RUCHI_SUPABASE_CONFIG: { url: 'https://example.supabase.co', anonKey: 'eyJ-test-key' },
    PROJECTS: [],
  };
  const fetch = async (url, options = {}) => {
    requests.push({ url: String(url), options });
    const data = options.method === 'POST'
      ? [{ id: 'job-id', title: 'QA Engineer', dept: 'QA', responsibilities: ['Review pages', 'Report bugs'], requirements: ['Testing experience'] }]
      : [];
    return new Response(JSON.stringify(data), { status: 200 });
  };
  runInNewContext(readFileSync(new URL('../js/backend-client.jsx', import.meta.url), 'utf8'), {
    window, fetch, Response, URLSearchParams, crypto: globalThis.crypto,
    localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    console,
  });

  const result = await window.RuchiBackend.careers.create({
    title: 'QA Engineer', dept: 'QA', responsibilities: 'Review pages\nReport bugs', requirements: 'Testing experience',
  });
  assert.equal(result.error, null);
  const request = requests.find((item) => item.url.includes('/career_jobs') && item.options.method === 'POST');
  const payload = JSON.parse(request.options.body);
  assert.deepEqual(Array.from(payload.responsibilities), ['Review pages', 'Report bugs']);
  assert.deepEqual(Array.from(payload.requirements), ['Testing experience']);
});

test('blog creation uses a WebP fallback and rejects pasted non-WebP images before sending', async () => {
  const requests = [];
  const session = { access_token: 'test-token', expires_at: Math.floor(Date.now() / 1000) + 3600 };
  const storage = new Map([['ruchi_supabase_session', JSON.stringify(session)]]);
  const window = {
    RUCHI_SUPABASE_CONFIG: { url: 'https://example.supabase.co', anonKey: 'eyJ-test-key' },
    PROJECTS: [],
  };
  const fetch = async (url, options = {}) => {
    requests.push({ url: String(url), options });
    return new Response(JSON.stringify([{ id: 'blog-id', title: 'A new blog' }]), { status: 200 });
  };
  runInNewContext(readFileSync(new URL('../js/backend-client.jsx', import.meta.url), 'utf8'), {
    window, fetch, Response, URLSearchParams, crypto: globalThis.crypto,
    localStorage: { getItem: (key) => storage.get(key) || null, setItem: (key, value) => storage.set(key, value), removeItem: (key) => storage.delete(key) },
    console,
  });

  const blog = { title: 'A new blog', slug: 'a-new-blog', excerpt: 'Excerpt', content: 'Content', old_url: null };
  const created = await window.RuchiBackend.blogs.createBlog(blog);
  assert.equal(created.error, null);
  const request = requests.find((item) => item.url.includes('/blogs') && item.options.method === 'POST');
  const payload = JSON.parse(request.options.body);
  assert.equal(payload.image, '/assets/logo-h.webp');
  assert.equal(payload.old_url, null);

  const requestCount = requests.length;
  const rejected = await window.RuchiBackend.blogs.createBlog({ ...blog, image: '/cover.jpg' });
  assert.match(rejected.error.message, /\.webp/);
  assert.equal(requests.length, requestCount);
});
