"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smartphone,
  Square,
  Maximize2,
  Minimize2,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  FileText,
  Download,
  ShieldCheck,
  Trash2,
  Sparkles,
  FolderOpen,
} from "lucide-react";

interface VariantItem {
  id: string;
  clientName: string;
  batchName: string;
  angle: string;
  framework: string;
  targetPersona: string;
  hookText: string;
  video9x16: string;
  video1x1: string;
  video4x5: string;
  thumbnail: string;
  status: "needs_review" | "approved" | "rejected";
  disclosureApplied: boolean;
  audioLufs: number;
  scriptBody: string;
  ctaText: string;
  forbiddenClaims: string[];
  createdAt: string;
  clientFootageSource?: string;
  creatorActor?: string;
  verifiedBy?: string;
  verifiedAt?: string;
  auditId?: string;
  complianceChecks?: {
    creatorVerification: boolean;
    scriptClaims: boolean;
    clientFootagePresent: boolean;
    disclosureState: boolean;
  };
  creatorHookClip?: string;
  voiceoverUrl?: string;
  wordTimestamps?: Array<{ word: string; start: number; end: number }>;
  aiSceneUrl?: string;
  delivery?: {
    googleDriveFolderId?: string;
    deliveredAt?: string;
    status: 'pending' | 'delivered' | 'failed';
  };
}

