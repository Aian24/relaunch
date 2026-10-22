export interface StudioTier {
  id: string;
  name: string;
  price: number;
  badge?: string;
  cadence: string;
  adsPerMonth: string;
  hookVariations: string;
  aspectRatios: string[];
  popular?: boolean;
  description: string;
  deliverables: string[];
  recommendedFor: string;
}

export interface AdShowcaseItem {
  id: string;
  title: string;
  category: string;
  hookType: string;
  aspectRatio: string;
  statBadge: string;
  videoSrc: string;
  description: string;
}

export interface StudioHowItWorksPillar {
  stepNumber: string;
  badge: string;
  title: string;
  headline: string;
  description: string;
  bullets: string[];
  imageSrc: string;
  imageAlt: string;
  metricBadge: string;
}

export const studioData = {
  badge: "AI-Powered Creative Engine",
  title: "ReLaunch Studio",
  headline: "Fresh Video Ads. Every Single Week.",
  tagline:
    "Weekly AI-powered video ads for Meta and TikTok. We test multiple hooks to lower your ad costs—no filming needed.",
  stats: [
    { value: 16, suffix: "+", label: "New ads every month" },
    { value: 48, suffix: "h", label: "Fast turnaround" },
    { value: 85, suffix: "%", label: "Lower cost vs. shoots" },
    { value: 100, suffix: "%", label: "Meta & TikTok compliant" },
  ],
  adShowcases: [
    {
      id: "showcase-2",
      title: "Chicago Dog: Viral Food Discovery",
      category: "Food & Hospitality",
      hookType: "Scroll-Stopping Hook (0–3s)",
      aspectRatio: "9:16 Vertical",
      statBadge: "+184% Hook CTR",
      videoSrc: "/videos/chicago-dog-social-1.mp4",
      description: "Direct scroll-stopping hook with mouthwatering macro shots and fast kinetic benefit captions.",
    },
    {
      id: "showcase-3",
      title: "Dance Fusion: Movement & Confidence",
      category: "Fitness & Studios",
      hookType: "Social Proof Hook",
      aspectRatio: "9:16 Vertical",
      statBadge: "4.6x Meta ROAS",
      videoSrc: "/videos/dance-fusion/dance-reel-2.mp4",
      description: "Inspiring adult students celebrating confidence, wellness, and real connections through movement.",
    },
    {
      id: "showcase-4",
      title: "Daily Glow: Clean Skincare Routine",
      category: "Beauty & DTC",
      hookType: "Before vs. After",
      aspectRatio: "9:16 Vertical",
      statBadge: "3.8x Blended ROAS",
      videoSrc: "/videos/chicago-dog-social-2.mp4",
      description: "Realistic UGC demonstration with native zooms, customer reviews, and clear CTA.",
    },
    {
      id: "showcase-5",
      title: "Dance Fusion: Studio Energy & Growth",
      category: "Local Studio & Events",
      hookType: "Lifestyle Discovery",
      aspectRatio: "9:16 Vertical",
      statBadge: "52% Thumbstop Rate",
      videoSrc: "/videos/dance-fusion/dance-reel-3.mp4",
      description: "UGC style testimonial showing beginner adults having fun in high-energy evening classes.",
    },
    {
      id: "showcase-6",
      title: "Carmen Hotel: Luxury Getaway",
      category: "Travel & Hospitality",
      hookType: "Visual Immersion",
      aspectRatio: "9:16 Vertical",
      statBadge: "4.2x ROAS",
      videoSrc: "/videos/carmen-hotel-body.mp4",
      description: "High-end visual aesthetic designed for Meta Reels travel discovery and booking lift.",
    },
    {
      id: "showcase-7",
      title: "Dance Fusion: Joyful Adult Movement",
      category: "Health & Arts",
      hookType: "Objection Buster",
      aspectRatio: "9:16 Vertical",
      statBadge: "-38% Lower CPA",
      videoSrc: "/videos/dance-fusion/dance-reel-4.mp4",
      description: "Addressing beginner intimidation directly: friendly instructors, diverse adult students, and pure joy.",
    },
    {
      id: "showcase-8",
      title: "Turf Life: Athletic Durability",
      category: "Athletics & Sports",
      hookType: "Us vs. Them Split",
      aspectRatio: "9:16 Vertical",
      statBadge: "+210% Conv. Rate",
      videoSrc: "/videos/turflife-real-video.mp4",
      description: "High-motion split testing showing product performance in real training conditions.",
    },
  ] satisfies AdShowcaseItem[],
  comparison: {
    traditional: {
      title: "Traditional Video Agencies",
      cost: "$5,000 – $15,000 / mo",
      points: [
        "10–14 days per video",
        "Costly actors, cameras, and studio shoots",
        "Only 1 hook tested (dies in 2 weeks)",
        "Reshoots take weeks and cost thousands",
      ],
    },
    relaunchStudio: {
      title: "ReLaunch Studio AI",
      cost: "$1,950 – $5,900 / mo",
      points: [
        "48-hour delivery on every batch",
        "Realistic AI UGC actors + your real product clips",
        "4–6 hook variations per ad to find cheap CPAs",
        "Instant script and prompt tweaks at $0 cost",
      ],
    },
  },
  workflowCadence: [
    {
      day: "MONDAY",
      step: "01",
      title: "Scripting & Hooks",
      desc: "We write 4–6 high-converting angles with multiple 3-second hook variations.",
    },
    {
      day: "MID-WEEK",
      step: "02",
      title: "AI Production",
      desc: "We generate realistic AI UGC avatars, voiceovers, and add your product b-roll.",
    },
    {
      day: "THURSDAY",
      step: "03",
      title: "Batch Review",
      desc: "Your new ads arrive in your portal. Review and approve in one sitting.",
    },
    {
      day: "FRIDAY",
      step: "04",
      title: "Launch & Learn",
      desc: "Launch on Meta and TikTok. We use performance data to improve the next batch.",
    },
  ],
  tiers: [
    {
      id: "sprint-pilot",
      name: "Sprint Pilot",
      price: 1950,
      badge: "Testing",
      cadence: "Bi-Weekly Drops (2x / Month)",
      adsPerMonth: "8 Finished Ads / mo",
      hookVariations: "2 Hooks per Concept",
      aspectRatios: ["9:16 Vertical"],
      popular: false,
      recommendedFor: "Brands testing AI video ads for the first time.",
      description: "Fast way to validate AI video ads on Meta and TikTok.",
      deliverables: [
        "8 finished video ads per month",
        "2 hooks tested per concept (16 variants)",
        "9:16 vertical (Reels & TikTok)",
        "AI voiceover & animated captions",
        "Month-to-month, cancel anytime",
      ],
    },
    {
      id: "growth-drop",
      name: "Growth Drop",
      price: 3450,
      badge: "Most Popular",
      cadence: "Weekly Drops",
      adsPerMonth: "16 Finished Ads / mo",
      hookVariations: "4 Hooks per Concept",
      aspectRatios: ["9:16 Vertical", "4:5 Feed"],
      popular: true,
      recommendedFor: "Growing DTC brands spending $10k–$75k/mo on ads.",
      description: "Our flagship weekly creative engine. Fresh ads every single week.",
      deliverables: [
        "16 finished video ads (4 every week)",
        "4 hooks tested per concept (32 variants)",
        "9:16 vertical + 4:5 feed formats",
        "Curated demographic AI actors",
        "Data-driven weekly iterations",
        "Month-to-month, cancel anytime",
      ],
    },
    {
      id: "scale-whitelist",
      name: "Scale & Whitelist",
      price: 5900,
      badge: "Full Scale",
      cadence: "Weekly Priority Drops",
      adsPerMonth: "32 Finished Ads / mo",
      hookVariations: "6 Hooks per Concept",
      aspectRatios: ["9:16 Vertical", "4:5 Feed", "16:9 Landscape"],
      popular: false,
      recommendedFor: "High-spend brands needing massive creative volume.",
      description: "High volume testing with custom founder AI avatar clones.",
      deliverables: [
        "32 finished video ads (8 every week)",
        "6 hooks tested per angle (64 variants)",
        "Custom brand AI avatar clone",
        "Creator whitelisting & Spark Ads setup",
        "Dedicated Creative Strategist",
        "Month-to-month, cancel anytime",
      ],
    },
  ] satisfies StudioTier[],
  compliancePoints: [
    {
      title: "100% Meta & TikTok Compliant",
      description: "Follows all platform AI rules and transparency tags.",
    },
    {
      title: "You Own Everything",
      description: "Full commercial ownership of all video ads and scripts.",
    },
    {
      title: "Runs in Your Accounts",
      description: "Direct launch in your Business Manager. You keep all pixel data.",
    },
    {
      title: "Zero Fake Claims",
      description: "All ads are built around your real product benefits and truths.",
    },
  ],
  howItWorks: [
    {
      stepNumber: "1",
      badge: "01",
      title: "Weekly Video Production",
      headline: "New ads created and delivered every Friday.",
      description:
        "Every Monday, we create new video ads for your business. We deliver them to you every Friday to review and launch.",
      bullets: [],
      imageSrc: "/images/studio/weekly-production.jpg",
      imageAlt: "Weekly Video Production",
      metricBadge: "Weekly Drops",
    },
    {
      stepNumber: "2",
      badge: "02",
      title: "Post from Real Creators",
      headline: "Run ads through trusted creator pages.",
      description:
        "Run your ads through verified creator and reviewer pages. Shoppers trust recommendations from real people far more than regular brand ads.",
      bullets: [],
      imageSrc: "/images/studio/weekly-production.jpg",
      imageAlt: "Post from Real Creators",
      metricBadge: "Creator Pages",
    },
    {
      stepNumber: "3",
      badge: "03",
      title: "Make More of What Sells",
      headline: "Double down on your best-performing videos.",
      description:
        "We see which videos get you the most clicks and buyers, then make fresh variations of your top ads every week.",
      bullets: [],
      imageSrc: "/images/studio/weekly-production.jpg",
      imageAlt: "Make More of What Sells",
      metricBadge: "Growth",
    },
  ] satisfies StudioHowItWorksPillar[],
};
