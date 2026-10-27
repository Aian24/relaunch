import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { S3Client, PutObjectCommand, GetObjectCommand, HeadBucketCommand } from '@aws-sdk/client-s3';

async function diagnose() {
  console.log('--- Diagnosing ElevenLabs Voices ---');
  const elevenKey = process.env.ELEVENLABS_API_KEY;
  try {
    const res = await fetch('https://api.elevenlabs.io/v1/voices', {
      headers: { 'xi-api-key': elevenKey! },
    });
    console.log('ElevenLabs /v1/voices status:', res.status);
    if (res.ok) {
      const data = await res.json();
      console.log(`Available voices (${data.voices?.length}):`);
      for (const v of (data.voices || []).slice(0, 10)) {
        console.log(`- ${v.name} (ID: ${v.voice_id}, category: ${v.category})`);
      }
    } else {
      console.log('Voices error:', await res.text());
    }
  } catch (e: any) {
    console.error('ElevenLabs fetch error:', e.message);
  }

  console.log('\n--- Diagnosing Cloudflare R2 Buckets ---');
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;
  const s3Client = new S3Client({
    endpoint,
    region: 'auto',
    credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
    forcePathStyle: true,
  });

  const candidateBuckets = [
    'relaunch-raw-assets',
    'relaunch-rendered-variants',
    'relaunch-thumbnails',
    'relaunch',
    'relaunch-studio',
    'studio',
    'assets',
    'video',
    'videos',
  ];

  for (const b of candidateBuckets) {
    try {
      // Test PutObject with a tiny test text file
      await s3Client.send(new PutObjectCommand({
        Bucket: b,
        Key: 'health-check.txt',
        Body: 'ok',
      }));
      console.log(`✅ Success writing to bucket: "${b}"`);
      break;
    } catch (e: any) {
      console.log(`Bucket "${b}": ${e.name} - ${e.message}`);
    }
  }
}

diagnose().catch(console.error);
