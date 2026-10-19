const fs = require('fs');

const filePath = 'C:/Users/Administrator/.gemini/antigravity-ide/brain/9ff9aa69-12dc-43dc-bd6e-6e8d87c68515/.system_generated/steps/295/content.md';
const html = fs.readFileSync(filePath, 'utf8');

// Match tags in sequence
const tagRegex = /<(h[1-6]|p|blockquote|img|video|source)[^>]*>([\s\S]*?)<\/\1>|<(img|video|source)[^>]*\/?>/gi;

const tokens = [];
let m;
while ((m = tagRegex.exec(html)) !== null) {
  const full = m[0];
  const tagName = (m[1] || m[3]).toLowerCase();
  if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'blockquote'].includes(tagName)) {
    const text = full.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    if (text.length > 2 && !text.includes('function(') && !text.includes('var ')) {
      tokens.push({ tag: tagName, text });
    }
  } else if (tagName === 'img') {
    const src = (full.match(/src=["']([^"']+)["']/) || [])[1];
    const alt = (full.match(/alt=["']([^"']*)["']/) || [])[1] || '';
    if (src && !src.includes('gravatar') && !src.includes('w.org') && !src.includes('youtube.png')) {
      tokens.push({ tag: 'img', src, alt });
    }
  } else if (tagName === 'video' || tagName === 'source') {
    const src = (full.match(/src=["']([^"']+)["']/) || [])[1];
    if (src && src.endsWith('.mp4')) {
      tokens.push({ tag: 'video', src });
    }
  }
}

// deduplicate consecutive tokens if needed
console.log('Total tokens:', tokens.length);
tokens.forEach((t, i) => {
  if (t.tag === 'img') {
    console.log(`[${i}] IMG: ${t.src} (alt: "${t.alt}")`);
  } else if (t.tag === 'video') {
    console.log(`[${i}] VIDEO: ${t.src}`);
  } else {
    console.log(`[${i}] ${t.tag.toUpperCase()}: ${t.text}`);
  }
});
