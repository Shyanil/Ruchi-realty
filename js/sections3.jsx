/* ============================================================
   Sections 3 — Awards · Press · Industry Insights (v3)
   ============================================================ */
const { useEffect: uE3, useState: uS3 } = React;

const AWARD_WREATH = window.__rsrc("awardWreath", "assets/award-wreath.jpg");

/* ---- Award card: gold wreath, year (or star) inside, name below ---- */
function AwardCard({ a, hidden }) {
  return (
    <div className="awcard" aria-hidden={hidden ? "true" : undefined}>
      <div className="awcard__wreath">
        <img src={AWARD_WREATH} alt="" loading="lazy" />
        {a.year ?
          <span className="awcard__inwreath">{a.year}</span> :
          <svg className="awcard__star" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M12 3.5l2.47 5.01 5.53.8-4 3.9.94 5.5L12 16.11l-4.94 2.6.94-5.5-4-3.9 5.53-.8z"></path>
          </svg>
        }
      </div>
      <div className="awcard__name">{a.name}</div>
    </div>
  );
}

/* ---- Awards — infinite recognition carousel ---- */
function Awards() {
  const loop = AWARDS.concat(AWARDS);
  return (
    <section className="section-pad awards" id="awards">
      <div className="rr-wrap">
        <Reveal>
          <div className="awards__intro">
            <div className="eyebrow sec-eyebrow">Recognition</div>
            <h2 className="awards__head">Quietly <span className="rr-grad">acknowledged</span>,<br />over the years.</h2>
            <p className="awards__lead">
              We don't build for awards. We are grateful when the work is noticed all the same.
            </p>
          </div>
        </Reveal>
      </div>
      <Reveal>
        <div className="awmq" aria-label="Awards received by Ruchi Realty">
          <div className="awmq__track">
            {loop.map((a, i) => <AwardCard key={i} a={a} hidden={i >= AWARDS.length} />)}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---- Press — pictured headlines ---- */
const PRESS_URL = "https://ruchirealty.com/press-releases/";

function Press() {
  const items = PRESS.slice(0, 4);
  const feat = items[0];
  const rest = items.slice(1);
  return (
    <section className="section-pad press" id="press">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow sec-eyebrow">Press &amp; Media</div>
              <h2 className="press__head">A name that finds its<br />way into <span className="rr-grad">the news.</span></h2>
            </div>
            <a className="press__all" href={PRESS_URL} target="_blank" rel="noopener noreferrer">
              View all press releases<span className="ar">↗</span>
            </a>
          </div>
        </Reveal>
        <div className="press-grid">
          <Reveal>
            <a className="press-feat" href={PRESS_URL} target="_blank" rel="noopener noreferrer">
              <RImg src={feat.img} alt={feat.head} className="press-feat__media" grade />
              <div className="press-feat__body">
                <span className="press-date">{feat.date}</span>
                <h3 className="press-feat__head">{feat.head}</h3>
                <span className="press-read">Read the story<span className="ar">↗</span></span>
              </div>
            </a>
          </Reveal>
          <div className="press-side">
            {rest.map((p, i) =>
              <Reveal key={i} delay={(i + 1) * 70}>
                <a className="press-mini" href={PRESS_URL} target="_blank" rel="noopener noreferrer">
                  <RImg src={p.img} alt={p.head} className="press-mini__media" grade />
                  <div className="press-mini__body">
                    <span className="press-date">{p.date}</span>
                    <h3 className="press-mini__head">{p.head}</h3>
                  </div>
                </a>
              </Reveal>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---- Industry Insights ---- */
function Blog() {
  const [items, setItems] = uS3(() => BLOG);
  uE3(() => {
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
              <div className="eyebrow sec-eyebrow">Industry Insights</div>
              <h2 className="blog__head">What we're thinking about,<br /><span className="rr-grad">written plainly.</span></h2>
            </div>
            <a className="blog__all" href="Blog.html">View all insights<span className="ar">→</span></a>
          </div>
        </Reveal>
      </div>
      <div className="rr-wrap">
        <div className="blog-grid">
          {shown.map((b, i) =>
            <Reveal key={i} delay={i * 70} as="a" className="blog-card" href={`Blog.html#${(b.slug || b.title || "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}`}>
              <RImg src={b.img} alt={b.title} className="blog-card__img" />
              <div className="blog-card__cat">{b.cat}</div>
              <h3 className="blog-card__title">{b.title}</h3>
              <p className="blog-card__excerpt">{b.excerpt}</p>
              <div className="blog-card__meta">
                <span className="blog-card__date">{b.date}</span>
                <span className="blog-card__more">Read more<span className="ar">→</span></span>
              </div>
            </Reveal>
          )}
        </div>
      </div>
    </section>
  );
}

Object.assign(window, { Awards, Press, Blog });
