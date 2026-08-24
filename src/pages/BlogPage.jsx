import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../components/Nav";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import SEO from "../components/SEO";
import { getPublicBlogs, normalizeBlog } from "../services/blogService";
import { BLOG } from "../data/siteData";
import { ORGANIZATION_ID, absoluteUrl, breadcrumbSchema } from "../data/structuredData";

const PAGE_SIZE = 6;
const formatDate = (value) => new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(new Date(value));

function Card({ blog }) {
  return <article className="blog-list-card">
    <Link to={`/blogs/${blog.slug}`} className="blog-list-card__image"><img decoding="async" src={blog.image} alt={blog.image_alt} loading="lazy" /></Link>
    <div className="blog-list-card__body">
      <div className="blog-list-card__meta"><span>{blog.category}</span><time dateTime={blog.published_at}>{formatDate(blog.published_at)}</time></div>
      <h2><Link to={`/blogs/${blog.slug}`}>{blog.title}</Link></h2>
      <p>{blog.excerpt}</p>
      <div className="blog-list-card__foot"><span>{blog.reading_time_minutes} min read{blog.comment_count != null ? ` · ${blog.comment_count} comments` : ""}</span><Link to={`/blogs/${blog.slug}`}>Read More &rarr;</Link></div>
    </div>
  </article>;
}

export default function BlogPage() {
  const [blogs, setBlogs] = useState(() => BLOG.map(normalizeBlog));
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [visible, setVisible] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(false);
  useEffect(() => { let live = true; getPublicBlogs().then((data) => { if (live) { setBlogs(data); setLoading(false); } }); return () => { live = false; }; }, []);
  useEffect(() => setVisible(PAGE_SIZE), [query, category]);
  const categories = useMemo(() => ["All", ...new Set(blogs.map((blog) => blog.category))], [blogs]);
  const filtered = useMemo(() => blogs.filter((blog) => (category === "All" || blog.category === category) && `${blog.title} ${blog.excerpt} ${blog.tags.join(" ")}`.toLowerCase().includes(query.trim().toLowerCase())), [blogs, query, category]);
  const featured = blogs.find((blog) => blog.featured) || blogs[0];
  const blogSchemas = useMemo(() => [{
    "@context": "https://schema.org",
    "@type": "Blog",
    "@id": "https://ruchirealty.com/blogs#blog",
    name: "Ruchi Realty Blogs",
    url: "https://ruchirealty.com/blogs",
    description: "Real estate insights, home buying guidance and project updates from Ruchi Realty.",
    publisher: { "@id": ORGANIZATION_ID },
  }, {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Ruchi Realty blog articles",
    numberOfItems: blogs.length,
    itemListElement: blogs.map((blog, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: absoluteUrl(`/blogs/${blog.slug}`),
      name: blog.title,
    })),
  }, breadcrumbSchema([{ name: "Home", url: "/" }, { name: "Blogs", url: "/blogs" }])], [blogs]);

  return <>
    <SEO title="Ruchi Realty Blogs | Real Estate Tips, Property Insights & Investment Guides" description="Read expert real estate blogs from Ruchi Realty covering home buying tips, property investment, market trends, premium projects, plotted developments, and real estate insights in Kolkata, Indore, and Bhopal." canonical="https://ruchirealty.com/blogs" image={featured?.image} schemas={blogSchemas} />
    <Nav />
    <main>
      <header className="bp-hero"><div className="rr-wrap"><span className="eyebrow">Ruchi Realty Insights</span><h1>Blogs</h1><p>Welcome to Ruchi Realty Blogs&mdash;expert guidance on home buying, market trends, property investment, management, and the real estate developments shaping Kolkata, Indore, and Bhopal.</p></div></header>
      {featured && <section className="blog-featured rr-wrap"><img decoding="async" loading="eager" src={featured.image} alt={featured.image_alt} fetchpriority="high" /><div><span className="eyebrow">Featured insight</span><h2>{featured.title === "Discover the Pinnacle of Luxury Living at One Victoria in New Town, Kolkata" ? <>Discover the Pinnacle of Luxury Living<br />At One Victoria in New Town, Kolkata</> : featured.title}</h2><p>{featured.excerpt}</p><Link className="blog__all" to={`/blogs/${featured.slug}`}>Read featured article &rarr;</Link></div></section>}
      <section className="blog-index section-pad"><div className="rr-wrap"><div className="blog-toolbar"><label><span className="sr-only">Search blogs</span><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search articles" /></label><div className="blog-categories">{categories.map((item) => <button type="button" className={category === item ? "is-active" : ""} onClick={() => setCategory(item)} key={item}>{item}</button>)}</div></div>{loading ? <p className="blog-status">Loading articles&hellip;</p> : filtered.length ? <><div className="blog-list-grid">{filtered.slice(0, visible).map((blog) => <Card key={blog.slug} blog={blog} />)}</div>{visible < filtered.length && <button type="button" className="blog-load-more" onClick={() => setVisible((count) => count + PAGE_SIZE)}>Load more articles</button>}</> : <p className="blog-status">No articles match your search.</p>}</div></section>
      <Contact />
    </main>
    <Footer />
  </>;
}
