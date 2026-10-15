"use client";

import React from "react";
import Image from "next/image";
import MotionWrapper from "@/components/MotionWrapper";
import { brandsHelpedList } from "@/components/BrandsHelpedSection";

export default function ProofStrip() {
  return (
    <section className="py-8 sm:py-10 bg-white text-[#090D16] border-y border-slate-200 select-none overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionWrapper direction="up" distance={15}>
          {/* 1. Client Logo Strip */}
          <div className="mb-7 overflow-hidden">
            <div className="flex items-center justify-center flex-wrap gap-6 sm:gap-10 opacity-70 grayscale hover:grayscale-0 transition-all duration-300">
              {brandsHelpedList.slice(0, 6).map((brand) => (
                <div key={brand.name} className="relative h-7 w-24 sm:w-28 flex items-center justify-center">
                  <Image
                    src={brand.logo}
                    alt={brand.name}
                    width={110}
                    height={28}
                    className="object-contain max-h-7 w-auto"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* 2. Defensible Stat Numbers Strip */}
          <div className="pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-6 sm:gap-14 text-center">
            <div className="flex items-center gap-2.5">
              <span className="font-heading font-black text-2xl sm:text-3xl text-[#090D16]">1,500+</span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">projects delivered</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2.5">
              <span className="font-heading font-black text-2xl sm:text-3xl text-[#FF6700]">18 years</span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">in business</span>
            </div>
            <span className="hidden sm:inline text-slate-300">•</span>
            <div className="flex items-center gap-2.5">
              <span className="font-heading font-black text-2xl sm:text-3xl text-[#090D16]">480+</span>
              <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">campaigns launched</span>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
