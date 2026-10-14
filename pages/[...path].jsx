import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { StaticRouter } from 'react-router-dom/server';
import App from '../src/App';
import NotFoundPage from './404';
import { ServerDataProvider } from '../src/server-data';
import { loadPageData, resolvePage } from '../src/server/page-data';

export default function SitePage({ path, data, notFound }) {
  useEffect(() => {
    const fullPageNavigation = (event) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = event.target.closest?.('a[href]');
      if (!anchor || anchor.target || anchor.hasAttribute('download')) return;
      const url = new URL(anchor.href, location.href);
      if (url.origin !== location.origin || (url.pathname === location.pathname && url.search === location.search)) return;
      event.preventDefault();
      event.stopPropagation();
      location.assign(url.href);
    };
    document.addEventListener('click', fullPageNavigation, true);
    return () => document.removeEventListener('click', fullPageNavigation, true);
  }, []);

  if (notFound) return <NotFoundPage />;
  const content = <ServerDataProvider value={data}><App /></ServerDataProvider>;
  return typeof window === 'undefined'
    ? <StaticRouter location={path}>{content}</StaticRouter>
    : <BrowserRouter>{content}</BrowserRouter>;
}

export async function getServerSideProps({ resolvedUrl, res }) {
  const path = new URL(resolvedUrl, 'http://localhost').pathname.replace(/\/$/, '') || '/';
  const resolution = resolvePage(path);
  if (resolution.redirect) return { redirect: { destination: resolution.redirect, statusCode: 301 } };
  if (!resolution.exists) {
    res.statusCode = 404;
    return { props: { notFound: true } };
  }
  const data = await loadPageData(path);
  if (data.notFound) {
    res.statusCode = 404;
    return { props: { notFound: true } };
  }
  return { props: { path, data } };
}
