/**
 * ReLaunch Studio — Quality-First Production Standards & Protocols
 * Standard Operating Procedures (SOP) established by Robert Clark (Creative Director)
 */

export interface ProductShotAngle {
  id: string;
  name: string;
  targetScene: 2 | 3;
  cameraFraming: string;
  lightingSpec: string;
  motionDirection: string;
  durationSeconds: number;
  description: string;
  purpose: string;
  clientInstruction: string;
}

export interface VideographerBriefSpec {
  resolution: "1080x1920 (FHD)" | "2160x3840 (4K UHD)";
  framerate: "30fps" | "60fps";
  audioSpec: string;
  lighting: string;
  framing: string;
  deliverableContainer: string;
  colorProfile: string;
}

/**
 * 7 Standard Client Product Footage Angles (Point 7)
 * Ensures consistent, premium footage intake from clients and videographers.
 */
export const CLIENT_PRODUCT_SHOT_LIST: ProductShotAngle[] = [
  {
    id: "hero-unboxing",
    name: "Angle 1: Hero Unboxing & First Impression",
    targetScene: 2,
    cameraFraming: "Medium Close-Up (Chest height, hands entering frame)",
    lightingSpec: "Soft diffuse 45° key light + subtle rim light",
    motionDirection: "Slow deliberate unboxing, removing product from box toward camera lens",
    durationSeconds: 3.5,
    description: "Crisp first interaction showing packaging quality, premium finishes, and tactile opening.",
    purpose: "Establishes tactile authenticity and immediate physical reality of the product.",
    clientInstruction: "Film against a clean, clutter-free desk or countertop with natural daylight or soft studio light.",
  },
  {
    id: "macro-texture",
    name: "Angle 2: Macro Texture & Ingredient Reveal",
    targetScene: 2,
    cameraFraming: "Extreme Close-Up (Macro lens / 2x optical zoom)",
    lightingSpec: "High-contrast edge lighting to emphasize viscosity, grain, or stitch pattern",
    motionDirection: "Slow pan or tilt revealing formulation, texture droplets, or fabric weave",
    durationSeconds: 3.0,
    description: "Intimate physical sensory details that prove manufacturing quality.",
    purpose: "Direct sensory proof that triggers visceral viewer desire.",
    clientInstruction: "Get within 3–6 inches of product. Show drops, pump dispensing, seams, or tactile feel.",
  },
  {
    id: "functional-demo",
    name: "Angle 3: Functional Demonstration & Application",
    targetScene: 2,
    cameraFraming: "Eye-level POV or 45° angle",
    lightingSpec: "Even flat-field illumination with zero harsh shadows",
    motionDirection: "Active use in real-time (applying to skin, swinging club, tapping interface)",
    durationSeconds: 4.0,
    description: "The core mechanic of how the product works in action.",
    purpose: "Eliminates doubt on how the product operates or looks during daily use.",
    clientInstruction: "Film someone actively using the product. Keep action smooth and centered.",
  },
  {
    id: "hands-on-scale",
    name: "Angle 4: Real Hands-On Ergonomics & Scale",
    targetScene: 2,
    cameraFraming: "Medium shot with hands and torso in natural environment",
    lightingSpec: "Warm ambient room light + frontal fill",
    motionDirection: "Rotating product in hand, demonstrating weight and ergonomic grip",
    durationSeconds: 3.0,
    description: "Human hand holding the product to convey true scale and build heft.",
    purpose: "Anchors product in physical reality so viewers understand dimensions.",
    clientInstruction: "Hold product naturally in one hand. Turn it gently 90 degrees toward the lens.",
  },
  {
    id: "problem-state",
    name: "Angle 5: Before / Problem State Context",
    targetScene: 3,
    cameraFraming: "Wide-to-medium ambient scene",
    lightingSpec: "Slightly desaturated or mood lighting",
    motionDirection: "Struggling with old alternative or experiencing daily friction",
    durationSeconds: 3.0,
    description: "The frustrating alternative or real-world friction before using the product.",
    purpose: "Visually reinforces the customer's pain point before revealing the payoff.",
    clientInstruction: "Show the messy, slow, or uncomfortable alternative your product replaces.",
  },
  {
    id: "360-turntable",
    name: "Angle 6: 360° Studio Turntable Rotation",
    targetScene: 2,
    cameraFraming: "Centered Hero Master Shot",
    lightingSpec: "Clean studio gradient backdrop with subtle bottom reflection",
    motionDirection: "Continuous slow 360° motorized rotation",
    durationSeconds: 4.0,
    description: "Flawless studio look showcasing all sides and logos.",
    purpose: "Elevates brand perception from amateur UGC to premium luxury commercial tier.",
    clientInstruction: "Place on clean rotating platform or slow handheld camera orbit against plain backdrop.",
  },
  {
    id: "payoff-reaction",
    name: "Angle 7: Immediate Result & Payoff Smile",
    targetScene: 3,
    cameraFraming: "Medium Close-Up of user face & product together",
    lightingSpec: "Flattering beauty lighting with catchlight in eyes",
    motionDirection: "Satisfied expression, sigh of relief, or admiring final outcome",
    durationSeconds: 3.5,
    description: "Authentic human validation after product application.",
    purpose: "Emotional closure that triggers click-through and purchase intent.",
    clientInstruction: "Capture genuine smile or nod of approval right after application or usage.",
  },
];

