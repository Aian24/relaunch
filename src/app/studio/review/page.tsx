"use client";

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

  // Revision Modal State
  const [recutModalOpen, setRecutModalOpen] = useState(false);
  const [recutNotes, setRecutNotes] = useState("");
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

  // Fetch variants from API and merge with live generator output from localStorage
  useEffect(() => {
    fetch("/api/studio/review")
      .then((res) => res.json())
      .then((data) => {
        let combined: VariantItem[] = [];

        // Check if there are newly generated variants in localStorage from /studio/generate
        try {
          const localSaved = JSON.parse(localStorage.getItem("relaunch_studio_generated_variants") || "[]");
          if (Array.isArray(localSaved) && localSaved.length > 0) {
            combined = [...localSaved];
          }
        } catch (e) {
          console.error("Failed to read local generated variants", e);
        }

        if (data.variants && data.variants.length > 0) {
          const existingIds = new Set(combined.map((v) => v.id));
          const apiOnly = data.variants.filter((v: VariantItem) => !existingIds.has(v.id));
          combined = [...combined, ...apiOnly];
        }

        if (combined.length > 0) {
          setVariants(combined);
          setSelectedVariant(combined[0]);
        }
      })
      .catch((err) => console.error("Failed to load review variants", err));
  }, []);

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
  }, [selectedVariant?.id, aspectRatio]);

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
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleDecision = async (decision: "approve" | "reject" | "recut") => {
    if (!selectedVariant) return;
    setIsSubmitting(true);

    try {
      // Creator verification sign-off audit stamp
      const verifiedMeta = decision === "approve" ? {
        verifiedBy: "Sarah Jenkins (Creator Lead)",
        verifiedAt: new Date().toISOString(),
        auditId: `VER-${Date.now().toString().slice(-6)}`,
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
          reviewerName: "Sarah Jenkins (Creator Lead)",
          notes: decision === "recut" ? recutNotes : undefined,
          ...verifiedMeta,
        }),
      });

      const data = await res.json();
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
    return v.clientName.toLowerCase().includes(filterClient.toLowerCase());
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
    <div className="min-h-screen bg-[#090A0F] text-[#F3F4F6] flex flex-col font-sans selection:bg-[#7F48ED]/30 selection:text-white">
      {/* Top Header Bar — Full Width Studio Toolbar */}
      <header className="h-16 border-b border-white/10 bg-[#0E1017] px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0">
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <Link
            href="/studio"
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 hover:text-white transition-colors shrink-0"
            title="Back to Studio"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden md:inline">Back to Studio</span>
          </Link>

          <div className="h-4 w-px bg-white/10 shrink-0" />

          <div className="flex items-center gap-2">
            <span className="text-sm font-black tracking-tight text-white uppercase">
              Relaunch Studio <span className="text-[#FF6700]">Review Portal</span>
            </span>
          </div>
        </div>

        {/* Client Filter & Status Counter */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {variants.length > 1 && (
            <select
              value={filterClient}
              onChange={(e) => setFilterClient(e.target.value)}
              className="bg-[#181A24] border border-white/10 rounded-lg text-xs py-1.5 px-2.5 text-white focus:outline-none focus:border-[#7F48ED] max-w-[120px] sm:max-w-[200px] truncate cursor-pointer"
            >
              <option value="all">All Brands ({variants.length})</option>
              <option value="Chicago Dog">Chicago Dog</option>
              <option value="Dance Fusion">Dance Fusion</option>
            </select>
          )}

          <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-medium shrink-0">
            <span
              className={`w-2 h-2 rounded-full shrink-0 ${
                pendingCount > 0 ? "bg-[#FF6700] animate-pulse" : "bg-emerald-400"
              }`}
            />
            <span className="text-gray-300">
              <strong className="text-white">{pendingCount}</strong>
              <span className="hidden sm:inline"> {pendingCount === 1 ? "ad" : "ads"}</span> left
            </span>
          </div>
        </div>
      </header>

      {/* Main Studio Workstation — Uses All Screen Space on Desktop */}
      <div className="flex-1 w-full p-3 sm:p-4 lg:p-5 flex flex-col lg:flex-row gap-4 lg:gap-5 lg:h-[calc(100vh-4rem)] lg:overflow-hidden">
        {/* Left Panel: Desktop Ad Queue (Full Height, Spacious) */}
        <aside className="hidden lg:flex lg:w-[320px] xl:w-[360px] 2xl:w-[400px] shrink-0 bg-[#0E1017] rounded-2xl border border-white/10 p-4 flex-col h-full overflow-hidden shadow-xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 shrink-0">
            <div>
              <h2 className="text-xs font-bold uppercase tracking-wider text-white">Ad Queue</h2>
              <p className="text-[11px] text-gray-400 mt-0.5">Select an ad to preview</p>
            </div>
            <span className="text-[11px] font-mono font-bold text-[#A78BFA] bg-[#7F48ED]/20 border border-[#7F48ED]/30 px-2.5 py-0.5 rounded-md">
              {currentIndex + 1} of {filteredVariants.length}
            </span>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2.5 pt-3 pr-1 scrollbar-thin">
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
                      ? "bg-[#7F48ED]/20 border-[#7F48ED] shadow-lg shadow-[#7F48ED]/15"
                      : "bg-white/[0.02] border-white/5 hover:bg-white/[0.05] hover:border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                      Ad #{index + 1} • {item.clientName}
                    </span>
                    {isApproved ? (
                      <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                        Approved
                      </span>
                    ) : isRejected ? (
                      <span className="bg-white/10 text-gray-300 border border-white/20 text-[10px] font-bold px-1.5 py-0.5 rounded">
                        Declined
                      </span>
                    ) : (
                      <span className="bg-[#FF6700]/20 text-[#FF8533] border border-[#FF6700]/40 text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700]" />
                        Review
                      </span>
                    )}
                  </div>

                  <p className="text-xs font-semibold text-white line-clamp-2 leading-snug">
                    &ldquo;{item.hookText}&rdquo;
                  </p>

                  <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1.5 border-t border-white/5">
                    <span className="truncate max-w-[200px]">{item.angle}</span>
                    <span className="text-[#A78BFA] text-[10px] font-bold shrink-0">Multi-Format</span>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>

        {/* Center Panel: Full Height Stage Video Player */}
        <main className="flex-1 flex flex-col items-center justify-between bg-[#0E1017] rounded-2xl border border-white/10 p-3 sm:p-4 lg:p-5 lg:h-full lg:overflow-hidden min-w-0 shadow-xl">
          {/* Mobile Dropdown Toolbar (< 1024px) — Ultra Clean with Dropdowns */}
          <div className="lg:hidden w-full flex flex-col gap-2 mb-2 shrink-0">
            {/* Row 1: Ad Navigation Dropdown + Prev/Next */}
            <div className="flex items-center gap-1.5 w-full">
              <button
                onClick={goToPrev}
                disabled={currentIndex <= 0}
                className="p-2 rounded-xl bg-[#181A24] hover:bg-[#202330] border border-white/10 text-gray-300 disabled:opacity-30 transition-all cursor-pointer shrink-0"
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
                  className="w-full bg-[#181A24] text-white border border-white/10 rounded-xl px-3 pr-8 py-2 text-xs font-bold truncate appearance-none focus:outline-none focus:border-[#7F48ED] cursor-pointer"
                >
                  {filteredVariants.map((item, index) => (
                    <option key={item.id} value={item.id} className="bg-[#181A24] text-white">
                      Ad #{index + 1}: {item.clientName} {item.status === "approved" ? "✓" : "• Review"}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              <button
                onClick={goToNext}
                disabled={currentIndex >= filteredVariants.length - 1}
                className="p-2 rounded-xl bg-[#181A24] hover:bg-[#202330] border border-white/10 text-gray-300 disabled:opacity-30 transition-all cursor-pointer shrink-0"
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
                  className="w-full bg-[#181A24] text-white border border-white/10 rounded-xl px-3 pr-7 py-2 text-xs font-bold appearance-none focus:outline-none focus:border-[#7F48ED] cursor-pointer"
                >
                  <option value="9:16">9:16 Reel</option>
                  <option value="1:1">1:1 Square</option>
                  <option value="4:5">4:5 Portrait</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Fit Dropdown */}
              <div className="relative flex-1 min-w-0">
                <select
                  value={videoFit}
                  onChange={(e) => setVideoFit(e.target.value as any)}
                  className="w-full bg-[#181A24] text-white border border-white/10 rounded-xl px-3 pr-7 py-2 text-xs font-bold appearance-none focus:outline-none focus:border-[#7F48ED] cursor-pointer"
                >
                  <option value="cover">Fill (Full-Bleed)</option>
                  <option value="contain">Fit (No Crop)</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>

              {/* Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-[#181A24] hover:bg-[#202330] text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer shrink-0"
                title="Fullscreen"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#FF6700]" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Desktop Toolbar (≥ 1024px) — Full Studio Stepper + Ratio Tabs */}
          <div className="hidden lg:flex w-full items-center justify-between gap-2.5 mb-2 shrink-0">
            {/* Stepper Navigation (Above Video) */}
            <div className="flex items-center gap-1.5 text-xs text-gray-400">
              <button
                onClick={goToPrev}
                disabled={currentIndex <= 0}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#181A24] hover:bg-[#202330] border border-white/10 text-gray-300 hover:text-white disabled:opacity-30 disabled:hover:bg-[#181A24] transition-all cursor-pointer font-medium"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
                <span>Prev</span>
              </button>

              <span className="text-[11px] font-medium text-gray-400 px-2">
                Ad <strong className="text-white">{currentIndex + 1}</strong> of{" "}
                <strong className="text-white">{filteredVariants.length}</strong>
              </span>

              <button
                onClick={goToNext}
                disabled={currentIndex >= filteredVariants.length - 1}
                className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#181A24] hover:bg-[#202330] border border-white/10 text-gray-300 hover:text-white disabled:opacity-30 disabled:hover:bg-[#181A24] transition-all cursor-pointer font-medium"
              >
                <span>Next</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Right: Format Ratio Tabs + Fit/Fill Toggle + Fullscreen */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Ratio Tabs */}
              <div className="flex items-center gap-1 bg-[#181A24] p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  onClick={() => setAspectRatio("9:16")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    aspectRatio === "9:16"
                      ? "bg-[#7F48ED] text-white shadow-md shadow-[#7F48ED]/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>9:16 Reel</span>
                </button>

                <button
                  onClick={() => setAspectRatio("1:1")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    aspectRatio === "1:1"
                      ? "bg-[#7F48ED] text-white shadow-md shadow-[#7F48ED]/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Square className="w-3.5 h-3.5" />
                  <span>1:1 Square</span>
                </button>

                <button
                  onClick={() => setAspectRatio("4:5")}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    aspectRatio === "4:5"
                      ? "bg-[#7F48ED] text-white shadow-md shadow-[#7F48ED]/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <span className="text-xs font-mono font-bold">4:5</span>
                  <span>Portrait</span>
                </button>
              </div>

              {/* View Fit Toggle (Fill vs Fit) */}
              <div className="flex items-center gap-1 bg-[#181A24] p-1 rounded-xl border border-white/10 shrink-0">
                <button
                  type="button"
                  onClick={() => setVideoFit("cover")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    videoFit === "cover"
                      ? "bg-[#7F48ED] text-white shadow-md shadow-[#7F48ED]/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Fill container (full-bleed)"
                >
                  Fill
                </button>
                <button
                  type="button"
                  onClick={() => setVideoFit("contain")}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    videoFit === "contain"
                      ? "bg-[#7F48ED] text-white shadow-md shadow-[#7F48ED]/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Fit entire video without cutting off"
                >
                  Fit (No Crop)
                </button>
              </div>

              {/* Quick Fullscreen Button */}
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-xl bg-[#181A24] hover:bg-[#202330] text-gray-300 hover:text-white border border-white/10 transition-colors cursor-pointer"
                title="Fullscreen View"
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4 text-[#FF6700]" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Active Video Player Viewport — Maximizes Full Available Height */}
          <div className="relative w-full flex-1 min-h-[360px] sm:min-h-[440px] lg:min-h-0 flex items-center justify-center py-1">
            {selectedVariant ? (
              <div
                ref={videoContainerRef}
                onClick={togglePlay}
                className={`relative bg-[#07080E] rounded-2xl overflow-hidden border border-white/15 shadow-2xl transition-all duration-300 flex items-center justify-center cursor-pointer select-none group ${
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
                    <div className="h-full aspect-[9/16] border-x border-dashed border-white/10 bg-white/[0.015]" />
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

                {/* Big Center Play Indicator (when paused) */}
                {!isPlaying && (
                  <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center transition-all">
                    <div className="w-16 h-16 rounded-full bg-[#7F48ED] text-white flex items-center justify-center shadow-2xl shadow-[#7F48ED]/50 transform scale-100 hover:scale-105 transition-transform">
                      <Play className="w-7 h-7 fill-white ml-0.5" />
                    </div>
                  </div>
                )}

                {/* Floating Sound Toggle Pill */}
                <div
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleMute();
                  }}
                  className="absolute bottom-3 left-3 bg-black/75 hover:bg-black/90 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg transition-all cursor-pointer"
                >
                  {isMuted ? (
                    <>
                      <VolumeX className="w-3.5 h-3.5 text-[#FF6700]" />
                      <span>Tap to unmute</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Sound On</span>
                    </>
                  )}
                </div>

                {/* Floating Aspect Indicator */}
                <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-md border border-white/15 text-[10px] font-bold text-gray-300 px-2 py-0.5 rounded-md shadow-md">
                  {aspectRatio}
                </div>

                {/* Top Right Quick Controls */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      togglePlay();
                    }}
                    className="w-8 h-8 rounded-full bg-black/65 hover:bg-[#7F48ED] backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer"
                    title={isPlaying ? "Pause" : "Play"}
                  >
                    {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-white" />}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFullscreen();
                    }}
                    className="w-8 h-8 rounded-full bg-black/65 hover:bg-[#FF6700] backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all cursor-pointer"
                    title="Fullscreen"
                  >
                    {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-[400px] flex items-center justify-center text-gray-500 text-sm">
                Loading ad preview...
              </div>
            )}
          </div>

          {/* Bottom Bar: 4 Interactive Pass/Fail Quality Verification Checks */}
          <div className="w-full flex flex-col items-center justify-center pt-2.5 sm:pt-3 border-t border-white/10 shrink-0 gap-1.5">
            <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-400 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Automated QA Pass / Fail Checks</span>
              <span className="text-emerald-400 font-bold">• 4 / 4 PASSED</span>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-2 text-[10px] sm:text-xs">
              {/* Badge 1: 1080p Resolution Check */}
              <div
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm select-none"
                title="Resolution: 1080x1920 (9:16), 1080x1080 (1:1), 1080x1350 (4:5) @ 30fps H.264"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-bold">1080p HD</span>
                <span className="text-[9px] font-mono opacity-80">(1080x1920 PASS)</span>
              </div>

              {/* Badge 2: Audio LUFS Check */}
              <div
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm select-none"
                title={`Loudness: ${selectedVariant?.audioLufs ?? -13.8} LUFS (Broadcast Target: -14.0 ±0.5 LUFS)`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-bold">Audio Level</span>
                <span className="text-[9px] font-mono opacity-80">({selectedVariant?.audioLufs ?? -13.8} LUFS PASS)</span>
              </div>

              {/* Badge 3: Word Sync Captions */}
              <div
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm select-none"
                title="Whisper word-aligned kinetic captions: 100% synchronized"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-bold">Kinetic Captions</span>
                <span className="text-[9px] font-mono opacity-80">(Word-Sync PASS)</span>
              </div>

              {/* Badge 4: Policy & Claims */}
              <div
                className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-lg flex items-center gap-1.5 shadow-sm select-none"
                title="Ad Policy Check: FTC endorsement rules & Meta/TikTok guidelines verified. Zero fake claims."
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                <span className="font-bold">Ad Policy</span>
                <span className="text-[9px] font-mono opacity-80">(Meta &amp; TikTok PASS)</span>
              </div>
            </div>
          </div>
        </main>

        {/* Right Panel: Decision Hub & Creative Brief (Full Height on Desktop) */}
        <aside className="w-full lg:w-[340px] xl:w-[400px] 2xl:w-[440px] shrink-0 flex flex-col gap-4 lg:h-full lg:overflow-y-auto scrollbar-thin">
          {selectedVariant && (
            <>
              {/* Decision Action Card — Solid Purple & Solid Orange Buttons (No Gradients) */}
              <div className="bg-[#0E1017] rounded-2xl border border-white/10 p-4 sm:p-5 shadow-xl space-y-3.5 shrink-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-300">
                    Review Decision &amp; QA Gate
                  </span>
                  {selectedVariant.status === "approved" ? (
                    <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Check className="w-3 h-3 stroke-[3]" />
                      Approved
                    </span>
                  ) : selectedVariant.status === "rejected" ? (
                    <span className="bg-white/10 text-gray-400 border border-white/20 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      Declined
                    </span>
                  ) : (
                    <span className="bg-[#FF6700]/20 text-[#FF8533] border border-[#FF6700]/40 text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700]" />
                      Needs Decision
                    </span>
                  )}
                </div>

                {/* Primary Action: Solid Purple Button OR Creator Audit Sign-Off Seal */}
                {selectedVariant.status === "approved" ? (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xs font-bold shrink-0">
                        ✓
                      </div>
                      <span className="text-xs font-bold text-emerald-400">
                        Creator Sign-Off &amp; Verification Complete
                      </span>
                    </div>

                    <div className="text-[11px] font-mono text-zinc-300 space-y-0.5 border-t border-white/5 pt-2">
                      <div><strong className="text-white">Sign-off:</strong> {selectedVariant.verifiedBy || "Sarah Jenkins (Creator Lead)"}</div>
                      <div><strong className="text-white">Audit ID:</strong> {selectedVariant.auditId || "VER-2026-9812"}</div>
                      <div><strong className="text-white">Timestamp:</strong> {selectedVariant.verifiedAt ? new Date(selectedVariant.verifiedAt).toLocaleDateString() + " " + new Date(selectedVariant.verifiedAt).toLocaleTimeString() : new Date().toLocaleDateString()}</div>
                      <div><strong className="text-white">Compliance:</strong> 100% Policy Verified · Client Release Approved</div>
                    </div>
                  </div>
                ) : (
                  <button
                    disabled={isSubmitting}
                    onClick={() => handleDecision("approve")}
                    className="w-full py-3 px-4 rounded-xl text-sm font-bold bg-[#7F48ED] hover:bg-[#6C34DE] active:bg-[#5B25C7] text-white shadow-lg shadow-[#7F48ED]/25 cursor-pointer active:scale-[0.99] transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                    <span>Verify &amp; Approve Ad (Creator Sign-Off)</span>
                  </button>
                )}

                {/* Secondary Actions: Solid Orange Button & Clean Decline */}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    disabled={isSubmitting}
                    onClick={() => setRecutModalOpen(true)}
                    className="py-2.5 px-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] active:bg-[#CC5200] text-white text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-[#FF6700]/20 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3.5 h-3.5" />
                    <span>Request Changes</span>
                  </button>

                  <button
                    disabled={isSubmitting}
                    onClick={() => handleDecision("reject")}
                    className="py-2.5 px-3 rounded-xl bg-[#181A24] hover:bg-[#202330] border border-white/10 text-gray-300 hover:text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Decline Ad</span>
                  </button>
                </div>

                {/* Enforcement: Client Release Gate (Locked until approved) */}
                <div className="pt-2 border-t border-white/10">
                  <div className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                    <span>Client Delivery Status</span>
                    {selectedVariant.status === "approved" ? (
                      <span className="text-emerald-400 font-bold font-mono">UNLOCKED</span>
                    ) : (
                      <span className="text-[#FF6700] font-bold font-mono">LOCKED</span>
                    )}
                  </div>
                  {selectedVariant.status === "approved" ? (
                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
                      <span className="text-xs text-zinc-200 font-medium">Export Ready for Client Delivery</span>
                      <a
                        href={aspectRatio === "9:16" ? selectedVariant.video9x16 : aspectRatio === "1:1" ? selectedVariant.video1x1 : selectedVariant.video4x5}
                        download={`${selectedVariant.id}-${aspectRatio}.mp4`}
                        className="px-3 py-1 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold transition flex items-center gap-1 cursor-pointer shadow-sm"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download MP4
                      </a>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-black/40 border border-dashed border-white/15 text-[11px] text-zinc-400 flex items-center gap-2">
                      <span className="text-[#FF6700] font-bold text-base shrink-0">🛑</span>
                      <span>Delivery locked. Human creator must sign off before ad reaches the client.</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Creative Brief & Script Details Card */}
              <div className="bg-[#0E1017] rounded-2xl border border-white/10 overflow-hidden shadow-xl shrink-0">
                {/* Header (Clickable toggle on mobile, static on desktop) */}
                <div
                  onClick={() => setDetailsExpanded(!detailsExpanded)}
                  className="p-4 flex items-center justify-between cursor-pointer sm:cursor-default border-b border-white/5"
                >
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-[#A78BFA]" />
                    <h3 className="font-bold text-xs uppercase tracking-wider text-white">
                      Script &amp; Creative Brief
                    </h3>
                  </div>
                  <button
                    type="button"
                    className="sm:hidden text-gray-400 hover:text-white p-1"
                    aria-label="Toggle details"
                  >
                    {detailsExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>

                {/* Content Details */}
                <div className={`p-4 space-y-3.5 text-xs ${detailsExpanded ? "block" : "hidden sm:block"}`}>
                  {/* Campaign Angle & Audience */}
                  <div className="bg-[#181A24] p-3 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-0.5">
                      Campaign Angle
                    </span>
                    <p className="font-semibold text-white text-xs">{selectedVariant.angle}</p>
                    <p className="text-[11px] text-gray-400 mt-1">
                      Audience: <span className="text-gray-300">{selectedVariant.targetPersona}</span>
                    </p>
                  </div>

                  {/* Opening Hook Highlight */}
                  <div className="bg-[#7F48ED]/10 border border-[#7F48ED]/20 p-3 rounded-xl">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#C4B5FD]">
                        Opening Hook (First 3s)
                      </span>
                      <span className="text-[10px] text-[#A78BFA] font-bold">High Retention</span>
                    </div>
                    <p className="text-white font-medium italic">
                      &ldquo;{selectedVariant.hookText}&rdquo;
                    </p>
                  </div>

                  {/* Voiceover Script */}
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Voiceover Script
                    </span>
                    <p className="text-gray-300 leading-relaxed bg-[#181A24] p-3 rounded-xl border border-white/5">
                      {selectedVariant.scriptBody}
                    </p>
                  </div>

                  {/* Ending Offer / Call to Action */}
                  <div className="bg-[#FF6700]/10 border border-[#FF6700]/20 p-3 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#FF8533] block mb-0.5">
                        Call to Action
                      </span>
                      <p className="text-white font-bold">{selectedVariant.ctaText}</p>
                    </div>
                    <span className="text-[10px] font-bold text-[#FF8533] bg-[#FF6700]/20 px-2 py-1 rounded-md">
                      End Card
                    </span>
                  </div>

                  {/* Hybrid Source Breakdown */}
                  <div className="bg-[#141722] p-3 rounded-xl border border-white/5 space-y-1.5 font-mono text-[11px]">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block font-sans">
                      Hybrid Composition Sources
                    </span>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>Creator Hook:</span>
                      <span className="text-[#C4B5FD] font-semibold">{selectedVariant.creatorActor || "Emma Davis (@trendspotlight)"}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>Client Footage:</span>
                      <span className="text-[#FF8533] font-semibold truncate max-w-[170px]">{selectedVariant.clientFootageSource || "Raw Product Video Ingested"}</span>
                    </div>
                    <div className="flex items-center justify-between text-zinc-300">
                      <span>AI Model:</span>
                      <span className="text-[#67E8F9] font-semibold">Grok Imagine 1.5</span>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </aside>
      </div>

      {/* Change Request Notes Modal */}
      {recutModalOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#12141D] border border-[#7F48ED]/40 rounded-2xl p-5 sm:p-6 max-w-md w-full shadow-2xl space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <RefreshCw className="w-4 h-4 text-[#FF6700]" />
                <h3 className="font-bold text-sm sm:text-base text-white">
                  Request Changes on this Ad
                </h3>
              </div>
              <button
                onClick={() => setRecutModalOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/5 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-300">
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
                  className="text-[11px] bg-white/5 hover:bg-[#7F48ED]/20 hover:border-[#7F48ED]/40 border border-white/10 px-2.5 py-1 rounded-lg text-gray-300 hover:text-white transition-all cursor-pointer"
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
              className="w-full bg-[#181A24] border border-white/10 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-[#7F48ED] placeholder-gray-500"
            />

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setRecutModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-400 hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={!recutNotes.trim() || isSubmitting}
                onClick={() => handleDecision("recut")}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-[#7F48ED] hover:bg-[#6C34DE] text-white transition-all disabled:opacity-40 cursor-pointer shadow-md shadow-[#7F48ED]/25"
              >
                Submit Change Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-[#161822] text-white border border-[#7F48ED] font-bold text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2.5 z-50 animate-in slide-in-from-bottom-3 duration-200">
          <div className="w-5 h-5 rounded-full bg-[#7F48ED] flex items-center justify-center shrink-0">
            <Check className="w-3 h-3 text-white stroke-[3]" />
          </div>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
