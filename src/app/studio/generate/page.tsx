"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smartphone,
  Square,
  CheckCircle2,
  RefreshCw,
  Eye,
  Download,
  Video,
  Zap,
  Check,
  ChevronDown,
  ChevronRight,
  Shuffle,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Upload,
  Layers,
  Edit3,
  AlertTriangle,
  X,
  FileVideo,
  Image as ImageIcon,
  ShieldCheck,
  FolderOpen,
  Sliders,
  ExternalLink,
  Plus,
  Users,
  Scissors,
  GripVertical,
  Film,
  FolderDown,
  Music,
} from "lucide-react";
import { CREATOR_ROSTER, CreatorProfile } from "@/data/creatorRoster";
import { CREATOR_ASSETS, CreatorClipAsset, getCreatorClips, getCreatorClipById } from "@/data/creatorAssets";
import HookTrimmer from "@/components/studio/HookTrimmer";
import ClipTrimmer from "@/components/studio/ClipTrimmer";
import MasterAssetsModal from "@/components/studio/MasterAssetsModal";
import {
  LICENSED_MUSIC_LIBRARY,
  BRANDED_CTA_TEMPLATES,
  CAPTION_STYLES,
  BRAND_COLOR_PRESETS,
  TRUST_BADGE_PRESETS,
  MusicTrack,
  CtaTemplate,
  CaptionStyle,
  TrustBadgeOption,
} from "@/data/timelineAssets";

interface AngleContent {
  title: string;
  badge: string;
  hooks: string[];
  body: string;
}

interface BrandPreset {
  id: string;
  name: string;
  category: string;
  brandName: string;
  brandOffer: string;
  angleKey: string;
  visualPrompt: string;
  productVideo?: string;
  brollVideo?: string;
  musicTrackId?: string;
}

const BRAND_PRESETS: BrandPreset[] = [
  {
    id: "ai-recommendations",
    name: "AI Recommendations",
    category: "AI & Search",
    brandName: "AI Recommendations",
    brandOffer: "Free AI Visibility Audit",
    angleKey: "problem",
    visualPrompt: "Confident local business owner in a modern bright creative studio smiling as customer bookings arrive on smartphone, 4K commercial cinematography, natural sunlight, cinematic depth of field, 60fps",
    productVideo: "/videos/work-hero-reel.mp4",
    brollVideo: "/videos/outdoor/trailline-mountain-ridge.mp4",
    musicTrackId: "tech-driving-beat",
  },
  {
    id: "chicago-dog-42",
    name: "Chicago Dog 42",
    category: "Food & Dining",
    brandName: "Chicago Dog 42",
    brandOffer: "$5 Off First Jumbo Combo",
    angleKey: "listicle",
    visualPrompt: "Mouthwatering authentic Chicago hot dog with yellow mustard, bright green neon relish, chopped onions, tomato wedges, pickle spear, sport peppers and celery salt on a warm poppy seed bun, fresh sizzling grill smoke, vibrant appetizing commercial food lighting, 4K 60fps",
    productVideo: "/videos/chicago-dog-hero.mp4",
    brollVideo: "/videos/chicago-dog-social-1.mp4",
    musicTrackId: "energy-direct-response",
  },
  {
    id: "turf-life",
    name: "Turf Life",
    category: "Athleisure & Sports",
    brandName: "Turf Life",
    brandOffer: "20% Off Spring Turf Gear",
    angleKey: "comparison",
    visualPrompt: "Premium athletic coastal golf apparel, dynamic slow-motion golf swing on a sun-drenched championship fairway, crisp morning ocean breeze, technical performance fabric, cinematic commercial sports lighting, 4K 60fps",
    productVideo: "/videos/turf-life-hero.mp4",
    brollVideo: "/videos/turflife-real-video.mp4",
    musicTrackId: "trendy-upbeat-ugc",
  },
  {
    id: "carmen-hotel",
    name: "Carmen Hotel",
    category: "Hospitality & Travel",
    brandName: "Carmen Hotel",
    brandOffer: "Weekend VIP Suite Package",
    angleKey: "hack",
    visualPrompt: "Luxury boutique oceanfront hotel, turquoise infinity rooftop pool overlooking Caribbean waves at golden hour, elegant cabanas, champagne glasses clinking, sunset glow, 4K luxury travel commercial cinematography",
    productVideo: "/videos/carmen-hotel-hero.mp4",
    brollVideo: "/videos/carmen-hotel-body.mp4",
    musicTrackId: "luxury-cinematic",
  },
  {
    id: "dewpoint-skincare",
    name: "Dewpoint Skincare",
    category: "Beauty & Wellness",
    brandName: "Dewpoint Skincare",
    brandOffer: "25% Off Hydration Duo",
    angleKey: "ugc",
    visualPrompt: "Modern luxury clean skincare commercial, model with radiant glowing dewy skin applying lightweight barrier serum, fresh micro water droplets, minimalist aesthetic daylight studio, 4K 60fps",
    productVideo: "/videos/reels/dewpoint-ceramide-cream.mp4",
    brollVideo: "/videos/reels/dewpoint-floral-mist.mp4",
    musicTrackId: "chill-lofi-aesthetic",
  },
  {
    id: "relaunch-studio",
    name: "ReLaunch Studio",
    category: "Agency & Growth",
    brandName: "ReLaunch Studio",
    brandOffer: "5 Free Video Ad Variants",
    angleKey: "problem",
    visualPrompt: "High-velocity creative ad agency dashboard, dynamic montage of viral TikTok and Instagram Reels ad creative metrics, glowing purple and orange analytics, 4K commercial motion",
    productVideo: "/videos/work-hero-reel.mp4",
    brollVideo: "/videos/dance-fusion/dance-reel-2.mp4",
    musicTrackId: "trendy-upbeat-ugc",
  },
];

interface StudioVoice {
  id: string;
  name: string;
  category: "cloned" | "premade" | "generated" | "custom";
  description: string;
  previewUrl?: string | null;
  tierRequired?: "free" | "paid";
  hasBalance?: boolean;
  gender?: "male" | "female" | "neutral";
}

const DEFAULT_STUDIO_VOICES: StudioVoice[] = [
  {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam (Direct & Commercial)",
    category: "premade",
    gender: "male",
    tierRequired: "free",
    hasBalance: true,
    description: "Deep, confident commercial tone · Ready (Free & Active Balance)",
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella (Expressive & Soft)",
    category: "premade",
    gender: "female",
    tierRequired: "free",
    hasBalance: true,
    description: "Gentle, authentic beauty & wellness narration · Ready (Free & Active Balance)",
  },
  {
    id: "ErXwobaYiN019PkySvjV",
    name: "Antoni (Engaging & Polished)",
    category: "premade",
    gender: "male",
    tierRequired: "free",
    hasBalance: true,
    description: "Clear, trustworthy corporate narration · Ready (Free & Active Balance)",
  },
  {
    id: "pFZP5JQG7iQjIQuC4Bku",
    name: "Lily (Warm & Natural)",
    category: "premade",
    gender: "female",
    tierRequired: "free",
    hasBalance: true,
    description: "Authentic, relatable lifestyle UGC narration · Ready (Free & Active Balance)",
  },
  {
    id: "VR6AewLTigWG4xSOukaG",
    name: "Arnold (Deep & Authoritative)",
    category: "premade",
    gender: "male",
    tierRequired: "free",
    hasBalance: true,
    description: "Powerful, epic cinematic commercial tone · Ready (Free & Active Balance)",
  },
  {
    id: "IKne3meq5aSn9XLyUdCD",
    name: "Charlie (Casual & Friendly)",
    category: "premade",
    gender: "male",
    tierRequired: "free",
    hasBalance: true,
    description: "Friendly everyday Australian conversational tone · Ready (Free & Active Balance)",
  },
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel (Conversational & Warm)",
    category: "premade",
    gender: "female",
    tierRequired: "paid",
    hasBalance: false,
    description: "Natural, calm lifestyle narration · Requires Paid Subscription / Balance",
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi (Energetic & Hype)",
    category: "premade",
    gender: "female",
    tierRequired: "paid",
    hasBalance: false,
    description: "Fast-paced modern social media · Requires Paid Subscription / Balance",
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh (Relatable & Casual)",
    category: "premade",
    gender: "male",
    tierRequired: "paid",
    hasBalance: false,
    description: "Everyday friend, casual UGC review vibe · Requires Paid Subscription / Balance",
  },
];

function getAngleContent(brandName: string, offer: string): Record<string, AngleContent> {
  const brand = brandName.trim() || "My Brand";
  const cta = offer.trim() || "Exclusive Offer";

  if (brand.toLowerCase().includes("chicago dog") || brand.toLowerCase().includes("hot dog")) {
    return {
      listicle: {
        title: "3 Reasons Why",
        badge: "Clicks",
        hooks: [
          "3 reasons why Chicago Dog 42 is the most legendary dog in town.",
          "Reason #3 is why foodies drive 40 miles for this hot dog.",
          "Before you grab lunch today, look at this Chicago classic.",
          "3 signs you've found an authentic Chicago-style hot dog.",
        ],
        body: "Here is why Chicago Dog 42 is taking over your feed: 100% all-beef Vienna hot dog, neon green relish, and dragged completely through the garden on a steamed poppy seed bun. Grab $5 off your first combo today at chicagodog42.com.",
      },
      problem: {
        title: "Problem & Solution",
        badge: "Scale",
        hooks: [
          "Tired of boring, rubbery fast food hot dogs?",
          "The real reason most hot dog joints leave you disappointed.",
          "Stop scrolling if you're craving genuine Chicago street flavor.",
          "Why real Chicagoans refuse to put ketchup on a hot dog.",
        ],
        body: "Tired of bland fast food that leaves you disappointed? Chicago Dog 42 delivers authentic, snappy Vienna beef piled high with fresh tomatoes, sport peppers, and celery salt. Claim your $5 off voucher today at chicagodog42.com.",
      },
      comparison: {
        title: "Us vs. Them",
        badge: "Conversions",
        hooks: [
          "Standard drive-thru hot dogs vs Chicago Dog 42: look at the difference.",
          "Don't settle for lukewarm hot dogs when Chicago Dog 42 is right here.",
          "Can you spot why authentic Chicago style is 10x better?",
          "The honest truth about what goes into a genuine Chicago dog.",
        ],
        body: "Generic fast food spots cut corners with cheap hot dogs and stale buns. At Chicago Dog 42, every single dog is steamed to order with authentic neon relish and snappy Vienna beef. Order yours today at chicagodog42.com.",
      },
      ugc: {
        title: "Creator Taste Test",
        badge: "Trust",
        hooks: [
          "My honest first bite reaction to Chicago Dog 42.",
          "I drove across town to test the most hyped hot dog in the city.",
          "Here is what happens when you try Chicago Dog 42 for the first time.",
          "Is Chicago Dog 42 actually the best hot dog in the city? Let's find out.",
        ],
        body: "I finally stopped by Chicago Dog 42 to see if the hype was real. The snap on this Vienna beef dog is insane, and the sport peppers give it the perfect kick. Tap below to get $5 off your first combo.",
      },
      hack: {
        title: "Secret Foodie Hack",
        badge: "Curiosity",
        hooks: [
          "The secret lunch shortcut every foodie in the city uses.",
          "I wish I discovered Chicago Dog 42 months ago.",
          "The best kept lunch secret in the entire neighborhood.",
          "Stop overpaying for mediocre lunch when this exists.",
        ],
        body: "Here is the ultimate lunch hack: Chicago Dog 42. Snappy all-beef hot dogs, crispy crinkle-cut fries, and an ice-cold drink all ready in under 3 minutes. Claim your discount at chicagodog42.com.",
      },
      founder: {
        title: "Behind the Scenes / Craft",
        badge: "Authenticity",
        hooks: [
          "Why we refuse to compromise on authentic Chicago street food.",
          "Behind the scenes of how Chicago Dog 42 prepares every single dog.",
          "What actually goes into dragging a hot dog through the garden.",
          "Why Chicago Dog 42 will never use anything but Vienna beef.",
        ],
        body: "At Chicago Dog 42, we take Chicago street tradition seriously. Steamed poppy seed buns, kosher pickle spears, and authentic Vienna beef. Taste real Chicago pride today at chicagodog42.com.",
      },
      fomo: {
        title: "Limited Promo & Urgency",
        badge: "Scarcity",
        hooks: [
          "Claim your $5 off voucher before this week's drop sells out.",
          "Special lunch drop: $5 off your first Chicago Dog 42 combo.",
          "Hungry for lunch? Grab $5 off today only at Chicago Dog 42.",
          "Don't miss the most hyped Chicago hot dog in the city.",
        ],
        body: "Grab $5 off your first jumbo combo at Chicago Dog 42 today before this lunch promo expires. Visit chicagodog42.com to claim yours.",
      },
    };
  }

  if (brand.toLowerCase().includes("turf life") || brand.toLowerCase().includes("golf")) {
    return {
      comparison: {
        title: "Us vs. Them",
        badge: "Conversions",
        hooks: [
          "Traditional stiff golf polos vs Turf Life 4-way coastal stretch.",
          "Don't wear heavy, soaked cotton on the course when Turf Life exists.",
          "Can you spot the difference on your backswing? Look closely.",
          "Why amateur golfers and pros are switching to Turf Life apparel.",
        ],
        body: "Old-school golf apparel is stiff, heavy, and traps heat. Turf Life is engineered with featherlight 4-way stretch and UPF 50+ coastal breathability that moves with your swing. Unlock 20% off spring gear today at turflife.com.",
      },
      problem: {
        title: "Problem & Solution",
        badge: "Scale",
        hooks: [
          "Stop scrolling if you hate stiff, restrictive golf apparel.",
          "The real reason you feel fatigued after 18 holes in the heat.",
          "If your golf polo isn't breathing in the humidity, you need this.",
          "Why traditional golf apparel is ruining your summer game.",
        ],
        body: "Nothing ruins a round faster than heavy, restrictive gear in the summer heat. Turf Life brings performance athletic stretch from the course straight to the coast. Claim your exclusive 20% off spring discount today at turflife.com.",
      },
      ugc: {
        title: "Creator Course Test",
        badge: "Trust",
        hooks: [
          "Testing Turf Life through a full 18-hole tournament round.",
          "My honest review of Turf Life coastal golf apparel.",
          "Here is what happens when you switch to 4-way stretch performance polos.",
          "Why this is the only golf polo I pack in my bag now.",
        ],
        body: "I wore Turf Life for 18 holes in 85-degree humidity. It stayed completely dry, completely unrestricted on every drive, and looks sharp at the clubhouse. Tap below to get 20% off your spring kit.",
      },
      listicle: {
        title: "3 Reasons Why",
        badge: "Clicks",
        hooks: [
          "3 reasons why golfers are tossing their old polos for Turf Life.",
          "Reason #3 will change how comfortable you feel on the back nine.",
          "3 facts about high-performance coastal activewear you need to know.",
          "Why this athletic golf apparel is selling out every drop.",
        ],
        body: "Here is why Turf Life is dominating the course: moisture-wicking cooling fabric, wrinkle-resistant 4-way stretch, and effortless coastal style. Claim your 20% off at turflife.com.",
      },
      hack: {
        title: "Secret Course Hack",
        badge: "Curiosity",
        hooks: [
          "The course hack that keeps you cool through all 18 holes.",
          "I wish I stopped wearing heavy golf shirts years ago.",
          "The apparel upgrade every serious player needs this season.",
          "How to stay cool and look sharp from the fairway to dinner.",
        ],
        body: "Here is the game-changer: Turf Life. Built for championship fairways and relaxed coastal evenings with zero compromise on comfort. Grab 20% off your first order at turflife.com.",
      },
      founder: {
        title: "Behind the Scenes / Craft",
        badge: "Authenticity",
        hooks: [
          "Why we started Turf Life to disrupt old-school golf apparel.",
          "Behind the scenes of developing our coastal athletic fabrics.",
          "We tested 30 fabric blends before perfecting Turf Life stretch.",
          "What goes into designing golf gear that transitions to the coast.",
        ],
        body: "We built Turf Life because traditional golf gear felt like cardboard. We engineered performance wear that breathes under pressure and looks sharp everywhere. Claim your 20% off at turflife.com.",
      },
      fomo: {
        title: "Limited Promo & Urgency",
        badge: "Scarcity",
        hooks: [
          "Unlock 20% off spring Turf Life gear before sizes sell out.",
          "Exclusive spring drop: 20% off all performance golf apparel.",
          "Upgrade your golf wardrobe today with 20% off Turf Life.",
          "Limited spring inventory: grab your Turf Life kit today.",
        ],
        body: "Spring inventory is moving fast. Claim your exclusive 20% discount on all Turf Life athletic apparel today at turflife.com before sizes run out.",
      },
    };
  }

  if (brand.toLowerCase().includes("carmen") || brand.toLowerCase().includes("hotel") || brand.toLowerCase().includes("resort")) {
    return {
      hack: {
        title: "Secret Travel Hack",
        badge: "Curiosity",
        hooks: [
          "The secret oceanfront VIP getaway nobody told you about.",
          "I wish I knew about Carmen Hotel before booking overpriced resorts.",
          "The boutique luxury escape everyone is booking this month.",
          "How to get a VIP suite at Carmen Hotel for the price of a standard room.",
        ],
        body: "Here is the ultimate travel secret: Carmen Hotel. Stunning beachfront suites, private rooftop infinity pool, and sunset champagne dining with zero crowded resort chaos. Book your VIP weekend package today at carmenhotel.com.",
      },
      ugc: {
        title: "Creator Property Tour",
        badge: "Trust",
        hooks: [
          "Come stay with me at Carmen Hotel: the ultimate oceanfront boutique.",
          "My honest review of Carmen Hotel after a weekend stay.",
          "Is Carmen Hotel actually worth the hype? Look at this rooftop view.",
          "Touring the most aesthetic beachfront suite in the Caribbean.",
        ],
        body: "We checked into Carmen Hotel for the weekend and the ocean views from the rooftop pool are unreal. Private cabanas, five-star dining, and direct beach access. Tap below to unlock their exclusive weekend VIP package.",
      },
      problem: {
        title: "Problem & Solution",
        badge: "Scale",
        hooks: [
          "Tired of crowded, noisy mega-resorts that ruin your vacation?",
          "The real reason standard hotel vacations leave you exhausted.",
          "Stop scrolling if you need a real, peaceful luxury escape.",
          "Why travelers are choosing boutique luxury over corporate hotel chains.",
        ],
        body: "Tired of chaotic mega-resorts with no privacy? Carmen Hotel gives you an intimate luxury beachfront haven with world-class personalized service. Reserve your VIP suite package at carmenhotel.com.",
      },
      listicle: {
        title: "3 Reasons Why",
        badge: "Clicks",
        hooks: [
          "3 reasons why Carmen Hotel is the #1 boutique stay this season.",
          "Reason #2 is why guests keep rebooking year after year.",
          "3 things that make Carmen Hotel completely different from big resorts.",
          "Why you need to book your next getaway at Carmen Hotel.",
        ],
        body: "Here are 3 reasons to visit Carmen Hotel: private rooftop infinity views, chef-curated coastal dining, and steps away from crystal-clear ocean waters. Reserve your suite at carmenhotel.com.",
      },
      founder: {
        title: "Behind the Scenes / Craft",
        badge: "Authenticity",
        hooks: [
          "Why we designed Carmen Hotel as an intimate boutique sanctuary.",
          "Behind the scenes of our rooftop oceanfront dining experience.",
          "The architectural design story behind Carmen Hotel.",
          "How Carmen Hotel delivers five-star luxury with boutique warmth.",
        ],
        body: "Carmen Hotel was built for travelers who cherish intimate luxury over crowded mass resorts. Experience the magic of oceanfront relaxation and book your stay at carmenhotel.com.",
      },
      fomo: {
        title: "Limited Promo & Urgency",
        badge: "Scarcity",
        hooks: [
          "Limited weekend VIP suite packages available at Carmen Hotel.",
          "Book your oceanfront escape today and receive VIP suite perks.",
          "Weekend dates are filling fast: claim your Carmen Hotel package.",
          "Exclusive VIP stay promotion: book directly and save 25%.",
        ],
        body: "Weekend availability is strictly limited. Reserve your luxury oceanfront suite at Carmen Hotel today at carmenhotel.com to unlock complimentary VIP perks.",
      },
    };
  }

  if (brand.toLowerCase().includes("dewpoint") || brand.toLowerCase().includes("skin") || brand.toLowerCase().includes("glow")) {
    return {
      ugc: {
        title: "Creator Glow Review",
        badge: "Trust",
        hooks: [
          "My honest 14-day skin barrier review with Dewpoint Skincare.",
          "I stopped wearing heavy foundation after using Dewpoint for a week.",
          "Here is what happened to my dry, irritated skin with Dewpoint.",
          "Is Dewpoint Skincare actually worth the hype? Let's check my skin barrier.",
        ],
        body: "I finally tested Dewpoint Skincare on my sensitive skin. The lightweight hydration barrier serum gave me an instant dewy glow without any greasy shine. Right now you can get 25% off their Hydration Duo at dewpointskincare.com.",
      },
      problem: {
        title: "Problem & Solution",
        badge: "Scale",
        hooks: [
          "Struggling with dry, flaky skin that makeup clings to?",
          "The real reason your skin barrier keeps breaking out and drying out.",
          "Stop scrolling if your skin feels tight and dull by 2 PM.",
          "Why heavy creams are actually clogging your pores instead of hydrating.",
        ],
        body: "Heavy creams sit on top of your skin and clog pores without real hydration. Dewpoint locks in deep 72-hour barrier repair with bio-identical ceramides and hyaluronic acid. Claim 25% off your duo today at dewpointskincare.com.",
      },
      listicle: {
        title: "3 Reasons Why",
        badge: "Clicks",
        hooks: [
          "3 reasons dermatologists and estheticians love Dewpoint Skincare.",
          "Reason #3 is why everyone with sensitive skin is switching to Dewpoint.",
          "3 signs your skin barrier is damaged and how Dewpoint fixes it.",
          "Why this clean hydration duo sells out every restock.",
        ],
        body: "Here is why Dewpoint stands out: clean clinical actives, zero pore-clogging fillers, and verified barrier repair in 7 days. Grab 25% off the Hydration Duo at dewpointskincare.com.",
      },
      hack: {
        title: "Secret Glow Hack",
        badge: "Curiosity",
        hooks: [
          "The morning glow hack that replaced my 7-step skincare routine.",
          "I wish I stopped over-complicating my skincare years ago.",
          "The single barrier serum that transformed my morning skin routine.",
          "How to get glass skin all day without sticky residue.",
        ],
        body: "Here is the shortcut to glass skin: Dewpoint Hydration Duo. Just two simple steps to lock in pure dewy moisture that lasts all day long. Claim 25% off before this promotion ends at dewpointskincare.com.",
      },
      founder: {
        title: "Behind the Scenes / Craft",
        badge: "Authenticity",
        hooks: [
          "Why we formulated Dewpoint to heal the skin barrier naturally.",
          "Behind the scenes in our clinical clean skincare lab.",
          "We spent two years perfecting the Dewpoint hydration ratio.",
          "What clean skincare actually means to the Dewpoint founders.",
        ],
        body: "We created Dewpoint because skincare aisles were packed with irritating fragrances and filler oils. Dewpoint gives your barrier exactly what it needs to heal and glow. Discover yours at dewpointskincare.com.",
      },
      fomo: {
        title: "Limited Promo & Urgency",
        badge: "Scarcity",
        hooks: [
          "Claim 25% off the Dewpoint Hydration Duo before this batch sells out.",
          "Restock alert: 25% off the viral Dewpoint Skincare duo today.",
          "Don't let dry skin ruin your glow: 25% off Dewpoint right now.",
          "Limited batch available: claim your Dewpoint discount today.",
        ],
        body: "Our previous batch sold out in 48 hours. Grab 25% off the Dewpoint Hydration Duo today at dewpointskincare.com while current inventory lasts.",
      },
    };
  }
  if (brand.toLowerCase().includes("ai recommend") || brand.toLowerCase().includes("relaunch")) {
    return {
      problem: {
        title: "Problem & Solution (Lock Screen)",
        badge: "Scale",
        hooks: [
          "Your next customer just asked AI who to call.",
          "If AI doesn't know your business, you lose customers you never see.",
          "Stop scrolling if you own a local service business.",
          "What happens when your customers ask ChatGPT who to hire?",
        ],
        body: "Your next customer just asked AI who to call. If AI doesn't have a clear picture of your business, someone else gets the call. ReLaunch fixes what AI reads about you so you get recommended first. Claim your free audit today at relaunch.us/ai-recommendations.",
      },
      comparison: {
        title: "Us vs. Them (10 vs 3)",
        badge: "Conversions",
        hooks: [
          "Search gave them 10 choices. AI gives them 3.",
          "Make sure one of those 3 AI recommendations is you.",
          "Traditional Google search vs AI search: look at what changed.",
          "Why 90% of local businesses are invisible on AI search.",
        ],
        body: "Traditional search gave customers 10 choices. AI gives them only 3. If AI has mixed-up or missing info on your business, it recommends your competitor. ReLaunch ensures you win the top 3 spots. Go to relaunch.us/ai-recommendations.",
      },
      ugc: {
        title: "Audit Checklist (Live Scan)",
        badge: "Trust",
        hooks: [
          "AI is reading about your business right now.",
          "Here is what AI actually found about your business listings.",
          "Missing or mixed-up info? AI recommends someone else.",
          "We ran an AI audit on 50 local businesses: here are the results.",
        ],
        body: "AI is reading your Google listing, Yelp profile, hours, and reviews right now. Missing or inconsistent info causes it to recommend someone else. We fix what AI reads about you at relaunch.us/ai-recommendations.",
      },
      hack: {
        title: "Secret Life Hack (Silent Decision)",
        badge: "Curiosity",
        hooks: [
          "AI is quietly deciding who gets the customer.",
          "Who's the best contractor in Phoenix? AI is answering right now.",
          "The single biggest shift in local search since Google Maps.",
          "If you want more calls this month, you need to fix your AI profile.",
        ],
        body: "AI assistants like ChatGPT and Siri are quietly deciding who gets the customer every single day. If you don't have verified AI visibility, you lose calls you never even see. Visit relaunch.us/ai-recommendations today.",
      },
      listicle: {
        title: "3 Reasons Why",
        badge: "Clicks",
        hooks: [
          "3 reasons your business isn't showing up on AI search.",
          "Why traditional SEO doesn't work for ChatGPT or Siri.",
          "3 facts about AI recommendations that local businesses ignore.",
          "How to get recommended by AI in 3 simple steps.",
        ],
        body: "Here is why businesses lose customers to AI: outdated directory listings, inconsistent hours, and zero generative engine optimization. ReLaunch fixes all three. Claim your free audit at relaunch.us/ai-recommendations.",
      },
      founder: {
        title: "Behind the Scenes / Craft",
        badge: "Authenticity",
        hooks: [
          "Why we built ReLaunch to fix AI search visibility.",
          "Behind the scenes of how AI assistants pick top local businesses.",
          "We got tired of great businesses losing calls to outdated AI info.",
          "What actually goes into ranking #1 on ChatGPT and Gemini.",
        ],
        body: "We created ReLaunch because AI search is completely replacing old-school Google results. We ensure your business is accurately indexed, verified, and recommended. Get started at relaunch.us/ai-recommendations.",
      },
      fomo: {
        title: "Limited Promo & Urgency",
        badge: "Scarcity",
        hooks: [
          "Claim your free AI search audit before your competitors do.",
          "Is your business being recommended by AI right now? Find out free.",
          "Alert: AI search is replacing traditional Google results.",
          "Don't let competitors take the top 3 spots on AI assistants.",
        ],
        body: "Don't lose customers you never even see. Claim your free AI search visibility audit today at relaunch.us/ai-recommendations before this limited promotion ends.",
      },
    };
  }


  return {
    problem: {
      title: "Problem & Solution",
      badge: "Scale",
      hooks: [
        `Stop scrolling if you're looking for the best in ${brand}.`,
        `The real reason most standard options leave you disappointed.`,
        `If you haven't experienced ${brand} yet, you're missing out.`,
        `Why everyone is switching to ${brand} right now.`,
      ],
      body: `Tired of standard options that don't deliver? ${brand} gives you genuine premium quality with zero compromises. Claim ${cta} today and see the difference immediately.`,
    },
    ugc: {
      title: "Creator Review",
      badge: "Trust",
      hooks: [
        `My honest review of ${brand} after testing it myself.`,
        `I was skeptical about ${brand} until I saw the difference in person.`,
        `Here's why ${brand} is taking over everyone's feed this week.`,
        `If you're considering ${brand}, here is what you need to know.`,
      ],
      body: `I finally tried ${brand} for myself. The quality is truly next-level, and right now you can get ${cta}. Tap below to grab this offer.`,
    },
    listicle: {
      title: "3 Reasons Why",
      badge: "Clicks",
      hooks: [
        `3 reasons why everyone is obsessed with ${brand}.`,
        `Reason number 3 is why you will never go back to standard alternatives.`,
        `Before you make a decision today, check these 3 facts about ${brand}.`,
        `3 signs you've found the highest-performing option on the market.`,
      ],
      body: `Here are 3 reasons why ${brand} stands out: unmatched quality, verified results, and an exclusive deal. Unlock ${cta} right now before it expires.`,
    },
    comparison: {
      title: "Us vs. Them",
      badge: "Conversions",
      hooks: [
        `Standard alternatives vs. ${brand}: let's compare them side by side.`,
        `Don't settle for outdated options when ${brand} is right here.`,
        `Can you spot the difference with ${brand}? Look closely.`,
        `The honest truth about why ${brand} outperforms traditional brands.`,
      ],
      body: `Generic alternatives cut corners and overcharge. With ${brand}, you get genuine premium standards and fast service. Claim ${cta} today.`,
    },
    hack: {
      title: "Secret Life Hack",
      badge: "Curiosity",
      hooks: [
        `The insider shortcut about ${brand} you need to know.`,
        `I wish I discovered this about ${brand} months ago.`,
        `The single discovery that changed everything: ${brand}.`,
        `Stop doing it the hard way when ${brand} is right here.`,
      ],
      body: `Here is the hack that saved us so much time: ${brand}. While others stick with outdated methods, this delivers immediately. Claim ${cta} before it ends.`,
    },
    founder: {
      title: "Behind the Scenes / Craft",
      badge: "Authenticity",
      hooks: [
        `Why we built ${brand} completely differently from everyone else.`,
        `Behind the scenes of how we deliver excellence at ${brand}.`,
        `We got tired of generic options, so we created ${brand}.`,
        `What actually goes into making ${brand} worth every dollar.`,
      ],
      body: `We started ${brand} because standard options cut every corner. We wanted true quality and real accountability. Experience it today with ${cta}.`,
    },
    fomo: {
      title: "Limited Promo & Urgency",
      badge: "Scarcity",
      hooks: [
        `Do not scroll past this without claiming ${cta} at ${brand}.`,
        `This exclusive offer from ${brand} is strictly running this week.`,
        `The fastest way to unlock ${cta} before it sells out.`,
        `Alert: ${brand} just released their highest-value promo yet.`,
      ],
      body: `Demand is surging and this special drop is strictly limited. Don't miss out on ${cta} at ${brand}. Tap the link now before this offer closes.`,
    },
  };
}

