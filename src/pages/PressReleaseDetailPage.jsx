import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import SEO from "../components/SEO";
import InternalLinks from "../components/InternalLinks";
import { getPressBySlug } from "../services/mediaService";

export default function PressReleaseDetailPage() {
  const { slug } = useParams();
  const [item, setItem] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPressBySlug(slug).then((value) => {
      setItem(value);
      setLoading(false);
    });
  }, [slug]);

  const canonical = `https://ruchirealty.com/media/press-releases/${slug}`;
  const schemas = useMemo(() => !item ? [] : [{
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: item.title,
    description: item.seo_description || item.excerpt,
    datePublished: item.release_date,
    image: item.image_url ? `https://ruchirealty.com${item.image_url}` : undefined,
    publisher: { "@type": "Organization", name: "Ruchi Realty", url: "https://ruchirealty.com" },
    mainEntityOfPage: canonical,
  }, {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://ruchirealty.com" },
      { "@type": "ListItem", position: 2, name: "Press Releases", item: "https://ruchirealty.com/media/press-releases" },
      { "@type": "ListItem", position: 3, name: item.title, item: canonical },
    ],
  }], [item, canonical]);

  if (loading) return <><Nav /><main className="blog-message">Loading press release&hellip;</main></>;
  if (!item) return <><Nav /><main className="blog-message"><h1>Press release not found</h1><Link to="/media/press-releases">View press releases</Link></main><Footer /></>;

  return <>
    <SEO title={item.seo_title || `${item.title} | Ruchi Realty`} description={item.seo_description || item.excerpt} canonical={canonical} image={item.og_image_url || item.image_url || "/assets/media/gallery/press-release-placeholder.webp"} type="article" schemas={schemas} />
    <Nav />
    <main className="press-detail">
      <header className="rr-wrap">
        <nav><Link to="/media">Media</Link> / <Link to="/media/press-releases">Press Releases</Link></nav>
        <time>{item.release_date && new Date(item.release_date).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</time>
        <h1>{item.title}</h1>
        <p>{item.excerpt}</p>
      </header>
      {item.image_url && <img decoding="async" loading="lazy" className="press-detail__cover rr-wrap" src={item.image_url} alt={item.cover_image_alt || item.title} />}
      <article className="press-detail__body">
        {String(item.content || "").split(/\n{2,}/).map((paragraph, index) => <p key={index}>{paragraph}</p>)}
        <InternalLinks links={item.internal_links} title="Explore related pages" />
        <div>{item.pdf_url && <a href={item.pdf_url}>Download PDF</a>}{item.external_url && <a href={item.external_url} target="_blank" rel="noreferrer">View original source</a>}</div>
      </article>
    </main>
    <Footer />
  </>;
}
