"use client";

import React, { useState, useRef } from "react";
import {
  Share2,
  CheckCircle2,
  ArrowUpRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Heart,
  MessageCircle,
  Send,
  MoreHorizontal,
  Shield,
} from "lucide-react";
import { useContactModal } from "@/context/ContactModalContext";

export default function StudioWhitelistingSection() {
  const { openContactModal } = useContactModal();
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
        {/* Left Column: Clean Copy, Checklist, and Action */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7F48ED]/10 border border-[#7F48ED]/20 text-[#7F48ED] text-[10px] font-mono font-bold uppercase mb-3">
              <Share2 className="w-3.5 h-3.5 text-[#7F48ED]" />
              <span>Optional Whitelisting</span>
            </div>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight mb-3">
              Creator &amp; Publisher Whitelisting
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Run Meta and TikTok Spark Ads through our verified creator and review publisher handles. Lowers ad costs by up to 20–40% and builds immediate trust.
            </p>
          </div>

          {/* Clean 4 Whitelisting Benefits (No Boxes) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-slate-700 font-mono">
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-600 font-bold text-base">✓</span>
              <span>Up to 20% to 40% lower CPMs</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-600 font-bold text-base">✓</span>
              <span>Instant 3rd-party trust</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-600 font-bold text-base">✓</span>
              <span>All sales track to your pixel</span>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="text-emerald-600 font-bold text-base">✓</span>
              <span>Built to platform ad policies</span>
            </div>
          </div>

          {/* Action Button & Note */}
          <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
            <button
              type="button"
              onClick={() =>
                openContactModal({
                  intent: "start-project",
                  serviceInterest: "ReLaunch Studio",
                  notes: "Interested in Creator & Publisher Whitelisting.",
                })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#7F48ED] hover:bg-[#6B38D4] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
            >
              <span>Ask About Whitelisting</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>
            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>Runs directly in your Meta &amp; TikTok accounts</span>
            </div>
          </div>
        </div>

        {/* Right Column: Slanted Interactive Smartphone */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center py-6">
          <div className="relative w-full max-w-[260px] sm:max-w-[280px] transform rotate-3 sm:rotate-6 hover:rotate-0 transition-transform duration-500 group">
            {/* Outer Smartphone Frame */}
            <div className="w-full aspect-[9/16] rounded-[38px] p-2 sm:p-2.5 bg-gradient-to-b from-slate-800 via-slate-900 to-black shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_40px_rgba(127,72,237,0.25)] border-2 border-white/20 relative flex flex-col justify-between">
              {/* Floating Platform Pill */}
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-30 px-3 py-1 rounded-full bg-black text-white border border-white/25 text-[9px] font-mono font-bold uppercase shadow-lg flex items-center gap-1.5 whitespace-nowrap">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1877F2] animate-pulse" />
                <span>Whitelisted Concept Ad</span>
              </div>

              {/* Inner Screen */}
              <div className="relative w-full h-full rounded-[30px] overflow-hidden bg-black flex flex-col justify-between select-none">
                <video
                  ref={videoRef}
                  src="/videos/chicago-dog-social-2.mp4"
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-transparent to-black/60 pointer-events-none" />

                {/* Top Notch Dynamic Island */}
                <div className="w-12 h-2.5 bg-black/85 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-1.5 z-20 pointer-events-none" />

                {/* Phone Top Header with Audio / Play Controls */}
                <div className="relative z-10 px-3 pt-3 flex items-center justify-between text-white">
                  <span className="font-heading font-black text-white text-[10px] tracking-tight">
                    Reels
                  </span>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={toggleMute}
                      className="w-5 h-5 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                      title={isMuted ? "Unmute" : "Mute"}
                    >
                      {isMuted ? <VolumeX className="w-2.5 h-2.5" /> : <Volume2 className="w-2.5 h-2.5" />}
                    </button>
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="w-5 h-5 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center backdrop-blur-md border border-white/20 transition-all cursor-pointer"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? <Pause className="w-2.5 h-2.5" /> : <Play className="w-2.5 h-2.5 ml-0.5" />}
                    </button>
                  </div>
                </div>

                {/* Right Social Action Rail (Clean icons, no fabricated metrics) */}
                <div className="absolute right-2 bottom-16 z-20 flex flex-col items-center gap-2.5 text-white pointer-events-none opacity-85">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                      <Heart className="w-3.5 h-3.5 text-white drop-shadow" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                      <MessageCircle className="w-3.5 h-3.5 text-white drop-shadow" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                      <Send className="w-3.5 h-3.5 text-white drop-shadow" />
                    </div>
                  </div>

                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center">
                      <MoreHorizontal className="w-2.5 h-2.5 text-white" />
                    </div>
                  </div>
                </div>

                {/* Bottom Creator Info & Whitelisted Concept Banner */}
                <div className="relative z-10 p-3 pr-10 text-white">
                  {/* Creator Handle with Blue Checkmark */}
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-4 h-4 rounded-full bg-gradient-to-tr from-[#7F48ED] to-[#1877F2] flex items-center justify-center p-0.5 shrink-0">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center text-[7px] font-bold text-white">
                        ✓
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-heading font-bold text-[10px] text-white">
                        @verified.creator
                      </span>
                      <CheckCircle2 className="w-3 h-3 text-[#1877F2] fill-[#1877F2] text-white shrink-0" />
                    </div>
                    <span className="px-1.5 py-0.2 rounded bg-white/20 text-[7px] font-mono uppercase tracking-wider text-slate-200">
                      Whitelisted Concept
                    </span>
                  </div>

                  {/* Reel Caption */}
                  <p className="text-[9px] text-slate-200 leading-tight line-clamp-2 mb-2 font-normal">
                    Creator whitelisted ad in action: authentic creator hook paired with your client footage. Built for high retention and ad policy compliance.
                  </p>

                  {/* Whitelisted Direct CTA Button */}
                  <div className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-[#1877F2] text-white text-[9px] font-heading font-bold shadow-md">
                    <span>Shop with Creator Code</span>
                    <ArrowUpRight className="w-2.5 h-2.5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
