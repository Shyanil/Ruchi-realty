import { useState, useEffect, useMemo } from "react";
import Nav from "../components/Nav";
import { Contact } from "../components/Contact";
import { Footer } from "../components/Footer";
import { Reveal, RImg } from "../components/shared";
import { BLOG, IMG_TOWER } from "../data/siteData";

const blogSlug = (value = "") =>
  value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

const cleanBlog = (blog = {}, index = 0) => {
  const title = blog.title || "Untitled insight";
  const published = blog.published_at || blog.created_at || "";
  return {
    id: blog.id || `${blogSlug(title)}-${index}`,
    title,
    slug: blog.slug || blogSlug(title),
    cat: blog.category || blog.cat || "Insights",
    excerpt: blog.excerpt || "",
    content: blog.content || "",
    author: blog.author || "Ruchi Realty",
    img: blog.image || blog.img || IMG_TOWER[index % IMG_TOWER.length],
    imageAlt: blog.imageAlt || blog.alt || title,
    url: blog.url || blog.sourceUrl || "",
    originalImage: blog.originalImage || blog.imageUrl || "",
    cta: blog.cta || "Read More",
    internalLink: blog.internalLink || "",
    date: blog.date || (published ? new Date(published).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : ""),
    tags: Array.isArray(blog.tags) ? blog.tags : [],
  };
};

const fallbackContent = (blog) => [
  blog.excerpt,
  "A good address is made through small decisions repeated carefully: the light a room receives, the route a family takes each morning, the materials hidden behind the finish, and the people who remain reachable after handover.",
  "At Ruchi Realty, these notes are written to make those decisions easier to understand before a buyer visits a site or signs a document.",
].filter(Boolean).join("\n\n");

function BlogCardLarge({ blog, onOpen }) {
  return (
    <article className="bp-feature" onClick={() => onOpen(blog.slug)}>
      <RImg src={blog.img} alt={blog.imageAlt} className="bp-feature__img" grade />
      <div className="bp-feature__body">
        <div className="blog-card__cat">{blog.cat}</div>
        <h2>{blog.title}</h2>
        <p>{blog.excerpt}</p>
        <div className="bp-meta">
          <span>{blog.date || "Latest"}</span>
          <span>{blog.author}</span>
        </div>
      </div>
    </article>
  );
}

function BlogReader({ blog, related, onClose, onOpen }) {
  const paragraphs = (blog.content || fallbackContent(blog)).split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <section className="bp-reader section-pad" id="article">
      <div className="rr-wrap">
        <button className="bp-back" type="button" onClick={onClose}>All insights<span className="ar">\u2192</span></button>
        <article className="bp-article">
          <header className="bp-article__head">
            <div className="blog-card__cat">{blog.cat}</div>
            <h1>{blog.title}</h1>
            <p>{blog.excerpt}</p>
            <div className="bp-meta">
              <span>{blog.date || "Latest"}</span>
              <span>{blog.author}</span>
            </div>
            {blog.url ? <a className="bp-source" href={blog.url} target="_blank" rel="noopener noreferrer">Original article<span className="ar">\u2192</span></a> : null}
          </header>
          <RImg src={blog.img} alt={blog.imageAlt} className="bp-article__image" grade />
          <div className="bp-article__body">
            {paragraphs.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
            <div className="bp-article__actions">
              {blog.internalLink ? <a className="blog__all" href={blog.internalLink}>Explore related projects<span className="ar">\u2192</span></a> : null}
              {blog.url ? <a className="bp-source bp-source--body" href={blog.url} target="_blank" rel="noopener noreferrer">{blog.cta}<span className="ar">\u2192</span></a> : null}
            </div>
          </div>
        </article>
        {related.length ? (
          <aside className="bp-related">
            <div className="eyebrow sec-eyebrow">Keep reading</div>
            <div className="bp-related__grid">
              {related.map((item) => (
                <button type="button" className="bp-related__item" key={item.slug} onClick={() => onOpen(item.slug)}>
                  <span>{item.cat}</span>
                  <strong>{item.title}</strong>
                </button>
              ))}
            </div>
          </aside>
        ) : null}
      </div>
    </section>
  );
}

