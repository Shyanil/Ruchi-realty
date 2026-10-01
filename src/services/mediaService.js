import { GALLERY_MEDIA } from "../data/galleryMedia.js";
export const GALLERY_CATEGORIES = ["Videos","Events","Office Culture"];
export const EVENT_TYPES = ["All","Event","Award","Media Coverage"];
export const slugifyMedia = (value = "") => value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
let manifestCache;
const manifest = async () => manifestCache || (manifestCache = await fetch("/assets/media/gallery/media-assets-manifest.json").then((r) => r.json()));
export const extractYoutubeId = (url = "") => {
  if (typeof url !== "string") return "";
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([\w-]{11})/i);
  return match ? match[1] : "";
};
export const youtubeThumb = (url = "") => {
  const id = extractYoutubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/mqdefault.jpg` : "";
};
export const fixLocalMediaExt = (url = "") => {
  if (typeof url !== "string") return url;
  if (url.startsWith("/assets/media/")) {
    return url.replace(/\.(jpg|jpeg|png)$/i, ".webp");
  }
  return url;
};
export const normalizeGallery = (item) => {
  if (!item) return null;
  const isVideo = Boolean(item.video_url && item.video_url.trim()) || item.media_type === "video";
  const ytThumb = item.video_url ? youtubeThumb(item.video_url) : "";
  const rawImage = item.image_url || item.media_assets?.public_url || item.public_url || ytThumb;
  const image = fixLocalMediaExt(rawImage);
  const rawThumb = item.thumbnail_url || item.media_assets?.thumbnail_url || ytThumb || image;
  const thumb = fixLocalMediaExt(rawThumb);
  return {
    ...item,
    id: item.id || item.hash,
    media_type: isVideo ? "video" : (item.media_type || "image"),
    image_url: image || thumb,
    thumbnail_url: thumb || image,
    title: item.title || item.alt_text || "Gallery Item",
    category: item.category || (isVideo ? "Videos" : "Events"),
    is_featured: Boolean(item.is_featured),
    internal_links: Array.isArray(item.internal_links) ? item.internal_links : []
  };
};
export async function getGallery(admin = false) { const fn = admin ? window.RuchiBackend?.media?.getAllGallery : window.RuchiBackend?.media?.getGallery; const result = await fn?.(); if (result?.data?.length) return result.data.map(normalizeGallery); return GALLERY_MEDIA.map(normalizeGallery); }
const normalizeAwardTitle = (value = "") => value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const AWARD_COVERS = {
  "mega property expo award": "/assets/media/award-mega-property-expo-2025-transparent.webp",
  "ultra high luxury developer of the year": "/assets/media/award-ultra-high-luxury-developer-transparent.webp",
  "luxury project of the year": "/assets/media/award-luxury-project-golden-brick-2025-transparent.webp",
  "golden brick award": "/assets/media/award-luxury-project-golden-brick-2025-transparent.webp",
  "company of the year": "/assets/media/award-company-of-the-year-transparent.webp",
  "times property show award": "/assets/media/award-times-property-show-transparent.webp",
  "property show award credai": "/assets/media/award-credai-property-show-transparent.webp",
  "property fair awards hdfc": "/assets/media/award-hdfc-property-fair-transparent.webp",
  "malwa vyapar awards": "/assets/media/award-malwa-vyapar-transparent.webp",
  "vishisht atithi awards": "/assets/media/award-vishesh-atithi-transparent.webp",
  "vishesh atithi awards": "/assets/media/award-vishesh-atithi-transparent.webp",
  "real estate fair award": "/assets/media/award-real-estate-fair-2025-transparent.webp",
  "most prestigious property exhibition": "/assets/media/award-prestigious-property-exhibition-transparent.webp",
  "property auto expo award": "/assets/media/award-property-auto-expo-transparent.webp",
};
const withCover = (item) => {
  const localAwardCover = AWARD_COVERS[normalizeAwardTitle(item.title)];
  const rawImage = localAwardCover || item.image_url || item.media_assets?.public_url || "";
  const image = fixLocalMediaExt(rawImage);
  const rawThumb = localAwardCover || item.thumbnail_url || item.media_assets?.thumbnail_url || image;
  const thumb = fixLocalMediaExt(rawThumb);
  return { ...item, image_url:image, thumbnail_url:thumb, internal_links:Array.isArray(item.internal_links)?item.internal_links:[] };
};
export async function getPress(admin = false) { const fn = admin ? window.RuchiBackend?.media?.getAllPress : window.RuchiBackend?.media?.getPress; const result = await fn?.(); return (result?.data || []).map(withCover); }
export async function getPressBySlug(slug) { const result = await window.RuchiBackend?.media?.getPressBySlug?.(slug); return result?.data ? withCover(result.data) : null; }
export async function getEvents(admin = false) { const fn = admin ? window.RuchiBackend?.media?.getAllEvents : window.RuchiBackend?.media?.getEvents; const result = await fn?.(); if (result?.data?.length) return result.data.map(withCover); const items = await manifest(); return items.filter((item) => item.category === "Events" || item.category === "Awards").map((item,index) => ({ id:item.hash, title:item.title, slug:item.slug, item_type:item.category === "Awards" ? "Award" : item.slug.startsWith("bhaskar") ? "Media Coverage" : "Event", excerpt:item.caption, description:item.caption, image_url:item.public_url, thumbnail_url:item.thumbnail_url, status:"published", is_featured:index === 0, display_order:index })); }
