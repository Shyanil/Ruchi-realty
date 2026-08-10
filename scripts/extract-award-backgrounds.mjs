import { resolve } from "node:path";
import sharp from "sharp";

const assetDirectory = resolve("public", "assets", "media");
const awardFiles = [
  "award-mega-property-expo-2025.webp",
  "award-ultra-high-luxury-developer.webp",
  "award-luxury-project-golden-brick-2025.webp",
  "award-company-of-the-year.webp",
  "award-times-property-show.webp",
  "award-credai-property-show.webp",
  "award-hdfc-property-fair.webp",
  "award-malwa-vyapar.webp",
  "award-vishesh-atithi.webp",
  "award-real-estate-fair-2025.webp",
  "award-prestigious-property-exhibition.webp",
  "award-property-auto-expo.webp",
];

const colorDistance = (pixels, offset, key) => Math.sqrt(
  (pixels[offset] - key[0]) ** 2
  + (pixels[offset + 1] - key[1]) ** 2
  + (pixels[offset + 2] - key[2]) ** 2,
);

function estimateCornerColor(pixels, width, height) {
  const samples = [];
  const patch = Math.max(2, Math.min(5, Math.floor(Math.min(width, height) / 20)));
  const origins = [[0, 0], [width - patch, 0], [0, height - patch], [width - patch, height - patch]];
  for (const [startX, startY] of origins) {
    for (let y = startY; y < startY + patch; y += 1) {
      for (let x = startX; x < startX + patch; x += 1) {
        const offset = (y * width + x) * 4;
        samples.push([pixels[offset], pixels[offset + 1], pixels[offset + 2]]);
      }
    }
  }
  return [0, 1, 2].map((channel) => Math.round(samples.reduce((sum, sample) => sum + sample[channel], 0) / samples.length));
}

function removeConnectedBackground(pixels, width, height, key) {
  const count = width * height;
  const exterior = new Uint8Array(count);
  const queued = new Uint8Array(count);
  const queue = [];
  const threshold = 42;
  const enqueue = (index) => {
    if (queued[index]) return;
    const offset = index * 4;
    if (colorDistance(pixels, offset, key) > threshold) return;
    queued[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor];
    exterior[index] = 1;
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) enqueue(index - 1);
    if (x + 1 < width) enqueue(index + 1);
    if (y > 0) enqueue(index - width);
    if (y + 1 < height) enqueue(index + width);
  }

  let transparentPixels = 0;
  for (let index = 0; index < count; index += 1) {
    if (!exterior[index]) continue;
    const offset = index * 4;
    const distance = colorDistance(pixels, offset, key);
    const alpha = Math.max(0, Math.min(255, Math.round(((distance - 7) / 35) * 255)));
    pixels[offset + 3] = alpha;
    if (alpha < 16) transparentPixels += 1;
  }
  return transparentPixels;
}

function removeConnectedLightBorder(pixels, width, height) {
  const count = width * height;
  const exterior = new Uint8Array(count);
  const queue = [];
  const isLightBackground = (index) => {
    const offset = index * 4;
    const red = pixels[offset];
    const green = pixels[offset + 1];
    const blue = pixels[offset + 2];
    return Math.min(red, green, blue) >= 218 && Math.max(red, green, blue) - Math.min(red, green, blue) <= 24;
  };
  const enqueue = (index) => {
    if (exterior[index] || !isLightBackground(index)) return;
    exterior[index] = 1;
    queue.push(index);
  };

  for (let x = 0; x < width; x += 1) {
    enqueue(x);
    enqueue((height - 1) * width + x);
  }
  for (let y = 0; y < height; y += 1) {
    enqueue(y * width);
    enqueue(y * width + width - 1);
  }

  for (let cursor = 0; cursor < queue.length; cursor += 1) {
    const index = queue[cursor];
    const x = index % width;
    const y = Math.floor(index / width);
    if (x > 0) enqueue(index - 1);
    if (x + 1 < width) enqueue(index + 1);
    if (y > 0) enqueue(index - width);
    if (y + 1 < height) enqueue(index + width);
  }

  let transparentPixels = 0;
  for (let index = 0; index < count; index += 1) {
    if (!exterior[index]) continue;
    const offset = index * 4;
    const lightness = Math.min(pixels[offset], pixels[offset + 1], pixels[offset + 2]);
    pixels[offset + 3] = Math.max(0, Math.min(255, Math.round(((245 - lightness) / 27) * 255)));
    if (pixels[offset + 3] < 16) transparentPixels += 1;
  }
  return transparentPixels;
}

for (const fileName of awardFiles) {
  const inputPath = resolve(assetDirectory, fileName);
  const outputPath = resolve(assetDirectory, fileName.replace(/\.webp$/i, "-transparent.webp"));
  const { data, info } = await sharp(inputPath).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const key = estimateCornerColor(data, info.width, info.height);
  const isLightUniformBackground = Math.min(...key) >= 225 && Math.max(...key) - Math.min(...key) <= 18;
  const transparentPixels = isLightUniformBackground
    ? removeConnectedBackground(data, info.width, info.height, key)
    : removeConnectedLightBorder(data, info.width, info.height);

  await sharp(data, { raw: info })
    .webp({ quality: 92, alphaQuality: 100, effort: 6, smartSubsample: true })
    .toFile(outputPath);

  console.log(`${fileName}: key rgb(${key.join(",")}), transparent pixels ${transparentPixels}`);
}
