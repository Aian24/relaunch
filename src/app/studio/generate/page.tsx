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
): { text: string; phase: "hook" | "body" | "cta" } {
  // 1. Hook Phase: 0.0s – 3.5s
  if (currentTime < 3.5) {
    return {
      text: hookText || "Stop scrolling & check this out",
      phase: "hook",
    };
  }

  // 2. Commercial Body: Split script into natural sentences
  const rawSentences = (scriptBody || "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const sentences = rawSentences.length > 0 ? rawSentences : [scriptBody || ""];

  if (sentences.length === 1) {
    return {
      text: sentences[0],
      phase: "body",
    };
  }

  if (sentences.length === 2) {
    if (currentTime < 11.0) {
      return {
        text: sentences[0],
        phase: "body",
      };
    } else {
      return {
        text: sentences[1],
        phase: "cta",
      };
    }
  }

  // 3 or more sentences (e.g. Problem -> Solution -> Call-To-Action)
  if (currentTime < 9.0) {
    return {
      text: sentences[0],
      phase: "body",
    };
  } else if (currentTime < 15.0) {
    return {
      text: sentences[1],
      phase: "body",
    };
  } else {
    return {
      text: sentences.slice(2).join(" "),
      phase: "cta",
    };
  }
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
  const [videoModel, setVideoModel] = useState<"kling" | "grok" | "seedance">("kling");
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
    clientMedia?: { url: string; type: "image" | "video"; name: string };
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
  } | null>(null);

  const [currentTime, setCurrentTime] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const creatorVideoRef = useRef<HTMLVideoElement>(null);
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

  // Video Generation via Studio Engine API (supports single or 5-angle batch)
  const handleGenerate = async (asBatch = generationMode === "batch") => {
    setGenerationError(null);
    setIsGenerating(true);
    setMobileTab("preview");
    setGenProgress(10);
    setGenStepText(
      asBatch
        ? "Connecting to Studio Engine & preparing 5-angle campaign matrix..."
        : "Connecting to Studio Engine & analyzing creative brief..."
    );

    // Smooth, realistic progress simulation matching real fal.ai & ElevenLabs execution (~70-85s)
    const progressInterval = setInterval(() => {
      setGenProgress((prev) => {
        if (prev < 25) {
          setGenStepText("Generating authentic creator voiceover via ElevenLabs...");
          return prev + 2;
        } else if (prev < 55) {
          setGenStepText("fal.ai Kling neural engine generating 4K commercial motion frames...");
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
          aiModel: videoModel === "grok" ? "grok-1.5" : videoModel === "seedance" ? "seedance-fast" : "kling-pro",
          isBatch: asBatch,
        }),
      });

      clearInterval(progressInterval);

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
          hookClipUrl: activeCreator.actorPresetId === "sarah" ? "/videos/reels/herbivore-aquarius-cream.mp4" : "/videos/reels/beauty-ugc-routine.mp4",
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
        localStorage.setItem("relaunch_studio_generated_variants", JSON.stringify(list));
      } catch (storageErr) {
        console.warn("Could not save to review queue localStorage:", storageErr);
      }

      setIsGenerating(false);
    } catch (err: any) {
      clearInterval(progressInterval);
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
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
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
      creatorVideoRef.current?.pause();
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play().catch(() => {});
      creatorVideoRef.current?.play().catch(() => {});
      audioRef.current?.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) videoRef.current.muted = nextMuted;
    if (creatorVideoRef.current) creatorVideoRef.current.muted = nextMuted;
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      audioRef.current.volume = nextMuted ? 0 : 1;
      if (!nextMuted) {
        audioRef.current.play().catch(() => {});
      }
    }
  };

  const seekToSegment = (targetSeconds: number) => {
    setCurrentTime(targetSeconds);
    if (audioRef.current) {
      audioRef.current.currentTime = targetSeconds;
      if (isPlaying) audioRef.current.play().catch(() => {});
    }
    if (videoRef.current) {
      videoRef.current.currentTime = targetSeconds % (videoRef.current.duration || 5);
    }
    if (creatorVideoRef.current) {
      creatorVideoRef.current.currentTime = targetSeconds % (creatorVideoRef.current.duration || 3.5);
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

        {/* Right: Review Room & Approved Vault Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          <Link
            href="/studio/approved"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold text-zinc-700 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 transition cursor-pointer shrink-0"
            title="Open Approved Vault"
          >
            <FolderOpen className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vault</span>
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
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === "controls"
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
          className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center justify-center gap-1.5 ${
            mobileTab === "preview"
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
          className={`w-full lg:w-[460px] xl:w-[480px] shrink-0 bg-white border-r border-zinc-200/90 p-4 sm:p-5 pb-28 space-y-4 h-auto lg:h-full lg:overflow-y-auto min-h-0 ${
            mobileTab === "controls" ? "block" : "hidden lg:block"
          }`}
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
                <div
                  onWheel={(e) => e.stopPropagation()}
                  className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-xl p-1 shadow-xl z-50 space-y-0.5 max-h-60 overflow-y-auto overscroll-contain"
                  style={{ scrollbarWidth: "thin" }}
                >
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5">
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
                    {videoModel === "kling" ? "Kling 4K Pro" : videoModel === "grok" ? "Grok Imagine" : "Seedance 2.0"}
                  </span>
                  <ChevronDown className={`w-3.5 h-3.5 text-zinc-500 shrink-0 transition-transform ${modelDropdownOpen ? "rotate-180" : ""}`} />
                </button>

                {modelDropdownOpen && (
                  <div
                    onWheel={(e) => e.stopPropagation()}
                    className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-zinc-200 rounded-xl p-1 shadow-2xl z-50 space-y-0.5 overscroll-contain"
                  >
                    {[
                      { id: "kling", label: "Kling 4K Pro (Ultra-HD AI)" },
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
                  <div
                    onWheel={(e) => e.stopPropagation()}
                    className="absolute bottom-full left-0 right-0 mb-1.5 bg-white border border-zinc-200 rounded-xl p-1 shadow-2xl z-50 space-y-0.5 max-h-64 overflow-y-auto overscroll-contain"
                    style={{ scrollbarWidth: "thin" }}
                  >
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

          {/* GENERATION MODE SWITCHER & ACTION BUTTON */}
          <div className="pt-1 space-y-2">
            {/* Mode Switcher */}
            <div className="flex items-center gap-1 p-1 bg-zinc-100 rounded-xl border border-zinc-200/80">
              <button
                type="button"
                onClick={() => setGenerationMode("single")}
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  generationMode === "single"
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
                className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
                  generationMode === "batch"
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
          </div>
        </div>

        {/* ============================================================== */}
        {/* RIGHT STAGE: CLEAN LIGHT CANVAS & VIDEO PLAYER                */}
        {/* ============================================================== */}
        <div className={`flex-1 min-w-0 bg-[#F8F9FC] flex-col p-3 sm:p-6 relative gap-3 sm:gap-4 h-auto lg:h-full lg:overflow-y-auto min-h-0 ${mobileTab === "preview" ? "flex" : "hidden lg:flex"}`}>
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

          {/* 3-PART HYBRID PRODUCTION ANATOMY (Interactive Timeline) */}
          <div className="w-full bg-white border border-zinc-200 rounded-2xl p-3 sm:p-3.5 flex flex-col gap-2 shadow-sm">
            <div className="flex items-center justify-between text-xs">
              <span className="font-extrabold uppercase tracking-wider text-zinc-900 flex items-center gap-1.5 text-[11px]">
                <Layers className="w-3.5 h-3.5 text-[#7F48ED]" />
                Hybrid Production Anatomy (22s Ad Master)
              </span>
              <div className="flex items-center gap-2">
                {generatedResult && (
                  <span className="text-[11px] font-mono font-bold text-[#FF6700]">
                    {Math.floor(currentTime)}s / 22s
                  </span>
                )}
                <span className="text-[10px] font-mono text-zinc-500 hidden sm:inline">
                  Real Creator Hook + Client Media + AI Detail Scenes
                </span>
              </div>
            </div>

            {/* Segment Buttons with Active Time Glow */}
            <div className="grid grid-cols-12 gap-1.5 h-8 rounded-lg font-mono text-[10px] font-bold select-none">
              <button
                type="button"
                onClick={() => seekToSegment(0)}
                className={`col-span-3 rounded-lg px-1 truncate flex items-center justify-center transition-all cursor-pointer ${
                  generatedResult && currentTime < 3.5
                    ? "bg-[#7F48ED] text-white shadow-md ring-2 ring-[#7F48ED]/40 font-black scale-[1.01]"
                    : "bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#7F48ED]"
                }`}
                title="0–3.5s: Real Creator Fronted Hook"
              >
                0-3s Creator Hook
              </button>
              <button
                type="button"
                onClick={() => seekToSegment(3.5)}
                className={`col-span-5 rounded-lg px-1 truncate flex items-center justify-center transition-all cursor-pointer ${
                  generatedResult && currentTime >= 3.5 && currentTime < 15.0
                    ? "bg-[#FF6700] text-white shadow-md ring-2 ring-[#FF6700]/40 font-black scale-[1.01]"
                    : "bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF6700]"
                }`}
                title={`3.5–15s Product: ${uploadedMediaName || brandName}`}
              >
                {uploadedMediaName || (Boolean(generatedResult?.clientMedia?.url || uploadedMediaSrc) ? "3-15s Product: Client Asset" : "3-15s AI Commercial Motion")}
              </button>
              <button
                type="button"
                onClick={() => seekToSegment(15.0)}
                className={`col-span-4 rounded-lg px-1 truncate flex items-center justify-center transition-all cursor-pointer ${
                  generatedResult && currentTime >= 15.0
                    ? "bg-[#7F48ED] text-white shadow-md ring-2 ring-[#7F48ED]/40 font-black scale-[1.01]"
                    : "bg-purple-50 hover:bg-purple-100 border border-purple-200 text-purple-700"
                }`}
                title="15–22s: AI Scenes & Motion CTA"
              >
                15-22s AI Scenes &amp; CTA
              </button>
            </div>

            {/* Live Progress Scrubber */}
            {generatedResult && (
              <div className="w-full h-1 bg-zinc-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#7F48ED] via-[#FF6700] to-[#7F48ED] transition-all duration-100"
                  style={{ width: `${Math.min(100, (currentTime / 22.0) * 100)}%` }}
                />
              </div>
            )}
          </div>

          {/* CENTERED VIDEO DISPLAY STAGE */}
          <div className="w-full flex-1 flex items-center justify-center py-2 relative min-h-[380px]">
            {/* Active Live Voiceover Audio Element */}
            {generatedResult?.voiceover?.url && (
              <audio
                ref={audioRef}
                src={generatedResult.voiceover.url}
                preload="auto"
                playsInline
                muted={isMuted}
              />
            )}

            {/* Generation Progress Overlay (Clean White Backlit) */}
            {isGenerating && (
              <div className="absolute inset-0 bg-white/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center space-y-5 rounded-2xl border border-zinc-200 shadow-2xl">
                <div className="w-16 h-16 rounded-full border-4 border-[#7F48ED] border-t-transparent animate-spin" />
                <div className="space-y-1 max-w-sm">
                  <div className="text-xs font-mono font-black text-[#FF6700] tracking-wider">
                    {Math.round(genProgress)}% COMPLETED
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
                    style={{ width: `${Math.round(genProgress)}%` }}
                  />
                </div>
              </div>
            )}

            {/* VIDEO PLAYER CONTAINER */}
            {showPhoneFrame ? (
              /* Phone Mockup View */
              <div className="relative h-[min(650px,calc(100vh-230px))] aspect-[9/16] bg-black rounded-[44px] border-[6px] border-zinc-800 overflow-hidden shadow-2xl flex flex-col justify-between p-2">
                <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-4 bg-zinc-800 rounded-full z-20" />
                {generatedResult ? (
                  <div className="absolute inset-0 w-full h-full overflow-hidden">
                    {/* The Hero Video Track: Always genuine generated AI video */}
                    <video
                      ref={videoRef}
                      src={activeVideoSrc || "/videos/golf/golf-swing-instruction.mp4"}
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

                          {/* Bottom Dynamic Captions (Synced to speech, full complete sentences, no truncation) */}
                          <div className={`text-center ${currentTime >= 16.5 ? "mb-1" : "mb-8"} px-1`}>
                            <div className="inline-block bg-black/75 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/15 max-w-[95%] shadow-2xl animate-in fade-in duration-150">
                              <p className={`text-center leading-snug font-extrabold text-xs sm:text-sm tracking-wide ${
                                activeCap.phase === "hook"
                                  ? "text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                                  : activeCap.phase === "cta"
                                  ? "text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                                  : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                              }`}>
                                {activeCap.phase === "hook" ? `“${activeCap.text}”` : activeCap.text}
                              </p>
                            </div>
                          </div>
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

                    {/* Unobtrusive Audio Mute Toggle */}
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="absolute bottom-2.5 right-2.5 p-2 rounded-full bg-black/70 hover:bg-black text-white transition z-20 cursor-pointer shadow-lg"
                      title={isMuted ? "Unmute Voiceover" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-3.5 h-3.5 text-red-400" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  </div>
                ) : activeVideoSrc ? (
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
                className={`relative flex items-center justify-center transition-all duration-300 overflow-hidden bg-black rounded-2xl border border-zinc-300/80 shadow-2xl ${
                  aspectRatio === "9:16"
                    ? "h-[min(650px,calc(100vh-230px))] aspect-[9/16]"
                    : aspectRatio === "1:1"
                    ? "h-[min(560px,calc(100vh-230px))] aspect-square"
                    : "h-[min(610px,calc(100vh-230px))] aspect-[4/5]"
                }`}
              >
                {/* 3-PART HYBRID AD ENGINE PLAYBACK */}
                {generatedResult ? (
                  <div className="relative w-full h-full overflow-hidden select-none">
                    {/* The Hero Video Track: Always genuine generated AI video */}
                    <video
                      ref={videoRef}
                      src={activeVideoSrc || "/storage/variants/job-ad-930984-9x16.mp4"}
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
                          {/* Top Header: Clean, subtle creator badge during hook only (0-3.5s) */}
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
                          </div>

                          {/* Center High-Impact CTA End Card (only during final 16.5s – 22.0s) */}
                          {currentTime >= 16.5 && (
                            <div className="text-center bg-black/85 backdrop-blur-md rounded-2xl border border-white/20 p-6 mx-auto max-w-sm shadow-2xl animate-in zoom-in-95 duration-200 pointer-events-auto">
                              <span className="bg-[#FF6700] text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full mb-2 inline-block shadow">
                                Limited Time Offer
                              </span>
                              <h3 className="text-xl font-black text-white mb-1 drop-shadow-md">
                                {generatedResult.brandName || brandName}
                              </h3>
                              <div className="text-sm font-bold text-yellow-300 mb-4 drop-shadow">
                                {generatedResult.brandOffer || brandOffer}
                              </div>
                              <div className="px-5 py-2.5 rounded-xl text-xs font-black text-white bg-gradient-to-r from-[#FF6700] to-[#7F48ED] shadow-xl flex items-center justify-center gap-1.5 ring-2 ring-white/20 cursor-pointer">
                                <span>Claim Offer Now</span>
                                <ChevronRight className="w-4 h-4" />
                              </div>
                            </div>
                          )}

                          {/* Bottom Dynamic Captions (Synced to speech, full complete sentences, no truncation) */}
                          <div className={`text-center ${currentTime >= 16.5 ? "mb-2" : "mb-10"} px-2`}>
                            <div className="inline-block bg-black/75 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 max-w-[88%] shadow-2xl animate-in fade-in duration-150">
                              <p className={`text-center leading-snug font-extrabold text-sm sm:text-base tracking-wide ${
                                activeCap.phase === "hook"
                                  ? "text-yellow-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                                  : activeCap.phase === "cta"
                                  ? "text-amber-300 drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                                  : "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]"
                              }`}>
                                {activeCap.phase === "hook" ? `“${activeCap.text}”` : activeCap.text}
                              </p>
                            </div>
                          </div>
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

                    {/* Bottom Right Audio Mute Button */}
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="absolute bottom-3 right-3 p-2.5 rounded-full bg-black/75 text-white hover:bg-black/95 transition z-20 cursor-pointer shadow-lg"
                      title={isMuted ? "Unmute Voiceover" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
                    </button>
                  </div>
                ) : uploadedMediaType === "image" && uploadedMediaSrc ? (
                  <div className="relative w-full h-full flex items-center justify-center bg-zinc-900 p-4">
                    <img
                      src={uploadedMediaSrc}
                      alt={uploadedMediaName || "Product"}
                      className="max-h-full max-w-full object-contain rounded-xl shadow-2xl"
                    />
                    <div className="absolute top-4 left-4 z-20 bg-[#FF6700] text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                      Ready: {uploadedMediaName}
                    </div>
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
                  download={generatedResult ? `relaunch-${generatedResult.jobId}-${aspectRatio}.mp4` : `${(brandName || "brand").toLowerCase().replace(/\s+/g, "-")}-${aspectRatio}.mp4`}
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
                <span>{generatedResult ? "Review Generated Ad" : "Open in QA Review Room"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
