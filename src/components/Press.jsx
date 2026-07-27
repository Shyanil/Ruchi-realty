import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, RImg } from "./shared";
import { PRESS } from "../data/siteData";
import { getEvents, getGallery, getPress } from "../services/mediaService";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Media";
const CURATED_COVERS = ["/assets/media/gallery/bhaskar-event-1.webp", "/assets/media/gallery/credai-event-1.webp", "/assets/media/gallery/gallery-4.webp"];
const pressCover = (item, index) => item.image_url && !item.image_url.includes("press-release-placeholder") && !item.image_url.includes("landline") ? item.image_url : CURATED_COVERS[index % CURATED_COVERS.length];
const fallback = PRESS.map((item, index) => ({ id: `press-${index}`, title: item.head, date: item.date, image: item.img, href: "/media/press-releases", type: "Press release" }));

export function Press() {
  const [items, setItems] = useState(fallback);

  useEffect(() => {
    let active = true;
    Promise.all([getPress(), getGallery(), getEvents()]).then(([press, gallery, events]) => {
      if (!active) return;
      const selected = [
        ...press.slice(0, 4).map((item, index) => ({ id: `press-${item.id}`, title: item.title, date: formatDate(item.release_date), image: pressCover(item, index), href: `/media/press-releases/${item.slug}`, type: item.source_name || "Press release" })),
        ...events.slice(0, 3).map((item, index) => ({ id: `event-${item.id}`, title: item.title, date: formatDate(item.event_date), image: item.image_url || CURATED_COVERS[index % CURATED_COVERS.length], href: "/media/events-awards", type: item.item_type })),
        ...gallery.filter((item) => item.is_featured).slice(0, 2).map((item) => ({ id: `gallery-${item.id}`, title: item.title, date: item.album || "Gallery", image: item.image_url, href: "/media/gallery", type: item.category })),
      ];
      if (selected.length < 4) selected.push(...gallery.filter((item) => !selected.some((entry) => entry.id === `gallery-${item.id}`)).slice(0, 4 - selected.length).map((item) => ({ id: `gallery-${item.id}`, title: item.title, date: item.album || "Gallery", image: item.image_url, href: "/media/gallery", type: item.category })));
      if (selected.length) setItems(selected);
    });
    return () => { active = false; };
  }, []);

  const loopItems = items.length < 4 ? [...items, ...items] : items;
  return <section className="section-pad press" id="press"><div className="rr-wrap"><Reveal><div className="sec-head"><div><div className="eyebrow sec-eyebrow">Press &amp; Media</div><h2 className="press__head">A name that finds its<br />way into <span className="rr-grad">the news.</span></h2></div><Link className="press__all" to="/media">Explore all media<span className="ar">→</span></Link></div></Reveal></div>{loopItems.length > 0 && <div className="press-scroll" aria-label="Latest press and media"><div className="press-scroll__track">{[...loopItems, ...loopItems].map((item, index) => <Link className="press-card" to={item.href} key={`${item.id}-${index}`} aria-hidden={index >= loopItems.length ? "true" : undefined} tabIndex={index >= loopItems.length ? -1 : undefined}><RImg src={item.image || CURATED_COVERS[index % CURATED_COVERS.length]} alt={item.title} className="press-card__media" grade /><div className="press-card__body"><span className="press-date">{item.type} · {item.date}</span><h3>{item.title}</h3><span>View story <span aria-hidden="true">→</span></span></div></Link>)}</div></div>}</section>;
}
