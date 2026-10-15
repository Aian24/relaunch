"use client";

import React from "react";
import Image from "next/image";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import { User, CheckCircle2, ShieldCheck, ArrowUpRight } from "lucide-react";
import { companyCreds } from "@/data/offerings";

export default function FounderSection() {
  const { openContactModal } = useContactModal();

  return (
    <section
      id="founder"
      className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16] select-none scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <MotionWrapper direction="up" distance={20} className="relative w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
            {/* LEFT: Founder Photo (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-slate-200 bg-slate-100 group">
                <Image
                  src={companyCreds.founder.photo}
                  alt={companyCreds.founder.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="mt-4 text-center">
                <span className="font-heading font-black text-xl text-[#090D16] block leading-tight">
                  {companyCreds.founder.name}
                </span>
                <span className="text-xs text-slate-500 font-medium block mt-0.5">
                  Founder &amp; Principal Strategist
                </span>
              </div>
            </div>

            {/* RIGHT: Empathy Story & 3 Promises (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7F48ED] text-xs font-mono uppercase tracking-widest font-bold mb-3">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>MEET BOBBY</span>
              </div>

              {/* Headline */}
              <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#090D16] tracking-tight leading-[1.1] mb-4">
                You&apos;ll talk to me, <span className="text-[#7F48ED]">not an account manager.</span>
              </h2>

              {/* Body */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mb-8 max-w-xl">
                {companyCreds.founder.bio}
              </p>

              {/* 3 Promises */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 w-full mb-8">
                {companyCreds.founder.promises.map((p) => (
                  <div
                    key={p.title}
                    className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left"
                  >
                    <div className="flex items-center gap-2 text-xs font-bold text-[#090D16] mb-1.5">
                      <CheckCircle2 className="w-4 h-4 text-[#7F48ED] shrink-0" />
                      <span>{p.title}</span>
                    </div>
                    <p className="text-xs text-slate-500 leading-snug">
                      {p.description}
                    </p>
                  </div>
                ))}
              </div>

              {/* Action Button */}
              <button
                type="button"
                onClick={() => openContactModal({ intent: "strategy-session" })}
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#7F48ED] hover:bg-[#6C34DE] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-md cursor-pointer active:scale-98"
              >
                <span>Book a Strategy Call</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
