"use client";

export const dynamic = "force-dynamic";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  Download,
  ExternalLink,
  Share2,
  Folder,
  ShieldCheck,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Smartphone,
  Square,
  Search,
  Filter,
  Layers,
  Sparkles,
  Eye,
  FileText,
  ChevronDown,
  ChevronUp,
  FolderCheck,
  CheckCircle2,
  Calendar,
  Maximize2,
  Minimize2,
} from "lucide-react";

interface ApprovedVariant {
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
  status: string;
  scriptBody: string;
  ctaText: string;
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
  voiceoverUrl?: string;
  wordTimestamps?: Array<{ word: string; start: number; end: number }>;
  aiSceneUrl?: string;
  delivery?: {
    googleDriveFolderId?: string;
    deliveredAt?: string;
    status: "pending" | "delivered" | "failed";
  };
}

export default function ApprovedDeliverablesVaultPage() {
  const [deliverables, setDeliverables] = useState<ApprovedVariant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [ratios, setRatios] = useState<Record<string, "9:16" | "1:1" | "4:5">>({});
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [mutedMap, setMutedMap] = useState<Record<string, boolean>>({});
  const [expandedBriefId, setExpandedBriefId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [fullscreenId, setFullscreenId] = useState<string | null>(null);

  const videoRefs = useRef<Record<string, HTMLVideoElement | null>>({});
  const cardContainerRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fullscreen change listener across document
  useEffect(() => {
    const handleFsChange = () => {
      const activeEl = document.fullscreenElement;
      if (activeEl) {
        const match = Object.keys(cardContainerRefs.current).find(
          (k) => cardContainerRefs.current[k] === activeEl
        );
        setFullscreenId(match || null);
      } else {
        setFullscreenId(null);
      }
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  const toggleCardFullscreen = (id: string) => {
    const container = cardContainerRefs.current[id];
    if (!container) return;

    if (!document.fullscreenElement) {
      if (container.requestFullscreen) {
        container.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const loadApprovedDeliverables = () => {
    setLoading(true);
    fetch("/api/studio/review?status=approved")
      .then((res) => res.json())
      .then((data) => {
        const list: ApprovedVariant[] = data.variants || [];
        setDeliverables(list);
        setPendingCount(data.needsReviewCount ?? 0);

        // Initialize ratios map
        const initialRatios: Record<string, "9:16" | "1:1" | "4:5"> = {};
        list.forEach((item) => {
          initialRatios[item.id] = "9:16";
        });
        setRatios(initialRatios);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load approved deliverables", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadApprovedDeliverables();
  }, []);

  const togglePlay = (id: string) => {
    const vid = videoRefs.current[id];
    if (!vid) return;

    if (playingId === id) {
      vid.pause();
      setPlayingId(null);
    } else {
      // Pause any previously playing video
      if (playingId && videoRefs.current[playingId]) {
        videoRefs.current[playingId]?.pause();
      }
      vid.play().then(() => setPlayingId(id)).catch(() => {});
    }
  };

  const toggleMute = (id: string) => {
    const vid = videoRefs.current[id];
    const nextMuted = !mutedMap[id];
    setMutedMap((prev) => ({ ...prev, [id]: nextMuted }));
    if (vid) vid.muted = nextMuted;
  };

  const setRatio = (id: string, ratio: "9:16" | "1:1" | "4:5") => {
    setRatios((prev) => ({ ...prev, [id]: ratio }));
    const vid = videoRefs.current[id];
    if (vid) {
      vid.currentTime = 0;
      if (playingId === id) {
        vid.play().catch(() => {});
      }
    }
  };

  const copyClientLink = (id: string) => {
    const url = typeof window !== "undefined"
      ? `${window.location.origin}/studio/review?variantId=${id}&clientView=true`
      : "";
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(url).then(() => {
        showToast("Client delivery sign-off link copied!");
      }).catch(() => {
        showToast("Link: " + url);
      });
    } else {
      showToast("Link: " + url);
    }
  };

  // Distinct brand names for filter tabs
  const brandList = Array.from(
    new Set(deliverables.map((d) => d.clientName).filter(Boolean))
  );

  const filtered = deliverables.filter((item) => {
    const matchesBrand =
      selectedBrand === "all" ||
      item.clientName.toLowerCase() === selectedBrand.toLowerCase();
    const query = searchQuery.trim().toLowerCase();
    if (!query) return matchesBrand;

    const matchesQuery =
      item.clientName.toLowerCase().includes(query) ||
      item.angle.toLowerCase().includes(query) ||
      item.hookText.toLowerCase().includes(query) ||
      (item.auditId && item.auditId.toLowerCase().includes(query)) ||
      (item.verifiedBy && item.verifiedBy.toLowerCase().includes(query));

    return matchesBrand && matchesQuery;
  });

  const googleDriveFolderId = "1HWnNVUDgq3d0uI5Fcd54aS3Iim7U97Vx";

  return (
    <div className="min-h-screen bg-[#F8F9FC] text-[#090D16] flex flex-col font-sans selection:bg-[#7F48ED]/20 selection:text-[#7F48ED]">
      {/* 1. Header Bar — Crisp Responsive Header with Portal Tabs */}
      <header className="h-14 sm:h-16 border-b border-zinc-200 bg-white px-3 sm:px-6 flex items-center justify-between sticky top-0 z-40 shrink-0 shadow-xs">
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

          <div className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs sm:text-sm font-black tracking-tight text-[#090D16] uppercase whitespace-nowrap truncate">
              <span className="hidden xs:inline">Studio </span>
              <span className="text-emerald-600">Approved</span>
              <span className="text-zinc-900 hidden sm:inline"> Vault</span>
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
          <Link
            href="/studio/review"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-700 hover:text-zinc-950 rounded-xl text-xs font-bold transition-all border border-zinc-200 cursor-pointer shrink-0"
            title="Open Review Queue"
          >
            <Eye className="w-3.5 h-3.5 text-[#FF6700]" />
            <span className="hidden sm:inline">Review Queue</span>
            <span className="sm:hidden">Queue</span>
            {pendingCount > 0 && (
              <span className="bg-[#FF6700] text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full">
                {pendingCount}
              </span>
            )}
          </Link>

          <div className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 bg-emerald-50 text-emerald-800 rounded-xl text-xs font-bold border border-emerald-200 shrink-0 shadow-xs">
            <FolderCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Vault ({deliverables.length})</span>
          </div>

          <Link
            href="/studio/generate"
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3.5 py-1.5 bg-[#FF6700] hover:bg-[#E55C00] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
            title="Create New Ad"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Create Ad</span>
            <span className="sm:hidden">+ Ad</span>
          </Link>
        </div>
      </header>

      {/* 2. Main Content Container — Full Width Matching Generate and Review */}
      <main className="flex-1 w-full p-3 sm:p-4 lg:p-5 space-y-4 sm:space-y-5">
        {/* Banner: Vault Stats & Google Drive Link */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                Client-Ready Deliverable Archive
              </span>
              <span className="text-zinc-400 text-xs hidden sm:inline">|</span>
              <span className="text-xs text-zinc-500 hidden sm:inline">
                Zero duplicates · All 4 quality compliance gates verified
              </span>
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-zinc-900 tracking-tight">
              Approved Commercial Video Ads
            </h1>
            <p className="text-xs sm:text-sm text-zinc-600 max-w-3xl leading-relaxed">
              All ads here have received full human sign-off, passed script compliance, verified creator UGC, and have been archived to Google Drive in vertical (9:16), square (1:1), and portrait (4:5) formats.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <a
              href={`https://drive.google.com/drive/folders/${googleDriveFolderId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-sm cursor-pointer"
              title="Open Google Drive Delivery Folder"
            >
              <Folder className="w-4 h-4 text-white" />
              <span>Open Google Drive</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </a>
          </div>
        </div>

        {/* 3. Search & Brand Filter Bar */}
        <div className="bg-white rounded-2xl border border-zinc-200 p-3 sm:p-4 shadow-sm flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search hook, brand, auditor, or audit ID..."
              className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-9 pr-3 py-2 text-xs text-zinc-900 placeholder:text-zinc-400 focus:outline-none focus:border-[#7F48ED] font-medium"
            />
          </div>

          {/* Brand Filter Pills (Full bleed touch scroll on mobile) */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none -mx-1 px-1 sm:mx-0 sm:px-0">
            <button
              onClick={() => setSelectedBrand("all")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                selectedBrand === "all"
                  ? "bg-[#7F48ED] text-white shadow-xs"
                  : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200"
              }`}
            >
              All Brands ({deliverables.length})
            </button>
            {brandList.map((brand) => {
              const count = deliverables.filter((d) => d.clientName === brand).length;
              const isSelected = selectedBrand.toLowerCase() === brand.toLowerCase();
              return (
                <button
                  key={brand}
                  onClick={() => setSelectedBrand(brand)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? "bg-[#7F48ED] text-white shadow-xs"
                      : "bg-zinc-100 hover:bg-zinc-200 text-zinc-700 border border-zinc-200"
                  }`}
                >
                  {brand} ({count})
                </button>
              );
            })}
          </div>
        </div>

        {/* 4. Deliverables Grid — Responsive Wide Cards with Fullscreen Feature */}
        {loading ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-zinc-200 shadow-sm text-zinc-500">
            <div className="w-8 h-8 border-2 border-[#7F48ED] border-t-transparent rounded-full animate-spin mb-3" />
            <p className="text-xs font-bold text-zinc-700">Loading approved deliverables...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-dashed border-zinc-300 shadow-sm text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
              <FolderCheck className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-bold text-zinc-900 mb-1">No Approved Deliverables Found</h3>
            <p className="text-xs text-zinc-500 max-w-sm mb-4">
              {deliverables.length === 0
                ? "No ads have been approved yet. Inspect ads in the Review Room and click 'Approve Ad & Deliver to Drive' once all 4 quality gates pass."
                : "No deliverables matched your search query or brand filter."}
            </p>
            <div className="flex items-center gap-2">
              <Link
                href="/studio/review"
                className="px-4 py-2 bg-[#7F48ED] hover:bg-[#6C34DE] text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                Go to Review Room
              </Link>
              <Link
                href="/studio/generate"
                className="px-4 py-2 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 rounded-xl text-xs font-bold transition border border-zinc-200"
              >
                Create Ad
              </Link>
            </div>
          </div>
        ) : (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5">
            {filtered.map((item, index) => {
              const currentRatio = ratios[item.id] || "9:16";
              const currentVideoSrc =
                currentRatio === "9:16"
                  ? item.video9x16
                  : currentRatio === "1:1"
                  ? item.video1x1
                  : item.video4x5;
              const isPlaying = playingId === item.id;
              const isMuted = mutedMap[item.id] ?? true;
              const briefOpen = expandedBriefId === item.id;
              const isFullscreen = fullscreenId === item.id;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm flex flex-col transition-all hover:border-zinc-300 hover:shadow-md"
                >
                  {/* Card Header */}
                  <div className="p-3.5 sm:p-4 border-b border-zinc-100 flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-6 h-6 rounded-lg bg-emerald-50 text-emerald-700 font-mono text-[11px] font-bold flex items-center justify-center shrink-0">
                        #{index + 1}
                      </span>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <h3 className="font-bold text-sm text-zinc-900 truncate">
                            {item.clientName}
                          </h3>
                          <span className="bg-purple-50 text-[#7F48ED] border border-purple-200 text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0">
                            {item.angle}
                          </span>
                        </div>
                        <p className="text-[11px] text-zinc-500 font-mono truncate">
                          {item.auditId || `AUDIT-${item.id.toUpperCase()}`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="h-7 px-2.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-bold flex items-center gap-1 shrink-0 select-none">
                        <Check className="w-3 h-3 stroke-[3]" />
                        <span>Approved</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => copyClientLink(item.id)}
                        className="h-7 w-7 rounded-lg bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 text-zinc-700 border border-zinc-200 transition cursor-pointer flex items-center justify-center shrink-0"
                        title="Copy Client Sign-Off Link"
                      >
                        <Share2 className="w-3.5 h-3.5 text-[#7F48ED]" />
                      </button>
                    </div>
                  </div>

                  {/* Video Stage & Format Controls */}
                  <div className="p-3 sm:p-4 bg-zinc-50/70 border-b border-zinc-100 flex flex-col items-center">
                    {/* Ratio Switcher & Actions Bar */}
                    <div className="flex items-center justify-between w-full max-w-md mb-2.5 sm:mb-3 gap-1">
                      {/* Format Selector Pills */}
                      <div className="flex items-center bg-zinc-200/80 p-0.5 rounded-xl">
                        {(["9:16", "1:1", "4:5"] as const).map((r) => (
                          <button
                            key={r}
                            onClick={() => setRatio(item.id, r)}
                            className={`px-2 sm:px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                              currentRatio === r
                                ? "bg-[#7F48ED] text-white shadow-xs"
                                : "text-zinc-600 hover:text-zinc-900"
                            }`}
                          >
                            {r}
                          </button>
                        ))}
                      </div>

                      {/* Quick Playback Controls + Fullscreen Button */}
                      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
                        <button
                          onClick={() => toggleMute(item.id)}
                          className="p-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 transition cursor-pointer shadow-xs"
                          title={isMuted ? "Unmute Audio" : "Mute Audio"}
                        >
                          {isMuted ? <VolumeX className="w-3.5 h-3.5 text-[#FF6700]" /> : <Volume2 className="w-3.5 h-3.5 text-emerald-600" />}
                        </button>
                        <button
                          onClick={() => togglePlay(item.id)}
                          className="px-2 sm:px-2.5 py-1 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 text-xs font-bold flex items-center gap-1 transition cursor-pointer shadow-xs"
                          title={isPlaying ? "Pause" : "Play"}
                        >
                          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 fill-current" />}
                          <span className="hidden xs:inline">{isPlaying ? "Pause" : "Play"}</span>
                        </button>
                        <button
                          onClick={() => toggleCardFullscreen(item.id)}
                          className="p-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-700 hover:text-[#7F48ED] transition cursor-pointer shadow-xs"
                          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
                        >
                          {isFullscreen ? <Minimize2 className="w-3.5 h-3.5 text-[#FF6700]" /> : <Maximize2 className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Video Player Display Container (Supports Native Fullscreen) */}
                    <div
                      ref={(el) => {
                        cardContainerRefs.current[item.id] = el;
                      }}
                      onClick={() => togglePlay(item.id)}
                      onDoubleClick={(e) => {
                        e.stopPropagation();
                        toggleCardFullscreen(item.id);
                      }}
                      className={`relative bg-[#090D16] rounded-2xl overflow-hidden border border-zinc-300 shadow-md cursor-pointer flex items-center justify-center transition-all select-none group ${
                        isFullscreen
                          ? "w-full h-full max-h-screen p-0 border-none rounded-none"
                          : currentRatio === "9:16"
                          ? "h-80 sm:h-96 md:h-[400px] aspect-[9/16] w-auto max-w-full"
                          : currentRatio === "1:1"
                          ? "h-72 sm:h-80 md:h-[340px] aspect-square w-auto max-w-full"
                          : "h-80 sm:h-96 md:h-[380px] aspect-[4/5] w-auto max-w-full"
                      }`}
                    >
                      <video
                        ref={(el) => {
                          videoRefs.current[item.id] = el;
                        }}
                        src={currentVideoSrc}
                        loop
                        muted={isMuted}
                        playsInline
                        className={`w-full h-full transition-all duration-200 ${
                          isFullscreen ? "object-contain" : "object-cover"
                        }`}
                      />

                      {/* Center Play Indicator */}
                      {!isPlaying && (
                        <div className="absolute inset-0 bg-black/35 backdrop-blur-[1px] flex items-center justify-center transition-all z-10">
                          <div className="w-14 h-14 rounded-full bg-[#7F48ED] text-white flex items-center justify-center shadow-xl shadow-[#7F48ED]/40 transform scale-100 group-hover:scale-105 transition-transform">
                            <Play className="w-6 h-6 fill-white ml-0.5" />
                          </div>
                        </div>
                      )}

                      {/* Aspect Ratio Floating Badge */}
                      <div className="absolute top-2.5 left-2.5 z-20 bg-white/90 text-zinc-900 backdrop-blur-xs text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {currentRatio}
                      </div>

                      {/* Floating In-Video Controls */}
                      <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-opacity">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleMute(item.id);
                          }}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-900 backdrop-blur-xs border border-zinc-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                          title={isMuted ? "Unmute" : "Mute"}
                        >
                          {isMuted ? <VolumeX className="w-3 h-3 text-[#FF6700]" /> : <Volume2 className="w-3 h-3 text-emerald-600" />}
                        </button>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleCardFullscreen(item.id);
                          }}
                          className="w-7 h-7 rounded-full bg-white/90 hover:bg-white text-zinc-900 hover:text-[#7F48ED] backdrop-blur-xs border border-zinc-200 flex items-center justify-center transition-all cursor-pointer shadow-xs"
                          title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                        >
                          {isFullscreen ? <Minimize2 className="w-3 h-3 text-[#FF6700]" /> : <Maximize2 className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>

                    {/* Opening Hook Quote */}
                    <p className="mt-3 text-xs font-semibold text-zinc-800 text-center italic max-w-md line-clamp-2 leading-relaxed px-2">
                      &ldquo;{item.hookText}&rdquo;
                    </p>
                  </div>

                  {/* Audit Certificate Seal */}
                  <div className="p-3 sm:p-3.5 bg-emerald-50/50 border-b border-zinc-100 flex items-center justify-between text-[11px] gap-2 flex-wrap">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-medium">
                      <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>
                        Auditor: <strong className="text-zinc-900">{item.verifiedBy || "Lead QA Operator"}</strong>
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-zinc-600 font-mono text-[10px]">
                      <Calendar className="w-3 h-3 text-zinc-400" />
                      <span>{item.verifiedAt ? new Date(item.verifiedAt).toLocaleDateString() : "Verified"}</span>
                      <span className="text-emerald-700 font-bold bg-emerald-100 px-1.5 py-0.2 rounded font-sans">
                        4/4 Checks Pass
                      </span>
                    </div>
                  </div>

                  {/* 1-Click Downloads & Delivery Actions */}
                  <div className="p-3.5 sm:p-4 space-y-2.5">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 flex items-center justify-between">
                      <span>Deliverable Downloads</span>
                      <span className="text-[#7F48ED] font-mono text-[10px]">1080p MP4 Ready</span>
                    </div>

                    {/* Download buttons row */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                      <a
                        href={item.video9x16}
                        download={`${item.clientName.toLowerCase().replace(/\s+/g, "-")}-${item.id}-9x16.mp4`}
                        className="flex items-center justify-center gap-1 p-2 sm:p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 border border-zinc-200 text-zinc-800 text-xs font-bold transition cursor-pointer min-h-[40px]"
                        title="Download Vertical 9:16 Reel"
                      >
                        <Download className="w-3.5 h-3.5 text-[#7F48ED] shrink-0" />
                        <span className="truncate">9:16<span className="hidden md:inline"> Reel</span></span>
                      </a>

                      <a
                        href={item.video1x1}
                        download={`${item.clientName.toLowerCase().replace(/\s+/g, "-")}-${item.id}-1x1.mp4`}
                        className="flex items-center justify-center gap-1 p-2 sm:p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 border border-zinc-200 text-zinc-800 text-xs font-bold transition cursor-pointer min-h-[40px]"
                        title="Download Square 1:1 Feed Video"
                      >
                        <Download className="w-3.5 h-3.5 text-[#7F48ED] shrink-0" />
                        <span className="truncate">1:1<span className="hidden md:inline"> Feed</span></span>
                      </a>

                      <a
                        href={item.video4x5}
                        download={`${item.clientName.toLowerCase().replace(/\s+/g, "-")}-${item.id}-4x5.mp4`}
                        className="flex items-center justify-center gap-1 p-2 sm:p-2.5 rounded-xl bg-zinc-100 hover:bg-zinc-200 active:bg-zinc-300 border border-zinc-200 text-zinc-800 text-xs font-bold transition cursor-pointer min-h-[40px]"
                        title="Download Portrait 4:5 Meta Feed Video"
                      >
                        <Download className="w-3.5 h-3.5 text-[#7F48ED] shrink-0" />
                        <span className="truncate">4:5<span className="hidden md:inline"> Meta</span></span>
                      </a>
                    </div>

                    {/* Cloud delivery & Review Link */}
                    <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
                      <a
                        href={`https://drive.google.com/drive/folders/${item.delivery?.googleDriveFolderId || googleDriveFolderId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:bg-emerald-200 border border-emerald-200 text-emerald-800 text-xs font-bold transition cursor-pointer min-h-[40px]"
                        title="Open shared client Google Drive folder"
                      >
                        <Folder className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Open Drive Folder</span>
                        <ExternalLink className="w-3 h-3 text-emerald-600 shrink-0 ml-0.5" />
                      </a>

                      <Link
                        href={`/studio/review?variantId=${item.id}&clientView=true`}
                        className="w-full sm:w-auto flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-purple-50 hover:bg-purple-100 active:bg-purple-200 border border-purple-200 text-[#7F48ED] text-xs font-bold transition cursor-pointer min-h-[40px]"
                        title="Open Client Sign-Off Room"
                      >
                        <Eye className="w-4 h-4 shrink-0" />
                        <span>Sign-Off Room</span>
                      </Link>
                    </div>

                    {/* Expandable Script & Voiceover Drawer */}
                    <div className="pt-2 border-t border-zinc-100">
                      <button
                        onClick={() =>
                          setExpandedBriefId(briefOpen ? null : item.id)
                        }
                        className="w-full flex items-center justify-between text-[11px] font-bold text-zinc-600 hover:text-zinc-900 cursor-pointer py-1"
                      >
                        <span className="flex items-center gap-1">
                          <FileText className="w-3.5 h-3.5 text-[#7F48ED]" />
                          Voiceover Script &amp; Angle Details
                        </span>
                        {briefOpen ? (
                          <ChevronUp className="w-3.5 h-3.5" />
                        ) : (
                          <ChevronDown className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {briefOpen && (
                        <div className="mt-2 p-3 bg-zinc-50 rounded-xl border border-zinc-200 space-y-2 text-xs">
                          <div>
                            <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">
                              Full Script Body
                            </span>
                            <p className="text-zinc-800 mt-0.5 leading-relaxed">
                              {item.scriptBody}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-200 text-[11px] flex-wrap gap-1">
                            <span className="text-zinc-500">
                              Target Persona: <strong className="text-zinc-800">{item.targetPersona}</strong>
                            </span>
                            <span className="text-zinc-500">
                              End CTA: <strong className="text-[#FF6700]">{item.ctaText}</strong>
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#090D16] text-white text-xs font-semibold px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-zinc-800 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
