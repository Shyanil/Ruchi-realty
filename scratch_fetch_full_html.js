import fs from 'fs';

async function run() {
  const url = 'https://ruchirealty.com/active-greens/';
  const res = await fetch(url);
  const html = await res.text();
  
  // Save raw HTML
  fs.writeFileSync('./scratch_raw_html.html', html, 'utf-8');
  console.log(`Saved ${html.length} bytes of raw HTML.`);
  
  // Find all image references
  const regex = /(href|src)=["']([^"'\s>]+?\.(jpg|jpeg|png|webp|gif|pdf))["']/gi;
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(match[2]);
  }
  const unique = Array.from(new Set(matches));
  
  fs.writeFileSync('./scratch_found_images.txt', unique.join('\n'), 'utf-8');
  console.log(`Found ${unique.length} unique assets in raw HTML.`);
}

run().catch(console.error);
