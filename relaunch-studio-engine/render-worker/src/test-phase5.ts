import { videoRouter, generateScene, generateActor, generateAudio } from './router.ts';

/**
 * ReLaunch Studio — Phase 5 Verification Test Suite
 * Validates the Unified Model-Agnostic Video Router, Grok, Veo, Seedance, Arcads, and ElevenLabs.
 */

async function runPhase5Tests() {
  console.log('==========================================================');
  console.log('🚀 STARTING PHASE 5 VIDEO ROUTER & ASSET APIs TEST SUITE');
  console.log('==========================================================\n');

  let passedTests = 0;
  const totalTests = 6;

  // Test 1: Grok Imagine 1.5 (High-volume b-roll)
  console.log('▶ [Test 1/6] Testing Grok Imagine 1.5 Provider...');
  const grokScene = await generateScene({
    prompt: 'Crisp close up of gourmet Chicago style hot dog on steamed poppy seed bun, vibrant relish, sport peppers, cinematic warm street food lighting',
    model: 'grok-1.5',
    aspectRatio: '9:16',
    durationSeconds: 4,
  });

  if (grokScene && grokScene.url && grokScene.durationSeconds === 4) {
    console.log(`  ✓ Grok Scene generated successfully.`);
    console.log(`  ✓ Model: ${grokScene.modelUsed} | Provider: ${grokScene.provider}`);
    console.log(`  ✓ URL: ${grokScene.url}`);
    passedTests++;
  } else {
    console.error('  ✕ Grok Scene generation failed:', grokScene);
  }

  // Test 2: Google Veo 3.1 (Cinematic Hero Shot)
  console.log('\n▶ [Test 2/6] Testing Google Veo 3.1 Provider...');
  const veoScene = await generateScene({
    prompt: 'Cinematic slow-motion shot of happy customer biting into hot dog, delicious reaction, 4k photorealistic, shallow depth of field',
    model: 'veo-3.1',
    aspectRatio: '9:16',
    durationSeconds: 5,
  });

  if (veoScene && veoScene.url && veoScene.modelUsed === 'veo-3.1') {
    console.log(`  ✓ Veo Hero Scene generated successfully.`);
    console.log(`  ✓ Model: ${veoScene.modelUsed} | Provider: ${veoScene.provider}`);
    console.log(`  ✓ URL: ${veoScene.url}`);
    passedTests++;
  } else {
    console.error('  ✕ Veo Scene generation failed:', veoScene);
  }

  // Test 3: ByteDance Seedance 2.0 (Product Image-to-Video)
  console.log('\n▶ [Test 3/6] Testing ByteDance Seedance 2.0 (Image-to-Video)...');
  const seedanceScene = await generateScene({
    prompt: 'Slow 360 degree turntable rotation around product packaging, studio softbox lighting reflections, dramatic zoom',
    imagePromptUrl: 'https://storage.relaunch.us/clients/chicago-dog/product-pack.png',
    model: 'seedance-2',
    aspectRatio: '9:16',
    durationSeconds: 4,
  });

  if (seedanceScene && seedanceScene.url && seedanceScene.modelUsed === 'seedance-2') {
    console.log(`  ✓ Seedance Image-to-Video generated successfully.`);
    console.log(`  ✓ Model: ${seedanceScene.modelUsed} | Provider: ${seedanceScene.provider}`);
    console.log(`  ✓ URL: ${seedanceScene.url}`);
    passedTests++;
  } else {
    console.error('  ✕ Seedance Scene generation failed:', seedanceScene);
  }

  // Test 4: Arcads.ai / Creatify UGC Talking-Head Actor
  console.log('\n▶ [Test 4/6] Testing Arcads UGC Actor Provider...');
  const actorClip = await generateActor({
    scriptText: 'Stop scrolling if you have ever had a craving for an authentic Chicago dog.',
    actorGender: 'female',
    actorAgeGroup: 'young_adult',
    actorStyle: 'relatable_ugc',
    aspectRatio: '9:16',
  });

  if (actorClip && actorClip.url && actorClip.modelUsed === 'arcads-v2') {
    console.log(`  ✓ UGC Actor clip generated successfully.`);
    console.log(`  ✓ Model: ${actorClip.modelUsed} | Provider: ${actorClip.provider}`);
    console.log(`  ✓ URL: ${actorClip.url}`);
    passedTests++;
  } else {
    console.error('  ✕ UGC Actor generation failed:', actorClip);
  }

  // Test 5: ElevenLabs Conversational Voiceover with Word Timestamps
  console.log('\n▶ [Test 5/6] Testing ElevenLabs Voiceover Engine & Word Alignment...');
  const voResult = await generateAudio({
    text: 'Authentic Chicago street food right in Lincoln Park. Steamed poppy seed buns, Vienna beef, zero ketchup.',
  });

  if (voResult && voResult.url && Array.isArray(voResult.words) && voResult.words.length > 0) {
    console.log(`  ✓ Voiceover generated successfully.`);
    console.log(`  ✓ Duration: ${voResult.durationSeconds}s | Model: ${voResult.modelUsed}`);
    console.log(`  ✓ Word timestamp count: ${voResult.words.length} words synchronized`);
    console.log(`  ✓ Sample word timing: "${voResult.words[0].word}" (${voResult.words[0].start}s -> ${voResult.words[0].end}s)`);
    passedTests++;
  } else {
    console.error('  ✕ Voiceover generation failed:', voResult);
  }

  // Test 6: Router Failover & Fallback Safety Test
  console.log('\n▶ [Test 6/6] Testing VideoRouter Fallback Resilience...');
  // Requesting Seedance without an image URL automatically fails over cleanly to Grok
  const fallbackScene = await videoRouter.generateScene({
    prompt: 'Vibrant outdoor patio atmosphere with happy diners enjoying lunch',
    model: 'seedance-2',
    // Deliberately omitting imagePromptUrl to verify graceful fallback
  });

  if (fallbackScene && fallbackScene.modelUsed === 'grok-1.5') {
    console.log(`  ✓ Intelligent fallback verified: Seedance cleanly redirected to Grok 1.5`);
    passedTests++;
  } else {
    console.error('  ✕ Fallback test failed:', fallbackScene);
  }

  console.log('\n==========================================================');
  console.log(`🏁 PHASE 5 VERIFICATION RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log('==========================================================');

  if (passedTests === totalTests) {
    console.log('✅ ALL PHASE 5 VIDEO ROUTER & ASSET APIs ARE OPERATIONAL!');
    process.exit(0);
  } else {
    console.error('❌ Some Phase 5 tests failed.');
    process.exit(1);
  }
}

runPhase5Tests().catch((err) => {
  console.error('Fatal Phase 5 test runner error:', err);
  process.exit(1);
});
