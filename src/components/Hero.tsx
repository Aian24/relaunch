"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, Sparkles, ShieldCheck, ChevronDown } from "lucide-react";
import { useContactModal } from "@/context/ContactModalContext";

export default function Hero() {
  const { openContactModal } = useContactModal();
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.defaultMuted = true;
      video.playbackRate = 1.0;
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Retry playback immediately upon first user touch/scroll
          const handleFirstInteraction = () => {
            if (video) video.play().catch(() => {});
            window.removeEventListener("touchstart", handleFirstInteraction);
            window.removeEventListener("scroll", handleFirstInteraction);
            window.removeEventListener("click", handleFirstInteraction);
          };
          window.addEventListener("touchstart", handleFirstInteraction, { once: true, passive: true });
          window.addEventListener("scroll", handleFirstInteraction, { once: true, passive: true });
          window.addEventListener("click", handleFirstInteraction, { once: true });
        });
      }
    }
  }, []);

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <section
      id="hero"
      className="relative w-full min-h-[100dvh] flex flex-col justify-between overflow-hidden bg-[#07090E] text-white select-none pt-24 sm:pt-28 pb-10 px-4 sm:px-6 lg:px-8"
    >
      {/* 1. Cinematic Background Video with Instant Autoplay */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Immediate Fallback Poster Backdrop */}
        <img
          src="/hero_frames/frame_000.webp"
          alt="Hero Background Atmosphere"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />

        {/* Instant Looping High-Definition Background Video */}
        <video
          ref={videoRef}
          src="/relaunch-hero.mp4"
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-70 transition-opacity duration-500"
        />

        {/* Atmospheric Vignette & Color Gradients for High Readability & Rich Video Visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/35 to-[#07090E]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#07090E]/20 to-[#07090E]/85" />
        
        {/* Subtle Warm Brand Ambient Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[500px] bg-[#C0622A]/15 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* 2. Main Hero Editorial Content */}
      <div className="relative z-10 max-w-5xl mx-auto my-auto text-center flex flex-col items-center pt-8 sm:pt-12">
        {/* Refined Minimalist Kicker Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] text-[#F39C6B] text-[11px] sm:text-xs font-mono uppercase tracking-widest font-semibold mb-6 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#C0622A] animate-pulse" />
          <span>Phoenix, AZ · Est. 2004 · Creative & AI Studio</span>
        </motion.div>

        {/* Clean, Massive Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.04] text-white max-w-4xl"
        >
          Marketing, AI &amp; <br />
          <span className="bg-gradient-to-r from-white via-[#FAF9F6] to-[#E88C52] bg-clip-text text-transparent">
            Digital Evolution.
          </span>
        </motion.h1>

        {/* Streamlined, Meaningful Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-7 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal"
        >
          Everything your business needs under one strategic partner. From high-converting digital platforms to custom AI automation—built with speed, precision, and zero bloated retainers.
        </motion.p>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#C0622A] hover:bg-[#a84f1d] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-[0_0_25px_rgba(192,98,42,0.35)] hover:shadow-[0_0_35px_rgba(192,98,42,0.5)] active:scale-98 cursor-pointer group"
          >
            <span>Book a Strategy Call</span>
            <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          <button
            type="button"
            onClick={() => handleScrollToSection("two-doors")}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/[0.12] hover:border-white/[0.25] backdrop-blur-md transition-all duration-200 cursor-pointer group"
          >
            <span>Explore Overview</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 group-hover:translate-x-1" />
          </button>
        </motion.div>
      </div>

      {/* 3. Bottom Trust Bar & Scroll Cue */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-6xl mx-auto w-full pt-8 sm:pt-10 flex flex-col items-center gap-6"
      >
        {/* Minimalist Key Metric Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6 w-full max-w-4xl border-t border-white/[0.08] pt-6">
          <div className="text-center">
            <div className="font-heading font-black text-xl sm:text-2xl text-white">22+</div>
            <div className="text-[11px] sm:text-xs text-slate-400 uppercase font-mono tracking-wider mt-0.5">Years Experience</div>
          </div>
          <div className="text-center">
            <div className="font-heading font-black text-xl sm:text-2xl text-white">1,500+</div>
            <div className="text-[11px] sm:text-xs text-slate-400 uppercase font-mono tracking-wider mt-0.5">Projects Delivered</div>
          </div>
          <div className="text-center">
            <div className="font-heading font-black text-xl sm:text-2xl text-white">100%</div>
            <div className="text-[11px] sm:text-xs text-slate-400 uppercase font-mono tracking-wider mt-0.5">Asset Ownership</div>
          </div>
          <div className="text-center">
            <div className="font-heading font-black text-xl sm:text-2xl text-white">0</div>
            <div className="text-[11px] sm:text-xs text-slate-400 uppercase font-mono tracking-wider mt-0.5">Contract Lock-in</div>
          </div>
        </div>

        {/* Subtle Scroll Indicator */}
        <button
          onClick={() => handleScrollToSection("two-doors")}
          className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer pt-2 group"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:text-[#C0622A]" />
        </button>
      </motion.div>
    </section>
  );
}
