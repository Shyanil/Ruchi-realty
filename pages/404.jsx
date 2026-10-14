import Head from 'next/head';

export default function NotFoundPage() {
  return <div className="not-found-page">
    <Head>
      <title>Page Not Found | Ruchi Realty</title>
      <meta name="description" content="The page you requested could not be found. Explore Ruchi Realty projects or return to the homepage." />
      <meta name="robots" content="noindex,follow" />
    </Head>
    <header className="not-found-header rr-wrap">
      <a href="/" aria-label="Ruchi Realty home"><img src="/assets/logo-h-white.webp" alt="Ruchi Realty" /></a>
      <a href="/contact">Contact us <span aria-hidden="true">↗</span></a>
    </header>
    <main className="not-found-main rr-wrap">
      <span className="not-found-eyebrow">The page could not be found</span>
      <strong className="not-found-number" aria-hidden="true">404</strong>
      <h1>Looks like you took a different turn.</h1>
      <p>The address may have changed, or the page may no longer be available. Let’s get you back to exploring.</p>
      <div className="not-found-actions">
        <a href="/">Back to home <span aria-hidden="true">↗</span></a>
        <a href="/projects">Explore projects <span aria-hidden="true">→</span></a>
      </div>
    </main>
    <footer className="not-found-footer rr-wrap">
      <span>© 2026 · Ruchi Realty Holdings Ltd.</span>
      <a href="https://squashcode.com/" target="_blank" rel="noopener noreferrer">Designed and developed by SquashCode</a>
    </footer>
  </div>;
}
