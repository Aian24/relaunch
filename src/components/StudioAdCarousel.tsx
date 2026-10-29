"use client";

import React, { useState, useRef, useEffect } from "react";
import { AdShowcaseItem, studioData } from "@/data/studioSubBrand";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Sparkles,
  X,
  ArrowUpRight,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ThumbsUp,
  Send,
  MoreHorizontal,
  Music,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Layers,
  Target,
  Compass,
  Utensils,
} from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";

type PlatformFilter = "all" | "tiktok" | "meta";
type CategoryFilter = "all" | "golf" | "outdoor" | "dance" | "beauty" | "food";

interface StudioPhoneCardProps {
  ad: AdShowcaseItem;
  idx: number;
  isLiked: boolean;
  onToggleLike: (e: React.MouseEvent) => void;
  isAudioActive: boolean;
  onToggleAudio: (e: React.MouseEvent) => void;
  isPaused: boolean;
  onTogglePlay: (e: React.MouseEvent) => void;
  onOpenModal: () => void;
  isDimmed: boolean;
}

function BrandMonogram({ name, category }: { name: string; category: string }) {
  const initial = name.replace(/[^a-zA-Z]/g, "").charAt(0).toUpperCase() || "B";
  const getGradient = () => {
    if (category.includes("Dance") || category.includes("Movement")) {
      return "from-purple-500 to-indigo-700";
    }
    if (category.includes("Golf") || category.includes("Sports")) {
      return "from-emerald-500 to-teal-700";
    }
    if (category.includes("Outdoor")) {
      return "from-amber-500 to-orange-700";
    }
    if (category.includes("Beauty")) {
      return "from-pink-500 to-rose-700";
    }
    if (category.includes("Food") || category.includes("Dining")) {
      return "from-amber-600 to-orange-700";
    }
    return "from-[#7F48ED] to-indigo-700";
  };

  return (
    <div
      className={`w-full h-full rounded-full bg-gradient-to-tr ${getGradient()} flex items-center justify-center text-white text-[9px] font-heading font-black shadow-inner`}
    >
      {initial}
    </div>
  );
}

