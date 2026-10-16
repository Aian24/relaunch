"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
import BundleCalculator from "@/components/BundleCalculator";
import HeroScrollIndicator from "@/components/HeroScrollIndicator";
import { useContactModal } from "@/context/ContactModalContext";
import { outcomeGroups, bundleDiscounts } from "@/data/offerings";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
  Calendar,
  Tag,
  ChevronDown,
  ShieldCheck,
} from "lucide-react";

export default function PricingPage() {
  const { openContactModal } = useContactModal();
  const [showCalculator, setShowCalculator] = useState(false);

  const faqs = [
    {
      q: "How do I get started?",
      a: "Book a free 30-minute strategy call. We'll recommend where to start and send a written plan with prices.",
    },
    {
      q: "Is there a contract?",
      a: "No. Every service is month-to-month. Pause or cancel anytime.",
    },
    {
      q: "Who owns the work?",
      a: "You do. Your website, code, designs, ads and accounts are yours from day one.",
    },
    {
      q: "Is ad spend included?",
      a: "No. Ad budgets are paid directly to Google, Meta or TikTok, so you always see exactly what was spent.",
    },
    {
      q: "Do you work with businesses outside the U.S.?",
      a: "Yes. We're fully remote and work with clients across the U.S., Canada, the UK and Australia.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero Section (Full Screen) */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center pt-32 sm:pt-36 pb-20 sm:pb-24 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,103,0,0.18),transparent_75%)]" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-[#FF6700]/15 rounded-full blur-[140px]" />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center my-auto">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold mb-4 px-3 py-1 rounded-full bg-[#FF6700]/10 border border-[#FF6700]/20 backdrop-blur-xs">
            PRICING
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5">
            Clear monthly pricing. <span className="text-[#FF6700]">No long contracts.</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8">
            Pick what you need, pause or cancel anytime, and save when you combine services.
          </p>

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.08] border border-white/[0.16] text-xs sm:text-sm font-mono text-slate-300 backdrop-blur-xs">
            <ShieldCheck className="w-4 h-4 text-[#FF6700]" />
            <span>Month-to-month · You own everything we make · Bundle and save up to 20%</span>
          </div>
        </MotionWrapper>

        {/* Scroll Indicator */}
        <HeroScrollIndicator targetId="pricing-grid" accentColor="#FF6700" />
      </section>

      {/* 2. Starting Prices (4 Cards) */}
      <section id="pricing-grid" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {outcomeGroups.map((group, idx) => (
              <MotionWrapper key={group.id} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full flex flex-col justify-between p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md transition-all">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-2">
                      {group.num} // {group.title}
                    </span>

                    <div className="mb-4">
                      <span className="text-xs text-slate-400 block font-mono">
                        {group.startingPricePrefix ? "Starting" : "Pricing Model"}
                      </span>
                      <div className="font-heading font-black text-2xl sm:text-3xl text-[#090D16]">
                        {group.startingPricePrefix}
                        {group.startingPrice}
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
                      {group.priceNote}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: group.title })}
                      className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xs"
                    >
                      <span>Book a Strategy Call</span>
                      <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                    </button>

                    <Link
                      href={group.productHref}
                      className="text-center text-xs font-semibold text-slate-500 hover:text-[#FF6700] transition-colors py-1"
                    >
                      Learn more →
                    </Link>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>

          {/* 3. Bundle Discounts Strip & Interactive Calculator Deep Link - White Background as requested */}
          <MotionWrapper direction="up" distance={20}>
            <div id="bundle-calculator" className="scroll-mt-24 rounded-3xl bg-white border border-slate-200 text-[#090D16] p-8 sm:p-12 mb-16 relative overflow-hidden shadow-xs">
              <div className="max-w-3xl mb-8">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF6700] text-xs font-mono font-bold uppercase tracking-wider mb-3">
                  <Tag className="w-3.5 h-3.5" />
                  <span>Bundle &amp; Save</span>
                </div>
                <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight mb-2">
                  Combine services and save.
                </h2>
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                  2–3 services: <strong>10% off</strong> · 4–5 services: <strong>15% off</strong> · 6 or more: <strong>20% off</strong>. The discount applies to your whole monthly bill.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowCalculator(!showCalculator)}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(255,103,0,0.25)] cursor-pointer active:scale-98"
              >
                <span>{showCalculator ? "Hide Bundle Calculator" : "Build your own bundle →"}</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showCalculator ? "rotate-180" : ""}`} />
              </button>

              {/* Interactive Calculator Drawer */}
              {showCalculator && (
                <div className="mt-8 pt-8 border-t border-slate-200">
                  <BundleCalculator />
                </div>
              )}
            </div>
          </MotionWrapper>

          {/* 4. Optional Add-On (Social Audit) */}
          <MotionWrapper direction="up" distance={20}>
            <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 mb-20">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#FF6700] font-bold block mb-1">
                  OPTIONAL ADD-ON · NO OBLIGATION
                </span>
                <h3 className="font-heading font-bold text-xl text-[#090D16] mb-1">
                  Want a deeper look first?
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
                  The full ReLaunch Social Audit scores how well your marketing sells and gives you a written list of what to fix first. $495, one time.
                </p>
              </div>

              <Link
                href="/audit"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(255,103,0,0.25)] whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Get your free score →</span>
              </Link>
            </div>
          </MotionWrapper>

          {/* 5. Questions (Folded FAQs from /faq) */}
          <div className="max-w-4xl mx-auto">
            <MotionWrapper direction="up" distance={20} className="text-center mb-12">
              <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
                FAQ
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
                Frequently Asked Questions
              </h2>
            </MotionWrapper>

            <div className="space-y-4">
              {faqs.map((faq, idx) => (
                <MotionWrapper key={idx} direction="up" delay={idx * 0.05} distance={15}>
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                    <h3 className="font-heading font-bold text-base text-[#090D16] mb-2">
                      {faq.q}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {faq.a}
                    </p>
                  </div>
                </MotionWrapper>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 6. Final Call */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-center border-t border-slate-100">
        <MotionWrapper direction="up" distance={20} className="max-w-2xl mx-auto">
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-4">
            Get a price built <span className="text-[#FF6700]">around your business.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Tell us what&apos;s going on and we&apos;ll send a written plan with exact prices. No pressure, no obligation.
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
