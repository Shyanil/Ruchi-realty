import { PROJECTS } from '../data/projects';
import { normalizePublicProjects } from './normalize-projects.mjs';
import { BLOG } from '../data/siteData';
import { LOCAL_SEO_PAGE_LIST } from '../data/localSeoPages';
import { normalizeBlog } from '../services/blogService';
import { normalizeGallery } from '../services/mediaService';
import { GALLERY_MEDIA } from '../data/galleryMedia';

const staticPaths = new Set(['/', '/about', '/projects', '/blogs', '/careers', '/contact', '/privacy-policy', '/disclaimer', '/media', '/media/gallery', '/media/press-releases', '/media/events-awards', '/admin', '/Admin.html', '/About.html', '/Projects.html', '/Careers.html']);
const localPaths = new Set(LOCAL_SEO_PAGE_LIST.map((page) => page.path));
const projectPaths = new Set(PROJECTS.map((project) => project.url).filter(Boolean));
const redirects = new Map([['/Blog.html', '/blogs'], ['/Contact.html', '/contact'], ['/Oscar.html', '/projects/oscar-billionaires'], ['/ActiveBusinessPark.html', '/projects/active-business-park'], ['/ActiveAcresAngelica.html', '/projects/active-acres-angelica'], ['/ActiveGreens.html', '/projects/active-greens'], ['/OneRajarhat.html', '/projects/one-rajarhat'], ['/one-prime-residential', '/projects/one-prime-residential'], ['/lifescapes-bhopal', '/projects/lifescapes-bhopal'], ['/oscar-fort', '/projects/oscar-fort-indore'], ['/oscar-fort-indore', '/projects/oscar-fort-indore']]);
redirects.set('/Awards.html', '/media/events-awards');
redirects.set('/one-rajarhat', '/projects/one-rajarhat');
redirects.set('/active-business-park', '/projects/active-business-park');
redirects.set('/active-acres-angelica', '/projects/active-acres-angelica');
redirects.set('/active-greens', '/projects/active-greens');

export function resolvePage(path) {
  if (redirects.has(path)) return { redirect: redirects.get(path) };
  if (staticPaths.has(path) || localPaths.has(path) || projectPaths.has(path)) return { exists: true };
  if (/^\/blogs\/[^/]+$/.test(path) || /^\/projects\/[^/]+$/.test(path) || /^\/media\/press-releases\/[^/]+$/.test(path)) return { exists: true };
  return { exists: false };
}

export async function supabaseRows(table, query = {}) {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  try {
    const endpoint = new URL(`${url.replace(/\/$/, '')}/rest/v1/${table}`);
    for (const [name, value] of Object.entries({ select: '*', ...query })) endpoint.searchParams.set(name, value);
    const response = await fetch(endpoint, { headers: { apikey: key, Authorization: `Bearer ${key}` }, signal: AbortSignal.timeout(6000), cache: 'no-store' });
    return response.ok ? await response.json() : null;
  } catch (error) {
    console.warn(`Server data unavailable for ${table}: ${error.message}`);
    return null;
  }
}

const subpageFields = ['heroTitle', 'heroTagline', 'heroLogo', 'heroBg', 'heroMobileUrl', 'heroImagePosition', 'heroImageFit', 'overviewImage', 'overviewParagraphs', 'overviewHighlights', 'amenities', 'specifications', 'specificationImage', 'floorPlans', 'locationImage', 'locationMapEmbed', 'locationDestinations', 'nearbyLandmarks', 'schools', 'hospitals', 'metroRoadConnectivity', 'airportRailwayDistances', 'businessHubs', 'shoppingCentres', 'walkthroughVideoId', 'videos', 'galleryImages', 'constructionUpdates', 'brochureUrl', 'reraNumber', 'faqs', 'relatedProjectSlugs', 'ctaLabels', 'ogImage', 'metaTitle', 'metaDescription', 'isPublished'];
function normalizeSubpage(row) {
  if (!row) return null;
  const result = { id: row.id, project_id: row.project_id };
  for (const field of subpageFields) {
    const dbField = field.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
    result[field] = row[dbField] ?? null;
  }
  return result;
}

