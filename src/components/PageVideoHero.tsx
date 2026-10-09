"use client";

import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, ArrowRight, ArrowUpRight } from "lucide-react";
import { useContactModal, ContactIntent } from "@/context/ContactModalContext";

export interface MetricPill {
  value: string;
  label: string;
}

export interface PageVideoHeroProps {
  theme?: "orange" | "purple";
  kicker: string;
  titleRegular: string;
  titleHighlight: string;
  description: string;
  videoSrc: string;
  secondaryVideoSrc?: string;
  posterSrc?: string;
  exploreText?: string;
  exploreTargetId?: string;
  bookStrategyText?: string;
  bookStrategyIntent?: ContactIntent;
  primaryCtaText?: string;
  primaryCtaIntent?: ContactIntent;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  secondaryCtaTargetId?: string;
  metrics?: MetricPill[];
  scrollTargetId?: string;
}

export default function PageVideoHero({
  theme = "orange",
  kicker,
  titleRegular,
  titleHighlight,
  description,
  videoSrc,
  secondaryVideoSrc,
  posterSrc = "/hero_frames/frame_000.webp",
  exploreText,
  exploreTargetId,
  bookStrategyText,
  bookStrategyIntent,
  primaryCtaText,
  primaryCtaIntent,
  secondaryCtaText,
  secondaryCtaTargetId,
  scrollTargetId,
}: PageVideoHeroProps) {
  const isPurple = theme === "purple";
  const { openContactModal } = useContactModal();
  const [activeVideo, setActiveVideo] = useState<0 | 1>(0);
  const videoRef0 = useRef<HTMLVideoElement>(null);
  const videoRef1 = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const playCurrent = (vid: HTMLVideoElement | null) => {
      if (vid) {
        vid.muted = true;
        vid.defaultMuted = true;
        vid.playbackRate = 0.65;
        const p = vid.play();
        if (p !== undefined) {
          p.catch(() => {
            const handleFirstInteraction = () => {
              if (vid) {
                vid.playbackRate = 0.65;
                vid.play().catch(() => {});
              }
              window.removeEventListener("touchstart", handleFirstInteraction);
              window.removeEventListener("scroll", handleFirstInteraction);
              window.removeEventListener("click", handleFirstInteraction);
            };
            window.addEventListener("touchstart", handleFirstInteraction, {
              once: true,
              passive: true,
            });
            window.addEventListener("scroll", handleFirstInteraction, {
              once: true,
              passive: true,
            });
            window.addEventListener("click", handleFirstInteraction, {
              once: true,
            });
          });
        }
      }
    };

    if (activeVideo === 0) {
      if (videoRef1.current) videoRef1.current.pause();
      playCurrent(videoRef0.current);
    } else {
      if (videoRef0.current) videoRef0.current.pause();
      playCurrent(videoRef1.current);
    }
  }, [activeVideo, videoSrc, secondaryVideoSrc]);

  const handleScrollToTarget = (id?: string) => {
    if (id) {
      const el = document.getElementById(id);
      if (el) {
        const headerOffset = 80;
        const elementPosition = el.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({
          top: offsetPosition,
          behavior: "smooth",
        });
        return;
      }
    }
    window.scrollTo({
      top: window.innerHeight * 0.85,
      behavior: "smooth",
    });
  };

  const effectiveExploreText = exploreText || secondaryCtaText || "Explore Capabilities";
  const effectiveExploreTarget = exploreTargetId || secondaryCtaTargetId || scrollTargetId;
  const effectiveBookText = bookStrategyText || primaryCtaText || "Book Strategy Call";
  const effectiveBookIntent = bookStrategyIntent || primaryCtaIntent || "strategy-session";

  return (
    <section className="relative w-full min-h-[92dvh] sm:min-h-[98dvh] flex flex-col justify-between overflow-hidden bg-[#07090E] text-white select-none pt-36 sm:pt-40 md:pt-44 pb-12 sm:pb-16 px-5 sm:px-6 lg:px-8">
      {/* 1. Cinematic Background Video with 100% Opacity & Seamless Continuation */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {posterSrc && (
          <img
            src={posterSrc}
            alt="Hero Background Atmosphere"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}

        {/* Video 1: Primary Video (100% Opacity) */}
        <video
          ref={videoRef0}
          key={`hero-vid-0-${videoSrc}`}
          src={videoSrc}
          autoPlay
          muted
          playsInline
          loop={!secondaryVideoSrc}
          preload="auto"
          onEnded={() => {
            if (secondaryVideoSrc) setActiveVideo(1);
          }}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            secondaryVideoSrc && activeVideo === 1 ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
        />

        {/* Video 2: Secondary Continuation Video (100% Opacity) */}
        {secondaryVideoSrc && (
          <video
            ref={videoRef1}
            key={`hero-vid-1-${secondaryVideoSrc}`}
            src={secondaryVideoSrc}
            muted
            playsInline
            preload="auto"
            onEnded={() => setActiveVideo(0)}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
              activeVideo === 1 ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          />
        )}

        {/* Subtle Vignette for Foreground Text Legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07090E]/90 via-[#07090E]/60 to-[#07090E]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-transparent to-[#07090E]/50" />

        {/* Ambient Glows */}
        <div
          className={`absolute -top-32 left-1/4 w-[600px] h-[500px] rounded-full blur-[140px] pointer-events-none ${
            isPurple ? "bg-[#7F48ED]/20" : "bg-[#FF6700]/15"
          }`}
        />
      </div>

      {/* 2. Main Hero Content - Center-aligned on mobile, left-aligned on sm+ */}
      <div className="relative z-10 max-w-7xl mx-auto w-full text-center sm:text-left flex flex-col items-center sm:items-start my-auto">
        {/* Minimalist Kicker Badge */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-xs font-mono uppercase tracking-widest font-semibold mb-6 shadow-xs whitespace-nowrap mx-auto sm:mx-0 ${
            isPurple ? "text-[#7F48ED]" : "text-[#FF6700]"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full shrink-0 ${
              isPurple
                ? "bg-[#7F48ED] shadow-[0_0_8px_#7F48ED]"
                : "bg-[#FF6700] shadow-[0_0_8px_#FF6700]"
            }`}
          />
          <span>{kicker}</span>
        </motion.div>

        {/* Clean Headline in White & Accent */}
        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] tracking-tight leading-[1.06] text-white max-w-4xl text-center sm:text-left"
        >
          <span className="block whitespace-normal sm:whitespace-nowrap">{titleRegular}</span>
          <span
            className={`block whitespace-normal sm:whitespace-nowrap ${
              isPurple ? "text-[#7F48ED]" : "text-[#FF6700]"
            }`}
          >
            {titleHighlight}
          </span>
        </motion.h1>

        {/* Subtitle Description */}
        <motion.p
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-5 sm:mt-6 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal mx-auto sm:mx-0 text-center sm:text-left"
        >
          {description}
        </motion.p>

        {/* Action Buttons: Always beside each other in mobile view */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="mt-8 flex flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none"
        >
          <button
            type="button"
            onClick={() => handleScrollToTarget(effectiveExploreTarget)}
            className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-xl text-white font-heading font-bold text-[11px] sm:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer active:scale-98 whitespace-nowrap ${
              isPurple
                ? "bg-[#7F48ED] hover:bg-[#6D28D9] shadow-[0_0_25px_rgba(127,72,237,0.35)]"
                : "bg-[#FF6700] hover:bg-[#E55C00] shadow-[0_0_25px_rgba(255,103,0,0.35)]"
            }`}
          >
            <span>{effectiveExploreText}</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>

          <button
            type="button"
            onClick={() => openContactModal({ intent: effectiveBookIntent })}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-heading font-bold text-[11px] sm:text-sm uppercase tracking-wider transition-all duration-200 backdrop-blur-md cursor-pointer whitespace-nowrap"
          >
            <span>{effectiveBookText}</span>
            <ArrowUpRight
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${
                isPurple ? "text-[#7F48ED]" : "text-[#FF6700]"
              }`}
            />
          </button>
        </motion.div>
      </div>

      {/* 3. Bottom Scroll Cue */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-7xl mx-auto w-full pt-6 flex items-center justify-center sm:justify-start"
      >
        <button
          onClick={() => handleScrollToTarget(scrollTargetId || effectiveExploreTarget)}
          className="inline-flex items-center gap-2 text-[11px] uppercase font-mono tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer group"
        >
          <span>Scroll to explore</span>
          <ChevronDown
            className={`w-3.5 h-3.5 animate-bounce transition-transform group-hover:translate-y-0.5 ${
              isPurple ? "text-[#7F48ED]" : "text-[#FF6700]"
            }`}
          />
        </button>
      </motion.div>
    </section>
  );
}
