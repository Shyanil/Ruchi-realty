import { readFileSync } from 'node:fs';

const legacyRedirects = readFileSync(new URL('./public/_redirects', import.meta.url), 'utf8')
  .split('\n')
  .map((line) => line.trim().split(/\s+/))
  .filter(([source, destination, status]) => source?.startsWith('/') && destination?.startsWith('/') && status === '301')
  .map(([source, destination]) => ({ source, destination, statusCode: 301 }));

export default {
  reactStrictMode: false,
  async redirects() { return legacyRedirects; },
  async rewrites() { return [{ source: '/sitemap.xml', destination: '/api/sitemap' }]; },
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '',
  },
};
