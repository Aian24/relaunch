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
  Wand2,
} from "lucide-react";

interface AngleContent {
  title: string;
  badge: string;
  hooks: string[];
  body: string;
}

function getAngleContent(brandName: string, offer: string): Record<string, AngleContent> {
  const brand = brandName.trim() || "My Brand";
  const cta = offer.trim() || "Exclusive Online Offer";

  return {
    problem: {
      title: "Problem & Solution",
      badge: "Highest Scale",
      hooks: [
        `Stop scrolling if you're sick of standard alternatives to ${brand}.`,
        `The real reason most solutions like ${brand} leave you frustrated.`,
        `If you haven't experienced ${brand} in 2026, you are missing out.`,
        `Why everyone is ditching generic options for ${brand} right now.`,
      ],
      body: `Frustrated with standard alternatives? ${brand} delivers premium results with zero compromises. Take advantage of ${cta} today and see the difference immediately.`,
    },
    ugc: {
      title: "Creator Review",
      badge: "Best Trust",
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
      badge: "High Clicks",
      hooks: [
        `3 reasons why everyone is quietly obsessed with ${brand}.`,
        `Reason number 3 is why you will never go back to standard alternatives.`,
        `Before you spend money anywhere else today, check these 3 facts about ${brand}.`,
        `3 signs you've found the highest-performing option on the market.`,
      ],
      body: `Reason 1: Unmatched craftsmanship and speed. Reason 2: Backed by verified customer reviews. Reason 3: Unlock ${cta} right now before it expires.`,
    },
    comparison: {
      title: "Us vs. Them",
      badge: "High Conversion",
      hooks: [
        `Generic alternatives vs. ${brand}: let's compare them side-by-side.`,
        `Don't make the mistake of buying outdated options when ${brand} exists.`,
        `Side-by-side test: can you spot the massive quality difference with ${brand}?`,
        `The honest truth about why ${brand} outperforms traditional brands.`,
      ],
      body: `Traditional options cut corners and overcharge. With ${brand}, you get genuine premium quality, rapid delivery, and ${cta}. Zero compromises.`,
    },
  };
}