function StudioPhoneCard({
  ad,
  idx,
  isLiked,
  onToggleLike,
  isAudioActive,
  onToggleAudio,
  isPaused,
  onTogglePlay,
  onOpenModal,
  isDimmed,
}: StudioPhoneCardProps) {
  const isTikTok = idx % 2 === 0;
  const videoRef = useRef<HTMLVideoElement>(null);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = !isAudioActive;
    }
  }, [isAudioActive]);

  // Sync play/pause state
  useEffect(() => {
    if (videoRef.current) {
      if (isPaused) {
        videoRef.current.pause();
      } else {
        videoRef.current.play().catch(() => {});
      }
    }
  }, [isPaused]);

  if (isTikTok) {
    return (
      <div
        onClick={onOpenModal}
        className={`w-[230px] sm:w-[260px] aspect-[9/16] rounded-[34px] sm:rounded-[38px] p-2 sm:p-2.5 bg-gradient-to-b from-slate-800 via-slate-900 to-black shadow-[0_20px_50px_rgba(0,0,0,0.85)] border transition-all duration-300 relative flex flex-col justify-between group cursor-pointer shrink-0 select-none ${
          isDimmed
            ? "opacity-30 scale-95 border-white/5"
            : "border-white/20 hover:border-[#FE2C55]/80 hover:shadow-[0_20px_45px_rgba(254,44,85,0.3)] hover:-translate-y-1.5"
        }`}
      >
        {/* Top Platform Tag */}
        <div className="absolute -top-3 left-4 z-30 px-2.5 py-0.5 rounded-lg bg-black text-white border border-white/20 text-[9px] font-mono font-bold uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55]" />
          <span>TikTok Concept</span>
        </div>

        {/* Screen Content */}
        <div className="relative w-full h-full rounded-[26px] sm:rounded-[30px] overflow-hidden bg-black flex flex-col justify-between">
          <video
            ref={videoRef}
            src={ad.videoSrc}
            autoPlay
            loop
            muted={!isAudioActive}
            playsInline
            className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none" />

          {/* Dynamic Island Notch */}
          <div className="w-10 h-2 bg-black/80 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1.5 z-20 pointer-events-none" />

          {/* TikTok Top Nav: Following | For You + Live Sound & Play Buttons */}
          <div className="relative z-20 px-3 pt-3 flex items-center justify-between text-white">
            <div className="flex items-center gap-2 text-slate-300 text-[8px] sm:text-[9px]">
              <span className="opacity-70">Following</span>
              <span className="text-white font-bold border-b-2 border-white pb-0.5">For You</span>
            </div>

            {/* In-Phone Interactive Audio & Play Controls */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={onToggleAudio}
                className={`w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer shadow-md ${
                  isAudioActive
                    ? "bg-[#FE2C55] text-white border-[#FE2C55] ring-2 ring-[#FE2C55]/30 animate-pulse"
                    : "bg-black/60 hover:bg-black/90 text-white border-white/25"
                }`}
                title={isAudioActive ? "Mute Reel" : "Unmute Reel"}
              >
                {isAudioActive ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
              </button>

              <button
                type="button"
                onClick={onTogglePlay}
                className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/25 transition-all cursor-pointer shadow-md"
                title={isPaused ? "Play" : "Pause"}
              >
                {isPaused ? <Play className="w-2.5 h-2.5 ml-0.5" /> : <Pause className="w-2.5 h-2.5" />}
              </button>
            </div>
          </div>

          {/* Center Hover Play Button (Expands to Modal) */}
          <div className="relative z-10 flex items-center justify-center my-auto pointer-events-none">
            <div className="w-11 h-11 rounded-full bg-white/25 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl">
              <Play className="w-5 h-5 fill-white ml-0.5" />
            </div>
          </div>

          {/* TikTok Right Action Rail (Clean, no fabricated metrics) */}
          <div className="absolute right-1 sm:right-2 bottom-12 z-20 flex flex-col items-center gap-2.5 text-white">
            {/* Neutral Brand Monogram Avatar */}
            <div className="relative mb-0.5">
              <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full p-0.5 shadow-md">
                <BrandMonogram name={ad.brandName} category={ad.category} />
              </div>
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FE2C55] text-white flex items-center justify-center text-[8px] font-bold">
                +
              </div>
            </div>

            {/* Interactive Heart Button */}
            <button
              type="button"
              onClick={onToggleLike}
              className="flex flex-col items-center cursor-pointer group/heart transition-transform active:scale-125"
              title="Save this Concept"
            >
              <Heart
                className={`w-4 h-4 transition-all duration-200 ${
                  isLiked
                    ? "fill-[#FE2C55] text-[#FE2C55] scale-110 drop-shadow-[0_0_8px_rgba(254,44,85,0.7)]"
                    : "fill-white/80 text-white group-hover/heart:fill-[#FE2C55] group-hover/heart:text-[#FE2C55]"
                }`}
              />
              <span className={`text-[7px] sm:text-[8px] font-mono mt-0.5 font-bold ${isLiked ? "text-[#FE2C55]" : "text-white"}`}>
                {isLiked ? "Saved" : "Save"}
              </span>
            </button>

            <div className="flex flex-col items-center pointer-events-none opacity-85">
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white drop-shadow" />
            </div>

            <div className="flex flex-col items-center pointer-events-none opacity-85">
              <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white drop-shadow" />
            </div>

            <div className="flex flex-col items-center pointer-events-none opacity-85">
              <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white drop-shadow" />
            </div>

            <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 border-2 border-white/40 flex items-center justify-center animate-spin [animation-duration:5s] mt-0.5 overflow-hidden p-0.5 pointer-events-none">
              <Music className="w-2.5 h-2.5 text-white/80" />
            </div>
          </div>

          {/* TikTok Bottom Info */}
          <div className="relative z-10 p-2 sm:p-2.5 pr-8 pointer-events-none">
            <div className="flex items-center gap-1.5 mb-0.5">
              <div className="w-3.5 h-3.5 rounded-full overflow-hidden flex items-center justify-center shrink-0">
                <BrandMonogram name={ad.brandName} category={ad.category} />
              </div>
              <span className="font-heading font-bold text-white text-[9px] sm:text-[10px] truncate max-w-[120px]">
                {ad.brandHandle}
              </span>
              <span className="px-1.5 py-0.2 rounded bg-white/20 text-[6px] sm:text-[7px] font-mono uppercase tracking-wider text-slate-200">
                {ad.statBadge === "Client Showcase" ? "Client Ad" : "Concept Ad"}
              </span>
            </div>
            <p className="text-white text-[8px] sm:text-[9px] font-normal leading-tight line-clamp-2 mb-1">
              {ad.title}
            </p>
            <div className="flex items-center gap-1 text-[7px] sm:text-[8px] font-mono text-slate-300">
              <Music className="w-2 h-2 shrink-0" />
              <span className="truncate">Original Sound · {ad.brandName}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Meta Reels / FB Reels
  return (
    <div
      onClick={onOpenModal}
      className={`w-[230px] sm:w-[260px] aspect-[9/16] rounded-[34px] sm:rounded-[38px] p-2 sm:p-2.5 bg-gradient-to-b from-slate-700 via-slate-900 to-black shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 transition-all duration-300 relative flex flex-col justify-between group cursor-pointer shrink-0 select-none ${
        isDimmed
          ? "opacity-30 scale-95 border-white/5"
          : "border-[#1877F2]/60 hover:border-[#1877F2] hover:shadow-[0_20px_45px_rgba(24,119,242,0.35)] hover:-translate-y-1.5"
      }`}
    >
      {/* Top Platform Tag */}
      <div className="absolute -top-3 right-4 z-30 px-2.5 py-0.5 rounded-lg bg-[#1877F2] text-white text-[9px] font-mono font-bold uppercase shadow-md flex items-center gap-1.5 whitespace-nowrap">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
        <span>FB Reels Concept</span>
      </div>

      {/* Screen Content */}
      <div className="relative w-full h-full rounded-[26px] sm:rounded-[30px] overflow-hidden bg-black flex flex-col justify-between">
        <video
          ref={videoRef}
          src={ad.videoSrc}
          autoPlay
          loop
          muted={!isAudioActive}
          playsInline
          className="absolute inset-0 w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none" />

        {/* Dynamic Island Notch */}
        <div className="w-10 h-2 bg-black/80 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1.5 z-20 pointer-events-none" />

        {/* Facebook Reels Top Bar + Live Audio & Play Controls */}
        <div className="relative z-20 px-3 pt-3 flex items-center justify-between text-white">
          <div className="flex items-center gap-1">
            <span className="font-heading font-black text-white text-[10px] sm:text-[11px] tracking-tight">
              Reels
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onToggleAudio}
              className={`w-6 h-6 rounded-full flex items-center justify-center backdrop-blur-md border transition-all cursor-pointer shadow-md ${
                isAudioActive
                  ? "bg-[#1877F2] text-white border-[#1877F2] ring-2 ring-[#1877F2]/30 animate-pulse"
                  : "bg-black/60 hover:bg-black/90 text-white border-white/25"
              }`}
              title={isAudioActive ? "Mute Reel" : "Unmute Reel"}
            >
              {isAudioActive ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
            </button>

            <button
              type="button"
              onClick={onTogglePlay}
              className="w-6 h-6 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/25 transition-all cursor-pointer shadow-md"
              title={isPaused ? "Play" : "Pause"}
            >
              {isPaused ? <Play className="w-2.5 h-2.5 ml-0.5" /> : <Pause className="w-2.5 h-2.5" />}
            </button>
          </div>
        </div>

        {/* Center Hover Play Button */}
        <div className="relative z-10 flex items-center justify-center my-auto pointer-events-none">
          <div className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl">
            <Play className="w-5 h-5 fill-white ml-0.5" />
          </div>
        </div>

        {/* Facebook Reels Right Action Rail (Clean, no fabricated metrics) */}
        <div className="absolute right-1 sm:right-2 bottom-14 z-20 flex flex-col items-center gap-2.5 text-white">
          {/* Interactive ThumbsUp Button */}
          <button
            type="button"
            onClick={onToggleLike}
            className="flex flex-col items-center cursor-pointer group/thumb transition-transform active:scale-125"
            title="Like this Concept"
          >
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center backdrop-blur-md border transition-all ${
                isLiked
                  ? "bg-[#1877F2] border-[#1877F2] shadow-[0_0_10px_rgba(24,119,242,0.6)]"
                  : "bg-black/40 border-white/10 group-hover/thumb:bg-[#1877F2]/40"
              }`}
            >
              <ThumbsUp className="w-3.5 h-3.5 text-white drop-shadow" />
            </div>
            <span className={`text-[7px] sm:text-[8px] font-mono mt-0.5 font-bold ${isLiked ? "text-[#1877F2]" : "text-white"}`}>
              {isLiked ? "Liked" : "Like"}
            </span>
          </button>

          <div className="flex flex-col items-center pointer-events-none opacity-85">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <MessageCircle className="w-3.5 h-3.5 text-white drop-shadow" />
            </div>
          </div>

          <div className="flex flex-col items-center pointer-events-none opacity-85">
            <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <Send className="w-3.5 h-3.5 text-white drop-shadow" />
            </div>
          </div>

          <div className="flex flex-col items-center pointer-events-none opacity-85">
            <div className="w-5 h-5 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
              <MoreHorizontal className="w-2.5 h-2.5 text-white" />
            </div>
          </div>
        </div>

        {/* Facebook Reels Bottom Info & CTA */}
        <div className="relative z-10 p-2 sm:p-2.5 pr-8 pointer-events-none">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-4 h-4 rounded-full overflow-hidden flex items-center justify-center shrink-0">
              <BrandMonogram name={ad.brandName} category={ad.category} />
            </div>
            <span className="font-heading font-bold text-white text-[9px] sm:text-[10px] truncate max-w-[120px]">
              {ad.brandHandle}
            </span>
            <span className="px-1.5 py-0.2 rounded bg-white/20 text-[6px] sm:text-[7px] font-mono uppercase tracking-wider text-slate-200">
              {ad.statBadge === "Client Showcase" ? "Client Ad" : "Concept Ad"}
            </span>
          </div>
          <p className="text-white text-[8px] sm:text-[9px] font-normal leading-tight line-clamp-2 mb-1.5">
            {ad.title}
          </p>
          <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md bg-[#1877F2] text-white text-[8px] font-heading font-bold shadow-sm">
            <span>Learn More</span>
            <ArrowUpRight className="w-2.5 h-2.5" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StudioAdCarousel() {
  const { openContactModal } = useContactModal();
  const [selectedAd, setSelectedAd] = useState<AdShowcaseItem | null>(null);
  const [modalMuted, setModalMuted] = useState(true);

  // Interactive Carousel State
  const [isAutoScrolling, setIsAutoScrolling] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const [activePlatform, setActivePlatform] = useState<PlatformFilter>("all");
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("all");
  const [likedAdIds, setLikedAdIds] = useState<Set<string>>(new Set());
  const [activeAudioAdId, setActiveAudioAdId] = useState<string | null>(null);
  const [pausedAdIds, setPausedAdIds] = useState<Set<string>>(new Set());

  const scrollRef = useRef<HTMLDivElement>(null);
  const ads: AdShowcaseItem[] = studioData.adShowcases;

  // Manual Swipe / Scroll Buttons
  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -300 : 300;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  // Toggle Like
  const handleToggleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setLikedAdIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Toggle In-Phone Audio (only one phone sounds at a time)
  const handleToggleAudio = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveAudioAdId((prev) => (prev === id ? null : id));
  };

  // Toggle In-Phone Play/Pause
  const handleTogglePlay = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setPausedAdIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  // Check card match for category filter
  const isCategoryMatch = (category: string) => {
    if (activeCategory === "all") return true;
    if (activeCategory === "golf") {
      return (category.includes("Golf") || category.includes("Sports")) && !category.includes("Dance") && !category.includes("Movement");
    }
    if (activeCategory === "outdoor") {
      return category.includes("Outdoor");
    }
    if (activeCategory === "dance") {
      return category.includes("Dance") || category.includes("Movement");
    }
    if (activeCategory === "beauty") {
      return category.includes("Beauty");
    }
    if (activeCategory === "food") {
      return category.includes("Food") || category.includes("Dining");
    }
    return true;
  };

  // Filter ads based on active category and platform
  const filteredAds = ads.filter((ad, idx) => {
    const isTikTok = ad.platform ? ad.platform === "tiktok" : idx % 2 === 0;
    const matchesCategory = isCategoryMatch(ad.category);
    const matchesPlatform =
      activePlatform === "all" ||
      (activePlatform === "tiktok" && isTikTok) ||
      (activePlatform === "meta" && !isTikTok);
    return matchesCategory && matchesPlatform;
  });

  const isFiltered = activeCategory !== "all" || activePlatform !== "all";
  const displayAds = filteredAds;

  // Scroll back to start when filter changes
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = 0;
    }
  }, [activeCategory, activePlatform]);

  // Continuous Smooth Auto-scroll with pause on hover/interaction (only when viewing all niches)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    if (isFiltered) return;

    let animId: number;
    const step = () => {
      if (isAutoScrolling && !isHovered && !activeAudioAdId) {
        el.scrollLeft += 0.8;
        // Seamless loop reset when halfway
        if (el.scrollLeft >= el.scrollWidth / 2) {
          el.scrollLeft = 0;
        }
      }
      animId = requestAnimationFrame(step);
    };

    animId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animId);
  }, [isAutoScrolling, isHovered, activeAudioAdId, isFiltered, displayAds]);

  return (
    <section id="studio-reels" className="relative w-full py-16 sm:py-24 bg-[#090D16] text-white overflow-hidden select-none">
      {/* Top Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#7F48ED]/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 sm:mb-10">
        <MotionWrapper direction="up" distance={20} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7F48ED]/20 border border-[#7F48ED]/40 text-[#A78BFA] text-[10px] font-mono font-bold uppercase tracking-widest mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Creative Ad Showcase</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight mb-3">
            Built for Meta Reels &amp; TikTok.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal mb-2">
            Every ad is engineered for 9:16 vertical viewports, aggressive 3-second hook retention, and direct conversion. Click any video to test.
          </p>

          {/* Illustrative Concept Disclaimer Pill */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/[0.05] border border-white/10 text-slate-300 text-[10px] font-mono mb-6">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Concept samples produced for creative illustration · Zero fabricated metrics</span>
          </div>

          {/* Primary Niche Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "all"
                  ? "bg-white text-slate-900 shadow-md scale-105"
                  : "bg-white/[0.07] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/10"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>All Niches ({ads.length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("golf")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "golf"
                  ? "bg-emerald-500 text-white shadow-md shadow-emerald-500/30 scale-105"
                  : "bg-white/[0.07] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/10"
              }`}
            >
              <Target className="w-3.5 h-3.5" />
              <span>Golf &amp; Sports ({ads.filter((a) => (a.category.includes("Golf") || a.category.includes("Sports")) && !a.category.includes("Dance") && !a.category.includes("Movement")).length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("outdoor")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "outdoor"
                  ? "bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 scale-105"
                  : "bg-white/[0.07] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/10"
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Outdoor &amp; Adventure ({ads.filter((a) => a.category.includes("Outdoor")).length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("dance")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "dance"
                  ? "bg-purple-600 text-white shadow-md shadow-purple-600/30 scale-105"
                  : "bg-white/[0.07] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/10"
              }`}
            >
              <Music className="w-3.5 h-3.5" />
              <span>Dance &amp; Movement ({ads.filter((a) => a.category.includes("Dance") || a.category.includes("Movement")).length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("beauty")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "beauty"
                  ? "bg-rose-500 text-white shadow-md shadow-rose-500/30 scale-105"
                  : "bg-white/[0.07] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/10"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Clean Beauty ({ads.filter((a) => a.category.includes("Beauty")).length})</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveCategory("food")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeCategory === "food"
                  ? "bg-orange-500 text-white shadow-md shadow-orange-500/30 scale-105"
                  : "bg-white/[0.07] text-slate-300 hover:text-white hover:bg-white/[0.12] border border-white/10"
              }`}
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>Food &amp; Dining ({ads.filter((a) => a.category.includes("Food") || a.category.includes("Dining")).length})</span>
            </button>
          </div>

          {/* Platform Filters & Motion Controls */}
          <div className="flex flex-wrap items-center justify-center gap-2.5">
            <div className="inline-flex items-center p-1 rounded-xl bg-white/[0.06] border border-white/10 backdrop-blur-md">
              <button
                type="button"
                onClick={() => setActivePlatform("all")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${
                  activePlatform === "all"
                    ? "bg-[#7F48ED] text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                All Formats
              </button>
              <button
                type="button"
                onClick={() => setActivePlatform("tiktok")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePlatform === "tiktok"
                    ? "bg-[#FE2C55] text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#FE2C55]" />
                TikTok
              </button>
              <button
                type="button"
                onClick={() => setActivePlatform("meta")}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  activePlatform === "meta"
                    ? "bg-[#1877F2] text-white shadow-md"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2]" />
                Meta Reels
              </button>
            </div>

            {/* Play/Pause Motion Toggle */}
            <button
              type="button"
              onClick={() => setIsAutoScrolling(!isAutoScrolling)}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-mono text-slate-300 hover:text-white transition-all cursor-pointer backdrop-blur-md"
              title={isAutoScrolling ? "Pause Autoplay" : "Resume Autoplay"}
            >
              {isAutoScrolling ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-[#A78BFA]" />
                  <span>Motion: On</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Motion: Paused</span>
                </>
              )}
            </button>
          </div>
        </MotionWrapper>
      </div>

      {/* Interactive Carousel Body with Manual Swipe Arrows */}
      <div
        className="relative w-full group/carousel"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Left Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll("left")}
          className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-80 group-hover/carousel:opacity-100"
          aria-label="Previous Reels"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Right Arrow Button */}
        <button
          type="button"
          onClick={() => handleScroll("right")}
          className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-11 h-11 sm:w-13 sm:h-13 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 backdrop-blur-xl flex items-center justify-center shadow-[0_10px_30px_rgba(0,0,0,0.6)] hover:scale-105 active:scale-95 transition-all cursor-pointer opacity-80 group-hover/carousel:opacity-100"
          aria-label="Next Reels"
        >
          <ChevronRight className="w-6 h-6" />
        </button>

        {/* Left & Right Subtle Fade Overlays */}
        <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-24 z-20 pointer-events-none bg-gradient-to-r from-[#090D16] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-24 z-20 pointer-events-none bg-gradient-to-l from-[#090D16] to-transparent" />

        {/* Horizontally Scrollable Reel Track */}
        <div
          ref={scrollRef}
          className={`flex w-full overflow-x-auto no-scrollbar scroll-smooth py-8 px-6 sm:px-12 select-none ${
            isFiltered ? "justify-start md:justify-center" : "cursor-grab active:cursor-grabbing"
          }`}
        >
          {/* Main Track (Unique distinct ads with zero duplication) */}
          <div className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8">
            {displayAds.map((ad, idx) => {
              const isTikTok = ad.platform ? ad.platform === "tiktok" : idx % 2 === 0;
              return (
                <StudioPhoneCard
                  key={`ad-main-${ad.id}`}
                  ad={ad}
                  idx={isTikTok ? 0 : 1}
                  isLiked={likedAdIds.has(`main-${ad.id}`)}
                  onToggleLike={(e) => handleToggleLike(`main-${ad.id}`, e)}
                  isAudioActive={activeAudioAdId === `main-${ad.id}`}
                  onToggleAudio={(e) => handleToggleAudio(`main-${ad.id}`, e)}
                  isPaused={pausedAdIds.has(`main-${ad.id}`)}
                  onTogglePlay={(e) => handleTogglePlay(`main-${ad.id}`, e)}
                  onOpenModal={() => setSelectedAd(ad)}
                  isDimmed={false}
                />
              );
            })}
          </div>

          {/* Loop 2 rendered strictly when viewing All Niches for seamless continuous marquee */}
          {!isFiltered && (
            <div className="flex items-center gap-6 sm:gap-8 shrink-0 pr-6 sm:pr-8" aria-hidden="true">
              {displayAds.map((ad, idx) => {
                const isTikTok = ad.platform ? ad.platform === "tiktok" : (displayAds.length + idx) % 2 === 0;
                return (
                  <StudioPhoneCard
                    key={`ad-loop2-${ad.id}`}
                    ad={ad}
                    idx={isTikTok ? 0 : 1}
                    isLiked={likedAdIds.has(`loop2-${ad.id}`)}
                    onToggleLike={(e) => handleToggleLike(`loop2-${ad.id}`, e)}
                    isAudioActive={activeAudioAdId === `loop2-${ad.id}`}
                    onToggleAudio={(e) => handleToggleAudio(`loop2-${ad.id}`, e)}
                    isPaused={pausedAdIds.has(`loop2-${ad.id}`)}
                    onTogglePlay={(e) => handleTogglePlay(`loop2-${ad.id}`, e)}
                    onOpenModal={() => setSelectedAd(ad)}
                    isDimmed={false}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Interactive Modal Video Preview */}
      {selectedAd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#111726] border border-white/15 rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row">
            {/* Close Button */}
            <button
              onClick={() => setSelectedAd(null)}
              className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Video Player Column (9:16 frame) */}
            <div className="relative md:w-1/2 bg-black flex items-center justify-center p-4">
              <div className="relative w-[260px] sm:w-[280px] h-[480px] sm:h-[500px] rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
                <video
                  src={selectedAd.videoSrc}
                  autoPlay
                  loop
                  muted={modalMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={() => setModalMuted(!modalMuted)}
                  className="absolute bottom-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                >
                  {modalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Details & CTA Column */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 rounded-full bg-[#7F48ED]/20 text-[#A78BFA] text-[11px] font-mono font-bold uppercase">
                    {selectedAd.category}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-[11px] font-mono font-bold">
                    {selectedAd.statBadge}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-heading font-black text-white mb-2">
                  {selectedAd.title}
                </h3>
                <p className="text-xs font-mono text-[#A78BFA] font-bold mb-4">
                  Hook Strategy: {selectedAd.hookType}
                </p>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
                  {selectedAd.description}
                </p>

                <div className="p-4 rounded-xl bg-white/[0.04] border border-white/10 space-y-2 mb-6">
                  <div className="text-[11px] text-slate-300 flex items-center justify-between">
                    <span className="font-mono text-slate-400">Brand / Account</span>
                    <span className="font-bold text-white">{selectedAd.brandName} ({selectedAd.brandHandle})</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center justify-between">
                    <span className="font-mono text-slate-400">Platform Optimized</span>
                    <span className="font-bold text-white">Instagram Reels &amp; TikTok</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center justify-between">
                    <span className="font-mono text-slate-400">Creative Production</span>
                    <span className="font-bold text-[#A78BFA]">Fresh Weekly Creative Drop</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedAd(null);
                    openContactModal({
                      intent: "start-project",
                      serviceInterest: "ReLaunch Studio",
                      notes: `Interested in video ad concepts like ${selectedAd.title} (${selectedAd.category}).`,
                    });
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-[#7F48ED] hover:bg-[#6B38D4] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-98 cursor-pointer"
                >
                  <span>Build Ads Like This For My Brand</span>
                  <ArrowUpRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedAd(null)}
                  className="w-full text-center text-xs font-mono text-slate-400 hover:text-white transition-colors cursor-pointer"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
