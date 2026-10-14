"use client";

import React from "react";
import MotionWrapper from "@/components/MotionWrapper";
import { clientLogos } from "@/data/caseStudies";

export default function ProofStrip() {
  return (
    <section className="py-7 sm:py-9 bg-white text-[#090D16] border-y border-slate-200 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionWrapper direction="up" distance={15}>
          {/* Defensible Stat Numbers Strip */}
          <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-14 text-center">
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
