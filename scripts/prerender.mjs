import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { render } from "../.ssr/entry-server.js";

const root = resolve(".");
const dist = resolve(root, "dist");
const template = await readFile(resolve(dist, "index.html"), "utf8");
const pages = [
  { path: "/", file: "index.html", title: "Ruchi Realty | Real Estate Developer in Kolkata, Indore & Bhopal", description: "Founded in 2008, Ruchi Realty has delivered residential, commercial and plotted developments across Kolkata, Indore and Bhopal. Explore 20+ projects." },
  { path: "/about", file: "about/index.html", title: "About Ruchi Realty | Legacy, Projects & Leadership", description: "Meet Ruchi Realty’s leadership and explore a legacy founded in 2008, with 20+ residential, commercial and plotted projects across three Indian cities." },
];

for (const page of pages) {
  const app = render(page.path);
  const canonical = `https://ruchirealty.com${page.path === "/" ? "/" : page.path}`;
  const html = template
    .replace(/<title>[\s\S]*?<\/title>/i, `<title>${page.title}</title>`)
    .replace(/<meta name="description"[^>]*>/i, `<meta name="description" content="${page.description}">`)
    .replace("</head>", `<link rel="canonical" href="${canonical}">\n<meta property="og:title" content="${page.title}">\n<meta property="og:description" content="${page.description}">\n<meta property="og:url" content="${canonical}">\n</head>`)
    .replace('<div id="root"></div>', `<div id="root">${app}</div>`);
  const target = resolve(dist, page.file);
  await mkdir(resolve(target, ".."), { recursive: true });
  await writeFile(target, html);
}

await writeFile(resolve(dist, "About.html"), await readFile(resolve(dist, "about/index.html"), "utf8"));
await rm(resolve(root, ".ssr"), { recursive: true, force: true });
console.log("Prerendered / and /about with route-specific metadata.");
