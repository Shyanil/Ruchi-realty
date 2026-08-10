import { readdir, readFile, rename, rm, stat, writeFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { extname, join, relative, resolve } from "node:path";
import sharp from "sharp";

const root = resolve(".");
const publicDir = resolve(root, "public");
const sourceExtensions = new Set([".png", ".jpg", ".jpeg"]);
const textExtensions = new Set([".css", ".html", ".js", ".jsx", ".json", ".md", ".mjs", ".cjs", ".sql", ".toml", ".txt", ".xml"]);
const excludedDirectories = new Set([".git", "node_modules", "dist", "build"]);
const manifestPath = resolve(root, "scripts", "image-optimization-manifest.json");
const optimizationVersion = 1;

function webpSettings(publicPath, hasAlpha = false) {
  const isBrandAsset = /(?:^|\/)(?:logo|icon|favicon|mark|signature|award|wreath)/i.test(publicPath);
  const isDetailAsset = /(?:floor|plan|layout|map|diagram|specification)/i.test(publicPath);
  const isHeroAsset = /(?:hero|banner|cover|poster)/i.test(publicPath);
  const maxDimension = isDetailAsset ? 2400 : isHeroAsset ? 2200 : 1920;
  const quality = isBrandAsset ? 90 : isDetailAsset ? 86 : isHeroAsset ? 82 : hasAlpha ? 84 : 80;
  return { maxDimension, quality, alphaQuality: isBrandAsset ? 100 : 92 };
}

function contentHash(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

let optimizationManifest = { version: optimizationVersion, files: {} };
try {
  const savedManifest = JSON.parse(await readFile(manifestPath, "utf8"));
  if (savedManifest.version === optimizationVersion && savedManifest.files) optimizationManifest = savedManifest;
} catch {
  // The first optimization run creates the manifest.
}

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
let optimizedWebps = 0;
let webpBeforeBytes = 0;
let webpAfterBytes = 0;

for (const source of imageFiles) {
  const extension = extname(source);
  const target = source.slice(0, -extension.length) + ".webp";
  const temporary = `${target}.optimizing`;
  const sourceInput = await readFile(source);
  const sourceSize = sourceInput.length;
  const publicPath = relative(publicDir, source).split(String.fromCharCode(92)).join("/");
  const metadata = await sharp(sourceInput).metadata();
  const settings = webpSettings(publicPath, metadata.hasAlpha);

  await rm(temporary, { force: true });
  await sharp(sourceInput)
    .rotate()
    .resize({ width: settings.maxDimension, height: settings.maxDimension, fit: "inside", withoutEnlargement: true })
    .webp({ quality: settings.quality, alphaQuality: settings.alphaQuality, effort: 6, smartSubsample: true })
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
  optimizationManifest.files[mappings.at(-1).target] = contentHash(await readFile(target));
  convertedImages += 1;
}

for (const file of (await walk(publicDir)).filter((entry) => extname(entry).toLowerCase() === ".webp")) {
  const publicPath = relative(publicDir, file).split(String.fromCharCode(92)).join("/");
  const input = await readFile(file);
  const inputHash = contentHash(input);
  if (optimizationManifest.files[publicPath] === inputHash) continue;

  const metadata = await sharp(input).metadata();
  const settings = webpSettings(publicPath, metadata.hasAlpha);
  const needsResize = (metadata.width || 0) > settings.maxDimension || (metadata.height || 0) > settings.maxDimension;
  if (metadata.format === "webp" && input.length < 64 * 1024 && !needsResize) {
    optimizationManifest.files[publicPath] = inputHash;
    continue;
  }

  const temporary = `${file}.optimizing`;
  await rm(temporary, { force: true });
  await sharp(input)
    .rotate()
    .resize({ width: settings.maxDimension, height: settings.maxDimension, fit: "inside", withoutEnlargement: true })
    .webp({ quality: settings.quality, alphaQuality: settings.alphaQuality, effort: 6, smartSubsample: true })
    .toFile(temporary);
  const candidateSize = (await stat(temporary)).size;
  const shouldReplace = metadata.format !== "webp" || needsResize || candidateSize <= input.length * 0.98;
  if (shouldReplace) {
    await rm(file, { force: true });
    await rename(temporary, file);
    const output = await readFile(file);
    webpBeforeBytes += input.length;
    webpAfterBytes += output.length;
    optimizationManifest.files[publicPath] = contentHash(output);
    if (metadata.format !== "webp") normalizedWebps += 1;
    else optimizedWebps += 1;
  } else {
    await rm(temporary, { force: true });
    optimizationManifest.files[publicPath] = inputHash;
  }
}

await writeFile(manifestPath, `${JSON.stringify(optimizationManifest, null, 2)}\n`);

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
  optimizedWebps,
  changedTextFiles,
  beforeMB: Number((beforeBytes / 1024 / 1024).toFixed(2)),
  afterMB: Number((afterBytes / 1024 / 1024).toFixed(2)),
  savedPercent: beforeBytes ? Number(((1 - afterBytes / beforeBytes) * 100).toFixed(1)) : 0,
  webpBeforeMB: Number((webpBeforeBytes / 1024 / 1024).toFixed(2)),
  webpAfterMB: Number((webpAfterBytes / 1024 / 1024).toFixed(2)),
  webpSavedPercent: webpBeforeBytes ? Number(((1 - webpAfterBytes / webpBeforeBytes) * 100).toFixed(1)) : 0,
}, null, 2));
