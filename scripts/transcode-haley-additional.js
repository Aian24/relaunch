const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FFMPEG = path.resolve('relaunch-studio-engine/render-worker/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const FFPROBE = path.resolve('relaunch-studio-engine/render-worker/node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');

const INPUT_DIR = path.resolve('public/videos/Haley UGC/Haley Additional Footage');
const HOOKS_OUT = path.resolve('public/creators/haley/hooks');
const BROLL_OUT = path.resolve('public/creators/haley/broll');

fs.mkdirSync(HOOKS_OUT, { recursive: true });
fs.mkdirSync(BROLL_OUT, { recursive: true });

const filesToTranscode = [
  { src: 'Video 1.mov', dest: path.join(HOOKS_OUT, 'haley-hook-08.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-08.jpg'), type: 'hook', num: 8 },
  { src: 'Video 2.mov', dest: path.join(HOOKS_OUT, 'haley-hook-09.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-09.jpg'), type: 'hook', num: 9 },
  { src: 'Video 3.mov', dest: path.join(HOOKS_OUT, 'haley-hook-10.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-10.jpg'), type: 'hook', num: 10 },
  { src: 'Video 4.mov', dest: path.join(HOOKS_OUT, 'haley-hook-11.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-11.jpg'), type: 'hook', num: 11 },
  { src: 'Video 5.mov', dest: path.join(HOOKS_OUT, 'haley-hook-12.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-12.jpg'), type: 'hook', num: 12 },
  { src: 'Video 6.mov', dest: path.join(HOOKS_OUT, 'haley-hook-13.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-13.jpg'), type: 'hook', num: 13 },
  { src: 'Video 7.mov', dest: path.join(HOOKS_OUT, 'haley-hook-14.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-14.jpg'), type: 'hook', num: 14 },
  { src: 'Broll.mov', dest: path.join(BROLL_OUT, 'haley-broll-05.mp4'), thumb: path.join(BROLL_OUT, 'haley-broll-05.jpg'), type: 'broll', num: 5 },
  { src: 'Broll2.mov', dest: path.join(BROLL_OUT, 'haley-broll-06.mp4'), thumb: path.join(BROLL_OUT, 'haley-broll-06.jpg'), type: 'broll', num: 6 },
];

console.log(`Starting transcoding of ${filesToTranscode.length} additional Haley clips...`);

for (const item of filesToTranscode) {
  const inputPath = path.join(INPUT_DIR, item.src);
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    continue;
  }

  console.log(`\nProcessing ${item.src} -> ${path.basename(item.dest)}`);

  // Probe duration
  const probeCmd = `"${FFPROBE}" -v error -show_entries format=duration:stream=codec_type -of json "${inputPath}"`;
  const probeResult = JSON.parse(execSync(probeCmd).toString());
  const hasAudio = probeResult.streams.some(s => s.codec_type === 'audio');
  const dur = probeResult.format ? parseFloat(probeResult.format.duration) : 10;

  // Transcode to web-standard 1080x1920 30fps H.264/AAC MP4 with faststart
  const audioArgs = hasAudio ? '-c:a aac -b:a 192k -ar 48000 -ac 2' : '-an';
  const transcodeCmd = `"${FFMPEG}" -y -i "${inputPath}" -vf "scale=1080:1920" -pix_fmt yuv420p -c:v libx264 -preset fast -crf 20 -r 30 ${audioArgs} -movflags +faststart "${item.dest}"`;
  
  execSync(transcodeCmd, { stdio: 'ignore' });

  // Thumbnail extraction
  const thumbOffset = Math.min(1.5, Math.max(0.5, dur / 3)).toFixed(2);
  const thumbCmd = `"${FFMPEG}" -y -ss ${thumbOffset} -i "${item.dest}" -vframes 1 -q:v 2 "${item.thumb}"`;
  try {
    execSync(thumbCmd, { stdio: 'ignore' });
  } catch (err) {
    execSync(`"${FFMPEG}" -y -ss 00:00:00.200 -i "${item.dest}" -vframes 1 -q:v 2 "${item.thumb}"`, { stdio: 'ignore' });
  }

  const outStats = fs.statSync(item.dest);
  console.log(`  ✓ Transcoded: ${(outStats.size / 1024 / 1024).toFixed(2)} MB (${dur.toFixed(1)}s)`);
}

console.log('\nAll 9 additional Haley clips transcoded successfully!');

