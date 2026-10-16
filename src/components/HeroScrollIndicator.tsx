"use client";

import React from "react";

interface HeroScrollIndicatorProps {
  targetId?: string;
  accentColor?: string;
  className?: string;
}

export default function HeroScrollIndicator({
  targetId,
  accentColor = "#FF6700",
  className = "",
}: HeroScrollIndicatorProps) {
  const handleClick = () => {
    if (targetId) {
      const el = document.getElementById(targetId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollBy({ top: window.innerHeight * 0.85, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-65 hover:opacity-100 transition-opacity cursor-pointer group ${className}`}
      aria-label="Scroll to next section"
    >
      <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 group-hover:text-white transition-colors">
        Scroll
      </span>
      <div className="w-5 h-8 rounded-full border border-white/25 flex items-start justify-center p-1 group-hover:border-white/50 transition-colors">
        <div
          className="w-1 h-2 rounded-full animate-bounce"
          style={{ backgroundColor: accentColor }}
        />
      </div>
    </button>
  );
}
