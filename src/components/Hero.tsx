"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useContactModal } from "@/context/ContactModalContext";
import NumberCounter from "@/components/NumberCounter";
import { ArrowRight, PhoneCall, ChevronDown } from "lucide-react";

const industries = [
  "Restaurants",
  "Healthcare",
  "Real Estate",
  "Law Firms",
  "Contractors",
  "Retail",
  "Hospitality",
  "Startups",
];

export default function Hero() {
  const [activeVideo, setActiveVideo] = useState(0);
  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);
  const { openContactModal } = useContactModal();

  // Playback control and continuation
  useEffect(() => {
    const v0 = videoRef0.current;
    const v1 = videoRef1.current;

    const setupAndPlay = (video: HTMLVideoElement | null) => {
      if (video) {
        video.muted = true;
        video.defaultMuted = true;
        video.playbackRate = 0.65;
        video.play().catch(() => {});
      }
    };

    if (activeVideo === 0) {
      setupAndPlay(v0);
    } else {
      setupAndPlay(v1);
    }

    // Safety fallback for autoplay permission on first interaction
    const handleFirstTouch = () => {
      if (activeVideo === 0) setupAndPlay(v0);
      else setupAndPlay(v1);
      window.removeEventListener("touchstart", handleFirstTouch);
      window.removeEventListener("scroll", handleFirstTouch);
      window.removeEventListener("click", handleFirstTouch);
    };
    window.addEventListener("touchstart", handleFirstTouch, { once: true, passive: true });
    window.addEventListener("scroll", handleFirstTouch, { once: true, passive: true });
    window.addEventListener("click", handleFirstTouch, { once: true });
  }, [activeVideo]);

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
    <section
      id="hero"
      className="relative w-full min-h-[92dvh] sm:min-h-[98dvh] flex flex-col justify-center overflow-hidden bg-[#07090E] text-white select-none pt-36 sm:pt-40 md:pt-44 pb-12 sm:pb-16 px-5 sm:px-6 lg:px-8"
    >
      {/* Background Video Section with 100% opacity & seamless video continuation */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <img
          src="/hero_frames/frame_000.webp"
          alt="Hero Background Atmosphere"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {/* Video 1: Primary Hero Video (100% Opacity) */}
        <video
          ref={videoRef0}
          src="/relaunch-hero.mp4"
          autoPlay
          muted
          playsInline
          preload="auto"
          onEnded={() => setActiveVideo(1)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            activeVideo === 0 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Video 2: ReLaunchSecond.mp4 Continuation (100% Opacity) */}
        <video
          ref={videoRef1}
          src="/ReLaunchSecond.mp4"
          muted
          playsInline
          preload="auto"
          onEnded={() => setActiveVideo(0)}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            activeVideo === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        />

        {/* Subtle Vignette for Foreground Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090E]/90 via-[#07090E]/60 to-[#07090E]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-[#07090E]/50" />

        <div className="absolute -top-32 left-1/4 w-[600px] h-[500px] bg-[#FF6700]/15 rounded-full blur-[140px] pointer-events-none" />
        <div className="absolute top-1/4 right-0 w-[550px] h-[500px] bg-[#7F48ED]/20 rounded-full blur-[150px] pointer-events-none" />
      </div>

      {/* Main Clean Hero Content - Center-aligned on mobile, flushed left on sm+ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full text-center sm:text-left flex flex-col items-center sm:items-start">
        {/* Clean Kicker */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-[#FF6700] text-xs font-mono uppercase tracking-widest font-semibold mb-6 shadow-xs whitespace-nowrap mx-auto sm:mx-0"
        >
          <span className="w-2 h-2 rounded-full bg-[#FF6700] shadow-[0_0_8px_#FF6700] shrink-0" />
          <span>Phoenix, AZ · Est. 2004</span>
        </motion.div>

        {/* Headline without awkward wrapping */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] tracking-tight leading-[1.06] text-white text-center sm:text-left"
        >
          <span className="block whitespace-normal sm:whitespace-nowrap">Your Business Deserves</span>
          <span className="block text-[#FF6700] whitespace-normal sm:whitespace-nowrap">a Full Marketing Team.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.18, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal mx-auto sm:mx-0 text-center sm:text-left"
        >
          We handle your marketing, AI, web, and design — bundled into one subscription you can actually afford. You stay focused on running your business. We handle the rest.
        </motion.p>

        {/* Action Buttons: Always beside each other in mobile view */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none"
        >
          <button
            onClick={() => handleScrollToSection("services")}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-[11px] sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_25px_rgba(255,103,0,0.35)] cursor-pointer active:scale-98 whitespace-nowrap"
          >
            <span>Explore Services</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-heading font-bold text-[11px] sm:text-sm uppercase tracking-wider transition-all duration-200 backdrop-blur-md cursor-pointer whitespace-nowrap"
          >
            <PhoneCall className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF6700]" />
            <span>Book Strategy Call</span>
          </button>
        </motion.div>

        {/* Tailored For placed INSIDE Hero with zero awkward wrapping */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 pt-5 border-t border-white/[0.1] flex flex-wrap items-center justify-center sm:justify-start gap-x-4 gap-y-2 text-xs text-slate-300 max-w-4xl text-center sm:text-left mx-auto sm:mx-0 w-full"
        >
          <span className="text-[11px] font-mono uppercase tracking-widest text-[#FF6700] font-bold whitespace-nowrap">
            Tailored For:
          </span>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 sm:gap-x-4 gap-y-1.5 text-xs text-slate-300 font-medium">
            {industries.map((ind, idx) => (
              <React.Fragment key={ind}>
                <span className="whitespace-nowrap hover:text-white transition-colors">{ind}</span>
                {idx < industries.length - 1 && (
                  <span className="text-white/25">•</span>
                )}
              </React.Fragment>
            ))}
          </div>
        </motion.div>

        {/* Clean Proof Metrics: Orange & White with no text wrapping */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.36, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 pt-5 border-t border-white/[0.1] grid grid-cols-3 gap-3 sm:gap-10 max-w-lg mx-auto sm:mx-0 w-full text-center sm:text-left"
        >
          <div>
            <div className="font-heading font-black text-2xl sm:text-3xl text-white whitespace-nowrap">
              <NumberCounter value={22} suffix="+" />
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mt-0.5 whitespace-nowrap">
              Years in Business
            </div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl sm:text-3xl text-white whitespace-nowrap">
              <NumberCounter value={1500} suffix="+" />
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mt-0.5 whitespace-nowrap">
              Projects Delivered
            </div>
          </div>
          <div>
            <div className="font-heading font-black text-2xl sm:text-3xl text-white whitespace-nowrap">
              <NumberCounter value={480} suffix="+" />
            </div>
            <div className="text-[10px] sm:text-xs font-mono uppercase tracking-wider text-slate-400 mt-0.5 whitespace-nowrap">
              Campaigns Launched
            </div>
          </div>
        </motion.div>

        {/* Scroll to Explore Cue restored */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 pt-4 flex items-center justify-center sm:justify-start w-full"
        >
          <button
            onClick={() => handleScrollToSection("services")}
            className="inline-flex items-center gap-2 text-[11px] uppercase font-mono tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer group"
          >
            <span>Scroll to explore</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:text-[#FF6700]" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
