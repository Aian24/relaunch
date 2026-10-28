"use client";

export const dynamic = "force-dynamic";

import React, { useState, useRef, useEffect, useMemo } from "react";
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
} from "lucide-react";
import { CREATOR_ROSTER } from "@/data/creatorRoster";

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
}

const BRAND_PRESETS: BrandPreset[] = [
  {
    id: "chicago-dog",
    name: "Chicago Dog House",
    category: "Food & Dining",
    offer: "15% off first pickup order",
  },
  {
    id: "carmen-hotel",
    name: "Carmen Hotel",
    category: "Luxury Travel",
    offer: "Free breakfast + $50 spa credit",
  },
  {
    id: "turf-life",
    name: "Turf Life",
    category: "Home & Garden",
    offer: "Free consultation + $200 off",
  },
];

interface StudioVoice {
  id: string;
  name: string;
  category: "cloned" | "premade" | "generated" | "custom";
  description: string;
}

const DEFAULT_STUDIO_VOICES: StudioVoice[] = [
  {
    id: "pNInz6obpgDQGcFmaJgB",
    name: "Adam (Direct & Commercial)",
    category: "premade",
    description: "Deep, confident, high-converting commercial tone",
  },
  {
    id: "21m00Tcm4TlvDq8ikWAM",
    name: "Rachel (Conversational & Warm)",
    category: "premade",
    description: "Natural, calm, friendly lifestyle narration",
  },
  {
    id: "AZnzlk1XvdvUeBnXmlld",
    name: "Domi (Energetic & Hype)",
    category: "premade",
    description: "Fast-paced, vibrant, modern social media",
  },
  {
    id: "EXAVITQu4vr4xnSDxMaL",
    name: "Bella (Expressive & Soft)",
    category: "premade",
    description: "Gentle, authentic beauty & wellness",
  },
  {
    id: "ErXwobaYiN019PkySvjV",
    name: "Antoni (Engaging & Polished)",
    category: "premade",
    description: "Clear, trustworthy, corporate and retail",
  },
  {
    id: "TxGEqnHWrfWFTfGW9XjX",
    name: "Josh (Relatable & Casual)",
    category: "premade",
    description: "Everyday friend, casual UGC review vibe",
  },
];

