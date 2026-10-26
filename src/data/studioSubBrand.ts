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
  brandName: string;
  brandHandle: string;
  brandAvatar?: string;
  brandCategory: string;
  title: string;
  category: string;
  hookType: string;
  aspectRatio: string;
  statBadge: string;
  videoSrc: string;
  description: string;
  pill: {
    title: string;
    subtitle: string;
    ratingOrPrice: string;
    tagText?: string;
    badgeColor?: string;
  };
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
  badge: "High-Velocity Video Creative Engine",
  title: "ReLaunch Studio",
  headline: "Fresh Video Branding. Every Single Week.",
  tagline:
    "Hybrid video ad production: verified real creators, client-supplied footage editing, and AI-assisted scenes & graphics. We test multiple hooks weekly to lower your ad costs and scale customer acquisition.",
  stats: [
    { prefix: "", value: 16, suffix: "+", label: "New ads every month" },
    { prefix: "", value: 48, suffix: "h", label: "Fast turnaround" },
    { prefix: "Up to ", value: 85, suffix: "%", label: "Lower cost vs. shoots" },
    { prefix: "", value: 100, suffix: "%", label: "Built to ad policies" },
  ],
  adShowcases: [
    {
      id: "showcase-bkind-mist",
      brandName: "BKIND Botanicals",
      brandHandle: "@bkind.beauty",
      brandCategory: "Clean Skincare & Beauty",
      title: "BKIND: Floral Mist & Morning Glow Routine",
      category: "Beauty & DTC",
      hookType: "Sensory ASMR & Morning Routine",
      aspectRatio: "9:16 Vertical",
      statBadge: "4.4x Meta ROAS",
      videoSrc: "/videos/reels/bkind-floral-mist.mp4",
      description: "Fast-cut morning hydration routine showcasing fine floral mist application, instant dewy skin, and lightweight carry-everywhere packaging.",
      pill: {
        title: "Floral Face Hydration Mist",
        subtitle: "Organic Rosewater & Cornflower",
        ratingOrPrice: "$42.00",
        tagText: "Trending Now",
        badgeColor: "#EC4899",
      },
    },
    {
      id: "showcase-herbivore-cream",
      brandName: "Herbivore Botanicals",
      brandHandle: "@herbivorebotanicals",
      brandCategory: "Luxury Clean Skincare",
      title: "Herbivore: Aquarius Clarity Cream Texture",
      category: "Luxury DTC",
      hookType: "Rapid Problem-Solution Hook",
      aspectRatio: "9:16 Vertical",
      statBadge: "-34% Cost Per Sale",
      videoSrc: "/videos/reels/herbivore-aquarius-cream.mp4",
      description: "Macro texture demo featuring soothing blue tansy cream absorbing into pores to instantly rebalance breakouts without drying.",
      pill: {
        title: "Aquarius Pore Purifying Cream",
        subtitle: "Blue Tansy & Willow Bark BHA",
        ratingOrPrice: "$58.00",
        tagText: "Top Rated",
        badgeColor: "#0EA5E9",
      },
    },
    {
      id: "showcase-chicago-1",
      brandName: "Chicago Dog Co.",
      brandHandle: "@chicagodogco",
      brandCategory: "Food & Hospitality",
      title: "Chicago Dog: Viral Street Food Discovery",
      category: "Food & Dining",
      hookType: "Scroll-Stopping Hook (0–3s)",
      aspectRatio: "9:16 Vertical",
      statBadge: "+184% Hook CTR",
      videoSrc: "/videos/chicago-dog-social-1.mp4",
      description: "Direct scroll-stopping hook with mouthwatering macro shots and fast kinetic benefit captions.",
      pill: {
        title: "Chicago Style Jumbo Dog",
        subtitle: "Fresh Pickled Sport Peppers & Relish",
        ratingOrPrice: "4.9 ★ (1.2k)",
        tagText: "Bestseller",
        badgeColor: "#FF6700",
      },
    },
    {
      id: "showcase-mokosh-ceramide",
      brandName: "MOKOSH Skin Science",
      brandHandle: "@mokosh.cosmetics",
      brandCategory: "Clinical Botanical Care",
      title: "MOKOSH: Restorative Ceramide Barrier Cream",
      category: "Clinical DTC",
      hookType: "Mechanism of Action Breakdown",
      aspectRatio: "9:16 Vertical",
      statBadge: "58% Thumbstop Rate",
      videoSrc: "/videos/reels/mokosh-ceramide-cream.mp4",
      description: "High-credibility dermatologist aesthetic highlighting triple bio-identical ceramides repairing irritated moisture barriers.",
      pill: {
        title: "Barrier Restoring Ceramide Cream",
        subtitle: "Triple Ceramide Complex",
        ratingOrPrice: "$72.00",
        tagText: "Derm Approved",
        badgeColor: "#8B5CF6",
      },
    },
    {
      id: "showcase-jojoba-elixir",
      brandName: "Pure Botanics",
      brandHandle: "@purebotanics.glow",
      brandCategory: "Eco DTC & Wellness",
      title: "Pure Botanics: Cold-Pressed Golden Jojoba Drops",
      category: "Beauty & Wellness",
      hookType: "Before / After Skin Transformation",
      aspectRatio: "9:16 Vertical",
      statBadge: "3.6x TikTok ROAS",
      videoSrc: "/videos/reels/jojoba-glow-elixir.mp4",
      description: "Dropper pipette macro showing pure golden botanical oil melting into dry skin for long-lasting radiant hydration.",
      pill: {
        title: "Golden Jojoba Elixir",
        subtitle: "100% Unrefined Cold-Pressed Oil",
        ratingOrPrice: "$38.00",
        tagText: "100% Organic",
        badgeColor: "#F59E0B",
      },
    },
    {
      id: "showcase-carmen-hotel",
      brandName: "Carmen Hotel Tulum",
      brandHandle: "@carmenresorts",
      brandCategory: "Luxury Travel & Resorts",
      title: "Carmen Hotel: Oceanfront Escape",
      category: "Travel & Hospitality",
      hookType: "Visual Immersion & Lifestyle",
      aspectRatio: "9:16 Vertical",
      statBadge: "4.2x ROAS",
      videoSrc: "/videos/carmen-hotel-body.mp4",
      description: "High-end visual aesthetic designed for Meta Reels travel discovery, suite previews, and direct booking lift.",
      pill: {
        title: "Bespoke Beachfront Suite",
        subtitle: "Private Plunge Pool & Ocean Views",
        ratingOrPrice: "Book Direct",
        tagText: "Featured Destination",
        badgeColor: "#0EA5E9",
      },
    },
    {
      id: "showcase-oat-balm",
      brandName: "Oat Cleanse Club",
      brandHandle: "@oatcleanse.skin",
      brandCategory: "Clean Skincare & Routine",
      title: "Oat Cleanse: Melt-Away Cleansing Balm",
      category: "Beauty & DTC",
      hookType: "2-Second Makeup Melt Demo",
      aspectRatio: "9:16 Vertical",
      statBadge: "4.8x Meta ROAS",
      videoSrc: "/videos/reels/oat-cleansing-balm.mp4",
      description: "Instant visual satisfaction showing stubborn waterproof makeup dissolving in seconds without stripping delicate skin barriers.",
      pill: {
        title: "Colloidal Oat Cleansing Balm",
        subtitle: "Melts Waterproof Makeup in 10s",
        ratingOrPrice: "$34.00",
        tagText: "Viral Hit",
        badgeColor: "#10B981",
      },
    },
    {
      id: "showcase-lumina-beauty",
      brandName: "Lumina Botanical",
      brandHandle: "@luminaskin",
      brandCategory: "Clean Skincare & Beauty",
      title: "Lumina Skincare: Hydra-Dew Routine",
      category: "Beauty & DTC",
      hookType: "Sensory Texture & Routine",
      aspectRatio: "9:16 Vertical",
      statBadge: "3.8x Blended ROAS",
      videoSrc: "/videos/chicago-dog-social-2.mp4",
      description: "Organic UGC aesthetic showcasing gentle application, real skin texture, and direct product benefits.",
      pill: {
        title: "Hydra-Dew Glow Serum",
        subtitle: "100% Cold-Pressed Botanical Elixir",
        ratingOrPrice: "$48.00",
        tagText: "Shop the Look",
        badgeColor: "#EC4899",
      },
    },
    {
      id: "showcase-mokosh-body",
      brandName: "MOKOSH Body Rituals",
      brandHandle: "@mokosh.lifestyle",
      brandCategory: "Luxury Body & Wellness",
      title: "MOKOSH: Velvety Body Lotion Glow",
      category: "Body Care & Wellness",
      hookType: "Satisfying Application Hook",
      aspectRatio: "9:16 Vertical",
      statBadge: "+192% Video Completion",
      videoSrc: "/videos/reels/mokosh-body-lotion.mp4",
      description: "Sensory video creative designed to highlight thick whipped texture melting into silky nourishment without greasy residue.",
      pill: {
        title: "Deep Nourish Body Cream",
        subtitle: "Shea Butter & Sweet Orange Oil",
        ratingOrPrice: "$65.00",
        tagText: "Customer Favorite",
        badgeColor: "#F59E0B",
      },
    },
    {
      id: "showcase-velvet-oak",
      brandName: "Velvet & Oak Fragrance",
      brandHandle: "@velvetandoak",
      brandCategory: "Luxury Goods & Perfumery",
      title: "Velvet & Oak: Signature Artisanal Scent",
      category: "Luxury DTC",
      hookType: "Sensory Aesthetic Reel",
      aspectRatio: "9:16 Vertical",
      statBadge: "3.4x Meta ROAS",
      videoSrc: "/videos/chicago-dog-social-3.mp4",
      description: "Cinematic macro cinematography highlighting artisanal botanical notes, amber glass, and packaging detail.",
      pill: {
        title: "Santorini Smoke Extrait",
        subtitle: "Cardamom, Birch & Smoked Amber",
        ratingOrPrice: "$120.00",
        tagText: "Limited Batch",
        badgeColor: "#8B5CF6",
      },
    },
    {
      id: "showcase-dance-2",
      brandName: "Dance Fusion",
      brandHandle: "@dancefusion.co",
      brandCategory: "Fitness & Studios",
      title: "Dance Fusion: Movement & Confidence",
      category: "Fitness & Studios",
      hookType: "Social Proof Hook",
      aspectRatio: "9:16 Vertical",
      statBadge: "4.6x Meta ROAS",
      videoSrc: "/videos/dance-fusion/dance-reel-2.mp4",
      description: "Inspiring adult students celebrating confidence, wellness, and real connections through movement.",
      pill: {
        title: "Beginner Adult Movement Pass",
        subtitle: "Unlimited 14-Day Studio Intro",
        ratingOrPrice: "$39 Intro",
        tagText: "Popular",
        badgeColor: "#7F48ED",
      },
    },
    {
      id: "showcase-mokosh-essence",
      brandName: "MOKOSH Botanicals",
      brandHandle: "@mokosh.botanicals",
      brandCategory: "Organic Skincare",
      title: "MOKOSH: Mint & Aloe Soothing Essence",
      category: "Organic Skincare",
      hookType: "Post-Workout Cooling Routine",
      aspectRatio: "9:16 Vertical",
      statBadge: "+160% Hook Retention",
      videoSrc: "/videos/reels/mokosh-soothing-essence.mp4",
      description: "Ultra-refreshing mist bottle spraying hydro-infused herbal toner onto flushed skin for instant calm and reduced redness.",
      pill: {
        title: "Mint & Aloe Soothing Essence",
        subtitle: "Hydro-Infused Herbal Toner",
        ratingOrPrice: "$59.00",
        tagText: "Refreshing Mist",
        badgeColor: "#10B981",
      },
    },
    {
      id: "showcase-beauty-ugc",
      brandName: "Glow Culture Daily",
      brandHandle: "@glowculture.co",
      brandCategory: "UGC Beauty & Lifestyle",
      title: "Glow Culture: 3-Step Morning Routine",
      category: "UGC Beauty & Influencer",
      hookType: "Creator Confession Hook",
      aspectRatio: "9:16 Vertical",
      statBadge: "-41% CPA on Spark Ads",
      videoSrc: "/videos/reels/beauty-ugc-routine.mp4",
      description: "Casual creator selfie-style camera confession sharing the exact 3-step routine that cleared hormonal skin in 6 weeks.",
      pill: {
        title: "Daily Glow Routine Trio",
        subtitle: "Cleanse, Hydrate, Protect",
        ratingOrPrice: "$84.00 Bundle",
        tagText: "Staff Pick",
        badgeColor: "#EC4899",
      },
    },
    {
      id: "showcase-dance-3",
      brandName: "Dance Fusion",
      brandHandle: "@dancefusion.co",
      brandCategory: "Local Studio & Events",
      title: "Dance Fusion: High Energy Adult Classes",
      category: "Local Studio & Events",
      hookType: "Lifestyle Discovery",
      aspectRatio: "9:16 Vertical",
      statBadge: "52% Thumbstop Rate",
      videoSrc: "/videos/dance-fusion/dance-reel-3.mp4",
      description: "UGC style testimonial showing beginner adults having fun in high-energy evening classes.",
      pill: {
        title: "Evening Energy Drop-In",
        subtitle: "No Experience Required",
        ratingOrPrice: "$22 Single Class",
        tagText: "Zero Experience",
        badgeColor: "#F59E0B",
      },
    },
  ] satisfies AdShowcaseItem[],
  comparison: {
    traditional: {
      title: "Traditional Video Agencies",
      cost: "$5,000 – $15,000 / mo",
      points: [
        "10–14 days per video turn",
        "Costly actors, cameras, and studio shoots",
        "Only 1 hook tested (dies in 2 weeks)",
        "Reshoots take weeks and cost thousands",
      ],
    },
    relaunchStudio: {
      title: "ReLaunch Studio",
      cost: "$1,950 – $5,900 / mo",
      points: [
        "48-hour delivery on every fresh batch",
        "Curated creator talent + your real product footage",
        "4–6 hook variations per concept to find lowest CPA",
        "Fast creative iteration with zero studio friction",
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
      title: "Video Production",
      desc: "We produce high-impact vertical cuts, kinetic typography, professional sound, and custom b-roll.",
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
      recommendedFor: "Brands seeking high-velocity video creative testing.",
      description: "Fast way to validate video ads on Meta and TikTok.",
      deliverables: [
        "8 finished video ads per month",
        "2 hooks tested per concept (16 variants)",
        "9:16 vertical (Reels & TikTok)",
        "Dynamic voiceover & animated captions",
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
        "Curated on-camera creator talent",
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
      description: "High volume testing with multi-creator whitelisted campaigns.",
      deliverables: [
        "32 finished video ads (8 every week)",
        "6 hooks tested per angle (64 variants)",
        "Multi-creator whitelisted campaigns",
        "Creator whitelisting & Spark Ads setup",
        "Dedicated Creative Strategist",
        "Month-to-month, cancel anytime",
      ],
    },
  ] satisfies StudioTier[],
  compliancePoints: [
    {
      title: "Built to Meta & TikTok Ad Policies",
      description: "Engineered specifically to follow Meta Reels, TikTok, and YouTube Shorts commercial guidelines.",
    },
    {
      title: "You Own Everything",
      description: "Full commercial ownership of all video ads, cuts, and scripts.",
    },
    {
      title: "Runs in Your Accounts",
      description: "Direct launch in your Business Manager. You keep all pixel data.",
    },
    {
      title: "Zero Fake Claims",
      description: "All ads are built around your real product benefits and authentic truths.",
    },
  ],
  howItWorks: [
    {
      stepNumber: "1",
      badge: "01",
      title: "Hybrid Creative Production",
      headline: "Real creators + client footage + AI b-roll delivered every Friday.",
      description:
        "Every Monday, real creators film your hooks, our editors composite your raw client footage, and AI generates sensory b-roll & dynamic typography. Delivered every Friday.",
      bullets: [],
      imageSrc: "/images/howitworksstudio.jpg",
      imageAlt: "Hybrid Video Production",
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
      imageSrc: "/images/howitworksstudio.jpg",
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
      imageSrc: "/images/howitworksstudio.jpg",
      imageAlt: "Make More of What Sells",
      metricBadge: "Growth",
    },
  ] satisfies StudioHowItWorksPillar[],
};
