"use client";

import { useState, useEffect, useRef } from "react";

export default function Preloader() {
  const [isMounted, setIsMounted] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);
  const [progress, setProgress] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const dismissedRef = useRef(false);

  const dismissLoader = () => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;

    try {
      sessionStorage.setItem("relaunch_preloader_seen", "true");
    } catch {
      // Storage access exception fallback
    }

    // Freeze video on final completed frame to prevent clearing or glitching
    if (videoRef.current) {
      videoRef.current.pause();
    }

    setProgress(100);
    setIsDismissing(true);

    // Cleanly unmount from DOM only after the smooth CSS fade completes
    setTimeout(() => {
      setIsMounted(false);
    }, 550);
  };

  useEffect(() => {
    // Check if preloader has already been completed in this session
    try {
      const alreadySeen = sessionStorage.getItem("relaunch_preloader_seen");
      if (alreadySeen === "true") {
        setIsMounted(false);
        return;
      }
    } catch {
      // Storage access exception fallback
    }

    // Only mount if not seen yet
    setIsMounted(true);

    // Play video at natural, smooth 1.0x speed for a cinematic, clear brand reveal
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.0;
      videoRef.current.play().catch(() => {
        // Fallback if browser autoplay policy requires interaction
      });
    }

    // Safety fallback: only if video is completely blocked/hung
    const safetyTimer = setTimeout(() => {
      dismissLoader();
    }, 12000);

    return () => clearTimeout(safetyTimer);
  }, []);

  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      const pct = Math.min(100, Math.round((current / total) * 100));
      setProgress(pct);

      // Once the full video reaches the end (within 0.05s of duration), complete
      if (total > 0 && current >= total - 0.05) {
        dismissLoader();
      }
    }
  };

  const handleEnded = () => {
    dismissLoader();
  };

  if (!isMounted) return null;

  return (
    <div
      aria-hidden={isDismissing}
      style={{
        transition:
          "opacity 550ms cubic-bezier(0.16, 1, 0.3, 1), visibility 550ms cubic-bezier(0.16, 1, 0.3, 1)",
        willChange: "opacity",
        transform: "translateZ(0)",
      }}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white select-none ${
        isDismissing
          ? "opacity-0 pointer-events-none invisible"
          : "opacity-100 pointer-events-auto visible"
      }`}
    >
      {/* Top subtle brand accent bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-[#C0622A]" />

      <div className="flex flex-col items-center max-w-lg px-4 sm:px-6 text-center w-full">
        {/* Skip button for client convenience */}
        <button
          onClick={dismissLoader}
          className="absolute top-6 right-6 text-[11px] font-mono uppercase tracking-widest text-slate-400 hover:text-[#C0622A] transition-colors cursor-pointer"
        >
          Skip Intro →
        </button>

        {/* Logo Video Frame with Explicit Dimensions & Aspect Ratio */}
        <div className="w-[320px] sm:w-[480px] md:w-[540px] aspect-[16/9] max-w-full rounded-2xl bg-white flex items-center justify-center p-2 overflow-hidden shadow-xs">
          <video
            ref={videoRef}
            src="/relaunch-intro.mp4"
            width={540}
            height={304}
            playsInline
            muted
            autoPlay
            preload="auto"
            onTimeUpdate={handleTimeUpdate}
            onEnded={handleEnded}
            onPlay={() => {
              if (videoRef.current) {
                videoRef.current.playbackRate = 1.0;
              }
            }}
            onLoadedMetadata={() => {
              if (videoRef.current) {
                videoRef.current.playbackRate = 1.0;
              }
            }}
            className="w-full h-full object-contain bg-white"
          />
        </div>

        {/* Loading Text & Percentage Indicator */}
        <div className="flex items-center gap-2 mt-5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#C0622A]" />
          <span className="font-heading font-bold text-xs uppercase tracking-widest text-[#090D16]">
            Loading, please wait...
          </span>
          <span className="font-mono text-xs font-bold text-[#C0622A] ml-1">
            {progress}%
          </span>
        </div>

        {/* Smooth Progressive Bar synchronized with Video */}
        <div className="w-56 max-w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden border border-slate-200">
          <div
            style={{
              width: `${progress}%`,
              transition: "width 120ms linear",
            }}
            className="h-full bg-[#C0622A] rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
