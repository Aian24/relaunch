import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

async function findR2Bucket() {
  const endpoint = process.env.S3_ENDPOINT;
  const accessKeyId = process.env.S3_ACCESS_KEY_ID;
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY;

  const s3Client = new S3Client({
    endpoint,
    region: 'auto',
    credentials: { accessKeyId: accessKeyId!, secretAccessKey: secretAccessKey! },
    forcePathStyle: true,
  });

  const candidates = [
    'relaunch',
    'relaunch-us',
    'relaunchus',
    'relaunch-assets',
    'relaunch-media',
    'relaunch-video',
    'relaunch-videos',
    'relaunch-ads',
    'relaunch-raw',
    'relaunch-variants',
    'relaunch-pilot',
    'relaunch-bucket',
    'relaunch-r2',
    'studio-assets',
    'studio-raw',
    'studio-variants',
    'production',
    'media',
    'videos',
    'ads',
    'client-assets',
    'relaunch-client-assets',
  ];

  for (const name of candidates) {
    try {
      await s3Client.send(new PutObjectCommand({
        Bucket: name,
        Key: 'test-check.txt',
        Body: 'ok',
      }));
      console.log(`🎉 FOUND VALID BUCKET: "${name}"`);
      return name;
    } catch (e: any) {
      if (e.name !== 'AccessDenied' && e.name !== 'NoSuchBucket') {
        console.log(`Bucket "${name}": ${e.name} - ${e.message}`);
      }
    }
  }
  console.log('No pre-existing bucket matched the common names list.');
}

findR2Bucket().catch(console.error);
