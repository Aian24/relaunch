"use client";

import React from "react";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import { ArrowUpRight, PhoneCall, FileText, CheckCircle2 } from "lucide-react";

export default function HowItWorksSection() {
  const { openContactModal } = useContactModal();

  const steps = [
    {
      step: "01",
      title: "Strategy call.",
      body: "30 minutes. We find where you're losing sales.",
      icon: <PhoneCall className="w-5 h-5 text-[#7F48ED]" />,
    },
    {
      step: "02",
      title: "Your plan.",
      body: "A written plan: what to fix first, what it costs, what you'll see.",
      icon: <FileText className="w-5 h-5 text-[#7F48ED]" />,
    },
    {
      step: "03",
      title: "We build and run it.",
      body: "Monthly report in your numbers. Month-to-month. You own everything.",
      icon: <CheckCircle2 className="w-5 h-5 text-[#7F48ED]" />,
    },
  ];

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16]">
      <div className="max-w-7xl mx-auto">
        <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
            HOW IT WORKS
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-[1.1]">
            Three steps. <span className="text-[#7F48ED]">No long contracts.</span>
          </h2>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {steps.map((item, idx) => (
            <MotionWrapper key={item.step} direction="up" delay={idx * 0.1} distance={20}>
              <div className="h-full flex flex-col justify-between p-7 sm:p-8 rounded-3xl bg-slate-50 border border-slate-200/90 relative overflow-hidden group hover:border-[#7F48ED]/40 transition-all">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#7F48ED]/70">
                      STEP {item.step}
                    </span>
                    <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 flex items-center justify-center">
                      {item.icon}
                    </div>
                  </div>
                  <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.body}
                  </p>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>

        <MotionWrapper direction="up" delay={0.3} className="text-center">
          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(255,103,0,0.35)] cursor-pointer active:scale-98"
          >
            <span>Book a Strategy Call</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </button>
        </MotionWrapper>
      </div>
    </section>
  );
}
