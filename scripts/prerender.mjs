import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "../.ssr/entry-server.js";
import { PROJECTS } from "../src/data/projects.js";
import { BLOG } from "../src/data/siteData.js";
import { LOCAL_SEO_PAGE_LIST } from "../src/data/localSeoPages.js";

const root = resolve(".");
const dist = resolve(root, "dist");
const template = await readFile(resolve(dist, "index.html"), "utf8");
const siteUrl = "https://ruchirealty.com";

const staticPages = [
  { path: "/", title: "Ruchi Realty | Real Estate Developer in Kolkata, Indore & Bhopal", description: "Explore residential apartments, commercial spaces and plotted developments by Ruchi Realty across Kolkata, Indore and Bhopal. View project details, locations, status, brochures and site visit options." },
  { path: "/about", title: "About Ruchi Realty | Company, Projects and Leadership", description: "Learn about Ruchi Realty, founded in 2008, its residential, commercial and plotted developments across Kolkata, Indore and Bhopal, and its leadership." },
  { path: "/projects", title: "Ruchi Realty Projects | Kolkata, Indore & Bhopal", description: "Explore Ruchi Realty residential, commercial and plotted developments across Kolkata, Indore and Bhopal." },
  { path: "/blogs", title: "Real Estate Insights & Guides | Ruchi Realty", description: "Read Ruchi Realty insights on home buying, property investment, plotted developments and real estate markets in Kolkata, Indore and Bhopal." },
  { path: "/careers", title: "Careers at Ruchi Realty", description: "Explore career opportunities with Ruchi Realty across real estate sales, engineering, customer service and operations." },
  { path: "/contact", title: "Contact Ruchi Realty | Kolkata, Indore & Bhopal", description: "Contact Ruchi Realty for project enquiries and office information in Kolkata, Indore and Bhopal." },
  { path: "/media", title: "Ruchi Realty Media Centre", description: "Explore the latest Ruchi Realty galleries, press releases, events and awards." },
  { path: "/media/gallery", title: "Gallery | Ruchi Realty Projects, Events & Lifestyle", description: "Explore Ruchi Realty project visuals, construction updates, lifestyle moments, events, awards and community highlights." },
  { path: "/media/press-releases", title: "Press Releases | Ruchi Realty", description: "Read announcements, project updates and company news from Ruchi Realty." },
  { path: "/media/events-awards", title: "Events & Awards | Ruchi Realty", description: "Explore Ruchi Realty events, recognitions and awards across its projects and communities." },
  { path: "/privacy-policy", title: "Privacy Policy | Ruchi Realty", description: "Read the Ruchi Realty privacy policy." },
  { path: "/disclaimer", title: "Disclaimer | Ruchi Realty", description: "Read the Ruchi Realty website disclaimer." },
];

const projectPages = PROJECTS.filter((project) => project.url).map((project) => ({
  path: project.url,
  title: `${project.name} | Ruchi Realty`,
  description: `Explore ${project.name}, a ${project.status.toLowerCase()} ${project.type.toLowerCase()} development by Ruchi Realty in ${project.city}.`,
}));

const blogPages = BLOG.map((post) => ({
  path: `/blogs/${post.slug}`,
  title: `${post.title} | Ruchi Realty`,
  description: post.excerpt,
}));

const localSeoPages = LOCAL_SEO_PAGE_LIST.map((page) => ({
  path: page.path,
  title: page.title,
  description: page.description,
}));

const pages = [...new Map([...staticPages, ...localSeoPages, ...projectPages, ...blogPages].map((page) => [page.path, page])).values()];

function escapeAttribute(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

for (const page of pages) {
  let app;
  try {
    app = render(page.path);
  } catch (error) {
    console.error(`SSR failed for ${page.path}:`, error);
    throw error;
  }

  if (!app || app.length < 500 || !/<(?:main|h1|article|section)\b/i.test(app)) {
    throw new Error(`Prerender produced insufficient HTML for ${page.path} (${app?.length ?? 0} characters).`);
  }

  const canonical = `${siteUrl}${page.path === "/" ? "/" : page.path}`;
  const title = escapeAttribute(page.title);
  const description = escapeAttribute(page.description);
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${title}</title>`)
    .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${description}">`)
    .replace("</head>", `<link rel="canonical" href="${canonical}">\n<meta property="og:title" content="${title}">\n<meta property="og:description" content="${description}">\n<meta property="og:url" content="${canonical}">\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`);

  if (html.includes('<div id="root"></div>')) {
    throw new Error(`Empty SPA shell remained after prerendering ${page.path}.`);
  }

  const file = page.path === "/" ? "index.html" : `${page.path.slice(1)}/index.html`;
  const target = resolve(dist, file);
  await mkdir(resolve(target, ".."), { recursive: true });
  await writeFile(target, html);
  console.log(`Prerendered ${page.path} -> ${file} (${Buffer.byteLength(html)} bytes, app ${app.length} chars)`);
}

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${pages.map((page) => `  <url><loc>${siteUrl}${page.path === "/" ? "/" : page.path}</loc></url>`).join("\n")}
</urlset>
`;
await writeFile(resolve(dist, "sitemap.xml"), sitemap);

await writeFile(resolve(dist, "About.html"), await readFile(resolve(dist, "about/index.html"), "utf8"));
await writeFile(resolve(dist, "Projects.html"), await readFile(resolve(dist, "projects/index.html"), "utf8"));
await writeFile(resolve(dist, "Blog.html"), await readFile(resolve(dist, "blogs/index.html"), "utf8"));
await writeFile(resolve(dist, "Careers.html"), await readFile(resolve(dist, "careers/index.html"), "utf8"));
await writeFile(resolve(dist, "Contact.html"), await readFile(resolve(dist, "contact/index.html"), "utf8"));
await rm(resolve(root, ".ssr"), { recursive: true, force: true });
console.log(`Prerender complete: ${pages.length} crawlable pages contain server-rendered HTML.`);
