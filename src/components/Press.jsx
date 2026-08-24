import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, RImg } from "./shared";
import { PRESS } from "../data/siteData";
import { getEvents, getGallery, getPress } from "../services/mediaService";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Media";
const CURATED_COVERS = ["/assets/media/gallery/bhaskar-event-1.webp", "/assets/media/gallery/credai-event-1.webp", "/assets/media/gallery/gallery-4.webp"];
const pressCover = (item, index) => item.image_url && !item.image_url.includes("press-release-placeholder") && !item.image_url.includes("landline") ? item.image_url : CURATED_COVERS[index % CURATED_COVERS.length];
const normalizeTitle = (value = "") => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const uniqueByTitle = (items) => items.filter((item, index, list) => list.findIndex((entry) => normalizeTitle(entry.title) === normalizeTitle(item.title)) === index);
const fallbackPress = PRESS.slice(0, 3).map((item, index) => ({ id: `press-${index}`, title: item.head, date: item.date, image: item.img, href: "/media/press-releases", type: "Press release" }));
const fallbackUpdates = [
  { id: "event-credai-highlights", title: "CREDAI event highlights", date: "Media", image: "/assets/media/gallery/credai-event-2.webp", href: "/media/events-awards", type: "Event" },
  { id: "event-credai-ruchi", title: "CREDAI event at Ruchi Realty", date: "Media", image: "/assets/media/gallery/credai-event-1.webp", href: "/media/events-awards", type: "Event" },
  { id: "event-bhaskar", title: "Bhaskar media event", date: "Media", image: "/assets/media/gallery/bhaskar-event-1.webp", href: "/media/events-awards", type: "Media coverage" },
];

function NewsCard({ item, index }) {
  return (
    <Link className="press-card" to={item.href}>
      <RImg src={item.image || CURATED_COVERS[index % CURATED_COVERS.length]} alt={item.title} className="press-card__media" grade />
      <div className="press-card__body">
        <span className="press-date">{item.type} · {item.date}</span>
        <h3>{item.title}</h3>
        <span>View story <span aria-hidden="true">→</span></span>
      </div>
    </Link>
  );
}

export function Press() {
  const [news, setNews] = useState({ press: fallbackPress, updates: fallbackUpdates });

  useEffect(() => {
    let active = true;
    Promise.all([getPress(), getGallery(), getEvents()]).then(([press, gallery, events]) => {
      if (!active) return;
      const latestPress = uniqueByTitle(press.map((item, index) => ({
        id: `press-${item.id}`,
        title: item.title,
        date: formatDate(item.release_date),
        image: pressCover(item, index),
        href: item.slug ? `/media/press-releases/${item.slug}` : "/media/press-releases",
        type: item.source_name || "Press release",
      }))).slice(0, 3);
      const eventUpdates = events.map((item, index) => ({
        id: `event-${item.id}`,
        title: item.title,
        date: formatDate(item.event_date),
        image: item.image_url || CURATED_COVERS[index % CURATED_COVERS.length],
        href: "/media/events-awards",
        type: item.item_type || "Event",
      }));
      const galleryUpdates = gallery.filter((item) => item.is_featured).map((item) => ({
        id: `gallery-${item.id}`,
        title: item.title,
        date: item.album || "Gallery",
        image: item.image_url,
        href: "/media/gallery",
        type: item.category || "Media update",
      }));
      const latestUpdates = uniqueByTitle([...eventUpdates, ...galleryUpdates, ...fallbackUpdates]).slice(0, 3);
      setNews({
        press: latestPress.length === 3 ? latestPress : uniqueByTitle([...latestPress, ...fallbackPress]).slice(0, 3),
        updates: latestUpdates,
      });
    });
    return () => { active = false; };
  }, []);

  return (
    <section className="section-pad press" id="press">
      <div className="rr-wrap">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="eyebrow sec-eyebrow">News and updates</div>
              <h2 className="press__head">Latest News, Milestones <span className="rr-grad">&amp; Community Updates</span></h2>
            </div>
          </div>
        </Reveal>
        <div className="press-groups">
          <section className="press-group" aria-labelledby="latest-press-heading">
            <h3 className="press-group__title" id="latest-press-heading">Latest Press Releases</h3>
            <div className="press-news-grid">
              {news.press.map((item, index) => <NewsCard item={item} index={index} key={item.id} />)}
            </div>
          </section>
          <section className="press-group" aria-labelledby="latest-media-heading">
            <h3 className="press-group__title" id="latest-media-heading">Latest Events &amp; Media Updates</h3>
            <div className="press-news-grid">
              {news.updates.map((item, index) => <NewsCard item={item} index={index} key={item.id} />)}
            </div>
          </section>
        </div>
        <div className="press__footer">
          <Link className="blog__all" to="/media">View All News &amp; Media <span className="ar">→</span></Link>
        </div>
      </div>
    </section>
  );
}
