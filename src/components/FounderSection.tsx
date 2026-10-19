"use client";

import React from "react";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import { Users, CheckCircle2, ArrowUpRight } from "lucide-react";
import { companyCreds } from "@/data/offerings";

/**
 * "How we work" section on the homepage.
 * No founder name or photo for now (by request). Keeps the three promises and the CTA.
 */
export default function FounderSection() {
  const { openContactModal } = useContactModal();

  return (
    <section
      id="how-we-work"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16] select-none scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-4xl mx-auto">
        <MotionWrapper direction="up" distance={20} className="relative w-full">
          <div className="flex flex-col justify-center text-center items-center">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF6700] text-xs font-mono uppercase tracking-widest font-bold mb-3">
              <Users className="w-3.5 h-3.5 shrink-0" />
              <span>HOW WE WORK</span>
            </div>

            {/* Headline */}
            <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#090D16] tracking-tight leading-[1.1] mb-4">
              You&apos;ll work with senior people, <span className="text-[#FF6700]">not an account manager.</span>
            </h2>

            {/* Body */}
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mb-8 max-w-2xl">
              {companyCreds.team.bio}
            </p>

            {/* 3 Promises */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mb-8">
              {companyCreds.team.promises.map((p) => (
                <div
                  key={p.title}
                  className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#090D16] mb-1.5">
                    <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0" />
                    <span>{p.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">{p.description}</p>
                </div>
              ))}
            </div>

            {/* Action Button */}
            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session" })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer active:scale-98"
            >
              <span>Book a Strategy Call</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
