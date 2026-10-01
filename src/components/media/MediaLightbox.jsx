import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import InternalLinks from "../InternalLinks";
import { extractYoutubeId } from "../../services/mediaService";

const GALLERY_FALLBACK_IMAGE = "/assets/media/gallery/gallery-4.webp";

const youtubeEmbed = (url = "") => {
  const id = extractYoutubeId(url);
  if (!id) return "";
  const start = url.match(/[?&]t=(\d+)/)?.[1] || 0;
  return `https://www.youtube.com/embed/${id}?autoplay=1&rel=0&start=${start}`;
};

export default function MediaLightbox({ items, index, onClose, onChange }) {
  const item = items[index];
  const [imgSrc, setImgSrc] = useState(item?.image_url || GALLERY_FALLBACK_IMAGE);

  useEffect(() => {
    if (item?.image_url) {
      setImgSrc(item.image_url);
    }
  }, [item?.image_url]);

  useEffect(() => {
    const key = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight" && items.length > 1) onChange((index + 1) % items.length);
      if (e.key === "ArrowLeft" && items.length > 1) onChange((index - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", key);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", key);
      document.body.style.overflow = "";
    };
  }, [index, items.length, onClose, onChange]);

  if (!item) return null;
  const embed = youtubeEmbed(item.video_url);

  return (
    <div className="media-lightbox" role="dialog" aria-modal="true" aria-label={item.title || "Gallery preview"} onClick={onClose}>
      <button className="media-lightbox__close" onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close lightbox" type="button">
        &times;
      </button>
      {items.length > 1 && (
        <button
          className="media-lightbox__prev"
          onClick={(e) => { e.stopPropagation(); onChange((index - 1 + items.length) % items.length); }}
          aria-label="Previous item"
          type="button"
        >
          &#8249;
        </button>
      )}
      <figure onClick={(e) => e.stopPropagation()}>
        {item.media_type === "video" ? (
          embed ? (
            <iframe
              className="media-lightbox__video"
              src={embed}
              title={item.title}
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <video className="media-lightbox__video" src={item.video_url} controls autoPlay playsInline />
          )
        ) : (
          <img
            src={imgSrc}
            alt={item.alt_text || item.title || "Ruchi Realty media"}
            loading="eager"
            decoding="async"
            onError={() => {
              if (imgSrc !== GALLERY_FALLBACK_IMAGE) {
                setImgSrc(GALLERY_FALLBACK_IMAGE);
              }
            }}
          />
        )}
        <figcaption>
          <div className="media-lightbox__info">
            {(item.album || item.category) && (
              <small className="media-lightbox__badge">{item.album || item.category}</small>
            )}
            <strong>{item.title}</strong>
            {item.caption && item.caption !== item.title && <span>{item.caption}</span>}
          </div>
          <div className="media-lightbox__actions">
            {item.category === "Events" && (
              <Link to="/media/events-awards" className="media-lightbox__more-link" onClick={onClose}>
                Events &amp; Awards &rarr;
              </Link>
            )}
            <small className="media-lightbox__counter">{index + 1} / {items.length}</small>
          </div>
        </figcaption>
        <InternalLinks links={item.internal_links} title="Explore related pages" compact />
      </figure>
      {items.length > 1 && (
        <button
          className="media-lightbox__next"
          onClick={(e) => { e.stopPropagation(); onChange((index + 1) % items.length); }}
          aria-label="Next item"
          type="button"
        >
          &#8250;
        </button>
      )}
    </div>
  );
}
