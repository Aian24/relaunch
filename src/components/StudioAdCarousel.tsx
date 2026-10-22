"use client";

import React, { useState } from "react";
import { AdShowcaseItem, studioData } from "@/data/studioSubBrand";
import { Play, Pause, Volume2, VolumeX, Sparkles, X, ArrowUpRight, Zap } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";

export default function StudioAdCarousel() {
  const { openContactModal } = useContactModal();
  const [selectedAd, setSelectedAd] = useState<AdShowcaseItem | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  const ads = studioData.adShowcases;

  return (
    <section className="relative w-full py-16 sm:py-24 bg-[#090D16] text-white overflow-hidden select-none border-y border-white/[0.08]">
      {/* Top Ambience */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#7F48ED]/15 rounded-full blur-[140px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <MotionWrapper direction="up" distance={20} className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#7F48ED]/20 border border-[#7F48ED]/40 text-[#A78BFA] text-[10px] font-mono font-bold uppercase tracking-widest mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Creative Ad Showcase</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight mb-3">
            Built for Meta Reels &amp; TikTok.
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            Every ad is engineered for 9:16 vertical viewports, aggressive 3-second hook retention, and direct conversion. Click any video to test.
          </p>
        </MotionWrapper>
      </div>

      {/* Infinite Scrolling Ticker (Savannah Sanchez style) */}
      <div className="relative w-full overflow-hidden">
        {/* Left & Right Fade Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-32 z-10 pointer-events-none bg-gradient-to-r from-[#090D16] to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-32 z-10 pointer-events-none bg-gradient-to-l from-[#090D16] to-transparent" />

        <div className="flex w-max animate-ticker hover:[animation-play-state:paused] py-4">
          {/* First loop */}
          <div className="flex items-center gap-6 sm:gap-8 px-4 shrink-0">
            {ads.map((ad, idx) => (
              <div
                key={`ad-loop-1-${idx}`}
                onClick={() => setSelectedAd(ad)}
                className="group relative w-[240px] sm:w-[280px] h-[400px] sm:h-[460px] rounded-3xl overflow-hidden bg-slate-900 border border-white/10 hover:border-[#7F48ED] shadow-xl hover:shadow-[0_10px_35px_rgba(127,72,237,0.35)] transition-all duration-300 cursor-pointer flex flex-col justify-between p-4"
              >
                {/* Background Video */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <video
                    src={ad.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-[#090D16]/60" />
                </div>

                {/* Center Hover Play Button */}
                <div className="relative z-10 flex items-center justify-center my-auto">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Information (Clean and Minimal) */}
                <div className="relative z-10 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <h3 className="text-xs font-heading font-bold text-white line-clamp-1">
                    {ad.title}
                  </h3>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#A78BFA] shrink-0 ml-1.5 opacity-80 group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>

          {/* Second loop for infinite scroll */}
          <div className="flex items-center gap-6 sm:gap-8 px-4 shrink-0" aria-hidden="true">
            {ads.map((ad, idx) => (
              <div
                key={`ad-loop-2-${idx}`}
                onClick={() => setSelectedAd(ad)}
                className="group relative w-[240px] sm:w-[280px] h-[400px] sm:h-[460px] rounded-3xl overflow-hidden bg-slate-900 border border-white/10 hover:border-[#7F48ED] shadow-xl hover:shadow-[0_10px_35px_rgba(127,72,237,0.35)] transition-all duration-300 cursor-pointer flex flex-col justify-between p-4"
              >
                {/* Background Video */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <video
                    src={ad.videoSrc}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700 opacity-80 group-hover:opacity-100"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090D16] via-transparent to-[#090D16]/60" />
                </div>

                {/* Center Hover Play Button */}
                <div className="relative z-10 flex items-center justify-center my-auto">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 shadow-xl">
                    <Play className="w-5 h-5 fill-white ml-0.5" />
                  </div>
                </div>

                {/* Bottom Information (Clean and Minimal) */}
                <div className="relative z-10 p-2.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 flex items-center justify-between">
                  <h3 className="text-xs font-heading font-bold text-white line-clamp-1">
                    {ad.title}
                  </h3>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#A78BFA] shrink-0 ml-1.5 opacity-80 group-hover:opacity-100" />
                </div>
              </div>
            ))}
          </div>
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
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Sound Toggle */}
                <button
                  type="button"
                  onClick={() => setIsMuted(!isMuted)}
                  className="absolute bottom-4 right-4 z-10 w-8 h-8 rounded-full bg-black/60 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                >
                  {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
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
                    <span className="font-mono text-slate-400">Platform</span>
                    <span className="font-bold text-white">Instagram Reels &amp; TikTok</span>
                  </div>
                  <div className="text-[11px] text-slate-300 flex items-center justify-between">
                    <span className="font-mono text-slate-400">Turnaround</span>
                    <span className="font-bold text-[#A78BFA]">Fresh Batch Every Week</span>
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
