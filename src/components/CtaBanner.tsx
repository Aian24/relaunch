"use client";

import Link from "next/link";
import { contactInfo } from "@/data/navigation";
import { useContactModal } from "@/context/ContactModalContext";
import MotionWrapper from "./MotionWrapper";
import { Phone, Mail, ArrowUpRight, Calendar } from "lucide-react";

export interface CtaBannerProps {
  badgeText?: string;
  titleRegular?: string;
  titleHighlight?: string;
  description?: string;
}

export default function CtaBanner({
  badgeText = "Ready for Launch · Phoenix, AZ",
  titleRegular = "Let's build",
  titleHighlight = "your mission.",
  description = "Book a strategy call to build your predictable marketing pipeline, or explore our real client case studies.",
}: CtaBannerProps = {}) {
  const { openContactModal } = useContactModal();

  return (
    <section id="contact" className="py-20 sm:py-28 bg-white text-[#090D16] relative overflow-hidden select-none text-center scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <MotionWrapper direction="up" distance={20} className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200/60 text-[#FF6700] text-[10px] font-mono font-bold uppercase tracking-widest mb-4 shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FF6700] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FF6700]"></span>
            </span>
            <span>{badgeText}</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight mb-3 leading-tight">
            {titleRegular} <span className="text-[#FF6700]">{titleHighlight}</span>
          </h2>

          <p className="text-slate-600 text-xs sm:text-base max-w-xl mx-auto mb-8 leading-relaxed font-normal">
            {description}
          </p>

          {/* Action Buttons: Unified Primary + Secondary Pair with identical solid orange bg */}
          <div className="flex flex-wrap items-center justify-center gap-3.5 mb-8">
            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session" })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(255,103,0,0.25)] transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer hover:scale-102"
            >
              <Calendar className="w-4 h-4 text-white shrink-0" />
              <span>Book a Strategy Call</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </button>

            <Link
              href="/work"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(255,103,0,0.25)] transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer hover:scale-102"
            >
              <span>View Case Studies</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-6 text-xs sm:text-sm font-medium text-slate-500 pt-2">
            <a
              href={contactInfo.phoneTel}
              className="inline-flex items-center gap-2 hover:text-[#FF6700] transition-colors font-mono"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6700]" />
              <span>{contactInfo.phoneFormatted}</span>
            </a>

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
