import { BLOG } from "../data/siteData";
import { plainTextFromRichText } from "../utils/richText";
export const slugify = (value = "") => value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
export const estimateReadTime = (content = "") => Math.max(1, Math.ceil(plainTextFromRichText(content).split(/\s+/).filter(Boolean).length / 200));
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];

function legacyBlogDate(value) {
  const match = /^([a-z]+)\s+(\d{1,2}),?\s+(\d{4})$/i.exec(String(value || "").trim());
  const month = match ? MONTHS.indexOf(match[1].toLowerCase()) : -1;
  if (month < 0) return new Date(0).toISOString();
  const day = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(Date.UTC(year, month, day));
  return date.getUTCDate() === day ? date.toISOString() : new Date(0).toISOString();
}

export const normalizeBlog = (blog = {}, index = 0) => { const title = blog.title || "Untitled article"; const content = blog.content || blog.excerpt || ""; const slug = blog.slug || slugify(title); return { ...blog, id: blog.id || null, title, slug, category: blog.category || blog.cat || "News", image: blog.image || blog.img || "/assets/logo-h.webp", image_alt: blog.image_alt || blog.imageAlt || title, author: blog.author || "Ruchi Realty", status: blog.status || "published", content, tags: Array.isArray(blog.tags) ? blog.tags : [], faqs: Array.isArray(blog.faqs) ? blog.faqs : [], internal_links: Array.isArray(blog.internal_links) ? blog.internal_links : [], related_project_links: Array.isArray(blog.related_project_links) ? blog.related_project_links : [], published_at: blog.published_at || legacyBlogDate(blog.date), updated_at: blog.updated_at || blog.published_at || "", reading_time_minutes: blog.reading_time_minutes || estimateReadTime(content), seo_title: blog.seo_title || `${title} | Ruchi Realty`, seo_description: blog.seo_description || blog.excerpt || title, canonical_url: blog.canonical_url || `https://ruchirealty.com/blogs/${slug}`, og_image_url: blog.og_image_url || blog.image || blog.img || "/assets/logo-h.webp", featured: Boolean(blog.featured ?? index === 0) }; };
const fallback = BLOG.map(normalizeBlog);
export async function getPublicBlogs() { const result = await window.RuchiBackend?.blogs?.getPublicBlogs?.(); return result?.data?.length ? result.data.map(normalizeBlog) : fallback; }
export async function getBlogBySlug(slug) { const result = await window.RuchiBackend?.blogs?.getBlogBySlug?.(slug); return result?.data ? normalizeBlog(result.data) : fallback.find((blog) => blog.slug === slug) || null; }
