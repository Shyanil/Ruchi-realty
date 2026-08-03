import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Reveal, RImg } from "./shared";
import { BLOG } from "../data/siteData";

export function BlogSection() {
  const [items, setItems] = useState(() => BLOG);
  useEffect(() => {
    let active = true;
    if (window.RuchiBackend?.blogs) {
      window.RuchiBackend.blogs.getPublicBlogs().then(({ data }) => {
        if (active && Array.isArray(data) && data.length) setItems(data);
      });
    }
    return () => { active = false; };
  }, []);
  const shown = items.length ? items.slice(0, 3) : BLOG.slice(0, 3);
  return (
    <section className="section-pad blog" id="blog" style={{ backgroundColor: "rgb(255, 253, 246)" }}>
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow sec-eyebrow">Our Blogs</div>
              <h2 className="blog__head">Real Estate Insights <span className="rr-grad">&amp; Expert Advice</span></h2>
            </div>
            <Link className="blog__all" to="/blogs">Read all property guides<span className="ar">→</span></Link>
          </div>
        </Reveal>
      </div>
      <div className="rr-wrap">
        <div className="blog-grid">
          {shown.map((b, i) =>
            <Reveal key={i} delay={i * 70}>
              <Link className="blog-card" to={`/blogs/${b.slug}`}>
                <RImg src={b.img} alt={b.title} className="blog-card__img" />
                <div className="blog-card__cat">{b.cat}</div>
                <h3 className="blog-card__title">{b.title}</h3>
                <p className="blog-card__excerpt">{b.excerpt}</p>
                <div className="blog-card__meta">
                  <span className="blog-card__date">{b.date}</span>
                  <span className="blog-card__more">Read more<span className="ar">→</span></span>
                </div>
              </Link>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}