/**
 * Standardized Freelancer / Fiverr Videographer Brief Template (Point 7)
 */
export const FREELANCER_VIDEOGRAPHER_BRIEF = {
  title: "ReLaunch Studio — Commercial Product Footage Brief",
  specifications: {
    resolution: "2160x3840 (4K UHD) preferred, minimum 1080x1920 (FHD)",
    framerate: "60fps (allows 50% slow-motion ramping) or 30fps",
    orientation: "Strict 9:16 Vertical (Lock camera orientation)",
    lighting: "3-point studio lighting (Key + Fill + Hair/Rim). NO overhead ceiling fluorescent light.",
    audioSpec: "Clean ambient room tone or silent (we mix master audio in post)",
    colorProfile: "Rec.709 Standard, Clean White Balance, No extreme LUTs baked in",
    shutterSpeed: "1/120s for 60fps, 1/60s for 30fps (natural motion blur, 180° rule)",
  },
  deliverableRequirements: [
    "Provide minimum 3 distinct takes per angle from the 7-Angle Shot List.",
    "Keep raw camera audio embedded for sound design reference.",
    "Do NOT add music, text overlays, digital zooms, or artificial transitions in camera.",
    "Deliver raw MP4 / ProRes files via Google Drive folder within 48 hours.",
  ],
  creatorVettingStandard: [
    "Portfolio must showcase recent vertical 9:16 direct-response commercial work.",
    "Creator must possess dedicated ring/softbox lighting and clean acoustics.",
    "Natural, confident on-camera presence with zero script-reading eye darting.",
    "Full commercial buyout and likeness sync rights granted in writing.",
  ],
};

/**
 * 5-Pillar Creative Director Review Standard (Point 11)
 * The objective checklist Robert Clark approves against for consistent craft.
 */
export const CD_REVIEW_CHECKLIST = [
  {
    pillar: "Pillar 1: 0–3s Hook Pacing & Scroll-Stop Grip",
    target: "Hook Rate ≥ 35%",
    criteria: [
      "Creator delivers opening hook word by second 0.2 with zero dead air.",
      "Visual pattern interrupt occurs within first 15 frames (gesture, text drop, motion).",
      "Caption styling is high-contrast, legible on mobile without covering creator face.",
    ],
  },
  {
    pillar: "Pillar 2: Audio Craft & Dynamic Ducking Mix",
    target: "Dialogue -14 LUFS, Music -18 dB ducking",
    criteria: [
      "Voiceover is broadcast-clean, free of room echo or plosives.",
      "Background music dips smoothly under dialogue and surges during visual transitions.",
      "Sound effects (whooshes, risers, impacts) align frame-accurately with cuts.",
    ],
  },
  {
    pillar: "Pillar 3: Visual Rhythm & Jump-Cut Cadence",
    target: "Average shot length: 1.2s to 2.4s",
    criteria: [
      "No single shot lingers past 3.0s without zoom, pan, or b-roll transition.",
      "Real client product footage anchors scenes 2–3 (authentic physical proof).",
      "Colors and white balance match harmoniously between creator UGC and product clips.",
    ],
  },
  {
    pillar: "Pillar 4: Substantiated Claims & Zero Fake Badges",
    target: "100% Policy Compliant",
    criteria: [
      "All badges reflect verified client policies (e.g., 30-Day Money-Back Guarantee, Lab Tested).",
      "Zero decorative fake star ratings or fabricated customer counters.",
      "Selective AI watermark visible only on photorealistic AI gap-fill scenes.",
    ],
  },
  {
    pillar: "Pillar 5: High-Contrast Motion CTA & Offer Clarity",
    target: "Outbound CTR ≥ 1.8%",
    criteria: [
      "Offer is stated clearly with direct URL or bio link instruction.",
      "End card appears at second 15.5 with clear button affordance.",
      "Audio and video end with crisp cadence, inviting immediate tap.",
    ],
  },
];

/**
 * Flagship Ad Spec & Live Spend KPI Benchmarks (Points 12 & 13)
 */
export const FLAGSHIP_BENCHMARKS = {
  flagshipAdTitle: "Dewpoint Hydration Duo — Flagship Hybrid Commercial Master",
  format: "9:16 Vertical UHD Master + 1:1 Square + 4:5 Feed",
  targetAudience: "DTC Skincare Buyers (Women 25–48, sensitive skin, cold climate)",
  liveSpendTargetMetrics: {
    hookRate3s: "≥ 35.0% (3-second video plays / impressions)",
    holdRateThruPlay: "≥ 15.0% (15-second completed views / 3-second plays)",
    outboundCtr: "≥ 1.80% (Unique link clicks / impressions)",
    costPerAcquisition: "Target CPA ≤ $28.00 at $1,000/day spend",
    returnOnAdSpend: "Target ROAS ≥ 2.40x",
  },
};

