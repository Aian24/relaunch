const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = 'public/showcase';

const downloads = [
  { url: 'https://turflifeclub.com/wp-content/uploads/2024/06/Protect-Your-Turf-Photo-banner.webp', name: 'turflife_protect_banner.webp' },
  { url: 'https://turflifeclub.com/wp-content/uploads/2024/07/Baseball-Kid-Turflife.png', name: 'turflife_baseball_kid.png' },
  { url: 'https://turflifeclub.com/wp-content/uploads/2024/07/Golf-Central-Mag-1584-x-1584-px.png', name: 'turflife_golf_central.png' },
  { url: 'https://turflifeclub.com/wp-content/uploads/2024/07/HOODIE.png', name: 'turflife_hoodie.png' }
];

function dl(item) {
  return new Promise((resolve) => {
    const dest = path.join(targetDir, item.name);
    const file = fs.createWriteStream(dest);
    https.get(item.url, (res) => {
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Saved:', item.name);
        resolve();
      });
    }).on('error', () => resolve());
  });
}

async function run() {
  for (const d of downloads) await dl(d);
}

run();
