import { useEffect } from "react";

const SITE_URL = "https://ruchirealty.com";
const upsertMeta = (selector, attrs) => {
  let element = document.head.querySelector(selector);
  if (!element) {
    element = document.createElement("meta");
    document.head.appendChild(element);
  }
  Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
};

export default function SEO({ title, description, canonical, image, type = "website", article, schemas = [] }) {
  useEffect(() => {
    const clean = new URL(canonical || location.pathname, SITE_URL);
    clean.search = "";
    clean.hash = "";
    const url = clean.toString();
    const imageUrl = new URL(image || "/assets/logo-h.webp", SITE_URL).toString();
    document.title = title;
    upsertMeta('meta[name="description"]', { name: "description", content: description });
    [["og:title", title], ["og:description", description], ["og:url", url], ["og:image", imageUrl], ["og:type", type], ["twitter:card", "summary_large_image"], ["twitter:title", title], ["twitter:description", description], ["twitter:image", imageUrl]].forEach(([property, content]) => {
      const attr = property.startsWith("twitter:") ? "name" : "property";
      upsertMeta(`meta[${attr}="${property}"]`, { [attr]: property, content });
    });
    if (article?.publishedTime) upsertMeta('meta[property="article:published_time"]', { property: "article:published_time", content: article.publishedTime });
    if (article?.modifiedTime) upsertMeta('meta[property="article:modified_time"]', { property: "article:modified_time", content: article.modifiedTime });
    if (article?.author) upsertMeta('meta[property="article:author"]', { property: "article:author", content: article.author });
    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.rel = "canonical";
      document.head.appendChild(link);
    }
    link.href = url;
  }, [title, description, canonical, image, type, article]);

  return <>{schemas.filter(Boolean).map((schema, index) => (
    <script
      data-ruchi-schema="true"
      key={`${Array.isArray(schema["@type"]) ? schema["@type"].join("-") : schema["@type"] || "schema"}-${schema["@id"] || index}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, "\\u003c") }}
    />
  ))}</>;
}
