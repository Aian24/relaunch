"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ExternalLink, TrendingUp } from "lucide-react";

interface Work3DShowcaseProps {
  image: string;
  title: string;
  displayUrl: string;
  industry: string;
  metricValue: string;
  metricLabel: string;
  isModal?: boolean;
  className?: string;
}

export default function Work3DShowcase({
  image,
  title,
  displayUrl,
  industry,
  metricValue,
  metricLabel,
  isModal = false,
  className = "",
}: Work3DShowcaseProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 22, stiffness: 200 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], isModal ? [8, -8] : [10, -10]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], isModal ? [-8, 8] : [-10, 10]), springConfig);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: isModal ? 1200 : 900 }}
      className={`relative select-none ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`relative w-full rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 transition-shadow duration-300 ${
          isHovered ? "shadow-2xl shadow-orange-950/20 border-[#FF6700]/50" : "shadow-lg"
        }`}
      >
        {/* Layer 1: 3D Browser Top Window Chrome */}
        <div
          style={{ transform: "translateZ(25px)" }}
          className="bg-slate-900 px-4 py-2.5 flex items-center justify-between border-b border-slate-800 relative z-20"
        >
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/90" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/90" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/90" />
          </div>
          <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-md bg-slate-950 border border-slate-800 text-[10px] font-mono text-slate-300 truncate max-w-[200px] shadow-inner">
            <span className="text-[#2E8B7A]">https://</span>
            <span>{displayUrl}</span>
          </div>
          <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#FF6700] transition-colors" />
        </div>

        {/* Layer 2: 3D Image Canvas Viewport */}
        <div
          style={{ transform: "translateZ(10px)" }}
          className={`relative w-full bg-slate-950 overflow-hidden ${
            isModal ? "aspect-[16/9]" : "h-48 sm:h-52"
          }`}
        >
          <Image
            src={image}
            alt={title}
            fill
            sizes={isModal ? "(max-width: 1200px) 100vw, 900px" : "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
            className="object-cover object-top transition-transform duration-500"
          />

          {/* 3D Glass Light Sweep / Glare on Tilt */}
          <div
            className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-10"
            style={{
              opacity: isHovered ? 0.4 : 0.1,
              background: `radial-gradient(400px circle at calc(50% + ${mouseX.get() * 120}%) calc(50% + ${mouseY.get() * 120}%), rgba(255, 255, 255, 0.35), transparent 60%)`,
            }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/70 via-transparent to-transparent opacity-60" />

          {/* Layer 3: Floating Industry Tag */}
          <div
            style={{ transform: "translateZ(35px)" }}
            className="absolute top-3 left-3 pointer-events-none z-20"
          >
            <span className="px-3 py-1 rounded-full bg-[#090D16]/90 backdrop-blur-md text-white text-[11px] font-medium border border-slate-700/80 shadow-md">
              {industry}
            </span>
          </div>

          {/* Layer 4: Floating 3D Metric Highlight (Visible on card preview) */}
          {!isModal && (
            <div
              style={{ transform: "translateZ(45px)" }}
              className="absolute bottom-3 right-3 pointer-events-none z-20"
            >
              <div className="px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md border border-orange-200/80 shadow-xl flex items-center gap-2">
                <TrendingUp className="w-3.5 h-3.5 text-[#FF6700] shrink-0" />
                <div className="leading-tight">
                  <span className="font-heading font-black text-xs text-[#FF6700] block">
                    {metricValue}
                  </span>
                  <span className="text-[9px] font-mono text-slate-600 block">
                    {metricLabel}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
