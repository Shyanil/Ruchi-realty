import { PROJECTS } from '../data/projects.js';

export function normalizePublicProjects(records) {
  const bySlug = new Map(PROJECTS.map((project) => [project.slug || project.url?.split('/').pop(), project]));
  for (const item of records || []) {
    // The projects table has no slug column. Use the same URL as the browser
    // for newly created projects, while retaining existing seed project URLs.
    const title = item.title || item.name || '';
    const location = item.location || item.city || '';
    const seedMatch = PROJECTS.find((project) => project.url &&
      project.name.toLowerCase() === title.toLowerCase() &&
      (project.city.toLowerCase() === location.toLowerCase() ||
        (location && project.city.toLowerCase().includes(location.toLowerCase())) ||
        (project.city && location.toLowerCase().includes(project.city.toLowerCase()))));
    const slug = item.slug || seedMatch?.url?.split('/').pop() ||
      `${title}-${location}`.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    const seed = bySlug.get(slug) || {};
    const image = item.image_url || seed.image_url || seed.img || '';
    bySlug.set(slug, { ...seed, ...item, slug, name: item.title || seed.name, city: item.location || seed.city, image_url: image, img: image, url: item.url || seed.url || `/projects/${slug}` });
  }
  return [...bySlug.values()];
}
