import {
  synthesizeBrandProfile,
  generateWeeklyScripts,
  auditAndRewriteCompliance,
  generateEditSpec,
  tagCreativeAttributes,
  BrandProfileSchema,
  WeeklyScriptsBatchSchema,
  ComplianceReportSchema,
  EditSpecSchema,
  CreativeAttributesSchema,
} from "./index.ts";

/**
 * ReLaunch Studio — Phase 4 Verification Test Suite
 * Validates end-to-end execution of all 5 prompt engine nodes and Zod schema conformity.
 */

async function runPhase4Tests() {
  console.log("==========================================================");
  console.log("🚀 STARTING PHASE 4 AI AGENT BRAIN VERIFICATION SUITE");
  console.log("==========================================================\n");

  let passedTests = 0;
  const totalTests = 5;

  // 1. Test Node 4.1: Brand Synthesis
  console.log("▶ [Test 1/5] Testing Node 4.1: Brand Synthesis Engine...");
  const brandProfile = await synthesizeBrandProfile({
    brandName: "Chicago Dog House",
    websiteUrl: "https://chicagodoghouse.com",
    scrapedWebsiteText:
      "Authentic Chicago street food since 2009. We serve Vienna beef hot dogs on steamed poppy seed buns, loaded with bright neon relish, sport peppers, pickle spears, tomatoes, and celery salt. No ketchup allowed. Best fast lunch in Lincoln Park.",
    customerReviews: [
      "Literally the best hot dog in Chicago. The snap on the Vienna beef is unreal.",
      "Quick service, amazing fries, and genuinely authentic flavor. My go-to lunch spot.",
    ],
    productCatalogText:
      "Signature Chicago Dog, Maxwell Street Polish, Chili Cheese Fries, Craft Sodas.",
  });

  const parsedBrand = BrandProfileSchema.safeParse(brandProfile);
  if (parsedBrand.success) {
    console.log(`  ✓ Brand Profile validated: "${brandProfile.brand_name}"`);
    console.log(`  ✓ Tone: ${brandProfile.voice_tone.join(", ")}`);
    console.log(`  ✓ Personas extracted: ${brandProfile.primary_personas.length}`);
    passedTests++;
  } else {
    console.error("  ✕ Brand Profile failed schema:", parsedBrand.error);
  }

  // 2. Test Node 4.2: Weekly Script Generator
  console.log("\n▶ [Test 2/5] Testing Node 4.2: Weekly Script Generator (4 Angles)...");
  const weeklyBatch = await generateWeeklyScripts({
    brandProfile,
    productName: "Signature Chicago Style Hot Dog",
    productOffer: "15% off first online pickup order",
    targetGoal: "Drive high-volume lunch foot traffic and pickup orders",
  });

  const parsedBatch = WeeklyScriptsBatchSchema.safeParse(weeklyBatch);
  if (parsedBatch.success && weeklyBatch.scripts.length === 4) {
    console.log(`  ✓ Batch generated with exactly ${weeklyBatch.scripts.length} angles:`);
    weeklyBatch.scripts.forEach((s, idx) => {
      console.log(`    [Angle ${idx + 1}] ${s.angle} (${s.framework}) — ${s.hook_variants.length} hooks`);
    });
    passedTests++;
  } else {
    console.error("  ✕ Weekly Script Batch failed schema:", parsedBatch);
  }

  // 3. Test Node 4.3: Automated Compliance Pre-Check & Auto-Rewrite
  console.log("\n▶ [Test 3/5] Testing Node 4.3: Compliance Pre-Check & Auto-Rewrite...");
  const riskyScript =
    "This hot dog will 100% guaranteed cure your lunchtime hunger and is scientifically guaranteed to be the best food on earth.";
  const complianceReport = await auditAndRewriteCompliance({
    scriptText: riskyScript,
    brandDoNotSay: ["No guaranteed cures", "No misleading claims"],
  });

  const parsedCompliance = ComplianceReportSchema.safeParse(complianceReport);
  if (parsedCompliance.success) {
    console.log(`  ✓ Compliance check executed.`);
    console.log(`  ✓ Flags caught: ${complianceReport.flags.length}`);
    console.log(`  ✓ Compliant rewritten copy: "${complianceReport.compliant_script}"`);
    passedTests++;
  } else {
    console.error("  ✕ Compliance check failed schema:", parsedCompliance.error);
  }

  // 4. Test Node 4.4: Edit-Spec JSON Generator
  console.log("\n▶ [Test 4/5] Testing Node 4.4: Edit-Spec JSON Generator for Remotion...");
  const testScript = weeklyBatch.scripts[0];
  const editSpec = await generateEditSpec({
    script: testScript,
    assets: [
      { id: "asset-actor-01", type: "actor_clip", description: "Creator holding hot dog", durationSeconds: 15 },
      { id: "asset-broll-sizzle", type: "broll", description: "Close-up of steamed bun and relish", durationSeconds: 6 },
      { id: "asset-broll-bite", type: "broll", description: "Creator taking first bite", durationSeconds: 5 },
      { id: "asset-vo-lunch", type: "voiceover", description: "Full VO track" },
      { id: "asset-music-chicago", type: "music", description: "Upbeat energetic backing track" },
    ],
    aspectRatios: ["9x16", "1x1", "4x5"],
    applyAIDisclosure: false, // Per client rule
  });

  const parsedEditSpec = EditSpecSchema.safeParse(editSpec);
  if (parsedEditSpec.success) {
    console.log(`  ✓ Edit-Spec generated: Template "${editSpec.template}"`);
    console.log(`  ✓ Formats targeted: ${editSpec.aspect_ratios.join(", ")}`);
    console.log(`  ✓ Hook timing: 0.0s -> ${editSpec.tracks.hook.out}s`);
    console.log(`  ✓ Body tracks count: ${editSpec.tracks.body.length}`);
    console.log(`  ✓ Music gain: ${editSpec.tracks.music?.gain_db} dB`);
    passedTests++;
  } else {
    console.error("  ✕ Edit-Spec failed schema:", parsedEditSpec.error);
  }

  // 5. Test Node 4.5: Creative Attribute Tagging
  console.log("\n▶ [Test 5/5] Testing Node 4.5: Creative Attribute Tagging Engine...");
  const tags = await tagCreativeAttributes({
    script: testScript,
    activeHookText: testScript.hook_variants[0].text,
    musicGenre: "Upbeat electronic",
  });

  const parsedTags = CreativeAttributesSchema.safeParse(tags);
  if (parsedTags.success) {
    console.log(`  ✓ Creative attributes tagged:`);
    console.log(`    • Hook Type: ${tags.hook_type}`);
    console.log(`    • Persona Age: ${tags.target_persona_age}`);
    console.log(`    • Music Tempo: ${tags.music_tempo}`);
    console.log(`    • Video Pacing: ${tags.video_pacing}`);
    console.log(`    • Angle Family: ${tags.angle_family}`);
    passedTests++;
  } else {
    console.error("  ✕ Creative attributes failed schema:", parsedTags.error);
  }

  console.log("\n==========================================================");
  console.log(`🏁 PHASE 4 VERIFICATION RESULTS: ${passedTests}/${totalTests} TESTS PASSED`);
  console.log("==========================================================");

  if (passedTests === totalTests) {
    console.log("✅ ALL PHASE 4 NODES ARE OPERATIONAL & SCHEMA COMPLIANT!");
    process.exit(0);
  } else {
    console.error("❌ Some tests failed verification.");
    process.exit(1);
  }
}

runPhase4Tests().catch((err) => {
  console.error("Fatal test runner error:", err);
  process.exit(1);
});