export async function loadPageData(path) {
  if (path === '/careers' || path === '/Careers.html') {
    const jobs = await supabaseRows('career_jobs', { is_active: 'eq.true', order: 'sort_order.asc.nullslast,created_at.desc' });
    return { jobs: Array.isArray(jobs) ? jobs.map((job) => ({ ...job, dropdownVal: job.dropdown_val || `${job.title || ''}, ${job.dept || ''}` })) : [] };
  }
  if (path === '/blogs' || path === '/' || path.startsWith('/blogs/')) {
    const records = await supabaseRows('blogs', { status: 'eq.published', order: 'published_at.desc' });
    const blogs = Array.isArray(records) && records.length ? records.map(normalizeBlog) : BLOG.map(normalizeBlog);
    if (path.startsWith('/blogs/')) {
      const blog = blogs.find((item) => item.slug === path.slice(7));
      return blog ? { blogs, blog } : { notFound: true };
    }
    if (path === '/') {
      const projects = await supabaseRows('projects', { order: 'sort_order.asc.nullslast,created_at.desc' });
      return { blogs, projects: normalizePublicProjects(projects) };
    }
    return { blogs };
  }
  if (path === '/projects' || path.startsWith('/projects/') || localPaths.has(path)) {
    const records = await supabaseRows('projects', { order: 'sort_order.asc.nullslast,created_at.desc' });
    const projects = normalizePublicProjects(records);
    if (path.startsWith('/projects/') && !localPaths.has(path) && !projectPaths.has(path)) {
      const slug = path.split('/').pop();
      if (!projects.some((item) => item.slug === slug)) return { notFound: true };
    }
    if (path.startsWith('/projects/') && !localPaths.has(path)) {
      const slug = path.split('/').pop();
      const project = projects.find((item) => item.slug === slug) || null;
      const subpages = project?.id ? await supabaseRows('project_subpages', { project_id: `eq.${project.id}`, limit: '1' }) : null;
      return { projects, project, subpage: normalizeSubpage(subpages?.[0]) };
    }
    return { projects };
  }
  if (path.startsWith('/media')) {
    const [galleryRows, pressRows, eventRows] = await Promise.all([
      supabaseRows('media_gallery_items', { select: '*,media_assets!image_asset_id(*)', status: 'eq.published', order: 'display_order.asc,created_at.asc' }),
      supabaseRows('media_press_releases', { select: '*,media_assets!cover_asset_id(*)', status: 'eq.published', order: 'display_order.asc,release_date.desc' }),
      supabaseRows('media_events_awards', { select: '*,media_assets!cover_asset_id(*)', status: 'eq.published', order: 'display_order.asc,event_date.desc' }),
    ]);
    const gallery = Array.isArray(galleryRows) && galleryRows.length ? galleryRows.map(normalizeGallery) : GALLERY_MEDIA.map(normalizeGallery);
    const withCover = (item) => ({ ...item, image_url: item.image_url || item.media_assets?.public_url || '', thumbnail_url: item.thumbnail_url || item.media_assets?.thumbnail_url || item.image_url || item.media_assets?.public_url || '', internal_links: Array.isArray(item.internal_links) ? item.internal_links : [] });
    const press = Array.isArray(pressRows) ? pressRows.map(withCover) : [];
    const events = Array.isArray(eventRows) ? eventRows.map(withCover) : [];
    if (path.startsWith('/media/press-releases/')) {
      const pressItem = press.find((item) => item.slug === path.split('/').pop());
      return pressItem ? { gallery, press, events, pressItem } : { notFound: true };
    }
    return { gallery, press, events };
  }
  return {};
}
