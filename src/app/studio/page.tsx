"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
import HeroScrollIndicator from "@/components/HeroScrollIndicator";
import StudioAdCarousel from "@/components/StudioAdCarousel";
import { useContactModal } from "@/context/ContactModalContext";
import { studioData } from "@/data/studioSubBrand";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Sparkles,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Zap,
  Check,
  Share2,
  Heart,
  MessageCircle,
  Bookmark,
  ThumbsUp,
  Send,
  MoreHorizontal,
  Search,
  Music,
} from "lucide-react";

const STUDIO_CTA = "Start with ReLaunch Studio";
const ACCENT = "#7F48ED";

interface HeroPreviewHook {
  id: string;
  label: string;
  hookTitle: string;
  videoSrc: string;
  metric: string;
}

const HERO_HOOKS: HeroPreviewHook[] = [
  {
    id: "hook-1",
    label: "Hook 1: Direct Problem",
    hookTitle: "Stop Scrolling If Your CPA Keeps Climbing",
    videoSrc: "/videos/chicago-dog-social-1.mp4",
    metric: "+184% Hook CTR",
  },
  {
    id: "hook-2",
    label: "Hook 2: Split Screen",
    hookTitle: "Traditional Video Shoots vs. AI Video Drops",
    videoSrc: "/videos/chicago-dog-social-2.mp4",
    metric: "3.2x Meta ROAS",
  },
  {
    id: "hook-3",
    label: "Hook 3: 3 Reasons Why",
    hookTitle: "3 Hidden Reasons Why Your Meta Ads Are Dying",
    videoSrc: "/videos/chicago-dog-social-3.mp4",
    metric: "-38% Cost Per Sale",
  },
];

