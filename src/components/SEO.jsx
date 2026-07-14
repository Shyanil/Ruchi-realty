import { useEffect } from "react";
const SITE_URL = "https://ruchirealty.com";
const upsertMeta = (selector, attrs) => { let el = document.head.querySelector(selector); if (!el) { el = document.createElement("meta"); document.head.appendChild(el); } Object.entries(attrs).forEach(([key, value]) => el.setAttribute(key, value)); };
export default function SEO({ title, description, canonical, image, type = "website", article, schemas = [] }) {
  useEffect(() => {
    const clean = new URL(canonical || location.pathname, SITE_URL); clean.search = ""; clean.hash = "";
    const url = clean.toString(); const imageUrl = new URL(image || "/assets/logo-h.png", SITE_URL).toString(); document.title = title;
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    [["og:title", title], ["og:description", description], ["og:url", url], ["og:image", imageUrl], ["og:type", type], ["twitter:card", "summary_large_image"], ["twitter:title", title], ["twitter:description", description], ["twitter:image", imageUrl]].forEach(([property, content]) => { const attr = property.startsWith("twitter:") ? "name" : "property"; upsertMeta(`meta[${attr}="${property}"]`, { [attr]: property, content }); });
    if (article?.publishedTime) upsertMeta('meta[property="article:published_time"]', { property: "article:published_time", content: article.publishedTime });
    if (article?.modifiedTime) upsertMeta('meta[property="article:modified_time"]', { property: "article:modified_time", content: article.modifiedTime });
    if (article?.author) upsertMeta('meta[property="article:author"]', { property: "article:author", content: article.author });
    let link = document.head.querySelector('link[rel="canonical"]'); if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); } link.href = url;
    document.querySelectorAll("script[data-ruchi-schema]").forEach((node) => node.remove());
    schemas.filter(Boolean).forEach((schema) => { const script = document.createElement("script"); script.type = "application/ld+json"; script.dataset.ruchiSchema = "true"; script.text = JSON.stringify(schema).replace(/</g, "\\u003c"); document.head.appendChild(script); });
    return () => document.querySelectorAll("script[data-ruchi-schema]").forEach((node) => node.remove());
  }, [title, description, canonical, image, type, article, schemas]); return null;
}
