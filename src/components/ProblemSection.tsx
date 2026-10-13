"use client";

import React from "react";
import MotionWrapper from "./MotionWrapper";
import {
  Globe,
  DollarSign,
  Share2,
  AlertCircle,
} from "lucide-react";

interface ProblemCard {
  number: string;
  tag: string;
  title: string;
  shortDesc: string;
  impact: string;
  icon: React.ComponentType<{ className?: string }>;
}

const problems: ProblemCard[] = [
  {
    number: "01",
    tag: "WEBSITE",
    title: "Outdated Website",
    shortDesc:
      "Buyers check your site before calling. If it looks old or slow, they click away and hire your competitor.",
    impact: "Lost leads to competitors before they call",
    icon: Globe,
  },
  {
    number: "02",
    tag: "ADS",
    title: "Wasted Ad Money",
    shortDesc:
      "Spending money on Google or Meta ads without knowing which clicks actually become paying customers.",
    impact: "Wasted ad spend with zero tracked sales",
    icon: DollarSign,
  },
  {
    number: "03",
    tag: "BRAND",
    title: "Inconsistent Digital Presence",
    shortDesc:
      "An outdated or quiet presence makes your company look less credible than the actual quality of your work.",
    impact: "Looking less credible than the work deserves",
    icon: Share2,
  },
];

export default function ProblemSection() {
  return (
    <section
      id="problem"
      className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16] select-none scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto relative">
        {/* Simple, Short Section Header */}
        <MotionWrapper
          direction="up"
          distance={20}
          className="text-center max-w-3xl mx-auto mb-8 sm:mb-10"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 text-[#7F48ED] text-xs font-mono uppercase tracking-widest font-bold mb-3 border border-purple-200">
            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
            <span>WHERE MONEY GETS LOST</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-4xl lg:text-5xl text-[#090D16] tracking-tight leading-[1.1] mb-2.5">
            <span>3 Problems That Cost You </span>
            <span className="text-[#7F48ED] block sm:inline">Customers</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal max-w-xl mx-auto">
            You don&apos;t always need more ad spend. Usually, one of these three common issues is holding your sales back:
          </p>
        </MotionWrapper>

        {/* 3 Purple Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {problems.map((item, idx) => {
            const Icon = item.icon;

            return (
              <MotionWrapper
                key={item.number}
                direction="up"
                delay={idx * 0.08}
                distance={25}
                className="h-full"
              >
                <div className="group flex flex-col justify-between rounded-3xl p-6 sm:p-7 bg-white border border-slate-200 shadow-xs hover:border-[#7F48ED]/60 hover:shadow-md transition-all duration-300 h-full relative overflow-hidden">
                  <div>
                    {/* Top Tag & Number */}
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full bg-purple-50 text-[#7F48ED] border border-purple-200/70">
                        {item.tag}
                      </span>
                      <span className="text-xs font-mono font-bold text-purple-300">
                        #{item.number}
                      </span>
                    </div>

                    {/* Icon & Title */}
                    <div className="flex items-center gap-3 mb-2.5">
                      <div className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 bg-purple-50 border border-purple-100 text-[#7F48ED] group-hover:bg-[#7F48ED] group-hover:text-white transition-all duration-200">
                        <Icon className="w-5 h-5 transition-colors" />
                      </div>
                      <h3 className="font-heading font-black text-lg sm:text-xl text-[#090D16] group-hover:text-[#7F48ED] transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* Short, Simple Description */}
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4 font-normal">
                      {item.shortDesc}
                    </p>
                  </div>

                  {/* Simple Impact Footnote without harsh divider */}
                  <div className="pt-2 flex items-center gap-2 text-xs text-purple-900/80 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7F48ED] shrink-0" />
                    <span>{item.impact}</span>
                  </div>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