// Dynamic real-time subtitle synchronizer: Splits full speech into clean, sequential phrases without awkward character truncation
function getActiveCaption(
  currentTime: number,
  hookText: string,
  scriptBody: string,
  brandOffer: string
): { text: string; words: string[]; activeWord: string; phase: "hook" | "body" | "cta" } {
  let text = "";
  let phase: "hook" | "body" | "cta" = "body";
  let windowStart = 0;
  let windowEnd = 22;

  // 1. Hook Phase: 0.0s – 3.5s
  if (currentTime < 3.5) {
    text = hookText || "Stop scrolling & check this out";
    phase = "hook";
    windowStart = 0;
    windowEnd = 3.5;
  } else {
    // 2. Commercial Body: Split script into natural sentences
    const rawSentences = (scriptBody || "")
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const sentences = rawSentences.length > 0 ? rawSentences : [scriptBody || ""];

    if (sentences.length === 1) {
      text = sentences[0];
      phase = "body";
      windowStart = 3.5;
      windowEnd = 22;
    } else if (sentences.length === 2) {
      if (currentTime < 11.0) {
        text = sentences[0];
        phase = "body";
        windowStart = 3.5;
        windowEnd = 11.0;
      } else {
        text = sentences[1];
        phase = "cta";
        windowStart = 11.0;
        windowEnd = 22.0;
      }
    } else {
      // 3 or more sentences
      if (currentTime < 9.0) {
        text = sentences[0];
        phase = "body";
        windowStart = 3.5;
        windowEnd = 9.0;
      } else if (currentTime < 15.0) {
        text = sentences[1];
        phase = "body";
        windowStart = 9.0;
        windowEnd = 15.0;
      } else {
        text = sentences.slice(2).join(" ");
        phase = "cta";
        windowStart = 15.0;
        windowEnd = 22.0;
      }
    }
  }

  const words = text.split(/\s+/).filter(Boolean);
  const duration = Math.max(0.1, windowEnd - windowStart);
  const elapsed = Math.max(0, currentTime - windowStart);
  const wordIndex = Math.min(
    words.length - 1,
    Math.floor((elapsed / duration) * (words.length || 1))
  );
  const activeWord = words[Math.max(0, wordIndex)] || "";

  return {
    text,
    words,
    activeWord,
    phase,
  };
}


