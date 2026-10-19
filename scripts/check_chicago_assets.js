const https = require('https');
const fs = require('fs');
const path = require('path');

const urls = [
  'https://www.relaunch.us/wp-content/uploads/2023/12/aa3.png',
  'https://www.relaunch.us/wp-content/uploads/2023/12/aa8.png',
  'https://www.relaunch.us/wp-content/uploads/2024/01/Ralston-22x28-Graphics.png',
  'https://www.relaunch.us/wp-content/uploads/2024/01/Ralston-22x28-Graphics-1.png',
  'https://www.relaunch.us/wp-content/uploads/2024/01/Ralston-22x28-Graphics-2.png',
  'https://www.relaunch.us/wp-content/uploads/2024/01/Ralston-22x28-Graphics-3.png',
  'https://www.relaunch.us/wp-content/uploads/2024/01/Untitled-1300-x-1600-px-1300-x-1600-px-5.png',
  'https://www.relaunch.us/wp-content/uploads/2024/01/Untitled-1300-x-1600-px-1300-x-1600-px-21.png',
  'https://www.relaunch.us/wp-content/uploads/2024/01/Untitled-1300-x-1600-px-1300-x-1600-px-22.png',
  'https://www.relaunch.us/wp-content/uploads/2024/01/CD42_LOGO_SPLATTER.png',
  'https://www.relaunch.us/wp-content/uploads/2024/01/CD42_LOGO_SPLATTER_BLACK-1.png',
  'https://www.relaunch.us/wp-content/uploads/2024/01/09221.mp4',
  'https://www.relaunch.us/wp-content/uploads/2024/01/1002-23.mp4',
  'https://www.relaunch.us/wp-content/uploads/2024/01/0927.mp4',
  'https://www.relaunch.us/wp-content/uploads/2024/01/Snapinsta.app_video_GICWmAAMWILJh4cAAF5zAzf6SkRbbvVBAAAF.mp4'
];

async function checkUrl(url) {
  return new Promise((resolve) => {
    https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      resolve({
        url,
        status: res.statusCode,
        size: res.headers['content-length'] ? (parseInt(res.headers['content-length']) / 1024).toFixed(1) + ' KB' : 'unknown',
        type: res.headers['content-type']
      });
    }).on('error', (e) => resolve({ url, error: e.message })).end();
  });
}

async function run() {
  console.log('Checking asset headers...');
  for (const u of urls) {
    const info = await checkUrl(u);
    console.log(`${path.basename(u)} -> status: ${info.status}, size: ${info.size}, type: ${info.type}`);
  }
}

run();
