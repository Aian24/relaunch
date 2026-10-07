"use client";

import Link from "next/link";
import { contactInfo } from "@/data/navigation";
import { useContactModal } from "@/context/ContactModalContext";
import MotionWrapper from "./MotionWrapper";
import { Phone, Mail, ArrowUpRight, ArrowRight, Bot, Rocket } from "lucide-react";

export default function CtaBanner() {
  const { openContactModal } = useContactModal();

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white text-[#090D16] relative overflow-hidden select-none text-center border-t border-slate-200/80 scroll-mt-20">
      {/* Ambient Radial Accent Halo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#C0622A]/8 rounded-full blur-[140px] pointer-events-none z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionWrapper direction="up" distance={20} className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#C0622A] text-[10px] font-mono font-bold uppercase tracking-widest mb-4 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#C0622A] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#C0622A]"></span>
            </span>
            <span>Ready for Launch · Phoenix, AZ</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight mb-3 leading-tight">
            Let&apos;s build <span className="text-[#C0622A]">your mission.</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            Book a free strategy session, request an AI audit, or send us your project details. We&apos;ll map out exactly what your business needs — no pressure, no fluff.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session" })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C0622A] hover:bg-[#a84f1d] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_25px_rgba(192,98,42,0.3)] hover:shadow-[0_0_35px_rgba(192,98,42,0.45)] transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer hover:scale-102"
            >
              <span>Book a Strategy Session</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => openContactModal({ intent: "ai-audit" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer hover:scale-102"
            >
              <Bot className="w-3.5 h-3.5 text-emerald-400" />
              <span>Book an AI Audit</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              type="button"
              onClick={() => openContactModal({ intent: "start-project" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer hover:scale-102 shadow-xs"
            >
              <Rocket className="w-3.5 h-3.5 text-[#C0622A]" />
              <span>Start Your Project</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-500 pt-4 border-t border-slate-200/80">
            <a
              href={contactInfo.phoneTel}
              className="inline-flex items-center gap-2 hover:text-[#C0622A] transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-[#C0622A]" />
              <span>{contactInfo.phoneFormatted}</span>
            </a>

            <span className="text-slate-300">|</span>

            <a
              href={contactInfo.emailMailto}
              className="inline-flex items-center gap-2 hover:text-[#C0622A] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#C0622A]" />
              <span>{contactInfo.email}</span>
            </a>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}