export default function StudioReviewPortal() {
  const [variants, setVariants] = useState<VariantItem[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<VariantItem | null>(null);
  const [aspectRatio, setAspectRatio] = useState<"9:16" | "1:1" | "4:5">("9:16");
  const [videoFit, setVideoFit] = useState<"contain" | "cover">("cover");
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [filterClient, setFilterClient] = useState("all");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [detailsExpanded, setDetailsExpanded] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  // Reviewer / QA Operator State & 4 Compliance Gates
  const [operatorName, setOperatorName] = useState("Robert Clark");
  const [checks, setChecks] = useState({
    creatorVerification: false,
    scriptClaims: false,
    clientFootagePresent: false,
    disclosureState: false,
  });

  const toggleCheck = (key: keyof typeof checks) => {
    if (selectedVariant?.status === "approved") return;
    setChecks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const markAllPass = () => {
    if (selectedVariant?.status === "approved") return;
    setChecks({
      creatorVerification: true,
      scriptClaims: true,
      clientFootagePresent: true,
      disclosureState: true,
    });
  };

  const numPassed = Object.values(checks).filter(Boolean).length;
  const allChecksPassed = numPassed === 4;

  // Sync compliance checks when active variant changes
  useEffect(() => {
    if (selectedVariant) {
      if (selectedVariant.status === "approved") {
        setChecks({
          creatorVerification: true,
          scriptClaims: true,
          clientFootagePresent: true,
          disclosureState: true,
        });
      } else if (selectedVariant.complianceChecks) {
        setChecks({
          creatorVerification: Boolean(selectedVariant.complianceChecks.creatorVerification),
          scriptClaims: Boolean(selectedVariant.complianceChecks.scriptClaims),
          clientFootagePresent: Boolean(selectedVariant.complianceChecks.clientFootagePresent),
          disclosureState: Boolean(selectedVariant.complianceChecks.disclosureState),
        });
      } else {
        setChecks({
          creatorVerification: false,
          scriptClaims: false,
          clientFootagePresent: false,
          disclosureState: false,
        });
      }
    }
  }, [selectedVariant?.id, selectedVariant?.status]);

  // Revision Modal State
  const [recutModalOpen, setRecutModalOpen] = useState(false);
  const [recutNotes, setRecutNotes] = useState("");
  const [showClearModal, setShowClearModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const videoContainerRef = useRef<HTMLDivElement>(null);

  // Fullscreen change listener
  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (videoContainerRef.current?.requestFullscreen) {
        videoContainerRef.current.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Fetch variants from API (the single ground truth for rendered ad jobs)
  const loadVariants = () => {
    fetch("/api/studio/review")
      .then((res) => res.json())
      .then((data) => {
        const apiVariants: VariantItem[] = (data.variants || []).map((item: any) => ({
          ...item,
          clientName: item.clientName || item.brandName || "Brand Ad",
        }));

        if (apiVariants.length > 0) {
          setVariants(apiVariants);
          // Check for URL query variantId parameter
          const targetId = typeof window !== "undefined" ? new URLSearchParams(window.location.search).get("variantId") : null;
          const match = targetId ? apiVariants.find((v: any) => v.id === targetId) : null;
          setSelectedVariant(match || apiVariants[0]);
        } else {
          setVariants([]);
          setSelectedVariant(null);
        }
      })
      .catch((err) => console.error("Failed to load review variants", err));
  };

  useEffect(() => {
    // Purge any stale mock items from old sessions
    try {
      localStorage.removeItem("relaunch_studio_generated_variants");
    } catch {}
    loadVariants();
  }, []);

  const handleClearQueue = async () => {
    try {
      await fetch("/api/studio/review", { method: "DELETE" });
      localStorage.removeItem("relaunch_studio_generated_variants");
      setVariants([]);
      setSelectedVariant(null);
      showToast("✓ Review queue cleared successfully.");
    } catch {
      showToast("Failed to clear queue.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Switch video and maintain play state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    }
    if (audioRef.current && selectedVariant?.voiceoverUrl) {
      audioRef.current.currentTime = 0;
      if (isPlaying) {
        audioRef.current.play().catch(() => {});
      }
    }
  }, [selectedVariant?.id, aspectRatio]);

  const togglePlay = () => {
    if (isPlaying) {
      videoRef.current?.pause();
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      videoRef.current?.play().then(() => setIsPlaying(true)).catch(() => {});
      audioRef.current?.play().catch(() => {});
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (videoRef.current) videoRef.current.muted = nextMuted;
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
      audioRef.current.volume = nextMuted ? 0 : 1;
      if (!nextMuted) audioRef.current.play().catch(() => {});
    }
  };

  const handleDecision = async (decision: "approve" | "reject" | "recut") => {
    if (!selectedVariant) return;

    if (decision === "approve" && !allChecksPassed) {
      showToast("⚠️ All 4 quality compliance gates must pass before approving this ad.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Compliance sign-off audit stamp
      const verifiedMeta = decision === "approve" ? {
        verifiedBy: operatorName || "Robert Clark (QA Operator)",
        verifiedAt: new Date().toISOString(),
        auditId: `AUDIT-${selectedVariant.id.toUpperCase()}`,
        complianceChecks: checks,
        delivery: {
          googleDriveFolderId: "1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx",
          status: "delivered" as const,
          deliveredAt: new Date().toISOString(),
        },
      } : {};

      // If it's a locally generated variant, update localStorage directly
      try {
        const localSaved = JSON.parse(localStorage.getItem("relaunch_studio_generated_variants") || "[]");
        const updatedLocal = localSaved.map((item: any) =>
          item.id === selectedVariant.id
            ? { ...item, status: decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "needs_review", ...verifiedMeta }
            : item
        );
        localStorage.setItem("relaunch_studio_generated_variants", JSON.stringify(updatedLocal));
      } catch (e) {
        console.error("Local storage sync error", e);
      }

      const res = await fetch("/api/studio/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          decision,
          reviewerName: operatorName || "Robert Clark (QA Operator)",
          complianceChecks: checks,
          notes: decision === "recut" ? recutNotes : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        showToast(data.error || "Failed to update review decision");
        setIsSubmitting(false);
        return;
      }

      const updatedStatus = decision === "approve" ? "approved" : decision === "reject" ? "rejected" : "needs_review";

      // Update local state with audit stamp
      setVariants((prev) =>
        prev.map((v) =>
          v.id === selectedVariant.id
            ? { ...v, status: updatedStatus, ...verifiedMeta }
            : v
        )
      );
      setSelectedVariant((prev) =>
        prev ? { ...prev, status: updatedStatus, ...verifiedMeta } : null
      );

      if (decision === "approve") {
        showToast(`✓ Creator sign-off recorded! Ad verified & approved.`);
        // Auto advance to next pending ad
        const currentIndex = filteredVariants.findIndex((v) => v.id === selectedVariant.id);
        const nextPending = filteredVariants.find(
          (v, idx) => idx > currentIndex && v.status === "needs_review"
        );
        if (nextPending) {
          setTimeout(() => setSelectedVariant(nextPending), 600);
        }
      } else if (decision === "reject") {
        showToast(`✕ Ad marked as declined.`);
      } else if (decision === "recut") {
        showToast(`✓ Change request received! Recut queued.`);
        setRecutModalOpen(false);
        setRecutNotes("");
      }
    } catch {
      showToast("Error recording response. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (recutModalOpen) return;
      const target = e.target as HTMLElement;
      if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.tagName === "SELECT") {
        return;
      }

      if (e.code === "Space") {
        e.preventDefault();
        togglePlay();
      } else if (e.code === "KeyM") {
        e.preventDefault();
        toggleMute();
      } else if (e.code === "KeyF") {
        e.preventDefault();
        toggleFullscreen();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [recutModalOpen, isPlaying, isMuted]);

  const filteredVariants = variants.filter((v) => {
    if (filterClient === "all") return true;
    const name = v.clientName || (v as any).brandName || "";
    return name.toLowerCase().includes(filterClient.toLowerCase());
  });

  const pendingCount = variants.filter((v) => v.status === "needs_review").length;
  const currentIndex = selectedVariant
    ? filteredVariants.findIndex((v) => v.id === selectedVariant.id)
    : -1;

  const goToPrev = () => {
    if (currentIndex > 0) {
      setSelectedVariant(filteredVariants[currentIndex - 1]);
    }
  };

  const goToNext = () => {
    if (currentIndex < filteredVariants.length - 1) {
      setSelectedVariant(filteredVariants[currentIndex + 1]);
    }
  };

  // Quick suggestion chips for revisions
  const revisionChips = [
    "Shorten opening hook",
    "Change call to action",
    "Tone down background music",
    "Speed up video pacing",
    "Use different product scene",
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#090D16] flex flex-col font-sans selection:bg-[#7F48ED]/20 selection:text-[#7F48ED]">
      {/* 1. Top Header Bar — Clean White with Orange & Purple Accents */}
      <header className="h-16 border-b border-zinc-200 bg-white px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 shadow-xs">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/studio"
            className="flex items-center gap-1.5 text-xs font-semibold text-zinc-600 hover:text-[#7F48ED] transition-colors shrink-0"
            title="Back to Studio"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Back to Studio</span>
          </Link>

          <div className="h-4 w-px bg-zinc-200 shrink-0" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-[#090D16] uppercase">
              Relaunch Studio <span className="text-[#FF6700]">Review Portal</span>
            </span>
          </div>
        </div>

        {/* Actions & Filters */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <Link
            href="/studio/generate"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#FF6700] hover:bg-[#E55C00] active:bg-[#CC5200] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create Ad</span>
          </Link>

          {variants.length > 1 && (
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="bg-zinc-50 border border-zinc-200 rounded-xl text-xs py-1.5 px-2.5 text-zinc-800 focus:outline-none focus:border-[#7F48ED] max-w-[120px] sm:max-w-[200px] truncate cursor-pointer font-medium"
            >
              <option value="all">All Brands ({variants.length})</option>
              <option value="Chicago Dog">Chicago Dog</option>
              <option value="Dance Fusion">Dance Fusion</option>
            </select>
          )}

          <div className="flex items-center gap-1.5 bg-zinc-100 border border-zinc-200 px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                pendingCount > 0 ? "bg-[#FF6700] animate-pulse" : "bg-emerald-500"
              }`}
            />
            <span className="text-zinc-600">
              <strong className="text-zinc-900">{pendingCount}</strong>
              <span className="hidden sm:inline"> {pendingCount === 1 ? "ad" : "ads"}</span> left
            </span>
          </div>
        </div>
      </header>

      {/* 2. Main Studio Workstation — Spacious Light Workspace */}
      <div className="flex-1 w-full p-3 sm:p-4 lg:p-5 flex flex-col lg:flex-row gap-4 lg:gap-5 lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
        {/* Left Panel: Ad Queue (Clean White Cards) */}
        <aside className="hidden lg:flex lg:w-[320px] xl:w-[360px] 2xl:w-[400px] shrink-0 bg-white rounded-2xl border border-zinc-200 p-4 flex-col h-full overflow-hidden shadow-sm">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-200 shrink-0">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-900">Ad Queue</h2>
              <p className="text-[11px] text-zinc-500 mt-0.5">
                {variants.length > 0 ? `${variants.length} variant${variants.length === 1 ? "" : "s"} ready` : "Queue is empty"}
              </p>
            </div>
            {variants.length > 0 && (
              <button
                type="button"
                onClick={() => setShowClearModal(true)}
                className="flex items-center gap-1.5 text-[11px] font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 px-2.5 py-1 rounded-lg border border-red-200 transition cursor-pointer"
                title="Clear all ads in queue"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear</span>
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1 scrollbar-thin">
            {filteredVariants.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-zinc-500 h-64 border border-dashed border-zinc-200 rounded-xl my-4 bg-zinc-50/60">
                <Sparkles className="w-8 h-8 text-[#FF6700] mb-2 opacity-80" />
                <p className="text-xs font-bold text-zinc-800">Queue is Empty</p>
                <p className="text-[11px] text-zinc-500 mt-1 max-w-[200px]">
                  All sample videos cleared. Generate a new video ad to test the real engine!
                </p>
                <Link
                  href="/studio/generate"
                  className="mt-3 text-xs bg-[#FF6700] hover:bg-[#E55C00] text-white font-bold px-3.5 py-1.5 rounded-xl transition shadow-xs"
                >
                  + Generate Ad
                </Link>
              </div>
            ) : null}
            {filteredVariants.map((item, index) => {
              const isSelected = selectedVariant?.id === item.id;
              const isApproved = item.status === "approved";
              const isRejected = item.status === "rejected";

              return (
                <button
                  key={item.id}
                  onClick={() => setSelectedVariant(item)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all flex flex-col gap-2 cursor-pointer ${
                    isSelected
                      ? "bg-purple-50/70 border-2 border-[#7F48ED] shadow-sm"
                      : "bg-white border-zinc-200 hover:bg-zinc-50 hover:border-zinc-300"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 truncate">
                      <span className="w-5 h-5 rounded-md bg-[#7F48ED]/10 text-[#7F48ED] font-mono text-[10px] font-bold flex items-center justify-center shrink-0">
                        #{index + 1}
                      </span>
                      <span className="text-xs font-bold text-zinc-900 truncate">
                        {item.clientName}
                      </span>
                    </div>
                    {isApproved ? (
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        Approved
                      </span>
                    ) : isRejected ? (
                      <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Declined
                      </span>
                    ) : (
                      <span className="bg-orange-50 text-[#FF6700] border border-orange-200 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700]" />
                        Review
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-zinc-900 line-clamp-2 leading-snug">
                    &ldquo;{item.hookText}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-zinc-500 pt-1.5 border-t border-zinc-100">
                    <span className="truncate max-w-[200px] font-medium">{item.angle}</span>
                    <span className="text-[#7F48ED] text-[10px] font-bold shrink-0">Multi-Format</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Panel: Stage Video Player (Clean Light Surface, Crisp Bezel) */}
        <main className="flex-1 flex flex-col items-center justify-between bg-white rounded-2xl border border-zinc-200 p-3 sm:p-4 lg:p-5 lg:h-full lg:overflow-hidden min-w-0 shadow-sm">
          {/* Mobile Dropdown Toolbar (< 1024px) */}
          <div className="lg:hidden w-full flex flex-col gap-2 mb-2 shrink-0">
            {/* Row 1: Ad Navigation Dropdown + Prev/Next */}
            <div className="flex items-center gap-1.5 w-full">
              <button
                onClick={goToPrev}
                disabled={currentIndex <= 0}
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 disabled:opacity-30 transition-all cursor-pointer shrink-0"
                title="Previous ad"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <div className="relative flex-1 min-w-0">
                <select
                  value={selectedVariant?.id || ""}
                  onChange={(e) => {
                    const match = filteredVariants.find((v) => v.id === e.target.value);
                    if (match) setSelectedVariant(match);
                  }}
                  className="w-full bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl px-3 pr-8 py-2 text-xs font-bold truncate appearance-none focus:outline-none focus:border-[#7F48ED] cursor-pointer"
                >
                  {filteredVariants.map((item, index) => (
                    <option key={item.id} value={item.id}>
                      Ad #{index + 1}: {item.clientName} {item.status === "approved" ? "✓" : "• Review"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={goToNext}
                disabled={currentIndex >= filteredVariants.length - 1}
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 disabled:opacity-30 transition-all cursor-pointer shrink-0"
                title="Next ad"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Row 2: Format & Fit Dropdowns + Fullscreen */}
            <div className="flex items-center gap-2 w-full">
              {/* Ratio Dropdown */}
              <div className="relative flex-1 min-w-0">
                <select
                  value={aspectRatio}
                  onChange={(e) => setAspectRatio(e.target.value as any)}
                  className="w-full bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl px-3 pr-7 py-2 text-xs font-bold appearance-none focus:outline-none focus:border-[#7F48ED] cursor-pointer"
                >
                  <option value="9:16">9:16 Reel (Vertical)</option>
                  <option value="1:1">1:1 Square (Feed)</option>
                  <option value="4:5">4:5 Portrait (Meta)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Fit Dropdown */}
              <div className="relative flex-1 min-w-0">
                <select
                  value={videoFit}
                  onChange={(e) => setVideoFit(e.target.value as any)}
                  className="w-full bg-zinc-50 text-zinc-900 border border-zinc-200 rounded-xl px-3 pr-7 py-2 text-xs font-bold appearance-none focus:outline-none focus:border-[#7F48ED] cursor-pointer"
                >
                  <option value="cover">Fill (Full-Bleed)</option>
                  <option value="contain">Fit (No Crop)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-900 border border-zinc-200 transition-colors cursor-pointer shrink-0"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#FF6700]" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Desktop Toolbar (≥ 1024px) — Studio Stepper + Ratio Tabs + Fit Toggle */}
          <div className="hidden lg:flex w-full items-center justify-between gap-2 mb-2 shrink-0 flex-wrap">
            {/* Stepper Navigation */}
            <div className="flex items-center gap-1 shrink-0 whitespace-nowrap bg-zinc-100 p-1 rounded-xl border border-zinc-200">
              <button
                onClick={goToPrev}
                disabled={currentIndex <= 0}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white text-zinc-700 hover:text-zinc-950 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer text-xs font-bold"
                title="Previous ad"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="text-[11px] font-mono font-bold text-zinc-600 px-2 whitespace-nowrap">
                Ad <span className="text-[#090D16]">{currentIndex + 1}</span> of{" "}
                <span className="text-[#090D16]">{filteredVariants.length}</span>
              </span>

              <button
                onClick={goToNext}
                disabled={currentIndex >= filteredVariants.length - 1}
                className="flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-white text-zinc-700 hover:text-zinc-950 disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer text-xs font-bold"
                title="Next ad"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: Format Ratio Tabs + Fit Toggle + Fullscreen */}
            <div className="flex items-center gap-2 shrink-0 flex-wrap">
              {/* Ratio Tabs */}
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 shrink-0">
                <button
                  onClick={() => setAspectRatio("9:16")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    aspectRatio === "9:16"
                      ? "bg-[#7F48ED] text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                  title="9:16 Vertical Reel (TikTok, Reels, Shorts)"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16</span>
                </button>

                <button
                  onClick={() => setAspectRatio("1:1")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    aspectRatio === "1:1"
                      ? "bg-[#7F48ED] text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                  title="1:1 Square (Feed)"
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>1:1</span>
                </button>

                <button
                  onClick={() => setAspectRatio("4:5")}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    aspectRatio === "4:5"
                      ? "bg-[#7F48ED] text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                  title="4:5 Portrait (Meta Feed)"
                >
                  <span className="text-xs font-mono font-bold">4:5</span>
                </button>
              </div>

              {/* View Fit Toggle (Fill vs Fit) */}
              <div className="flex items-center gap-1 bg-zinc-100 p-1 rounded-xl border border-zinc-200 shrink-0">
                <button
                  type="button"
                  onClick={() => setVideoFit("cover")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    videoFit === "cover"
                      ? "bg-[#7F48ED] text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                  title="Fill container (full-bleed crop)"
                >
                  Fill
                </button>
                <button
                  type="button"
                  onClick={() => setVideoFit("contain")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    videoFit === "contain"
                      ? "bg-[#7F48ED] text-white shadow-xs"
                      : "text-zinc-600 hover:text-zinc-950"
                  }`}
                  title="Fit entire video without cutting off"
                >
                  Fit
                </button>
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 border border-zinc-200 transition-colors cursor-pointer shrink-0"
                title="Fullscreen View"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#FF6700]" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Active Video Player Viewport */}
          <div className="relative w-full flex-1 min-h-[360px] sm:min-h-[440px] lg:min-h-0 flex items-center justify-center py-1">
            {selectedVariant ? (
              <div
                ref={videoContainerRef}
                onClick={togglePlay}
                className={`relative bg-[#090D16] rounded-2xl overflow-hidden border border-zinc-300 shadow-xl transition-all duration-300 flex items-center justify-center cursor-pointer select-none group ${
                  aspectRatio === "9:16"
                    ? "h-full max-h-[58vh] sm:max-h-[66vh] lg:max-h-[74vh] xl:max-h-[78vh] 2xl:max-h-[82vh] aspect-[9/16] w-auto"
                    : aspectRatio === "1:1"
                    ? "h-full max-h-[52vh] sm:max-h-[60vh] lg:max-h-[68vh] xl:max-h-[72vh] 2xl:max-h-[76vh] aspect-square w-auto"
                    : "h-full max-h-[55vh] sm:max-h-[63vh] lg:max-h-[70vh] xl:max-h-[75vh] 2xl:max-h-[79vh] aspect-[4/5] w-auto"
                }`}
              >
                {/* Safe Frame Guides in Square / Portrait when in Fit Mode */}
                {aspectRatio !== "9:16" && videoFit === "contain" && (
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                    <div className="h-full aspect-[9/16] border-x border-dashed border-white/20 bg-white/[0.02]" />
                  </div>
                )}

                <video
                  ref={videoRef}
                  src={
                    aspectRatio === "9:16"
                      ? selectedVariant.video9x16
                      : aspectRatio === "1:1"
                      ? selectedVariant.video1x1
                      : selectedVariant.video4x5
                  }
                  loop
                  autoPlay
                  muted={isMuted}
                  playsInline
                  className={`w-full h-full relative z-10 transition-all duration-200 ${
                    videoFit === "cover" ? "object-cover" : "object-contain"
                  }`}
                />

                {selectedVariant.voiceoverUrl && (
                  <audio
                    ref={audioRef}
                    src={selectedVariant.voiceoverUrl}
                    preload="auto"
                    playsInline
                    muted={isMuted}
                  />
                )}

                {/* Big Center Play Indicator (when paused) */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all z-20">
                    <div className="w-16 h-16 rounded-full bg-[#7F48ED] text-white flex items-center justify-center shadow-xl shadow-[#7F48ED]/50 transform scale-100 hover:scale-105 transition-transform">
                      <Play className="w-7 h-7 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Floating Aspect Indicator */}
                <div className="absolute top-3 left-3 z-20 bg-white/90 text-zinc-900 backdrop-blur-md border border-zinc-200 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                  {aspectRatio}
                </div>

                {/* Top Right Quick Controls */}
                <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleMute();
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-900 backdrop-blur-md border border-zinc-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    title={isMuted ? "Unmute Audio" : "Mute Audio"}
                  >
                    {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#FF6700]" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-900 backdrop-blur-md border border-zinc-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="w-8 h-8 rounded-full bg-white/90 hover:bg-white text-zinc-900 hover:text-[#FF6700] backdrop-blur-md border border-zinc-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                    title="Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[460px] w-full max-w-md flex flex-col items-center justify-center text-center p-8 bg-zinc-50 border border-dashed border-zinc-200 rounded-2xl my-auto">
                <div className="w-16 h-16 rounded-2xl bg-[#FF6700]/10 border border-[#FF6700]/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-[#FF6700]" />
                </div>
                <h3 className="text-base font-bold text-zinc-900 mb-1.5">Review Queue is Clear</h3>
                <p className="text-xs text-zinc-500 max-w-xs leading-relaxed mb-5">
                  All example videos have been cleared. Head over to the Generator to test building a real hybrid ad from scratch!
                </p>
                <div className="flex items-center justify-center">
                  <Link
                    href="/studio/generate"
                    className="flex items-center gap-2 bg-[#FF6700] hover:bg-[#E55C00] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition shadow-xs"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Real AI Ad</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Bottom Bar: 4 Interactive Quality Compliance Gates */}
          {selectedVariant && (
            <div className="w-full flex flex-col items-center justify-center pt-2.5 sm:pt-3 border-t border-zinc-200 shrink-0 gap-2">
              <div className="flex items-center justify-between w-full max-w-2xl px-2 text-[11px] font-mono">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className={`w-4 h-4 ${allChecksPassed ? "text-emerald-600" : "text-[#FF6700]"}`} />
                  <span className="text-zinc-700 font-bold uppercase tracking-wider">Quality Compliance Gates:</span>
                  <span className={`font-bold ${allChecksPassed ? "text-emerald-600" : "text-[#FF6700]"}`}>
                    {numPassed} / 4 Passed
                  </span>
                </div>
                <button
                  type="button"
                  onClick={markAllPass}
                  disabled={selectedVariant?.status === "approved"}
                  className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg border border-emerald-200 transition-all cursor-pointer disabled:opacity-50"
                >
                  ✓ Mark All Pass
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full max-w-2xl px-2 text-[11px]">
                {/* Check 1: Creator UGC */}
                <button
                  type="button"
                  disabled={selectedVariant?.status === "approved"}
                  onClick={() => toggleCheck("creatorVerification")}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                    checks.creatorVerification
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                      : "bg-orange-50/60 border-orange-200 text-orange-800 hover:bg-orange-100/60"
                  }`}
                  title="Creator Verification: Authentic UGC hook verified (0–3s)"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${checks.creatorVerification ? "bg-emerald-500" : "bg-[#FF6700]"}`} />
                    <span className="font-semibold truncate">1. Creator UGC</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${checks.creatorVerification ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}>
                    {checks.creatorVerification ? "PASS" : "CHECK"}
                  </span>
                </button>

                {/* Check 2: Script Claims */}
                <button
                  type="button"
                  disabled={selectedVariant?.status === "approved"}
                  onClick={() => toggleCheck("scriptClaims")}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                    checks.scriptClaims
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                      : "bg-orange-50/60 border-orange-200 text-orange-800 hover:bg-orange-100/60"
                  }`}
                  title="Script Claims: No deceptive or misleading claims"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${checks.scriptClaims ? "bg-emerald-500" : "bg-[#FF6700]"}`} />
                    <span className="font-semibold truncate">2. Ad Claims</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${checks.scriptClaims ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}>
                    {checks.scriptClaims ? "PASS" : "CHECK"}
                  </span>
                </button>

                {/* Check 3: Client Video */}
                <button
                  type="button"
                  disabled={selectedVariant?.status === "approved"}
                  onClick={() => toggleCheck("clientFootagePresent")}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                    checks.clientFootagePresent
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                      : "bg-orange-50/60 border-orange-200 text-orange-800 hover:bg-orange-100/60"
                  }`}
                  title="Client Footage: Authentic product or location video ingested (3–15s)"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${checks.clientFootagePresent ? "bg-emerald-500" : "bg-[#FF6700]"}`} />
                    <span className="font-semibold truncate">3. Client Video</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${checks.clientFootagePresent ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}>
                    {checks.clientFootagePresent ? "PASS" : "CHECK"}
                  </span>
                </button>

                {/* Check 4: AI Watermark */}
                <button
                  type="button"
                  disabled={selectedVariant?.status === "approved"}
                  onClick={() => toggleCheck("disclosureState")}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-all cursor-pointer ${
                    checks.disclosureState
                      ? "bg-emerald-50 border-emerald-300 text-emerald-800 shadow-xs"
                      : "bg-orange-50/60 border-orange-200 text-orange-800 hover:bg-orange-100/60"
                  }`}
                  title="Disclosure State: AI-Generated Media watermark confirmed visible"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <span className={`w-2 h-2 rounded-full shrink-0 ${checks.disclosureState ? "bg-emerald-500" : "bg-[#FF6700]"}`} />
                    <span className="font-semibold truncate">4. AI Watermark</span>
                  </div>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${checks.disclosureState ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"}`}>
                    {checks.disclosureState ? "PASS" : "CHECK"}
                  </span>
                </button>
              </div>
            </div>
          )}
        </main>

        {/* Right Panel: Decision Hub & Creative Brief (Clean White Cards) */}
        <aside className="w-full lg:w-[340px] xl:w-[400px] 2xl:w-[440px] shrink-0 flex flex-col gap-4 lg:h-full lg:overflow-y-auto scrollbar-thin">
          {selectedVariant ? (
            <>
              {/* Decision Action Card */}
              <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm space-y-3.5 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-zinc-900">
                    Review Decision &amp; QA Gate
                  </span>
                  {selectedVariant.status === "approved" ? (
                    <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Approved
                    </span>
                  ) : selectedVariant.status === "rejected" ? (
                    <span className="bg-zinc-100 text-zinc-600 border border-zinc-200 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      Declined
                    </span>
                  ) : (
                    <span className="bg-orange-50 text-[#FF6700] border border-orange-200 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700]" />
                      Needs Decision
                    </span>
                  )}
                </div>

                {/* Operator/Reviewer Name Input */}
                <div className="bg-zinc-50 p-2.5 rounded-xl border border-zinc-200 space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block">
                    Reviewer / QA Auditor
                  </label>
                  <input
                    type="text"
                    value={operatorName}
                    disabled={selectedVariant.status === "approved"}
                    onChange={(e) => setOperatorName(e.target.value)}
                    placeholder="Enter reviewer name"
                    className="w-full bg-white border border-zinc-200 rounded-lg px-2.5 py-1.5 text-xs text-zinc-900 focus:outline-none focus:border-[#7F48ED] font-medium"
                  />
                </div>

                {/* Primary Action Button / Approval Seal */}
                {selectedVariant.status === "approved" ? (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-emerald-800">
                        Human Compliance Sign-Off Recorded
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-zinc-700 space-y-0.5 border-t border-emerald-200/60 pt-2">
                      <div><strong className="text-zinc-900">Auditor:</strong> {selectedVariant.verifiedBy || operatorName}</div>
                      <div><strong className="text-zinc-900">Audit ID:</strong> {selectedVariant.auditId || `AUDIT-${selectedVariant.id.toUpperCase()}`}</div>
                      <div><strong className="text-zinc-900">Approved At:</strong> {selectedVariant.verifiedAt ? new Date(selectedVariant.verifiedAt).toLocaleString() : new Date().toLocaleString()}</div>
                      <div><strong className="text-zinc-900">Status:</strong> 4/4 Checks Verified · Pilot Approved</div>
                    </div>

                    {/* Google Drive Delivery layer badge */}
                    <div className="mt-2 p-3 rounded-xl bg-white border border-emerald-200 flex items-center justify-between gap-2.5 text-[11px] text-emerald-800 shadow-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="text-lg shrink-0">📁</span>
                        <div className="truncate">
                          <span className="font-bold text-zinc-900 block">Auto-Delivered to Google Drive:</span>
                          <span className="text-zinc-500 font-mono text-[10px] truncate block">
                            Folder: {selectedVariant.delivery?.googleDriveFolderId || "1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx"}
                          </span>
                        </div>
                      </div>
                      <a
                        href={`https://drive.google.com/drive/folders/${selectedVariant.delivery?.googleDriveFolderId || "1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx"}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 font-bold text-[10px] transition flex items-center gap-1 cursor-pointer"
                        title="Open folder in Google Drive"
                      >
                        <span>Open Drive</span>
                        <span>↗</span>
                      </a>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    {!allChecksPassed && (
                      <div className="bg-orange-50 border border-orange-200 text-orange-800 text-[11px] p-2 rounded-xl flex items-center gap-1.5 font-medium">
                        <span>⚠️</span>
                        <span>Pass all 4 quality gates ({numPassed}/4 passed) to enable approval.</span>
                      </div>
                    )}
                    <button
                      disabled={isSubmitting || !allChecksPassed}
                      onClick={() => handleDecision("approve")}
                      className={`w-full py-3 px-4 rounded-xl text-sm font-bold text-white shadow-sm flex items-center justify-center gap-2 transition-all ${
                        allChecksPassed
                          ? "bg-[#7F48ED] hover:bg-[#6C34DE] active:bg-[#5B25C7] cursor-pointer active:scale-[0.99]"
                          : "bg-zinc-200 text-zinc-400 border border-zinc-200 cursor-not-allowed"
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                      <span>{allChecksPassed ? "Approve Ad & Deliver to Drive" : "Approval Locked (Checks Required)"}</span>
                    </button>
                  </div>
                )}

                {/* Secondary Actions: Solid Orange Button & Clean Decline */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    disabled={isSubmitting}
                    onClick={() => setRecutModalOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] active:bg-[#CC5200] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => handleDecision("reject")}
                    className="py-2.5 px-3 rounded-xl bg-zinc-100 hover:bg-zinc-200 border border-zinc-200 text-zinc-700 hover:text-zinc-900 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline Ad</span>
                  </button>
                </div>

                {/* Enforcement: Client Release Gate (Locked until approved) */}
                <div className="pt-2 border-t border-zinc-200">
                  <div className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Client Delivery Status</span>
                    {selectedVariant.status === "approved" ? (
                      <span className="text-emerald-600 font-bold font-mono">UNLOCKED</span>
                    ) : (
                      <span className="text-[#FF6700] font-bold font-mono">LOCKED</span>
                    )}
                  </div>
                  {selectedVariant.status === "approved" ? (
                    <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                      <span className="text-xs text-emerald-900 font-medium">Export Ready for Client Delivery</span>
                      <a
                        href={aspectRatio === "9:16" ? selectedVariant.video9x16 : aspectRatio === "1:1" ? selectedVariant.video1x1 : selectedVariant.video4x5}
                        download={`${selectedVariant.id}-${aspectRatio}.mp4`}
                        className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download MP4
                      </a>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-orange-50/50 border border-dashed border-orange-200 text-[11px] text-zinc-600 flex items-center gap-2">
                      <span className="text-[#FF6700] font-bold text-base shrink-0">🛑</span>
                      <span>Delivery locked. Pass all 4 quality gates and approve to enable client delivery.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Creative Brief & Script Details Card */}
              <div className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm shrink-0">
                {/* Header */}
                <div
                  onClick={() => setDetailsExpanded(!detailsExpanded)}
                  className="p-4 flex items-center justify-between cursor-pointer sm:cursor-default border-b border-zinc-100"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#7F48ED]" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-zinc-900">
                      Script &amp; Creative Brief
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="sm:hidden text-zinc-500 hover:text-zinc-900 p-1"
                    aria-label="Toggle details"
                  >
                    {detailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Content Details */}
                <div className={`p-4 space-y-3.5 text-xs ${detailsExpanded ? "block" : "hidden sm:block"}`}>
                  {/* Campaign Angle & Audience */}
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block mb-0.5">
                      Campaign Angle
                    </span>
                    <p className="font-semibold text-zinc-900 text-xs">{selectedVariant.angle}</p>
                    <p className="text-[11px] text-zinc-500 mt-1">
                      Audience: <span className="text-zinc-700 font-medium">{selectedVariant.targetPersona}</span>
                    </p>
                  </div>

                  {/* Opening Hook Highlight */}
                  <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#7F48ED]">
                        Opening Hook (First 3s)
                      </span>
                      <span className="text-[10px] text-[#7F48ED] font-bold">High Retention</span>
                    </div>
                    <p className="text-zinc-900 font-medium italic">
                      &ldquo;{selectedVariant.hookText}&rdquo;
                    </p>
                  </div>

                  {/* Voiceover Script */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block mb-1">
                      Voiceover Script
                    </span>
                    <p className="text-zinc-800 leading-relaxed bg-zinc-50 p-3 rounded-xl border border-zinc-200 font-normal">
                      {selectedVariant.scriptBody}
                    </p>
                  </div>

                  {/* Ending Offer / Call to Action */}
                  <div className="bg-orange-50 border border-orange-200 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF6700] block mb-0.5">
                        Call to Action
                      </span>
                      <p className="text-zinc-900 font-bold">{selectedVariant.ctaText}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF6700] bg-white border border-orange-200 px-2 py-1 rounded-md">
                      End Card
                    </span>
                  </div>

                  {/* Hybrid Source Breakdown */}
                  <div className="bg-zinc-50 p-3 rounded-xl border border-zinc-200 space-y-1.5 font-mono text-[11px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 block font-sans">
                      Hybrid Composition Sources
                    </span>
                    <div className="flex items-center justify-between text-zinc-700">
                      <span>Creator Hook:</span>
                      <span className="text-[#7F48ED] font-semibold">{selectedVariant.creatorActor || "Emma Davis (@trendspotlight)"}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-700">
                      <span>Client Footage:</span>
                      <span className="text-[#FF6700] font-semibold truncate max-w-[170px]">{selectedVariant.clientFootageSource || "Raw Product Video Ingested"}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-700">
                      <span>AI Model:</span>
                      <span className="text-teal-700 font-semibold">Grok Imagine 1.5</span>
                    </div>
                  </div>

                  {/* Google Drive Delivery & Client Archive Card */}
                  {selectedVariant.status === "approved" && (
                    <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl space-y-2.5 animate-in fade-in duration-200">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Client Archive &amp; Delivery
                        </span>
                        <span className="text-[10px] bg-emerald-200/80 text-emerald-900 font-bold px-2 py-0.5 rounded-full">
                          Ready for Client
                        </span>
                      </div>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                        Approved 22s Ad Master &amp; all 3 ratios (9:16, 1:1, 4:5) are indexed for Google Drive folder <span className="font-mono font-bold text-emerald-800">1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx</span>.
                      </p>
                      <div className="pt-0.5 flex flex-col sm:flex-row gap-2">
                        <a
                          href="https://drive.google.com/drive/folders/1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 text-center bg-[#7F48ED] hover:bg-[#6C3BD6] text-white py-2 px-3 rounded-lg text-xs font-bold transition shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FolderOpen className="w-3.5 h-3.5" />
                          <span>Open Google Drive ↗</span>
                        </a>
                        <a
                          href={selectedVariant.video9x16}
                          download={`${(selectedVariant?.clientName || (selectedVariant as any)?.brandName || "ad").toLowerCase().replace(/\s+/g, "-")}-9x16.mp4`}
                          className="bg-white hover:bg-zinc-50 border border-emerald-300 text-emerald-900 py-2 px-3 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1 shadow-xs cursor-pointer"
                          title="Download 9:16 vertical master MP4"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>MP4</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-zinc-200 p-6 shadow-sm text-center text-zinc-500 my-auto">
              <div className="w-12 h-12 rounded-xl bg-zinc-100 border border-zinc-200 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-zinc-400" />
              </div>
              <p className="text-sm font-bold text-zinc-900 mb-1">No Ad Variant Selected</p>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto mb-4">
                Generate an ad variant in the Studio Generator to review compliance gates, audit logs, and trigger client delivery.
              </p>
              <Link
                href="/studio/generate"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF6700] hover:text-[#E55C00] hover:underline"
              >
                <span>Open Generator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </aside>
      </div>

      {/* 3. Change Request Notes Modal (Clean Light Card) */}
      {recutModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#FF6700]" />
                <h3 className="font-bold text-sm sm:text-base text-zinc-900">
                  Request Changes on this Ad
                </h3>
              </div>
              <button
                onClick={() => setRecutModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-700 p-1 rounded-lg hover:bg-zinc-100 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-zinc-600">
              Select a quick adjustment or type your feedback below. Our team will revise and update the ad within 24 hours.
            </p>

            {/* Quick Suggestion Chips */}
            <div className="flex flex-wrap gap-1.5">
              {revisionChips.map((chip, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setRecutNotes((prev) =>
                      prev ? `${prev}. ${chip}` : `Please ${chip.toLowerCase()}.`
                    );
                  }}
                  className="text-[11px] bg-zinc-100 hover:bg-purple-50 hover:border-purple-200 border border-zinc-200 px-2.5 py-1 rounded-lg text-zinc-700 hover:text-[#7F48ED] transition-all cursor-pointer font-medium"
                >
                  + {chip}
                </button>
              ))}
            </div>

            <textarea
              rows={4}
              value={recutNotes}
              onChange={(e) => setRecutNotes(e.target.value)}
              placeholder="e.g. Can we make the first text larger, or update the discount from 15% to 20%?"
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl p-3 text-xs text-zinc-900 focus:outline-none focus:border-[#7F48ED] placeholder-zinc-400"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRecutModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!recutNotes.trim() || isSubmitting}
                onClick={() => handleDecision("recut")}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#7F48ED] hover:bg-[#6C34DE] text-white transition-all disabled:opacity-40 cursor-pointer shadow-xs"
              >
                Submit Change Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. Clear Queue Confirmation Modal */}
      {showClearModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 shadow-2xl flex flex-col gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-red-50 border border-red-200 flex items-center justify-center text-red-600 shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-zinc-900">Clear Review Queue?</h3>
                <p className="text-xs text-zinc-600 mt-1 leading-relaxed">
                  Are you sure you want to clear all ads from the review queue? This will remove all variants currently loaded.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-zinc-200 mt-1">
              <button
                type="button"
                onClick={() => setShowClearModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  setShowClearModal(false);
                  await handleClearQueue();
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-500 text-white shadow-xs transition cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Yes, Clear Queue</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-zinc-900 text-white border border-[#7F48ED] font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#7F48ED] flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
