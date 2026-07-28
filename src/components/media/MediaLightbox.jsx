import { useEffect } from "react";

const youtubeEmbed = (url = "") => {
  const id = url.match(/[?&]v=([^&]+)/)?.[1] || url.match(/youtu\.be\/([^?]+)/)?.[1];
  if (!id) return "";
  const start = url.match(/[?&]t=(\d+)/)?.[1] || 0;
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&start=${start}`;
};

export default function MediaLightbox({ items, index, onClose, onChange }) {
  const item = items[index];
  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft") onChange((index - 1 + items.length) % items.length);
    };
    addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => { removeEventListener("keydown", key); document.body.style.overflow = ""; };
  }, [index, items.length]);
  if (!item) return null;
  const embed = youtubeEmbed(item.video_url);
  return <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={item.title} onClick={onClose}>
    <button className="media-lightbox__close" onClick={onClose} aria-label="Close">×</button>
    <button className="media-lightbox__prev" onClick={(e) => { e.stopPropagation(); onChange((index - 1 + items.length) % items.length); }} aria-label="Previous">‹</button>
    <figure onClick={(e) => e.stopPropagation()}>
      {item.media_type === "video" ? (embed ? <iframe className="media-lightbox__video" src={embed} title={item.title} allow="autoplay; encrypted-media; picture-in-picture" allowFullScreen /> : <video className="media-lightbox__video" src={item.video_url} controls autoPlay playsInline />) : <img src={item.image_url} alt={item.alt_text} />}
      <figcaption><strong>{item.title}</strong>{item.caption && <span>{item.caption}</span>}<small>{index + 1} / {items.length}</small></figcaption>
    </figure>
    <button className="media-lightbox__next" onClick={(e) => { e.stopPropagation(); onChange((index + 1) % items.length); }} aria-label="Next">›</button>
  </div>;
}