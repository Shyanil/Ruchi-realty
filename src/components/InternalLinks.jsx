import { Link } from "react-router-dom";

const SITE_ORIGIN = "https://ruchirealty.com";

function labelFromUrl(value = "") {
  const segment = String(value).split(/[?#]/)[0].split("/").filter(Boolean).pop() || "Related page";
  return segment.replace(/[-_]+/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export function normalizeInternalLinks(links = [], legacyLinks = []) {
  const structured = Array.isArray(links) ? links : [];
  const legacy = Array.isArray(legacyLinks) ? legacyLinks.map((url) => ({ label: labelFromUrl(url), url })) : [];
  return [...structured, ...legacy]
    .map((item) => {
      const rawUrl = String(item?.url || item?.href || "").trim();
      const label = String(item?.label || item?.title || labelFromUrl(rawUrl)).trim();
      if (!rawUrl || !label) return null;
      try {
        const parsed = new URL(rawUrl, SITE_ORIGIN);
        if (parsed.origin !== SITE_ORIGIN) return null;
        return { label, url: `${parsed.pathname}${parsed.search}${parsed.hash}` };
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    .filter((item, index, items) => items.findIndex((candidate) => candidate.url === item.url && candidate.label === item.label) === index);
}

export default function InternalLinks({ links, legacyLinks, title = "Explore related pages", compact = false }) {
  const items = normalizeInternalLinks(links, legacyLinks);
  if (!items.length) return null;
  return (
    <aside className={`internal-links${compact ? " internal-links--compact" : ""}`} aria-label={title}>
      <strong>{title}</strong>
      <div>
        {items.map((item) => <Link to={item.url} key={`${item.label}-${item.url}`}>{item.label}<span aria-hidden="true">&rarr;</span></Link>)}
      </div>
    </aside>
  );
}
