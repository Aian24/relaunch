const https = require('https');
const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'public', 'showcase');

const imagesToDownload = [
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2023/12/aa3.png',
    filename: 'chicago_dog_website_hero.png'
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/Ralston-22x28-Graphics.png',
    filename: 'chicago_dog_menu_poster_1.png'
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/Ralston-22x28-Graphics-1.png',
    filename: 'chicago_dog_menu_poster_2.png'
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/Ralston-22x28-Graphics-2.png',
    filename: 'chicago_dog_menu_poster_3.png'
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/Ralston-22x28-Graphics-3.png',
    filename: 'chicago_dog_menu_poster_4.png'
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/CD42_LOGO_SPLATTER_BLACK-1.png',
    filename: 'chicago_dog_splatter_logo.png'
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/Untitled-1300-x-1600-px-1300-x-1600-px-5.png',
    filename: 'chicago_dog_social_post.png'
  }
];

function download(item) {
  return new Promise((resolve, reject) => {
    const dest = path.join(targetDir, item.filename);
    console.log(`Downloading ${item.url} -> ${item.filename}...`);
    const file = fs.createWriteStream(dest);
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${item.url}: status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(dest);
        console.log(`Saved ${item.filename} (${(stats.size / 1024).toFixed(1)} KB)`);
        resolve(dest);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of imagesToDownload) {
    try {
      await download(item);
    } catch (e) {
      console.error(e.message);
    }
  }
  console.log('All downloads complete!');
}

run();
