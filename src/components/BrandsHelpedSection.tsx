"use client";

import React from "react";
import Image from "next/image";
import MotionWrapper from "./MotionWrapper";

export interface BrandItem {
  name: string;
  logo: string;
  category: string;
}

export const brandsHelpedList: BrandItem[] = [
  { name: "Turf Life", logo: "/brands/turf-life.png", category: "Golf & Sports Lifestyle" },
  { name: "Golf Central Magazine", logo: "/brands/golf-central.png", category: "Media & Publishing" },
  { name: "Mother Truckin Burgers", logo: "/brands/mother-truckin.png", category: "Food & Hospitality" },
  { name: "Flint Creek Precision", logo: "/brands/flint-creek.png", category: "Precision Manufacturing" },
  { name: "Volcano Glamping Resort", logo: "/brands/volcano-glamping.png", category: "Luxury Eco-Tourism" },
  { name: "Lee's Water Service", logo: "/brands/lees-water.png", category: "Commercial Utilities" },
  { name: "Pure Benefits", logo: "/brands/pure-benefits.png", category: "Insurance & Wellness" },
  { name: "West Arms", logo: "/brands/west-arms.png", category: "Commercial Defense" },
  { name: "Behrens", logo: "/brands/behrens.png", category: "Industrial Manufacturing" },
  { name: "La Prima Bella", logo: "/brands/la-prima-bella.png", category: "Beauty & Lifestyle" },
  { name: "Stagton", logo: "/brands/stagton.png", category: "Apparel & Retail" },
];

interface BrandsHelpedSectionProps {
  variant?: "dark" | "light";
  className?: string;
  showTitle?: boolean;
}

export default function BrandsHelpedSection({
  variant = "dark",
  className = "",
  showTitle = true,
}: BrandsHelpedSectionProps) {
  const isDark = variant === "dark";

  return (
    <section
      className={`relative w-full overflow-hidden select-none py-14 sm:py-16 ${
        isDark
          ? "bg-[#090D16] text-white border-y border-slate-800"
          : "bg-slate-50 text-[#090D16] border-y border-slate-200"
      } ${className}`}
    >
      {/* Ambient Radial Accent Glow with Logo Purple & Phoenix Orange */}
      <div
        className={`absolute inset-0 pointer-events-none ${
          isDark
            ? "bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(127,72,237,0.12),transparent_70%)]"
            : "bg-[radial-gradient(ellipse_60%_50%_at_50%_50%,rgba(127,72,237,0.06),transparent_70%)]"
        }`}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 text-center relative z-10">
        {showTitle && (
          <MotionWrapper direction="up" distance={20}>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.2em] font-bold mb-3 shadow-xs border transition-colors border-purple-200/60 bg-purple-50/50">
              <span
                className="w-1.5 h-1.5 rounded-full bg-[#7F48ED]"
              />
              <span className={isDark ? "text-purple-300" : "text-[#7F48ED]"}>
                PROVEN CLIENT IMPACT · EST. 2004
              </span>
            </div>

            <h2
              className={`font-heading font-black text-2xl sm:text-3xl md:text-4xl tracking-tight leading-tight ${
                isDark ? "text-white" : "text-[#090D16]"
              }`}
            >
              The Brands We&apos;ve <span className="text-[#7F48ED]">Helped.</span>
            </h2>
            <p
              className={`text-xs sm:text-sm max-w-2xl mx-auto mt-2 leading-relaxed ${
                isDark ? "text-slate-400" : "text-slate-600"
              }`}
            >
              From ambitious startups and regional staples to multi-location enterprises.
            </p>
          </MotionWrapper>
        )}
      </div>

      {/* Infinite Seamless Scrolling Logo Marquee */}
      <div className="relative w-full overflow-hidden z-10">
        {/* Left & Right Gradient Masks */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-r ${
            isDark ? "from-[#090D16] to-transparent" : "from-slate-50 to-transparent"
          }`}
        />
        <div
          className={`absolute right-0 top-0 bottom-0 w-16 sm:w-32 z-10 pointer-events-none bg-gradient-to-l ${
            isDark ? "from-[#090D16] to-transparent" : "from-slate-50 to-transparent"
          }`}
        />

        <div className="flex w-max animate-ticker hover:[animation-play-state:paused] py-3">
          {/* First loop */}
          <div className="flex items-center gap-8 sm:gap-12 px-6 shrink-0">
            {brandsHelpedList.map((brand, idx) => (
              <div
                key={`brand-1-${idx}`}
                className={`group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:scale-105 border border-transparent ${
                  isDark
                    ? "hover:border-[#7F48ED]/30 hover:bg-[#7F48ED]/5"
                    : "hover:border-slate-300 hover:bg-white"
                }`}
                title={brand.name}
              >
                <div className="relative h-12 sm:h-14 w-32 sm:w-40 flex items-center justify-center p-2 rounded-xl transition-all">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 130px, 160px"
                    className={`object-contain transition-all duration-300 ${
                      isDark
                        ? "brightness-100 opacity-80 group-hover:opacity-100"
                        : "brightness-0 opacity-70 group-hover:opacity-100"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-mono tracking-wider mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {brand.name}
                </span>
              </div>
            ))}
          </div>

          {/* Second loop for seamless infinite animation */}
          <div className="flex items-center gap-8 sm:gap-12 px-6 shrink-0" aria-hidden="true">
            {brandsHelpedList.map((brand, idx) => (
              <div
                key={`brand-2-${idx}`}
                className={`group flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl transition-all duration-300 hover:scale-105 border border-transparent ${
                  isDark
                    ? "hover:border-[#7F48ED]/30 hover:bg-[#7F48ED]/5"
                    : "hover:border-slate-300 hover:bg-white"
                }`}
                title={brand.name}
              >
                <div className="relative h-12 sm:h-14 w-32 sm:w-40 flex items-center justify-center p-2 rounded-xl transition-all">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    fill
                    sizes="(max-width: 640px) 130px, 160px"
                    className={`object-contain transition-all duration-300 ${
                      isDark
                        ? "brightness-100 opacity-80 group-hover:opacity-100"
                        : "brightness-0 opacity-70 group-hover:opacity-100"
                    }`}
                  />
                </div>
                <span
                  className={`text-[10px] font-mono tracking-wider mt-2 opacity-0 group-hover:opacity-100 transition-opacity ${
                    isDark ? "text-slate-400" : "text-slate-600"
                  }`}
                >
                  {brand.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
