import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import sharp from "sharp";

const sourceDir = "C:/tmp/ruchi-media-source";
const outputDir = "public/assets/media/gallery";
const thumbDir = `${outputDir}/thumbs`;
fs.mkdirSync(thumbDir, { recursive: true });

const definitions = [
  ["Credai-Event2-300x169.webp", "credai-event-2", "CREDAI event highlights", "Events", "Events & Awards"],
  ["Credai-Event1-300x169.webp", "credai-event-1", "CREDAI event at Ruchi Realty", "Events", "Events & Awards"],
  ["Bhaskar-Event1-300x169.webp", "bhaskar-event-1", "Bhaskar media event", "Events", "Media Coverage"],
  ["5-300x300.jpg", "project-lifestyle-5", "Ruchi Realty project lifestyle", "Projects", "Project & Lifestyle"],
  ["6-300x300.jpg", "project-lifestyle-6", "Ruchi Realty residential project", "Projects", "Project & Lifestyle"],
  ["2-2-2-300x300.jpg", "project-lifestyle-2", "Lifestyle at a Ruchi Realty project", "Lifestyle", "Project & Lifestyle"],
  ["8-300x225.jpeg", "project-gallery-8", "Ruchi Realty project gallery", "Projects", "Project & Lifestyle"],
  ["4-300x225.jpeg", "project-gallery-4", "Ruchi Realty development view", "Projects", "Project & Lifestyle"],
  ["9-300x225.jpeg", "project-gallery-9", "Ruchi Realty community lifestyle", "Lifestyle", "Project & Lifestyle"],
  ["1-300x225.jpeg", "project-gallery-1", "Ruchi Realty project architecture", "Projects", "Project & Lifestyle"],
  ...Array.from({ length: 12 }, (_, index) => [`G${index + 1}.${index === 11 ? "png" : "webp"}`, `gallery-${index + 1}`, `Ruchi Realty gallery moment ${index + 1}`, index < 3 ? "Events" : "Projects", "Legacy Gallery"]),
  ["A1.webp", "award-recognition-1", "Ruchi Realty award and recognition", "Awards", "Awards & Recognition"],
  ["A2.webp", "award-recognition-2", "Ruchi Realty recognition ceremony", "Awards", "Awards & Recognition"],
  ["landline.png", "press-release-placeholder", "Ruchi Realty press releases", "Other", "Press Releases"],
];

const sourceUrl = (file) => {
  const folder = /300x(169)/.test(file) || /^G|^A/.test(file) ? "2026/04" : file === "landline.png" || /300x300/.test(file) ? "2023/08" : "2023/11";
  const original = file.replace(/-300x(?:169|225|300)(?=\.)/, "");
  return `https://ruchirealty.com/wp-content/uploads/${folder}/${original}`;
};
const encode = async (pipeline, limit = 200 * 1024) => {
  for (const quality of [82, 76, 70, 64, 58, 52]) {
    const buffer = await pipeline.clone().webp({ quality, effort: 6 }).toBuffer();
    if (buffer.length <= limit || quality === 52) return { buffer, quality };
  }
};
const seen = new Map(); const manifest = [];
for (const [file, slug, alt, category, album] of definitions) {
  const input = path.join(sourceDir, file); const original = fs.readFileSync(input); const originalHash = crypto.createHash("sha256").update(original).digest("hex");
  if (seen.has(originalHash)) { manifest.push({ ...seen.get(originalHash), original_url: sourceUrl(file), original_filename: file, reused_existing: true, slug, alt_text: alt, category, album }); continue; }
  const metadata = await sharp(original).metadata();
  const display = await encode(sharp(original).rotate().resize({ width: 1800, height: 1400, fit: "inside", withoutEnlargement: true }));
  const thumb = await encode(sharp(original).rotate().resize({ width: 560, height: 420, fit: "cover", position: "attention", withoutEnlargement: false }), 90 * 1024);
  const displayPath = `${outputDir}/${slug}.webp`; const thumbPath = `${thumbDir}/${slug}.webp`;
  fs.writeFileSync(displayPath, display.buffer); fs.writeFileSync(thumbPath, thumb.buffer);
  const record = { original_url: sourceUrl(file), original_filename: file, local_path: displayPath, public_url: `/${displayPath.replace(/^public\//, "")}`, thumbnail_url: `/${thumbPath.replace(/^public\//, "")}`, mime_type: "image/webp", file_size: display.buffer.length, thumbnail_file_size: thumb.buffer.length, width: metadata.width, height: metadata.height, hash: originalHash, usage_type: file === "landline.png" ? "press_placeholder" : category === "Awards" ? "event_award" : "gallery", slug, title: alt, caption: alt, alt_text: alt, category, album, status: "published", reused_existing: false };
  seen.set(originalHash, record); manifest.push(record);
}
fs.writeFileSync(`${outputDir}/media-assets-manifest.json`, `${JSON.stringify(manifest, null, 2)}\n`);
console.log(`Migrated ${manifest.length} records; ${seen.size} unique images.`);
console.log(`Largest display: ${Math.max(...manifest.map((item) => item.file_size))} bytes.`);
