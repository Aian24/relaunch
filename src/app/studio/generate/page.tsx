"use client";

import React, { useState, useRef, useEffect } from "react";
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
  Sliders,
  Check,
  ChevronDown,
  Shuffle,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Upload,
  Layers,
  Edit3,
} from "lucide-react";

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
  offer: string;
  videoSrc: string;
  angles: {
    problem: AngleContent;
    ugc: AngleContent;
    listicle: AngleContent;
    comparison: AngleContent;
  };
}

const PRESETS: BrandPreset[] = [
  {
    id: "chicago-dog",
    name: "Chicago Dog House",
    category: "Food & Street Dining",
    offer: "15% off first pickup order",
    videoSrc: "/videos/chicago-dog-social-1.mp4",
    angles: {
      problem: {
        title: "Problem & Solution",
        badge: "Scale",
        hooks: [
          "Stop scrolling if you're sick of paying $18 for lunch that leaves you disappointed.",
          "If you're still settling for generic fast food hot dogs in 2026, watch this.",
          "The real reason most lunch spots in Lincoln Park leave you starving by 3 PM.",
          "Why does nobody talk about how bad typical drive-thru hot dogs actually are?",
        ],
        body: "Authentic Vienna beef snapped on steamed poppy seed buns, loaded with sport peppers, neon relish, and celery salt. Zero ketchup allowed. Pure Chicago perfection.",
      },
      ugc: {
        title: "Creator Review",
        badge: "Trust",
        hooks: [
          "I was super skeptical about the hype until I tried this myself.",
          "This one lunch spot completely ruined all other hot dogs for me forever.",
          "Here's what happened when I finally tried Chicago's most famous street food.",
          "Ranking the top 3 meals in Lincoln Park—number one blew my mind.",
        ],
        body: "Honestly, I thought it was just another hyped-up food reel. But one bite into that Vienna beef snap, and I get it. Fresh steamed bun, crisp relish, pure flavor without the tourist line.",
      },
      listicle: {
        title: "3 Reasons Why",
        badge: "Clicks",
        hooks: [
          "3 reasons everyone in Lincoln Park is quietly addicted to this lunch spot.",
          "Reason number 3 is why I will never eat a standard drive-thru hot dog again.",
          "Before you buy lunch anywhere else today, check these 3 facts first.",
          "3 signs you've found the most authentic street food in the city.",
        ],
        body: "Reason 1: 100% authentic Vienna beef natural casing snap. Reason 2: Fresh poppy seed buns steamed to order. Reason 3: Over 800 verified 5-star local foodie reviews.",
      },
      comparison: {
        title: "Us vs. Them",
        badge: "Conversions",
        hooks: [
          "Generic fast food hot dogs vs. authentic Chicago street food: let's compare.",
          "Don't make the mistake of buying processed fast food when this exists.",
          "Side-by-side test: can you spot the massive quality difference?",
          "Old-school drive-thru vs. Chicago Dog House: the honest truth.",
        ],
        body: "Fast food chains cut corners with mystery meat and soggy buns. Chicago Dog House serves authentic Vienna beef, crisp kosher pickles, and bright neon relish. Zero compromises.",
      },
    },
  },
  {
    id: "bkind-mist",
    name: "BKIND Botanicals",
    category: "Beauty & Skincare",
    offer: "Free floral mist on orders $50+",
    videoSrc: "/videos/reels/bkind-floral-mist.mp4",
    angles: {
      problem: {
        title: "Problem & Solution",
        badge: "Scale",
        hooks: [
          "If your skin feels dry, tight, or flaky by 2 PM, you need to see this.",
          "Stop layering heavy cream over your makeup when your skin dries out.",
          "The real reason your morning moisturizer stops working by lunchtime.",
          "Why does nobody tell you about this 2-second skin hydration hack?",
        ],
        body: "Dry skin midday? Creams ruin your makeup and clog pores. BKIND's organic floral mist delivers deep micro-hydration in two seconds. 100% vegan and bottled in sustainable aluminum.",
      },
      ugc: {
        title: "Creator Review",
        badge: "Trust",
        hooks: [
          "I replaced my entire 5-step morning routine with this one floral mist.",
          "My aesthetician literally asked me what I changed in my routine.",
          "Here's my honest 30-day review of the viral organic rosewater mist.",
          "If you want that glass skin glow without 10 different serums, watch this.",
        ],
        body: "I thought glass skin was just good lighting until I started using this mist. Organic rosewater and cornflower calm redness immediately and keep skin plump and glowing all day.",
      },
      listicle: {
        title: "3 Reasons Why",
        badge: "Clicks",
        hooks: [
          "3 reasons dermatologists are quietly obsessed with floral hydration mists.",
          "Number 2 is the main reason this mist sold out three times this summer.",
          "3 skincare mistakes you're making every morning before you leave.",
          "3 instant benefits of swapping heavy creams for organic floral water.",
        ],
        body: "Reason 1: Pure organic rosewater balances skin pH. Reason 2: Micro-fine mist sets makeup with zero sticky residue. Reason 3: 100% recyclable aluminum packaging.",
      },
      comparison: {
        title: "Us vs. Them",
        badge: "Conversions",
        hooks: [
          "Synthetic setting sprays vs. organic floral mist: look at this difference.",
          "Why standard face sprays are secretly drying out your skin over time.",
          "Compare the ingredients: drugstore spray vs. BKIND Botanicals.",
          "Stop spraying drying alcohol on your face every morning.",
        ],
        body: "Commercial sprays use drying denatured alcohol and artificial perfumes. BKIND uses 100% pure organic botanicals that hydrate your skin cells with every single spritz.",
      },
    },
  },
  {
    id: "dance-fusion",
    name: "Dance Fusion AZ",
    category: "Fitness & Dance",
    offer: "First beginner class only $10",
    videoSrc: "/videos/dance-fusion/dance-reel-2.mp4",
    angles: {
      problem: {
        title: "Problem & Solution",
        badge: "Scale",
        hooks: [
          "Stop scrolling if traditional gym cardio bores you to tears.",
          "If you dread the treadmill every single week, there's a better way.",
          "The real reason 80% of people quit their gym memberships by February.",
          "Why staring at a gym wall for 45 minutes is the worst way to workout.",
        ],
        body: "Dread the treadmill? At Dance Fusion, you burn 500 calories before you even realize you're working out. No auditions, no judgment—just pure high energy and great music.",
      },
      ugc: {
        title: "Creator Review",
        badge: "Trust",
        hooks: [
          "Adult beginner dance classes that actually feel like a weekend party.",
          "Think you have two left feet? Watch what happened in my first 30 days.",
          "I was terrified to take a dance class as an adult until I walked in here.",
          "How this $10 intro class completely cured my workout anxiety.",
        ],
        body: "I walked into Dance Fusion with zero dance experience. Within 10 minutes, the instructor had everyone laughing, moving, and crushing the choreography. It feels like a celebration.",
      },
      listicle: {
        title: "3 Reasons Why",
        badge: "Clicks",
        hooks: [
          "3 reasons adult beginners are ditching standard gyms for dance studios.",
          "Reason 3 is why our classes sell out every single Tuesday night.",
          "3 things that happen to your body when you replace running with dance.",
          "Before you sign another boring gym contract, check these 3 facts.",
        ],
        body: "Reason 1: Burn 500 calories in 60 minutes with zero joint strain. Reason 2: Step-by-step breakdown for total beginners. Reason 3: Uplifting, non-judgmental community.",
      },
      comparison: {
        title: "Us vs. Them",
        badge: "Conversions",
        hooks: [
          "Intimidating dance studios vs. Dance Fusion AZ: the difference is huge.",
          "Why most adult dance classes feel intimidating—and how we fixed it.",
          "Solo gym workouts vs. high-energy dance cardio: see the results.",
          "Don't waste money on fitness classes that make you feel self-conscious.",
        ],
        body: "Traditional dance academies can feel competitive and elitist. At Dance Fusion, there are zero auditions and zero mirrors to stress over—just pure rhythm and supportive coaches.",
      },
    },
  },
];