export default function StudioVideoGenerator() {
  // Brand & Campaign Setup State
  const [selectedPresetId, setSelectedPresetId] = useState<string>("chicago-dog-42");
  const [brandName, setBrandName] = useState("Chicago Dog 42");
  const [brandOffer, setBrandOffer] = useState("$5 Off First Jumbo Combo");
  const [presetDropdownOpen, setPresetDropdownOpen] = useState(false);
  const presetDropdownRef = useRef<HTMLDivElement>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const elapsedTimerRef = useRef<any>(null);

  // Creative Angle & Copy
  const [selectedAngle, setSelectedAngle] = useState<string>("problem");
  const [angleDropdownOpen, setAngleDropdownOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState<string>("tyler");
  const [selectedCreatorAssetId, setSelectedCreatorAssetId] = useState<string>("tyler-hook-01");
  const [trimStart, setTrimStart] = useState<number>(0.2);
  const [trimEnd, setTrimEnd] = useState<number>(3.8);
  const [assetTab, setAssetTab] = useState<"hooks" | "broll">("hooks");
  const [creatorDropdownOpen, setCreatorDropdownOpen] = useState(false);
  const [videoModel, setVideoModel] = useState<"kling" | "grok" | "seedance">("kling");
  const [availableVoices, setAvailableVoices] = useState<StudioVoice[]>(DEFAULT_STUDIO_VOICES);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("pNInz6obpgDQGcFmaJgB");
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);
  const [showVoiceBalanceModal, setShowVoiceBalanceModal] = useState<boolean>(false);
  const [pendingBatchMode, setPendingBatchMode] = useState<boolean>(false);

  // Quality-First Creative Studio State (Sprint 2 Architecture)
  const [musicLibrary, setMusicLibrary] = useState<MusicTrack[]>(LICENSED_MUSIC_LIBRARY);
  const [ctaTemplatesList, setCtaTemplatesList] = useState<CtaTemplate[]>(BRANDED_CTA_TEMPLATES);
  const [captionStylesList, setCaptionStylesList] = useState<CaptionStyle[]>(CAPTION_STYLES);
  const [showMasterAssetsModal, setShowMasterAssetsModal] = useState<boolean>(false);
  const [masterAssetModalTab, setMasterAssetModalTab] = useState<"music" | "cta">("music");
  const [selectedMusicTrackId, setSelectedMusicTrackId] = useState<string>("energy-direct-response");
  const [selectedCaptionStyle, setSelectedCaptionStyle] = useState<string>("bold-kinetic");
  const [selectedCtaTemplate, setSelectedCtaTemplate] = useState<string>("promo-stamp");
  const [aiGapFillMode, setAiGapFillMode] = useState<boolean>(false);
  const [sceneOrder, setSceneOrder] = useState<number[]>([1, 2, 3, 4]); // 1: Hook, 2: Product Demo, 3: B-Roll, 4: Motion CTA
  const [scene2AiGapFill, setScene2AiGapFill] = useState<boolean>(false);
  const [scene3AiGapFill, setScene3AiGapFill] = useState<boolean>(false);
  const [scene2TrimStart, setScene2TrimStart] = useState<number>(0.0);
  const [scene2TrimEnd, setScene2TrimEnd] = useState<number>(6.0);
  const [scene3TrimStart, setScene3TrimStart] = useState<number>(0.0);
  const [scene3TrimEnd, setScene3TrimEnd] = useState<number>(6.0);
  const [activeEditingScene, setActiveEditingScene] = useState<number | null>(null);
  const [ctaBrandColor, setCtaBrandColor] = useState<string>("#FF6700");
  const [ctaDiscountTag, setCtaDiscountTag] = useState<string>("EXCLUSIVE OFFER");
  const [selectedTrustBadgeId, setSelectedTrustBadgeId] = useState<string>("30-day-guarantee");
  const [claimSubstantiation, setClaimSubstantiation] = useState<string>("Verified Client Policy");
  const [musicPlayingId, setMusicPlayingId] = useState<string | null>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);

  // Space-Saver Accordion & Compact UI State
  const [step1Open, setStep1Open] = useState(true);
  const [step2Open, setStep2Open] = useState(true);
  const [step3Open, setStep3Open] = useState(true);
  const [step4Open, setStep4Open] = useState(false);
  const [showVisualPrompt, setShowVisualPrompt] = useState(false);
  const [showTrimmer, setShowTrimmer] = useState(false);
  const [timelineExpanded, setTimelineExpanded] = useState(false); // Collapsed by default into compact strip to save vertical space
  const [activeScrubScene, setActiveScrubScene] = useState<number | null>(null);

  const togglePreviewMusic = (track: MusicTrack) => {
    if (musicPlayingId === track.id) {
      if (musicAudioRef.current) {
        musicAudioRef.current.pause();
      }
      setMusicPlayingId(null);
    } else {
      if (!musicAudioRef.current) {
        musicAudioRef.current = new Audio();
      }
      musicAudioRef.current.pause();
      musicAudioRef.current.src = track.src;
      musicAudioRef.current.volume = 0.5;
      musicAudioRef.current.onended = () => {
        setMusicPlayingId(null);
      };
      musicAudioRef.current.play().then(() => {
        setMusicPlayingId(track.id);
      }).catch((err) => {
        console.warn("Audio preview playback prevented or failed:", err);
        setMusicPlayingId(null);
      });
      setSelectedMusicTrackId(track.id);
    }
  };

  const [draggedSceneIdx, setDraggedSceneIdx] = useState<number | null>(null);
  const [dragOverSceneIdx, setDragOverSceneIdx] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSceneIdx(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", index.toString());
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverSceneIdx !== index) {
      setDragOverSceneIdx(index);
    }
  };

  const handleDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    if (draggedSceneIdx !== null && draggedSceneIdx !== targetIndex) {
      setSceneOrder((prev) => {
        const next = [...prev];
        const [movedItem] = next.splice(draggedSceneIdx, 1);
        next.splice(targetIndex, 0, movedItem);
        return next;
      });
    }
    setDraggedSceneIdx(null);
    setDragOverSceneIdx(null);
  };

  const handleDragEnd = () => {
    setDraggedSceneIdx(null);
    setDragOverSceneIdx(null);
  };

  const moveScene = (index: number, direction: "left" | "right") => {
    setSceneOrder((prev) => {
      const newOrder = [...prev];
      const targetIndex = direction === "left" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newOrder.length) return prev;
      const temp = newOrder[index];
      newOrder[index] = newOrder[targetIndex];
      newOrder[targetIndex] = temp;
      return newOrder;
    });
  };

  const angleDataMap = useMemo(() => getAngleContent(brandName, brandOffer), [brandName, brandOffer]);

  // Helper to safely resolve any angle key, slug, or title to a valid angleDataMap key
  const resolveAngleKey = useCallback((input: string | null | undefined, dataMap: Record<string, AngleContent>): string => {
    if (!input) return "problem";
    const trimmed = input.trim();
    if (dataMap[trimmed]) return trimmed;

    const lower = trimmed.toLowerCase();
    const directKey = Object.keys(dataMap).find((k) => k.toLowerCase() === lower);
    if (directKey) return directKey;

    const entry = Object.entries(dataMap).find(([k, v]) => {
      const t = v.title.toLowerCase();
      return (
        t === lower ||
        t.includes(lower) ||
        lower.includes(t) ||
        (lower.includes("problem") && k === "problem") ||
        (lower.includes("comparison") && k === "comparison") ||
        (lower.includes("10 vs 3") && k === "comparison") ||
        (lower.includes("vs") && k === "comparison") ||
        (lower.includes("ugc") && k === "ugc") ||
        (lower.includes("audit") && k === "ugc") ||
        (lower.includes("checklist") && k === "ugc") ||
        (lower.includes("review") && k === "ugc") ||
        (lower.includes("hack") && k === "hack") ||
        (lower.includes("listicle") && k === "listicle") ||
        (lower.includes("reasons") && k === "listicle") ||
        (lower.includes("founder") && k === "founder") ||
        (lower.includes("fomo") && k === "fomo") ||
        (lower.includes("urgency") && k === "fomo") ||
        (lower.includes("promo") && k === "fomo")
      );
    });
    return entry ? entry[0] : (Object.keys(dataMap)[0] || "problem");
  }, []);

  const currentAngleData = useMemo(() => {
    if (angleDataMap[selectedAngle]) {
      return angleDataMap[selectedAngle];
    }
    const matchedKey = resolveAngleKey(selectedAngle, angleDataMap);
    if (angleDataMap[matchedKey]) {
      return angleDataMap[matchedKey];
    }
    return angleDataMap["problem"] || Object.values(angleDataMap)[0] || {
      title: "Problem & Solution",
      badge: "Scale",
      hooks: ["Your next customer just asked AI who to call."],
      body: "Claim your free AI audit today.",
    };
  }, [angleDataMap, selectedAngle, resolveAngleKey]);

  const [selectedHook, setSelectedHook] = useState(currentAngleData?.hooks?.[0] || "");
  const [scriptBody, setScriptBody] = useState(currentAngleData?.body || "");
  const [isEditingHook, setIsEditingHook] = useState(false);

  // Product Media State (Supports BOTH Video & Image)
  interface UploadedImageItem {
    id: string;
    src: string;
    name: string;
    size: string;
    base64: string;
  }

  const [uploadedImages, setUploadedImages] = useState<UploadedImageItem[]>([]);
  const [uploadedMediaSrc, setUploadedMediaSrc] = useState<string | null>(null);
  const [uploadedMediaName, setUploadedMediaName] = useState<string | null>(null);
  const [uploadedMediaSize, setUploadedMediaSize] = useState<string | null>(null);
  const [uploadedMediaBase64, setUploadedMediaBase64] = useState<string | null>(null);
  const [uploadedMediaType, setUploadedMediaType] = useState<"video" | "image" | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [visualPrompt, setVisualPrompt] = useState<string>("");

  const [softLabelDisclosure, setSoftLabelDisclosure] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dynamic UGC Creator Roster & Assets State (supports un-hardcoded creators like Jeo)
  const [dynamicRoster, setDynamicRoster] = useState<CreatorProfile[]>(CREATOR_ROSTER);
  const [dynamicAssets, setDynamicAssets] = useState<CreatorClipAsset[]>(CREATOR_ASSETS);

  // Dropdown States
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);
  const [footageDropdownOpen, setFootageDropdownOpen] = useState(false);

  // Load custom creators & assets from API
  useEffect(() => {
    fetch("/api/studio/creators")
      .then((res) => res.json())
      .then((data) => {
        if (data.roster && Array.isArray(data.roster)) setDynamicRoster(data.roster);
        if (data.assets && Array.isArray(data.assets)) setDynamicAssets(data.assets);
      })
      .catch((err) => console.warn("Could not load dynamic creators in generator:", err));

    fetch("/api/studio/timeline-assets")
      .then((res) => res.json())
      .then((data) => {
        if (data.musicTracks && Array.isArray(data.musicTracks)) setMusicLibrary(data.musicTracks);
        if (data.ctaTemplates && Array.isArray(data.ctaTemplates)) setCtaTemplatesList(data.ctaTemplates);
      })
      .catch((err) => console.warn("Could not load dynamic timeline assets in generator:", err));
  }, []);

  const activeCreatorAsset = useMemo(() => {
    if (!selectedCreatorAssetId) return null;
    return dynamicAssets.find((a) => a.id === selectedCreatorAssetId) || getCreatorClipById(selectedCreatorAssetId) || null;
  }, [dynamicAssets, selectedCreatorAssetId]);

  const creatorHooksList = useMemo(() => {
    const list = dynamicAssets.filter((a) => a.creatorId === selectedActor && a.type === "hook");
    return list.length > 0 ? list : getCreatorClips(selectedActor, "hook");
  }, [dynamicAssets, selectedActor]);

  const creatorBrollList = useMemo(() => {
    const list = dynamicAssets.filter((a) => a.creatorId === selectedActor && a.type === "broll");
    return list.length > 0 ? list : getCreatorClips(selectedActor, "broll");
  }, [dynamicAssets, selectedActor]);

  // Generation & Player State
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStepText, setGenStepText] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "1:1" | "4:5">("9:16");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showPhoneFrame, setShowPhoneFrame] = useState(false);
  const [showCaptions, setShowCaptions] = useState(true);
  const [mobileTab, setMobileTab] = useState<"controls" | "preview">("controls");
  const [generationMode, setGenerationMode] = useState<"single" | "batch">("single");
  const [batchJobsCreated, setBatchJobsCreated] = useState<any[] | null>(null);
  const [generationError, setGenerationError] = useState<{
    title: string;
    message: string;
    balanceExhausted?: boolean;
    billingUrl?: string;
  } | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    jobId: string;
    variants: { v9x16: string; v1x1: string; v4x5: string; thumbnail: string };
    creator?: { id: string; name: string; handle: string; hookClipUrl: string };
    clientMedia?: { url: string; urls?: string[]; count?: number; type: "image" | "video"; name: string };
    voiceover?: {
      url: string;
      wordCount: number;
      wordTimestamps?: Array<{ word: string; start: number; end: number }>;
      voiceId?: string;
    };
    aiVideo?: { isGenerated: boolean; provider: string; clipUrl?: string };
    brandName?: string;
    brandOffer?: string;
    hookText?: string;
    scriptBody?: string;
    video4k?: string;
    videoClean?: string;
    stems?: { voiceover?: string; music?: string };
  } | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const creatorVideoRef = useRef<HTMLVideoElement>(null);
  const angleDropdownRef = useRef<HTMLDivElement>(null);
  const creatorDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const voiceDropdownRef = useRef<HTMLDivElement>(null);
  const footageDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const [draftRestored, setDraftRestored] = useState(false);
  const [hasLoadedDraft, setHasLoadedDraft] = useState(false);
  const [revisionContext, setRevisionContext] = useState<{ revisionId: string; notes: string; brand: string } | null>(null);
  const hasHydratedDraftRef = useRef(false);
  const isHydratingInitialStateRef = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentClientJobIdRef = useRef<string | null>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Estimated total generation seconds based on model & uploaded images
  const estimatedTotalSeconds = useMemo(() => {
    let base = 120; // default for Kling text-to-video
    if (uploadedImages.length > 0) base = 75; // image-to-video
    if (videoModel === "seedance") base = 30;
    if (videoModel === "grok") base = 45;
    if (generationMode === "batch") base = Math.round(base * 1.35);
    return base;
  }, [uploadedImages.length, videoModel, generationMode]);

  const etaSecondsRemaining = Math.max(5, estimatedTotalSeconds - elapsedSeconds);
  const etaFormatted =
    etaSecondsRemaining >= 60
      ? `~${Math.floor(etaSecondsRemaining / 60)}m ${etaSecondsRemaining % 60}s remaining`
      : `~${etaSecondsRemaining}s remaining`;

  // Interactive Loader Micro-Interactions (Sparks)
  const [sparkCount, setSparkCount] = useState(0);

  // Restore draft from localStorage on initial client mount
  useEffect(() => {
    if (hasHydratedDraftRef.current) return;
    hasHydratedDraftRef.current = true;

    try {
      const saved = typeof window !== "undefined" ? localStorage.getItem("relaunch_studio_generator_draft") : null;
      let initBrand = "Chicago Dog 42";
      let initOffer = "15% off first pickup order";

      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.brandName) {
          initBrand = parsed.brandName;
          setBrandName(parsed.brandName);
        }
        if (parsed.brandOffer) {
          initOffer = parsed.brandOffer;
          setBrandOffer(parsed.brandOffer);
        }
        if (parsed.selectedPresetId) setSelectedPresetId(parsed.selectedPresetId);
        if (parsed.selectedActor) setSelectedActor(parsed.selectedActor);
        if (parsed.selectedCreatorAssetId) setSelectedCreatorAssetId(parsed.selectedCreatorAssetId);
        if (typeof parsed.trimStart === "number") setTrimStart(parsed.trimStart);
        if (typeof parsed.trimEnd === "number") setTrimEnd(parsed.trimEnd);
        if (parsed.videoModel) setVideoModel(parsed.videoModel);
        if (parsed.selectedVoiceId) setSelectedVoiceId(parsed.selectedVoiceId);
        if (parsed.selectedHook) setSelectedHook(parsed.selectedHook);
        if (parsed.scriptBody) setScriptBody(parsed.scriptBody);
        if (parsed.selectedAngle) {
          const map = getAngleContent(initBrand, initOffer);
          setSelectedAngle(resolveAngleKey(parsed.selectedAngle, map));
        }
        setDraftRestored(true);
      }

      if (typeof window !== "undefined") {
        const params = new URLSearchParams(window.location.search);
        const qRevId = params.get("revisionId");
        const qNotes = params.get("notes");
        const qBrand = params.get("brand");
        const qHook = params.get("hook");
        const qScript = params.get("script");
        const qOffer = params.get("offer");
        const qAngle = params.get("angle");
        const qActor = params.get("actor");
        const qMusicTrack = params.get("musicTrack");
        const qCtaId = params.get("ctaId");

        if (qMusicTrack) setSelectedMusicTrackId(qMusicTrack);
        if (qCtaId) setSelectedCtaTemplate(qCtaId);

        if (qRevId || qNotes) {
          if (qBrand) {
            initBrand = qBrand;
            setBrandName(qBrand);
          }
          if (qOffer) {
            initOffer = qOffer;
            setBrandOffer(qOffer);
          }
          if (qActor) setSelectedActor(qActor);
          if (qAngle) {
            const map = getAngleContent(initBrand, initOffer);
            setSelectedAngle(resolveAngleKey(qAngle, map));
          }
          if (qHook) setSelectedHook(qHook);
          if (qScript) setScriptBody(qScript);
          setRevisionContext({
            revisionId: qRevId || "REV-01",
            notes: qNotes || "Reviewer requested adjustments to this ad.",
            brand: qBrand || "Client Ad",
          });
        }
      }
    } catch (e) {
      // ignore parse errors
    } finally {
      setHasLoadedDraft(true);
      isHydratingInitialStateRef.current = false;
    }
  }, [resolveAngleKey]);

  // Debounced auto-save to localStorage
  useEffect(() => {
    if (!hasLoadedDraft) return;
    const timer = setTimeout(() => {
      try {
        const stateToSave = {
          selectedPresetId,
          brandName,
          brandOffer,
          selectedAngle,
          selectedActor,
          selectedCreatorAssetId,
          trimStart,
          trimEnd,
          videoModel,
          selectedVoiceId,
          selectedHook,
          scriptBody,
          updatedAt: Date.now(),
        };
        localStorage.setItem("relaunch_studio_generator_draft", JSON.stringify(stateToSave));
      } catch (e) {
        // ignore quota errors
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [
    hasLoadedDraft,
    selectedPresetId,
    brandName,
    brandOffer,
    selectedAngle,
    selectedActor,
    selectedCreatorAssetId,
    trimStart,
    trimEnd,
    videoModel,
    selectedVoiceId,
    selectedHook,
    scriptBody,
  ]);

  const handleResetDraft = () => {
    try {
      localStorage.removeItem("relaunch_studio_generator_draft");
    } catch (e) { }
    setSelectedPresetId("chicago-dog");
    setBrandName("Chicago Dog 42");
    setBrandOffer("15% off first pickup order");
    setSelectedAngle("problem");
    setSelectedActor("tyler");
    setSelectedCreatorAssetId("tyler-hook-01");
    setTrimStart(0.2);
    setTrimEnd(3.8);
    setVideoModel("kling");
    setDraftRestored(false);
  };

  const activeCreator = useMemo(() => {
    return dynamicRoster.find((c) => c.actorPresetId === selectedActor) || dynamicRoster[0] || CREATOR_ROSTER[0];
  }, [dynamicRoster, selectedActor]);

  const activeVoice = useMemo(() => {
    return availableVoices.find((v) => v.id === selectedVoiceId) || availableVoices[0] || DEFAULT_STUDIO_VOICES[0];
  }, [availableVoices, selectedVoiceId]);

  // Dynamically fetch live voices from client's ElevenLabs account
  useEffect(() => {
    let isMounted = true;
    async function loadLiveVoices() {
      setIsLoadingVoices(true);
      try {
        const res = await fetch("/api/studio/voices");
        if (res.ok) {
          const data = await res.json();
          if (isMounted && data.voices && data.voices.length > 0) {
            setAvailableVoices(data.voices);
            if (!data.voices.some((v: any) => v.id === selectedVoiceId)) {
              setSelectedVoiceId(data.voices[0].id);
            }
          }
        }
      } catch (err) {
        console.warn("[Studio] Could not load live ElevenLabs voices, using presets:", err);
      } finally {
        if (isMounted) setIsLoadingVoices(false);
      }
    }
    loadLiveVoices();
    return () => {
      isMounted = false;
    };
  }, []);

  // Auto-resize script textarea so it never clips or creates trapped inner scroll
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(68, textareaRef.current.scrollHeight)}px`;
    }
  }, [scriptBody]);

  // Seamless wheel scroll handler so rolling over script smoothly scrolls the sidebar
  const handleScriptWheel = (e: React.WheelEvent) => {
    if (sidebarRef.current && sidebarRef.current.scrollHeight > sidebarRef.current.clientHeight) {
      sidebarRef.current.scrollTop += e.deltaY;
    } else {
      window.scrollBy({ top: e.deltaY });
    }
  };

  // Determine active video source (strictly real generated result or uploaded user video — ZERO demo video fallback)
  const activeVideoSrc = generatedResult
    ? (aspectRatio === "9:16"
      ? generatedResult.variants.v9x16
      : aspectRatio === "1:1"
        ? generatedResult.variants.v1x1
        : generatedResult.variants.v4x5)
    : (uploadedMediaType === "video" ? uploadedMediaSrc : null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (presetDropdownRef.current && !presetDropdownRef.current.contains(event.target as Node)) {
        setPresetDropdownOpen(false);
      }
      if (angleDropdownRef.current && !angleDropdownRef.current.contains(event.target as Node)) {
        setAngleDropdownOpen(false);
      }
      if (creatorDropdownRef.current && !creatorDropdownRef.current.contains(event.target as Node)) {
        setCreatorDropdownOpen(false);
      }
      if (modelDropdownRef.current && !modelDropdownRef.current.contains(event.target as Node)) {
        setModelDropdownOpen(false);
      }
      if (voiceDropdownRef.current && !voiceDropdownRef.current.contains(event.target as Node)) {
        setVoiceDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Update hook & body when angle or brand details change
  useEffect(() => {
    if (isHydratingInitialStateRef.current) return;
    const angleObj = currentAngleData;
    if (angleObj) {
      setSelectedHook(angleObj.hooks[0] || "");
      setScriptBody(angleObj.body || "");
      setIsEditingHook(false);
    }
  }, [selectedAngle, currentAngleData]);

  // Handle Preset Switching
  const handleSelectPreset = (preset: BrandPreset) => {
    setSelectedPresetId(preset.id);
    setBrandName(preset.brandName);
    setBrandOffer(preset.brandOffer);
    setPresetDropdownOpen(false);

    // Clear revision banner & clean URL query params so preset takes full precedence
    setRevisionContext(null);
    if (typeof window !== "undefined" && window.location.search) {
      window.history.replaceState({}, "", window.location.pathname);
    }

    // Set angle to preset's angle and populate hook/body from the new brand content
    const targetAngle = preset.angleKey || "problem";
    const newAngleMap = getAngleContent(preset.brandName, preset.brandOffer);
    const targetAngleContent = newAngleMap[targetAngle] || newAngleMap["problem"] || Object.values(newAngleMap)[0];
    setSelectedAngle(targetAngle);
    if (targetAngleContent) {
      setSelectedHook(targetAngleContent.hooks[0] || "");
      setScriptBody(targetAngleContent.body || "");
      setIsEditingHook(false);
    }

    // Set visual prompt from preset
    setVisualPrompt(preset.visualPrompt || "");

    // Quality-First Architecture: Populate Real Product & B-Roll Assets from Preset
    if (preset.productVideo) {
      setUploadedMediaSrc(preset.productVideo);
      setUploadedMediaName(`${preset.name} Commercial Master`);
      setUploadedMediaType("video");
      setUploadedMediaBase64(null);
      setUploadedImages([]);
    } else {
      setUploadedImages([]);
      setUploadedMediaSrc(null);
      setUploadedMediaName(null);
      setUploadedMediaBase64(null);
      setUploadedMediaType(null);
    }

    if (preset.musicTrackId) {
      setSelectedMusicTrackId(preset.musicTrackId);
    }

    setGeneratedResult(null);
    setGenerationError(null);

    // Persist immediately to localStorage
    try {
      localStorage.setItem(
        "relaunch_studio_generator_draft",
        JSON.stringify({
          selectedPresetId: preset.id,
          brandName: preset.brandName,
          brandOffer: preset.brandOffer,
          selectedAngle: targetAngle,
          selectedActor,
          selectedCreatorAssetId,
          trimStart,
          trimEnd,
          videoModel,
          selectedVoiceId,
          selectedHook: targetAngleContent?.hooks[0] || "",
          scriptBody: targetAngleContent?.body || "",
          visualPrompt: preset.visualPrompt || "",
          updatedAt: Date.now(),
        })
      );
    } catch { }
  };

  // Clear Preset / Custom Brand Handler (Allows typing custom brand or opting out of preset)
  const handleClearPreset = () => {
    setSelectedPresetId("");
    setBrandName("");
    setBrandOffer("");
    setVisualPrompt("");
    setUploadedImages([]);
    setUploadedMediaSrc(null);
    setUploadedMediaName(null);
    setUploadedMediaType(null);
    setUploadedMediaBase64(null);
    setPresetDropdownOpen(false);
  };

  // Sync active video playback
  useEffect(() => {
    if (videoRef.current && activeVideoSrc) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [activeVideoSrc]);

  // Media Upload Handlers (supports up to 5 reference images or 1 video)
  const handleMediaFiles = (files: FileList | File[]) => {
    const fileArr = Array.from(files);
    if (fileArr.length === 0) return;

    // Check if video file selected
    const videoFile = fileArr.find((f) => f.type.startsWith("video/"));
    if (videoFile) {
      const objUrl = URL.createObjectURL(videoFile);
      setUploadedImages([]);
      setUploadedMediaSrc(objUrl);
      setUploadedMediaName(videoFile.name);
      setUploadedMediaSize((videoFile.size / (1024 * 1024)).toFixed(1) + " MB");
      setUploadedMediaType("video");
      setGeneratedResult(null);
      setGenerationError(null);

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          setUploadedMediaBase64(reader.result);
        }
      };
      reader.readAsDataURL(videoFile);
      return;
    }

    // Filter image files
    const imageFiles = fileArr.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length === 0) {
      alert("Please upload valid image files (.png, .jpg, .webp) or a video (.mp4, .mov).");
      return;
    }

    // Strict limit: maximum 5 images
    const MAX_IMAGES = 5;
    const remainingSlots = Math.max(0, MAX_IMAGES - uploadedImages.length);

    if (remainingSlots <= 0) {
      alert("You have already uploaded the maximum limit of 5 images. Remove an image to add another.");
      return;
    }

    const filesToAdd = imageFiles.slice(0, remainingSlots);
    if (imageFiles.length > remainingSlots) {
      alert(`Only ${remainingSlots} image(s) were added. The maximum limit is 5 reference images.`);
    }

    const newItems: UploadedImageItem[] = new Array(filesToAdd.length);
    let processed = 0;

    filesToAdd.forEach((file, index) => {
      const objUrl = URL.createObjectURL(file);
      const reader = new FileReader();
      reader.onload = () => {
        newItems[index] = {
          id: `img-${Date.now()}-${index}-${Math.random().toString(36).slice(2, 6)}`,
          src: objUrl,
          name: file.name,
          size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
          base64: typeof reader.result === "string" ? reader.result : "",
        };
        processed++;
        if (processed === filesToAdd.length) {
          setUploadedImages((prev) => {
            const combined = [...prev, ...newItems.filter(Boolean)].slice(0, 5);
            setUploadedMediaSrc(combined[0]?.src || null);
            setUploadedMediaName(combined.length > 1 ? `${combined.length} Reference Images` : (combined[0]?.name || null));
            setUploadedMediaSize(combined.reduce((sum, item) => sum + parseFloat(item.size || "0"), 0).toFixed(1) + " MB");
            setUploadedMediaBase64(combined[0]?.base64 || null);
            setUploadedMediaType("image");
            return combined;
          });
          setGeneratedResult(null);
          setGenerationError(null);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveImage = (idToRemove: string) => {
    setUploadedImages((prev) => {
      const updated = prev.filter((img) => img.id !== idToRemove);
      if (updated.length === 0) {
        setUploadedMediaSrc(null);
        setUploadedMediaName(null);
        setUploadedMediaSize(null);
        setUploadedMediaBase64(null);
        setUploadedMediaType(null);
      } else {
        setUploadedMediaSrc(updated[0]?.src || null);
        setUploadedMediaName(updated.length > 1 ? `${updated.length} Reference Images` : (updated[0]?.name || null));
        setUploadedMediaSize(updated.reduce((sum, item) => sum + parseFloat(item.size || "0"), 0).toFixed(1) + " MB");
        setUploadedMediaBase64(updated[0]?.base64 || null);
        setUploadedMediaType("image");
      }
      return updated;
    });
    setGeneratedResult(null);
  };

  const handleSetPrimaryImage = (id: string) => {
    setUploadedImages((prev) => {
      const index = prev.findIndex((img) => img.id === id);
      if (index <= 0) return prev;
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      copy.unshift(item);
      setUploadedMediaSrc(copy[0]?.src || null);
      setUploadedMediaBase64(copy[0]?.base64 || null);
      return copy;
    });
  };

  const handleClearAllMedia = () => {
    setUploadedImages([]);
    setUploadedMediaSrc(null);
    setUploadedMediaName(null);
    setUploadedMediaSize(null);
    setUploadedMediaBase64(null);
    setUploadedMediaType(null);
    setGeneratedResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Auto-generate high-converting Kling AI commercial prompt from script
  const handleAutoGenerateVisualPrompt = () => {
    const bName = brandName.trim() || "My Brand";
    const bLower = bName.toLowerCase();
    let baseAction = "";

    if (bLower.includes("dog") || bLower.includes("food") || bLower.includes("burger") || bLower.includes("restaurant") || bLower.includes("cafe")) {
      baseAction = `Mouth-watering commercial macro slow-motion showcase of appetizing gourmet food from ${bName}, fresh sizzling ingredients, vibrant restaurant ambiance, warm studio lighting, appetizing presentation`;
    } else if (bLower.includes("hotel") || bLower.includes("travel") || bLower.includes("resort") || bLower.includes("vacation")) {
      baseAction = `Luxury boutique travel commercial for ${bName}, sun-drenched private suite balcony overlooking tranquil ocean sunset, elegant golden hour lighting, 4K travel commercial cinematography`;
    } else if (bLower.includes("turf") || bLower.includes("golf") || bLower.includes("sport") || bLower.includes("apparel") || bLower.includes("fitness")) {
      baseAction = `Dynamic athletic performance showcase of ${bName} performance sportswear, athlete in fluid slow-motion motion outdoors on championship course, crisp morning light, 4K 60fps sports commercial`;
    } else if (bLower.includes("skin") || bLower.includes("beauty") || bLower.includes("glow") || bLower.includes("cream") || bLower.includes("lotion") || bLower.includes("dew")) {
      baseAction = `Modern clean beauty commercial for ${bName}, model applying nourishing product with healthy glowing skin in bright aesthetic bathroom, slow-motion water droplets, elegant macro bottle reveal`;
    } else if (bLower.includes("ai") || bLower.includes("search") || bLower.includes("software") || bLower.includes("app") || bLower.includes("tech") || bLower.includes("relaunch")) {
      baseAction = `Modern bright creative office studio, professional entrepreneur reviewing local business search growth on smartphone, screen showing clean abstract glowing data visualizations and connectivity network nodes with strictly NO text and NO words, crisp daylight, shallow depth of field, 4K commercial cinematography, 60fps`;
    } else {
      baseAction = `High-converting commercial advertising showcase for "${bName}", dynamic customer interaction with product, fluid camera orbit, vibrant studio lighting, 4K 60fps physical realism`;
    }

    const generated = uploadedMediaType === "image"
      ? `${baseAction}, featuring the product and visual identity shown in the reference image, seamless real-world interaction, cinematic camera motion, strictly no frozen frame, 4K commercial cinematography`
      : `${baseAction}, cinematic camera tracking shot, authentic commercial atmosphere, 4K 60fps`;

    setVisualPrompt(generated);
  };

  // Shuffle Hook
  const handleShuffleHook = () => {
    const hooks = currentAngleData?.hooks || [];
    if (!hooks.length) return;
    const currentIdx = hooks.indexOf(selectedHook);
    const nextIdx = (currentIdx + 1) % hooks.length;
    setSelectedHook(hooks[nextIdx]);
  };

  // Cancel generation handler
  const handleCancelGeneration = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }
    if (elapsedTimerRef.current) {
      clearInterval(elapsedTimerRef.current);
      elapsedTimerRef.current = null;
    }

    // Instantly notify server so background fal.ai polling loops abort immediately
    const activeJobId = currentClientJobIdRef.current;
    if (activeJobId) {
      fetch("/api/studio/generate?action=cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ clientJobId: activeJobId }),
      }).catch(() => {});
    }

    setIsGenerating(false);
    setGenProgress(0);
    setGenStepText("");
    setGenerationError({ title: "Generation Cancelled", message: "Video generation was cancelled by user." });
  };

  // Core generator executor
  const executeGenerate = async (
    asBatch = generationMode === "batch",
    overrideVoiceId?: string
  ) => {
    const effectiveVoiceId = overrideVoiceId || selectedVoiceId;
    setGenerationError(null);
    setIsGenerating(true);
    setMobileTab("preview");
    setGenProgress(10);
    setGenStepText(
      asBatch
        ? "Connecting to Studio Engine & preparing 5-angle campaign matrix..."
        : "Connecting to Studio Engine & analyzing creative brief..."
    );

    // Track unique client job ID for instant server cancellation
    const newClientJobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    currentClientJobIdRef.current = newClientJobId;

    // Track live elapsed time for dynamic ETA calculation
    setElapsedSeconds(0);
    const startSecTime = Date.now();
    if (elapsedTimerRef.current) clearInterval(elapsedTimerRef.current);
    elapsedTimerRef.current = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startSecTime) / 1000));
    }, 1000);

    // Create abort controller for this generation
    const controller = new AbortController();
    abortControllerRef.current = controller;

    // Smooth, realistic progress simulation matching real fal.ai & ElevenLabs execution (~70-85s)
    const progressInterval = setInterval(() => {
      setGenProgress((prev) => {
        if (prev < 25) {
          setGenStepText("Generating authentic creator voiceover via ElevenLabs...");
          return prev + 2;
        } else if (prev < 55) {
          setGenStepText("fal.ai Kling neural engine generating 1080p commercial motion frames...");
          return prev + 1.2;
        } else if (prev < 85) {
          setGenStepText("AI diffusion rendering dynamic product commercial reel in cloud...");
          return prev + 0.8;
        } else if (prev < 95) {
          setGenStepText(
            asBatch
              ? "Deriving 5 creative angles & compiling 15 aspect ratio deliverables..."
              : "Downloading generated 4K MP4 variant and assembling composite..."
          );
          return prev + 0.4;
        } else if (prev < 98) {
          setGenStepText("Synchronizing audio waveforms and saving to QA Review queue...");
          return Math.min(prev + 0.1, 98);
        }
        return prev;
      });
    }, 1200);
    progressIntervalRef.current = progressInterval;

    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: controller.signal,
        body: JSON.stringify({
          clientJobId: newClientJobId,
          brandName: brandName.trim() || "My Brand",
          creativeAngle: currentAngleData.title,
          hookType: selectedAngle,
          hookText: selectedHook,
          scriptBody: scriptBody,
          ctaText: brandOffer.trim() || "Claim Offer",
          actor: selectedActor,
          creatorAssetId: activeCreator?.hasVideoTakes ? selectedCreatorAssetId : undefined,
          trimStart: trimStart,
          trimEnd: trimEnd,
          voiceId: effectiveVoiceId,
          mediaSources: uploadedImages.length > 0 ? uploadedImages.map((img) => img.base64 || img.src) : (uploadedMediaBase64 || uploadedMediaSrc ? [uploadedMediaBase64 || uploadedMediaSrc || ""] : []),
          mediaSource: uploadedImages[0]?.base64 || uploadedImages[0]?.src || (uploadedMediaBase64 || uploadedMediaSrc || ""),
          mediaType: uploadedImages.length > 0 ? "image" : (uploadedMediaType || "prompt_only"),
          imagesCount: uploadedImages.length,
          visualPrompt: visualPrompt.trim() ? visualPrompt.trim() : undefined,
          aiModel: videoModel === "grok" ? "grok-1.5" : videoModel === "seedance" ? "seedance-fast" : "kling-1080p",
          isBatch: asBatch,

          // Quality-First Creative Studio Parameters (Sprint 2)
          musicTrackId: selectedMusicTrackId,
          captionStyle: selectedCaptionStyle,
          ctaTemplate: selectedCtaTemplate,
          ctaBrandColor: ctaBrandColor,
          ctaDiscountTag: ctaDiscountTag,
          trustBadgeId: selectedTrustBadgeId,
          claimSubstantiation: claimSubstantiation,
          aiGapFillMode: aiGapFillMode,
          scene2AiGapFill: scene2AiGapFill,
          scene3AiGapFill: scene3AiGapFill,
          scene2TrimStart: scene2TrimStart,
          scene2TrimEnd: scene2TrimEnd,
          scene3TrimStart: scene3TrimStart,
          scene3TrimEnd: scene3TrimEnd,
          productVideoUrl: (BRAND_PRESETS.find((p) => p.id === selectedPresetId)?.productVideo || (uploadedMediaType === "video" ? uploadedMediaSrc : undefined)),
          brollVideoUrl: BRAND_PRESETS.find((p) => p.id === selectedPresetId)?.brollVideo,
          sceneOrder: sceneOrder,
        }),
      });

      clearInterval(progressInterval);
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        const isBalanceExhausted =
          res.status === 402 ||
          errJson.details?.balanceExhausted ||
          errJson.error?.toLowerCase().includes("balance") ||
          errJson.error?.toLowerCase().includes("locked");

        setGenerationError({
          title: isBalanceExhausted
            ? "AI Generation Blocked: fal.ai Balance Exhausted"
            : "AI Video Generation Failed",
          message:
            errJson.error ||
            (isBalanceExhausted
              ? "The fal.ai API balance is $0.00. Top up credits at fal.ai/dashboard/billing to enable AI video generation."
              : `Server error (${res.status})`),
          balanceExhausted: isBalanceExhausted,
          billingUrl: errJson.details?.billingUrl || "https://fal.ai/dashboard/billing",
        });
        setIsGenerating(false);
        setGenProgress(0);
        setGenStepText("");
        return;
      }

      const data = await res.json();
      setGenProgress(100);
      setGenStepText(
        asBatch
          ? "5-Angle Campaign Batch Ready! 15 Deliverables saved to QA Review."
          : "Master ready! Saved to QA Review Queue."
      );

      if (data.batchJobs && data.batchJobs.length > 0) {
        setBatchJobsCreated(data.batchJobs);
      } else {
        setBatchJobsCreated(null);
      }

      const newJobId = data.jobId;
      const newVariants = data.variants;
      const newVo = data.voiceover;

      setGeneratedResult({
        jobId: newJobId,
        variants: newVariants,
        voiceover: newVo,
        aiVideo: data.aiVideo,
        creator: data.creator || {
          id: `creator-${selectedActor}`,
          name: activeCreator.name,
          handle: activeCreator.handle,
          hookClipUrl: activeCreatorAsset?.src || "",
        },
        clientMedia: data.clientMedia || {
          url: uploadedMediaBase64 || uploadedMediaSrc || "",
          type: uploadedMediaType || "image",
          name: uploadedMediaName || "client-product-asset",
        },
        brandName: data.brandName || brandName,
        brandOffer: data.brandOffer || brandOffer,
        hookText: data.hookText || selectedHook,
        scriptBody: data.scriptBody || scriptBody,
        video4k: data.video4k || newVariants?.v4k,
        videoClean: data.videoClean || newVariants?.vClean,
        stems: data.stems,
      });

      setCurrentTime(0);
      setIsPlaying(true);

      // Save to localStorage review queue
      try {
        const newVariant = {
          id: newJobId,
          brand: brandName.trim() || "Client Brand",
          creativeAngle: currentAngleData.title,
          hookText: selectedHook,
          aspectRatios: ["9:16", "1:1", "4:5"],
          status: "pending_review",
          videoUrl: newVariants.v9x16,
          variants: newVariants,
          voiceover: newVo,
          actor: selectedActor,
          creator: data.creator,
          clientMedia: data.clientMedia,
          createdAt: new Date().toISOString(),
          video4k: data.video4k || newVariants?.v4k,
          videoClean: data.videoClean || newVariants?.vClean,
          stems: data.stems,
          ctaTemplate: selectedCtaTemplate,
          captionStyle: selectedCaptionStyle,
          musicTrack: musicLibrary.find((m) => m.id === selectedMusicTrackId)?.title,
          isRealFootageDominant: !aiGapFillMode,
          compliance: {
            photorealisticAiDisclosure: aiGapFillMode,
            tiktokCompliant: true,
            metaCompliant: true,
            creatorConsentVerified: true,
            creativeDirectorSignOff: false,
          },
        };

        const existingStr = localStorage.getItem("relaunch_review_variants");
        let list = existingStr ? JSON.parse(existingStr) : [];
        list = [newVariant, ...list.filter((x: any) => x.id !== newJobId)];
        localStorage.setItem("relaunch_review_variants", JSON.stringify(list));
        localStorage.setItem("relaunch_studio_generated_variants", JSON.stringify(list));
      } catch (storageErr) {
        console.warn("Could not save to review queue localStorage:", storageErr);
      }

      setIsGenerating(false);
    } catch (err: any) {
      clearInterval(progressInterval);
      if (elapsedTimerRef.current) {
        clearInterval(elapsedTimerRef.current);
        elapsedTimerRef.current = null;
      }
      if (err.name === "AbortError" || abortControllerRef.current?.signal.aborted) {
        console.log("[Studio Engine] Video generation cancelled by user.");
        setIsGenerating(false);
        setGenProgress(0);
        setGenStepText("");
        setGenerationError({
          title: "Generation Cancelled",
          message: "Video ad generation was cancelled by user.",
        });
        return;
      }
      console.error("[Generation Failed]", err);
      setIsGenerating(false);
      setGenProgress(0);
      setGenStepText("");
      setGenerationError({
        title: "AI Video Generation Failed",
        message: err.message || "Failed to communicate with Studio Engine.",
        balanceExhausted: err.message?.toLowerCase().includes("balance"),
        billingUrl: "https://fal.ai/dashboard/billing",
      });
    }
  };

  // Video Generation trigger with pre-flight voice balance validation
  const handleGenerate = async (
    asBatch = generationMode === "batch",
    bypassVoiceWarning = false
  ) => {
    if (!bypassVoiceWarning && activeVoice?.tierRequired === "paid") {
      setPendingBatchMode(asBatch);
      setShowVoiceBalanceModal(true);
      return;
    }
    executeGenerate(asBatch);
  };

  // Continuous 22-second commercial playhead loop (syncs audio, visual hook, product showcase, AI scene & CTA)
  useEffect(() => {
    let animId: number;
    let lastTimestamp = performance.now();

    if (isPlaying && generatedResult) {
      const updatePlayhead = (now: number) => {
        const delta = (now - lastTimestamp) / 1000;
        lastTimestamp = now;

        setCurrentTime((prev) => {
          const next = prev + delta;
          if (next >= 22.0) {
            // Loop commercial back to start
            // Audio driven exclusively through video track
            if (videoRef.current) {
              videoRef.current.currentTime = 0;
            }
            return 0;
          }
          return next;
        });

        animId = requestAnimationFrame(updatePlayhead);
      };

      lastTimestamp = performance.now();
      animId = requestAnimationFrame(updatePlayhead);
    }
    return () => cancelAnimationFrame(animId);
  }, [isPlaying, generatedResult]);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      if (isMuted) {
        if (videoRef.current) videoRef.current.muted = false;
        if (audioRef.current) audioRef.current.muted = false;
        setIsMuted(false);
      }
      videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      audioRef.current?.play().catch(() => { });
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) {
      videoRef.current.muted = nextMuted;
      videoRef.current.volume = nextMuted ? 0 : 1;
    }
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      audioRef.current.volume = nextMuted ? 0 : 1;
      if (!nextMuted && isPlaying) audioRef.current.play().catch(() => { });
    }
  };

  const seekToSegment = (targetSeconds: number, sceneId?: number) => {
    setCurrentTime(targetSeconds);
    if (sceneId !== undefined) {
      setActiveScrubScene(sceneId);
      setTimeout(() => setActiveScrubScene((prev) => (prev === sceneId ? null : prev)), 3500);
    }
    if (generatedResult) {
      setIsPlaying(true);
      if (audioRef.current) {
        audioRef.current.currentTime = targetSeconds;
        audioRef.current.play().catch(() => { });
      }
      if (videoRef.current) {
        videoRef.current.currentTime = targetSeconds % (videoRef.current.duration || 5);
        videoRef.current.play().catch(() => { });
      }
      if (creatorVideoRef.current) {
        creatorVideoRef.current.currentTime = targetSeconds % (creatorVideoRef.current.duration || 3.5);
        creatorVideoRef.current.play().catch(() => { });
      }
    }
  };

  return (
    <div className="w-full min-h-screen bg-white text-[#090D16] font-sans flex flex-col selection:bg-[#7F48ED] selection:text-white">
      {/* 1. TOP STUDIO BAR (Clean White Header, Single-Line Responsive) */}
      <header className="w-full sticky top-0 shrink-0 bg-white border-b border-zinc-200/90 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between z-40 shadow-sm">
        {/* Left: Studio Branding */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/studio"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#7F48ED] transition shrink-0"
            title="Exit Studio"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Studio</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 shrink-0" />

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-black tracking-tight text-[#090D16] uppercase whitespace-nowrap truncate">
              <span className="hidden xs:inline">Relaunch Studio </span>
              <span className="text-[#FF6700]">Generator</span>
            </span>
          </div>

          {draftRestored && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-purple-50 hover:bg-purple-100/70 border border-purple-200/90 text-[11px] font-sans shrink-0 transition-all shadow-[0_1px_3px_rgba(127,72,237,0.06)]">
              <span className="font-semibold tracking-tight text-[#5B21B6]">Draft Restored</span>
              <span className="text-purple-300">·</span>
              <button
                type="button"
                onClick={handleResetDraft}
                className="font-bold text-[#7F48ED] hover:text-[#4C1D95] hover:underline cursor-pointer transition-colors"
                title="Reset generator to original presets"
              >
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Right: Creators, Approved Vault & Review Room Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            href="/studio/creators"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition cursor-pointer shrink-0"
            title="Open Creator Footage Intake & Visual Trimmer"
          >
            <Users className="w-3.5 h-3.5 text-[#7F48ED]" />
            <span>Creators</span>
          </Link>

          <Link
            href="/studio/assets"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition cursor-pointer shrink-0"
            title="Open Client Product Media Library & Brand Footage Intake"
          >
            <Video className="w-3.5 h-3.5 text-[#FF6700]" />
            <span>Brand Footage</span>
          </Link>

          <Link
            href="/studio/approved"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition cursor-pointer shrink-0"
            title="Open Approved Vault"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vault</span>
          </Link>

          <Link
            href="/studio/tracks"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition cursor-pointer shrink-0"
            title="Open Timeline & Master Tracks Workstation"
          >
            <Music className="w-3.5 h-3.5 text-[#7F48ED]" />
            <span>Master Tracks</span>
          </Link>

          <Link
            href="/studio/review"
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-xs font-bold text-white bg-[#7F48ED] hover:bg-[#6b35d6] transition shadow-md shadow-[#7F48ED]/20 cursor-pointer shrink-0"
            title="Open Review Room"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Review Room</span>
            <span className="xs:hidden">Review</span>
          </Link>
        </div>
      </header>

      {/* Mobile Workspace Tabs (< 1024px) */}
      <div className="lg:hidden flex items-center bg-zinc-100 p-1 mx-3 sm:mx-4 mt-2.5 mb-1 rounded-xl border border-zinc-200 shrink-0">
        <button
          type="button"
          onClick={() => setMobileTab("controls")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${mobileTab === "controls"
              ? "bg-white text-zinc-900 shadow-sm"
              : "text-zinc-600 hover:text-zinc-900"
            }`}
        >
          <Sliders className="w-3.5 h-3.5 text-[#7F48ED]" />
          <span>Brief &amp; Script</span>
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${mobileTab === "preview"
              ? "bg-[#7F48ED] text-white shadow-sm"
              : "text-zinc-600 hover:text-zinc-900"
            }`}
        >
          <Video className="w-3.5 h-3.5" />
          <span>Live Stage</span>
          {isGenerating && <RefreshCw className="w-3 h-3 animate-spin" />}
        </button>
      </div>

      {/* 2. MAIN WORKSPACE (2-Column Studio: Left Controls, Right Live Stage) */}
      <main className="w-full flex-1 flex flex-col lg:flex-row lg:h-[calc(100vh-57px)] lg:overflow-hidden min-h-0 bg-[#F8F9FC]">
        {/* ============================================================== */}
        {/* LEFT PANEL: SIMPLE 3-STEP CREATION CONTROLS                    */}
        {/* ============================================================== */}
        <div
          ref={sidebarRef}
          className={`w-full lg:w-[460px] xl:w-[480px] shrink-0 bg-white border-r border-zinc-200/90 p-4 sm:p-5 pb-28 space-y-4 h-auto lg:h-full lg:overflow-y-auto min-h-0 ${mobileTab === "controls" ? "block" : "hidden lg:block"
            }`}
        >
          {/* REVISION MODE BANNER */}
          {revisionContext && (
            <div className="bg-amber-50/90 border border-amber-300 rounded-2xl p-3.5 shadow-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                  <span>Revision Mode</span>
                  <span className="text-[10px] font-mono bg-amber-200/60 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                    {revisionContext.revisionId}
                  </span>
                </span>
                <button
                  type="button"
                  onClick={() => setRevisionContext(null)}
                  className="text-amber-500 hover:text-amber-800 p-0.5 rounded cursor-pointer"
                  title="Dismiss revision banner"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="text-xs text-amber-900 bg-white/80 border border-amber-200 rounded-xl p-2.5 leading-relaxed font-medium">
                <strong className="text-amber-700 block text-[10px] uppercase tracking-wider mb-0.5">Change Request from Reviewer:</strong>
                &ldquo;{revisionContext.notes}&rdquo;
              </div>
              <p className="text-[10px] text-amber-700 leading-tight">
                Adjust the script, hook, or visuals below to address the feedback and click <strong>Generate AI Video</strong>.
              </p>
            </div>
          )}

          {/* STEP 1: BRAND & OFFER (Collapsible Space-Saver) */}
          <div className={`bg-white border border-zinc-200 rounded-2xl shadow-sm transition-all ${presetDropdownOpen ? "relative z-40" : "relative z-30"}`}>
            <button
              type="button"
              onClick={() => setStep1Open(!step1Open)}
              className={`w-full p-3.5 flex items-center justify-between hover:bg-zinc-50/70 transition cursor-pointer text-left ${step1Open ? "rounded-t-2xl" : "rounded-2xl"}`}
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                <span className="w-5 h-5 rounded-full bg-[#7F48ED] text-white text-[11px] flex items-center justify-center font-bold shrink-0">1</span>
                <span className="text-xs font-black uppercase tracking-wider text-zinc-900">Brand &amp; Offer</span>
                {!step1Open && (
                  <span className="text-[11px] text-zinc-500 truncate ml-1 font-medium">
                    · {brandName || "My Brand"} ({brandOffer || "Offer"})
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform shrink-0 ${step1Open ? "rotate-180" : ""}`} />
            </button>

            {step1Open && (
              <div className="p-3.5 pt-0 space-y-2.5 border-t border-zinc-100/60">
                {/* Quick Brand Preset Dropdown */}
                <div className="relative pt-2" ref={presetDropdownRef}>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#7F48ED]" />
                      <span>Preset</span>
                    </label>
                    <div className="flex items-center gap-2">
                      {selectedPresetId ? (
                        <button
                          type="button"
                          onClick={handleClearPreset}
                          className="text-[9px] text-zinc-400 hover:text-red-500 font-bold cursor-pointer transition flex items-center gap-0.5"
                          title="Clear preset and use custom brand"
                        >
                          <X className="w-2.5 h-2.5" />
                          <span>Clear Preset</span>
                        </button>
                      ) : (
                        <span className="text-[9px] text-[#7F48ED] font-bold">1-Click Auto-Fill</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setPresetDropdownOpen(!presetDropdownOpen)}
                    className={`w-full text-left rounded-xl px-3 py-2 text-xs flex items-center justify-between cursor-pointer focus:outline-none font-semibold transition shadow-2xs border ${
                      selectedPresetId
                        ? "bg-purple-50/60 hover:bg-purple-100/70 border-purple-200 hover:border-purple-300 text-zinc-900"
                        : "bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate min-w-0">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${selectedPresetId ? "bg-[#7F48ED]" : "bg-zinc-400"}`} />
                      <span className="truncate font-bold text-zinc-900">
                        {BRAND_PRESETS.find((p) => p.id === selectedPresetId)?.name || "Custom Brand (No Preset)"}
                      </span>
                      {selectedPresetId && (
                        <span className="text-[10px] text-zinc-500 font-normal truncate hidden sm:inline">
                          ({BRAND_PRESETS.find((p) => p.id === selectedPresetId)?.category})
                        </span>
                      )}
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${presetDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {presetDropdownOpen && (
                    <div
                      onWheel={(e) => e.stopPropagation()}
                      className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-zinc-200 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1 max-h-72 overflow-y-auto overscroll-contain [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-zinc-300"
                      style={{ scrollbarWidth: "thin" }}
                    >
                      <div className="px-2.5 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 mb-1 flex items-center justify-between">
                        <span>Brand Presets</span>
                        <span className="text-[9px] text-[#7F48ED] font-bold">6 Ready</span>
                      </div>

                      {/* Manual / No Preset Option */}
                      <div
                        onClick={handleClearPreset}
                        className={`px-3 py-2 rounded-xl text-xs cursor-pointer transition flex items-start justify-between gap-2 border-b border-zinc-100 ${
                          !selectedPresetId ? "bg-purple-50 text-[#7F48ED] font-bold" : "text-zinc-700 hover:bg-zinc-50"
                        }`}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-zinc-900">Custom / No Preset</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-bold uppercase bg-zinc-100 text-zinc-600">
                              Manual
                            </span>
                          </div>
                          <div className="text-[10px] text-zinc-500 truncate mt-0.5">
                            Type your own custom brand name and offer
                          </div>
                        </div>
                        {!selectedPresetId && <Check className="w-4 h-4 shrink-0 mt-0.5 text-[#7F48ED]" />}
                      </div>
                      {BRAND_PRESETS.map((preset) => {
                        const isSelected = selectedPresetId === preset.id;
                        return (
                          <div
                            key={preset.id}
                            onClick={() => handleSelectPreset(preset)}
                            className={`px-3 py-2 rounded-xl text-xs cursor-pointer transition flex items-start justify-between gap-2 ${isSelected
                                ? "bg-[#7F48ED] text-white font-medium shadow-xs"
                                : "text-zinc-700 hover:bg-zinc-100"
                              }`}
                          >
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1.5">
                                <span className={`font-bold ${isSelected ? "text-white" : "text-zinc-900"}`}>
                                  {preset.name}
                                </span>
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${isSelected ? "bg-white/20 text-white" : "bg-purple-100 text-[#7F48ED]"
                                  }`}>
                                  {preset.category}
                                </span>
                              </div>
                              <div className={`text-[10px] truncate mt-0.5 ${isSelected ? "text-purple-100" : "text-zinc-500"}`}>
                                Offer: {preset.brandOffer}
                              </div>
                            </div>
                            {isSelected && <Check className="w-4 h-4 shrink-0 mt-0.5 text-white" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* 2-Column Compact Grid for Brand Name & Offer */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                      Brand Name
                    </label>
                    <input
                      type="text"
                      value={brandName}
                      onChange={(e) => setBrandName(e.target.value)}
                      placeholder="e.g. Chicago Dog 42"
                      className="w-full bg-white border border-zinc-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/15 rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition font-medium"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-1">
                      Offer / Promo
                    </label>
                    <input
                      type="text"
                      value={brandOffer}
                      onChange={(e) => setBrandOffer(e.target.value)}
                      placeholder="e.g. 15% off first order"
                      className="w-full bg-white border border-zinc-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/15 rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition font-medium"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    multiple
                    accept="image/png,image/jpeg,image/webp,image/jpg,video/mp4,video/quicktime"
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files && e.target.files.length > 0) {
                        handleMediaFiles(e.target.files);
                      }
                      e.target.value = "";
                    }}
                  />

                {uploadedImages.length > 0 ? (
                  <div className="space-y-2 mt-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-zinc-900 text-[11px] flex items-center gap-1.5">
                        <ImageIcon className="w-3.5 h-3.5 text-[#7F48ED]" />
                        <span>Reference Images ({uploadedImages.length}/5 max)</span>
                      </span>
                      <button
                        type="button"
                        onClick={handleClearAllMedia}
                        className="text-[10px] text-zinc-400 hover:text-red-500 font-bold transition cursor-pointer"
                      >
                        Clear All
                      </button>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {uploadedImages.map((img, idx) => (
                        <div
                          key={img.id}
                          className={`relative rounded-xl border p-1.5 flex flex-col justify-between group transition ${idx === 0
                              ? "bg-purple-50/80 border-[#7F48ED] shadow-xs ring-1 ring-[#7F48ED]/30"
                              : "bg-zinc-50 border-zinc-200 hover:border-zinc-300"
                            }`}
                        >
                          <div className="relative aspect-square w-full rounded-lg overflow-hidden bg-zinc-900 mb-1">
                            <img src={img.src} alt={img.name} className="w-full h-full object-cover" />
                            <span className="absolute top-1 left-1 bg-black/75 text-white text-[9px] font-mono font-bold px-1.5 py-0.2 rounded">
                              #{idx + 1}
                            </span>
                            {idx === 0 && (
                              <span className="absolute bottom-1 left-1 right-1 bg-[#7F48ED] text-white text-[8px] font-bold text-center py-0.5 rounded truncate shadow">
                                Start Frame
                              </span>
                            )}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveImage(img.id);
                              }}
                              className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/70 hover:bg-red-600 text-white flex items-center justify-center transition cursor-pointer shadow"
                              title="Remove image"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                          <div className="text-[10px] font-bold text-zinc-800 truncate" title={img.name}>
                            {img.name}
                          </div>
                          <div className="flex items-center justify-between text-[9px] text-zinc-400 mt-0.5">
                            <span>{img.size}</span>
                            {idx !== 0 && (
                              <button
                                type="button"
                                onClick={() => handleSetPrimaryImage(img.id)}
                                className="text-[#7F48ED] hover:underline font-bold cursor-pointer"
                              >
                                Set #1
                              </button>
                            )}
                          </div>
                        </div>
                      ))}

                      {uploadedImages.length < 5 && (
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square rounded-xl border border-dashed border-zinc-300 hover:border-[#7F48ED] bg-zinc-50 hover:bg-purple-50/40 flex flex-col items-center justify-center gap-1 text-zinc-500 hover:text-[#7F48ED] transition cursor-pointer p-2 text-center"
                        >
                          <Plus className="w-4 h-4 text-[#7F48ED]" />
                          <span className="text-[10px] font-bold">Add Image</span>
                          <span className="text-[9px] text-zinc-400 font-mono">({5 - uploadedImages.length} left)</span>
                        </button>
                      )}
                    </div>
                  </div>
                ) : uploadedMediaType === "video" && uploadedMediaSrc ? (
                  <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#7F48ED] text-white flex items-center justify-center shrink-0">
                        <FileVideo className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-900 truncate">
                          {uploadedMediaName}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          Video · {uploadedMediaSize}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearAllMedia}
                      className="p-1 text-zinc-400 hover:text-red-500 transition cursor-pointer"
                      title="Remove Video"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-zinc-300 hover:border-[#7F48ED] bg-zinc-50 hover:bg-purple-50/20 text-zinc-600 hover:text-[#7F48ED] text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer mt-1"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#FF6700]" />
                    <span>Upload Photos (Up to 5) or Video</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

          {/* STEP 2: CREATIVE ANGLE & SCRIPT (Collapsible Space-Saver) */}
          <div className={`bg-white border border-zinc-200 rounded-2xl shadow-sm transition-all ${angleDropdownOpen ? "relative z-40" : "relative z-20"}`}>
            <button
              type="button"
              onClick={() => setStep2Open(!step2Open)}
              className={`w-full p-3.5 flex items-center justify-between hover:bg-zinc-50/70 transition cursor-pointer text-left ${step2Open ? "rounded-t-2xl" : "rounded-2xl"}`}
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                <span className="w-5 h-5 rounded-full bg-[#7F48ED] text-white text-[11px] flex items-center justify-center font-bold shrink-0">2</span>
                <span className="text-xs font-black uppercase tracking-wider text-zinc-900">Creative Angle &amp; Script</span>
                {!step2Open && (
                  <span className="text-[11px] text-zinc-500 truncate ml-1 font-medium">
                    · {currentAngleData?.title} ({scriptBody.split(/\s+/).filter(Boolean).length}w)
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform shrink-0 ${step2Open ? "rotate-180" : ""}`} />
            </button>

            {step2Open && (
              <div className="p-3.5 pt-0 space-y-2.5 border-t border-zinc-100/60">
                {/* Scalable Creative Angle Dropdown Selector */}
                <div className="space-y-1 relative pt-2" ref={angleDropdownRef}>
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                      Creative Marketing Angle
                    </label>
                    <span className="text-[10px] font-mono text-[#7F48ED] font-bold">
                      {Object.keys(angleDataMap).length} Angles Available
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setAngleDropdownOpen(!angleDropdownOpen);
                      setCreatorDropdownOpen(false);
                      setModelDropdownOpen(false);
                      setVoiceDropdownOpen(false);
                    }}
                    className="w-full text-left bg-zinc-50 border border-zinc-200 hover:border-[#7F48ED] rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#7F48ED] font-semibold transition"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="font-bold text-zinc-900">{currentAngleData?.title}</span>
                      <span className="text-[10px] font-mono font-bold text-[#FF6700] bg-[#FF6700]/10 px-2 py-0.5 rounded border border-[#FF6700]/20">
                        {currentAngleData?.badge}
                      </span>
                    </div>
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${angleDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {angleDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl p-1 shadow-xl z-50 space-y-0.5 max-h-56 overflow-y-auto">
                      {Object.entries(angleDataMap).map(([key, data]) => {
                        const isSelected = selectedAngle === key || currentAngleData?.title === data.title;
                        return (
                          <div
                            key={key}
                            onClick={() => {
                              setSelectedAngle(key);
                              setAngleDropdownOpen(false);
                            }}
                            className={`px-3 py-2 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${isSelected
                                ? "bg-[#7F48ED] text-white font-bold shadow-sm"
                                : "text-zinc-700 hover:bg-[#FF6700]/10 hover:text-[#FF6700]"
                              }`}
                          >
                            <div className="flex items-center gap-2 truncate min-w-0 pr-1">
                              <span className="font-bold truncate">{data.title}</span>
                              <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded truncate ${isSelected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                                }`}>
                                {data.badge}
                              </span>
                            </div>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1.5" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Compact Opening Hook Field with Shuffle Button */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-[#7F48ED] uppercase tracking-wider block">
                      Opening Hook (0–3s)
                    </label>
                    <button
                      type="button"
                      onClick={handleShuffleHook}
                      className="text-[10px] font-bold text-[#FF6700] hover:text-[#e55c00] flex items-center gap-1 cursor-pointer transition"
                      title="Shuffle Hook Variant"
                    >
                      <Shuffle className="w-2.5 h-2.5" />
                      <span>Shuffle Hook</span>
                    </button>
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      value={selectedHook}
                      onChange={(e) => setSelectedHook(e.target.value)}
                      className="w-full bg-purple-50/40 border border-purple-200/80 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/15 rounded-xl px-3 py-2 text-xs font-bold text-zinc-900 placeholder-zinc-400 focus:outline-none transition italic"
                      placeholder="Enter opening hook..."
                    />
                  </div>
                </div>

                {/* Voiceover Script: Clean compact 2 rows */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                      Voiceover Script (~20s)
                    </label>
                    <span className="text-[10px] font-mono text-zinc-400">
                      {scriptBody.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <textarea
                    ref={textareaRef}
                    value={scriptBody}
                    onChange={(e) => setScriptBody(e.target.value)}
                    onWheel={handleScriptWheel}
                    rows={2}
                    className="w-full bg-white border border-zinc-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/15 rounded-xl p-2.5 text-xs text-zinc-800 focus:outline-none resize-none leading-relaxed transition font-medium"
                    placeholder="Enter 20s voiceover script..."
                  />
                </div>

                {/* AI Visual Direction: Space-saver dropdown toggle (Closed by default to save 90px) */}
                <div className="pt-1.5 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setShowVisualPrompt(!showVisualPrompt)}
                    className="w-full py-1.5 px-2 bg-zinc-50 hover:bg-zinc-100 rounded-lg text-xs font-bold text-zinc-600 hover:text-[#7F48ED] flex items-center justify-between cursor-pointer transition"
                  >
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3 h-3 text-[#FF6700]" />
                      <span>AI Visual Direction (Optional)</span>
                    </span>
                    <span className="text-[10px] text-[#7F48ED] font-mono font-bold">
                      {showVisualPrompt ? "Hide ▲" : "Expand ▼"}
                    </span>
                  </button>

                  {showVisualPrompt && (
                    <div className="mt-2 space-y-1.5 animate-in fade-in duration-150">
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={handleAutoGenerateVisualPrompt}
                          className="text-[10px] text-[#7F48ED] hover:text-[#6a32d6] font-bold flex items-center gap-1 cursor-pointer transition bg-purple-50 hover:bg-purple-100 px-2 py-0.5 rounded-md"
                          title="Generate visual prompt automatically from script"
                        >
                          <Sparkles className="w-2.5 h-2.5 text-[#7F48ED]" />
                          <span>Auto-Generate Prompt</span>
                        </button>
                      </div>
                      <textarea
                        value={visualPrompt}
                        onChange={(e) => setVisualPrompt(e.target.value)}
                        rows={2}
                        className="w-full bg-white border border-zinc-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/15 rounded-xl p-2 text-xs text-zinc-800 focus:outline-none resize-none leading-relaxed transition font-medium"
                        placeholder="Describe what should happen in the video based on your script (e.g. Delicious hot dog macro slow-motion reveal with mustard, relish, and sizzling grill steam)..."
                      />
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* STEP 3: CREATOR & VOICE (Collapsible Space-Saver) */}
          <div className={`bg-white border border-zinc-200 rounded-2xl shadow-sm transition-all ${(creatorDropdownOpen || footageDropdownOpen || voiceDropdownOpen || modelDropdownOpen) ? "relative z-40" : "relative z-10"}`}>
            <button
              type="button"
              onClick={() => setStep3Open(!step3Open)}
              className={`w-full p-3.5 flex items-center justify-between hover:bg-zinc-50/70 transition cursor-pointer text-left ${step3Open ? "rounded-t-2xl" : "rounded-2xl"}`}
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                <span className="w-5 h-5 rounded-full bg-[#7F48ED] text-white text-[11px] flex items-center justify-center font-bold shrink-0">3</span>
                <span className="text-xs font-black uppercase tracking-wider text-zinc-900">Creator &amp; Voice</span>
                {!step3Open && (
                  <span className="text-[11px] text-zinc-500 truncate ml-1 font-medium">
                    · {activeCreator?.name} ({activeVoice?.name || "Voice"})
                  </span>
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform shrink-0 ${step3Open ? "rotate-180" : ""}`} />
            </button>

            {step3Open && (
              <div className="p-3.5 pt-0 space-y-2.5 border-t border-zinc-100/60">

            {/* Scalable Creator Dropdown Selector */}
            <div className="space-y-1 relative" ref={creatorDropdownRef}>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Whitelisted Creator
                </label>
                <span className="text-[10px] font-mono text-[#7F48ED] font-bold">
                  {dynamicRoster.length} Creators
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setCreatorDropdownOpen(!creatorDropdownOpen);
                  setModelDropdownOpen(false);
                  setVoiceDropdownOpen(false);
                }}
                className="w-full text-left bg-zinc-50 border border-zinc-200 hover:border-[#7F48ED] rounded-xl px-3 py-2 text-xs text-zinc-900 flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#7F48ED] font-semibold transition"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="w-6 h-6 rounded-full bg-[#7F48ED] text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-sm">
                    {activeCreator?.name.charAt(0) || "C"}
                  </div>
                  <div className="truncate flex items-center flex-wrap gap-1">
                    <span className="font-bold text-zinc-900">{activeCreator?.name}</span>
                    <span className="text-zinc-500 text-[11px] font-normal">
                      ({activeCreator?.niche})
                    </span>
                    {activeCreator?.hasVideoTakes ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                        UGC Video Ready
                      </span>
                    ) : (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-[#7F48ED]">
                        Voice &amp; Pure AI Video
                      </span>
                    )}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${creatorDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {creatorDropdownOpen && (
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl p-1 shadow-xl z-50 space-y-0.5 max-h-64 overflow-y-auto overscroll-contain"
                  style={{ scrollbarWidth: "thin" }}
                >
                  {dynamicRoster.map((cr) => {
                    const isSelected = selectedActor === cr.actorPresetId;
                    return (
                      <div
                        key={cr.id}
                        onClick={() => {
                          setSelectedActor(cr.actorPresetId);
                          if (cr.hasVideoTakes) {
                            const dynamicClips = dynamicAssets.filter((a) => a.creatorId === cr.actorPresetId && a.type === "hook");
                            const defaultClip = dynamicClips[0] || getCreatorClips(cr.actorPresetId, "hook")[0];
                            if (defaultClip) {
                              setSelectedCreatorAssetId(defaultClip.id);
                              setTrimStart(defaultClip.recommendedTrim?.start ?? 0);
                              setTrimEnd(defaultClip.recommendedTrim?.end ?? 3.8);
                              if (defaultClip.spokenText) {
                                setSelectedHook(defaultClip.spokenText);
                              }
                            }
                          } else {
                            setSelectedCreatorAssetId("");
                          }
                          setCreatorDropdownOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${isSelected
                            ? "bg-[#7F48ED] text-white font-bold shadow-sm"
                            : "text-zinc-700 hover:bg-[#FF6700]/10 hover:text-[#FF6700]"
                          }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${isSelected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                              }`}
                          >
                            {cr.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold">{cr.name}</span>
                              {cr.hasVideoTakes ? (
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${isSelected ? "bg-emerald-500/30 text-white" : "bg-emerald-100 text-emerald-800"}`}>
                                  UGC Video Ready
                                </span>
                              ) : (
                                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded ${isSelected ? "bg-purple-400/30 text-white" : "bg-purple-100 text-[#7F48ED]"}`}>
                                  Voice &amp; Pure AI Video
                                </span>
                              )}
                            </div>
                            <span className={`text-[10px] truncate ${isSelected ? "text-purple-100" : "text-zinc-500"}`}>
                              {cr.handle} · {cr.niche}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1.5" />}
                      </div>
                    );
                  })}

                  {/* + Onboard New Creator Shortcut */}
                  <div className="pt-1.5 mt-1 border-t border-zinc-100 px-1">
                    <Link
                      href="/studio/creators/new"
                      className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg bg-zinc-50 hover:bg-[#7F48ED]/10 text-[#7F48ED] font-bold text-xs transition border border-dashed border-zinc-300 hover:border-[#7F48ED]"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#7F48ED]" />
                      <span>Onboard New UGC Creator</span>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Conditional: UGC Creator Footage & Trimmer VS Pure Kling AI Video Mode */
              activeCreator?.hasVideoTakes && activeCreatorAsset ? (
                <>
                  {/* Creator Footage Dropdown (Uniform to other dropdowns) */}
                  <div className="space-y-1 relative" ref={footageDropdownRef}>
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                        Creator Footage
                      </label>
                      <span className="text-[10px] font-mono text-[#7F48ED] font-bold">
                        {assetTab === "hooks" ? `${creatorHooksList.length} Hooks Available` : `${creatorBrollList.length} B-Roll Cuts`}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setFootageDropdownOpen(!footageDropdownOpen);
                        setCreatorDropdownOpen(false);
                        setModelDropdownOpen(false);
                        setVoiceDropdownOpen(false);
                        setAngleDropdownOpen(false);
                      }}
                      className="w-full text-left bg-zinc-50 border border-zinc-200 hover:border-[#7F48ED] rounded-xl px-3 py-2 text-xs text-zinc-900 flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#7F48ED] font-semibold transition"
                    >
                      <div className="flex items-center gap-2 truncate min-w-0">
                        <span className="w-5 h-5 rounded-full bg-[#7F48ED]/10 text-[#7F48ED] flex items-center justify-center text-[10px] font-black shrink-0">
                          {activeCreatorAsset.type === "hook" ? "H" : "B"}
                        </span>
                        <div className="truncate">
                          <span className="font-bold text-zinc-900">{activeCreatorAsset.label}</span>
                          <span className="text-zinc-500 text-[11px] ml-1.5 font-normal">
                            ({activeCreatorAsset.durationSeconds}s)
                          </span>
                        </div>
                      </div>
                      <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${footageDropdownOpen ? "rotate-180" : ""}`} />
                    </button>

                    {footageDropdownOpen && (
                      <div
                        onWheel={(e) => e.stopPropagation()}
                        className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl p-1.5 shadow-xl z-50 space-y-1 max-h-64 overflow-y-auto overscroll-contain"
                        style={{ scrollbarWidth: "thin" }}
                      >
                        {/* Category Filter Tabs inside dropdown */}
                        <div className="flex items-center gap-1 bg-zinc-100 p-0.5 rounded-lg text-[10px] font-bold mb-1">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssetTab("hooks");
                            }}
                            className={`flex-1 py-1 rounded-md transition cursor-pointer text-center ${assetTab === "hooks"
                                ? "bg-white text-[#7F48ED] shadow-xs"
                                : "text-zinc-500 hover:text-zinc-900"
                              }`}
                          >
                            Opening Hooks ({creatorHooksList.length})
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setAssetTab("broll");
                            }}
                            className={`flex-1 py-1 rounded-md transition cursor-pointer text-center ${assetTab === "broll"
                                ? "bg-white text-[#7F48ED] shadow-xs"
                                : "text-zinc-500 hover:text-zinc-900"
                              }`}
                          >
                            B-Roll Motion ({creatorBrollList.length})
                          </button>
                        </div>

                        {/* Dropdown Options List */}
                        {(assetTab === "hooks" ? creatorHooksList : creatorBrollList).map((clip) => {
                          const isSelected = selectedCreatorAssetId === clip.id;
                          return (
                            <div
                              key={clip.id}
                              onClick={() => {
                                setSelectedCreatorAssetId(clip.id);
                                setTrimStart(clip.recommendedTrim.start);
                                setTrimEnd(clip.recommendedTrim.end);
                                if (clip.spokenText) {
                                  setSelectedHook(clip.spokenText);
                                }
                                if (videoRef.current) {
                                  videoRef.current.currentTime = clip.recommendedTrim.start;
                                }
                                setFootageDropdownOpen(false);
                              }}
                              className={`px-2.5 py-2 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${isSelected
                                  ? "bg-[#7F48ED] text-white font-bold shadow-xs"
                                  : "text-zinc-700 hover:bg-[#FF6700]/10 hover:text-[#FF6700]"
                                }`}
                            >
                              <div className="flex flex-col min-w-0 pr-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold truncate">{clip.label}</span>
                                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded shrink-0 ${isSelected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                                    }`}>
                                    {clip.durationSeconds}s
                                  </span>
                                </div>
                                {clip.spokenText && (
                                  <span className={`text-[10px] truncate mt-0.5 ${isSelected ? "text-purple-100" : "text-zinc-500 italic"
                                    }`}>
                                    &ldquo;{clip.spokenText}&rdquo;
                                  </span>
                                )}
                              </div>
                              {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1.5" />}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  {/* Interactive Hook Trimmer in Space-Saver Drawer (Closed by default to save 140px) */}
                  {activeCreatorAsset && activeCreatorAsset.type === "hook" && (
                    <div className="pt-1.5 border-t border-zinc-100">
                      <button
                        type="button"
                        onClick={() => setShowTrimmer(!showTrimmer)}
                        className="w-full py-1.5 px-2 bg-zinc-50 hover:bg-zinc-100 rounded-lg text-xs font-bold text-zinc-600 hover:text-[#7F48ED] flex items-center justify-between cursor-pointer transition"
                      >
                        <span className="flex items-center gap-1.5">
                          <Scissors className="w-3 h-3 text-[#7F48ED]" />
                          <span>Precision Hook Trimmer ({trimStart.toFixed(1)}s – {trimEnd.toFixed(1)}s)</span>
                        </span>
                        <span className="text-[10px] text-[#7F48ED] font-mono font-bold">
                          {showTrimmer ? "Hide ▲" : "Adjust Trim ▼"}
                        </span>
                      </button>
                      {showTrimmer && (
                        <div className="mt-2 pt-1 animate-in fade-in duration-150">
                          <HookTrimmer
                            clip={activeCreatorAsset}
                            trimStart={trimStart}
                            trimEnd={trimEnd}
                            onTrimChange={(start, end) => {
                              setTrimStart(start);
                              setTrimEnd(end);
                            }}
                          />
                        </div>
                      )}
                    </div>
                  )}

                </>
              ) : (
                /* Pure Kling AI Mode Information Banner when Creator has no UGC video takes */
                <div className="p-3.5 bg-gradient-to-br from-purple-50/90 to-indigo-50/70 border border-purple-200/90 rounded-2xl space-y-2 shadow-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-xl bg-[#7F48ED] flex items-center justify-center text-white shadow-xs">
                      <Sparkles className="w-4 h-4 text-amber-300" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-zinc-900 flex items-center gap-1.5">
                        <span>100% Pure Kling AI Video Mode</span>
                        <span className="text-[9px] font-mono px-1.5 py-0.2 bg-purple-100 text-[#7F48ED] rounded font-bold">No Local Stock Clips</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 font-medium">Selected Creator: {activeCreator.name} ({activeCreator.handle})</div>
                    </div>
                  </div>
                  <p className="text-[11px] text-zinc-600 leading-relaxed">
                    <strong>{activeCreator.name}</strong> powers authentic voiceover narration. Because {activeCreator.name} does not have camera takes yet, this ad generates as a <strong>100% Pure Kling AI Commercial Video</strong> from 0s to end. No substitute actors or local videos will be used.
                  </p>
                </div>
              )}

            {/* AI Engine & Voice Cadence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2 border-t border-zinc-100">
              {/* Visual Engine */}
              <div className="space-y-1 relative" ref={modelDropdownRef}>
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">AI Engine</label>
                <button
                  type="button"
                  onClick={() => {
                    setModelDropdownOpen(!modelDropdownOpen);
                    setVoiceDropdownOpen(false);
                  }}
                  className="w-full text-left bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#7F48ED] font-semibold"
                >
                  <span className="truncate">
                    {videoModel === "kling" ? "Kling 1080p Commercial Engine" : videoModel === "grok" ? "Grok Imagine" : "Seedance 2.0"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {modelDropdownOpen && (
                  <div
                    onWheel={(e) => e.stopPropagation()}
                    className="absolute bottom-full left-0 w-[260px] sm:w-[290px] max-w-[90vw] mb-1.5 bg-white border border-zinc-200 rounded-2xl p-1.5 shadow-2xl z-50 space-y-1 overscroll-contain"
                  >
                    {[
                      { id: "kling", label: "Kling 1080p Commercial Engine (Standard HD)" },
                      { id: "grok", label: "Grok Imagine (High Motion)" },
                      { id: "seedance", label: "Seedance 2.0 (Fast)" },
                    ].map((m) => {
                      const isSelected = videoModel === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            setVideoModel(m.id as any);
                            setModelDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${isSelected
                              ? "bg-[#7F48ED] text-white font-bold"
                              : "text-zinc-700 hover:bg-[#FF6700] hover:text-white"
                            }`}
                        >
                          <span>{m.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* ElevenLabs Dynamic Voice Dropdown */}
              <div className="space-y-1 relative" ref={voiceDropdownRef}>
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                    Voiceover
                  </label>
                  {isLoadingVoices && (
                    <span className="text-[10px] text-[#7F48ED] font-mono animate-pulse">
                      Syncing...
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceDropdownOpen(!voiceDropdownOpen);
                    setModelDropdownOpen(false);
                    setCreatorDropdownOpen(false);
                  }}
                  className="w-full text-left bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#7F48ED] font-semibold gap-1.5"
                >
                  <div className="flex items-center gap-1.5 truncate min-w-0">
                    <span className="truncate font-bold text-zinc-900">
                      {activeVoice?.name.replace(/\s*\(.*\)/, "") || "Select Voice"}
                    </span>
                    <span className="text-[10px] text-zinc-500 font-normal truncate">
                      ({activeVoice?.gender === "female" ? "Female" : "Male"})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    {activeVoice?.tierRequired === "paid" ? (
                      <span className="text-[9px] bg-amber-100 text-amber-900 border border-amber-300 px-1.5 py-0.5 rounded font-bold">
                        🔒 Paid Plan
                      </span>
                    ) : (
                      <span className="text-[9px] bg-emerald-100 text-emerald-900 border border-emerald-300 px-1.5 py-0.5 rounded font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Ready
                      </span>
                    )}
                    <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${voiceDropdownOpen ? "rotate-180" : ""}`} />
                  </div>
                </button>

                {voiceDropdownOpen && (
                  <div
                    onWheel={(e) => e.stopPropagation()}
                    className="absolute bottom-full right-0 w-[330px] sm:w-[380px] max-w-[92vw] mb-2 bg-white border border-zinc-200 rounded-2xl p-2 shadow-2xl z-50 space-y-1.5 max-h-80 overflow-y-auto overscroll-contain"
                    style={{ scrollbarWidth: "thin" }}
                  >
                    {/* Header */}
                    <div className="px-2 py-1 text-[10px] font-bold text-zinc-400 uppercase tracking-wider border-b border-zinc-100 flex items-center justify-between">
                      <span>ElevenLabs Voiceovers</span>
                      <span className="text-[9px] text-emerald-600 font-medium font-mono">● Active Balance Ready</span>
                    </div>

                    {/* Section 1: Ready / Free Voices (With Active Balance) */}
                    <div className="px-2 pt-1 pb-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50/70 rounded-lg flex items-center justify-between">
                      <span>✓ Ready Voices (Active Balance)</span>
                      <span className="font-mono text-[8px] text-emerald-800">100% Guaranteed</span>
                    </div>

                    {availableVoices.filter((v) => v.tierRequired !== "paid").map((v) => {
                      const isSelected = selectedVoiceId === v.id;
                      const isCloned = v.category === "cloned";
                      const cleanName = v.name.replace(/\s*\(.*\)/, "");
                      const subStyle = v.name.includes("(") ? v.name.replace(/^[^(]*\(([^)]*)\).*$/, "$1") : v.gender;

                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            setSelectedVoiceId(v.id);
                            setVoiceDropdownOpen(false);
                          }}
                          className={`px-3 py-2 rounded-xl text-xs cursor-pointer transition flex items-center justify-between gap-2.5 ${
                            isSelected
                              ? "bg-[#7F48ED] text-white font-medium shadow-xs"
                              : "text-zinc-700 hover:bg-zinc-100"
                          }`}
                        >
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-bold ${isSelected ? "text-white" : "text-zinc-900"}`}>
                                {cleanName}
                              </span>
                              <span className={`text-[10px] ${isSelected ? "text-purple-200" : "text-zinc-500"}`}>
                                · {subStyle}
                              </span>
                              {isCloned && (
                                <span className={`text-[9px] px-1.5 py-0.2 rounded font-bold uppercase ${
                                  isSelected ? "bg-white/20 text-white" : "bg-[#FF6700]/15 text-[#FF6700]"
                                }`}>
                                  CLONED
                                </span>
                              )}
                              <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap ${
                                isSelected ? "bg-emerald-300 text-emerald-950 font-black" : "bg-emerald-50 text-emerald-800 border border-emerald-300"
                              }`}>
                                ● Active Balance
                              </span>
                            </div>
                            <div className={`text-[11px] leading-tight mt-0.5 line-clamp-1 ${
                              isSelected ? "text-purple-100" : "text-zinc-500"
                            }`}>
                              {v.description.replace(/\s*·\s*Ready.*$/, "")}
                            </div>
                          </div>
                          {isSelected && <Check className="w-4 h-4 shrink-0 text-white" />}
                        </div>
                      );
                    })}

                    {/* Section 2: Paid Plan Voices */}
                    {availableVoices.some((v) => v.tierRequired === "paid") && (
                      <>
                        <div className="px-2 pt-2 pb-0.5 text-[9px] font-black uppercase tracking-wider text-amber-800 bg-amber-50/70 rounded-lg flex items-center justify-between mt-2">
                          <span>🔒 Paid Plan Required</span>
                          <span className="font-mono text-[8px] text-amber-700">ElevenLabs HTTP 402</span>
                        </div>

                        {availableVoices.filter((v) => v.tierRequired === "paid").map((v) => {
                          const isSelected = selectedVoiceId === v.id;
                          const cleanName = v.name.replace(/\s*\(.*\)/, "");
                          const subStyle = v.name.includes("(") ? v.name.replace(/^[^(]*\(([^)]*)\).*$/, "$1") : v.gender;

                          return (
                            <div
                              key={v.id}
                              onClick={() => {
                                setSelectedVoiceId(v.id);
                                setVoiceDropdownOpen(false);
                              }}
                              className={`px-3 py-2 rounded-xl text-xs cursor-pointer transition flex items-center justify-between gap-2.5 ${
                                isSelected
                                  ? "bg-amber-500 text-zinc-950 font-medium shadow-xs"
                                  : "text-zinc-700 hover:bg-zinc-100 opacity-90"
                              }`}
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  <span className={`font-bold ${isSelected ? "text-zinc-950 font-black" : "text-zinc-900"}`}>
                                    {cleanName}
                                  </span>
                                  <span className={`text-[10px] ${isSelected ? "text-amber-950" : "text-zinc-500"}`}>
                                    · {subStyle}
                                  </span>
                                  <span className={`ml-auto text-[9px] px-1.5 py-0.5 rounded font-bold uppercase whitespace-nowrap ${
                                    isSelected ? "bg-zinc-950 text-white" : "bg-amber-100 text-amber-800 border border-amber-300"
                                  }`}>
                                    🔒 Paid Plan
                                  </span>
                                </div>
                                <div className={`text-[11px] leading-tight mt-0.5 line-clamp-1 ${
                                  isSelected ? "text-zinc-900" : "text-zinc-500"
                                }`}>
                                  {v.description.replace(/\s*·\s*Requires.*$/, "")}
                                </div>
                              </div>
                              {isSelected && <Check className="w-4 h-4 shrink-0 text-zinc-950" />}
                            </div>
                          );
                        })}
                      </>
                    )}
                  </div>
                )}

                {/* Voice balance warning alert if paid voice is selected */}
                {activeVoice?.tierRequired === "paid" && (
                  <div className="mt-1.5 p-2 rounded-xl bg-amber-50/95 border border-amber-300 text-amber-950 text-xs shadow-xs animate-in fade-in duration-200">
                    <div className="flex items-start gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-[11px] text-amber-950 flex items-center gap-1">
                          <span>{activeVoice.name} requires Paid Balance</span>
                        </div>
                        <p className="text-[10px] text-amber-900 leading-tight mt-0.5">
                          ElevenLabs restricts library voices on free API keys (HTTP 402).
                          Please use a voice with active balance so your ad generates with full voiceover.
                        </p>
                        <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                          <span className="text-[9px] font-bold text-amber-800 uppercase tracking-wider">Use ready voice:</span>
                          <button
                            type="button"
                            onClick={() => setSelectedVoiceId("pNInz6obpgDQGcFmaJgB")}
                            className="px-2 py-0.5 bg-white hover:bg-amber-100 border border-amber-300 text-zinc-900 font-bold rounded text-[10px] shadow-2xs transition cursor-pointer"
                          >
                            ✓ Adam (Male)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedVoiceId("EXAVITQu4vr4xnSDxMaL")}
                            className="px-2 py-0.5 bg-white hover:bg-amber-100 border border-amber-300 text-zinc-900 font-bold rounded text-[10px] shadow-2xs transition cursor-pointer"
                          >
                            ✓ Bella (Female)
                          </button>
                          <button
                            type="button"
                            onClick={() => setSelectedVoiceId("pFZP5JQG7iQjIQuC4Bku")}
                            className="px-2 py-0.5 bg-white hover:bg-amber-100 border border-amber-300 text-zinc-900 font-bold rounded text-[10px] shadow-2xs transition cursor-pointer"
                          >
                            ✓ Lily (Female)
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Compliance Tag Toggle (Simplified) */}
            <div className="flex items-center justify-between pt-1 border-t border-zinc-100">
              <span className="text-xs text-zinc-600 font-medium">AI Scene Disclosure</span>
              <button
                type="button"
                onClick={() => setSoftLabelDisclosure(!softLabelDisclosure)}
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition cursor-pointer border ${softLabelDisclosure
                    ? "bg-[#FF6700] text-white border-[#FF6700]"
                    : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:text-zinc-800"
                  }`}
              >
                {softLabelDisclosure ? "ON" : "OFF (Default)"}
              </button>
            </div>
              </div>
            )}
          </div>

          {/* STEP 4: REAL-FOOTAGE TIMELINE & TRACKS (22S MASTER) */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm transition-all relative z-5">
            <button
              type="button"
              onClick={() => setStep4Open(!step4Open)}
              className={`w-full p-3.5 flex items-center justify-between hover:bg-zinc-50/70 transition cursor-pointer text-left ${step4Open ? "rounded-t-2xl" : "rounded-2xl"}`}
            >
              <div className="flex items-center gap-2 truncate min-w-0">
                <span className="w-5 h-5 rounded-full bg-[#7F48ED] text-white text-[11px] flex items-center justify-center font-bold shrink-0">4</span>
                <span className="text-xs font-black uppercase tracking-wider text-zinc-900">Timeline &amp; Master Tracks</span>
                {!step4Open && (
                  <span className="text-[11px] text-zinc-500 truncate ml-1 font-medium">
                    · 22s Master ({aiGapFillMode ? "AI Gap-Fill" : "100% Real Footage"})
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[8px] font-bold uppercase tracking-wider hidden sm:inline-flex items-center gap-0.5">
                  <Check className="w-2.5 h-2.5" />
                  <span>Real Lead</span>
                </span>
                <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform shrink-0 ${step4Open ? "rotate-180" : ""}`} />
              </div>
            </button>

            {step4Open && (
              <div className="p-3.5 pt-0 space-y-3 border-t border-zinc-100/60">
                {/* AI Gap-Filler Mode Switch */}
                <div className="pt-2 flex items-center justify-between gap-2 bg-zinc-50 p-2.5 rounded-xl border border-zinc-200/80">
                  <div className="min-w-0">
                    <div className="text-[11px] font-bold text-zinc-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-[#7F48ED]" />
                      <span>Real-Footage-First Rule</span>
                    </div>
                    <div className="text-[10px] text-zinc-500 leading-tight">
                      {aiGapFillMode ? "Missing scenes filled via AI diffusion" : "100% genuine creator & client product footage"}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAiGapFillMode(!aiGapFillMode)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono transition font-bold cursor-pointer shrink-0 ${
                      aiGapFillMode
                        ? "bg-[#7F48ED] text-white shadow-xs"
                        : "bg-emerald-600 text-white shadow-xs"
                    }`}
                    title="Toggle AI Gap-Fill mode"
                  >
                    {aiGapFillMode ? "AI Gap: ON" : "100% Real"}
                  </button>
                </div>

                {/* Master Production Tracks: Music, Captions, CTA Template */}
                <div className="space-y-2">
                  {/* Licensed Music Track */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Volume2 className="w-3 h-3 text-[#7F48ED]" />
                        <span>Music Library ({musicLibrary.length})</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setMasterAssetModalTab("music");
                          setShowMasterAssetsModal(true);
                        }}
                        className="text-[#7F48ED] hover:text-[#6b35d6] hover:underline font-bold cursor-pointer flex items-center gap-0.5"
                      >
                        <Plus className="w-2.5 h-2.5" />
                        <span>Add Track</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 min-w-0 w-full">
                      <select
                        value={selectedMusicTrackId}
                        onChange={(e) => {
                          const newId = e.target.value;
                          if (newId === "__add_new_track__") {
                            setMasterAssetModalTab("music");
                            setShowMasterAssetsModal(true);
                          } else {
                            setSelectedMusicTrackId(newId);
                            if (musicPlayingId) {
                              const newTrack = musicLibrary.find((t) => t.id === newId);
                              if (newTrack) {
                                togglePreviewMusic(newTrack);
                              } else {
                                if (musicAudioRef.current) musicAudioRef.current.pause();
                                setMusicPlayingId(null);
                              }
                            }
                          }
                        }}
                        className="flex-1 min-w-0 bg-zinc-50 border border-zinc-200 hover:border-[#7F48ED] rounded-xl px-3 py-2 text-xs text-zinc-900 font-semibold focus:outline-none transition cursor-pointer truncate"
                      >
                        {musicLibrary.map((track) => (
                          <option key={track.id} value={track.id}>
                            {track.isCustom ? "★ " : ""}{track.title} ({track.genre} · {track.bpm} BPM){track.isCustom ? " [Custom]" : ""}
                          </option>
                        ))}
                        <option value="__add_new_track__" className="text-[#7F48ED] font-bold">
                          + Upload Custom Track / MP3...
                        </option>
                      </select>
                      <button
                        type="button"
                        onClick={() => {
                          const track = musicLibrary.find((t) => t.id === selectedMusicTrackId);
                          if (track) togglePreviewMusic(track);
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold cursor-pointer transition shrink-0 flex items-center gap-1.5 shadow-2xs border ${
                          musicPlayingId === selectedMusicTrackId
                            ? "bg-orange-50 hover:bg-orange-100 text-[#FF6700] border-orange-300 ring-2 ring-orange-200/50"
                            : "bg-purple-50 hover:bg-purple-100 text-[#7F48ED] border-purple-200 hover:border-purple-300"
                        }`}
                        title={musicPlayingId === selectedMusicTrackId ? "Click to Pause track" : "Click to Play track preview"}
                      >
                        {musicPlayingId === selectedMusicTrackId ? (
                          <>
                            <Pause className="w-3.5 h-3.5 fill-[#FF6700] text-[#FF6700]" />
                            <span>Pause</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700] animate-ping" />
                          </>
                        ) : (
                          <>
                            <Play className="w-3.5 h-3.5 fill-[#7F48ED] text-[#7F48ED]" />
                            <span>Play</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* 2-Column Grid for Captions & CTA Template */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                        Caption Style
                      </label>
                      <select
                        value={selectedCaptionStyle}
                        onChange={(e) => setSelectedCaptionStyle(e.target.value)}
                        className="w-full bg-zinc-50 border border-zinc-200 hover:border-[#7F48ED] rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 font-semibold focus:outline-none transition cursor-pointer"
                      >
                        {captionStylesList.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} ({c.badge})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                          Motion CTA Template
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setMasterAssetModalTab("cta");
                            setShowMasterAssetsModal(true);
                          }}
                          className="text-[9px] text-[#7F48ED] hover:text-[#6b35d6] hover:underline font-bold cursor-pointer"
                        >
                          + New CTA
                        </button>
                      </div>
                      <select
                        value={selectedCtaTemplate}
                        onChange={(e) => {
                          if (e.target.value === "__add_new_cta__") {
                            setMasterAssetModalTab("cta");
                            setShowMasterAssetsModal(true);
                          } else {
                            setSelectedCtaTemplate(e.target.value);
                          }
                        }}
                        className="w-full bg-zinc-50 border border-zinc-200 hover:border-[#7F48ED] rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 font-semibold focus:outline-none transition cursor-pointer"
                      >
                        {ctaTemplatesList.map((cta) => (
                          <option key={cta.id} value={cta.id}>
                            {cta.isCustom ? "★ " : ""}{cta.name} ({cta.badge}){cta.isCustom ? " [Custom]" : ""}
                          </option>
                        ))}
                        <option value="__add_new_cta__" className="text-[#7F48ED] font-bold">
                          + Design New CTA Template...
                        </option>
                      </select>
                    </div>
                  </div>

                  {/* Interactive CTA Motion & Trust Badge Customizer */}
                  <div className="bg-zinc-50/80 border border-zinc-200/80 rounded-xl p-2.5 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-600 flex items-center gap-1">
                        <Sliders className="w-3 h-3 text-[#FF6700]" />
                        <span>CTA Style & Trust Badges</span>
                      </span>
                      <span className="text-[9px] font-mono font-bold text-zinc-400">Scene 4 Customizer</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {/* Brand Accent Color */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
                          Accent Color
                        </label>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          {BRAND_COLOR_PRESETS.map((color) => (
                            <button
                              key={color.hex}
                              type="button"
                              onClick={() => setCtaBrandColor(color.hex)}
                              className={`w-5 h-5 rounded-full transition transform cursor-pointer border ${
                                ctaBrandColor === color.hex
                                  ? "scale-110 ring-2 ring-offset-1 ring-zinc-700 border-white shadow-xs"
                                  : "border-zinc-300 hover:scale-105 opacity-80 hover:opacity-100"
                              }`}
                              style={{ backgroundColor: color.hex }}
                              title={`${color.name} (${color.hex})`}
                            />
                          ))}
                          <input
                            type="color"
                            value={ctaBrandColor}
                            onChange={(e) => setCtaBrandColor(e.target.value)}
                            className="w-5 h-5 rounded cursor-pointer border border-zinc-200 p-0 bg-transparent"
                            title="Custom HEX color"
                          />
                        </div>
                      </div>

                      {/* Offer / Discount Tag */}
                      <div className="space-y-1">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
                          Discount / Offer Pill
                        </label>
                        <input
                          type="text"
                          value={ctaDiscountTag}
                          onChange={(e) => setCtaDiscountTag(e.target.value)}
                          placeholder="e.g. SAVE 20% · FREE AUDIT"
                          className="w-full bg-white border border-zinc-200 focus:border-[#FF6700] rounded-lg px-2 py-1 text-[11px] font-bold text-zinc-900 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Conversion Trust Badge — Real Claims Only */}
                    <div className="space-y-1 pt-0.5">
                      <div className="flex items-center justify-between">
                        <label className="text-[9px] font-bold uppercase tracking-wider text-zinc-500 block">
                          Trust Badge (Real Claims Only)
                        </label>
                        <span className="text-[8px] font-mono text-emerald-600 font-bold">Substantiated</span>
                      </div>
                      <select
                        value={selectedTrustBadgeId}
                        onChange={(e) => {
                          const id = e.target.value;
                          setSelectedTrustBadgeId(id);
                          const b = TRUST_BADGE_PRESETS.find((p) => p.id === id);
                          if (b) setClaimSubstantiation(b.subtext || "Verified Client Policy");
                        }}
                        className="w-full bg-white border border-zinc-200 focus:border-[#7F48ED] rounded-lg px-2 py-1 text-[11px] font-semibold text-zinc-800 focus:outline-none cursor-pointer"
                      >
                        <option value="">No Badge (Clean Direct CTA)</option>
                        {TRUST_BADGE_PRESETS.map((badge) => (
                          <option key={badge.id} value={badge.id}>
                            {badge.label}
                          </option>
                        ))}
                      </select>

                      {selectedTrustBadgeId && (
                        <div className="pt-1 space-y-0.5">
                          <label className="text-[8px] font-mono text-zinc-400 block uppercase">
                            Claim Substantiation / Client Proof Reference:
                          </label>
                          <input
                            type="text"
                            value={claimSubstantiation}
                            onChange={(e) => setClaimSubstantiation(e.target.value)}
                            placeholder="e.g. Terms on client site / 30-day return policy / verified order link"
                            className="w-full bg-zinc-50 border border-zinc-200 focus:border-[#7F48ED] rounded px-2 py-1 text-[10px] text-zinc-700 font-mono focus:outline-none"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* 22s Segmented Production Timeline Bar */}
                <div className="space-y-1.5 pt-1 border-t border-zinc-100">
                  <div className="flex items-center justify-between text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
                    <span>Scene Timeline (22s)</span>
                    <button
                      type="button"
                      onClick={() => setTimelineExpanded(!timelineExpanded)}
                      className="text-[#7F48ED] hover:underline font-bold cursor-pointer"
                    >
                      {timelineExpanded ? "Collapse Cards ▲" : "Fine Scene Controls ▼"}
                    </button>
                  </div>

                  <div className="grid grid-cols-4 gap-1 select-none font-mono text-[9px]">
                    {sceneOrder.map((sceneId, visualIdx) => {
                      const slotRanges = ["0–3.5s", "3.5–9.5s", "9.5–15.5s", "15.5–22s"];
                      const slotStarts = [0, 3.5, 9.5, 15.5];
                      const startSec = slotStarts[visualIdx];
                      const durationStr = slotRanges[visualIdx];

                      const isCurrentTimeInSlot =
                        visualIdx === 0 ? currentTime < 3.5 :
                        visualIdx === 1 ? (currentTime >= 3.5 && currentTime < 9.5) :
                        visualIdx === 2 ? (currentTime >= 9.5 && currentTime < 15.5) :
                        currentTime >= 15.5;

                      const isSlotActive = (generatedResult && isCurrentTimeInSlot) || activeScrubScene === sceneId;

                      let label = "Hook";
                      if (sceneId === 2) label = scene2AiGapFill ? "AI Gap" : "Product";
                      else if (sceneId === 3) label = scene3AiGapFill ? "AI Gap" : "B-Roll";
                      else if (sceneId === 4) label = "CTA";

                      return (
                        <button
                          key={`timeline-slot-${visualIdx}-${sceneId}`}
                          type="button"
                          onClick={() => seekToSegment(startSec, sceneId)}
                          className={`py-1.5 px-1 rounded-lg border text-center transition cursor-pointer truncate ${
                            isSlotActive
                              ? "bg-[#7F48ED]/10 border-[#7F48ED] text-[#7F48ED] font-bold ring-1 ring-[#7F48ED]"
                              : "bg-zinc-50 border-zinc-200 text-zinc-700 hover:bg-zinc-100"
                          }`}
                          title={`Slot ${visualIdx + 1} (${durationStr}): Scene ${sceneId} (${label}) - Click to preview`}
                        >
                          <span className="block font-bold">{durationStr}</span>
                          <span className="text-[8px] text-zinc-500 truncate block">{label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Detailed 4 Scene Cards (Drag and Drop Reordering) */}
                {timelineExpanded && (
                  <div className="space-y-1.5 pt-1 border-t border-zinc-100 text-[10px] animate-in fade-in duration-150">
                    <div className="flex items-center justify-between text-[9px] text-zinc-400 px-0.5 mb-1 font-sans">
                      <span>Drag cards to reorder scene sequence</span>
                      <span>22s Master</span>
                    </div>

                    {sceneOrder.map((sceneId, visualIdx) => {
                      const slotRanges = ["0–3.5s", "3.5–9.5s", "9.5–15.5s", "15.5–22s"];
                      const slotStarts = [0, 3.5, 9.5, 15.5];
                      const startSec = slotStarts[visualIdx];
                      const durationStr = slotRanges[visualIdx];
                      const isSelected = activeScrubScene === sceneId;

                      const isDragging = draggedSceneIdx === visualIdx;
                      const isDragOver = dragOverSceneIdx === visualIdx;

                      // Scene specific data
                      let sceneName = "Scene 1: Hook";
                      let badgeText = "Real Take";
                      let badgeStyle = "bg-emerald-100 text-emerald-800";
                      let subtitle = selectedHook || "Creator fronted hook take";
                      let hasAiGapToggle = false;
                      let isAiGap = false;

                      if (sceneId === 1) {
                        sceneName = "Scene 1: Hook";
                        badgeText = "Real Take";
                        badgeStyle = "bg-emerald-100 text-emerald-800";
                        subtitle = selectedHook || "Creator fronted hook take";
                      } else if (sceneId === 2) {
                        sceneName = "Scene 2: Product";
                        hasAiGapToggle = true;
                        isAiGap = scene2AiGapFill;
                        badgeText = scene2AiGapFill ? "AI Gap" : "Real Product";
                        badgeStyle = scene2AiGapFill ? "bg-purple-100 text-[#7F48ED]" : "bg-blue-100 text-blue-800";
                        subtitle = uploadedMediaName || `${brandName} Commercial Master`;
                      } else if (sceneId === 3) {
                        sceneName = "Scene 3: B-Roll";
                        hasAiGapToggle = true;
                        isAiGap = scene3AiGapFill;
                        badgeText = scene3AiGapFill ? "AI Gap" : "Real B-Roll";
                        badgeStyle = scene3AiGapFill ? "bg-purple-100 text-[#7F48ED]" : "bg-emerald-100 text-emerald-800";
                        subtitle = "Dynamic lifestyle & feature action";
                      } else if (sceneId === 4) {
                        sceneName = "Scene 4: CTA";
                        badgeText = "Branded CTA";
                        badgeStyle = "bg-orange-100 text-[#FF6700]";
                        subtitle = brandOffer || "Exclusive Offer End Card";
                      }

                      return (
                        <div key={`scene-wrapper-${sceneId}`} className="space-y-1.5">
                          <div
                            key={`scene-card-${sceneId}`}
                            draggable
                            onDragStart={(e) => handleDragStart(e, visualIdx)}
                            onDragOver={(e) => handleDragOver(e, visualIdx)}
                            onDrop={(e) => handleDrop(e, visualIdx)}
                            onDragEnd={handleDragEnd}
                            className={`p-2 rounded-xl border flex items-center justify-between gap-2 transition-all cursor-grab active:cursor-grabbing select-none ${
                              isDragging
                                ? "opacity-30 border-dashed border-[#7F48ED] bg-purple-50/30 scale-95"
                                : isDragOver
                                ? "border-[#7F48ED] ring-2 ring-[#7F48ED]/40 bg-purple-50/70 shadow-sm"
                                : isSelected
                                ? "bg-purple-50 border-purple-300 ring-2 ring-purple-200 shadow-2xs"
                                : "bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-2xs"
                            }`}
                          >
                            {/* Left: Drag Handle + Slot Number + Badges & Title (Single-line, No text wrapping!) */}
                            <div className="flex items-center gap-1.5 min-w-0 flex-1">
                              <GripVertical className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-700 shrink-0 cursor-grab active:cursor-grabbing" />
                              <span className="w-4 h-4 rounded-full bg-zinc-100 text-zinc-700 font-bold text-[9px] flex items-center justify-center shrink-0 border border-zinc-200">
                                {visualIdx + 1}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5 min-w-0">
                                  <span className={`text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded whitespace-nowrap shrink-0 ${badgeStyle}`}>
                                    {badgeText}
                                  </span>
                                  <span className="font-bold text-zinc-900 text-[11px] truncate">
                                    {sceneName}
                                  </span>
                                  <span className="text-[9px] text-zinc-400 font-mono shrink-0 whitespace-nowrap">
                                    ({durationStr})
                                  </span>
                                </div>
                                <div className="text-[9px] text-zinc-500 truncate font-sans">
                                  {subtitle}
                                </div>
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center gap-1.5 shrink-0 whitespace-nowrap">
                              {sceneId !== 4 && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActiveEditingScene(activeEditingScene === sceneId ? null : sceneId);
                                  }}
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition cursor-pointer shadow-2xs flex items-center gap-1 whitespace-nowrap ${
                                    activeEditingScene === sceneId
                                      ? "bg-purple-600 text-white border-purple-600 shadow-xs"
                                      : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                                  }`}
                                  title={`Adjust frame-accurate in/out trim for Scene ${sceneId}`}
                                >
                                  <Scissors className="w-2.5 h-2.5" />
                                  <span>{activeEditingScene === sceneId ? "Close" : "Trim"}</span>
                                </button>
                              )}

                              {hasAiGapToggle && (
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (sceneId === 2) setScene2AiGapFill(!scene2AiGapFill);
                                    if (sceneId === 3) setScene3AiGapFill(!scene3AiGapFill);
                                  }}
                                  className={`text-[9px] font-bold px-2 py-0.5 rounded border transition cursor-pointer shadow-2xs whitespace-nowrap ${
                                    isAiGap
                                      ? "bg-purple-100 text-[#7F48ED] border-purple-300 hover:bg-purple-200"
                                      : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                                  }`}
                                  title="Toggle between real physical footage and AI gap generation"
                                >
                                  {isAiGap ? "AI Gap" : "+ AI Gap"}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  seekToSegment(startSec, sceneId);
                                }}
                                className={`text-[9px] font-bold px-2 py-0.5 rounded border transition cursor-pointer shadow-2xs flex items-center gap-1 whitespace-nowrap ${
                                  sceneId === 4
                                    ? "bg-orange-50 text-[#FF6700] border-orange-200 hover:bg-orange-100"
                                    : "bg-purple-50 text-[#7F48ED] border-purple-200 hover:bg-purple-100"
                                }`}
                                title="Audition or scrub video to this scene"
                              >
                                <Play className="w-2.5 h-2.5 fill-current" />
                                <span>{generatedResult ? "Scrub" : "Preview"}</span>
                              </button>
                            </div>
                          </div>

                          {/* Inline Frame-Accurate Clip Trimmer Drawer */}
                          {activeEditingScene === sceneId && (
                            <div className="animate-in fade-in slide-in-from-top-1 duration-150 pl-1.5 border-l-2 border-[#7F48ED]">
                              {sceneId === 1 && (
                                <ClipTrimmer
                                  title="Scene 1: UGC Opening Hook"
                                  badgeLabel="Hook Take"
                                  videoUrl={activeCreatorAsset?.src || "/videos/sample-hook.mp4"}
                                  trimStart={trimStart}
                                  trimEnd={trimEnd}
                                  minDuration={1.0}
                                  maxDuration={5.5}
                                  recommendedTrim={activeCreatorAsset?.recommendedTrim}
                                  spokenText={activeCreatorAsset?.spokenText}
                                  accentColor="#10B981"
                                  noteText="Creator authentic opening take. ElevenLabs voiceover begins smoothly at out-point."
                                  onTrimChange={(start, end) => {
                                    setTrimStart(start);
                                    setTrimEnd(end);
                                  }}
                                  onClose={() => setActiveEditingScene(null)}
                                />
                              )}
                              {sceneId === 2 && (
                                <ClipTrimmer
                                  title="Scene 2: Product Feature Demonstration"
                                  badgeLabel="Feature Cut"
                                  videoUrl={uploadedMediaType === "video" && uploadedMediaSrc ? uploadedMediaSrc : (BRAND_PRESETS.find((p) => p.id === selectedPresetId)?.productVideo || BRAND_PRESETS.find((p) => p.id === selectedPresetId)?.brollVideo || "/videos/outdoor/trailline-mountain-ridge.mp4")}
                                  trimStart={scene2TrimStart}
                                  trimEnd={scene2TrimEnd}
                                  minDuration={1.0}
                                  maxDuration={6.5}
                                  accentColor="#2563EB"
                                  noteText="Precise in/out bounds for product demonstration clip."
                                  onTrimChange={(start, end) => {
                                    setScene2TrimStart(start);
                                    setScene2TrimEnd(end);
                                  }}
                                  onClose={() => setActiveEditingScene(null)}
                                />
                              )}
                              {sceneId === 3 && (
                                <ClipTrimmer
                                  title="Scene 3: Dynamic B-Roll Action"
                                  badgeLabel="B-Roll Cut"
                                  videoUrl={BRAND_PRESETS.find((p) => p.id === selectedPresetId)?.brollVideo || "/videos/chicago-dog-social-1.mp4"}
                                  trimStart={scene3TrimStart}
                                  trimEnd={scene3TrimEnd}
                                  minDuration={1.0}
                                  maxDuration={6.5}
                                  accentColor="#7F48ED"
                                  noteText="Frame-accurate lifestyle and motion b-roll selection."
                                  onTrimChange={(start, end) => {
                                    setScene3TrimStart(start);
                                    setScene3TrimEnd(end);
                                  }}
                                  onClose={() => setActiveEditingScene(null)}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* GENERATION MODE SWITCHER & ACTION BUTTON (Sticky Bottom Dock) */}
          <div className="sticky bottom-0 bg-white/95 backdrop-blur-md pt-2.5 pb-2 border-t border-zinc-200/90 -mx-4 -mb-4 px-4 sm:-mx-5 sm:px-5 z-20 shadow-[0_-8px_20px_rgba(0,0,0,0.04)] space-y-2">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200/80">
              <button
                type="button"
                onClick={() => setGenerationMode("single")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${generationMode === "single"
                    ? "bg-white text-zinc-900 shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                  }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#7F48ED]" />
                <span>Single Ad Master</span>
              </button>
              <button
                type="button"
                onClick={() => setGenerationMode("batch")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${generationMode === "batch"
                    ? "bg-[#7F48ED] text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900"
                  }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>5-Angle Batch</span>
              </button>
            </div>

            {/* Batch Mode Overview Card */}
            {generationMode === "batch" && (
              <div className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-zinc-900 uppercase tracking-wider text-[11px] flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-[#7F48ED]" />
                    High-Volume Campaign Engine
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-[#7F48ED] text-white px-2 py-0.5 rounded-full">
                    15 Deliverables
                  </span>
                </div>
                <p className="text-[11px] text-zinc-600">
                  Generates 5 distinct creative angles from this brief across all 3 ratios (9:16, 1:1, 4:5):
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[11px] font-semibold text-zinc-800">
                  <div className="flex items-center gap-1 text-purple-900">
                    <span className="text-[#7F48ED] font-mono font-bold">1.</span> Problem &amp; Solution
                  </div>
                  <div className="flex items-center gap-1 text-purple-900">
                    <span className="text-[#7F48ED] font-mono font-bold">2.</span> Creator Review
                  </div>
                  <div className="flex items-center gap-1 text-purple-900">
                    <span className="text-[#7F48ED] font-mono font-bold">3.</span> 3 Reasons Why
                  </div>
                  <div className="flex items-center gap-1 text-purple-900">
                    <span className="text-[#7F48ED] font-mono font-bold">4.</span> Us vs. Them
                  </div>
                  <div className="flex items-center gap-1 text-purple-900 col-span-1 sm:col-span-2">
                    <span className="text-[#7F48ED] font-mono font-bold">5.</span> Secret Life Hack
                  </div>
                </div>
              </div>
            )}

            {/* Action Trigger Button */}
            <button
              onClick={() => handleGenerate(generationMode === "batch")}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl font-black text-sm transition shadow-lg shadow-[#7F48ED]/25 flex items-center justify-center gap-2 cursor-pointer bg-[#7F48ED] hover:bg-[#6b35d6] text-white disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating
                ? generationMode === "batch"
                  ? "Rendering 5-Angle Campaign Batch..."
                  : "Rendering AI Commercial..."
                : generationMode === "batch"
                  ? "Generate 5-Angle Creative Batch (15 Assets)"
                  : "Generate AI Video Ad"}
            </button>

            {isGenerating && (
              <button
                type="button"
                onClick={handleCancelGeneration}
                className="w-full mt-2 py-2.5 rounded-xl font-bold text-xs text-[#FF6700] hover:text-white bg-orange-50 hover:bg-[#FF6700] border border-orange-200 hover:border-[#FF6700] transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
              >
                <X className="w-4 h-4" />
                <span>Cancel Generation</span>
              </button>
            )}
          </div>

          {/* MOBILE FIXED BOTTOM ACTION DOCK (Visible on mobile controls tab) */}
          <div className="lg:hidden fixed bottom-0 left-0 right-0 p-3 bg-white/95 backdrop-blur-md border-t border-zinc-200 z-30 shadow-2xl flex items-center justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider truncate">
                {brandName}
              </div>
              <div className="text-xs font-black text-zinc-900 truncate">
                {brandOffer}
              </div>
            </div>
            <button
              onClick={() => handleGenerate(generationMode === "batch")}
              disabled={isGenerating}
              className="py-2.5 px-4 rounded-xl font-black text-xs transition shadow-md shadow-[#7F48ED]/25 flex items-center justify-center gap-1.5 cursor-pointer bg-[#7F48ED] hover:bg-[#6b35d6] text-white disabled:opacity-50 shrink-0"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? "animate-spin" : ""}`} />
              <span>{isGenerating ? "Rendering..." : "Generate AI Ad"}</span>
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT STAGE: CLEAN LIGHT CANVAS & VIDEO PLAYER                */}
        {/* ============================================================== */}
        <div className={`flex-1 min-w-0 bg-[#F8F9FC] flex flex-col p-4 sm:p-5 relative gap-4 h-auto lg:h-full lg:overflow-y-auto min-h-0 ${mobileTab === "preview" ? "flex" : "hidden lg:flex"}`}>
          {/* Top Canvas Controls Bar (Clean White) */}
          <div className="w-full shrink-0 sticky top-0 z-20 flex flex-wrap items-center justify-between gap-3 bg-white border border-zinc-200/90 rounded-2xl px-4 py-3 shadow-sm">
            {/* Format Ratio Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-500 mr-1 hidden sm:inline uppercase tracking-wider">Format:</span>
              <button
                onClick={() => setAspectRatio("9:16")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${aspectRatio === "9:16" ? "bg-[#7F48ED] text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"
                  }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                9:16 Vertical
              </button>
              <button
                onClick={() => setAspectRatio("1:1")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${aspectRatio === "1:1" ? "bg-[#7F48ED] text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"
                  }`}
              >
                <Square className="w-3.5 h-3.5" />
                1:1 Square
              </button>
              <button
                onClick={() => setAspectRatio("4:5")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${aspectRatio === "4:5" ? "bg-[#7F48ED] text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"
                  }`}
              >
                4:5 Portrait
              </button>
            </div>

            {/* View Mode & Caption Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPhoneFrame(!showPhoneFrame)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${showPhoneFrame
                    ? "bg-[#FF6700] text-white border-[#FF6700]"
                    : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                  }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                {showPhoneFrame ? "Phone View" : "Studio Canvas"}
              </button>

              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition hidden sm:inline-flex items-center gap-1 cursor-pointer ${showCaptions
                    ? "bg-purple-100 text-[#7F48ED] border-purple-300"
                    : "bg-zinc-50 text-zinc-600 border-zinc-200 hover:bg-zinc-100"
                  }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Captions {showCaptions ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* HIGH-IMPACT ERROR BANNER (If fal.ai balance exhausted) */}
          {generationError && (
            <div className="w-full bg-red-50 border border-red-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-sm">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold text-red-900 uppercase tracking-wide">
                    {generationError.title}
                  </h4>
                  <p className="text-xs text-red-700 mt-0.5">
                    {generationError.message}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {generationError.balanceExhausted && (
                  <a
                    href={generationError.billingUrl || "https://fal.ai/dashboard/billing"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 bg-[#FF6700] hover:bg-[#e55c00] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
                  >
                    Top Up Balance
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setGenerationError(null)}
                  className="px-3 py-1.5 bg-white text-zinc-600 hover:text-zinc-900 rounded-xl text-xs font-semibold border border-zinc-200 transition cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS BANNER: Real AI Render (Single or Batch) */}
          {generatedResult && !generationError && (
            <div className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-3.5 flex flex-col gap-3 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-zinc-900 flex flex-wrap items-center gap-2">
                      <span>{batchJobsCreated ? "Batch Campaign Ready:" : "Generated AI Ad Ready:"} <span className="font-mono text-[#7F48ED]">{generatedResult.jobId}</span></span>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                        {batchJobsCreated ? "5-ANGLE BATCH GENERATED" : "GENUINE AI RENDER"}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-600">
                      {batchJobsCreated
                        ? "5 Creative Angles Generated (15 Deliverables: 9:16, 1:1, 4:5) ready for Quality Bar Sign-off"
                        : "Voiceover synced & all 3 ratios derived"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://drive.google.com/drive/folders/1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-2 bg-white hover:bg-zinc-100 text-zinc-700 border border-zinc-200 rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-sm"
                    title="Open client delivery archive on Google Drive"
                  >
                    <FolderOpen className="w-3.5 h-3.5 text-[#7F48ED]" />
                    <span>Open Drive</span>
                    <ExternalLink className="w-3 h-3 text-zinc-400" />
                  </a>
                  <Link
                    href={`/studio/review?variantId=${generatedResult.jobId}`}
                    className="px-4 py-2 bg-[#FF6700] hover:bg-[#e55c00] text-white rounded-xl text-xs font-bold transition shadow-md shadow-[#FF6700]/20 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Open in QA Review Room</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Quick Batch Variant Selector Pills */}
              {batchJobsCreated && batchJobsCreated.length > 0 && (
                <div className="pt-2 border-t border-purple-200/60 flex flex-wrap items-center gap-1.5">
                  <span className="text-[11px] font-bold text-purple-900 mr-1">Batch Angles:</span>
                  {batchJobsCreated.map((bJob, idx) => (
                    <Link
                      key={bJob.id}
                      href={`/studio/review?variantId=${bJob.id}`}
                      className="px-2.5 py-1 bg-white hover:bg-purple-100/80 text-purple-950 border border-purple-200 rounded-lg text-[11px] font-semibold transition flex items-center gap-1 shadow-2xs"
                    >
                      <span className="font-mono text-[#7F48ED] font-bold">#{idx + 1}</span>
                      <span>{bJob.creativeAngle}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Live Progress Scrubber (Clean Strip when video is rendered) */}
          {generatedResult && (
            <div className="w-full h-1.5 bg-zinc-200 rounded-full overflow-hidden shrink-0">
              <div
                className="h-full bg-gradient-to-r from-[#7F48ED] via-[#FF6700] to-[#7F48ED] transition-all duration-100"
                style={{ width: `${Math.min(100, (currentTime / 22.0) * 100)}%` }}
              />
            </div>
          )}

          {/* CENTERED VIDEO DISPLAY STAGE */}
          <div className="w-full shrink-0 flex items-center justify-center py-2 relative">
            {/* Master audio is embedded directly into the video stream for synchronized playback */}

            {/* Modern Interactive Studio Rendering Stage (Purple & Orange Theme) */}
            {isGenerating && (
              <div className="absolute inset-0 bg-zinc-950/95 backdrop-blur-2xl z-40 flex flex-col items-center justify-center p-4 sm:p-6 text-center rounded-3xl border border-zinc-800 shadow-2xl animate-in fade-in duration-300">
                <div className="w-full max-w-md bg-zinc-900/95 border border-[#7F48ED]/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(127,72,237,0.22)] space-y-4 text-center">
                  
                  {/* Interactive Full-Width ReLaunch Animated Video Screen */}
                  <div className="relative mx-auto flex items-center justify-center my-2">
                    {/* Glowing Purple/Orange Aura */}
                    <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-[#7F48ED]/40 via-[#FF6700]/30 to-[#7F48ED]/40 blur-xl animate-pulse" />
                    
                    {/* Glowing Animated Gradient Frame with Spark Boost Interaction */}
                    <button
                      type="button"
                      onClick={() => setSparkCount((c) => c + 1)}
                      title="Tap ReLaunch logo to boost sparks!"
                      className="relative p-[2px] rounded-2xl bg-gradient-to-r from-[#7F48ED] via-[#FF6700] to-[#7F48ED] shadow-[0_0_35px_rgba(127,72,237,0.35)] cursor-pointer hover:scale-105 active:scale-95 transition-transform duration-200 group"
                    >
                      <div className="relative w-64 sm:w-72 aspect-video rounded-[14px] overflow-hidden bg-black flex items-center justify-center">
                        <video
                          src="/logo.mp4"
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="w-full h-full object-contain pointer-events-none"
                        />
                        {/* Live AI Rendering Tag */}
                        <div className="absolute top-2 right-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-black/75 border border-white/15 text-[8px] font-mono text-white">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700] animate-pulse" />
                          <span>AI LIVE</span>
                        </div>
                      </div>
                    </button>
                  </div>

                  {/* Spark Boost Pill (Shows when tapped) */}
                  {sparkCount > 0 && (
                    <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#7F48ED]/20 to-[#FF6700]/20 border border-[#FF6700]/40 text-[10px] font-mono font-bold text-[#FF6700] animate-bounce">
                      <span>✨ {sparkCount} Boost Sparks! Keep tapping</span>
                    </div>
                  )}

                  {/* Brand & Step Notice */}
                  <div className="space-y-0.5">
                    <div className="text-[10px] font-black uppercase tracking-wider text-[#FF6700]">
                      Generating Commercial Ad
                    </div>
                    <h3 className="text-lg font-black text-white truncate px-2">
                      {brandName || "My Brand"}
                    </h3>
                    <p className="text-xs text-zinc-300 font-medium h-4 truncate px-2">
                      {genStepText || "Rendering commercial master..."}
                    </p>
                  </div>

                  {/* Modern Circular Loader Ring (Purple & Orange Theme - 100% Smooth Infinite Rotation) */}
                  <div className="flex items-center justify-center my-2">
                    <div className="relative w-10 h-10 flex items-center justify-center">
                      {/* Ambient Glowing Halo */}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7F48ED]/25 via-[#FF6700]/20 to-[#7F48ED]/25 blur-sm" />

                      {/* Static Track Ring */}
                      <div className="absolute w-8 h-8 rounded-full border-2 border-zinc-800" />

                      {/* Continuous Infinite Spinning Dual-Tone Ring (Linear, No Reset/No Snap) */}
                      <div
                        className="w-8 h-8 rounded-full border-2 border-transparent border-t-[#FF6700] border-r-[#7F48ED] animate-spin"
                        style={{
                          animationDuration: "0.85s",
                          animationTimingFunction: "linear",
                          animationIterationCount: "infinite",
                        }}
                      />

                      {/* Pulsing Core Spark */}
                      <div className="absolute w-2 h-2 rounded-full bg-gradient-to-tr from-[#7F48ED] to-[#FF6700] shadow-[0_0_8px_#FF6700] animate-pulse" />
                    </div>
                  </div>

                  {/* High-Precision Purple-to-Orange Progress Bar */}
                  <div className="space-y-1.5">
                    <div className="w-full h-2.5 bg-zinc-800 rounded-full overflow-hidden p-0.5 border border-zinc-700/40">
                      <div
                        className="h-full bg-gradient-to-r from-[#7F48ED] to-[#FF6700] rounded-full transition-all duration-300 shadow-[0_0_12px_rgba(255,103,0,0.5)]"
                        style={{ width: `${Math.max(4, Math.min(genProgress, 100))}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono px-0.5">
                      <span className="text-[#FF6700] font-black">
                        {Math.round(genProgress)}%
                      </span>
                      <span className="text-[#7F48ED] font-bold">
                        ETA: {etaFormatted}
                      </span>
                    </div>
                  </div>

                  {/* Elapsed Timer */}
                  <div className="text-[11px] font-mono text-zinc-400">
                    Elapsed: {Math.floor(elapsedSeconds / 60)}m {elapsedSeconds % 60}s
                  </div>


                  {/* Cancel Button (Purple & Orange Themed) */}
                  <button
                    type="button"
                    onClick={handleCancelGeneration}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm text-white bg-gradient-to-r from-[#7F48ED]/20 to-[#FF6700]/20 hover:from-[#7F48ED] hover:to-[#FF6700] border border-[#7F48ED]/50 hover:border-[#FF6700] hover:shadow-[0_0_20px_rgba(255,103,0,0.3)] group"
                  >
                    <X className="w-4 h-4 text-[#FF6700] group-hover:text-white group-hover:rotate-90 transition-transform" />
                    <span>Cancel Generation</span>
                  </button>
                </div>
              </div>
            )}

            {/* VIDEO PLAYER CONTAINER */}
            {showPhoneFrame ? (
              /* Phone Mockup View */
              <div className="relative h-[min(660px,calc(100vh-200px))] min-h-[520px] aspect-[9/16] bg-black rounded-[44px] border-[6px] border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-between p-2">
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800 rounded-full z-20" />
                {generatedResult ? (
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    {/* The Hero Video Track: Always genuine generated AI video */}
                    <video
                      ref={videoRef}
                      src={activeVideoSrc || ""}
                      playsInline
                      loop
                      muted={isMuted}
                      autoPlay
                      className="w-full h-full object-cover"
                    />


                    {/* Clean Social Media Ad Overlays */}
                    {(() => {
                      const activeCap = getActiveCaption(
                        currentTime,
                        generatedResult.hookText || selectedHook,
                        generatedResult.scriptBody || scriptBody,
                        generatedResult.brandOffer || brandOffer
                      );

                      return (
                        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-3.5 select-none">
                          {/* Top Header: Clean, subtle creator tag during hook only (0-3.5s) */}
                          <div className="flex items-center justify-between">
                            {currentTime < 3.5 ? (
                              <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white animate-in fade-in duration-200">
                                <span className="w-4 h-4 rounded-full bg-[#7F48ED] flex items-center justify-center text-[9px] font-bold">
                                  {(generatedResult.creator?.name || activeCreator.name).charAt(0)}
                                </span>
                                <span className="text-[11px] font-bold">{generatedResult.creator?.name || activeCreator.name}</span>
                              </div>
                            ) : (
                              <div />
                            )}
                          </div>

                          {/* Center High-Impact CTA End Card (only during final 16.5s – 22.0s) */}
                          {currentTime >= 16.5 && (
                            <div className="text-center bg-black/85 backdrop-blur-md rounded-2xl border border-white/20 p-4 mx-2 shadow-2xl animate-in zoom-in-95 duration-200 pointer-events-auto">
                              <span className="bg-[#FF6700] text-white text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full mb-1.5 inline-block shadow">
                                Limited Time Offer
                              </span>
                              <h3 className="text-base font-black text-white mb-0.5">{generatedResult.brandName || brandName}</h3>
                              <div className="text-xs font-bold text-yellow-300 mb-3">{generatedResult.brandOffer || brandOffer}</div>
                              <div className="px-4 py-2 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#FF6700] to-[#7F48ED] shadow-xl flex items-center justify-center gap-1">
                                <span>Claim Offer Now</span>
                                <ChevronRight className="w-3.5 h-3.5" />
                              </div>
                            </div>
                          )}

                          {/* Bottom Dynamic Kinetic Captions (TikTok/Reels style) */}
                          {showCaptions && (
                            <div className={`text-center ${currentTime >= 16.5 ? "mb-1" : "mb-8"} px-1.5 flex justify-center`}>
                              <div className="inline-block bg-black/80 backdrop-blur-md px-3.5 py-1.5 rounded-2xl border border-white/20 max-w-[96%] shadow-[0_8px_30px_rgba(0,0,0,0.9)] animate-in fade-in duration-150">
                                <div className="flex flex-wrap items-center justify-center gap-x-1 gap-y-0.5">
                                  {activeCap.words.map((w, wIdx) => {
                                    const isCurrent = w.toLowerCase().replace(/[^a-z0-9]/g, "") === activeCap.activeWord.toLowerCase().replace(/[^a-z0-9]/g, "");
                                    return (
                                      <span
                                        key={wIdx}
                                        className={`font-heading font-black text-[11px] sm:text-xs tracking-wide uppercase transition-all duration-75 ${isCurrent
                                            ? "text-[#FFE600] scale-110 drop-shadow-[0_2px_8px_rgba(255,230,0,0.6)] font-black"
                                            : activeCap.phase === "hook"
                                              ? "text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                                              : activeCap.phase === "cta"
                                                ? "text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                                                : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] opacity-95"
                                          }`}
                                      >
                                        {w}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Clean Play/Pause Toggle — Never shows a giant frozen pause icon */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer focus:outline-none"
                      title={isPlaying ? "Click to Pause" : "Click to Play"}
                    >
                      {!isPlaying && (
                        <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition transform hover:scale-105">
                          <Play className="w-5 h-5 fill-white ml-0.5" />
                        </div>
                      )}
                    </button>

                    {/* Unobtrusive Audio Mute Toggle + Tap for Sound Pill */}
                    <div className="absolute bottom-2.5 right-2.5 flex items-center gap-1.5 z-20">
                      {isMuted && (
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="bg-black/85 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-xl hover:bg-black transition cursor-pointer animate-pulse"
                        >
                          <VolumeX className="w-3 h-3 text-red-400" />
                          <span>Tap for Sound</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="p-2 rounded-full bg-black/70 hover:bg-black text-white transition cursor-pointer shadow-lg border border-white/10"
                        title={isMuted ? "Unmute Voiceover & Music" : "Mute"}
                      >
                        {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                      </button>
                    </div>
                  </div>
                ) : (uploadedImages.length > 0 || (uploadedMediaType === "image" && uploadedMediaSrc)) ? (
                  activeCreator?.hasVideoTakes && activeCreatorAsset?.src ? (
                    /* Show Creator Footage Video Take First + Reference Images Strip in Phone Mockup */
                    <div className="absolute inset-0 w-full h-full overflow-hidden select-none bg-black">
                      <video
                        ref={videoRef}
                        src={activeCreatorAsset.src}
                        playsInline
                        loop
                        muted={isMuted}
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                      {/* Top Header Badge */}
                      <div className="absolute top-8 left-3.5 right-3.5 z-20 flex items-start justify-between gap-2 flex-wrap pointer-events-none">
                        <div className="flex items-center gap-1.5 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/20 text-white shadow-xl min-w-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span className="text-[10px] font-bold truncate">1. Hook: {activeCreator.name}</span>
                        </div>
                        <div className="bg-[#7F48ED] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow whitespace-nowrap shrink-0">
                          Pure Kling AI to Follow
                        </div>
                      </div>

                      {/* Bottom Reference Images Showcase Pill */}
                      <div className="absolute bottom-16 left-3.5 right-3.5 z-20 pointer-events-auto">
                        <div className="bg-black/85 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-2xl space-y-1">
                          <div className="text-[9px] font-bold text-zinc-300 flex items-center gap-1 px-0.5">
                            <Sparkles className="w-3 h-3 text-[#FF6700]" />
                            <span>AI Video: {uploadedImages.length || 1} Reference Image{uploadedImages.length > 1 ? "s" : ""}</span>
                          </div>
                          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5" style={{ scrollbarWidth: "none" }}>
                            {(uploadedImages.length > 0 ? uploadedImages : [{ id: "1", src: uploadedMediaSrc || "", name: uploadedMediaName || "Image" }]).map((img, i) => (
                              <div key={img.id || i} className="relative w-8 h-8 rounded-lg overflow-hidden shrink-0 border border-white/30 shadow-xs">
                                <img src={img.src} alt={img.name} className="w-full h-full object-cover" />
                                <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[7px] font-mono text-white px-0.5 rounded">
                                  #{i + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Pure AI Image Gallery Preview (e.g. Emma Davis) in Phone Mockup */
                    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-4 select-none">
                      <div className="relative max-h-[55%] max-w-[80%] rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-2 bg-black">
                        <img
                          src={uploadedImages[0]?.src || uploadedMediaSrc || ""}
                          alt="Product"
                          className="max-h-full max-w-full object-contain"
                        />
                        <div className="absolute top-2 left-2 bg-[#FF6700] text-white px-2 py-0.5 rounded-full text-[9px] font-bold shadow">
                          #1 Start Frame
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto max-w-[85%] pb-1">
                        {uploadedImages.map((img, i) => (
                          <div key={img.id || i} className="relative w-9 h-9 rounded-lg overflow-hidden shrink-0 border border-white/20">
                            <img src={img.src} alt={img.name} className="w-full h-full object-cover" />
                            <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[7px] font-mono text-white px-0.5 rounded">
                              #{i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-1 text-[9px] font-bold text-purple-300 mt-2 bg-purple-950/70 border border-purple-800/60 px-2.5 py-1 rounded-full">
                        <Sparkles className="w-2.5 h-2.5 text-amber-300" />
                        <span>Pure Kling AI Video · {activeCreator.name} Voice</span>
                      </div>
                    </div>
                  )
                ) : (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#090D16] text-white">
                    <div className="w-14 h-14 rounded-2xl bg-[#7F48ED]/15 border border-[#7F48ED]/30 flex items-center justify-center mb-3 shadow-lg shadow-[#7F48ED]/20">
                      <Sparkles className="w-6 h-6 text-[#FF6700]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#FF6700] uppercase tracking-wider mb-1">
                      Ready to Generate
                    </span>
                    <h4 className="text-xs font-bold text-white mb-2">{brandName}</h4>
                    <p className="text-[10px] text-zinc-400 max-w-[170px] leading-tight">
                      Click &ldquo;Generate AI Video Ad&rdquo; to render your real video.
                    </p>
                  </div>
                )}

                {/* TikTok UI Icons */}
                {generatedResult && (
                  <div className="absolute right-3 bottom-16 flex flex-col items-center gap-4 z-10 text-white">
                    <div className="flex flex-col items-center">
                      <Heart className="w-6 h-6 text-white fill-white/90" />
                      <span className="text-[11px] font-bold">24.2k</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <MessageCircle className="w-6 h-6 text-white" />
                      <span className="text-[11px] font-bold">384</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Bookmark className="w-6 h-6 text-white" />
                      <span className="text-[11px] font-bold">1.2k</span>
                    </div>
                    <div className="flex flex-col items-center">
                      <Share2 className="w-6 h-6 text-white" />
                    </div>
                  </div>
                )}

                {/* Bottom Handle */}
                <div className="absolute bottom-4 left-3.5 right-16 z-10 space-y-1">
                  <div className="font-extrabold text-xs text-white drop-shadow">@{(brandName || "brand").toLowerCase().replace(/\s+/g, "")}</div>
                  <div className="text-[12px] text-zinc-100 line-clamp-2 drop-shadow font-medium leading-tight">
                    {selectedHook}
                  </div>
                </div>

                {/* Phone Audio Toggle */}
                <button
                  type="button"
                  onClick={toggleMute}
                  className="absolute bottom-4 right-3.5 p-2 rounded-full bg-black/75 text-white hover:bg-black/95 transition z-20 cursor-pointer shadow-lg border border-white/10"
                  title={isMuted ? "Unmute Voiceover" : "Mute Voiceover"}
                >
                  {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                </button>
              </div>
            ) : (
              /* Clean Studio Canvas Player */
              <div
                className={`relative flex items-center justify-center transition-all duration-300 overflow-hidden bg-black rounded-2xl border border-zinc-300/80 shadow-2xl ${aspectRatio === "9:16"
                    ? "h-[min(650px,calc(100vh-200px))] min-h-[520px] aspect-[9/16]"
                    : aspectRatio === "1:1"
                      ? "h-[min(540px,calc(100vh-220px))] min-h-[460px] aspect-square"
                      : "h-[min(590px,calc(100vh-210px))] min-h-[490px] aspect-[4/5]"
                  }`}
              >
                {/* 3-PART HYBRID AD ENGINE PLAYBACK */}
                {generatedResult ? (
                  <div className="relative w-full h-full overflow-hidden select-none">
                    {/* The Hero Video Track: Always genuine generated AI video */}
                    <video
                      ref={videoRef}
                      src={activeVideoSrc || ""}
                      playsInline
                      loop
                      muted={isMuted}
                      autoPlay
                      className="w-full h-full object-cover"
                    />



                    {/* Clean Social Media Ad Overlays */}
                    {(() => {
                      const activeCap = getActiveCaption(
                        currentTime,
                        generatedResult.hookText || selectedHook,
                        generatedResult.scriptBody || scriptBody,
                        generatedResult.brandOffer || brandOffer
                      );

                      return (
                        <div className="absolute inset-0 z-20 pointer-events-none flex flex-col justify-between p-5 select-none">
                          {/* Top Header: Clean, subtle creator badge during hook only (0-3.5s) AND targeted AI disclosure */}
                          <div className="flex items-center justify-between">
                            {currentTime < 3.5 ? (
                              <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white w-fit shadow-xl animate-in fade-in duration-200">
                                <div className="w-5 h-5 rounded-full bg-[#7F48ED] flex items-center justify-center text-[10px] font-black shrink-0">
                                  {(generatedResult.creator?.name || activeCreator.name).charAt(0)}
                                </div>
                                <span className="text-xs font-bold">{generatedResult.creator?.name || activeCreator.name}</span>
                              </div>
                            ) : (
                              <div />
                            )}

                            {/* Targeted AI Disclosure: strictly visible ONLY on scenes marked as AI gap-fill */}
                            {(() => {
                              const isAiGapSegment =
                                (currentTime >= 3.5 && currentTime < 9.5 && scene2AiGapFill) ||
                                (currentTime >= 9.5 && currentTime < 15.5 && scene3AiGapFill);
                              if (!isAiGapSegment) return null;
                              return (
                                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-purple-400/40 text-purple-200 text-[10px] font-bold shadow-lg animate-in fade-in duration-150">
                                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                                  <span>AI Visual Demonstration</span>
                                </div>
                              );
                            })()}
                          </div>

                          {/* Center High-Impact Branded CTA (only during final 15.5s – 22.0s) */}
                          {currentTime >= 15.5 && (
                            <div className="animate-in zoom-in-95 duration-200 pointer-events-auto mx-auto max-w-sm w-full">
                              {selectedCtaTemplate === "social-proof" ? (
                                <div className="bg-black/85 backdrop-blur-md rounded-2xl border border-emerald-400/30 p-5 text-center shadow-2xl">
                                  <div className="inline-flex items-center gap-1.5 bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-extrabold uppercase px-3 py-1 rounded-full mb-2">
                                    <ShieldCheck className="w-3.5 h-3.5" />
                                    <span>{claimSubstantiation || "Official 30-Day Money-Back Guarantee"}</span>
                                  </div>
                                  <h3 className="text-xl font-black text-white mb-1 drop-shadow-md">
                                    {generatedResult.brandName || brandName}
                                  </h3>
                                  <p className="text-xs text-zinc-300 mb-3">
                                    {generatedResult.brandOffer || brandOffer}
                                  </p>
                                  <div className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#FF6700] to-[#7F48ED] shadow-xl flex items-center justify-center gap-1.5 ring-2 ring-white/20 cursor-pointer">
                                    <span>Claim Verified Offer</span>
                                    <ChevronRight className="w-4 h-4" />
                                  </div>
                                </div>
                              ) : selectedCtaTemplate === "native-tag" ? (
                                <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 text-zinc-900 shadow-2xl border border-zinc-200">
                                  <div className="flex items-center justify-between gap-3 mb-2.5">
                                    <div className="flex items-center gap-2">
                                      <div className="w-8 h-8 rounded-lg bg-[#FF6700]/10 text-[#FF6700] flex items-center justify-center font-black text-sm">
                                        🛍️
                                      </div>
                                      <div>
                                        <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500">Official Store</div>
                                        <div className="text-xs font-black text-zinc-900 truncate max-w-[160px]">{generatedResult.brandName || brandName}</div>
                                      </div>
                                    </div>
                                    <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-md">
                                      Verified
                                    </span>
                                  </div>
                                  <div className="text-xs font-bold text-zinc-700 mb-3 truncate">
                                    {generatedResult.brandOffer || brandOffer}
                                  </div>
                                  <div className="w-full py-2.5 rounded-xl text-xs font-black text-white bg-black hover:bg-zinc-800 shadow-lg flex items-center justify-center gap-1.5 cursor-pointer">
                                    <span>View Product In Store</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              ) : selectedCtaTemplate === "luxury-card" ? (
                                <div className="bg-black/90 backdrop-blur-md rounded-2xl border border-purple-500/40 p-6 text-center shadow-2xl ring-1 ring-purple-500/20">
                                  <span className="text-[9px] uppercase tracking-[0.25em] text-[#7F48ED] font-black block mb-1">
                                    Signature Collection
                                  </span>
                                  <h3 className="text-2xl font-black text-white tracking-tight mb-1">
                                    {generatedResult.brandName || brandName}
                                  </h3>
                                  <p className="text-xs text-zinc-300 font-light mb-4">
                                    {generatedResult.brandOffer || brandOffer}
                                  </p>
                                  <div className="px-6 py-2.5 rounded-full text-xs font-black text-white bg-gradient-to-r from-[#7F48ED] to-[#FF6700] shadow-xl flex items-center justify-center gap-1.5 ring-1 ring-white/30 cursor-pointer">
                                    <span>Reserve Now</span>
                                    <ChevronRight className="w-3.5 h-3.5" />
                                  </div>
                                </div>
                              ) : (
                                /* promo-stamp (default) */
                                <div className="text-center bg-black/85 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-2xl">
                                  {selectedTrustBadgeId && (
                                    <div className="inline-flex items-center gap-1 bg-amber-400/20 text-amber-300 border border-amber-400/30 text-[9px] font-extrabold uppercase px-2.5 py-0.5 rounded-full mb-2">
                                      <span>{TRUST_BADGE_PRESETS.find((b) => b.id === selectedTrustBadgeId)?.label || "🛡️ 30-Day Money-Back Guarantee"}</span>
                                    </div>
                                  )}
                                  <div>
                                    <span
                                      className="text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2 inline-block shadow"
                                      style={{ backgroundColor: ctaBrandColor }}
                                    >
                                      {ctaDiscountTag || "Limited Time Offer"}
                                    </span>
                                  </div>
                                  <h3 className="text-xl font-black text-white mb-1 drop-shadow-md">
                                    {generatedResult.brandName || brandName}
                                  </h3>
                                  <div className="text-sm font-bold text-yellow-300 mb-4 drop-shadow">
                                    {generatedResult.brandOffer || brandOffer}
                                  </div>
                                  <div
                                    className="px-5 py-2.5 rounded-xl text-xs font-black text-white shadow-xl flex items-center justify-center gap-1.5 ring-2 ring-white/20 cursor-pointer"
                                    style={{ backgroundColor: ctaBrandColor }}
                                  >
                                    <span>Claim Offer Now</span>
                                    <ChevronRight className="w-4 h-4" />
                                  </div>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Bottom Dynamic Kinetic Captions (TikTok/Reels style) */}
                          {showCaptions && (
                            <div className={`text-center ${currentTime >= 16.5 ? "mb-2" : "mb-10"} px-2 flex justify-center`}>
                              <div className="inline-block bg-black/80 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20 max-w-[92%] shadow-[0_8px_32px_rgba(0,0,0,0.9)] animate-in fade-in duration-150">
                                <div className="flex flex-wrap items-center justify-center gap-x-1.5 gap-y-0.5">
                                  {activeCap.words.map((w, wIdx) => {
                                    const isCurrent = w.toLowerCase().replace(/[^a-z0-9]/g, "") === activeCap.activeWord.toLowerCase().replace(/[^a-z0-9]/g, "");
                                    return (
                                      <span
                                        key={wIdx}
                                        className={`font-heading font-black text-xs sm:text-sm tracking-wide uppercase transition-all duration-75 ${isCurrent
                                            ? "text-[#FFE600] scale-110 drop-shadow-[0_2px_8px_rgba(255,230,0,0.6)] font-black"
                                            : activeCap.phase === "hook"
                                              ? "text-yellow-100 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                                              : activeCap.phase === "cta"
                                                ? "text-amber-200 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                                                : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] opacity-95"
                                          }`}
                                      >
                                        {w}
                                      </span>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Clean Play/Pause Toggle — Never shows a giant frozen pause icon */}
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="absolute inset-0 flex items-center justify-center z-10 cursor-pointer focus:outline-none"
                      title={isPlaying ? "Click to Pause" : "Click to Play"}
                    >
                      {!isPlaying && (
                        <div className="w-14 h-14 rounded-full bg-black/60 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl transition transform hover:scale-105">
                          <Play className="w-6 h-6 fill-white ml-0.5" />
                        </div>
                      )}
                    </button>

                    {/* Bottom Right Audio Mute Button with Tap for Sound Pill */}
                    <div className="absolute bottom-3 right-3 flex items-center gap-2 z-20 pointer-events-auto">
                      {isMuted && (
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="bg-black/85 backdrop-blur-md border border-white/20 text-white text-[11px] font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-xl hover:bg-black transition cursor-pointer animate-pulse"
                        >
                          <VolumeX className="w-3.5 h-3.5 text-red-400" />
                          <span>Tap for Sound</span>
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={toggleMute}
                        className="p-2.5 rounded-full bg-black/75 text-white hover:bg-black/95 transition cursor-pointer shadow-lg border border-white/10"
                        title={isMuted ? "Unmute Voiceover" : "Mute Voiceover"}
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                      </button>
                    </div>
                  </div>
                ) : (uploadedImages.length > 0 || (uploadedMediaType === "image" && uploadedMediaSrc)) ? (
                  activeCreator?.hasVideoTakes && activeCreatorAsset?.src ? (
                    /* Show Creator Footage Video Take First + Reference Images Strip */
                    <div className="relative w-full h-full overflow-hidden select-none bg-black">
                      <video
                        ref={videoRef}
                        src={activeCreatorAsset.src}
                        playsInline
                        loop
                        muted={isMuted}
                        autoPlay
                        className="w-full h-full object-cover"
                      />
                      {/* Top Header Badge */}
                      <div className="absolute top-3.5 left-3.5 right-3.5 z-20 flex items-start justify-between gap-2 flex-wrap pointer-events-none">
                        <div className="flex items-center gap-2 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white shadow-xl min-w-0">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                          <span className="text-xs font-bold truncate">1. Creator Hook (0–3.5s): {activeCreator.name}</span>
                        </div>
                        <div className="bg-[#7F48ED] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg whitespace-nowrap shrink-0">
                          Followed by Pure Kling AI
                        </div>
                      </div>

                      {/* Bottom Reference Images Showcase Pill */}
                      <div className="absolute bottom-3 left-3.5 right-14 z-20 pointer-events-auto">
                        <div className="bg-black/85 backdrop-blur-md border border-white/20 rounded-2xl p-2 shadow-2xl space-y-1">
                          <div className="text-[10px] font-bold text-zinc-300 flex items-center gap-1.5 px-1">
                            <Sparkles className="w-3 h-3 text-[#FF6700]" />
                            <span>AI Video Basis: {uploadedImages.length || 1} Reference Image{uploadedImages.length > 1 ? "s" : ""}</span>
                          </div>
                          <div className="flex items-center gap-1.5 overflow-x-auto py-0.5" style={{ scrollbarWidth: "none" }}>
                            {(uploadedImages.length > 0 ? uploadedImages : [{ id: "1", src: uploadedMediaSrc || "", name: uploadedMediaName || "Image" }]).map((img, i) => (
                              <div key={img.id || i} className="relative w-10 h-10 rounded-lg overflow-hidden shrink-0 border border-white/30 shadow-xs">
                                <img src={img.src} alt={img.name} className="w-full h-full object-cover" />
                                <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-mono text-white px-1 rounded">
                                  #{i + 1}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Audio mute button */}
                      <div className="absolute bottom-3 right-3 z-20 pointer-events-auto">
                        <button
                          type="button"
                          onClick={toggleMute}
                          className="p-2.5 rounded-full bg-black/75 text-white hover:bg-black/95 transition cursor-pointer shadow-lg border border-white/10"
                          title={isMuted ? "Unmute Hook Preview" : "Mute Hook Preview"}
                        >
                          {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Pure AI Image Gallery Preview (e.g. Emma Davis) */
                    <div className="relative w-full h-full flex flex-col items-center justify-center bg-zinc-950 p-4 select-none">
                      <div className="relative max-h-[70%] max-w-[85%] rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-3 bg-black">
                        <img
                          src={uploadedImages[0]?.src || uploadedMediaSrc || ""}
                          alt="Product"
                          className="max-h-full max-w-full object-contain"
                        />
                        <div className="absolute top-2.5 left-2.5 bg-[#FF6700] text-white px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow">
                          Image #1 (Start Frame)
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 overflow-x-auto max-w-[90%] pb-1">
                        {uploadedImages.map((img, i) => (
                          <div key={img.id || i} className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/20">
                            <img src={img.src} alt={img.name} className="w-full h-full object-cover" />
                            <span className="absolute bottom-0.5 right-0.5 bg-black/80 text-[8px] font-mono text-white px-1 rounded">
                              #{i + 1}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="inline-flex items-center gap-1.5 text-[10px] font-bold text-purple-300 mt-2 bg-purple-950/70 border border-purple-800/60 px-3 py-1 rounded-full">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>100% Pure Kling AI Video Mode · {activeCreator.name} Voice</span>
                      </div>
                    </div>
                  )
                ) : (
                  /* Zero Demo Video Empty State: Clean Stage Ready for Generation */
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 sm:p-5 text-center bg-[#090D16] text-white select-none">
                    <div className="w-14 h-14 rounded-2xl bg-[#7F48ED]/15 border border-[#7F48ED]/30 flex items-center justify-center mb-3 shadow-lg shadow-[#7F48ED]/20">
                      <Sparkles className="w-7 h-7 text-[#FF6700]" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700] animate-pulse" />
                      <span>{activeScrubScene ? `Auditioning Scene ${activeScrubScene}` : "Stage Ready · Live Engine"}</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      {activeScrubScene ? (
                        activeScrubScene === 1 ? "Scene 1: Creator Hook (0–3.5s)" :
                        activeScrubScene === 2 ? "Scene 2: Product Demo (3.5–9.5s)" :
                        activeScrubScene === 3 ? "Scene 3: B-Roll Action (9.5–15.5s)" :
                        "Scene 4: Branded CTA (15.5–22s)"
                      ) : (
                        `${brandName} Commercial`
                      )}
                    </h3>
                    <p className="text-[11px] text-zinc-400 max-w-[220px] leading-relaxed mb-4">
                      {activeScrubScene ? (
                        activeScrubScene === 1 ? (selectedHook || "High-CTR fronted creator hook take") :
                        activeScrubScene === 2 ? `${brandName} product demonstration cut` :
                        activeScrubScene === 3 ? "Dynamic lifestyle and feature showcase cut" :
                        (brandOffer || "High CTR closing branded offer end card")
                      ) : (
                        "Click \u201cGenerate AI Video Ad\u201d on the left to synthesize the real AI scene and ElevenLabs audio."
                      )}
                    </p>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 w-full max-w-[240px] text-left text-[10px] space-y-1 font-mono text-zinc-300">
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Ratio:</span>
                        <span className="text-white font-bold">{aspectRatio}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Creator:</span>
                        <span className="text-[#A78BFA] font-bold truncate max-w-[130px]">{activeCreator.name.split(" ")[0]}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-zinc-500">Angle:</span>
                        <span className="text-[#FF8533] font-bold truncate max-w-[130px]">{currentAngleData?.title}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* BOTTOM STAGE ACTION TOOLBAR (Clean White Card) */}
          <div className="w-full shrink-0 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-zinc-200/90 rounded-2xl p-3.5 shadow-sm">
            <div className="text-xs text-zinc-600">
              Active Brand: <span className="font-extrabold text-zinc-900">{brandName}</span> · Offer: <span className="text-[#FF6700] font-bold">{brandOffer}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
              {activeVideoSrc ? (
                <>
                  <a
                    href={activeVideoSrc}
                    download={generatedResult ? `relaunch-${generatedResult.jobId}-${aspectRatio}.mp4` : `${(brandName || "brand").toLowerCase().replace(/\s+/g, "-")}-${aspectRatio}.mp4`}
                    className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download MP4</span>
                  </a>

                  {generatedResult?.video4k && (
                    <a
                      href={generatedResult.video4k}
                      download={`relaunch-${generatedResult.jobId}-4k-master.mp4`}
                      className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Download 4K Ultra-HD Master (2160x3840) for Premiere / DaVinci finish"
                    >
                      <Zap className="w-3.5 h-3.5 text-[#7F48ED]" />
                      <span>4K Pro Master</span>
                    </a>
                  )}

                  {generatedResult?.stems?.voiceover && (
                    <a
                      href={generatedResult.stems.voiceover}
                      download={`relaunch-${generatedResult.jobId}-stem-vo.wav`}
                      className="flex-1 sm:flex-initial px-3 py-2 rounded-xl text-xs font-bold text-zinc-600 bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      title="Download clean lossless voiceover audio stem"
                    >
                      <span>Audio Stems</span>
                    </a>
                  )}

                  {generatedResult && (
                    <>
                      <a
                        href={`/api/studio/export/xml?jobId=${generatedResult.jobId}&brand=${encodeURIComponent(brandName)}`}
                        download={`relaunch-${generatedResult.jobId}-timeline-premiere-davinci.xml`}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Export Premiere Pro / DaVinci Resolve XML Timeline Project"
                      >
                        <Film className="w-3.5 h-3.5 text-blue-600" />
                        <span>Timeline XML</span>
                      </a>

                      <a
                        href={`/api/studio/export/kit?jobId=${generatedResult.jobId}`}
                        download={`relaunch-${generatedResult.jobId}-editor-kit.zip`}
                        className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl text-xs font-extrabold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                        title="Download Complete 80/20 Editor Finishing Kit (.ZIP) with 4K master, stems, and timeline"
                      >
                        <FolderDown className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Editor Kit (.ZIP)</span>
                      </a>
                    </>
                  )}
                </>
              ) : null}

              <Link
                href={generatedResult ? `/studio/review?variantId=${generatedResult.jobId}` : "/studio/review"}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#FF6700] hover:bg-[#e55c00] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#FF6700]/20 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{generatedResult ? "Review & Sign Off" : "Open in QA Review Room"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Voice Balance Alert Pre-Flight Modal */}
          {showVoiceBalanceModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl max-w-md w-full p-5 border border-zinc-200 shadow-2xl space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-bold text-sm text-zinc-900">
                      Voice Balance / Subscription Notice
                    </h3>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      You selected <strong className="text-zinc-900">{activeVoice?.name}</strong>.
                      ElevenLabs restricts library voices on Free accounts (<code className="text-amber-800 bg-amber-50 px-1 py-0.5 rounded font-mono text-[11px]">HTTP 402 Payment Required</code>).
                    </p>
                    <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                      To avoid waiting for video rendering only to find missing audio, switch to a voice with active credits:
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-zinc-50 rounded-xl border border-zinc-200/80 space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                    Recommended Ready Voices (Free & Paid Tiers)
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVoiceId("pNInz6obpgDQGcFmaJgB");
                        setShowVoiceBalanceModal(false);
                        setTimeout(() => executeGenerate(pendingBatchMode, "pNInz6obpgDQGcFmaJgB"), 50);
                      }}
                      className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-950">Adam</span>
                        <span className="text-[9px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">Male</span>
                      </div>
                      <div className="text-[10px] text-emerald-800 mt-0.5">Commercial & Converting</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVoiceId("EXAVITQu4vr4xnSDxMaL");
                        setShowVoiceBalanceModal(false);
                        setTimeout(() => executeGenerate(pendingBatchMode, "EXAVITQu4vr4xnSDxMaL"), 50);
                      }}
                      className="p-2.5 rounded-xl border border-emerald-300 bg-emerald-50/70 hover:bg-emerald-100 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-emerald-950">Bella</span>
                        <span className="text-[9px] bg-emerald-200 text-emerald-900 font-bold px-1.5 py-0.2 rounded">Female</span>
                      </div>
                      <div className="text-[10px] text-emerald-800 mt-0.5">Soft & Beauty Lifestyle</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVoiceId("ErXwobaYiN019PkySvjV");
                        setShowVoiceBalanceModal(false);
                        setTimeout(() => executeGenerate(pendingBatchMode, "ErXwobaYiN019PkySvjV"), 50);
                      }}
                      className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-900">Antoni</span>
                        <span className="text-[9px] bg-zinc-100 text-zinc-700 font-bold px-1.5 py-0.2 rounded">Male</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">Corporate & Narration</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedVoiceId("pFZP5JQG7iQjIQuC4Bku");
                        setShowVoiceBalanceModal(false);
                        setTimeout(() => executeGenerate(pendingBatchMode, "pFZP5JQG7iQjIQuC4Bku"), 50);
                      }}
                      className="p-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-left transition cursor-pointer"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-zinc-900">Lily</span>
                        <span className="text-[9px] bg-zinc-100 text-zinc-700 font-bold px-1.5 py-0.2 rounded">Female</span>
                      </div>
                      <div className="text-[10px] text-zinc-500 mt-0.5">Warm & Relatable UGC</div>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-zinc-100">
                  <button
                    type="button"
                    onClick={() => setShowVoiceBalanceModal(false)}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100 transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowVoiceBalanceModal(false);
                      executeGenerate(pendingBatchMode);
                    }}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-900 bg-amber-100 hover:bg-amber-200 transition cursor-pointer"
                  >
                    Proceed with {activeVoice?.name} (I have paid balance)
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      {/* Dynamic Master Assets Manager Modal (Licensed Music & Branded CTAs) */}
      <MasterAssetsModal
        isOpen={showMasterAssetsModal}
        initialTab={masterAssetModalTab}
        onClose={() => setShowMasterAssetsModal(false)}
        musicTracks={musicLibrary}
        ctaTemplates={ctaTemplatesList}
        onTrackCreated={(newTrack) => {
          setMusicLibrary((prev) => [newTrack, ...prev]);
          setSelectedMusicTrackId(newTrack.id);
        }}
        onTrackDeleted={(deletedId) => {
          setMusicLibrary((prev) => prev.filter((t) => t.id !== deletedId));
          if (selectedMusicTrackId === deletedId) {
            setSelectedMusicTrackId("energy-direct-response");
          }
        }}
        onCtaCreated={(newCta) => {
          setCtaTemplatesList((prev) => [newCta, ...prev]);
          setSelectedCtaTemplate(newCta.id);
        }}
      />
    </div>
  );
}
