import { useEffect, useMemo, useState } from "react";
import Nav from "../components/Nav";
import { Footer } from "../components/Footer";
import SEO from "../components/SEO";
import InternalLinks from "../components/InternalLinks";
import MediaHero from "../components/media/MediaHero";
import { EVENT_TYPES, getEvents } from "../services/mediaService";

export default function EventsAwardsPage() {
  const [items, setItems] = useState([]);
  const [type, setType] = useState("All");
  useEffect(() => { getEvents().then(setItems); }, []);
  const filtered = useMemo(() => items.filter((item) => type === "All" || item.item_type === type), [items, type]);
  const featured = items.find((item) => item.is_featured) || items[0];
  const isAward = (item) => ["Award", "Recognition"].includes(item?.item_type);

  return <>
    <SEO title="Events & Awards | Ruchi Realty" description="Explore Ruchi Realty's events, awards, recognitions, milestones, and media moments." canonical="https://ruchirealty.com/media/events-awards" image={featured?.image_url || "/assets/media/gallery/award-recognition-1.webp"} />
    <Nav />
    <main>
      <MediaHero title="Events & Awards" breadcrumb="Events & Awards" subtitle="Events, recognitions, milestones, and the moments that mark our journey across eastern and central India." />
      <section className="events-awards section-pad">
        <div className="rr-wrap">
          <div className="event-filters">{EVENT_TYPES.map((item) => <button className={item === type ? "is-active" : ""} onClick={() => setType(item)} key={item}>{item}</button>)}</div>
          {featured && type === "All" && <article className={`event-featured ${isAward(featured) ? "is-award" : ""}`}>
            <div className="event-featured__media"><img loading="eager" src={featured.image_url} alt={featured.title} fetchPriority="high" decoding="async" /></div>
            <div>
              <span>{featured.item_type}</span>
              <h2>{featured.title}</h2>
              <p>{featured.excerpt}</p>
              {featured.location && <small>{featured.location}</small>}
              {featured.video_url && <a href={featured.video_url} target="_blank" rel="noreferrer">Play video &#9654;</a>}
              <InternalLinks links={featured.internal_links} title="Explore related pages" compact />
            </div>
          </article>}
          <div className="event-timeline">{filtered.filter((item) => type !== "All" || item.id !== featured?.id).map((item, index) => <article className={`event-card ${isAward(item) ? "is-award" : ""}`} key={item.id}>
            <span className="event-card__line">{String(index + 1).padStart(2, "0")}</span>
            <div className="event-card__image">
              {item.image_url ? <img src={isAward(item) ? item.image_url : (item.thumbnail_url || item.image_url)} alt={item.title} loading="lazy" decoding="async" /> : <div className="media-placeholder">RR</div>}
              {item.video_url && <a href={item.video_url} target="_blank" rel="noreferrer" aria-label={`Play ${item.title}`}>&#9654;</a>}
            </div>
            <div>
              <small>{item.item_type}{item.event_date ? ` · ${new Date(item.event_date).getFullYear()}` : ""}</small>
              <h3>{item.title}</h3>
              <p>{item.excerpt}</p>
              {item.location && <em>{item.location}</em>}
              {item.external_url && <a href={item.external_url} target="_blank" rel="noreferrer">Learn more &rarr;</a>}
              <InternalLinks links={item.internal_links} title="Explore related pages" compact />
            </div>
          </article>)}</div>
          {!filtered.length && <div className="media-empty"><strong>Events & Awards will be updated soon.</strong></div>}
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
