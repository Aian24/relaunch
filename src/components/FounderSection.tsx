"use client";

import React from "react";
import Image from "next/image";
import MotionWrapper from "./MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import {
  User,
  Phone,
  Mail,
  MapPin,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

export default function FounderSection() {
  const { openContactModal } = useContactModal();

  return (
    <section
      id="founder"
      className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16] select-none scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto">
        <MotionWrapper
          direction="up"
          distance={20}
          className="relative w-full"
        >
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* LEFT: Founder Photo (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-lg border-2 border-white ring-1 ring-slate-200 bg-slate-100 group">
                <Image
                  src="/images/bobby-clark.jpg"
                  alt="Robert (Bobby) Clark - Founder of ReLaunch"
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              {/* Name & Title directly under photo - clean & seamless, no gradient */}
              <div className="mt-4 text-center">
                <span className="font-heading font-black text-xl text-[#090D16] block leading-tight">
                  Robert &ldquo;Bobby&rdquo; Clark
                </span>
                <span className="text-xs text-slate-500 font-medium block mt-0.5">
                  Founder &amp; Principal Strategist
                </span>
              </div>

              {/* Location & Years in Business */}
              <div className="mt-2 flex items-center justify-center gap-3 text-xs text-slate-500 font-medium">
                <span className="inline-flex items-center gap-1 text-[#7F48ED]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span className="text-slate-600">Phoenix, Arizona</span>
                </span>
                <span className="text-slate-300">•</span>
                <span className="inline-flex items-center gap-1 text-[#7F48ED]">
                  <Calendar className="w-3.5 h-3.5" />
                  <span className="text-slate-600">In Business Since 2004</span>
                </span>
              </div>
            </div>

            {/* RIGHT: Bio & Simple Highlights (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-left items-center lg:items-start">
              {/* Simple Header Badge - Human User Icon (No AI icons) */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-[#7F48ED] text-xs font-mono uppercase tracking-widest font-bold mb-3">
                <User className="w-3.5 h-3.5 shrink-0" />
                <span>MEET THE FOUNDER</span>
              </div>

              {/* Headline */}
              <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#090D16] tracking-tight leading-[1.1] mb-3">
                <span>22 Years Building in </span>
                <span className="text-[#7F48ED]">Phoenix</span>
              </h2>

              {/* Super Simple Founder Note */}
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal mb-5 max-w-xl">
                &ldquo;When you work with ReLaunch, you talk directly with me and our senior team. No junior account managers, no confusing retainers—just proven work that helps your business grow.&rdquo;
              </p>

              {/* 3 Simple Value Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-6">
                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#090D16] mb-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#7F48ED] shrink-0" />
                    <span>Senior Team</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    Work directly with Bobby and experienced builders.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#090D16] mb-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#7F48ED] shrink-0" />
                    <span>You Own It All</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    All code, designs, and accounts belong 100% to you.
                  </p>
                </div>

                <div className="p-3.5 rounded-2xl bg-white border border-slate-200 shadow-2xs text-left">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#090D16] mb-1">
                    <Calendar className="w-3.5 h-3.5 text-[#7F48ED] shrink-0" />
                    <span>22-Year History</span>
                  </div>
                  <p className="text-xs text-slate-500 leading-snug">
                    Helping businesses grow right here in Arizona since 2004.
                  </p>
                </div>
              </div>

              {/* Direct Contact Buttons - Purple Theme */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 w-full pt-2">
                <a
                  href="tel:4807799875"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-800 transition-colors shadow-2xs"
                >
                  <Phone className="w-3.5 h-3.5 text-[#7F48ED]" />
                  <span>(480) 779-9875</span>
                </a>

                <a
                  href="mailto:robert@relaunch.us"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-mono font-semibold text-slate-800 transition-colors shadow-2xs"
                >
                  <Mail className="w-3.5 h-3.5 text-[#7F48ED]" />
                  <span>robert@relaunch.us</span>
                </a>

                <button
                  type="button"
                  onClick={() => openContactModal({ intent: "strategy-session" })}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#7F48ED] hover:bg-[#6D28D9] text-white text-xs font-heading font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm active:translate-y-0.5 cursor-pointer"
                >
                  <span>Book a Strategy Call</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
