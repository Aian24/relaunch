"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";

export default function Hero() {
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
          className="w-full h-full object-cover opacity-80 transition-opacity duration-500"
        />

        {/* Atmospheric Vignette & Color Gradients: left side readable, right side open for video highlight */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090E]/90 via-[#07090E]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-[#07090E]/40" />
        
        {/* Subtle Warm Brand Ambient Glow */}
        <div className="absolute -top-32 left-1/4 w-[600px] sm:w-[800px] h-[500px] bg-[#C0622A]/15 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* 2. Main Hero Editorial Content - Centered on mobile (vertically & horizontally), Left-Aligned on desktop */}
      <div className="relative z-10 max-w-7xl mx-auto w-full text-center sm:text-left flex flex-col items-center sm:items-start justify-center flex-1 my-auto py-6 sm:py-12">
        {/* Refined Minimalist Kicker Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center justify-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] text-[#F39C6B] text-[10px] sm:text-xs font-mono uppercase tracking-widest font-semibold mb-4 sm:mb-6 shadow-sm text-center"
        >
          <span className="w-2 h-2 rounded-full bg-[#C0622A] animate-pulse shrink-0" />
          <span>Phoenix, AZ · Est. 2004 · Creative &amp; AI Studio</span>
        </motion.div>

        {/* Clean, Massive Editorial Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.04] text-white max-w-3xl text-center sm:text-left"
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
          className="mt-4 sm:mt-7 text-slate-300 text-xs sm:text-base md:text-lg max-w-xl leading-relaxed font-normal text-center sm:text-left"
        >
          Everything your business needs under one strategic partner. From high-converting digital platforms to custom AI automation—built with speed, precision, and zero bloated retainers.
        </motion.p>
      </div>

      {/* 3. Minimal Bottom Scroll Cue - Centered on mobile & elevated above floating chat button */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-7xl mx-auto w-full pb-16 sm:pb-6 flex items-center justify-center sm:justify-start"
      >
        <button
          onClick={() => handleScrollToSection("two-doors")}
          className="inline-flex items-center justify-center gap-2 text-[11px] uppercase font-mono tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <span>Scroll to explore</span>
          <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:text-[#C0622A]" />
        </button>
      </motion.div>
    </section>
  );
}
