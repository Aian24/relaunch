"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

interface InteractiveImageProps {
  src: string;
  alt: string;
  aspectRatio?: string; // e.g., "aspect-[16/10]" or "aspect-[4/3]"
  badge?: string;
  badgeColor?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  priority?: boolean;
}

export default function InteractiveImage({
  src,
  alt,
  aspectRatio = "aspect-[16/10]",
  badge,
  badgeColor = "bg-[#FF6700]",
  title,
  subtitle,
  className = "",
  priority = false,
}: InteractiveImageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    setMousePos({ x, y });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setMousePos({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        y: isHovered ? -4 : [0, -6, 0],
      }}
      transition={{
        y: isHovered
          ? { duration: 0.3 }
          : { duration: 5, repeat: Infinity, ease: "easeInOut" },
      }}
      style={{
        transform: `perspective(1000px) rotateY(${mousePos.x * 4}deg) rotateX(${-mousePos.y * 4}deg)`,
        transition: isHovered
          ? "transform 0.15s ease-out"
          : "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className={`relative group rounded-3xl overflow-hidden border border-white/[0.12] shadow-2xl bg-[#0D111A] select-none ${aspectRatio} ${className}`}
    >
      {/* Underlying Crisp Image with Smooth Hover Zoom */}
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="object-cover transition-transform duration-700 ease-out group-hover:scale-106"
      />

      {/* Atmospheric Vignette & Soft Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0A0D14]/90 via-[#0A0D14]/20 to-transparent pointer-events-none transition-opacity duration-300 group-hover:opacity-90" />

      {/* Ambient Moving Glare / Light Sheen */}
      <div
        className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: `radial-gradient(circle at ${((mousePos.x + 1) / 2) * 100}% ${((mousePos.y + 1) / 2) * 100}%, rgba(255, 255, 255, 0.15), transparent 60%)`,
        }}
      />

      {/* Optional Top Floating Badge */}
      {badge && (
        <div className="absolute top-4 right-4 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-[10px] font-mono uppercase tracking-wider font-semibold shadow-lg">
            <span className={`w-1.5 h-1.5 rounded-full ${badgeColor} animate-pulse`} />
            <span>{badge}</span>
          </div>
        </div>
      )}

      {/* Optional Bottom Editorial Title & Subtitle */}
      {(title || subtitle) && (
        <div className="absolute bottom-6 left-6 right-6 z-10 text-white">
          {subtitle && (
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#FF6700] font-bold block mb-1">
              {subtitle}
            </span>
          )}
          {title && (
            <h3 className="font-heading font-bold text-lg sm:text-xl text-white leading-snug">
              {title}
            </h3>
          )}
        </div>
      )}
    </motion.div>
  );
}
