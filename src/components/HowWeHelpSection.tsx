"use client";

import React from "react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { outcomeGroups } from "@/data/offerings";
import { ArrowRight, CheckCircle2, Search, Palette, Video, Code2 } from "lucide-react";

const iconsMap: Record<string, React.ReactNode> = {
  "get-found": <Search className="w-5 h-5 text-[#FF6700]" />,
  "get-chosen": <Palette className="w-5 h-5 text-[#7F48ED]" />,
  "get-more-customers": <Video className="w-5 h-5 text-[#FF6700]" />,
  "build-custom": <Code2 className="w-5 h-5 text-[#7F48ED]" />,
};

export default function HowWeHelpSection() {
  return (
    <section id="how-we-help" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 text-[#090D16]">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <MotionWrapper direction="up" distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
            HOW WE HELP
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-[1.1] mb-4">
            Find the leak. Fix it. <span className="text-[#FF6700]">Grow.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Most businesses don&apos;t need more marketing. They need marketing that sells. We find where you&apos;re losing customers and fix that first.
          </p>
        </MotionWrapper>

        {/* 4 Outcome Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {outcomeGroups.map((group, idx) => (
            <MotionWrapper key={group.id} direction="up" delay={idx * 0.08} distance={25}>
              <div className="h-full flex flex-col justify-between rounded-3xl bg-white p-7 sm:p-9 border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.06)] hover:border-slate-300 transition-all">
                <div>
                  {/* Card Header with Number & Icon */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {group.num} // OUTCOME
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                      {iconsMap[group.id]}
                    </div>
                  </div>

                  {/* Title & Problem */}
                  <h3 className="font-heading font-black text-2xl text-[#090D16] tracking-tight mb-2">
                    {group.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#FF6700] mb-3">
                    {group.problem}
                  </p>

                  {/* Body explanation */}
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    {group.homepageCardBody}
                  </p>

                  {/* You get line */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6 text-xs sm:text-sm leading-relaxed">
                    <span className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold mr-2 inline">
                      You get:
                    </span>
                    <span className="text-slate-700 font-medium inline">
                      {group.homepageYouGet}
                    </span>
                  </div>
                </div>

                {/* Card Link */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={group.productHref}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF6700] hover:text-[#E55C00] transition-colors group"
                  >
                    <span>{group.productCtaLabel}</span>
                  </Link>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