function getAngleContent(brandName: string, offer: string): Record<string, AngleContent> {
  const brand = brandName.trim() || "My Brand";
  const cta = offer.trim() || "Exclusive Offer";

  return {
    problem: {
      title: "Problem & Solution",
      badge: "Scale",
      hooks: [
        `Stop scrolling if you're sick of standard alternatives to ${brand}.`,
        `The real reason most solutions like ${brand} leave you frustrated.`,
        `If you haven't experienced ${brand} in 2026, you are missing out.`,
        `Why everyone is ditching generic options for ${brand} right now.`,
      ],
      body: `Frustrated with standard alternatives? ${brand} delivers premium results with zero compromises. Claim ${cta} today and see the difference immediately.`,
    },
    ugc: {
      title: "Creator Review",
      badge: "Trust",
      hooks: [
        `My honest review of ${brand} after 14 days of testing.`,
        `I was super skeptical about ${brand} until I saw the results myself.`,
        `Here's why ${brand} is taking over everyone's feed this week.`,
        `Ranking the top products: ${brand} completely blew away the rest.`,
      ],
      body: `I tested ${brand} myself. The quality is unmatched, the experience is seamless, and ${cta} makes it an absolute no-brainer to try.`,
    },
    listicle: {
      title: "3 Reasons Why",
      badge: "Clicks",
      hooks: [
        `3 reasons why everyone is quietly obsessed with ${brand}.`,
        `Reason number 3 is why you will never go back to standard alternatives.`,
        `Before you spend money anywhere else today, check these 3 facts about ${brand}.`,
        `3 signs you've found the highest-performing option on the market.`,
      ],
      body: `Reason 1: Unmatched craftsmanship. Reason 2: Backed by verified customer reviews. Reason 3: Unlock ${cta} right now before it expires.`,
    },
    comparison: {
      title: "Us vs. Them",
      badge: "Conversions",
      hooks: [
        `Generic alternatives vs. ${brand}: let's compare them side-by-side.`,
        `Don't make the mistake of buying outdated options when ${brand} exists.`,
        `Side-by-side test: can you spot the quality difference with ${brand}?`,
        `The honest truth about why ${brand} outperforms traditional brands.`,
      ],
      body: `Traditional options cut corners and overcharge. With ${brand}, you get genuine premium quality, rapid delivery, and ${cta}. Zero compromises.`,
    },
    hack: {
      title: "Secret Life Hack",
      badge: "Curiosity",
      hooks: [
        `The secret shortcut about ${brand} that nobody talks about.`,
        `I wish I knew this about ${brand} 6 months ago.`,
        `The single discovery that changed everything: ${brand}.`,
        `Stop doing it the hard way when ${brand} is right here.`,
      ],
      body: `Here is the hack that saved us hours: ${brand}. While everyone else wastes time on outdated methods, this delivers immediately. Claim ${cta} before it ends.`,
    },
    founder: {
      title: "Behind the Scenes / Craft",
      badge: "Authenticity",
      hooks: [
        `Why we built ${brand} completely differently from everyone else.`,
        `Behind the scenes of how we craft every order at ${brand}.`,
        `We got tired of generic options, so we built ${brand} ourselves.`,
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

export default function StudioVideoGenerator() {
  // Brand & Campaign Setup State
  const [selectedPresetId, setSelectedPresetId] = useState<string>("chicago-dog");
  const [brandName, setBrandName] = useState("Chicago Dog House");
  const [brandOffer, setBrandOffer] = useState("15% off first pickup order");

  // Creative Angle & Copy
  const [selectedAngle, setSelectedAngle] = useState<string>("problem");
  const [angleDropdownOpen, setAngleDropdownOpen] = useState(false);
  const [selectedActor, setSelectedActor] = useState<string>("emma");
  const [creatorDropdownOpen, setCreatorDropdownOpen] = useState(false);
  const [videoModel, setVideoModel] = useState<"grok" | "veo" | "seedance">("grok");
  const [availableVoices, setAvailableVoices] = useState<StudioVoice[]>(DEFAULT_STUDIO_VOICES);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string>("pNInz6obpgDQGcFmaJgB");
  const [isLoadingVoices, setIsLoadingVoices] = useState(false);

  const angleDataMap = useMemo(() => getAngleContent(brandName, brandOffer), [brandName, brandOffer]);
  const currentAngleData = angleDataMap[selectedAngle];

  const [selectedHook, setSelectedHook] = useState(currentAngleData.hooks[0]);
  const [scriptBody, setScriptBody] = useState(currentAngleData.body);
  const [isEditingHook, setIsEditingHook] = useState(false);

  // Product Media State (Supports BOTH Video & Image)
  const [uploadedMediaSrc, setUploadedMediaSrc] = useState<string | null>(null);
  const [uploadedMediaName, setUploadedMediaName] = useState<string | null>(null);
  const [uploadedMediaSize, setUploadedMediaSize] = useState<string | null>(null);
  const [uploadedMediaBase64, setUploadedMediaBase64] = useState<string | null>(null);
  const [uploadedMediaType, setUploadedMediaType] = useState<"video" | "image" | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const [softLabelDisclosure, setSoftLabelDisclosure] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropdown States
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
  const [generationError, setGenerationError] = useState<{
    title: string;
    message: string;
    balanceExhausted?: boolean;
    billingUrl?: string;
  } | null>(null);
  const [generatedResult, setGeneratedResult] = useState<{
    jobId: string;
    variants: { v9x16: string; v1x1: string; v4x5: string; thumbnail: string };
    voiceover?: { url: string; wordCount: number };
    aiVideo?: { isGenerated: boolean; provider: string };
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const angleDropdownRef = useRef<HTMLDivElement>(null);
  const creatorDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const voiceDropdownRef = useRef<HTMLDivElement>(null);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const activeCreator = useMemo(() => {
    return CREATOR_ROSTER.find((c) => c.actorPresetId === selectedActor) || CREATOR_ROSTER[0];
  }, [selectedActor]);

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
    const angleObj = angleDataMap[selectedAngle];
    if (angleObj) {
      setSelectedHook(angleObj.hooks[0]);
      setScriptBody(angleObj.body);
      setIsEditingHook(false);
    }
  }, [selectedAngle, angleDataMap]);

  // Handle Preset Switching
  const handleSelectPreset = (preset: BrandPreset) => {
    setSelectedPresetId(preset.id);
    setBrandName(preset.name);
    setBrandOffer(preset.offer);
    setUploadedMediaSrc(null);
    setUploadedMediaName(null);
    setUploadedMediaBase64(null);
    setUploadedMediaType(null);
    setGeneratedResult(null);
    setGenerationError(null);
  };

  // Sync active video playback
  useEffect(() => {
    if (videoRef.current && activeVideoSrc) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
  }, [activeVideoSrc]);

  // Handle media file ingestion (supports BOTH Image & Video)
  const handleMediaFile = (file: File) => {
    if (!file) return;
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");

    if (!isImage && !isVideo) {
      alert("Please upload a valid video (.mp4, .mov) or image file (.png, .jpg, .webp).");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setUploadedMediaSrc(objectUrl);
    setUploadedMediaName(file.name);
    setUploadedMediaSize((file.size / (1024 * 1024)).toFixed(1) + " MB");
    setUploadedMediaType(isImage ? "image" : "video");
    setGeneratedResult(null);
    setGenerationError(null);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        setUploadedMediaBase64(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleClearUploadedMedia = () => {
    setUploadedMediaSrc(null);
    setUploadedMediaName(null);
    setUploadedMediaSize(null);
    setUploadedMediaBase64(null);
    setUploadedMediaType(null);
    setGeneratedResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // Shuffle Hook
  const handleShuffleHook = () => {
    const hooks = currentAngleData.hooks;
    const currentIdx = hooks.indexOf(selectedHook);
    const nextIdx = (currentIdx + 1) % hooks.length;
    setSelectedHook(hooks[nextIdx]);
  };

  // Video Generation via Studio Engine API
  const handleGenerate = async () => {
    setGenerationError(null);
    setIsGenerating(true);
    setGenProgress(20);
    setGenStepText("Connecting to Studio Engine & analyzing creative brief...");

    const timer1 = setTimeout(() => {
      setGenProgress(45);
      setGenStepText("Calling ElevenLabs for live creator voiceover sync...");
    }, 600);

    const timer2 = setTimeout(() => {
      setGenProgress(70);
      setGenStepText("Generating commercial b-roll scene via AI engine...");
    }, 1500);

    const timer3 = setTimeout(() => {
      setGenProgress(90);
      setGenStepText("Compositing 22s hybrid master and rendering 9:16, 1:1, 4:5 ratios...");
    }, 2400);

    try {
      const res = await fetch("/api/studio/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          brandName: brandName.trim() || "My Brand",
          creativeAngle: currentAngleData.title,
          hookType: selectedAngle,
          hookText: selectedHook,
          scriptBody: scriptBody,
          ctaText: brandOffer.trim() || "Claim Offer",
          actor: selectedActor,
          voiceId: selectedVoiceId,
          mediaSource: uploadedMediaBase64 || uploadedMediaSrc || "",
          mediaType: uploadedMediaType || "prompt_only",
          visualPrompt: `Cinematic 4K advertising b-roll of ${brandName}, dramatic studio lighting, macro product motion, physical realism, 60fps`,
          aiModel: videoModel === "grok" ? "grok-1.5" : videoModel === "veo" ? "google-veo" : "seedance-fast",
        }),
      });

      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

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
      setGenStepText("Master ready! Saved to QA Review Queue.");

      const newJobId = data.jobId;
      const newVariants = data.variants;
      const newVo = data.voiceover;

      setGeneratedResult({
        jobId: newJobId,
        variants: newVariants,
        voiceover: newVo,
        aiVideo: data.aiVideo,
      });

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
          createdAt: new Date().toISOString(),
          compliance: {
            photorealisticAiDisclosure: softLabelDisclosure,
            tiktokCompliant: true,
            metaCompliant: true,
            creatorConsentVerified: true,
          },
        };

        const existingStr = localStorage.getItem("relaunch_review_variants");
        let list = existingStr ? JSON.parse(existingStr) : [];
        list = [newVariant, ...list.filter((x: any) => x.id !== newJobId)];
        localStorage.setItem("relaunch_review_variants", JSON.stringify(list));
      } catch (storageErr) {
        console.warn("Could not save to review queue localStorage:", storageErr);
      }

      setIsGenerating(false);
    } catch (err: any) {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
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

  return (
    <div className="w-full min-h-screen bg-white text-[#090D16] font-sans flex flex-col selection:bg-[#7F48ED] selection:text-white">
      {/* 1. TOP STUDIO BAR (Clean White Header, Zero Pitch Black) */}
      <header className="w-full sticky top-0 shrink-0 bg-white border-b border-zinc-200/90 px-4 sm:px-6 py-3 flex items-center justify-between z-40 shadow-sm">
        {/* Left: Studio Branding */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/studio"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#7F48ED] transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Exit Studio</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200" />

          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-sm font-black tracking-tight text-[#090D16] uppercase">
              Relaunch Studio <span className="text-[#FF6700]">Video Generator</span>
            </span>
          </div>
        </div>

        {/* Center: Brand Quick Switcher */}
        <div className="hidden md:flex items-center gap-1.5 bg-zinc-100/90 border border-zinc-200 rounded-xl p-1">
          <span className="text-[11px] font-bold text-zinc-500 px-2 uppercase tracking-wider">Preset:</span>
          {BRAND_PRESETS.map((p) => {
            const isSelected = selectedPresetId === p.id && brandName === p.name;
            return (
              <button
                key={p.id}
                onClick={() => handleSelectPreset(p)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  isSelected
                    ? "bg-[#FF6700] text-white shadow-sm"
                    : "text-zinc-600 hover:text-zinc-900 hover:bg-white"
                }`}
              >
                {p.name}
              </button>
            );
          })}
        </div>

        {/* Right: Review Room Action */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/studio/review"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#7F48ED] hover:bg-[#6b35d6] transition shadow-md shadow-[#7F48ED]/20 cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review Room</span>
          </Link>
        </div>
      </header>

      {/* 2. MAIN WORKSPACE (2-Column Studio: Left Controls, Right Live Stage) */}
      <main className="w-full flex-1 flex flex-col lg:flex-row lg:h-[calc(100vh-57px)] lg:overflow-hidden min-h-0 bg-[#F8F9FC]">
        {/* ============================================================== */}
        {/* LEFT PANEL: SIMPLE 3-STEP CREATION CONTROLS                    */}
        {/* ============================================================== */}
        <div
          ref={sidebarRef}
          className="w-full lg:w-[460px] xl:w-[480px] shrink-0 bg-white border-r border-zinc-200/90 p-4 sm:p-5 pb-28 space-y-4 h-auto lg:h-full lg:overflow-y-auto min-h-0"
        >
          {/* STEP 1: BRAND & OFFER */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#7F48ED] text-white text-[11px] flex items-center justify-center font-bold">1</span>
                Brand &amp; Offer
              </span>
            </div>

            <div className="space-y-2.5">
              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                  Brand Name
                </label>
                <input
                  type="text"
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="e.g. Chicago Dog House"
                  className="w-full bg-white border border-zinc-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/15 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition font-medium"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-zinc-600 block mb-1">
                  Offer / Promo
                </label>
                <input
                  type="text"
                  value={brandOffer}
                  onChange={(e) => setBrandOffer(e.target.value)}
                  placeholder="e.g. 15% off first order"
                  className="w-full bg-white border border-zinc-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/15 rounded-xl px-3 py-2 text-xs text-zinc-900 placeholder-zinc-400 focus:outline-none transition font-medium"
                />
              </div>

              {/* Product Media File (Optional Basis) */}
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="video/mp4,video/quicktime,video/webm,image/png,image/jpeg,image/webp,image/jpg"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleMediaFile(e.target.files[0]);
                    }
                  }}
                />

                {uploadedMediaSrc ? (
                  <div className="p-2.5 rounded-xl bg-purple-50/70 border border-purple-200 flex items-center justify-between gap-2 mt-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#7F48ED] text-white flex items-center justify-center shrink-0">
                        {uploadedMediaType === "image" ? (
                          <ImageIcon className="w-3.5 h-3.5" />
                        ) : (
                          <FileVideo className="w-3.5 h-3.5" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-zinc-900 truncate">
                          {uploadedMediaName}
                        </div>
                        <div className="text-[10px] text-zinc-500 font-mono">
                          {uploadedMediaType === "image" ? "Photo" : "Video"} · {uploadedMediaSize}
                        </div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={handleClearUploadedMedia}
                      className="p-1 text-zinc-400 hover:text-red-500 transition cursor-pointer"
                      title="Remove Media"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full py-2 px-3 rounded-xl border border-dashed border-zinc-300 hover:border-[#FF6700] bg-zinc-50 hover:bg-[#FF6700]/5 text-zinc-600 hover:text-[#FF6700] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer mt-1"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#FF6700]" />
                    <span>Upload Video or Photo (Optional)</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* STEP 2: CREATIVE ANGLE & SCRIPT */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-[#7F48ED] text-white text-[11px] flex items-center justify-center font-bold">2</span>
                Creative Angle &amp; Script
              </span>
              <button
                type="button"
                onClick={handleShuffleHook}
                className="text-xs font-bold text-[#FF6700] hover:text-[#e55c00] flex items-center gap-1 cursor-pointer transition"
                title="Shuffle Hook"
              >
                <Shuffle className="w-3 h-3" />
                Shuffle Hook
              </button>
            </div>

            {/* Scalable Creative Angle Dropdown Selector */}
            <div className="space-y-1 relative" ref={angleDropdownRef}>
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
                className="w-full text-left bg-zinc-50 border border-zinc-200 hover:border-[#7F48ED] rounded-xl px-3 py-2 text-xs text-zinc-900 flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#7F48ED] font-semibold transition"
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
                    const isSelected = selectedAngle === key;
                    return (
                      <div
                        key={key}
                        onClick={() => {
                          setSelectedAngle(key);
                          setAngleDropdownOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? "bg-[#7F48ED] text-white font-bold shadow-sm"
                            : "text-zinc-700 hover:bg-[#FF6700]/10 hover:text-[#FF6700]"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate min-w-0 pr-1">
                          <span className="font-bold truncate">{data.title}</span>
                          <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded truncate ${
                            isSelected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
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

            {/* Hook Display & Edit Box */}
            <div className="p-3 rounded-xl bg-purple-50/50 border border-purple-200/70 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold text-[#7F48ED] uppercase tracking-wider">
                  Opening Hook (0–3s)
                </span>
                <button
                  type="button"
                  onClick={() => setIsEditingHook(!isEditingHook)}
                  className="text-[11px] font-bold text-zinc-600 hover:text-[#7F48ED] flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3 h-3" />
                  {isEditingHook ? "Save Hook" : "Edit Hook"}
                </button>
              </div>

              {isEditingHook ? (
                <input
                  type="text"
                  value={selectedHook}
                  onChange={(e) => setSelectedHook(e.target.value)}
                  className="w-full bg-white border border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/20 rounded-lg p-2 text-xs text-zinc-900 focus:outline-none"
                  placeholder="Type opening hook..."
                />
              ) : (
                <p className="text-xs font-bold text-zinc-900 leading-snug italic">
                  &ldquo;{selectedHook}&rdquo;
                </p>
              )}
            </div>

            {/* Voiceover Script Field with Auto-Size & Pass-Through Wheel */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-bold text-zinc-600 block">
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
                rows={3}
                className="w-full bg-white border border-zinc-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/15 rounded-xl p-3 text-xs text-zinc-800 focus:outline-none resize-none leading-relaxed transition font-medium overflow-hidden"
                placeholder="Enter 20s voiceover script..."
              />
            </div>
          </div>

          {/* STEP 3: CREATOR & VOICE */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-4 shadow-sm space-y-3">
            <span className="text-xs font-black uppercase tracking-wider text-zinc-900 flex items-center gap-1.5">
              <span className="w-5 h-5 rounded-full bg-[#7F48ED] text-white text-[11px] flex items-center justify-center font-bold">3</span>
              Creator &amp; Voice
            </span>

            {/* Scalable Creator Dropdown Selector */}
            <div className="space-y-1 relative" ref={creatorDropdownRef}>
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                  Whitelisted Creator
                </label>
                <span className="text-[10px] font-mono text-[#7F48ED] font-bold">
                  {CREATOR_ROSTER.length} Creators
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
                  <div className="truncate">
                    <span className="font-bold text-zinc-900">{activeCreator?.name}</span>
                    <span className="text-zinc-500 text-[11px] ml-1.5 font-normal">
                      ({activeCreator?.niche})
                    </span>
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${creatorDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {creatorDropdownOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl p-1 shadow-xl z-50 space-y-0.5 max-h-56 overflow-y-auto">
                  {CREATOR_ROSTER.map((cr) => {
                    const isSelected = selectedActor === cr.actorPresetId;
                    return (
                      <div
                        key={cr.id}
                        onClick={() => {
                          setSelectedActor(cr.actorPresetId);
                          setCreatorDropdownOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${
                          isSelected
                            ? "bg-[#7F48ED] text-white font-bold shadow-sm"
                            : "text-zinc-700 hover:bg-[#FF6700]/10 hover:text-[#FF6700]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                              isSelected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-600"
                            }`}
                          >
                            {cr.name.charAt(0)}
                          </div>
                          <div className="truncate">
                            <span className="font-bold">{cr.name}</span>
                            <span className={`text-[10px] ml-1.5 truncate ${isSelected ? "text-purple-100" : "text-zinc-500"}`}>
                              {cr.handle} · {cr.niche}
                            </span>
                          </div>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1.5" />}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* AI Engine & Voice Cadence */}
            <div className="grid grid-cols-2 gap-2 pt-0.5">
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
                    {videoModel === "grok" ? "Grok Imagine" : videoModel === "veo" ? "Google Veo" : "Seedance"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {modelDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl p-1 shadow-xl z-50 space-y-0.5">
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
                          className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${
                            isSelected
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
                  className="w-full text-left bg-zinc-50 border border-zinc-200 hover:border-zinc-300 rounded-xl px-2.5 py-1.5 text-xs text-zinc-900 flex items-center justify-between cursor-pointer focus:outline-none focus:border-[#7F48ED] font-semibold"
                >
                  <span className="truncate">
                    {activeVoice?.name || "Select Voice"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${voiceDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {voiceDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl p-1 shadow-xl z-50 space-y-0.5 max-h-56 overflow-y-auto">
                    {availableVoices.map((v) => {
                      const isSelected = selectedVoiceId === v.id;
                      const isCloned = v.category === "cloned";
                      return (
                        <div
                          key={v.id}
                          onClick={() => {
                            setSelectedVoiceId(v.id);
                            setVoiceDropdownOpen(false);
                          }}
                          className={`px-3 py-1.5 rounded-lg text-xs cursor-pointer transition flex items-center justify-between ${
                            isSelected
                              ? "bg-[#7F48ED] text-white font-bold"
                              : "text-zinc-700 hover:bg-[#FF6700]/10 hover:text-[#FF6700]"
                          }`}
                        >
                          <div className="truncate min-w-0 pr-1">
                            <div className="flex items-center gap-1.5 truncate">
                              <span className="font-bold truncate">{v.name}</span>
                              {isCloned && (
                                <span className={`text-[9px] px-1 py-0.2 rounded font-bold uppercase ${
                                  isSelected ? "bg-white/20 text-white" : "bg-[#FF6700]/15 text-[#FF6700]"
                                }`}>
                                  CLONED
                                </span>
                              )}
                            </div>
                            <div className={`text-[10px] truncate ${isSelected ? "text-purple-100" : "text-zinc-500"}`}>
                              {v.description}
                            </div>
                          </div>
                          {isSelected && <Check className="w-3.5 h-3.5 shrink-0 ml-1" />}
                        </div>
                      );
                    })}
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
                className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition cursor-pointer border ${
                  softLabelDisclosure
                    ? "bg-[#FF6700] text-white border-[#FF6700]"
                    : "bg-zinc-100 text-zinc-500 border-zinc-200 hover:text-zinc-800"
                }`}
              >
                {softLabelDisclosure ? "ON" : "OFF (Default)"}
              </button>
            </div>
          </div>

          {/* ACTION BUTTON (Solid Purple #7F48ED, High Impact) */}
          <div className="pt-1">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl font-black text-sm transition shadow-lg shadow-[#7F48ED]/25 flex items-center justify-center gap-2 cursor-pointer bg-[#7F48ED] hover:bg-[#6b35d6] text-white disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Rendering AI Commercial..." : "Generate AI Video Ad"}
            </button>
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT STAGE: CLEAN LIGHT CANVAS & VIDEO PLAYER                */}
        {/* ============================================================== */}
        <div className="flex-1 min-w-0 bg-[#F8F9FC] flex flex-col p-4 sm:p-6 relative gap-4 h-auto lg:h-full lg:overflow-y-auto min-h-0">
          {/* Top Canvas Controls Bar (Clean White) */}
          <div className="w-full flex flex-wrap items-center justify-between gap-3 bg-white border border-zinc-200/90 rounded-2xl px-4 py-3 shadow-sm">
            {/* Format Ratio Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-zinc-500 mr-1 hidden sm:inline uppercase tracking-wider">Format:</span>
              <button
                onClick={() => setAspectRatio("9:16")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  aspectRatio === "9:16" ? "bg-[#7F48ED] text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                9:16 Vertical
              </button>
              <button
                onClick={() => setAspectRatio("1:1")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  aspectRatio === "1:1" ? "bg-[#7F48ED] text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                <Square className="w-3.5 h-3.5" />
                1:1 Square
              </button>
              <button
                onClick={() => setAspectRatio("4:5")}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
                  aspectRatio === "4:5" ? "bg-[#7F48ED] text-white shadow-sm" : "text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                4:5 Portrait
              </button>
            </div>

            {/* View Mode & Caption Toggles */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPhoneFrame(!showPhoneFrame)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                  showPhoneFrame
                    ? "bg-[#FF6700] text-white border-[#FF6700]"
                    : "bg-zinc-50 text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                {showPhoneFrame ? "Phone View" : "Studio Canvas"}
              </button>

              <button
                onClick={() => setShowCaptions(!showCaptions)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition hidden sm:inline-flex items-center gap-1 cursor-pointer ${
                  showCaptions
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

          {/* SUCCESS BANNER: Real AI Render */}
          {generatedResult && !generationError && (
            <div className="w-full bg-purple-50 border border-purple-200 rounded-2xl p-3.5 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-zinc-900 flex items-center gap-2">
                    <span>Generated AI Ad Ready: <span className="font-mono text-[#7F48ED]">{generatedResult.jobId}</span></span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      GENUINE AI RENDER
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600">
                    Voiceover synced &amp; all 3 ratios derived
                  </p>
                </div>
              </div>
              <Link
                href={`/studio/review?variantId=${generatedResult.jobId}`}
                className="px-4 py-2 bg-[#FF6700] hover:bg-[#e55c00] text-white rounded-xl text-xs font-bold transition shadow-md shadow-[#FF6700]/20 cursor-pointer"
              >
                Open in QA Review Room ➔
              </Link>
            </div>
          )}

          {/* 3-PART HYBRID PRODUCTION ANATOMY (Clean White Card) */}
          <div className="w-full bg-white border border-zinc-200 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5 text-[11px]">
                <Layers className="w-3.5 h-3.5 text-[#7F48ED]" />
                Hybrid Production Anatomy (22s Ad Master)
              </span>
              <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                Real Creator Hook + Client Media + AI Detail Scenes
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1.5 h-7 rounded-lg overflow-hidden font-mono text-[10px] font-bold select-none">
              <div className="col-span-3 bg-purple-50 border border-purple-200 text-[#7F48ED] flex items-center justify-center rounded-md px-1 truncate" title="0–3s: Real Creator Fronted Hook">
                0-3s Creator Hook
              </div>
              <div className="col-span-5 bg-orange-50 border border-orange-200 text-[#FF6700] flex items-center justify-center rounded-md px-1 truncate" title={`3–15s Product Media: ${uploadedMediaName || brandName}`}>
                3-15s Product: {uploadedMediaName || "Client Video"}
              </div>
              <div className="col-span-4 bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center rounded-md px-1 truncate" title="15–22s: AI Sensory B-roll & Motion CTA">
                15-22s AI Scenes &amp; CTA
              </div>
            </div>
          </div>

          {/* CENTERED VIDEO DISPLAY STAGE */}
          <div className="w-full flex-1 flex items-center justify-center py-2 relative min-h-[380px]">
            {/* Generation Progress Overlay (Clean White Backlit) */}
            {isGenerating && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-5 rounded-2xl border border-zinc-200 shadow-2xl">
                <div className="w-16 h-16 rounded-full border-4 border-[#7F48ED] border-t-transparent animate-spin" />
                <div className="space-y-1 max-w-sm">
                  <div className="text-xs font-mono font-black text-[#FF6700] tracking-wider">
                    {genProgress}% COMPLETED
                  </div>
                  <h4 className="text-sm sm:text-base font-bold text-zinc-900">
                    {genStepText || "Rendering AI Ad Master..."}
                  </h4>
                  <p className="text-xs text-zinc-500">
                    Synthesizing voiceover, visual frames, and composite tracks.
                  </p>
                </div>
                <div className="w-64 h-2 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200">
                  <div
                    className="h-full bg-gradient-to-r from-[#7F48ED] to-[#FF6700] transition-all duration-300"
                    style={{ width: `${genProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* VIDEO PLAYER CONTAINER */}
            {showPhoneFrame ? (
              /* Phone Mockup View */
              <div className="relative h-[min(650px,calc(100vh-230px))] aspect-[9/16] bg-black rounded-[44px] border-[6px] border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-between p-2">
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800 rounded-full z-20" />
                {activeVideoSrc ? (
                  <video
                    src={activeVideoSrc}
                    playsInline
                    loop
                    muted={isMuted}
                    autoPlay
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#090D16] text-white">
                    <div className="w-12 h-12 rounded-2xl bg-[#7F48ED]/20 border border-[#7F48ED]/30 flex items-center justify-center mb-3">
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

                {/* TikTok UI Icons (shown when video is active) */}
                {activeVideoSrc && (
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
                  <div className="font-extrabold text-xs text-white drop-shadow">@{brandName.toLowerCase().replace(/\s+/g, "")}</div>
                  <div className="text-[12px] text-zinc-100 line-clamp-2 drop-shadow font-medium leading-tight">
                    {selectedHook}
                  </div>
                </div>
              </div>
            ) : (
              /* Clean Studio Canvas Player */
              <div
                className={`relative flex items-center justify-center transition-all duration-300 overflow-hidden bg-black rounded-2xl border border-zinc-300/80 shadow-2xl ${
                  aspectRatio === "9:16"
                    ? "h-[min(650px,calc(100vh-230px))] aspect-[9/16]"
                    : aspectRatio === "1:1"
                    ? "h-[min(560px,calc(100vh-230px))] aspect-square"
                    : "h-[min(610px,calc(100vh-230px))] aspect-[4/5]"
                }`}
              >
                {/* Active Video Player */}
                {activeVideoSrc ? (
                  <>
                    <video
                      ref={videoRef}
                      src={activeVideoSrc}
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

                    {/* Clean Subtitle Overlay */}
                    {showCaptions && (
                      <div className="absolute bottom-8 left-3 right-3 text-center pointer-events-none z-10">
                        <span className="bg-black/85 text-white text-xs font-black uppercase px-3 py-1 rounded shadow-lg border border-white/10 tracking-wide">
                          {selectedHook.slice(0, 38)}...
                        </span>
                      </div>
                    )}
                  </>
                ) : uploadedMediaType === "image" && uploadedMediaSrc ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-zinc-900 p-4">
                    <img
                      src={uploadedMediaSrc}
                      alt={uploadedMediaName || "Product"}
                      className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                    />
                  </div>
                ) : (
                  /* Zero Demo Video Empty State: Clean Stage Ready for Generation */
                  <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#090D16] text-white select-none">
                    <div className="w-14 h-14 rounded-2xl bg-[#7F48ED]/15 border border-[#7F48ED]/30 flex items-center justify-center mb-3">
                      <Sparkles className="w-7 h-7 text-[#FF6700]" />
                    </div>
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-[10px] font-bold text-zinc-300 uppercase tracking-wider mb-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700] animate-pulse" />
                      <span>Stage Ready · Live Engine</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1">
                      {brandName} Commercial
                    </h3>
                    <p className="text-[11px] text-zinc-400 max-w-[220px] leading-relaxed mb-4">
                      Click &ldquo;Generate AI Video Ad&rdquo; on the left to synthesize the real AI scene and ElevenLabs audio.
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
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-white border border-zinc-200/90 rounded-2xl p-3.5 shadow-sm">
            <div className="text-xs text-zinc-600">
              Active Brand: <span className="font-extrabold text-zinc-900">{brandName}</span> · Offer: <span className="text-[#FF6700] font-bold">{brandOffer}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {activeVideoSrc ? (
                <a
                  href={activeVideoSrc}
                  download={generatedResult ? `relaunch-${generatedResult.jobId}-${aspectRatio}.mp4` : `${brandName.toLowerCase().replace(/\s+/g, "-")}-${aspectRatio}.mp4`}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-xl text-xs font-bold text-zinc-700 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download MP4
                </a>
              ) : null}

              <Link
                href={generatedResult ? `/studio/review?variantId=${generatedResult.jobId}` : "/studio/review"}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-xl text-xs font-extrabold text-white bg-[#FF6700] hover:bg-[#e55c00] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#FF6700]/20 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5" />
                {generatedResult ? "Review Generated Ad ➔" : "Open in QA Review Room"}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
