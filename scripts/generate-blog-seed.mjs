import { BLOG } from "../src/data/siteData.js";
const q = (value) => String(value ?? "").replaceAll("'", "''");
const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
console.log("-- Generated from the cleaned legacy records in src/data/siteData.js.\nbegin;");
for (const [index, blog] of BLOG.entries()) {
  const topic = `${blog.cat} ${blog.title}`;
  const category = /buy|plot|price|guide/i.test(topic) ? "Buying Guide" : /invest/i.test(topic) ? "Investment" : /market|growth/i.test(topic) ? "Market Trends" : "News";
  const [month = "Jan", year = "2024"] = (blog.date || "Jan 2024").split(" ");
  const published = new Date(Date.UTC(Number(year), months.indexOf(month), 1)).toISOString();
  const image = `/${blog.img.replace(/^\//, "")}`;
  const description = (blog.excerpt || "").slice(0, 165);
  const readTime = Math.max(1, Math.ceil((blog.content || "").split(/\s+/).filter(Boolean).length / 200));
  console.log(`insert into public.blogs(title,slug,excerpt,content,author,image,image_alt,tags,category,featured,status,published_at,seo_title,seo_description,canonical_url,og_title,og_description,og_image_url,reading_time_minutes,old_url) values ('${q(blog.title)}','${q(blog.slug)}','${q(blog.excerpt)}','${q(blog.content)}','${q(blog.author || "Ruchi Realty")}','${q(image)}','${q(blog.imageAlt || blog.title)}','{}','${category}',${index === 0},'published','${published}','${q(`${blog.title} | Ruchi Realty`)}','${q(description)}','https://ruchirealty.com/blogs/${q(blog.slug)}','${q(blog.title)}','${q(description)}','${q(image)}',${readTime},'${q(blog.url)}') on conflict(slug) do update set excerpt=excluded.excerpt,content=excluded.content,image=excluded.image,image_alt=excluded.image_alt,seo_title=excluded.seo_title,seo_description=excluded.seo_description,canonical_url=excluded.canonical_url,og_image_url=excluded.og_image_url,old_url=excluded.old_url;`);
}
console.log("commit;");
