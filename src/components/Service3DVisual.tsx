"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Service3DVisualProps {
  serviceId: string;
  category: string;
  className?: string;
  isModal?: boolean;
}

export default function Service3DVisual({
  serviceId,
  category,
  className = "",
  isModal = false,
}: Service3DVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Mouse tilt motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 20, stiffness: 220 };
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [12, -12]), springConfig);
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-12, 12]), springConfig);

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

  // Render completely distinct, unique 3D visual for each of the 8 services
  const render3DContent = () => {
    switch (serviceId) {
      case "marketing-ads":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 3D Pulsing Radar Concentric Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
              className="absolute w-28 h-28 sm:w-32 sm:h-32 rounded-full border border-[#FF6700]/20 border-dashed"
            />
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full border border-[#FF6700]/30"
            />
            {/* 3D Megaphone / Bullseye Asset */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#FF6700] via-[#FF6700] to-[#FF9F68] p-0.5 shadow-lg shadow-orange-500/20 flex items-center justify-center"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#FF6700]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m3 11 18-5v12L3 14v-3z" />
                  <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                </svg>
              </div>
            </motion.div>
            {/* Floating Metric 3D Pill */}
            <motion.div
              animate={{ y: [3, -3, 3] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(45px)" }}
              className="absolute -top-1 -right-1 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-orange-200 shadow-md flex items-center gap-1.5 z-20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#2E8B7A] animate-pulse" />
              <span className="text-[10px] font-mono font-bold text-slate-800">+184% CTR</span>
            </motion.div>
          </div>
        );

      case "brand-design":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Prismatic Geometric Diamond Background */}
            <motion.div
              animate={{ rotate: [0, 90, 180, 270, 360] }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute w-24 h-24 rounded-2xl bg-gradient-to-br from-[#2E8B7A]/20 via-[#FF6700]/20 to-purple-500/20 blur-md"
            />
            {/* Floating 3D Palette Stack */}
            <motion.div
              animate={{ y: [-5, 5, -5], rotateZ: [-3, 3, -3] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#2E8B7A] to-[#FF6700] p-0.5 shadow-lg shadow-teal-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#2E8B7A]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="13.5" cy="6.5" r=".5" fill="currentColor" />
                  <circle cx="17.5" cy="10.5" r=".5" fill="currentColor" />
                  <circle cx="8.5" cy="7.5" r=".5" fill="currentColor" />
                  <circle cx="6.5" cy="12.5" r=".5" fill="currentColor" />
                  <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z" />
                </svg>
              </div>
            </motion.div>
            {/* Color Swatch Dots */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -bottom-1 -left-1 bg-white/95 backdrop-blur-md px-2 py-1 rounded-full border border-slate-200 shadow-md flex items-center gap-1 z-20"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-[#090D16]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF6700]" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#2E8B7A]" />
              <span className="text-[9px] font-mono font-bold text-slate-700 ml-1">SYSTEM</span>
            </motion.div>
          </div>
        );

      case "ai-services":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* 3D Neural Grid Pulse */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <motion.div
                animate={{ scale: [0.95, 1.08, 0.95], opacity: [0.3, 0.7, 0.3] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="w-28 h-28 rounded-full bg-gradient-to-r from-[#FF6700]/20 via-cyan-500/20 to-[#2E8B7A]/20 blur-lg"
              />
            </div>
            {/* 3D Neural Chip */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotateY: [-5, 5, -5] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(35px)" }}
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-cyan-500 via-[#FF6700] to-emerald-400 p-0.5 shadow-xl shadow-cyan-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3 relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(#2E8B7A_1px,transparent_1px)] [background-size:8px_8px] opacity-30" />
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan-400 relative z-10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="16" height="16" x="4" y="4" rx="2" />
                  <rect width="6" height="6" x="9" y="9" rx="1" />
                  <path d="M15 2v2" /><path d="M15 20v2" /><path d="M2 15h2" /><path d="M2 9h2" />
                  <path d="M20 15h2" /><path d="M20 9h2" /><path d="M9 2v2" /><path d="M9 20v2" />
                </svg>
              </div>
            </motion.div>
            {/* Floating AEO/GEO Tag */}
            <motion.div
              style={{ transform: "translateZ(50px)" }}
              className="absolute -top-1 -left-1 bg-[#090D16] text-cyan-300 border border-cyan-500/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-lg z-20 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>AEO · GEO 24/7</span>
            </motion.div>
          </div>
        );

      case "web-development":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Floating Spatial Code Windows */}
            <motion.div
              animate={{ rotateX: [10, -5, 10], rotateY: [-10, 10, -10] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(25px)" }}
              className="relative z-10 w-24 h-16 sm:w-28 sm:h-18 rounded-xl bg-slate-900 border border-slate-700 shadow-xl overflow-hidden p-2 flex flex-col justify-between"
            >
              <div className="flex items-center gap-1 pb-1 border-b border-slate-800">
                <span className="w-1.5 h-1.5 rounded-full bg-red-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[7px] font-mono text-slate-400 ml-1">page.tsx</span>
              </div>
              <div className="space-y-1 font-mono text-[8px] text-slate-300">
                <div className="text-[#FF6700]">export default function UI()</div>
                <div className="text-emerald-400 pl-2">&lt;NextApp /&gt;</div>
              </div>
            </motion.div>
            {/* Speed Badge */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -bottom-1 -right-1 bg-white/95 px-2 py-0.5 rounded-full border border-emerald-200 shadow-md text-[9px] font-mono font-bold text-emerald-700 flex items-center gap-1 z-20"
            >
              <span className="text-emerald-500 font-black">⚡</span> 100 Lighthouse
            </motion.div>
          </div>
        );

      case "video-content":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Film Aperture Radial Blur */}
            <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-red-500/10 via-orange-500/20 to-amber-500/10 blur-md" />
            {/* 3D Cinema Frame / Camera */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [-2, 2, -2] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-red-500 via-[#FF6700] to-amber-400 p-0.5 shadow-xl shadow-orange-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="18" height="18" x="3" y="3" rx="2" />
                  <path d="M7 3v18" /><path d="M3 7.5h4" /><path d="M3 12h18" /><path d="M3 16.5h4" /><path d="M17 3v18" /><path d="M17 7.5h4" /><path d="M17 16.5h4" />
                </svg>
              </div>
            </motion.div>
            {/* 4K Resolution Pill */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -top-1 -right-1 bg-[#090D16] text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-md z-20"
            >
              4K · 3D MOTION
            </motion.div>
          </div>
        );

      case "email-marketing":
      case "email-sms":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Delivery Waves */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 rounded-full border border-blue-400/30"
            />
            {/* 3D Envelope Drone Capsule */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotateY: [-6, 6, -6] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-blue-500 via-[#2E8B7A] to-[#FF6700] p-0.5 shadow-xl shadow-blue-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2" />
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                </svg>
              </div>
            </motion.div>
            {/* Open Rate Badge */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -bottom-1 -left-1 bg-white/95 px-2 py-0.5 rounded-full border border-blue-200 shadow-md text-[9px] font-mono font-bold text-blue-700 flex items-center gap-1 z-20"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              <span>42% Open Rate</span>
            </motion.div>
          </div>
        );

      case "custom-software":
      case "fractional-cmo":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Architectural Database Grid */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-24 h-24 rounded-full border border-purple-400/25 border-dashed"
            />
            {/* 3D Database & Software Stack */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotateZ: [-3, 3, -3] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-[#FF6700] to-indigo-400 p-0.5 shadow-xl shadow-purple-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <ellipse cx="12" cy="5" rx="9" ry="3" />
                  <path d="M3 5V19A9 3 0 0 0 21 19V5" />
                  <path d="M3 12A9 3 0 0 0 21 12" />
                </svg>
              </div>
            </motion.div>
            {/* SLA Pill */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -top-1 -left-1 bg-white/95 px-2 py-0.5 rounded-full border border-purple-200 shadow-md text-[9px] font-mono font-bold text-purple-800 z-20"
            >
              CUSTOM APPS
            </motion.div>
          </div>
        );

      default: // nis-audit & social-media-management
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Compass / Diagnostic Matrix */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
              className="absolute w-26 h-26 rounded-full border border-[#FF6700]/30"
            />
            {/* 3D Sales Compass */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotateY: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-[#FF6700] via-pink-500 to-indigo-500 p-0.5 shadow-xl shadow-orange-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#FF6700]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" />
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
                </svg>
              </div>
            </motion.div>
            {/* 4-Layer Diagnostic Tag */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -bottom-1 -right-1 bg-[#090D16] text-[#FF6700] border border-[#FF6700]/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-md z-20"
            >
              4-LAYER AUDIT
            </motion.div>
          </div>
        );
    }
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: 800 }}
      className={`relative select-none ${className}`}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
        }}
        className={`w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-100/90 via-white to-slate-50/70 border border-slate-200/80 p-3 sm:p-4 flex items-center justify-center transition-shadow duration-300 ${
          isHovered ? "shadow-xl border-[#FF6700]/40" : "shadow-xs"
        }`}
      >
        {/* Dynamic Light Sheen on Mouse Movement */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(250px circle at calc(50% + ${mouseX.get() * 100}%) calc(50% + ${mouseY.get() * 100}%), rgba(255,103,0, 0.25), transparent 70%)`,
          }}
        />

        {/* 3D Visual Content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {render3DContent()}
        </div>
      </motion.div>
    </div>
  );
}
