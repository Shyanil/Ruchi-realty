import { useEffect, useMemo, useState } from 'react';
import Nav from '../components/Nav';
import { Footer } from '../components/Footer';
import SEO from '../components/SEO';
import MediaHero from '../components/media/MediaHero';
import MediaLightbox from '../components/media/MediaLightbox';
import { GALLERY_CATEGORIES, getGallery } from '../services/mediaService';

const GALLERY_FALLBACK_IMAGE = '/assets/media/gallery/gallery-4.webp';

function GalleryCard({ item, index, onOpen }) {
  const [imageFailed, setImageFailed] = useState(false);
  const source = imageFailed ? GALLERY_FALLBACK_IMAGE : item.thumbnail_url || item.image_url || GALLERY_FALLBACK_IMAGE;

  return (
    <button className='media-gallery-card' type='button' onClick={() => onOpen(index)}>
      <img decoding="async" src={source} alt={item.alt_text || item.title || 'Ruchi Realty gallery'} loading={index < 4 ? 'eager' : 'lazy'} onError={() => setImageFailed(true)} />
      {item.media_type === 'video' && <b className='media-gallery-card__play' aria-hidden='true'>&#9654;</b>}
      <span>
        <small>{item.album || item.category}</small>
        <strong>{item.title}</strong>
        <em>{item.media_type === 'video' ? 'Play video' : 'View image'} +</em>
      </span>
    </button>
  );
}

export default function MediaGalleryPage() {
  const [items, setItems] = useState([]);
  const [category, setCategory] = useState(GALLERY_CATEGORIES[0]);
  const [query, setQuery] = useState('');
  const [limit, setLimit] = useState(12);
  const [active, setActive] = useState(-1);

  useEffect(() => { getGallery().then(setItems); }, []);

  const filtered = useMemo(() => items.filter((item) => item.category === category && `${item.title} ${item.caption} ${item.album}`.toLowerCase().includes(query.toLowerCase())), [items, category, query]);
  const shown = filtered.slice(0, limit);
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: 'Ruchi Realty Gallery',
    url: 'https://ruchirealty.com/media/gallery',
    associatedMedia: shown.map((item) => ({ '@type': 'ImageObject', contentUrl: `https://ruchirealty.com${item.image_url}`, caption: item.caption, name: item.title })),
  };

  return <>
    <SEO title='Gallery | Ruchi Realty Projects, Events & Lifestyle' description='Explore the Ruchi Realty gallery featuring project visuals, amenities, construction updates, lifestyle moments, events, awards, and community highlights.' canonical='https://ruchirealty.com/media/gallery' image={items[0]?.image_url || GALLERY_FALLBACK_IMAGE} schemas={[schema]} />
    <Nav />
    <main>
      <MediaHero title='Gallery' breadcrumb='Gallery' subtitle='Project visuals, lifestyle moments, construction updates, events, awards, and the communities taking shape around us.' />
      <section className='media-gallery section-pad'>
        <div className='rr-wrap'>
          <div className='media-filter'>
            <input type='search' placeholder='Search gallery' value={query} onChange={(event) => { setQuery(event.target.value); setLimit(12); }} />
            <div>{GALLERY_CATEGORIES.map((item) => <button className={item === category ? 'is-active' : ''} type='button' onClick={() => { setCategory(item); setLimit(12); }} key={item}>{item}</button>)}</div>
          </div>
          <div className='media-masonry'>{shown.map((item, index) => <GalleryCard item={item} index={index} key={item.id} onOpen={setActive} />)}</div>
          {limit < filtered.length && <button className='media-load' type='button' onClick={() => setLimit((value) => value + 12)}>Load more</button>}
          {!filtered.length && <p className='media-empty'>No gallery items match this filter.</p>}
        </div>
      </section>
      {active >= 0 && <MediaLightbox items={shown} index={active} onClose={() => setActive(-1)} onChange={setActive} />}
    </main>
    <Footer />
  </>;
}
