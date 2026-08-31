import { richTextHtmlWithHeadingIds } from "../utils/richText";

export default function RichText({ content = "", className = "", as: Tag = "div" }) {
  const html = richTextHtmlWithHeadingIds(content);
  if (!html) return null;
  return <Tag className={className || undefined} dangerouslySetInnerHTML={{ __html: html }} />;
}
