import { readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { extname, join, relative, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(".");
const publicDir = resolve(root, "public");
const sourceExtensions = new Set([".png", ".jpg", ".jpeg"]);
const textExtensions = new Set([".css", ".html", ".js", ".jsx", ".json", ".md", ".mjs", ".cjs", ".sql", ".toml", ".txt", ".xml"]);
const excludedDirectories = new Set([".git", "node_modules", "dist", "build"]);

async function walk(directory, files = []) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && excludedDirectories.has(entry.name)) continue;
    const path = join(directory, entry.name);
    if (entry.isDirectory()) await walk(path, files);
    else files.push(path);
  }
  return files;
}

const imageFiles = (await walk(publicDir)).filter((file) => sourceExtensions.has(extname(file).toLowerCase()));
const mappings = [];
let convertedImages = 0;
let beforeBytes = 0;
let afterBytes = 0;
let normalizedWebps = 0;

for (const source of imageFiles) {
  const extension = extname(source);
  const target = source.slice(0, -extension.length) + ".webp";
  const temporary = `${target}.optimizing`;
  const sourceSize = (await stat(source)).size;
  const publicPath = relative(publicDir, source).split(String.fromCharCode(92)).join("/");
  const isBrandAsset = /(?:^|\/)(?:logo|icon|favicon|mark|signature|award|wreath)/i.test(publicPath);

  await sharp(source)
    .rotate()
    .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
    .webp({ quality: isBrandAsset ? 90 : 84, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(temporary);
  await rm(target, { force: true });
  await rename(temporary, target);
  await rm(source);

  const targetSize = (await stat(target)).size;
  beforeBytes += sourceSize;
  afterBytes += targetSize;
  mappings.push({
    source: publicPath,
    target: relative(publicDir, target).split(String.fromCharCode(92)).join("/"),
  });
  convertedImages += 1;
}

for (const file of (await walk(publicDir)).filter((entry) => extname(entry).toLowerCase() === ".webp")) {
  const metadata = await sharp(file).metadata();
  if (metadata.format === "webp") continue;
  const temporary = `${file}.normalizing`;
  await sharp(file)
    .rotate()
    .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(temporary);
  await rm(file, { force: true });
  await rename(temporary, file);
  normalizedWebps += 1;
}

const deletedSources = execFileSync("git", ["diff", "--name-only", "--diff-filter=D", "--", "public"], { encoding: "utf8" })
  .split(/\r?\n/)
  .filter(Boolean)
  .map((file) => file.replace(/^public\//, ""))
  .filter((file) => sourceExtensions.has(extname(file).toLowerCase()));
for (const source of deletedSources) {
  const target = source.slice(0, -extname(source).length) + ".webp";
  if (existsSync(resolve(publicDir, target)) && !mappings.some((mapping) => mapping.source === source)) {
    mappings.push({ source, target });
  }
}

const repositoryFiles = await walk(root);
let changedTextFiles = 0;
for (const file of repositoryFiles) {
  if (!textExtensions.has(extname(file).toLowerCase())) continue;
  let content;
  try {
    content = await readFile(file, "utf8");
  } catch {
    continue;
  }
  const original = content;
  for (const mapping of mappings) {
    const variants = [
      [mapping.source, mapping.target],
      [`/${mapping.source}`, `/${mapping.target}`],
      [`public/${mapping.source}`, `public/${mapping.target}`],
      [mapping.source.replaceAll("/", String.fromCharCode(92)), mapping.target.replaceAll("/", String.fromCharCode(92))],
    ];
    for (const [from, to] of variants) content = content.replaceAll(from, to);
  }
  if (content !== original) {
    await writeFile(file, content);
    changedTextFiles += 1;
  }
}

console.log(JSON.stringify({
  convertedImages,
  mappedReferences: mappings.length,
  normalizedWebps,
  changedTextFiles,
  beforeMB: Number((beforeBytes / 1024 / 1024).toFixed(2)),
  afterMB: Number((afterBytes / 1024 / 1024).toFixed(2)),
  savedPercent: beforeBytes ? Number(((1 - afterBytes / beforeBytes) * 100).toFixed(1)) : 0,
}, null, 2));
