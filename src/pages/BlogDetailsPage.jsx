import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import SEO from "../components/SEO";
import ShareButtons from "../components/blog/ShareButtons";
import CommentSection from "../components/blog/CommentSection";
import InternalLinks from "../components/InternalLinks";
import RichText from "../components/RichText";
import { getBlogBySlug, getPublicBlogs, normalizeBlog, slugify } from "../services/blogService";
import { BLOG } from "../data/siteData";
import { breadcrumbSchema, faqSchema } from "../data/structuredData";
import { hasRichTextHtml, richTextHeadings } from "../utils/richText";

const SITE = "https://ruchirealty.com";
const formatDate = (value) => value ? new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(new Date(value)) : "";
const inline = (text) => {
  const parts = text.split(/(https?:\/\/[^\s]+|\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part, index) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) return <a key={index} href={match[2]}>{match[1]}</a>;
    if (/^https?:\/\//.test(part)) return <a key={index} href={part}>{part}</a>;
    return part;
  });
};

function ArticleBody({ content }) {
  if (hasRichTextHtml(content)) return <RichText content={content} className="article-copy" />;
  const blocks = content.split(/\n{2,}/).map((part) => part.trim()).filter(Boolean);
  return <div className="article-copy">{blocks.map((block, index) => {
    if (/^###\s+/.test(block)) { const text = block.replace(/^###\s+/, ""); return <h3 id={slugify(text)} key={index}>{text}</h3>; }
    if (/^##\s+/.test(block)) { const text = block.replace(/^##\s+/, ""); return <h2 id={slugify(text)} key={index}>{text}</h2>; }
    if (/^>\s+/.test(block)) return <blockquote key={index}>{inline(block.replace(/^>\s+/, ""))}</blockquote>;
    const lines = block.split("\n");
    if (lines.every((line) => /^[-*]\s+/.test(line))) return <ul key={index}>{lines.map((line, lineIndex) => <li key={lineIndex}>{inline(line.replace(/^[-*]\s+/, ""))}</li>)}</ul>;
    if (lines.every((line) => /^\d+\.\s+/.test(line))) return <ol key={index}>{lines.map((line, lineIndex) => <li key={lineIndex}>{inline(line.replace(/^\d+\.\s+/, ""))}</li>)}</ol>;
    return <p key={index}>{inline(block)}</p>;
  })}</div>;
}

export default function BlogDetailsPage() {
  const { slug } = useParams();
  const fallbackBlogs = useMemo(() => BLOG.map(normalizeBlog), []);
  const fallbackBlog = fallbackBlogs.find((item) => item.slug === slug) || null;
  const [blog, setBlog] = useState(fallbackBlog);
  const [related, setRelated] = useState(() => fallbackBlogs.filter((entry) => entry.slug !== slug && entry.category === fallbackBlog?.category).slice(0, 3));
  const [loading, setLoading] = useState(!fallbackBlog);

  useEffect(() => {
    let live = true;
    Promise.all([getBlogBySlug(slug), getPublicBlogs()]).then(([item, all]) => {
      if (live) {
        setBlog(item);
        setRelated(all.filter((entry) => entry.slug !== slug && entry.category === item?.category).slice(0, 3));
        setLoading(false);
      }
    });
    return () => { live = false; };
  }, [slug]);

  const canonical = blog?.canonical_url || `${SITE}/blogs/${slug}`;
  const headings = useMemo(() => {
    if (!blog?.content) return [];
    const labels = hasRichTextHtml(blog.content) ? richTextHeadings(blog.content) : (blog.content.match(/^##\s+.+$/gm) || []).map((line) => line.replace(/^##\s+/, ""));
    return labels.map((text) => ({ text, id: slugify(text) }));
  }, [blog?.content]);
  const schemas = useMemo(() => !blog ? [] : [
    { "@context": "https://schema.org", "@type": ["Article", "BlogPosting"], "@id": `${canonical}#article`, headline: blog.title, description: blog.seo_description, image: { "@type": "ImageObject", url: new URL(blog.og_image_url, SITE).toString() }, datePublished: blog.published_at, dateModified: blog.updated_at || blog.published_at, author: { "@type": "Person", name: blog.author }, publisher: { "@type": "Organization", "@id": `${SITE}/#organization`, name: "Ruchi Realty", url: SITE, logo: { "@type": "ImageObject", url: `${SITE}/assets/logo-h.webp` } }, mainEntityOfPage: canonical, isPartOf: { "@type": "Blog", "@id": `${SITE}/blogs#blog`, name: "Ruchi Realty Blogs" }, articleSection: blog.category, keywords: blog.tags.join(", ") },
    breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Blogs", url: "/blogs" }, { name: blog.title, url: `/blogs/${blog.slug}` }]),
    faqSchema(blog.faqs || []),
  ], [blog, canonical]);

  if (loading) return <><Nav solid /><main className="blog-message">Loading article…</main><Footer /></>;
  if (!blog) return <><Nav solid /><main className="blog-message"><h1>Article not found</h1><Link to="/blogs">Return to all blogs</Link></main><Footer /></>;

  return <>
    <SEO title={blog.seo_title} description={blog.seo_description} canonical={canonical} image={blog.og_image_url} type="article" article={{ publishedTime: blog.published_at, modifiedTime: blog.updated_at || blog.published_at, author: blog.author }} schemas={schemas} />
    <Nav solid />
    <main>
      <article className="blog-detail">
        <header className="blog-detail__header rr-wrap">
          <nav aria-label="Breadcrumb"><Link to="/">Home</Link> / <Link to="/blogs">Blogs</Link> / <span>{blog.category}</span></nav>
          <span className="eyebrow">{blog.category}</span><h1>{blog.title}</h1><p>{blog.excerpt}</p>
          <div className="blog-detail__meta"><span>By {blog.author}</span><time dateTime={blog.published_at}>{formatDate(blog.published_at)}</time>{blog.updated_at && blog.updated_at !== blog.published_at && <span>Updated {formatDate(blog.updated_at)}</span>}<span>{blog.reading_time_minutes} min read</span><a href="#comments">Comments</a></div>
          <ShareButtons title={blog.title} url={canonical} />
        </header>
        <figure className="blog-detail__hero rr-wrap"><img decoding="async" loading="eager" src={blog.image} alt={blog.image_alt} fetchpriority="high" /></figure>
        <div className="blog-detail__layout rr-wrap">
          {headings.length >= 3 && <aside className="article-toc"><strong>In this article</strong>{headings.map((item) => <a key={item.id} href={`#${item.id}`}>{item.text}</a>)}</aside>}
          <div>
            <ArticleBody content={blog.content} />
            <InternalLinks links={blog.internal_links} legacyLinks={blog.related_project_links} title="Explore projects mentioned in this article" />
            <section className="blog-cta"><h2>Planning your next real estate investment?</h2><p>Explore Ruchi Realty projects or connect with our team.</p><div><Link to="/projects">Explore Projects</Link><Link to="/contact#enquiries">Contact Ruchi Realty</Link><Link to="/contact#private-viewings">Schedule a Visit</Link></div></section>
            <ShareButtons title={blog.title} url={canonical} />
          </div>
        </div>
        <div className="blog-comments-wrap rr-wrap"><CommentSection blogId={blog.id} /></div>
      </article>
      {related.length > 0 && <section className="related-blogs section-pad"><div className="rr-wrap"><div className="related-blogs__head"><div><span className="eyebrow">Continue reading</span><h2>Related blogs</h2></div><Link className="blog__all" to="/blogs">View all blogs →</Link></div><div className="blog-list-grid related-blogs__grid">{related.map((item) => <article className="blog-list-card" key={item.slug}><Link className="blog-list-card__image" to={`/blogs/${item.slug}`}><img decoding="async" src={item.image} alt={item.image_alt} loading="lazy" /></Link><div className="blog-list-card__body"><div className="blog-list-card__meta"><span>{item.category}</span><time dateTime={item.published_at}>{formatDate(item.published_at)}</time></div><h3><Link to={`/blogs/${item.slug}`}>{item.title}</Link></h3><p>{item.excerpt}</p><div className="blog-list-card__foot"><span>{item.reading_time_minutes} min read</span><Link to={`/blogs/${item.slug}`}>Read More →</Link></div></div></article>)}</div></div></section>}
    </main>
    <Footer />
  </>;
}
