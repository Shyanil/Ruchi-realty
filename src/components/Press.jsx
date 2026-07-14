import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Reveal, RImg } from "./shared";
import { PRESS } from "../data/siteData";
import { getEvents, getGallery, getPress } from "../services/mediaService";

const formatDate = (value) => value ? new Date(value).toLocaleDateString("en-IN", { month: "short", year: "numeric" }) : "Media";
const CURATED_COVERS = ["/assets/media/gallery/bhaskar-event-1.webp", "/assets/media/gallery/credai-event-1.webp", "/assets/media/gallery/gallery-4.webp"];
const pressCover = (item, index) => item.image_url && !item.image_url.includes("press-release-placeholder") && !item.image_url.includes("landline") ? item.image_url : CURATED_COVERS[index % CURATED_COVERS.length];
const fallback = PRESS.slice(0, 3).map((item, index) => ({ id: `press-${index}`, title: item.head, date: item.date, image: item.img, href: "/media/press-releases", type: "Press release" }));

export function Press() {
  const [items, setItems] = useState(fallback);
  useEffect(() => {
    let active = true;
    Promise.all([getPress(), getGallery(), getEvents()]).then(([press, gallery, events]) => {
      if (!active) return;
      const selected = [
        ...press.slice(0, 2).map((item, index) => ({ id: `press-${item.id}`, title: item.title, date: formatDate(item.release_date), image: pressCover(item, index), href: `/media/press-releases/${item.slug}`, type: item.source_name || "Press release" })),
        ...gallery.filter((item) => item.is_featured).slice(0, 1).map((item) => ({ id: `gallery-${item.id}`, title: item.title, date: item.album || "Gallery", image: item.image_url, href: "/media/gallery", type: item.category })),
      ];
      if (selected.length < 3) selected.push(...events.slice(0, 3 - selected.length).map((item, index) => ({ id: `event-${item.id}`, title: item.title, date: formatDate(item.event_date), image: item.image_url || CURATED_COVERS[index + 1], href: "/media/events-awards", type: item.item_type })));
      if (selected.length < 3) selected.push(...gallery.filter((item) => !selected.some((entry) => entry.id === `gallery-${item.id}`)).slice(0, 3 - selected.length).map((item) => ({ id: `gallery-${item.id}`, title: item.title, date: item.album || "Gallery", image: item.image_url, href: "/media/gallery", type: item.category })));
      if (selected.length) setItems(selected.slice(0, 3));
    });
    return () => { active = false; };
  }, []);

  const featured = items[0];
  const side = items.slice(1, 3);
  return <section className="section-pad press" id="press"><div className="rr-wrap"><Reveal><div className="sec-head"><div><div className="eyebrow sec-eyebrow">Press &amp; Media</div><h2 className="press__head">A name that finds its<br />way into <span className="rr-grad">the news.</span></h2></div><Link className="press__all" to="/media">Explore all media<span className="ar">→</span></Link></div></Reveal>{featured && <div className="press-grid"><Reveal><Link className="press-feat" to={featured.href}><RImg src={featured.image || "/assets/media/gallery/bhaskar-event-1.webp"} alt={featured.title} className="press-feat__media" grade /><div className="press-feat__body"><span className="press-date">{featured.type} · {featured.date}</span><h3 className="press-feat__head">{featured.title}</h3><span className="press-read">View media story<span className="ar">→</span></span></div></Link></Reveal><div className="press-side">{side.map((item, index) => <Reveal key={item.id} delay={(index + 1) * 70}><Link className="press-mini" to={item.href}><RImg src={item.image || "/assets/media/gallery/gallery-4.webp"} alt={item.title} className="press-mini__media" grade /><div className="press-mini__body"><span className="press-date">{item.type} · {item.date}</span><h3 className="press-mini__head">{item.title}</h3><span className="press-mini__link">View story →</span></div></Link></Reveal>)}</div></div>}</div></section>;
}
