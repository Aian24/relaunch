"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
import HeroScrollIndicator from "@/components/HeroScrollIndicator";
import StudioAdCarousel from "@/components/StudioAdCarousel";
import StudioWhitelistingSection from "@/components/StudioWhitelistingSection";
import { useContactModal } from "@/context/ContactModalContext";
import { studioData } from "@/data/studioSubBrand";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  ShieldCheck,
  Sparkles,
  Check,
  Share2,
} from "lucide-react";

const STUDIO_CTA = "Start with ReLaunch Studio";
const ACCENT = "#7F48ED";

export default function StudioPage() {
  const { openContactModal } = useContactModal();
  const heroVideoRef = useRef<HTMLVideoElement>(null);

  const handleScrollToSection = (id: string) => {
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

      {/* 1. Standardized Hero Section with Full-Bleed studio.mp4 Video Background */}
      <section
        id="hero"
        className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center pt-32 sm:pt-36 pb-20 sm:pb-24 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none"
      >
        {/* Full-Bleed Background Video with High-Definition Color & Balanced Overlays */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            ref={heroVideoRef}
            src="/studio.mp4"
            autoPlay
            loop
            muted
            playsInline
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 0.75;
            }}
            onPlay={(e) => {
              e.currentTarget.playbackRate = 0.75;
            }}
            className="absolute inset-0 w-full h-full object-cover brightness-105 contrast-105 saturate-110"
          />
          {/* Crisp balanced overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/30 via-transparent to-[#07090E]/65 z-1" />
          {/* Targeted Center Radial Scrim */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(7,9,14,0.40)_0%,rgba(7,9,14,0.15)_60%,transparent_100%)] z-1 pointer-events-none" />
          {/* Subtle luminous ambient accents */}
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-[#7F48ED]/20 rounded-full blur-[140px] z-1 pointer-events-none" />
          <div className="absolute bottom-10 left-10 w-[360px] h-[360px] bg-[#FF6700]/10 rounded-full blur-[100px] z-1 pointer-events-none" />
        </div>

        {/* Hero Content Container (Centered layout matching Homepage and other pages) */}
        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center my-auto flex flex-col items-center">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#A78BFA] font-bold mb-4 px-4 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-[#7F48ED]/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all">
            RELAUNCH STUDIO · VIDEO CREATION &amp; STRATEGIC BRANDING
          </span>

          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            Video Branding That Captivates. <br className="hidden sm:inline" />
            <span style={{ color: ACCENT }} className="drop-shadow-[0_4px_24px_rgba(127,72,237,0.45)]">
              Creative That Converts.
            </span>
          </h1>

          <p className="text-white/95 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-8 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-medium">
            Weekly high-converting video creative for Meta, TikTok and Shorts. We test multiple hooks to lower your ad costs—built to turn scrollers into paying customers.
          </p>

          {/* Stats Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8 p-4 rounded-2xl bg-white/[0.04] border border-white/10 backdrop-blur-md w-full max-w-2xl">
            {studioData.stats.map((s, idx) => (
              <div key={idx} className="text-center">
                <div className="font-heading font-black text-xl sm:text-2xl text-white">
                  {s.value}
                  <span style={{ color: ACCENT }}>{s.suffix}</span>
                </div>
                <div className="text-[11px] font-mono text-slate-300 font-medium leading-tight mt-0.5">
                  {s.label}
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <button
              type="button"
              onClick={() =>
                openContactModal({
                  intent: "strategy-session",
                  serviceInterest: "ReLaunch Studio",
                  notes: "Interested in the weekly video branding & creative drop subscription.",
                })
              }
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-200 shadow-[0_0_30px_rgba(127,72,237,0.45)] hover:shadow-[0_0_40px_rgba(127,72,237,0.6)] cursor-pointer active:scale-98 whitespace-nowrap"
              style={{ backgroundColor: ACCENT }}
            >
              <span>{STUDIO_CTA}</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>

            <button
              type="button"
              onClick={() => handleScrollToSection("studio-reels")}
              className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] border border-white/20 hover:border-white/45 text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] cursor-pointer whitespace-nowrap group"
            >
              <span>Explore Video Reels ↓</span>
              <ArrowRight className="w-4 h-4 text-[#A78BFA] group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {/* Trust Line Protected Pill - Frosted Glass Effect */}
          <div className="inline-flex items-center justify-center gap-2 text-xs sm:text-sm text-slate-200 font-mono px-4 sm:px-6 py-2.5 rounded-full bg-white/[0.07] border border-white/20 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.25)] mx-auto">
            <ShieldCheck className="w-4 h-4 text-[#A78BFA] shrink-0" />
            <span className="text-center">
              Weekly Deliveries · Full Commercial Ownership · Runs In Your Own Accounts
            </span>
          </div>
        </MotionWrapper>

        {/* Scroll Indicator */}
        <HeroScrollIndicator targetId="studio-reels" accentColor={ACCENT} />
      </section>

      {/* 2. Wonder Theme-Style Ad & Brand Reels Showcase Carousel */}
      <StudioAdCarousel />

      {/* 3. Problem Section: Traditional Video vs. ReLaunch Studio */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16]">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest font-bold block mb-2" style={{ color: ACCENT }}>
              WHY TRADITIONAL VIDEO FAILS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Ads wear out fast. Video shoots are too slow.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Traditional filming takes weeks. We deliver fresh batches every week with multiple hook tests.
            </p>
          </MotionWrapper>

          {/* Clean 2-Column Comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* The Old Way */}
            <MotionWrapper direction="up" delay={0.05} distance={20}>
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-700 text-[10px] font-mono font-bold uppercase">
                      Traditional Video Agencies
                    </span>
                    <span className="text-xs font-mono text-slate-400">High Overhead</span>
                  </div>
                  <h3 className="font-heading font-black text-xl text-slate-900 mb-4">
                    {studioData.comparison.traditional.cost}
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
                    {studioData.comparison.traditional.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <span className="text-rose-500 font-bold">✕</span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-2 text-[11px] font-mono text-slate-500">
                  Result: High ad costs and slow creative testing.
                </div>
              </div>
            </MotionWrapper>

            {/* ReLaunch Studio */}
            <MotionWrapper direction="up" delay={0.1} distance={20}>
              <div className="h-full p-6 sm:p-7 rounded-3xl bg-white border-2 border-[#7F48ED] shadow-xl flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#7F48ED]/10 rounded-bl-full pointer-events-none" />
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="px-3 py-1 rounded-full bg-[#7F48ED] text-white text-[10px] font-mono font-bold uppercase">
                      ReLaunch Studio
                    </span>
                    <span className="text-xs font-mono text-[#7F48ED] font-bold">85% Lower Cost</span>
                  </div>
                  <h3 className="font-heading font-black text-xl text-[#090D16] mb-4">
                    {studioData.comparison.relaunchStudio.cost}
                  </h3>
                  <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700">
                    {studioData.comparison.relaunchStudio.points.map((pt, pIdx) => (
                      <li key={pIdx} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-[#7F48ED] shrink-0 mt-0.5" />
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 pt-2 text-[11px] font-mono text-[#7F48ED] font-bold">
                  Result: Continuous testing, lower CPAs, and fresh creative drops every week.
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* 5. Production Cadence: Weekly Sprint */}
      <section id="weekly-cadence" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest font-bold block mb-2" style={{ color: ACCENT }}>
              WEEKLY SPRINT CADENCE
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Monday to Friday. Fresh ads in your account.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {studioData.workflowCadence.map((st, idx) => (
              <MotionWrapper key={st.step} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full p-6 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between hover:border-[#7F48ED]/40 transition-colors">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="w-8 h-8 rounded-full bg-[#7F48ED]/10 text-[#7F48ED] font-mono font-bold text-xs flex items-center justify-center">
                        {st.step}
                      </span>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                        {st.day}
                      </span>
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#090D16] mb-2">
                      {st.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {st.desc}
                    </p>
                  </div>
                  <div className="mt-4 pt-2 flex items-center gap-1.5 text-[10px] font-mono text-[#7F48ED] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Done For You</span>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Creator Whitelisting Section (Interactive Smartphone Reel) */}
      <StudioWhitelistingSection />

      {/* 7. Transparent Retainer Pricing */}
      <section id="pricing" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest font-bold block mb-2" style={{ color: ACCENT }}>
              SUBSCRIPTION TIERS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Clear Monthly Retainers. No Contracts.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Month-to-month. Pause or scale anytime as your ad budget changes.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-stretch">
            {studioData.tiers.map((tier, idx) => (
              <MotionWrapper key={tier.id} direction="up" delay={idx * 0.08} distance={20}>
                <div
                  className={`h-full rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 ${
                    tier.popular
                      ? "bg-white border-2 border-[#7F48ED] shadow-2xl relative"
                      : "bg-white border border-slate-200 shadow-sm hover:shadow-md"
                  }`}
                >
                  {tier.popular && (
                    <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-[#7F48ED] text-white text-[10px] font-mono font-bold uppercase tracking-wider shadow-md">
                      Most Popular
                    </div>
                  )}

                  <div>
                    {/* Header */}
                    <div className="mb-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                        {tier.badge}
                      </span>
                      <h3 className="font-heading font-black text-xl text-[#090D16]">
                        {tier.name}
                      </h3>
                      <div className="mt-3 flex items-baseline gap-1.5">
                        <span className="font-heading font-black text-3xl sm:text-4xl text-[#090D16]">
                          ${tier.price.toLocaleString()}
                        </span>
                        <span className="text-xs font-mono text-slate-500">/ month</span>
                      </div>
                      <div className="mt-1.5 text-xs font-mono text-[#7F48ED] font-bold">
                        {tier.cadence}
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed mb-5 py-1">
                      {tier.description}
                    </p>

                    {/* Deliverables List */}
                    <div className="space-y-2 mb-6">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                        Includes:
                      </span>
                      {tier.deliverables.map((d, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2.5 text-xs text-slate-700">
                          <Check className="w-4 h-4 text-[#7F48ED] shrink-0 mt-0.5" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        openContactModal({
                          intent: "start-project",
                          serviceInterest: `ReLaunch Studio (${tier.name})`,
                          notes: `Interested in the ${tier.name} tier ($${tier.price}/mo).`,
                        })
                      }
                      className={`w-full py-3.5 px-6 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-98 ${
                        tier.popular
                          ? "bg-[#7F48ED] hover:bg-[#6B38D4] text-white"
                          : "bg-slate-900 hover:bg-black text-white"
                      }`}
                    >
                      <span>Choose {tier.name}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <p className="text-[10px] font-mono text-slate-400 text-center mt-2">
                      {tier.recommendedFor}
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Trust & Compliance Strip */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {studioData.compliancePoints.map((cp, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-[#7F48ED] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-heading font-bold text-[#090D16] mb-0.5">
                  {cp.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-normal">
                  {cp.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 9. How It Works (The 3-Step Weekly Production Model) */}
      <section id="how-it-works" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 scroll-mt-20 relative overflow-hidden">
        <div className="max-w-6xl mx-auto relative z-10">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-3">
              How it <span className="text-[#7F48ED]">Works</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal">
              Three simple steps. Fresh video ads in your account every single week.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left: The 3 Simple Steps */}
            <div className="lg:col-span-5 space-y-4 sm:space-y-5">
              {studioData.howItWorks.map((step, idx) => (
                <MotionWrapper key={step.stepNumber} direction="up" delay={idx * 0.08} distance={20}>
                  <div className="flex items-start gap-4 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#7F48ED]/40 transition-colors">
                    {/* Number Circle Badge */}
                    <div className="w-10 h-10 rounded-full bg-[#7F48ED] text-white flex items-center justify-center font-heading font-black text-base shadow-md shadow-[#7F48ED]/25 shrink-0">
                      {step.stepNumber}
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-heading font-bold text-base sm:text-lg text-[#090D16]">
                        {step.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </MotionWrapper>
              ))}
            </div>

            {/* Right: Studio Production Preview with Added Height */}
            <div className="lg:col-span-7">
              <MotionWrapper direction="up" delay={0.15} distance={25}>
                <div className="relative w-full h-[360px] sm:h-[440px] lg:h-[480px] rounded-3xl overflow-hidden border border-slate-200/90 bg-[#0B0D17] shadow-xl p-2 sm:p-4 flex items-center justify-center group">
                  <div className="relative w-full h-full">
                    <Image
                      src="/images/howitworksstudio.jpg"
                      alt="ReLaunch Studio Weekly Production"
                      fill
                      sizes="(max-width: 1024px) 100vw, 720px"
                      className="object-contain"
                      priority
                    />
                  </div>
                </div>
              </MotionWrapper>
            </div>
          </div>
        </div>
      </section>

      {/* 10. Final Call to Action */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-[#07090E] text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(127,72,237,0.25),transparent_70%)] pointer-events-none" />

        <MotionWrapper direction="up" distance={20} className="relative z-10 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-[#A78BFA] text-[10px] font-mono font-bold uppercase mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#A78BFA]" />
            <span>Ready for Continuous Ad Testing?</span>
          </div>

          <h2 className="font-heading font-black text-3xl sm:text-5xl text-white tracking-tight mb-4">
            Stop losing sales to <span style={{ color: ACCENT }}>ad fatigue.</span>
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            Book a 20-minute strategy call or run a free ad audit to see where you can lower your CPA.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() =>
                openContactModal({
                  intent: "strategy-session",
                  serviceInterest: "ReLaunch Studio",
                  notes: "Booking a 20-minute ReLaunch Studio strategy call.",
                })
              }
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-xl hover:brightness-110 active:scale-98 cursor-pointer"
              style={{ backgroundColor: ACCENT }}
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Book Strategy Call</span>
            </button>

            <Link
              href="/audit#scanner"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all"
            >
              <span>Run Free Ad Audit →</span>
            </Link>
          </div>
        </MotionWrapper>
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
