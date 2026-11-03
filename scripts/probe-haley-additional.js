const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FFPROBE = path.resolve('relaunch-studio-engine/render-worker/node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');
const ADD_DIR = path.resolve('public/videos/Haley UGC/Haley Additional Footage');

const files = fs.readdirSync(ADD_DIR).filter(f => f.endsWith('.mov') || f.endsWith('.mp4'));

console.log(`Found ${files.length} files in Haley Additional Footage:\n`);

for (const file of files) {
  const fullPath = path.join(ADD_DIR, file);
  const probeCmd = `"${FFPROBE}" -v error -show_entries format=duration:stream=codec_name,codec_type,width,height -of json "${fullPath}"`;
  try {
    const info = JSON.parse(execSync(probeCmd).toString());
    const v = info.streams.find(s => s.codec_type === 'video');
    const a = info.streams.find(s => s.codec_type === 'audio');
    const dur = info.format ? parseFloat(info.format.duration).toFixed(2) : 'unknown';
    console.log(`${file}:`);
    console.log(`  Duration: ${dur}s`);
    console.log(`  Video: ${v ? `${v.width}x${v.height} (${v.codec_name})` : 'none'}`);
    console.log(`  Audio: ${a ? a.codec_name : 'none'}\n`);
  } catch (err) {
    console.error(`Error probing ${file}:`, err.message);
  }
}

