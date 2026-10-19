const https = require('https');
const fs = require('fs');
const path = require('path');

const showcaseDir = path.join(__dirname, '..', 'public', 'showcase');
const videosDir = path.join(__dirname, '..', 'public', 'videos');

const itemsToDownload = [
  // Images
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/CD42_LOGO_SPLATTER.png',
    dest: path.join(showcaseDir, 'chicago_dog_splatter_color.png')
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/black-1.png',
    dest: path.join(showcaseDir, 'chicago_dog_badge_black.png')
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/White-1.png',
    dest: path.join(showcaseDir, 'chicago_dog_badge_white.png')
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/Untitled-1300-x-1600-px-21.png',
    dest: path.join(showcaseDir, 'chicago_dog_asset_21.png')
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/Untitled-1300-x-1600-px-22.png',
    dest: path.join(showcaseDir, 'chicago_dog_asset_22.png')
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/Untitled-design-5.png',
    dest: path.join(showcaseDir, 'chicago_dog_design_5.png')
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/Mother-Truckin-1.png',
    dest: path.join(showcaseDir, 'chicago_dog_mother_truckin.png')
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2023/12/aa8.png',
    dest: path.join(showcaseDir, 'chicago_dog_bg_aa8.png')
  },
  // Videos
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/09221.mp4',
    dest: path.join(videosDir, 'chicago-dog-social-1.mp4')
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/1002-23.mp4',
    dest: path.join(videosDir, 'chicago-dog-social-2.mp4')
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/0927.mp4',
    dest: path.join(videosDir, 'chicago-dog-social-3.mp4')
  },
  {
    url: 'https://www.relaunch.us/wp-content/uploads/2024/01/Snapinsta.app_video_GICWmAAMWILJh4cAAF5zAzf6SkRbbvVBAAAF.mp4',
    dest: path.join(videosDir, 'chicago-dog-insta.mp4')
  }
];

function downloadFile(item) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(item.dest)) {
      const stats = fs.statSync(item.dest);
      if (stats.size > 1000) {
        console.log(`Already exists: ${path.basename(item.dest)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        return resolve(item.dest);
      }
    }
    console.log(`Downloading ${item.url} -> ${path.basename(item.dest)}...`);
    const file = fs.createWriteStream(item.dest);
    https.get(item.url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`HTTP ${res.statusCode} for ${item.url}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        const stats = fs.statSync(item.dest);
        console.log(`Saved ${path.basename(item.dest)} (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
        resolve(item.dest);
      });
    }).on('error', (err) => {
      fs.unlink(item.dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const item of itemsToDownload) {
    try {
      await downloadFile(item);
    } catch (err) {
      console.error(`Error downloading ${item.url}:`, err.message);
    }
  }
  console.log('All downloads completed!');
}

run();
