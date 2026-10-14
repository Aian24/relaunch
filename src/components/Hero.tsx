"use client";

import React, { useRef, useEffect } from "react";
import Link from "next/link";
import { useContactModal } from "@/context/ContactModalContext";
import MotionWrapper from "@/components/MotionWrapper";
import { ArrowUpRight, ArrowRight, ShieldCheck } from "lucide-react";

export default function Hero() {
  const { openContactModal } = useContactModal();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.7;
    }
  }, []);

  return (
    <section
      id="hero"
      className="relative w-full pt-36 sm:pt-44 pb-16 sm:pb-24 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
    >
      {/* 1. Hero Background Video with Cinematic Atmospheric Overlays */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <video
          ref={videoRef}
          src="/relaunch-hero.mp4"
          autoPlay
          muted
          loop
          playsInline
          onLoadedMetadata={(e) => {
            e.currentTarget.playbackRate = 0.7;
          }}
          className="absolute inset-0 w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/75 via-[#07090E]/40 to-[#07090E]" />
        <div className="absolute top-1/4 right-1/4 w-[450px] h-[350px] bg-[#FF6700]/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-[#7F48ED]/20 rounded-full blur-[140px]" />
      </div>

      {/* 2. Hero Content Container (Centered layout matching all other pages) */}
      <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center">
        <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold mb-3">
          MARKETING &amp; DIGITAL SERVICES · EST. 2008
        </span>

        <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4">
          Marketing Strategically <span className="text-[#FF6700]">Designed to Sell.</span>
        </h1>

        <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
          We strategize, create, and deliver marketing built to sell — and you can see it in your numbers.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(255,103,0,0.4)] cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <span>Book a Strategy Call</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </button>

          <Link
            href="/audit"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 backdrop-blur-md cursor-pointer whitespace-nowrap group"
          >
            <span>Get your free Social Audit</span>
            <ArrowRight className="w-4 h-4 text-[#FF6700] group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Trust Micro-line */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-[#7F48ED]" />
          <span>30-minute diagnostic · Free written plan · Month-to-month</span>
        </div>
      </MotionWrapper>
    </section>
  );
}
