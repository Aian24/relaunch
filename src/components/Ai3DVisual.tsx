"use client";

import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface Ai3DVisualProps {
  pillarId: string;
  className?: string;
}

export default function Ai3DVisual({
  pillarId,
  className = "",
}: Ai3DVisualProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

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

  const render3DGraphic = () => {
    switch (pillarId) {
      case "strategy-consulting":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Holographic Synapse Rings */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute w-26 h-26 rounded-full border border-purple-500/20 border-dashed"
            />
            {/* 3D Brain Core */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotateY: [-5, 5, -5] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 via-[#FF6700] to-indigo-500 p-0.5 shadow-xl shadow-purple-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-purple-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z" />
                  <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z" />
                  <path d="M12 3v18" />
                </svg>
              </div>
            </motion.div>
            {/* Floating ROI Badge */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -top-1 -right-1 bg-white/95 px-2 py-0.5 rounded-full border border-purple-200 shadow-md text-[9px] font-mono font-bold text-purple-800 z-20"
            >
              ROI ROADMAP
            </motion.div>
          </div>
        );

      case "automation-workflows":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Pulse Circuit Ring */}
            <motion.div
              animate={{ scale: [0.95, 1.1, 0.95], opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 rounded-full border border-emerald-500/30"
            />
            {/* 3D Zap Node Matrix */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotate: [-3, 3, -3] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#2E8B7A] via-[#FF6700] to-amber-400 p-0.5 shadow-xl shadow-teal-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#2E8B7A]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                </svg>
              </div>
            </motion.div>
            {/* 24/7 Flow Tag */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -bottom-1 -left-1 bg-[#090D16] text-[#2E8B7A] border border-[#2E8B7A]/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-md z-20"
            >
              24/7 ZAPIER · MAKE
            </motion.div>
          </div>
        );

      case "content-creative":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Prismatic Glow */}
            <div className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-pink-500/10 via-purple-500/20 to-orange-500/10 blur-md" />
            {/* 3D Magic Wand / Pen */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotateZ: [-4, 4, -4] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-pink-500 via-[#FF6700] to-purple-500 p-0.5 shadow-xl shadow-pink-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-pink-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                </svg>
              </div>
            </motion.div>
            {/* Brand Voice Tag */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -top-1 -right-1 bg-white/95 px-2 py-0.5 rounded-full border border-pink-200 shadow-md text-[9px] font-mono font-bold text-pink-800 z-20"
            >
              BRAND VOICE AI
            </motion.div>
          </div>
        );

      case "customer-experience":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Soundwave Rings */}
            <motion.div
              animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.6, 0.2] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 rounded-full border border-cyan-400/30"
            />
            {/* 3D Bot Avatar */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotateY: [-6, 6, -6] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 via-[#FF6700] to-blue-500 p-0.5 shadow-xl shadow-cyan-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-cyan-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" /><path d="M20 14h2" />
                  <path d="M15 13v2" /><path d="M9 13v2" />
                </svg>
              </div>
            </motion.div>
            {/* 24/7 Agent Tag */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -bottom-1 -right-1 bg-[#090D16] text-cyan-400 border border-cyan-500/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-md z-20 flex items-center gap-1"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
              <span>24/7 INTAKE</span>
            </motion.div>
          </div>
        );

      case "marketing-ads":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Targeting Radar Grid */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              className="absolute w-26 h-26 rounded-full border border-orange-500/25"
            />
            {/* 3D Predictive Growth Rocket */}
            <motion.div
              animate={{ y: [-5, 5, -5], rotate: [-2, 2, -2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#FF6700] via-red-500 to-amber-400 p-0.5 shadow-xl shadow-orange-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-[#FF6700]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
                  <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
                </svg>
              </div>
            </motion.div>
            {/* Ad Multiplier Badge */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -top-1 -left-1 bg-white/95 px-2 py-0.5 rounded-full border border-orange-200 shadow-md text-[9px] font-mono font-bold text-[#FF6700] z-20"
            >
              PREDICTIVE PPC
            </motion.div>
          </div>
        );

      case "business-intelligence":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Holographic Cube Grid */}
            <motion.div
              animate={{ rotateZ: [0, 90, 180, 270, 360] }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500/15 to-emerald-500/15 blur-sm"
            />
            {/* 3D Analytics Prism */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotateY: [-5, 5, -5] }}
              transition={{ duration: 4.2, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 via-[#FF6700] to-emerald-400 p-0.5 shadow-xl shadow-indigo-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" x2="18" y1="20" y2="10" />
                  <line x1="12" x2="12" y1="20" y2="4" />
                  <line x1="6" x2="6" y1="20" y2="14" />
                </svg>
              </div>
            </motion.div>
            {/* Live BI Tag */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -bottom-1 -right-1 bg-white/95 px-2 py-0.5 rounded-full border border-indigo-200 shadow-md text-[9px] font-mono font-bold text-indigo-800 z-20"
            >
              LIVE KPI ENGINE
            </motion.div>
          </div>
        );

      case "custom-apps-tools":
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Code Grid Lines */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
              className="absolute w-24 h-24 rounded-full border border-amber-500/20 border-dashed"
            />
            {/* 3D Terminal Shell */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotateZ: [-3, 3, -3] }}
              transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-[#FF6700] to-teal-500 p-0.5 shadow-xl shadow-amber-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="4 17 10 11 4 5" />
                  <line x1="12" x2="20" y1="19" y2="19" />
                </svg>
              </div>
            </motion.div>
            {/* Portal Tag */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -top-1 -right-1 bg-[#090D16] text-amber-400 border border-amber-500/40 px-2 py-0.5 rounded-full text-[9px] font-mono font-bold shadow-md z-20"
            >
              CUSTOM PORTALS
            </motion.div>
          </div>
        );

      default: // enterprise-solutions
        return (
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Security Pulse Grid */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.5, 0.2] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-24 h-24 rounded-full border border-blue-500/30"
            />
            {/* 3D Enterprise Shield */}
            <motion.div
              animate={{ y: [-4, 4, -4], rotateY: [-5, 5, -5] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ transform: "translateZ(30px)" }}
              className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-[#2E8B7A] to-[#FF6700] p-0.5 shadow-xl shadow-blue-500/20"
            >
              <div className="w-full h-full bg-[#090D16] rounded-2xl flex items-center justify-center p-3">
                <svg viewBox="0 0 24 24" className="w-8 h-8 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
            </motion.div>
            {/* Enterprise Tag */}
            <motion.div
              style={{ transform: "translateZ(45px)" }}
              className="absolute -bottom-1 -left-1 bg-white/95 px-2 py-0.5 rounded-full border border-blue-200 shadow-md text-[9px] font-mono font-bold text-blue-800 z-20"
            >
              SOC2 · ENTERPRISE
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
        className={`w-full h-full rounded-2xl overflow-hidden bg-gradient-to-b from-slate-100/90 via-white to-slate-50/70 border border-slate-200/80 p-3 flex items-center justify-center transition-shadow duration-300 ${
          isHovered ? "shadow-xl border-[#FF6700]/40" : "shadow-xs"
        }`}
      >
        {/* Dynamic Light Sheen on Mouse Movement */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-0"
          style={{
            opacity: isHovered ? 0.35 : 0,
            background: `radial-gradient(220px circle at calc(50% + ${mouseX.get() * 100}%) calc(50% + ${mouseY.get() * 100}%), rgba(255,103,0, 0.25), transparent 70%)`,
          }}
        />

        {/* 3D Visual Content */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          {render3DGraphic()}
        </div>
      </motion.div>
    </div>
  );
}
