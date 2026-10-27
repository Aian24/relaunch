import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const testVoices = [
  { name: 'Adam', id: 'pNInz6obpgDQGcFmaJgB' },
  { name: 'George', id: 'JBFqnCBsd6RMkjVDRZzb' },
  { name: 'Sam', id: 'yoZ06aMxZJJ28mfd3POQ' },
  { name: 'Antoni', id: 'ErXwobaYiN019PkySvjV' },
  { name: 'Arnold', id: 'VR6AewLTigWG4xSOukaG' },
  { name: 'Bella', id: 'EXAVITQu4vr4xnSDxMaL' },
  { name: 'Josh', id: 'TxGEqnHWrfWFTfGW9XjX' },
];

async function checkVoices() {
  const elevenKey = process.env.ELEVENLABS_API_KEY;
  console.log('Testing ElevenLabs Voices with Key:', elevenKey?.slice(0, 8) + '...');

  for (const v of testVoices) {
    try {
      const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${v.id}/with-timestamps`, {
        method: 'POST',
        headers: {
          'xi-api-key': elevenKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: 'Hello, welcome to ReLaunch Studio.',
          model_id: 'eleven_turbo_v2_5',
        }),
      });

      console.log(`Voice ${v.name} (${v.id}): HTTP ${res.status}`);
      if (res.ok) {
        const data = await res.json();
        console.log(`✅ SUCCESS! Voice ${v.name} worked! Received audio and ${data.alignment?.characters?.length} aligned characters.`);
        break;
      } else {
        const errText = await res.text();
        console.log(`   └─ Error: ${errText.slice(0, 120)}...`);
      }
    } catch (e: any) {
      console.log(`Voice ${v.name} error:`, e.message);
    }
  }
}

checkVoices().catch(console.error);
