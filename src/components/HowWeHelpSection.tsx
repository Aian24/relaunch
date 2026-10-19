"use client";

import React from "react";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { outcomeGroups } from "@/data/offerings";
import { ArrowRight, CheckCircle2, Search, Palette, Video, Code2 } from "lucide-react";

const iconsMap: Record<string, React.ReactNode> = {
  "get-found": <Search className="w-5 h-5 text-[#FF6700] group-hover:text-white transition-colors duration-200" />,
  "get-chosen": <Palette className="w-5 h-5 text-[#FF6700] group-hover:text-white transition-colors duration-200" />,
  "get-more-customers": <Video className="w-5 h-5 text-[#FF6700] group-hover:text-white transition-colors duration-200" />,
  "build-custom": <Code2 className="w-5 h-5 text-[#FF6700] group-hover:text-white transition-colors duration-200" />,
};

const pillarMap: Record<string, string> = {
  "get-found": "Search & AI Visibility",
  "get-chosen": "Brand & Reputation",
  "get-more-customers": "Paid Ads & Conversion",
  "build-custom": "Custom Engineering",
};

export default function HowWeHelpSection() {
  return (
    <section id="how-we-help" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 text-[#090D16] relative overflow-hidden">
      {/* Subtle atmospheric ambient glow in background */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-[#FF6700]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <MotionWrapper direction="up" distance={20} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-xs mb-4">
            <span className="w-2 h-2 rounded-full bg-[#FF6700] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold">
              HOW WE HELP
            </span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.08] mb-5">
            Four ways we bring you{" "}
            <span className="text-[#FF6700]">more customers.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base lg:text-lg leading-relaxed">
            Most businesses don&apos;t need more marketing noise. They need marketing that actually sells. We find where you&apos;re losing customers and fix that first.
          </p>
        </MotionWrapper>

        {/* 4 Outcome Cards Grid - Clean, Scannable White Cards, Orange-Only, Zero Star Icons, No Numbers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7 lg:gap-8">
          {outcomeGroups.map((group, idx) => (
            <MotionWrapper key={group.id} direction="up" delay={idx * 0.08} distance={25}>
              <div className="group relative h-full flex flex-col justify-between rounded-3xl bg-white p-7 sm:p-8 border border-slate-200/90 hover:border-[#FF6700]/60 shadow-[0_4px_24px_rgba(0,0,0,0.03),0_10px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_20px_50px_rgba(255,103,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">
                {/* Top Orange Accent Line */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-[#FF6700]" />

                <div>
                  {/* Card Header: Prominent Interactive Icon & Pillar Badge (Zero Numbers / Steps) */}
                  <div className="flex items-center justify-between gap-3 mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/80 flex items-center justify-center group-hover:bg-[#FF6700] group-hover:border-[#FF6700] transition-all duration-300 shadow-xs">
                      {iconsMap[group.id]}
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100/90 border border-slate-200/70 text-[11px] font-mono uppercase tracking-wider text-slate-600 font-bold group-hover:bg-orange-50 group-hover:border-orange-200/80 group-hover:text-[#FF6700] transition-colors duration-200">
                      {pillarMap[group.id] || "Growth Solution"}
                    </span>
                  </div>

                  {/* Outcome Title */}
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] tracking-tight mb-3 group-hover:text-[#FF6700] transition-colors">
                    {group.title}
                  </h3>

                  {/* Punchy, Scannable One-Liner Description */}
                  <p className="text-slate-600 text-sm sm:text-[15px] leading-relaxed mb-6 font-normal">
                    {group.homepageCardBody}
                  </p>

                  {/* Clean 3-Item Deliverables Checklist (No Stars, No Heavy Boxes) */}
                  <div className="space-y-2.5 mb-7">
                    {(group.homepageDeliverables && group.homepageDeliverables.length > 0
                      ? group.homepageDeliverables
                      : [group.homepageYouGet]
                    ).map((item, dIdx) => (
                      <div key={dIdx} className="flex items-start gap-2.5 text-xs sm:text-[13px] text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0 mt-0.5" />
                        <span className="font-medium leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer: Clear Price Anchor & Direct Action Button */}
                <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">Starting:</span>
                    <span className="text-sm sm:text-base font-heading font-black text-[#090D16]">
                      {group.startingPricePrefix || ""}{group.startingPrice}
                    </span>
                  </div>

                  <Link
                    href={group.productHref}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-sm hover:shadow-[0_4px_16px_rgba(255,103,0,0.35)] cursor-pointer group/btn"
                  >
                    <span>Explore Scope</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white transition-transform group-hover/btn:translate-x-1" />
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
