const fs = require('fs');

const filePath = 'C:/Users/Administrator/.gemini/antigravity-ide/brain/9ff9aa69-12dc-43dc-bd6e-6e8d87c68515/.system_generated/steps/295/content.md';
const html = fs.readFileSync(filePath, 'utf8');

// Find all uploads
const matches = html.match(/https?:\/\/[^\s"'<>]+\/wp-content\/uploads\/[^\s"'<>]+\.(png|jpg|jpeg|webp|gif|mp4|webm|svg)/gi) || [];
const unique = Array.from(new Set(matches));

console.log('Unique uploads found (' + unique.length + '):');
unique.sort().forEach(u => console.log(u));
