import Head from 'next/head';

const SITE_URL = 'https://ruchirealty.com';

export default function SEO({ title, description, canonical, image, type = 'website', article, schemas = [] }) {
  const url = new URL(canonical || '/', SITE_URL);
  url.search = '';
  url.hash = '';
  const imageUrl = new URL(image || '/assets/logo-h.webp', SITE_URL).toString();
  return <Head>
    <title>{title}</title>
    <meta name="description" content={description} key="description" />
    <link rel="canonical" href={url.toString()} key="canonical" />
    <meta property="og:title" content={title} key="og:title" />
    <meta property="og:description" content={description} key="og:description" />
    <meta property="og:url" content={url.toString()} key="og:url" />
    <meta property="og:image" content={imageUrl} key="og:image" />
    <meta property="og:type" content={type} key="og:type" />
    <meta name="twitter:card" content="summary_large_image" key="twitter:card" />
    <meta name="twitter:title" content={title} key="twitter:title" />
    <meta name="twitter:description" content={description} key="twitter:description" />
    <meta name="twitter:image" content={imageUrl} key="twitter:image" />
    {article?.publishedTime && <meta property="article:published_time" content={article.publishedTime} key="article:published_time" />}
    {article?.modifiedTime && <meta property="article:modified_time" content={article.modifiedTime} key="article:modified_time" />}
    {article?.author && <meta property="article:author" content={article.author} key="article:author" />}
    {schemas.filter(Boolean).map((schema, index) => <script key={`${schema['@id'] || schema['@type'] || 'schema'}-${index}`} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema).replace(/</g, '\\u003c') }} />)}
  </Head>;
}
