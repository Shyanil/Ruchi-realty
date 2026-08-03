import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { Footer } from '../components/Footer';
import SEO from '../components/SEO';
import MediaHero from '../components/media/MediaHero';
import { getPress } from '../services/mediaService';

const date = (value) => value ? new Date(value).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'Press update';

export default function PressReleasesPage() {
  const [items, setItems] = useState([]);
  const [query, setQuery] = useState('');

  useEffect(() => { getPress().then(setItems); }, []);

  const filtered = useMemo(() => items.filter((item) => `${item.title} ${item.excerpt} ${item.source_name}`.toLowerCase().includes(query.toLowerCase())), [items, query]);
  const coverImage = filtered.find((item) => item.is_featured)?.image_url || filtered[0]?.image_url || '/assets/media/gallery/press-release-placeholder.webp';

  return <>
    <SEO title='Press Releases | Ruchi Realty News & Media Updates' description='Stay updated with official press releases, announcements, media updates, and real estate developments from Ruchi Realty.' canonical='https://ruchirealty.com/media/press-releases' image={coverImage} />
    <Nav />
    <main>
      <MediaHero title='Press Releases' breadcrumb='Press Releases' subtitle='Official announcements, company updates, press coverage, and notes from Ruchi Realty.' />
      <section className='media-press section-pad'>
        <div className='rr-wrap'>
          <div className='media-press__toolbar media-press__toolbar--search'>
            <input type='search' placeholder='Search press releases' value={query} onChange={(event) => setQuery(event.target.value)} />
          </div>
          <div className='press-list'>
            {filtered.map((item) => <article key={item.id}>
              <time>{date(item.release_date)}</time>
              <div>
                <small>{item.source_name || 'Ruchi Realty'}</small>
                <h3><Link to={`/media/press-releases/${item.slug}`}>{item.title}</Link></h3>
                <p>{item.excerpt}</p>
                <div>
                  <Link to={`/media/press-releases/${item.slug}`}>Read More &rarr;</Link>
                  {item.pdf_url && <a href={item.pdf_url}>Download PDF</a>}
                  {item.external_url && <a href={item.external_url} target='_blank' rel='noreferrer'>View Source</a>}
                </div>
              </div>
            </article>)}
          </div>
          {!filtered.length && <div className='media-empty'><strong>Press releases will be updated soon.</strong><p>Official Ruchi Realty announcements and media notes will appear here.</p></div>}
        </div>
      </section>
    </main>
    <Footer />
  </>;
}
