import { Html, Head, Main, NextScript } from 'next/document';
import { PROJECTS } from '../src/data/projects';

export default function Document() {
  const config = JSON.stringify({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  }).replace(/</g, '\\u003c');
  const projects = JSON.stringify(PROJECTS).replace(/</g, '\\u003c');
  return <Html lang="en"><Head>
    <meta name="theme-color" content="#231f20" />
    <link rel="icon" type="image/webp" href="/assets/logo-mark.webp" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <script dangerouslySetInnerHTML={{ __html: `window.RUCHI_SUPABASE_CONFIG=Object.freeze(${config});window.PROJECTS=${projects};window.__HOME_URL="/";` }} />
    <script src="/backend-client.js" />
  </Head><body><Main /><NextScript /></body></Html>;
}
