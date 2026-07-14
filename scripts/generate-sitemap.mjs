import { BLOG } from "../src/data/siteData.js";
const today = new Date().toISOString().slice(0, 10);
const media = ["/media","/media/gallery","/media/press-releases","/media/events-awards"].map((path) => ({ path, lastmod: today }));
const urls = [{ path: "/blogs", lastmod: today }, ...BLOG.map((blog) => ({ path: `/blogs/${blog.slug}`, lastmod: new Date(`${blog.date || "Jan 2024"} 1`).toISOString().slice(0, 10) })), ...media];
console.log(`<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(({ path, lastmod }) => `  <url><loc>https://ruchirealty.com${path}</loc><lastmod>${lastmod}</lastmod></url>`).join("\n")}\n</urlset>`);
