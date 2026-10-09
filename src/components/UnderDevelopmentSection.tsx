"use client";

import React from "react";
import MotionWrapper from "./MotionWrapper";
import { Construction, Clock, ArrowRight } from "lucide-react";
import { useContactModal } from "@/context/ContactModalContext";

interface UnderDevelopmentProps {
  id: string;
  title: string;
  subtitle?: string;
}

export default function UnderDevelopmentSection({
  id,
  title,
  subtitle,
}: UnderDevelopmentProps) {
  const { openContactModal } = useContactModal();

  return (
    <section
      id={id}
      className="py-10 sm:py-14 bg-slate-50 border-b border-slate-200 scroll-mt-20 select-none relative overflow-hidden"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <MotionWrapper direction="left" distance={45}>
          {/* Construction Blueprint Card with Dashed Border */}
          <div className="bg-white rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#FF6700]/40 shadow-sm p-6 sm:p-10 text-center relative overflow-hidden">
            {/* Top Amber Accent Bar */}
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-[#FF6700]" />

            {/* Icon */}
            <div className="w-14 h-14 rounded-2xl bg-orange-50 border border-[#FF6700]/20 text-[#FF6700] flex items-center justify-center mx-auto mb-4 shadow-xs">
              <Construction className="w-7 h-7" />
            </div>

            {/* Status Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100/70 border border-[#FF6700]/30 text-[#FF6700] text-xs font-mono font-black uppercase tracking-wider mb-3">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6700] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6700]"></span>
              </span>
              <span>UNDER DEVELOPMENT · SPRINT 2</span>
            </div>

            {/* Feature Title */}
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] tracking-tight mb-5">
              {title}
            </h2>

            {subtitle && (
              <p className="text-slate-600 text-xs sm:text-sm max-w-xl mx-auto leading-relaxed mb-5 font-normal">
                {subtitle}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium px-3.5 py-2 rounded-xl bg-slate-100 border border-slate-200">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Phase 2 Release · In Progress</span>
              </span>

              <button
                type="button"
                onClick={() =>
                  openContactModal({
                    intent: "strategy-session",
                    notes: `Inquiry regarding ${title} (Sprint 2 rollout).`,
                  })
                }
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-[#090D16] hover:bg-[#FF6700] text-white text-xs font-bold font-heading uppercase tracking-wider rounded-xl transition-all shadow-sm active:translate-y-0.5 cursor-pointer"
              >
                <span>Book Strategy Call</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
