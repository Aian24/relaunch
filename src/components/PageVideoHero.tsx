"use client";

import React, { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ChevronDown } from "lucide-react";
import { useContactModal, ContactIntent } from "@/context/ContactModalContext";

export interface MetricPill {
  value: string;
  label: string;
}

export interface PageVideoHeroProps {
  kicker: string;
  titleRegular: string;
  titleHighlight: string;
  description: string;
  videoSrc: string;
  posterSrc?: string;
  primaryCtaText?: string;
  primaryCtaIntent?: ContactIntent;
  secondaryCtaText?: string;
  secondaryCtaHref?: string;
  secondaryCtaTargetId?: string;
  metrics?: MetricPill[];
  scrollTargetId?: string;
}

export default function PageVideoHero({
  kicker,
  titleRegular,
  titleHighlight,
  description,
  videoSrc,
  posterSrc = "/hero_frames/frame_000.webp",
  primaryCtaText = "Book a Strategy Call",
  primaryCtaIntent = "strategy-session",
  secondaryCtaText,
  secondaryCtaHref,
  secondaryCtaTargetId,
  metrics,
  scrollTargetId,
}: PageVideoHeroProps) {
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
          const handleFirstInteraction = () => {
            if (video) video.play().catch(() => {});
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
  }, [videoSrc]);

  const handleScrollToTarget = (id: string) => {
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
    <section className="relative w-full min-h-[90dvh] lg:min-h-[94dvh] flex flex-col justify-between overflow-hidden bg-[#07090E] text-white select-none pt-28 sm:pt-32 pb-12 px-4 sm:px-6 lg:px-8">
      {/* 1. Cinematic Background Video with Instant Autoplay & Atmospheric Overlays */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
        {/* Instant Poster Fallback */}
        {posterSrc && (
          <img
            src={posterSrc}
            alt="Hero Atmosphere"
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}

        {/* Looping High-Definition Background Video */}
        <video
          ref={videoRef}
          key={videoSrc}
          src={videoSrc}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover opacity-55 transition-opacity duration-500"
        />

        {/* Atmospheric Vignette & Gradients for Clean Typography Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/60 to-[#07090E]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-[#07090E]/45 to-[#07090E]" />

        {/* Subtle Warm Brand Ambient Glow */}
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[600px] sm:w-[900px] h-[500px] bg-[#C0622A]/15 rounded-full blur-[140px] pointer-events-none" />
      </div>

      {/* 2. Main Hero Content */}
      <div className="relative z-10 max-w-5xl mx-auto my-auto text-center flex flex-col items-center pt-6 sm:pt-10">
        {/* Minimalist Kicker Badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] text-[#F39C6B] text-[11px] sm:text-xs font-mono uppercase tracking-widest font-semibold mb-6 shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-[#C0622A] animate-pulse" />
          <span>{kicker}</span>
        </motion.div>

        {/* Bold Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-heading font-black text-4xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[1.04] text-white max-w-4xl"
        >
          {titleRegular} <br />
          <span className="bg-gradient-to-r from-white via-[#FAF9F6] to-[#E88C52] bg-clip-text text-transparent">
            {titleHighlight}
          </span>
        </motion.h1>

        {/* Editorial Subheading */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 sm:mt-7 text-slate-300 text-sm sm:text-base md:text-lg max-w-2xl leading-relaxed font-normal"
        >
          {description}
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
            onClick={() => openContactModal({ intent: primaryCtaIntent })}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3.5 bg-[#C0622A] hover:bg-[#a84f1d] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-[0_0_25px_rgba(192,98,42,0.35)] hover:shadow-[0_0_35px_rgba(192,98,42,0.5)] active:scale-98 cursor-pointer group whitespace-nowrap"
          >
            <span>{primaryCtaText}</span>
            <ArrowUpRight className="w-4 h-4 text-white transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>

          {secondaryCtaText && secondaryCtaTargetId && (
            <button
              type="button"
              onClick={() => handleScrollToTarget(secondaryCtaTargetId)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/[0.12] hover:border-white/[0.25] backdrop-blur-md transition-all duration-200 cursor-pointer group whitespace-nowrap"
            >
              <span>{secondaryCtaText}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          )}

          {secondaryCtaText && secondaryCtaHref && !secondaryCtaTargetId && (
            <a
              href={secondaryCtaHref}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/[0.12] hover:border-white/[0.25] backdrop-blur-md transition-all duration-200 cursor-pointer group whitespace-nowrap"
            >
              <span>{secondaryCtaText}</span>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-white transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          )}
        </motion.div>
      </div>

      {/* 3. Bottom Scroll Cue */}
      {scrollTargetId && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="relative z-10 max-w-6xl mx-auto w-full pt-4 flex flex-col items-center"
        >
          <button
            onClick={() => handleScrollToTarget(scrollTargetId)}
            className="inline-flex items-center gap-1.5 text-[10px] uppercase font-mono tracking-widest text-slate-400 hover:text-white transition-colors cursor-pointer group py-1"
          >
            <span>Scroll to explore</span>
            <ChevronDown className="w-3.5 h-3.5 animate-bounce group-hover:text-[#C0622A]" />
          </button>
        </motion.div>
      )}
    </section>
  );
}
