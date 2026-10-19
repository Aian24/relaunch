const fs = require('fs');

const filePath = 'C:/Users/Administrator/.gemini/antigravity-ide/brain/9ff9aa69-12dc-43dc-bd6e-6e8d87c68515/.system_generated/steps/295/content.md';
const html = fs.readFileSync(filePath, 'utf8');

// Find all asset urls
const assetRegex = /https?:\/\/[^\s"'<>]+\.(?:png|jpg|jpeg|webp|gif|mp4|webm|svg)/gi;
const assets = Array.from(new Set(html.match(assetRegex) || []));

console.log('=== ASSET URLS (' + assets.length + ') ===');
assets.forEach(a => {
  if (!a.includes('gravatar') && !a.includes('yoast') && !a.includes('w.org')) {
    console.log(a);
  }
});

// Find headings and paragraphs
const headingRegex = /<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi;
let m;
console.log('\n=== HEADINGS ===');
while ((m = headingRegex.exec(html)) !== null) {
  const t = m[1].replace(/<[^>]+>/g, '').trim();
  if (t) console.log(t);
}

// Find all paragraph and text tags
const pTags = html.match(/<(?:p|blockquote)[^>]*>[\s\S]*?<\/(?:p|blockquote)>/gi) || [];
console.log('\n=== PARAGRAPHS (' + pTags.length + ') ===');
pTags.forEach(p => {
  const clean = p.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length > 25) console.log('\n>> ' + clean);
});


