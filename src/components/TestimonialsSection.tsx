"use client";

import { testimonialsData } from "@/data/testimonials";
import MotionWrapper from "./MotionWrapper";
import SpotlightCard from "./SpotlightCard";
import { Star } from "lucide-react";

export default function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-white border-b border-slate-200/80 select-none scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Scroll Up Reveal */}
        <MotionWrapper direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
            CLIENT VOICES · 22+ YEARS OF TRUST
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.05] mb-3">
            Real businesses. <span className="text-[#FF6700] italic">Real outcomes.</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
            Hear directly from founders, directors, and operators who rely on ReLaunch as their growth partner.
          </p>
        </MotionWrapper>

        {/* Testimonials Cards Grid - Unified Orange Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 w-full">
          {testimonialsData.map((testi, idx) => (
            <MotionWrapper
              key={testi.id}
              direction="up"
              delay={idx * 0.1}
              distance={35}
            >
              <SpotlightCard
                spotlightColor="rgba(255,103,0, 0.12)"
                className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between relative hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] hover:border-[#FF6700]/40 transition-all duration-300 h-full"
              >
                <div>
                  {/* 5 Stars */}
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-[#FF6700] stroke-[#FF6700]"
                      />
                    ))}
                  </div>

                  <blockquote className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal italic mb-6">
                    &ldquo;{testi.quote}&rdquo;
                  </blockquote>
                </div>

                {/* Author Info */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <div className="font-heading font-bold text-xs sm:text-sm text-[#090D16]">
                      {testi.name}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      {testi.company}
                    </div>
                  </div>

                  <span className="text-[10px] font-semibold text-[#FF6700] bg-orange-50 px-2.5 py-1 rounded-full border border-[#FF6700]/20">
                    {testi.serviceUsed}
                  </span>
                </div>
              </SpotlightCard>
            </MotionWrapper>
          ))}
        </div>
      </div>
    </section>
  );
}
