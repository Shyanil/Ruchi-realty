# Ruchi Realty website

This is a Next.js site with request-time server rendering. Public pages, including project details, blog articles, and media pages, return page content in the initial HTML. The existing React components and interactive controls hydrate in the browser.

## Run locally

```sh
npm ci
cp .env.example .env
npm run dev
```

Open `http://localhost:3000`. For a production check, run `npm run build` followed by `npm start`. Run `npm test` for the API tests.

## Data and environment

Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` for public content. Server rendering reads published blog, project, and media records from Supabase for each request. When public data is unavailable, the bundled blog and project records provide fallback content. Public page rendering does not need `SUPABASE_SECRET_KEY`. OTP lead verification and blog comments require a server-only `SUPABASE_SERVICE_ROLE_KEY`; those features also need their respective MSG91 and Turnstile settings. See `.env.example` for the full list.

The admin panel remains at `/admin`. The OTP and blog comment handlers run through Next.js API routes at `/api/otp` and `/api/blog-comments`.

## Search indexing

`/sitemap.xml` is generated on request from the site's routes and published Supabase records. `public/robots.txt` allows public pages, excludes admin and API routes, and points to the sitemap. Canonical URLs, descriptions, Open Graph tags, and structured data are rendered in the HTML head. Unknown public URLs return the branded `pages/404.jsx` page with HTTP 404.

## Cloudflare Workers

The OpenNext adapter builds this Next.js app for Workers. `npm run build:cloudflare` creates `.open-next/worker.js` and `.open-next/assets`; `wrangler.jsonc` points to those outputs. The old `dist` directory is legacy Vite output and must not be used for this SSR deployment.

In Cloudflare Workers Builds, connect this GitHub repository, use `main` as the production branch, set the build command to `npm run build:cloudflare`, and set the deploy command to `npm run deploy:cloudflare`. A plain `npm run build` produces only the Next.js output, so it cannot be followed by an OpenNext or Wrangler deploy. The deploy script checks that the OpenNext output exists and builds it if necessary. Set `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` in **Build variables and secrets** so Next.js can embed the public configuration. Set the same values in the Worker's runtime variables. For OTP leads, add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `MSG91_AUTH_KEY`, and `MSG91_TEMPLATE_ID`; for blog comments, add `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, `TURNSTILE_SITE_KEY`, and `TURNSTILE_SECRET_KEY`. Add `CRM_WEBHOOK_URL` and `CRM_WEBHOOK_AUTH_TOKEN` if CRM forwarding is used. Keep private values as Worker secrets. Attach `ruchirealty.com` as a Worker custom domain after verifying the `workers.dev` preview.
