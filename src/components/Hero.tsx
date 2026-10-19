"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useContactModal } from "@/context/ContactModalContext";
import MotionWrapper from "@/components/MotionWrapper";
import HeroScrollIndicator from "@/components/HeroScrollIndicator";
import { ArrowUpRight, ArrowRight, ShieldCheck } from "lucide-react";

const HOMEPAGE_VIDEOS = ["/relaunch-hero4.mp4", "/relaunch-hero3.mp4"];

export default function Hero() {
  const { openContactModal } = useContactModal();
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const videoRefs = [videoRef0, videoRef1];

  useEffect(() => {
    const currentRef = videoRefs[activeVideoIdx].current;
    if (currentRef) {
      currentRef.currentTime = 0;
      currentRef.playbackRate = 0.65;
      currentRef.play().catch(() => {});
    }
  }, [activeVideoIdx]);

  const handleVideoEnded = () => {
    setActiveVideoIdx((prev) => (prev + 1) % HOMEPAGE_VIDEOS.length);
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center pt-32 sm:pt-36 pb-20 sm:pb-24 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      {/* 1. HD Hero Background Videos (relaunch-hero4.mp4 first, followed by relaunch-hero3.mp4) */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {HOMEPAGE_VIDEOS.map((src, idx) => (
          <video
            key={src}
            ref={videoRefs[idx]}
            src={src}
            autoPlay={idx === 0}
            muted
            playsInline
            onEnded={handleVideoEnded}
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 0.65;
            }}
            onPlay={(e) => {
              e.currentTarget.playbackRate = 0.65;
            }}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 brightness-110 contrast-105 saturate-110 ${
              activeVideoIdx === idx ? "opacity-100 z-1" : "opacity-0 z-0"
            }`}
          />
        ))}
        {/* Crisp balanced overlay: reduced black so video is luminous & HD */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/30 via-transparent to-[#07090E]/65 z-2" />
        {/* Targeted Center Radial Scrim: lightened to eliminate heavy black fog while preserving contrast */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(7,9,14,0.40)_0%,rgba(7,9,14,0.15)_60%,transparent_100%)] z-2 pointer-events-none" />
        {/* Subtle luminous ambient accents */}
        <div className="absolute top-1/3 right-10 w-[360px] h-[360px] bg-[#FF6700]/10 rounded-full blur-[100px] z-2 pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[360px] h-[360px] bg-[#7F48ED]/15 rounded-full blur-[100px] z-2 pointer-events-none" />
      </div>

      {/* 2. Hero Content Container (Centered layout matching all other pages) */}
      <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center my-auto flex flex-col items-center">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold mb-4 px-4 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-[#FF6700]/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all">
          HELPING SMALL BUSINESSES GROW SINCE 2008 · U.S., CANADA, UK &amp; AUSTRALIA
        </span>

        <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
          Marketing Strategically <span className="text-[#FF6700] drop-shadow-[0_4px_24px_rgba(255,103,0,0.45)]">Designed to Sell.</span>
        </h1>

        <p className="text-white/95 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-medium">
          Websites, social media, ads, AI search and custom software for small businesses. Built to bring in more customers, with results you can see in your numbers.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_30px_rgba(255,103,0,0.45)] hover:shadow-[0_0_40px_rgba(255,103,0,0.6)] cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <span>Book a Strategy Call</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </button>

          <Link
            href="/work"
            className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] border border-white/20 hover:border-white/45 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] cursor-pointer whitespace-nowrap group"
          >
            <span>See our work</span>
            <ArrowRight className="w-4 h-4 text-[#FF6700] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust Line Protected Pill - Frosted Glass Effect */}
        <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-200 font-mono px-4 sm:px-6 py-2.5 rounded-full bg-white/[0.07] border border-white/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] mx-auto">
          <ShieldCheck className="w-4 h-4 text-[#7F48ED] shrink-0" />
          <span className="text-center">Month-to-month · You own everything · <span className="whitespace-nowrap">(480) 779-9875</span></span>
        </div>
      </MotionWrapper>

      {/* 3. Reusable Animated Scroll Down Indicator */}
      <HeroScrollIndicator targetId="how-we-help" />
    </section>
  );
}