export default function StudioPage() {
  const { openContactModal } = useContactModal();

  // Hero Phone State
  const [activeHook, setActiveHook] = useState<HeroPreviewHook>(HERO_HOOKS[0]);
  const [isHeroMuted, setIsHeroMuted] = useState(true);
  const [isHeroPlaying, setIsHeroPlaying] = useState(true);
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const toggleHeroPlay = () => {
    if (heroVideoRef.current) {
      if (isHeroPlaying) {
        heroVideoRef.current.pause();
        setIsHeroPlaying(false);
      } else {
        heroVideoRef.current.play();
        setIsHeroPlaying(true);
      }
    }
  };

  const toggleHeroMute = () => {
    if (heroVideoRef.current) {
      heroVideoRef.current.muted = !isHeroMuted;
      setIsHeroMuted(!isHeroMuted);
    }
  };

  const handleSelectHook = (hook: HeroPreviewHook) => {
    setActiveHook(hook);
    setIsHeroPlaying(true);
    if (heroVideoRef.current) {
      heroVideoRef.current.currentTime = 0;
      heroVideoRef.current.play().catch(() => {});
    }
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center pt-32 sm:pt-36 pb-20 sm:pb-24 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(127,72,237,0.22),transparent_75%)]" />
          <div
            className="absolute top-1/4 right-1/4 w-[500px] h-[400px] rounded-full blur-[140px] pointer-events-none"
            style={{ backgroundColor: `${ACCENT}25` }}
          />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-7xl mx-auto w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Column (6 cols) */}
            <div className="lg:col-span-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] border border-white/15 text-[#A78BFA] text-xs font-mono uppercase tracking-widest font-bold mb-4 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
                <span>AI Paid Social Creative</span>
              </div>

              <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4">
                Fresh video ads. <br className="hidden sm:inline" />
                <span style={{ color: ACCENT }}>Every single week.</span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed mb-6 font-normal">
                Weekly AI-powered video ads for Meta and TikTok. We test multiple hooks to lower your ad costs—no filming needed.
              </p>

              {/* Stats Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
                {studioData.stats.map((s, idx) => (
                  <div key={idx} className="text-center lg:text-left">
                    <div className="font-heading font-black text-xl sm:text-2xl text-white">
                      {s.value}
                      <span style={{ color: ACCENT }}>{s.suffix}</span>
                    </div>
                    <div className="text-[11px] font-mono text-slate-400 font-medium leading-tight">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  type="button"
                  onClick={() =>
                    openContactModal({
                      intent: "strategy-session",
                      serviceInterest: "ReLaunch Studio",
                      notes: "Interested in the weekly AI video ad subscription.",
                    })
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:brightness-110 active:scale-98 cursor-pointer"
                  style={{ backgroundColor: ACCENT }}
                >
                  <span>{STUDIO_CTA}</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </button>

                <button
                  type="button"
                  onClick={() => handleScrollToSection("how-it-works")}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>See How It Works ↓</span>
                </button>
              </div>

              {/* Compliance Sub-label */}
              <div className="flex items-center justify-center lg:justify-start gap-3 mt-5 text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Meta &amp; TikTok Compliant</span>
                </span>
                <span>•</span>
                <span>Runs in Your Own Ad Accounts</span>
              </div>
            </div>

            {/* Right Column: Dual Slanted Smartphones Side-by-Side (TikTok & Facebook Reels UIs) */}
            <div className="lg:col-span-6 flex flex-col items-center justify-center mt-6 lg:mt-0">
              <div className="flex items-center justify-center gap-3 sm:gap-5 w-full max-w-[500px] pt-4 pb-2">
                {/* Phone 1: TikTok UI (Left Slanted -4deg) */}
                <div className="w-[165px] sm:w-[215px] lg:w-[230px] aspect-[9/16] rounded-[34px] sm:rounded-[38px] p-2 sm:p-2.5 bg-gradient-to-b from-slate-800 via-slate-900 to-black shadow-[0_20px_50px_rgba(0,0,0,0.75),0_0_30px_rgba(127,72,237,0.2)] border border-white/20 transform -rotate-3 sm:-rotate-5 hover:rotate-0 transition-all duration-300 relative flex flex-col justify-between">
                  {/* Top Platform Tag */}
                  <div className="absolute -top-3 left-3 sm:left-4 z-30 px-2.5 py-0.5 sm:py-1 rounded-lg bg-black text-white border border-white/20 text-[9px] font-mono font-bold uppercase shadow-md whitespace-nowrap">
                    TikTok Ad
                  </div>

                  {/* Screen Content */}
                  <div className="relative w-full h-full rounded-[26px] sm:rounded-[30px] overflow-hidden bg-black flex flex-col justify-between">
                    <video
                      src={activeHook.id === "hook-2" ? "/videos/chicago-dog-social-3.mp4" : "/videos/chicago-dog-social-2.mp4"}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

                    {/* TikTok Top Nav: Following | For You */}
                    <div className="relative z-10 px-3 pt-3 flex items-center justify-between text-white">
                      <div className="w-10 h-2 bg-black/80 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1.5" />
                      <div className="flex items-center gap-2 text-slate-300 mx-auto text-[8px] sm:text-[9px]">
                        <span className="opacity-70">Following</span>
                        <span className="text-white font-bold border-b-2 border-white pb-0.5">For You</span>
                      </div>
                      <Search className="w-3 h-3 text-white absolute right-3 top-3 opacity-80" />
                    </div>

                    {/* TikTok Right Action Rail */}
                    <div className="absolute right-1 sm:right-2 bottom-12 z-20 flex flex-col items-center gap-2 text-white">
                      {/* Creator Avatar with ReLaunch Logo & '+' Badge */}
                      <div className="relative mb-0.5">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-gradient-to-tr from-[#FE2C55] to-[#25F4EE] p-0.5 shadow-md">
                          <div className="w-full h-full rounded-full bg-black overflow-hidden flex items-center justify-center p-0.5">
                            <Image
                              src="/logos/logo-mark.png"
                              alt="ReLaunch Logo"
                              width={24}
                              height={24}
                              className="w-full h-full object-contain"
                            />
                          </div>
                        </div>
                        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-[#FE2C55] text-white flex items-center justify-center text-[8px] font-bold">
                          +
                        </div>
                      </div>

                      {/* Heart Like */}
                      <div className="flex flex-col items-center">
                        <Heart className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white drop-shadow" />
                        <span className="text-[7px] sm:text-[8px] font-mono mt-0.5 font-bold">38.4K</span>
                      </div>

                      {/* Comment */}
                      <div className="flex flex-col items-center">
                        <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white drop-shadow" />
                        <span className="text-[7px] sm:text-[8px] font-mono mt-0.5 font-bold">412</span>
                      </div>

                      {/* Bookmark */}
                      <div className="flex flex-col items-center">
                        <Bookmark className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white drop-shadow" />
                        <span className="text-[7px] sm:text-[8px] font-mono mt-0.5 font-bold">1.8K</span>
                      </div>

                      {/* Share */}
                      <div className="flex flex-col items-center">
                        <Share2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white drop-shadow" />
                        <span className="text-[7px] sm:text-[8px] font-mono mt-0.5 font-bold">520</span>
                      </div>

                      {/* Rotating Vinyl Record with ReLaunch Logo */}
                      <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-slate-900 border-2 border-white/40 flex items-center justify-center animate-spin [animation-duration:5s] mt-0.5 overflow-hidden p-0.5">
                        <Image
                          src="/logos/logo-mark.png"
                          alt="ReLaunch Disc"
                          width={14}
                          height={14}
                          className="w-full h-full object-contain"
                        />
                      </div>
                    </div>

                    {/* TikTok Bottom Info */}
                    <div className="relative z-10 p-2 sm:p-2.5 pr-8">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <div className="w-3.5 h-3.5 rounded-full bg-black/60 border border-white/20 overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                          <Image
                            src="/logos/logo-mark.png"
                            alt="ReLaunch Logo"
                            width={14}
                            height={14}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-heading font-bold text-white text-[9px] sm:text-[10px]">
                          @relaunch.studio
                        </span>
                        <span className="px-1 py-0.2 rounded bg-white/20 text-[6px] sm:text-[7px] font-mono uppercase text-slate-200">
                          Sponsored
                        </span>
                      </div>
                      <p className="text-white text-[8px] sm:text-[9px] font-normal leading-tight line-clamp-2 mb-1">
                        Stop ad fatigue with weekly AI video drops. #ad #dtc
                      </p>
                      <div className="flex items-center gap-1 text-[7px] sm:text-[8px] font-mono text-slate-300">
                        <Music className="w-2 h-2 shrink-0" />
                        <span className="truncate">Original Sound - ReLaunch</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phone 2: Facebook Reels UI (Right Slanted +4deg, Interactive) */}
                <div className="w-[165px] sm:w-[215px] lg:w-[230px] aspect-[9/16] rounded-[34px] sm:rounded-[38px] p-2 sm:p-2.5 bg-gradient-to-b from-slate-700 via-slate-900 to-black shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(24,119,242,0.25)] border-2 border-[#1877F2]/60 transform rotate-3 sm:rotate-5 hover:rotate-0 transition-all duration-300 relative flex flex-col justify-between">
                  {/* Top Platform Tag */}
                  <div className="absolute -top-3 right-3 sm:right-4 z-30 px-2.5 py-0.5 sm:py-1 rounded-lg bg-[#1877F2] text-white text-[9px] font-mono font-bold uppercase shadow-md whitespace-nowrap">
                    Facebook Reels
                  </div>

                  {/* Screen Content */}
                  <div className="relative w-full h-full rounded-[26px] sm:rounded-[30px] overflow-hidden bg-black flex flex-col justify-between">
                    <video
                      ref={heroVideoRef}
                      src={activeHook.videoSrc}
                      autoPlay
                      loop
                      muted={isHeroMuted}
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

                    {/* Facebook Reels Top Bar */}
                    <div className="relative z-10 px-3 pt-3 flex items-center justify-between text-white">
                      <div className="w-10 h-2 bg-black/80 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1.5" />
                      <div className="flex items-center gap-1">
                        <span className="font-heading font-black text-white text-[10px] sm:text-[11px] tracking-tight">
                          Reels
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={toggleHeroMute}
                          className="w-5 h-5 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                          title={isHeroMuted ? "Unmute" : "Mute"}
                        >
                          {isHeroMuted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}
                        </button>
                        <button
                          type="button"
                          onClick={toggleHeroPlay}
                          className="w-5 h-5 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                          title={isHeroPlaying ? "Pause" : "Play"}
                        >
                          {isHeroPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 ml-0.5" />}
                        </button>
                      </div>
                    </div>

                    {/* Facebook Reels Right Action Rail */}
                    <div className="absolute right-1 sm:right-2 bottom-14 z-20 flex flex-col items-center gap-2 text-white">
                      {/* Thumbs Up Like */}
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <ThumbsUp className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-white drop-shadow" />
                        </div>
                        <span className="text-[7px] sm:text-[8px] font-mono mt-0.5 font-bold">19.2K</span>
                      </div>

                      {/* Comment */}
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <MessageCircle className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 text-white drop-shadow" />
                        </div>
                        <span className="text-[7px] sm:text-[8px] font-mono mt-0.5 font-bold">268</span>
                      </div>

                      {/* Send / Share */}
                      <div className="flex flex-col items-center">
                        <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <Send className="w-3.5 h-3.5 sm:w-3.5 sm:h-3.5 text-white drop-shadow" />
                        </div>
                        <span className="text-[7px] sm:text-[8px] font-mono mt-0.5 font-bold">340</span>
                      </div>

                      {/* More 3-Dots */}
                      <div className="flex flex-col items-center">
                        <div className="w-5 h-5 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                          <MoreHorizontal className="w-2.5 h-2.5 text-white" />
                        </div>
                      </div>
                    </div>

                    {/* Facebook Reels Bottom Info & CTA */}
                    <div className="relative z-10 p-2 sm:p-2.5 pr-8">
                      <div className="flex items-center gap-1.5 mb-1">
                        <div className="w-4 h-4 rounded-full bg-black border border-white/20 overflow-hidden flex items-center justify-center shrink-0 p-0.5">
                          <Image
                            src="/logos/logo-mark.png"
                            alt="ReLaunch Logo"
                            width={16}
                            height={16}
                            className="w-full h-full object-contain"
                          />
                        </div>
                        <span className="font-heading font-bold text-white text-[9px] sm:text-[10px]">
                          ReLaunch Studio
                        </span>
                        <span className="text-[7px] font-bold text-[#1877F2]">• Follow</span>
                      </div>
                      <p className="text-white text-[8px] sm:text-[9px] font-normal leading-tight line-clamp-1 mb-1.5">
                        &ldquo;{activeHook.hookTitle}&rdquo;
                      </p>

                      {/* Meta Reels CTA Button */}
                      <div className="w-full py-1 px-2 rounded-md bg-[#1877F2] text-white text-[8px] sm:text-[9px] font-heading font-bold flex items-center justify-between shadow-md">
                        <span>Learn More</span>
                        <ArrowRight className="w-2.5 h-2.5" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hook Switcher below both phones */}
              <div className="mt-4 w-full max-w-[420px] flex flex-col gap-1.5">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 text-center block">
                  Select a Hook to Preview Variations:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {HERO_HOOKS.map((h) => {
                    const isSelected = activeHook.id === h.id;
                    return (
                      <button
                        key={h.id}
                        type="button"
                        onClick={() => handleSelectHook(h)}
                        className={`px-2 py-2 rounded-xl text-[10px] font-mono font-bold uppercase tracking-wider transition-all cursor-pointer text-center border ${
                          isSelected
                            ? "bg-[#7F48ED] text-white border-[#7F48ED] shadow-md"
                            : "bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 border-white/10"
                        }`}
                      >
                        {h.label.split(":")[0]}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>

        {/* Scroll Indicator */}
        <HeroScrollIndicator targetId="studio-ad-examples" accentColor={ACCENT} />
      </section>

      {/* 2. Ad Examples Showcase Carousel */}
      <div id="studio-ad-examples">
        <StudioAdCarousel />
      </div>

      {/* 3. Problem Section: Traditional vs. ReLaunch Studio */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16]">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest font-bold block mb-2" style={{ color: ACCENT }}>
              WHY TRADITIONAL VIDEO FAILS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Ads wear out fast. Video shoots are too slow.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Traditional filming takes weeks. We deliver fresh batches every week with multiple hook tests.
            </p>
          </MotionWrapper>

          {/* Clean 2-Column Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* The Old Way */}
            <MotionWrapper direction="up" delay={0.05} distance={20}>
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-mono font-bold uppercase">
                      Traditional Video Agencies
                    </span>
                    <span className="text-xs font-mono text-slate-400">High Overhead</span>
                  </div>
                  <h3 className="font-heading font-black text-xl text-slate-900 mb-4">
                    {studioData.comparison.traditional.cost}
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                    {studioData.comparison.traditional.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-slate-200 text-[11px] font-mono text-slate-500">
                  Result: High ad costs and slow creative testing.
                </div>
              </div>
            </MotionWrapper>

            {/* ReLaunch Studio AI */}
            <MotionWrapper direction="up" delay={0.1} distance={20}>
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#7F48ED] shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7F48ED]/10 rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#7F48ED] text-white text-[10px] font-mono font-bold uppercase">
                      ReLaunch Studio AI
                    </span>
                    <span className="text-xs font-mono text-[#7F48ED] font-bold">85% Lower Cost</span>
                  </div>
                  <h3 className="font-heading font-black text-xl text-[#090D16] mb-4">
                    {studioData.comparison.relaunchStudio.cost}
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    {studioData.comparison.relaunchStudio.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#7F48ED] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-4 border-t border-purple-100 text-[11px] font-mono text-[#7F48ED] font-bold">
                  Result: Continuous testing, lower CPAs, and zero camera crews.
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* 4. Production Cadence: Weekly Sprint */}
      <section id="weekly-cadence" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest font-bold block mb-2" style={{ color: ACCENT }}>
              WEEKLY SPRINT CADENCE
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Monday to Friday. Fresh ads in your account.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studioData.workflowCadence.map((st, idx) => (
              <MotionWrapper key={st.step} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#7F48ED]/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-full bg-[#7F48ED]/10 text-[#7F48ED] font-mono font-bold text-xs flex items-center justify-center">
                        {st.step}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {st.day}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#090D16] mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {st.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-[10px] font-mono text-[#7F48ED] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Done For You</span>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Creator Whitelisting Section */}
      <section className="py-14 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto p-7 sm:p-10 rounded-3xl bg-white text-[#090D16] border border-slate-200/90 shadow-[0_4px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(127,72,237,0.08)] transition-all relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#7F48ED]/5 rounded-full blur-[90px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7F48ED]/10 border border-[#7F48ED]/20 text-[#7F48ED] text-[10px] font-mono font-bold uppercase mb-3">
                <Share2 className="w-3.5 h-3.5 text-[#7F48ED]" />
                <span>Optional Whitelisting</span>
              </div>
              <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] tracking-tight mb-2">
                Creator &amp; Publisher Whitelisting
              </h2>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 font-normal">
                Run Meta and TikTok Spark Ads through our verified creator and review publisher handles. Lowers ad costs by 20–40% and builds immediate trust.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-700 font-mono">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>20% to 40% lower CPMs</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>Instant 3rd-party trust</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>All sales track to your pixel</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-emerald-600 font-bold">✓</span>
                  <span>100% platform compliant</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex flex-col items-center sm:items-start lg:items-end justify-center">
              <button
                type="button"
                onClick={() =>
                  openContactModal({
                    intent: "start-project",
                    serviceInterest: "ReLaunch Studio",
                    notes: "Interested in Creator & Publisher Whitelisting.",
                  })
                }
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#7F48ED] hover:bg-[#6B38D4] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
              >
                <span>Ask About Whitelisting</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Transparent Retainer Pricing */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest font-bold block mb-2" style={{ color: ACCENT }}>
              SUBSCRIPTION TIERS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Clear Monthly Retainers. No Contracts.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Month-to-month. Pause or scale anytime as your ad budget changes.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {studioData.tiers.map((tier, idx) => (
              <MotionWrapper key={tier.id} direction="up" delay={idx * 0.08} distance={20}>
                <div
                  className={`h-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                    tier.popular
                      ? "bg-white border-2 border-[#7F48ED] shadow-2xl relative"
                      : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#7F48ED] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                        {tier.badge}
                      </span>
                      <h3 className="font-heading font-black text-xl text-[#090D16]">
                        {tier.name}
                      </h3>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="font-heading font-black text-3xl sm:text-4xl text-[#090D16]">
                          ${tier.price.toLocaleString()}
                        </span>
                        <span className="text-xs font-mono text-slate-500">/ month</span>
                      </div>
                      <div className="mt-1.5 text-xs font-mono text-[#7F48ED] font-bold">
                        {tier.cadence}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-5 border-y border-slate-100 py-2.5">
                      {tier.description}
                    </p>

                    {/* Deliverables List */}
                    <div className="space-y-2 mb-6">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Includes:
                      </span>
                      {tier.deliverables.map((d, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <Check className="w-4 h-4 text-[#7F48ED] shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        openContactModal({
                          intent: "start-project",
                          serviceInterest: `ReLaunch Studio (${tier.name})`,
                          notes: `Interested in the ${tier.name} tier ($${tier.price}/mo).`,
                        })
                      }
                      className={`w-full py-3.5 px-6 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 ${
                        tier.popular
                          ? "bg-[#7F48ED] hover:bg-[#6B38D4] text-white"
                          : "bg-slate-900 hover:bg-black text-white"
                      }`}
                    >
                      <span>Choose {tier.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-[10px] font-mono text-slate-400 text-center mt-2">
                      {tier.recommendedFor}
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Trust & Compliance Strip */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studioData.compliancePoints.map((cp, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#7F48ED] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-heading font-bold text-[#090D16] mb-0.5">
                  {cp.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-normal">
                  {cp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. How It Works (The Social Savannah Model, Powered by AI) */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200 scroll-mt-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-3">
              How it <span className="text-[#7F48ED]">Works</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Three simple steps. Fresh ads in your account every week.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left: The 3 Simple Steps */}
            <div className="lg:col-span-6 space-y-6 sm:space-y-7">
              {studioData.howItWorks.map((step, idx) => (
                <MotionWrapper key={step.stepNumber} direction="up" delay={idx * 0.08} distance={20}>
                  <div className="flex items-start gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#7F48ED]/40 transition-colors">
                    {/* Number Circle Badge (Savannah's circle count style) */}
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#7F48ED] text-white flex items-center justify-center font-heading font-black text-base sm:text-lg shadow-md shadow-[#7F48ED]/25 shrink-0">
                      {step.stepNumber}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#090D16]">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </MotionWrapper>
              ))}
            </div>

            {/* Right: One Single AI Studio Image */}
            <div className="lg:col-span-6">
              <MotionWrapper direction="up" delay={0.15} distance={25}>
                <div className="relative rounded-3xl overflow-hidden border border-slate-200 bg-slate-900 shadow-2xl group aspect-[4/3]">
                  <Image
                    src="/images/studio/weekly-production.jpg"
                    alt="ReLaunch AI Ad Studio Interface"
                    fill
                    sizes="(max-width: 1024px) 100vw, 550px"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                </div>
              </MotionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Final Call to Action */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#07090E] text-white text-center border-t border-white/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(127,72,237,0.25),transparent_70%)] pointer-events-none" />

        <MotionWrapper direction="up" distance={20} className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#A78BFA] text-[10px] font-mono font-bold uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Ready for Continuous Ad Testing?</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Stop losing sales to <span style={{ color: ACCENT }}>ad fatigue.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Book a 20-minute strategy call or run a free ad audit to see where you can lower your CPA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                openContactModal({
                  intent: "strategy-session",
                  serviceInterest: "ReLaunch Studio",
                  notes: "Booking a 20-minute ReLaunch Studio strategy call.",
                })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:brightness-110 active:scale-98 cursor-pointer"
              style={{ backgroundColor: ACCENT }}
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book Strategy Call</span>
            </button>

            <Link
              href="/audit#scanner"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all"
            >
              <span>Run Free Ad Audit →</span>
            </Link>
          </div>
        </MotionWrapper>
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
