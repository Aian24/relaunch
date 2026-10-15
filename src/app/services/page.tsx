"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import { outcomeGroups, bundleDiscounts } from "@/data/offerings";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Search,
  Palette,
  Video,
  Code2,
  Calendar,
  Tag,
} from "lucide-react";

const iconsMap: Record<string, React.ReactNode> = {
  "get-found": <Search className="w-6 h-6 text-[#FF6700]" />,
  "get-chosen": <Palette className="w-6 h-6 text-[#FF6700]" />,
  "get-more-customers": <Video className="w-6 h-6 text-[#FF6700]" />,
  "build-custom": <Code2 className="w-6 h-6 text-[#FF6700]" />,
};

const imagesMap: Record<string, string> = {
  "get-found": "/images/service-ai.jpg",
  "get-chosen": "/images/service-brand.jpg",
  "get-more-customers": "/images/service-marketing.jpg",
  "build-custom": "/images/service-web.jpg",
};

export default function ServicesPage() {
  const { openContactModal } = useContactModal();

  const handleScrollToAnchor = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero Section with Cinematic Background Video */}
      <section className="relative w-full pt-36 sm:pt-44 pb-14 sm:pb-20 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            src="/services2.mp4"
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 0.7;
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/75 via-[#07090E]/40 to-[#07090E]" />
          <div className="absolute top-1/4 right-1/4 w-[450px] h-[350px] bg-[#FF6700]/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-10 left-10 w-[450px] h-[350px] bg-[#FF6700]/20 rounded-full blur-[140px]" />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold mb-3">
            WHAT WE DO
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4">
            Everything you need to <span className="text-[#FF6700]">get found,</span> get chosen and get paid.
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Four ways we help. Start with the one that&apos;s costing you the most, and add more when you&apos;re ready.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session" })}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-200 shadow-[0_0_20px_rgba(255,103,0,0.35)] cursor-pointer active:scale-98"
            >
              <span>Book a Strategy Call</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Jump Links */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-semibold text-slate-300">
            <span className="text-slate-500 font-mono text-[11px] uppercase mr-1">Jump to:</span>
            {outcomeGroups.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => handleScrollToAnchor(group.id)}
                className="px-3 py-1.5 rounded-lg bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.1] text-slate-200 hover:text-white transition-all cursor-pointer"
              >
                {group.title}
              </button>
            ))}
          </div>
        </MotionWrapper>
      </section>

      {/* 2. The 4 Outcome Groups */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto space-y-16 sm:space-y-24">
          {/* Pain-led Intro */}
          <MotionWrapper direction="up" distance={20} className="max-w-3xl mx-auto text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              THE REAL PROBLEM
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl lg:text-5xl text-[#090D16] tracking-tight mb-3">
              Find the leak. <span className="text-[#FF6700]">Close the gap.</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed font-normal">
              Most marketing looks fine on the outside, but quietly fails to close sales. We find where you&apos;re losing customers and fix that first.
            </p>
          </MotionWrapper>
          {outcomeGroups.map((group, idx) => (
            <MotionWrapper
              key={group.id}
              direction="up"
              distance={25}
              delay={idx * 0.08}
            >
              <div
                id={group.id}
                className="scroll-mt-24 p-8 sm:p-12 rounded-3xl bg-white border border-slate-200/90 shadow-sm"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Left Header & Problem (7 cols) */}
                  <div className="lg:col-span-7">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center">
                        {iconsMap[group.id]}
                      </div>
                      <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                        OUTCOME {group.num}
                      </span>
                    </div>

                    <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight mb-2">
                      {group.title}
                    </h2>
                    <p className="text-sm sm:text-base font-semibold text-[#FF6700] mb-4">
                      {group.problem}
                    </p>
                    <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                      {group.whatWeDo}
                    </p>

                    {/* Deliverables List */}
                    <div className="space-y-2.5 pt-2 mb-6">
                      <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-bold block mb-2">
                        What you get:
                      </span>
                      {group.deliverables.map((item) => (
                        <div key={item} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                          <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {/* Product Link & Price */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-4">
                      <Link
                        href={group.productHref}
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-[#FF6700] hover:text-[#E55C00] transition-colors group"
                      >
                        <span>{group.productCtaLabel}</span>
                      </Link>

                      <div className="text-right">
                        <span className="text-xs text-slate-400 block font-mono">Starting Price</span>
                        <span className="font-heading font-black text-lg text-[#090D16]">
                          {group.startingPricePrefix}
                          {group.startingPrice}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right Card / Summary Panel (5 cols) */}
                  <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 flex flex-col justify-between h-full">
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                        The Promise
                      </span>
                      <blockquote className="text-sm font-semibold text-slate-800 leading-snug mb-4">
                        &ldquo;{group.promise}&rdquo;
                      </blockquote>
                      <p className="text-xs text-slate-500 leading-relaxed mb-6">
                        Every service engagement is month-to-month. You own 100% of the code, designs, and assets we build.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: group.title })}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(255,103,0,0.25)] cursor-pointer active:scale-98"
                    >
                      <span>Inquire About {group.title}</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </section>

      {/* 3. Bundle Savings Banner - White Only as requested */}
      <section className="py-14 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16] border-y border-slate-200">
        <MotionWrapper direction="up" distance={20} className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF6700] text-xs font-mono font-bold uppercase tracking-wider mb-2">
              <Tag className="w-3.5 h-3.5" />
              <span>Multi-Service Discount</span>
            </div>
            <h3 className="font-heading font-bold text-xl sm:text-2xl text-[#090D16]">
              Using more than one?
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Bundle 2–3 services and save 10%, 4–5 and save 15%, 6 or more and save 20%. The discount applies to your whole monthly bill.
            </p>
          </div>

          <Link
            href="/pricing"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(255,103,0,0.25)] shrink-0 cursor-pointer"
          >
            <span>See Pricing &amp; Bundler</span>
            <ArrowRight className="w-3.5 h-3.5 text-white" />
          </Link>
        </MotionWrapper>
      </section>

      {/* 4. Final Call Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <MotionWrapper direction="up" distance={20} className="max-w-2xl mx-auto">
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-4">
            Not sure where to start?
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            That&apos;s what the strategy call is for. In 30 minutes we&apos;ll show you which one fix will make the biggest difference.
          </p>
          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(255,103,0,0.25)] transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Book a Strategy Call</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </button>
        </MotionWrapper>
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
