const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const FFMPEG = path.resolve('relaunch-studio-engine/render-worker/node_modules/@remotion/compositor-win32-x64-msvc/ffmpeg.exe');
const FFPROBE = path.resolve('relaunch-studio-engine/render-worker/node_modules/@remotion/compositor-win32-x64-msvc/ffprobe.exe');

const INPUT_DIR = path.resolve('public/videos/Haley UGC');
const HOOKS_OUT = path.resolve('public/creators/haley/hooks');
const BROLL_OUT = path.resolve('public/creators/haley/broll');

fs.mkdirSync(HOOKS_OUT, { recursive: true });
fs.mkdirSync(BROLL_OUT, { recursive: true });

const filesToTranscode = [
  { src: 'Line 1.mov', dest: path.join(HOOKS_OUT, 'haley-hook-01.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-01.jpg'), type: 'hook', num: 1 },
  { src: 'Line 2.mov', dest: path.join(HOOKS_OUT, 'haley-hook-02.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-02.jpg'), type: 'hook', num: 2 },
  { src: 'Line 3.mov', dest: path.join(HOOKS_OUT, 'haley-hook-03.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-03.jpg'), type: 'hook', num: 3 },
  { src: 'Line 4.mov', dest: path.join(HOOKS_OUT, 'haley-hook-04.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-04.jpg'), type: 'hook', num: 4 },
  { src: 'Line 5.mov', dest: path.join(HOOKS_OUT, 'haley-hook-05.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-05.jpg'), type: 'hook', num: 5 },
  { src: 'Line 6.mov', dest: path.join(HOOKS_OUT, 'haley-hook-06.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-06.jpg'), type: 'hook', num: 6 },
  { src: 'Line 7.mov', dest: path.join(HOOKS_OUT, 'haley-hook-07.mp4'), thumb: path.join(HOOKS_OUT, 'haley-hook-07.jpg'), type: 'hook', num: 7 },
  { src: 'Broll.mov', dest: path.join(BROLL_OUT, 'haley-broll-01.mp4'), thumb: path.join(BROLL_OUT, 'haley-broll-01.jpg'), type: 'broll', num: 1 },
  { src: 'Broll-extra.mov', dest: path.join(BROLL_OUT, 'haley-broll-02.mp4'), thumb: path.join(BROLL_OUT, 'haley-broll-02.jpg'), type: 'broll', num: 2 },
  { src: 'Broll-extra2.mov', dest: path.join(BROLL_OUT, 'haley-broll-03.mp4'), thumb: path.join(BROLL_OUT, 'haley-broll-03.jpg'), type: 'broll', num: 3 },
  { src: 'Broll-extra3.mov', dest: path.join(BROLL_OUT, 'haley-broll-04.mp4'), thumb: path.join(BROLL_OUT, 'haley-broll-04.jpg'), type: 'broll', num: 4 },
];

console.log(`Starting transcoding of ${filesToTranscode.length} UGC clips with FFmpeg: ${FFMPEG}`);

for (const item of filesToTranscode) {
  const inputPath = path.join(INPUT_DIR, item.src);
  if (!fs.existsSync(inputPath)) {
    console.error(`Input file not found: ${inputPath}`);
    continue;
  }

  // Probe media
  const probeCmd = `"${FFPROBE}" -v error -show_entries stream=codec_type,duration,width,height -of json "${inputPath}"`;
  const probeResult = JSON.parse(execSync(probeCmd).toString());
  const hasAudio = probeResult.streams.some(s => s.codec_type === 'audio');
  const vStream = probeResult.streams.find(s => s.codec_type === 'video');

  console.log(`\nProcessing ${item.src} -> ${path.basename(item.dest)}`);
  console.log(`  Source: ${vStream ? `${vStream.width}x${vStream.height}` : 'unknown'}, hasAudio: ${hasAudio}`);

  // Transcode to 1080x1920 30fps H.264 MP4 with faststart
  const audioArgs = hasAudio ? '-c:a aac -b:a 192k -ar 48000 -ac 2' : '-an';
  const transcodeCmd = `"${FFMPEG}" -y -i "${inputPath}" -vf "scale=1080:1920" -pix_fmt yuv420p -c:v libx264 -preset fast -crf 20 -r 30 ${audioArgs} -movflags +faststart "${item.dest}"`;
  
  execSync(transcodeCmd, { stdio: 'inherit' });

  // Thumbnail extraction (at 1.5s or 0.5s if shorter)
  const thumbCmd = `"${FFMPEG}" -y -ss 00:00:01.500 -i "${item.dest}" -vframes 1 -q:v 2 "${item.thumb}"`;
  try {
    execSync(thumbCmd, { stdio: 'ignore' });
  } catch (err) {
    // Fallback to start
    execSync(`"${FFMPEG}" -y -ss 00:00:00.200 -i "${item.dest}" -vframes 1 -q:v 2 "${item.thumb}"`, { stdio: 'ignore' });
  }

  const outStats = fs.statSync(item.dest);
  console.log(`  Done: ${(outStats.size / 1024 / 1024).toFixed(2)} MB`);
}

console.log('\nAll clips transcoded and normalized successfully!');