const CLIENT_SAMPLE_CLIPS: Record<string, { id: string; name: string; duration: string; type: string }[]> = {
  "chicago-dog": [
    { id: "c-01", name: "Fresh Poppy Bun Steam & Snap", duration: "0:09", type: "Raw Product Macro" },
    { id: "c-02", name: "Sport Pepper & Relish Topping", duration: "0:07", type: "Ingredients B-Roll" },
    { id: "c-03", name: "Customer Pickup Hand-off", duration: "0:11", type: "Storefront Action" },
  ],
  "bkind-mist": [
    { id: "c-04", name: "Face Mist Spray Ultra-Fine Cloud", duration: "0:08", type: "Application Demo" },
    { id: "c-05", name: "Amber Glass Bottle Texture Pour", duration: "0:06", type: "Product Close-up" },
  ],
  "dance-fusion": [
    { id: "c-06", name: "High-Energy Adult Class Group", duration: "0:12", type: "Live Studio Footage" },
    { id: "c-07", name: "Instructor Routine Breakdown", duration: "0:08", type: "Movement Demo" },
  ],
};

export default function StudioVideoGenerator() {
  const [selectedPreset, setSelectedPreset] = useState<BrandPreset>(PRESETS[0]);
  const [selectedAngle, setSelectedAngle] = useState<"problem" | "ugc" | "listicle" | "comparison">("problem");
  const [selectedActor, setSelectedActor] = useState<"emma" | "marcus" | "sarah">("emma");
  const [videoModel, setVideoModel] = useState<"grok" | "veo" | "seedance">("grok");
  const [voiceStyle, setVoiceStyle] = useState<"energetic" | "warm" | "direct">("energetic");

  // Dynamic hooks and copy
  const currentAngleData = selectedPreset.angles[selectedAngle];
  const [selectedHook, setSelectedHook] = useState(currentAngleData.hooks[0]);
  const [scriptBody, setScriptBody] = useState(currentAngleData.body);
  const [isEditingHook, setIsEditingHook] = useState(false);

  // Client footage & hybrid layer state
  const [selectedClientClip, setSelectedClientClip] = useState<string>("Fresh Poppy Bun Steam & Snap");
  const [customFootageName, setCustomFootageName] = useState<string | null>(null);
  const [softLabelDisclosure, setSoftLabelDisclosure] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Custom Dropdown Open States (Zero browser blue!)
  const [hookDropdownOpen, setHookDropdownOpen] = useState(false);
  const [modelDropdownOpen, setModelDropdownOpen] = useState(false);
  const [voiceDropdownOpen, setVoiceDropdownOpen] = useState(false);

  // Generation & Player State
  const [isGenerating, setIsGenerating] = useState(false);
  const [genProgress, setGenProgress] = useState(0);
  const [genStepText, setGenStepText] = useState("");
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "1:1" | "4:5">("9:16");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showPhoneFrame, setShowPhoneFrame] = useState(false);
  const [showCaptions, setShowCaptions] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customBrandInput, setCustomBrandInput] = useState("");
  const [customOfferInput, setCustomOfferInput] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const hookDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const voiceDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (hookDropdownRef.current && !hookDropdownRef.current.contains(event.target as Node)) {
        setHookDropdownOpen(false);
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

  // Sync hook & body when angle or preset changes
  useEffect(() => {
    const angleObj = selectedPreset.angles[selectedAngle];
    setSelectedHook(angleObj.hooks[0]);
    setScriptBody(angleObj.body);
    setHookDropdownOpen(false);
    setIsEditingHook(false);
  }, [selectedAngle, selectedPreset]);

  // Sync client clips on preset change
  useEffect(() => {
    const clips = CLIENT_SAMPLE_CLIPS[selectedPreset.id] || CLIENT_SAMPLE_CLIPS["chicago-dog"];
    if (clips && clips[0] && !customFootageName) {
      setSelectedClientClip(clips[0].name);
    }
  }, [selectedPreset.id, customFootageName]);

  // Handle Preset Switch
  const handleSelectPreset = (preset: BrandPreset) => {
    setSelectedPreset(preset);
  };

  // Shuffle Hook
  const handleShuffleHook = () => {
    const hooks = currentAngleData.hooks;
    const currentIdx = hooks.indexOf(selectedHook);
    const nextIdx = (currentIdx + 1) % hooks.length;
    setSelectedHook(hooks[nextIdx]);
  };

  // Video Generation Simulation with Hybrid Model and Review Queue Storage
  const handleGenerate = () => {
    setIsGenerating(true);
    setGenProgress(15);
    setGenStepText("Analyzing DR hook & direct-response script...");

    setTimeout(() => {
      setGenProgress(35);
      setGenStepText(`Ingesting & color-correcting client footage: "${selectedClientClip}"...`);
    }, 700);

    setTimeout(() => {
      setGenProgress(60);
      setGenStepText(`Synthesizing ${selectedActor === "emma" ? "Emma" : selectedActor === "marcus" ? "Marcus" : "Sarah"} creator hook footage...`);
    }, 1400);

    setTimeout(() => {
      setGenProgress(80);
      setGenStepText(`Rendering ${videoModel === "grok" ? "Grok Imagine" : videoModel === "veo" ? "Google Veo" : "Seedance"} sensory scenes & typography...`);
    }, 2100);

    setTimeout(() => {
      setGenProgress(95);
      setGenStepText("Compositing 3-part hybrid master with -14 LUFS voiceover...");
    }, 2800);

    setTimeout(() => {
      setGenProgress(100);
      setGenStepText("Master ready! Saved to QA Review Queue.");
      setIsGenerating(false);

      // Save to localStorage review queue so /studio/review immediately displays it
      try {
        const newVariant = {
          id: `var-gen-${Date.now()}`,
          clientName: selectedPreset.name,
          batchName: "Studio Live Batch",
          angle: currentAngleData.title,
          framework: selectedAngle,
          targetPersona: selectedPreset.category,
          hookText: selectedHook,
          video9x16: selectedPreset.videoSrc,
          video1x1: selectedPreset.videoSrc,
          video4x5: selectedPreset.videoSrc,
          thumbnail: "/images/howitworksstudio.jpg",
          status: "needs_review",
          disclosureApplied: softLabelDisclosure,
          audioLufs: -13.8,
          scriptBody: scriptBody,
          ctaText: selectedPreset.offer,
          forbiddenClaims: ["Zero fake claims verified"],
          clientFootageSource: selectedClientClip,
          creatorActor: selectedActor === "emma" ? "Emma Davis (@trendspotlight)" : selectedActor === "marcus" ? "Marcus Vance (@everydayreviews)" : "Sarah Jenkins (@glowwithsarah)",
          model: videoModel,
          aspectRatio: aspectRatio,
          createdAt: new Date().toISOString(),
        };
        const existing = JSON.parse(localStorage.getItem("relaunch_studio_generated_variants") || "[]");
        localStorage.setItem("relaunch_studio_generated_variants", JSON.stringify([newVariant, ...existing]));
      } catch (e) {
        console.error("Local storage error", e);
      }

      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
      }
    }, 3300);
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(videoRef.current.muted);
  };

  const handleApplyCustomBrand = () => {
    if (!customBrandInput.trim()) return;
    const newCustomPreset: BrandPreset = {
      id: "custom-brand",
      name: customBrandInput.trim(),
      category: "Custom Brand",
      offer: customOfferInput.trim() || "Exclusive Online Offer",
      videoSrc: "/videos/chicago-dog-social-1.mp4",
      angles: {
        problem: {
          title: "Problem & Solution",
          badge: "Scale",
          hooks: [
            `Stop scrolling if you're looking for the best ${customBrandInput.trim()} solution.`,
            `The real reason most alternatives to ${customBrandInput.trim()} leave you disappointed.`,
            `If you haven't tried ${customBrandInput.trim()} yet, you are missing out.`,
            `Why everyone is switching to ${customBrandInput.trim()} this month.`,
          ],
          body: `Discover why customers are choosing ${customBrandInput.trim()}. Premium quality, fast results, and an unbeatable offer designed specifically for you.`,
        },
        ugc: {
          title: "Creator Review",
          badge: "Trust",
          hooks: [
            `My honest review of ${customBrandInput.trim()} after 14 days of testing.`,
            `I was skeptical about ${customBrandInput.trim()} until I saw the results myself.`,
            `Here's why ${customBrandInput.trim()} is taking over my feed right now.`,
            `Ranking the top products: ${customBrandInput.trim()} completely took first place.`,
          ],
          body: `I tested ${customBrandInput.trim()} myself. Quality is top-tier, shipping was fast, and the experience blew away my expectations.`,
        },
        listicle: {
          title: "3 Reasons Why",
          badge: "Clicks",
          hooks: [
            `3 reasons why everyone is obsessed with ${customBrandInput.trim()}.`,
            `Reason 3 is why you will never go back to standard alternatives.`,
            `3 quick things you need to know before buying ${customBrandInput.trim()}.`,
            `The top 3 benefits of choosing ${customBrandInput.trim()} today.`,
          ],
          body: `Reason 1: Unmatched craftsmanship. Reason 2: Backed by verified customer reviews. Reason 3: Backed by our 100% satisfaction guarantee.`,
        },
        comparison: {
          title: "Us vs. Them",
          badge: "Conversions",
          hooks: [
            `Standard alternatives vs. ${customBrandInput.trim()}: let's compare.`,
            `Don't waste your budget on outdated products when ${customBrandInput.trim()} exists.`,
            `Side-by-side comparison: see the difference with ${customBrandInput.trim()}.`,
            `The honest truth about why ${customBrandInput.trim()} outperforms the rest.`,
          ],
          body: `Generic alternatives cut corners and overcharge. With ${customBrandInput.trim()}, you get genuine premium quality, transparent pricing, and zero compromises.`,
        },
      },
    };
    setSelectedPreset(newCustomPreset);
    setShowCustomModal(false);
  };

  return (
    <div className="w-full min-h-screen bg-[#08090D] text-[#F3F4F6] font-sans flex flex-col selection:bg-[#7F48ED] selection:text-white">
      {/* FULL-WIDTH STUDIO TOP BAR */}
      <header className="w-full sticky top-0 shrink-0 bg-[#0D0E15] border-b border-white/10 px-4 sm:px-6 py-3 flex items-center justify-between z-40">
        {/* Left: Studio Branding */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/studio"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Studio</span>
          </Link>
          <div className="h-4 w-px bg-white/10" />
          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-white uppercase">
              Relaunch Studio <span className="text-[#FF6700]">Video Generator</span>
            </span>
          </div>
        </div>

        {/* Center: Brand Quick Switcher */}
        <div className="hidden md:flex items-center gap-1 bg-black/40 border border-white/10 rounded-xl p-1">
          <span className="text-[11px] font-bold text-zinc-400 px-2 uppercase tracking-wider">Brand:</span>
          {PRESETS.map((p) => {
            const isSelected = selectedPreset.id === p.id;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-[#FF6700] text-black shadow-sm"
                    : "text-zinc-300 hover:text-white hover:bg-white/5"
                }`}
              >
                {p.name}
              </button>
            );
          })}
          <button
            onClick={() => setShowCustomModal(true)}
            className="px-2.5 py-1 rounded-lg text-xs font-bold text-[#A78BFA] hover:bg-[#7F48ED]/20 hover:text-white transition cursor-pointer"
          >
            + Custom
          </button>
        </div>

        {/* Right: Studio Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => setShowCustomModal(true)}
            className="md:hidden px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white/5 border border-white/10 text-white"
          >
            Brand
          </button>
          <Link
            href="/studio/review"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#7F48ED] hover:bg-[#6b35d6] transition shadow-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review Room</span>
          </Link>
        </div>
      </header>

      {/* FULL SCREEN 2-COLUMN STUDIO WORKSPACE */}
      <main className="w-full flex-1 flex flex-col lg:flex-row lg:h-[calc(100vh-53px)] lg:overflow-hidden">
        {/* LEFT PANEL: SIMPLE CREATION CONTROLS (Scrollable, Clean, No Wall of Text) */}
        <div className="w-full lg:w-[460px] xl:w-[480px] shrink-0 bg-[#0D0E15] border-r border-white/10 flex flex-col justify-between h-auto lg:h-full lg:overflow-y-auto min-h-0 p-4 sm:p-5 pb-16 space-y-4 dark-scrollbar">
          <div className="space-y-4">
            {/* Active Brand Bar on Mobile */}
            <div className="md:hidden flex items-center justify-between bg-black/40 border border-white/10 rounded-xl p-2.5">
              <span className="text-xs font-bold text-zinc-400">Active Brand:</span>
              <span className="text-xs font-extrabold text-[#FF6700]">{selectedPreset.name}</span>
            </div>

            {/* 1. CREATIVE ANGLE */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                Creative Angle
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: "problem", name: "Problem & Solution", badge: "Highest Scale" },
                  { id: "ugc", name: "Creator Review", badge: "Best Trust" },
                  { id: "listicle", name: "3 Reasons Why", badge: "High Clicks" },
                  { id: "comparison", name: "Us vs. Them", badge: "High Conversion" },
                ].map((ang) => {
                  const isSelected = selectedAngle === ang.id;
                  return (
                    <button
                      key={ang.id}
                      onClick={() => setSelectedAngle(ang.id as any)}
                      className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-1 cursor-pointer ${
                        isSelected
                          ? "bg-[#7F48ED]/20 border-[#7F48ED] text-white shadow-sm"
                          : "bg-black/30 border-white/5 text-zinc-400 hover:text-white hover:bg-black/50 hover:border-white/10"
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs font-bold">{ang.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#00F0FF]" />}
                      </div>
                      <span className="text-[10px] text-zinc-500 font-medium">{ang.badge}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. OPENING HOOK (Custom Dropdown + Direct Inline Edit, ZERO BLUE) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  Opening Hook (0–3s)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingHook(!isEditingHook)}
                    className="text-[11px] font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 cursor-pointer"
                    title="Edit Hook Directly"
                  >
                    <Edit3 className="w-3 h-3" />
                    {isEditingHook ? "Select Preset" : "Edit Hook"}
                  </button>
                  <button
                    onClick={handleShuffleHook}
                    className="text-[11px] font-bold text-[#FF6700] hover:underline flex items-center gap-1 cursor-pointer"
                    title="Shuffle Hook"
                  >
                    <Shuffle className="w-3 h-3" />
                    Shuffle
                  </button>
                </div>
              </div>

              {isEditingHook ? (
                <div className="relative">
                  <input
                    type="text"
                    value={selectedHook}
                    onChange={(e) => setSelectedHook(e.target.value)}
                    className="w-full bg-black/60 border border-[#7F48ED] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none shadow-inner"
                    placeholder="Type custom opening hook..."
                  />
                  <span className="text-[10px] text-zinc-500 font-mono mt-1 block">
                    Custom hook active · {selectedHook.length} characters
                  </span>
                </div>
              ) : (
                /* Custom Dropdown Trigger */
                <div className="relative" ref={hookDropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setHookDropdownOpen(!hookDropdownOpen);
                      setModelDropdownOpen(false);
                      setVoiceDropdownOpen(false);
                    }}
                    className="w-full text-left bg-black/40 border border-white/10 hover:border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white flex items-center justify-between gap-2 cursor-pointer transition focus:outline-none focus:border-[#7F48ED]"
                  >
                    <span className="line-clamp-1 font-medium">&ldquo;{selectedHook}&rdquo;</span>
                    <ChevronDown className={`w-4 h-4 text-zinc-400 shrink-0 transition-transform ${hookDropdownOpen ? "rotate-180" : ""}`} />
                  </button>

                  {/* Custom Dropdown Menu with Purple/Orange highlights */}
                  {hookDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#141722] border border-white/10 rounded-xl p-1.5 shadow-2xl z-50 space-y-1">
                      {currentAngleData.hooks.map((h, i) => {
                        const isSelected = selectedHook === h;
                        return (
                          <div
                            key={i}
                            onClick={() => {
                              setSelectedHook(h);
                              setHookDropdownOpen(false);
                            }}
                            className={`px-3 py-2 rounded-lg text-xs transition cursor-pointer flex items-start gap-2 ${
                              isSelected
                                ? "bg-[#7F48ED] text-white font-bold"
                                : "text-zinc-300 hover:bg-[#FF6700] hover:text-black hover:font-bold"
                            }`}
                          >
                            <span className="shrink-0 text-[11px] opacity-70">#{i + 1}</span>
                            <span className="flex-1">&ldquo;{h}&rdquo;</span>
                            {isSelected && <Check className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. SCRIPT BODY */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  Ad Script
                </label>
                <span className="text-[10px] text-zinc-500 font-mono">
                  {scriptBody.split(/\s+/).filter(Boolean).length} words · ~20s
                </span>
              </div>
              <textarea
                rows={3}
                value={scriptBody}
                onChange={(e) => setScriptBody(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-zinc-200 leading-relaxed focus:outline-none focus:border-[#7F48ED] resize-none"
                placeholder="Enter voiceover script..."
              />
            </div>

            {/* 4. CREATOR ACTOR (Real Creator Hook Layer) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  Real Creator Hook (0–3s)
                </label>
                <span className="text-[10px] font-mono text-[#A78BFA]">Verified Handle</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "emma", name: "Emma", type: "@trendspotlight" },
                  { id: "marcus", name: "Marcus", type: "@everydayreviews" },
                  { id: "sarah", name: "Sarah", type: "@glowwithsarah" },
                ].map((act) => {
                  const isSelected = selectedActor === act.id;
                  return (
                    <button
                      key={act.id}
                      onClick={() => setSelectedActor(act.id as any)}
                      className={`p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        isSelected
                          ? "bg-[#FF6700]/15 border-[#FF6700] text-white"
                          : "bg-black/30 border-white/5 text-zinc-400 hover:text-white hover:bg-black/50"
                      }`}
                    >
                      <span className="text-xs font-bold text-white">{act.name}</span>
                      <span className="text-[10px] text-zinc-500 truncate w-full">{act.type}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 5. CLIENT RAW FOOTAGE & B-ROLL INGESTION (Hybrid Edit Path) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  Client Raw Video &amp; B-Roll
                </label>
                <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  Edited In (3–15s)
                </span>
              </div>

              {/* Select from client footage clips */}
              <div className="space-y-1.5">
                {(CLIENT_SAMPLE_CLIPS[selectedPreset.id] || CLIENT_SAMPLE_CLIPS["chicago-dog"]).map((clip) => {
                  const isSelected = selectedClientClip === clip.name;
                  return (
                    <div
                      key={clip.id}
                      onClick={() => {
                        setSelectedClientClip(clip.name);
                        setCustomFootageName(null);
                      }}
                      className={`px-3 py-2 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                        isSelected
                          ? "bg-[#FF6700]/15 border-[#FF6700] text-white"
                          : "bg-black/30 border-white/5 text-zinc-400 hover:text-white hover:bg-black/50"
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <Video className={`w-3.5 h-3.5 shrink-0 ${isSelected ? "text-[#FF6700]" : "text-zinc-500"}`} />
                        <span className="truncate font-medium">{clip.name}</span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-500 shrink-0 ml-2">{clip.duration}</span>
                    </div>
                  );
                })}

                {/* Custom Uploaded Clip Pill if uploaded */}
                {customFootageName && (
                  <div className="px-3 py-2 rounded-xl border border-emerald-500/50 bg-emerald-500/10 text-xs text-white flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span className="truncate font-medium">{customFootageName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-300">Custom Upload</span>
                  </div>
                )}

                {/* Upload File Trigger */}
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/mp4,video/quicktime,video/webm"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setCustomFootageName(e.target.files[0].name);
                      setSelectedClientClip(e.target.files[0].name);
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full py-2 px-3 rounded-xl border border-dashed border-white/20 hover:border-[#FF6700] bg-black/20 hover:bg-[#FF6700]/5 text-zinc-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5 text-[#FF6700]" />
                  <span>Ingest Client Video (.mp4 / .mov)</span>
                </button>
              </div>
            </div>

            {/* 6. VISUAL ENGINE & VOICE STYLE (Custom Dropdowns, Opens Downward, ZERO BLUE) */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Visual Engine */}
              <div className="space-y-1 relative" ref={modelDropdownRef}>
                <label className="text-[11px] font-bold text-zinc-400 block">AI Visual Engine</label>
                <button
                  type="button"
                  onClick={() => {
                    setModelDropdownOpen(!modelDropdownOpen);
                    setHookDropdownOpen(false);
                    setVoiceDropdownOpen(false);
                  }}
                  className="w-full text-left bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#7F48ED]"
                >
                  <span className="truncate font-medium">
                    {videoModel === "grok" ? "Grok Imagine" : videoModel === "veo" ? "Google Veo" : "Seedance"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {modelDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#141722] border border-white/10 rounded-xl p-1 shadow-2xl z-50 space-y-1">
                    {[
                      { id: "grok", label: "Grok Imagine" },
                      { id: "veo", label: "Google Veo" },
                      { id: "seedance", label: "Seedance 2.0" },
                    ].map((m) => {
                      const isSelected = videoModel === m.id;
                      return (
                        <div
                          key={m.id}
                          onClick={() => {
                            setVideoModel(m.id as any);
                            setModelDropdownOpen(false);
                          }}
                          className={`px-3 py-2 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? "bg-[#7F48ED] text-white font-bold"
                              : "text-zinc-300 hover:bg-[#FF6700] hover:text-black hover:font-bold"
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

              {/* Voice Cadence */}
              <div className="space-y-1 relative" ref={voiceDropdownRef}>
                <label className="text-[11px] font-bold text-zinc-400 block">Voice Cadence</label>
                <button
                  type="button"
                  onClick={() => {
                    setVoiceDropdownOpen(!voiceDropdownOpen);
                    setHookDropdownOpen(false);
                    setModelDropdownOpen(false);
                  }}
                  className="w-full text-left bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#7F48ED]"
                >
                  <span className="truncate font-medium">
                    {voiceStyle === "energetic" ? "Energetic" : voiceStyle === "warm" ? "Conversational" : "Direct"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform ${voiceDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {voiceDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1.5 bg-[#141722] border border-white/10 rounded-xl p-1 shadow-2xl z-50 space-y-1">
                    {[
                      { id: "energetic", label: "Energetic" },
                      { id: "warm", label: "Conversational" },
                      { id: "direct", label: "Direct" },
                    ].map((v) => {
                      const isSelected = voiceStyle === v.id;
                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            setVoiceStyle(v.id as any);
                            setVoiceDropdownOpen(false);
                          }}
                          className={`px-3 py-2 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? "bg-[#7F48ED] text-white font-bold"
                              : "text-zinc-300 hover:bg-[#FF6700] hover:text-black hover:font-bold"
                          }`}
                        >
                          <span>{v.label}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* 7. COMPLIANCE & SOFT-LABEL DISCLOSURE (Optional Toggle) */}
            <div className="p-3 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-white">Photorealistic AI Scene Tag</span>
                <button
                  type="button"
                  onClick={() => setSoftLabelDisclosure(!softLabelDisclosure)}
                  className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition cursor-pointer border ${
                    softLabelDisclosure
                      ? "bg-[#FF6700] text-black border-[#FF6700]"
                      : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                  }`}
                >
                  {softLabelDisclosure ? "TAG: ON" : "TAG: OFF (Default)"}
                </button>
              </div>
              <p className="text-[10px] text-zinc-400 leading-tight">
                Off by default: real creators front and verify this ad, and client-supplied footage is edited in. Turn on only if video uses photorealistic synthetic product shots per TikTok rules.
              </p>
            </div>
          </div>

          {/* GENERATE BUTTON (Full width, Solid Purple, No gradient) */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl font-black text-sm text-white bg-[#7F48ED] hover:bg-[#6b35d6] disabled:opacity-50 transition shadow-lg shadow-[#7F48ED]/20 flex items-center justify-center gap-2 cursor-pointer"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Generating Video..." : "Generate AI Video Ad"}
            </button>
          </div>
        </div>

        {/* RIGHT STAGE: EXPANDED FULL-SCREEN VIDEO CANVAS */}
        <div className="flex-1 bg-[#08090D] flex flex-col justify-between p-4 sm:p-6 relative min-h-[500px] lg:h-full lg:overflow-y-auto min-h-0 pb-16 dark-scrollbar">
          {/* Top Canvas Controls Bar */}
          <div className="w-full flex items-center justify-between gap-3 bg-[#0D0E15]/80 backdrop-blur-md border border-white/10 rounded-xl px-4 py-2.5 z-20">
            {/* Aspect Ratio Toggles */}
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold text-zinc-400 mr-1 hidden sm:inline uppercase">Format:</span>
              <button
                onClick={() => setAspectRatio("9:16")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  aspectRatio === "9:16" ? "bg-[#7F48ED] text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                9:16 Vertical
              </button>
              <button
                onClick={() => setAspectRatio("1:1")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  aspectRatio === "1:1" ? "bg-[#7F48ED] text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                1:1 Square
              </button>
              <button
                onClick={() => setAspectRatio("4:5")}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  aspectRatio === "4:5" ? "bg-[#7F48ED] text-white shadow-sm" : "text-zinc-400 hover:text-white"
                }`}
              >
                4:5 Portrait
              </button>
            </div>

            {/* View Mode & Caption Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPhoneFrame(!showPhoneFrame)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                  showPhoneFrame
                    ? "bg-[#FF6700] text-black border-[#FF6700]"
                    : "bg-white/5 text-zinc-300 border-white/10 hover:text-white"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                {showPhoneFrame ? "Phone View" : "Studio Canvas"}
              </button>

              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition hidden sm:inline-flex items-center gap-1 cursor-pointer ${
                  showCaptions
                    ? "bg-[#7F48ED]/20 text-[#C4B5FD] border-[#7F48ED]/40"
                    : "bg-white/5 text-zinc-400 border-white/10 hover:text-white"
                }`}
              >
                <Zap className="w-3.5 h-3.5" />
                Captions {showCaptions ? "ON" : "OFF"}
              </button>
            </div>
          </div>

          {/* 3-Part Hybrid Composite Timeline */}
          <div className="w-full bg-[#0D0E15]/90 border border-white/10 rounded-xl p-2.5 flex flex-col gap-1.5 z-20 my-2 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 text-[11px]">
                <Layers className="w-3.5 h-3.5 text-[#7F48ED]" />
                Hybrid Production Anatomy (22s Ad Master)
              </span>
              <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                Real Creator Hook + Ingested Client Video + AI B-Roll
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1.5 h-6 rounded-md overflow-hidden font-mono text-[9px] font-bold select-none">
              <div className="col-span-3 bg-[#7F48ED]/25 border border-[#7F48ED]/50 text-[#C4B5FD] flex items-center justify-center rounded px-1 truncate" title="0–3s: Real Creator Fronted Hook">
                0-3s Creator Hook
              </div>
              <div className="col-span-5 bg-[#FF6700]/20 border border-[#FF6700]/40 text-[#FF8533] flex items-center justify-center rounded px-1 truncate" title={`3–15s Client Footage: ${selectedClientClip}`}>
                3-15s Client Video: {selectedClientClip}
              </div>
              <div className="col-span-4 bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#67E8F9] flex items-center justify-center rounded px-1 truncate" title="15–22s: AI Sensory B-roll & Motion CTA">
                15-22s AI Scenes &amp; Motion CTA
              </div>
            </div>
          </div>

          {/* Centered Video Display Stage */}
          <div className="flex-1 w-full flex items-center justify-center py-4 relative min-h-[380px]">
            {/* Ambient Studio Lighting Glow */}
            <div className="absolute w-[520px] h-[520px] rounded-full bg-[#7F48ED]/15 blur-3xl pointer-events-none" />

            {/* Generation Progress Overlay */}
            {isGenerating && (
              <div className="absolute inset-0 bg-[#08090D]/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-4 rounded-2xl">
                <div className="w-14 h-14 rounded-full border-3 border-[#7F48ED] border-t-transparent animate-spin" />
                <div className="space-y-1.5 max-w-sm">
                  <div className="text-xs font-mono font-black text-[#FF6700] tracking-wider">{genProgress}% COMPLETED</div>
                  <p className="text-sm sm:text-base text-white font-semibold">{genStepText}</p>
                </div>
                <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FF6700] transition-all duration-300"
                    style={{ width: `${genProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Phone Frame Mockup View (Larger Scale) */}
            {showPhoneFrame ? (
              <div className="relative h-[min(680px,calc(100vh-220px))] aspect-[9/16] bg-black rounded-[44px] border-[5px] border-zinc-700 overflow-hidden shadow-2xl flex flex-col justify-between p-2">
                {/* Notch */}
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800 rounded-full z-20" />

                <video
                  src={selectedPreset.videoSrc}
                  playsInline
                  loop
                  muted={isMuted}
                  autoPlay
                  className="absolute inset-0 w-full h-full object-cover"
                />

                {/* TikTok UI Overlay */}
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

                {/* Bottom Handle */}
                <div className="absolute bottom-4 left-3.5 right-16 z-10 space-y-1">
                  <div className="font-extrabold text-xs text-white drop-shadow">@{selectedPreset.name.toLowerCase().replace(/\s+/g, "")}</div>
                  <div className="text-[12px] text-zinc-100 line-clamp-2 drop-shadow font-medium leading-tight">
                    {selectedHook}
                  </div>
                </div>
              </div>
            ) : (
              /* Clean Studio Canvas Player (Substantially Larger Scale) */
              <div
                className={`relative flex items-center justify-center transition-all duration-300 overflow-hidden bg-black rounded-2xl border border-white/10 shadow-2xl ${
                  aspectRatio === "9:16"
                    ? "h-[min(690px,calc(100vh-215px))] aspect-[9/16]"
                    : aspectRatio === "1:1"
                    ? "h-[min(600px,calc(100vh-220px))] aspect-square"
                    : "h-[min(650px,calc(100vh-215px))] aspect-[4/5]"
                }`}
              >
                <video
                  ref={videoRef}
                  src={selectedPreset.videoSrc}
                  playsInline
                  loop
                  muted={isMuted}
                  autoPlay
                  className="w-full h-full object-cover"
                />

                {/* Click to Play/Pause Overlay */}
                <button
                  onClick={togglePlay}
                  className="absolute inset-0 flex items-center justify-center bg-black/20 hover:bg-black/40 transition opacity-0 hover:opacity-100 z-10 cursor-pointer"
                >
                  {isPlaying ? (
                    <Pause className="w-12 h-12 text-white drop-shadow-xl" />
                  ) : (
                    <Play className="w-12 h-12 text-white drop-shadow-xl" />
                  )}
                </button>

                {/* Audio Mute Pill Toggle */}
                <button
                  onClick={toggleMute}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition z-20 cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>

                {/* Clean Kinetic Subtitle Overlay */}
                {showCaptions && (
                  <div className="absolute bottom-8 left-3 right-3 text-center pointer-events-none z-10">
                    <span className="bg-black/85 text-white text-xs font-black uppercase px-3 py-1 rounded shadow-lg border border-white/10 tracking-wide">
                      {selectedHook.slice(0, 38)}...
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Bottom Stage Action Toolbar */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D0E15]/80 backdrop-blur-md border border-white/10 rounded-xl p-3 z-20">
            <div className="text-xs text-zinc-400">
              Active Brand: <span className="font-extrabold text-white">{selectedPreset.name}</span> · Offer: <span className="text-[#FF6700] font-bold">{selectedPreset.offer}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={selectedPreset.videoSrc}
                download={`${selectedPreset.id}-${aspectRatio}.mp4`}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                Download MP4
              </a>

              <Link
                href="/studio/review"
                className="flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-extrabold text-black bg-[#FF6700] hover:bg-[#e55c00] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#FF6700]/20 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                Open in QA Review Room
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* CUSTOM BRAND MODAL */}
      {showCustomModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12141D] border border-white/15 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#FF6700]" />
              Enter Custom Brand
            </h3>
            <p className="text-xs text-zinc-400">
              Input your brand name and key offer to generate tailored video hooks and scripts.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 block mb-1 font-bold">Brand Name</label>
                <input
                  type="text"
                  placeholder="e.g. Apex Coffee Roasters"
                  value={customBrandInput}
                  onChange={(e) => setCustomBrandInput(e.target.value)}
                  className="w-full bg-[#08090D] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#7F48ED]"
                />
              </div>

              <div>
                <label className="text-zinc-300 block mb-1 font-bold">Current Offer / Hook</label>
                <input
                  type="text"
                  placeholder="e.g. 20% off first subscription box"
                  value={customOfferInput}
                  onChange={(e) => setCustomOfferInput(e.target.value)}
                  className="w-full bg-[#08090D] border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-[#7F48ED]"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                onClick={handleApplyCustomBrand}
                className="px-4 py-2 rounded-lg text-xs font-bold text-white bg-[#7F48ED] hover:bg-[#6b35d6] transition"
              >
                Apply Brand
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