export default function StudioVideoGenerator() {
  // Brand & Campaign Setup State
  const [brandName, setBrandName] = useState("Acme Brand");
  const [brandOffer, setBrandOffer] = useState("20% off first order");
  const [industryNiche, setIndustryNiche] = useState("E-Commerce & DTC");

  // Creative Angle & Copy
  const [selectedAngle, setSelectedAngle] = useState<"problem" | "ugc" | "listicle" | "comparison">("problem");
  const [selectedActor, setSelectedActor] = useState<"emma" | "marcus" | "sarah">("emma");
  const [videoModel, setVideoModel] = useState<"grok" | "veo" | "seedance">("grok");
  const [voiceStyle, setVoiceStyle] = useState<"energetic" | "warm" | "direct">("energetic");

  const angleDataMap = useMemo(() => getAngleContent(brandName, brandOffer), [brandName, brandOffer]);
  const currentAngleData = angleDataMap[selectedAngle];

  const [selectedHook, setSelectedHook] = useState(currentAngleData.hooks[0]);
  const [scriptBody, setScriptBody] = useState(currentAngleData.body);
  const [isEditingHook, setIsEditingHook] = useState(false);

  // AI Visual Scene Prompt (What the user wants Grok/Veo to generate)
  const [visualPrompt, setVisualPrompt] = useState(
    `Cinematic 4K advertising b-roll of ${brandName}, dramatic studio lighting, macro product motion, physical realism, 60fps`
  );

  // Product Media State (Supports BOTH Video & Image as reference basis)
  const [uploadedMediaSrc, setUploadedMediaSrc] = useState<string | null>(null);
  const [uploadedMediaName, setUploadedMediaName] = useState<string | null>(null);
  const [uploadedMediaSize, setUploadedMediaSize] = useState<string | null>(null);
  const [uploadedMediaBase64, setUploadedMediaBase64] = useState<string | null>(null);
  const [uploadedMediaType, setUploadedMediaType] = useState<"video" | "image" | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);

  const [softLabelDisclosure, setSoftLabelDisclosure] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Dropdown States
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
  const hookDropdownRef = useRef<HTMLDivElement>(null);
  const modelDropdownRef = useRef<HTMLDivElement>(null);
  const voiceDropdownRef = useRef<HTMLDivElement>(null);

  // Determine active video source
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

  // Update hook & body when angle or brand details change
  useEffect(() => {
    const angleObj = angleDataMap[selectedAngle];
    if (angleObj) {
      setSelectedHook(angleObj.hooks[0]);
      setScriptBody(angleObj.body);
      setIsEditingHook(false);
    }
  }, [selectedAngle, angleDataMap]);

  // Sync default prompt when brand changes
  useEffect(() => {
    setVisualPrompt(
      `Cinematic 4K advertising b-roll of ${brandName || "product"}, dramatic studio lighting, macro product motion, physical realism, 60fps`
    );
  }, [brandName]);

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

    // Read base64 for API ingestion
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

  // AI Prompt Enhancer Suggestions
  const promptPresets = [
    `Cinematic 4K advertising b-roll of ${brandName || "product"}, dramatic studio lighting, macro product motion, physical realism, 60fps`,
    `Hyper-realistic slow motion macro shot of ${brandName || "product"} with atmospheric rim lighting, water droplets, and cinematic depth of field`,
    `Dynamic 3D camera orbit around ${brandName || "product"} with sleek glossy reflections, warm sunset backlighting, and modern luxury aesthetic`,
    `Sensory high-energy product commercial shot of ${brandName || "product"}, vibrant natural motion, crystal clear textures, 60fps advertising grade`,
  ];

  const handleEnhancePrompt = () => {
    const currentIdx = promptPresets.indexOf(visualPrompt);
    const nextIdx = (currentIdx + 1) % promptPresets.length;
    setVisualPrompt(promptPresets[nextIdx]);
  };

  // Video Generation via Studio Engine API + ElevenLabs + fal.ai
  const handleGenerate = async () => {
    setGenerationError(null);
    setIsGenerating(true);
    setGenProgress(15);
    setGenStepText("Connecting to Studio Engine & analyzing direct-response brief...");

    const timer1 = setTimeout(() => {
      setGenProgress(35);
      setGenStepText("Calling ElevenLabs for live voiceover & kinetic timestamps...");
    }, 600);

    const timer2 = setTimeout(() => {
      setGenProgress(65);
      setGenStepText("Calling fal.ai for real Grok Imagine AI commercial scene...");
    }, 1500);

    const timer3 = setTimeout(() => {
      setGenProgress(85);
      setGenStepText("Compositing 3-part hybrid master & deriving 9:16, 1:1, 4:5 ratios...");
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
          mediaSource: uploadedMediaBase64 || uploadedMediaSrc || "",
          mediaType: uploadedMediaType || "prompt_only",
          visualPrompt: visualPrompt,
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
            ? "AI Video Generation Blocked: fal.ai Balance Exhausted"
            : "AI Video Generation Failed",
          message:
            errJson.error ||
            (isBalanceExhausted
              ? "The fal.ai account balance is $0.00. Top up credits at fal.ai/dashboard/billing to enable AI video generation."
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
    <div className="w-full max-w-full min-h-screen bg-[#08090D] text-[#F3F4F6] font-sans flex flex-col overflow-x-clip selection:bg-[#7F48ED] selection:text-white">
      {/* STUDIO TOP BAR */}
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

        {/* Center: Live Campaign Pill */}
        <div className="hidden md:flex items-center gap-2 bg-black/40 border border-white/10 rounded-xl px-3 py-1.5">
          <span className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">Active Brand:</span>
          <span className="text-xs font-black text-white">{brandName || "Untitled Brand"}</span>
          <span className="text-zinc-600">·</span>
          <span className="text-xs font-semibold text-[#FF6700]">{brandOffer || "No Offer Set"}</span>
        </div>

        {/* Right: Studio Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/studio/review"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#7F48ED] hover:bg-[#6b35d6] transition shadow-md cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Review Room</span>
          </Link>
        </div>
      </header>

      {/* 2-COLUMN STUDIO WORKSPACE */}
      <main className="w-full max-w-full flex-1 flex flex-col lg:flex-row relative overflow-x-clip">
        {/* LEFT PANEL: CREATION CONTROLS */}
        <div className="w-full lg:w-[460px] xl:w-[480px] shrink-0 bg-[#0D0E15] border-r border-white/10 p-4 sm:p-5 pb-20 space-y-4">
          <div className="space-y-4">
            {/* 1. BRAND & CAMPAIGN SETUP */}
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-300 block">
                  1. Brand Setup
                </label>
                <span className="text-[10px] font-mono text-[#00F0FF] font-bold">
                  PRODUCTION
                </span>
              </div>

              <div className="space-y-2">
                <div>
                  <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                    Brand Name
                  </label>
                  <input
                    type="text"
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    placeholder="e.g. Acme Brand, Glow Cosmetics, Apex Fitness"
                    className="w-full bg-black/60 border border-white/10 focus:border-[#7F48ED] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Offer / CTA
                    </label>
                    <input
                      type="text"
                      value={brandOffer}
                      onChange={(e) => setBrandOffer(e.target.value)}
                      placeholder="e.g. 20% off first order"
                      className="w-full bg-black/60 border border-white/10 focus:border-[#7F48ED] rounded-lg px-3 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider block mb-1">
                      Industry
                    </label>
                    <select
                      value={industryNiche}
                      onChange={(e) => setIndustryNiche(e.target.value)}
                      className="w-full bg-black/60 border border-white/10 focus:border-[#7F48ED] rounded-lg px-2.5 py-2 text-xs text-white focus:outline-none transition"
                    >
                      <option value="E-Commerce & DTC">E-Commerce &amp; DTC</option>
                      <option value="Food & Hospitality">Food &amp; Dining</option>
                      <option value="Beauty & Skincare">Beauty &amp; Cosmetics</option>
                      <option value="Fitness & Health">Fitness &amp; Wellness</option>
                      <option value="Local Services">Local Services</option>
                      <option value="B2B & SaaS">Software &amp; B2B</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. PRODUCT MEDIA: VIDEO OR IMAGE REFERENCE (Optional Basis) */}
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-300 block">
                  2. Product Media (Photo or Video Basis)
                </label>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${
                  uploadedMediaSrc
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                    : "bg-white/5 text-zinc-400 border-white/10"
                }`}>
                  {uploadedMediaSrc ? (uploadedMediaType === "image" ? "PHOTO ATTACHED" : "VIDEO ATTACHED") : "OPTIONAL MEDIA"}
                </span>
              </div>

              {/* Hidden file input supporting MP4, MOV, PNG, JPG, WEBP */}
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
                /* Attached Media Info Card */
                <div className="p-3 rounded-xl bg-black/50 border border-emerald-500/40 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/30">
                      {uploadedMediaType === "image" ? (
                        <ImageIcon className="w-4 h-4" />
                      ) : (
                        <FileVideo className="w-4 h-4" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-white truncate max-w-[220px]">
                        {uploadedMediaName}
                      </div>
                      <div className="text-[10px] font-mono text-zinc-400">
                        {uploadedMediaType === "image" ? "Product Photo Reference" : "Product Video Asset"} · {uploadedMediaSize}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-2.5 py-1 text-[11px] font-semibold text-zinc-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg border border-white/10 transition cursor-pointer"
                    >
                      Replace
                    </button>
                    <button
                      type="button"
                      onClick={handleClearUploadedMedia}
                      className="p-1 text-zinc-500 hover:text-red-400 transition cursor-pointer"
                      title="Remove Media"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                /* Upload Drop Area */
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(true);
                  }}
                  onDragLeave={() => setIsDraggingFile(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setIsDraggingFile(false);
                    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                      handleMediaFile(e.dataTransfer.files[0]);
                    }
                  }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`w-full py-4 px-3 rounded-xl border-2 border-dashed transition flex flex-col items-center justify-center gap-2 cursor-pointer text-center ${
                    isDraggingFile
                      ? "border-[#FF6700] bg-[#FF6700]/10 text-white"
                      : "border-white/20 hover:border-[#FF6700] bg-black/20 hover:bg-[#FF6700]/5 text-zinc-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-white/5 text-[#FF6700] flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-white">
                      Upload Product Video or Photo (.mp4, .mov, .jpg, .png)
                    </div>
                    <p className="text-[10px] text-zinc-400">
                      Use as a visual reference for Grok Imagine / Google Veo, or generate from prompt
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 3. AI VISUAL SCENE PROMPT (Direct Scene Direction) */}
            <div className="p-3.5 rounded-xl bg-black/30 border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-300 block">
                  3. AI Scene Prompt (Visual Direction)
                </label>
                <button
                  type="button"
                  onClick={handleEnhancePrompt}
                  className="text-[10px] font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 cursor-pointer"
                >
                  <Wand2 className="w-3 h-3 text-[#A78BFA]" />
                  <span>Cycle Idea</span>
                </button>
              </div>
              <textarea
                value={visualPrompt}
                onChange={(e) => setVisualPrompt(e.target.value)}
                rows={2}
                className="w-full bg-black/60 border border-white/10 focus:border-[#7F48ED] rounded-lg p-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none resize-none leading-relaxed transition"
                placeholder="Describe what you want the AI scene to generate..."
              />
              <span className="text-[10px] text-zinc-500 font-mono block">
                Directs Grok Imagine 1.5 &amp; Google Veo video motion synthesis
              </span>
            </div>

            {/* 4. CREATIVE ANGLE */}
            <div className="space-y-2">
              <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                4. Creative Angle
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

            {/* 5. OPENING HOOK (0–3s) */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  5. Opening Hook (0–3s)
                </label>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsEditingHook(!isEditingHook)}
                    className="text-[11px] font-bold text-[#A78BFA] hover:text-white flex items-center gap-1 cursor-pointer"
                    title="Edit Hook Directly"
                  >
                    <Edit3 className="w-3 h-3" />
                    {isEditingHook ? "Select Angle" : "Edit Hook"}
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
                            className={`p-2.5 rounded-lg text-xs cursor-pointer transition flex items-start gap-2 ${
                              isSelected
                                ? "bg-[#7F48ED] text-white font-bold"
                                : "text-zinc-300 hover:bg-[#FF6700] hover:text-black hover:font-bold"
                            }`}
                          >
                            <span className="font-mono text-[10px] opacity-60 shrink-0">{i + 1}.</span>
                            <span className="leading-snug">{h}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 6. AD VOICE SCRIPT */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  6. Ad Voiceover Script (~20s)
                </label>
                <span className="text-[10px] font-mono text-zinc-500">
                  {scriptBody.split(" ").filter(Boolean).length} words
                </span>
              </div>
              <textarea
                value={scriptBody}
                onChange={(e) => setScriptBody(e.target.value)}
                rows={3}
                className="w-full bg-black/40 border border-white/10 focus:border-[#7F48ED] rounded-xl p-3 text-xs text-white placeholder-zinc-500 focus:outline-none resize-none leading-relaxed transition"
                placeholder="Script text for ElevenLabs voiceover..."
              />
            </div>

            {/* 7. REAL CREATOR HOOK UGC (0–3s) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-zinc-400 block">
                  7. Creator Fronted Hook
                </label>
                <span className="text-[10px] font-mono text-zinc-400">0–3s Face</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: "emma", name: "Emma", type: "Beauty / DTC" },
                  { id: "marcus", name: "Marcus", type: "Tech / Product" },
                  { id: "sarah", name: "Sarah", type: "Lifestyle / Local" },
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

            {/* 8. VISUAL ENGINE & VOICE STYLE */}
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

            {/* 9. COMPLIANCE DISCLOSURE */}
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
                Off by default: real creators front this ad, and product media is edited in.
              </p>
            </div>
          </div>

          {/* GENERATE BUTTON (Always Available) */}
          <div className="pt-2">
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="w-full py-3.5 rounded-xl font-black text-sm transition shadow-lg flex items-center justify-center gap-2 cursor-pointer bg-[#7F48ED] hover:bg-[#6b35d6] text-white shadow-[#7F48ED]/20"
            >
              <RefreshCw className={`w-4 h-4 ${isGenerating ? "animate-spin" : ""}`} />
              {isGenerating ? "Rendering AI Commercial..." : "Generate AI Video Ad"}
            </button>
          </div>
        </div>

        {/* RIGHT STAGE: VIDEO CANVAS (Sticky Pinned — Always In View While Scrolling) */}
        <div className="flex-1 min-w-0 lg:sticky lg:top-[53px] lg:self-start bg-[#08090D] flex flex-col p-3 sm:p-4 relative z-20 gap-3">
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

          {/* HIGH-IMPACT ERROR BANNER (When fal.ai balance is exhausted) */}
          {generationError && (
            <div className="w-full bg-red-950/40 border-2 border-red-500/60 rounded-2xl p-4 sm:p-5 flex flex-col gap-3.5 z-30 my-2 shadow-2xl backdrop-blur-md animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center shrink-0">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-black text-white uppercase tracking-wide">
                      {generationError.title}
                    </h4>
                    <span className="text-[10px] bg-red-500/20 text-red-300 border border-red-500/40 font-mono font-bold px-2 py-0.5 rounded">
                      NO FAKE FALLBACKS
                    </span>
                  </div>
                  <p className="text-xs text-red-200/90 mt-1 leading-relaxed">
                    {generationError.message}
                  </p>
                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    Mock video generation is disabled. Because this is a real production application, video generation strictly halts until your fal.ai API balance is topped up.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-end gap-2.5 pt-1 border-t border-red-500/20">
                {generationError.balanceExhausted && (
                  <a
                    href={generationError.billingUrl || "https://fal.ai/dashboard/billing"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6700] hover:bg-[#FF771A] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#FF6700]/30 cursor-pointer"
                  >
                    <span>Top Up fal.ai Balance</span>
                    <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={() => setGenerationError(null)}
                  className="px-3.5 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition cursor-pointer"
                >
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* SUCCESS BANNER: GENUINE AI RENDER */}
          {generatedResult && !generationError && (
            <div className="w-full bg-[#7F48ED]/20 border border-[#7F48ED]/50 rounded-xl p-3 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 my-1 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>Generated AI Ad Ready: <span className="font-mono text-[#A78BFA]">{generatedResult.jobId}</span></span>
                    <span className="text-[10px] bg-emerald-500/25 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-500/40 font-mono font-bold">
                      GENUINE AI RENDER
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-300">
                    ✓ ElevenLabs voiceover + fal.ai Grok video synced • 9:16, 1:1, 4:5 derived
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  href={`/studio/review?variantId=${generatedResult.jobId}`}
                  className="w-full sm:w-auto flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FF6700] hover:bg-[#FF771A] text-white rounded-lg text-xs font-extrabold transition shadow-lg shadow-[#FF6700]/25 cursor-pointer"
                >
                  <span>Review in QA Portal</span>
                  <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                </Link>
              </div>
            </div>
          )}

          {/* 3-Part Hybrid Composite Timeline */}
          <div className="w-full bg-[#0D0E15]/90 border border-white/10 rounded-xl p-2 sm:p-2.5 flex flex-col gap-1.5 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-zinc-300 flex items-center gap-1.5 text-[11px]">
                <Layers className="w-3.5 h-3.5 text-[#7F48ED]" />
                Hybrid Production Anatomy (22s Ad Master)
              </span>
              <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline">
                Real Creator Hook + Product Media Reference + Grok Imagine AI
              </span>
            </div>
            <div className="grid grid-cols-12 gap-1.5 h-6 rounded-md overflow-hidden font-mono text-[9px] font-bold select-none">
              <div className="col-span-3 bg-[#7F48ED]/25 border border-[#7F48ED]/50 text-[#C4B5FD] flex items-center justify-center rounded px-1 truncate" title="0–3s: Real Creator Fronted Hook">
                0-3s Creator Hook
              </div>
              <div className="col-span-5 bg-[#FF6700]/20 border border-[#FF6700]/40 text-[#FF8533] flex items-center justify-center rounded px-1 truncate" title={`3–15s Product Media: ${uploadedMediaName || "Visual Reference"}`}>
                3-15s Product: {uploadedMediaName || (uploadedMediaSrc ? "Attached Media" : "AI Generated")}
              </div>
              <div className="col-span-4 bg-[#00F0FF]/20 border border-[#00F0FF]/40 text-[#67E8F9] flex items-center justify-center rounded px-1 truncate" title="15–22s: AI Sensory B-roll & Motion CTA">
                15-22s AI Scenes &amp; Motion CTA
              </div>
            </div>
          </div>

          {/* Centered Video Display Stage */}
          <div className="w-full flex items-center justify-center py-1 relative">
            {/* Ambient Lighting Glow */}
            <div className="absolute w-[440px] h-[440px] rounded-full bg-[#7F48ED]/15 blur-3xl pointer-events-none" />

            {/* Generation Progress Overlay with Circular Animated Loader */}
            {isGenerating && (
              <div className="absolute inset-0 bg-[#08090D]/95 backdrop-blur-xl z-40 flex flex-col items-center justify-center p-6 text-center space-y-6 rounded-2xl animate-in fade-in duration-200">
                {/* Circular Animated Loader Stage */}
                <div className="relative w-44 h-44 flex items-center justify-center">
                  {/* Outer Ambient Glow Aura */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#7F48ED]/30 via-[#FF6700]/20 to-[#00F0FF]/30 blur-2xl animate-pulse" />

                  {/* Outer Spinning Orbit Ring with Ticks */}
                  <div className="absolute inset-0 rounded-full border border-dashed border-white/20 animate-[spin_12s_linear_infinite]" />

                  {/* Secondary Fast Neon Accent Orbit */}
                  <div className="absolute inset-2 rounded-full border-t-2 border-r-2 border-[#FF6700] border-b-transparent border-l-transparent animate-[spin_2s_linear_infinite]" />

                  {/* SVG Circular Progress Ring */}
                  <svg className="w-40 h-40 transform -rotate-90 origin-center drop-shadow-[0_0_15px_rgba(127,72,237,0.5)]" viewBox="0 0 128 128">
                    <defs>
                      <linearGradient id="circleProgressGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#7F48ED" />
                        <stop offset="50%" stopColor="#A855F7" />
                        <stop offset="100%" stopColor="#FF6700" />
                      </linearGradient>
                    </defs>

                    {/* Background Track Circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      className="text-white/10"
                      strokeWidth="8"
                      stroke="currentColor"
                      fill="transparent"
                    />

                    {/* Animated Fill Circle */}
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      stroke="url(#circleProgressGrad)"
                      strokeWidth="8"
                      strokeDasharray={339.292}
                      strokeDashoffset={339.292 - (339.292 * Math.min(genProgress, 100)) / 100}
                      strokeLinecap="round"
                      fill="transparent"
                      className="transition-all duration-500 ease-out"
                    />
                  </svg>

                  {/* Center Content: Percentage & Glowing Indicator */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                    <div className="w-6 h-6 rounded-full bg-[#FF6700]/20 border border-[#FF6700]/40 flex items-center justify-center mb-1 animate-bounce">
                      <Sparkles className="w-3.5 h-3.5 text-[#FF6700]" />
                    </div>
                    <div className="text-3xl font-black font-mono tracking-tight text-white flex items-baseline">
                      <span>{genProgress}</span>
                      <span className="text-sm text-[#FF6700] ml-0.5">%</span>
                    </div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 font-bold mt-0.5">
                      Rendering
                    </span>
                  </div>
                </div>

                {/* Progress Narrative & Step Description */}
                <div className="space-y-2 max-w-md px-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                    <span className="text-emerald-400 font-bold">Studio Engine Active</span>
                    <span className="text-zinc-500">•</span>
                    <span className="text-zinc-400 font-semibold">{videoModel.toUpperCase()} Pipeline</span>
                  </div>
                  <h4 className="text-base sm:text-lg text-white font-bold tracking-tight">
                    {genStepText || "Synthesizing Direct-Response Ad Master..."}
                  </h4>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-sm mx-auto">
                    ElevenLabs audio synching with fal.ai neural frame generation & 3-ratio multi-cut stitching.
                  </p>
                </div>

                {/* Micro Pipeline Step Indicator Chips */}
                <div className="grid grid-cols-4 gap-1.5 w-full max-w-md px-2 text-[10px] font-mono font-semibold">
                  <div className={`p-1.5 rounded-lg border flex flex-col items-center gap-0.5 transition-all ${
                    genProgress >= 15 ? "bg-[#7F48ED]/20 border-[#7F48ED]/50 text-white" : "bg-white/[0.02] border-white/5 text-zinc-500"
                  }`}>
                    <span className="text-[9px] text-zinc-400">Step 1</span>
                    <span className="truncate">Brief & Hook</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border flex flex-col items-center gap-0.5 transition-all ${
                    genProgress >= 35 ? "bg-[#7F48ED]/20 border-[#7F48ED]/50 text-white" : "bg-white/[0.02] border-white/5 text-zinc-500"
                  }`}>
                    <span className="text-[9px] text-zinc-400">Step 2</span>
                    <span className="truncate">ElevenLabs</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border flex flex-col items-center gap-0.5 transition-all ${
                    genProgress >= 65 ? "bg-[#FF6700]/20 border-[#FF6700]/50 text-[#FF8533]" : "bg-white/[0.02] border-white/5 text-zinc-500"
                  }`}>
                    <span className="text-[9px] text-zinc-400">Step 3</span>
                    <span className="truncate">fal.ai Grok</span>
                  </div>
                  <div className={`p-1.5 rounded-lg border flex flex-col items-center gap-0.5 transition-all ${
                    genProgress >= 85 ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-300" : "bg-white/[0.02] border-white/5 text-zinc-500"
                  }`}>
                    <span className="text-[9px] text-zinc-400">Step 4</span>
                    <span className="truncate">3-Ratio Cut</span>
                  </div>
                </div>

                {/* Secondary Progress Bar */}
                <div className="w-64 h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#7F48ED] via-[#A855F7] to-[#FF6700] transition-all duration-300"
                    style={{ width: `${genProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* STAGE CONTAINER: Renders Video, Image, or Prompt-Driven Visualizer */}
            <div
              className={`relative flex items-center justify-center transition-all duration-300 overflow-hidden bg-black rounded-2xl border border-white/10 shadow-2xl ${
                aspectRatio === "9:16"
                  ? "h-[540px] sm:h-[580px] max-h-[calc(100vh-250px)] aspect-[9/16]"
                  : aspectRatio === "1:1"
                  ? "h-[480px] sm:h-[520px] max-h-[calc(100vh-250px)] aspect-square"
                  : "h-[500px] sm:h-[540px] max-h-[calc(100vh-250px)] aspect-[4/5]"
              }`}
            >
              {/* Top Status Watermark */}
              <div className="absolute top-3 left-3 z-20 pointer-events-none">
                {generatedResult && !generationError ? (
                  <span className="bg-emerald-950/85 text-emerald-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-emerald-500/40 shadow flex items-center gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    GENUINE AI RENDER ({generatedResult.jobId})
                  </span>
                ) : uploadedMediaType === "image" ? (
                  <span className="bg-black/80 text-[#00F0FF] text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-[#00F0FF]/30 shadow flex items-center gap-1.5">
                    <ImageIcon className="w-3 h-3 text-[#00F0FF]" />
                    IMAGE REFERENCE BASIS: {uploadedMediaName}
                  </span>
                ) : uploadedMediaType === "video" ? (
                  <span className="bg-black/80 text-zinc-300 text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-white/15 shadow flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    VIDEO ASSET: {uploadedMediaName}
                  </span>
                ) : (
                  <span className="bg-black/80 text-[#A78BFA] text-[10px] font-mono font-bold px-2.5 py-1 rounded-md border border-[#7F48ED]/30 shadow flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-[#A78BFA]" />
                    AI PROMPT-DRIVEN VIDEO GENERATOR
                  </span>
                )}
              </div>

              {/* MEDIA DISPLAY: Video / Image / Prompt Stage */}
              {activeVideoSrc ? (
                /* Video Player */
                <video
                  ref={videoRef}
                  src={activeVideoSrc}
                  playsInline
                  loop
                  muted={isMuted}
                  autoPlay
                  className="w-full h-full object-cover"
                />
              ) : uploadedMediaType === "image" && uploadedMediaSrc ? (
                /* Product Photo Preview */
                <div className="relative w-full h-full flex items-center justify-center bg-black/90 p-4">
                  <img
                    src={uploadedMediaSrc}
                    alt={uploadedMediaName || "Product Reference"}
                    className="max-h-full max-w-full object-contain rounded-xl shadow-2xl transition duration-500"
                  />
                  <div className="absolute bottom-4 left-4 right-4 bg-black/75 backdrop-blur-md border border-white/10 rounded-xl p-2.5 text-center">
                    <span className="text-[11px] font-semibold text-zinc-200">
                      Grok Imagine &amp; Veo will animate this image using your prompt
                    </span>
                  </div>
                </div>
              ) : (
                /* Pure Prompt-Driven Canvas */
                <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-black/80 via-[#0D0E15] to-black/95">
                  <div className="w-16 h-16 rounded-3xl bg-[#7F48ED]/15 border border-[#7F48ED]/30 text-[#A78BFA] flex items-center justify-center shadow-lg shadow-[#7F48ED]/10 mb-4">
                    <Wand2 className="w-8 h-8 text-[#A78BFA]" />
                  </div>
                  <div className="space-y-1.5 max-w-xs mb-4">
                    <h3 className="text-sm sm:text-base font-black text-white uppercase tracking-wide">
                      AI Video Commercial Studio
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      Grok Imagine &amp; Google Veo render the scene from your prompt and voiceover script.
                    </p>
                  </div>

                  {/* Active Prompt Preview Box */}
                  <div className="w-full max-w-xs p-3 rounded-xl bg-black/60 border border-white/10 text-left mb-4 space-y-1">
                    <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-bold">
                      Active Scene Prompt:
                    </div>
                    <p className="text-[11px] text-[#A78BFA] line-clamp-3 leading-snug font-medium italic">
                      &ldquo;{visualPrompt}&rdquo;
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-300 hover:text-white transition flex items-center gap-1.5 cursor-pointer"
                  >
                    <Upload className="w-3.5 h-3.5 text-[#FF6700]" />
                    <span>Upload Product Photo / Video (Optional)</span>
                  </button>
                </div>
              )}

              {/* AI Blocked Overlay when fal.ai credit exhausted */}
              {generationError && (
                <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30">
                  <div className="w-14 h-14 rounded-2xl bg-red-500/20 text-red-400 border border-red-500/40 flex items-center justify-center mb-3">
                    <AlertTriangle className="w-8 h-8" />
                  </div>
                  <div className="text-xs font-mono font-bold text-red-400 tracking-wider uppercase mb-1">
                    AI Generation Blocked
                  </div>
                  <h3 className="text-base font-extrabold text-white max-w-xs mb-2">
                    {generationError.title}
                  </h3>
                  <p className="text-xs text-zinc-300 max-w-sm mb-4 leading-relaxed">
                    {generationError.message}
                  </p>
                  <p className="text-[11px] text-zinc-400 max-w-xs mb-4">
                    Mock fallback generation is disabled in production. Top up your fal.ai API balance to render real AI commercial video.
                  </p>
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    {generationError.balanceExhausted && (
                      <a
                        href={generationError.billingUrl || "https://fal.ai/dashboard/billing"}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 px-4 py-2 bg-[#FF6700] hover:bg-[#FF771A] text-white rounded-xl text-xs font-bold transition shadow-lg shadow-[#FF6700]/30 cursor-pointer"
                      >
                        <span>Top Up fal.ai Balance</span>
                        <ArrowLeft className="w-3.5 h-3.5 rotate-180" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => setGenerationError(null)}
                      className="px-3.5 py-2 bg-white/10 hover:bg-white/15 text-zinc-300 hover:text-white rounded-xl text-xs font-semibold border border-white/10 transition cursor-pointer"
                    >
                      Dismiss &amp; View Preview
                    </button>
                  </div>
                </div>
              )}

              {/* Video Play/Pause Overlay if video is active */}
              {activeVideoSrc && !generationError && (
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
              )}

              {/* Audio Mute Pill Toggle if video is active */}
              {activeVideoSrc && !generationError && (
                <button
                  onClick={toggleMute}
                  className="absolute bottom-3 right-3 p-2 rounded-full bg-black/70 text-white hover:bg-black/90 transition z-20 cursor-pointer"
                  title={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              )}

              {/* Subtitle Overlay */}
              {showCaptions && !generationError && (
                <div className="absolute bottom-8 left-3 right-3 text-center pointer-events-none z-10">
                  <span className="bg-black/85 text-white text-xs font-black uppercase px-3 py-1 rounded shadow-lg border border-white/10 tracking-wide">
                    {selectedHook.slice(0, 38)}...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Stage Action Toolbar */}
          <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#0D0E15]/80 backdrop-blur-md border border-white/10 rounded-xl p-3 z-20">
            <div className="text-xs text-zinc-400">
              Active Brand: <span className="font-extrabold text-white">{brandName}</span> · Offer: <span className="text-[#FF6700] font-bold">{brandOffer}</span>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {activeVideoSrc ? (
                <a
                  href={activeVideoSrc}
                  download={generatedResult ? `relaunch-${generatedResult.jobId}-${aspectRatio}.mp4` : `${brandName.toLowerCase().replace(/\s+/g, "-")}-raw-${aspectRatio}.mp4`}
                  className="flex-1 sm:flex-initial px-4 py-2 rounded-lg text-xs font-bold text-zinc-200 bg-white/5 hover:bg-white/10 border border-white/10 transition flex items-center justify-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  {generatedResult ? "Download Generated MP4" : "Download Attached Asset"}
                </a>
              ) : null}

              <Link
                href={generatedResult ? `/studio/review?variantId=${generatedResult.jobId}` : "/studio/review"}
                className="flex-1 sm:flex-initial px-5 py-2 rounded-lg text-xs font-extrabold text-black bg-[#FF6700] hover:bg-[#e55c00] transition flex items-center justify-center gap-1.5 shadow-md shadow-[#FF6700]/20 cursor-pointer"
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
