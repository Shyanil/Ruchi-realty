import fs from "node:fs";
import crypto from "node:crypto";
import sharp from "sharp";
import { BLOG } from "../src/data/siteData.js";
const records = []; const hashes = new Set();
for (const blog of BLOG) {
  const filename = blog.img.split("/").pop(); const path = `public/assets/blogs/${filename}`; const bytes = fs.readFileSync(path); const metadata = await sharp(bytes).metadata(); const hash = crypto.createHash("sha256").update(bytes).digest("hex"); const reused = hashes.has(hash); hashes.add(hash);
  records.push({ original_url: blog.originalImage, original_filename: new URL(blog.originalImage).pathname.split("/").pop(), local_path: path, final_public_url: `/assets/blogs/${filename}`, image_alt: blog.imageAlt || blog.title, width: metadata.width, height: metadata.height, file_size: bytes.length, content_sha256: hash, used_in_blog_slug: blog.slug, usage_type: "featured", downloaded: true, reused_existing: reused });
}
console.log(JSON.stringify(records, null, 2));
