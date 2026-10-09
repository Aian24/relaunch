"use client";

import React from "react";
import { motion } from "framer-motion";
import { useScrollContext } from "./SmoothScrollProvider";

export default function GlobalScrollHUD() {
  const { scrollProgress } = useScrollContext();

  return (
    <>
      {/* Ultra-sleek Glowing Scroll Progress Bar Under Navbar */}
      <div className="fixed top-0 left-0 right-0 h-[2.5px] z-50 pointer-events-none overflow-hidden bg-transparent">
        <motion.div
          className="h-full bg-[#FF6700] relative"
          style={{ width: `${Math.max(1, scrollProgress * 100)}%` }}
        >
          {/* Laser Head Glow Particle */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-[#FF6700] blur-[3px] opacity-80" />
        </motion.div>
      </div>
    </>
  );
}
