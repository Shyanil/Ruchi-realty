import { PROJECTS } from '../../src/data/projects';
import { BLOG } from '../../src/data/siteData';
import { LOCAL_SEO_PAGE_LIST } from '../../src/data/localSeoPages';
import { supabaseRows } from '../../src/server/page-data';

const SITE = 'https://ruchirealty.com';
const fixed = ['/', '/about', '/projects', '/blogs', '/careers', '/contact', '/media', '/media/gallery', '/media/press-releases', '/media/events-awards', '/privacy-policy', '/disclaimer'];
const escapeXml = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export default async function Sitemap(_req, res) {
  const [dbBlogs, dbProjects, dbPress] = await Promise.all([
    supabaseRows('blogs', { select: 'slug,updated_at,published_at', status: 'eq.published' }),
    supabaseRows('projects', { select: 'slug,updated_at' }),
    supabaseRows('media_press_releases', { select: 'slug,updated_at', status: 'eq.published' }),
  ]);
  const urls = new Map();
  const add = (path, lastmod) => {
    if (!path || path === '/admin') return;
    const date = lastmod && !Number.isNaN(Date.parse(lastmod)) ? new Date(lastmod).toISOString().slice(0, 10) : '';
    urls.set(path, date || urls.get(path) || '');
  };
  fixed.forEach((path) => add(path));
  LOCAL_SEO_PAGE_LIST.forEach((page) => add(page.path));
  PROJECTS.forEach((project) => add(project.url));
  BLOG.forEach((blog) => add(`/blogs/${blog.slug}`, blog.updated_at || blog.published_at));
  (dbProjects || []).forEach((project) => add(`/projects/${project.slug}`, project.updated_at));
  (dbBlogs || []).forEach((blog) => add(`/blogs/${blog.slug}`, blog.updated_at || blog.published_at));
  (dbPress || []).forEach((item) => add(`/media/press-releases/${item.slug}`, item.updated_at));
  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...urls].map(([path, lastmod]) => `  <url><loc>${escapeXml(`${SITE}${path}`)}</loc>${lastmod ? `<lastmod>${lastmod}</lastmod>` : ''}</url>`).join('\n')}\n</urlset>\n`;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(body);
}