export default function BlogPage() {
  const [items, setItems] = useState(() => BLOG.map(cleanBlog));
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeSlug, setActiveSlug] = useState(() => location.hash.replace(/^#/, ""));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    if (window.RuchiBackend?.blogs) {
      window.RuchiBackend.blogs.getPublicBlogs().then(({ data }) => {
        if (active && Array.isArray(data) && data.length) setItems(data.map(cleanBlog));
        if (active) setLoading(false);
      });
    } else {
      setLoading(false);
    }
    return () => { active = false; };
  }, []);

  useEffect(() => {
    const onHash = () => setActiveSlug(location.hash.replace(/^#/, ""));
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(items.map((item) => item.cat))).filter(Boolean)], [items]);
  const filtered = activeCategory === "All" ? items : items.filter((item) => item.cat === activeCategory);
  const selected = activeSlug ? items.find((item) => item.slug === activeSlug) : null;
  const featured = filtered[0] || items[0];
  const rest = featured ? filtered.filter((item) => item.slug !== featured.slug) : [];
  const related = selected ? items.filter((item) => item.slug !== selected.slug).slice(0, 3) : [];

  useEffect(() => {
    if (!selected) return;
    const t = setTimeout(() => {
      if (window.smoothTo) window.smoothTo("#article");
    }, 80);
    return () => clearTimeout(t);
  }, [selected?.slug]);

  const openArticle = (slug) => {
    history.pushState(null, "", `#${slug}`);
    setActiveSlug(slug);
    setTimeout(() => {
      if (window.smoothTo) window.smoothTo("#article");
    }, 40);
  };

  const closeArticle = () => {
    history.pushState(null, "", location.pathname);
    setActiveSlug("");
    setTimeout(() => {
      if (window.smoothTo) window.smoothTo("#insights");
    }, 40);
  };

  const onContact = () => {
    if (window.smoothTo) window.smoothTo("#contact");
  };

  return (
    <>
      <Nav onContact={onContact} />
      <main>
        <header className="bp-hero" data-screen-label="Insights">
          <div className="bp-hero__sig" aria-hidden="true"></div>
          <div className="rr-wrap bp-hero__grid">
            <Reveal>
              <div className="eyebrow" style={{ color: "var(--rr-lime)" }}>Insights</div>
              <h1 className="bp-head">Clear thinking for<br /><span className="rr-grad">better home decisions.</span></h1>
            </Reveal>
            <Reveal delay={90}>
              <p className="bp-lead">
                Project notes, buying guides, market views, and the quieter details behind how Ruchi Realty builds.
              </p>
            </Reveal>
          </div>
        </header>

        <section className="bp-index section-pad" id="insights">
          <div className="rr-wrap">
            <Reveal>
              <div className="bp-toolbar">
                <div className="ptabs bp-tabs" role="tablist" aria-label="Filter insights by topic">
                  {categories.map((category) => (
                    <button key={category} role="tab" type="button" aria-selected={activeCategory === category}
                      className={`ptab ${activeCategory === category ? "is-active" : ""}`}
                      onClick={() => setActiveCategory(category)}>
                      {category}<span className="ptab__count">{category === "All" ? items.length : items.filter((item) => item.cat === category).length}</span>
                    </button>
                  ))}
                </div>
                <span className="bp-state">{loading ? "Checking Supabase" : `${filtered.length} ${filtered.length === 1 ? "piece" : "pieces"}`}</span>
              </div>
            </Reveal>

            {featured ? <Reveal><BlogCardLarge blog={featured} onOpen={openArticle} /></Reveal> : null}

            <div className="bp-grid">
              {rest.map((blog, index) => (
                <Reveal key={blog.slug} delay={(index % 3) * 70} as="article" className="blog-card bp-card" onClick={() => openArticle(blog.slug)}>
                  <button type="button" className="bp-card__hit" onClick={() => openArticle(blog.slug)}>
                    <RImg src={blog.img} alt={blog.imageAlt} className="blog-card__img" />
                    <div className="blog-card__cat">{blog.cat}</div>
                    <h3 className="blog-card__title">{blog.title}</h3>
                    <p className="blog-card__excerpt">{blog.excerpt}</p>
                    <div className="blog-card__meta">
                      <span className="blog-card__date">{blog.date}</span>
                      <span className="blog-card__more">Read more<span className="ar">\u2192</span></span>
                    </div>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {selected ? <BlogReader blog={selected} related={related} onClose={closeArticle} onOpen={openArticle} /> : null}
        <Contact />
      </main>
      <Footer />
    </>
  );
}
