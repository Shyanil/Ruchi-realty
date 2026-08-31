const BLOCKED_CONTENT = /<(script|style|iframe|object|embed|form|input|button|textarea|select|option|svg|math|template)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;
const HTML_TAG = /<\/?([a-z][a-z0-9]*)\b([^>]*)>/gi;
const ALLOWED_TAGS = new Set(["p", "br", "strong", "b", "em", "i", "u", "s", "h2", "h3", "h4", "ul", "ol", "li", "blockquote", "a", "span", "div"]);

export const escapeHtml = (value = "") => String(value)
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

const readAttribute = (attributes, name) => {
  const match = String(attributes || "").match(new RegExp(`(?:^|\\s)${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>]+))`, "i"));
  return match ? (match[1] ?? match[2] ?? match[3] ?? "") : "";
};

const safeHref = (value = "") => {
  const href = String(value).trim().replace(/[\u0000-\u001f\u007f\s]+/g, "");
  return /^(?:https?:\/\/|mailto:|tel:|\/|#)/i.test(href) && !/^\/\//.test(href) ? href : "";
};

const safeColor = (value = "") => {
  const color = String(value).trim();
  return /^(?:#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\)|[a-z]{3,20})$/i.test(color) ? color : "";
};

const safeStyle = (attributes = "") => {
  const style = readAttribute(attributes, "style");
  const output = [];
  style.split(";").forEach((declaration) => {
    const colon = declaration.indexOf(":");
    if (colon < 1) return;
    const property = declaration.slice(0, colon).trim().toLowerCase();
    const value = declaration.slice(colon + 1).trim();
    if ((property === "color" || property === "background-color") && safeColor(value)) output.push(`${property}:${safeColor(value)}`);
    if (property === "text-align" && /^(left|center|right|justify)$/.test(value)) output.push(`${property}:${value}`);
  });
  return output.join(";");
};

export function sanitizeRichTextHtml(value = "") {
  return String(value)
    .replace(BLOCKED_CONTENT, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(HTML_TAG, (source, rawTag, attributes) => {
      const tag = rawTag.toLowerCase();
      if (tag === "font") {
        if (/^<\//.test(source)) return "</span>";
        const color = safeColor(readAttribute(attributes, "color"));
        return `<span${color ? ` style="color:${escapeHtml(color)}"` : ""}>`;
      }
      if (!ALLOWED_TAGS.has(tag)) return "";
      if (/^<\//.test(source)) return tag === "br" ? "" : `</${tag}>`;
      if (tag === "br") return "<br>";
      if (tag === "a") {
        const href = safeHref(readAttribute(attributes, "href"));
        if (!href) return "<a>";
        const external = /^https?:\/\//i.test(href);
        return `<a href="${escapeHtml(href)}"${external ? ' target="_blank" rel="noopener noreferrer"' : ""}>`;
      }
      const style = safeStyle(attributes);
      return `<${tag}${style ? ` style="${escapeHtml(style)}"` : ""}>`;
    });
}

export const hasRichTextHtml = (value = "") => /<(?:p|br|strong|b|em|i|u|s|h[2-4]|ul|ol|li|blockquote|a|span|div)\b/i.test(String(value));

const formatInlineMarkdown = (value) => value
  .replace(/\[([^\]]+)\]\((https?:\/\/[^)]+|\/[^)]+|#[^)]+)\)/g, '<a href="$2">$1</a>')
  .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
  .replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "<em>$1</em>");

export function legacyTextToHtml(value = "") {
  const blocks = String(value).split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  return blocks.map((block) => {
    const escaped = escapeHtml(block);
    if (/^###\s+/.test(block)) return `<h3>${formatInlineMarkdown(escaped.replace(/^###\s+/, ""))}</h3>`;
    if (/^##\s+/.test(block)) return `<h2>${formatInlineMarkdown(escaped.replace(/^##\s+/, ""))}</h2>`;
    if (/^>\s+/.test(block)) return `<blockquote>${formatInlineMarkdown(escaped.replace(/^&gt;\s+/, ""))}</blockquote>`;
    const lines = escaped.split("\n");
    if (lines.every((line) => /^[-*]\s+/.test(line))) return `<ul>${lines.map((line) => `<li>${formatInlineMarkdown(line.replace(/^[-*]\s+/, ""))}</li>`).join("")}</ul>`;
    if (lines.every((line) => /^\d+\.\s+/.test(line))) return `<ol>${lines.map((line) => `<li>${formatInlineMarkdown(line.replace(/^\d+\.\s+/, ""))}</li>`).join("")}</ol>`;
    return `<p>${formatInlineMarkdown(escaped).replace(/\n/g, "<br>")}</p>`;
  }).join("");
}

export function normalizeRichTextHtml(value = "") {
  const source = String(value || "").trim();
  if (!source) return "";
  return sanitizeRichTextHtml(hasRichTextHtml(source) ? source : legacyTextToHtml(source));
}

export function plainTextFromRichText(value = "") {
  const source = hasRichTextHtml(value) ? sanitizeRichTextHtml(value) : String(value || "");
  return source
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/(?:p|div|h[2-4]|li|blockquote)>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function richTextHeadings(value = "") {
  const html = normalizeRichTextHtml(value);
  return [...html.matchAll(/<h2\b[^>]*>([\s\S]*?)<\/h2>/gi)].map((match) => plainTextFromRichText(match[1])).filter(Boolean);
}

export function richTextHtmlWithHeadingIds(value = "") {
  const used = new Map();
  return normalizeRichTextHtml(value).replace(/<h([2-4])\b[^>]*>([\s\S]*?)<\/h\1>/gi, (source, level, body) => {
    const base = plainTextFromRichText(body).toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "section";
    const count = used.get(base) || 0;
    used.set(base, count + 1);
    const id = count ? `${base}-${count + 1}` : base;
    return `<h${level} id="${id}">${body}</h${level}>`;
  });
}
