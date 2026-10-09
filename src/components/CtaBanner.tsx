"use client";

import Link from "next/link";
import { contactInfo } from "@/data/navigation";
import { useContactModal } from "@/context/ContactModalContext";
import MotionWrapper from "./MotionWrapper";
import { Phone, Mail, ArrowUpRight, ArrowRight, Bot, Rocket, Calendar } from "lucide-react";

export default function CtaBanner() {
  const { openContactModal } = useContactModal();

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white text-[#090D16] relative overflow-hidden select-none text-center border-t border-slate-200/80 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionWrapper direction="up" distance={20} className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#FF6700] text-[10px] font-mono font-bold uppercase tracking-widest mb-4 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6700] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6700]"></span>
            </span>
            <span>Ready for Launch · Phoenix, AZ</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight mb-3 leading-tight">
            Let&apos;s build <span className="text-[#FF6700]">your mission.</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            Book a free strategy session, request an AI audit, or launch your high-performance growth engine today.
          </p>

          {/* Action Buttons: Solid Colors Only */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-orange-50/80 hover:bg-orange-100 border border-orange-200/90 hover:border-orange-300 text-[#FF6700] hover:text-[#E55C00] font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer hover:scale-102"
            >
              <Calendar className="w-4 h-4 text-[#FF6700] shrink-0" />
              <span>Book a Strategy Session</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#FF6700]" />
            </button>

            <button
              type="button"
              onClick={() => openContactModal({ intent: "ai-audit" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-orange-50/80 hover:bg-orange-100 border border-orange-200/90 hover:border-orange-300 text-[#FF6700] hover:text-[#E55C00] font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer hover:scale-102"
            >
              <Bot className="w-4 h-4 text-[#FF6700] shrink-0" />
              <span>Book an AI Audit</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#FF6700]" />
            </button>

            <button
              type="button"
              onClick={() => openContactModal({ intent: "start-project" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer hover:scale-102"
            >
              <Rocket className="w-4 h-4 text-white shrink-0" />
              <span>Start Your Project</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-500 pt-4 border-t border-slate-200/80">
            <a
              href={contactInfo.phoneTel}
              className="inline-flex items-center gap-2 hover:text-[#FF6700] transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6700]" />
              <span>{contactInfo.phoneFormatted}</span>
            </a>

            <span className="text-slate-300">|</span>

            <a
              href={contactInfo.emailMailto}
              className="inline-flex items-center gap-2 hover:text-[#FF6700] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF6700]" />
              <span>{contactInfo.email}</span>
            </a>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
