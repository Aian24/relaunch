"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CtaBanner from "@/components/CtaBanner";
import MotionWrapper from "@/components/MotionWrapper";
import NumberCounter from "@/components/NumberCounter";
import { useContactModal } from "@/context/ContactModalContext";
import {
  ShieldCheck,
  Award,
  Zap,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  Building2,
  Calendar,
  Layers,
  Lock,
  Users,
  Compass,
} from "lucide-react";

export default function AboutPage() {
  const { openContactModal } = useContactModal();

  const trustStats = [
    {
      numericValue: 22,
      suffix: "+",
      label: "Years in Business",
      detail: "Pioneering digital growth in Phoenix, AZ since 2004.",
      icon: Calendar,
      highlight: "Est. 2004",
    },
    {
      numericValue: 1500,
      suffix: "+",
      label: "Projects Delivered",
      detail: "Web platforms, brand identities, and custom AI systems.",
      icon: CheckCircle2,
      highlight: "Proven Velocity",
    },
    {
      numericValue: 100,
      suffix: "%",
      label: "Asset Ownership",
      detail: "You own 100% of your code, creative assets, and accounts.",
      icon: ShieldCheck,
      highlight: "Zero Hostage Code",
    },
    {
      numericValue: 100,
      suffix: "%",
      label: "Senior Execution",
      detail: "Direct access to veteran strategists — no junior account handoffs.",
      icon: Users,
      highlight: "Direct Access",
    },
  ];

  const corePrinciples = [
    {
      number: "01",
      title: "Radical Asset Autonomy",
      description:
        "Zero hostage assets. Every line of code, design file, and account is 100% yours from day one.",
      icon: ShieldCheck,
    },
    {
      number: "02",
      title: "Senior-Level Execution Only",
      description:
        "Work directly with veteran architects, product designers, and AI specialists — no junior handoffs.",
      icon: Users,
    },
    {
      number: "03",
      title: "Velocity Over Ceremonial Bloat",
      description:
        "We ship in days and weeks, not quarters. Rapid iterations and direct portal collaboration.",
      icon: Zap,
    },
  ];

  const evolutionMilestones = [
    {
      period: "2008 – 2011",
      title: "The Founding Era",
      desc: "No name yet — we started offering web design services because clients kept asking for help.",
      benefit: "This is where it started: a direct response to what businesses actually needed.",
    },
    {
      period: "2012 – 2015",
      title: "Omnichannel Growth",
      desc: "Operating as Launch A Cloud, we added mobile apps and marketing services.",
      benefit: "This is why we can build custom software, not just plug in templates.",
    },
    {
      period: "2015 – 2020",
      title: "Confessions of a Local Marketer",
      desc: "Learned what actually makes a small-business site convert, and began generating real results for clients.",
      benefit: "This is why you get month-to-month flexibility instead of a 12-month contract.",
    },
    {
      period: "2021 – 2025",
      title: "Rebrand to ReLaunch",
      desc: "Rebranded as ReLaunch to close the exact gap we kept seeing: decent marketing that helps, but doesn't deliver real results.",
      benefit: "This is why the name is ReLaunch — we exist to relaunch what wasn't working.",
    },
    {
      period: "Present → Future",
      title: "AI & Generative Search",
      desc: "Integrating AI visibility and generative search into how clients get found.",
      benefit: "This is why your business shows up when people ask AI for a recommendation, not just when they Google you.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Cinematic About Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-[#0A0D14] text-white overflow-hidden select-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-[#7F48ED]/20 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0D14]/50 to-[#0A0D14] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Hero Copy, Badge & CTA */}
            <div className="lg:col-span-6 flex flex-col justify-center text-center sm:text-left items-center sm:items-start min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-[#7F48ED] text-xs font-mono uppercase tracking-widest font-semibold mb-6 shadow-xs whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-[#7F48ED] shrink-0" />
                <span>Phoenix, AZ · Est. 2004</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl tracking-tight leading-[1.08] text-white"
              >
                <span className="block">Bad Marketing and Broken Operations Don&apos;t Look Broken —</span>
                <span className="block text-[#7F48ED]">They Just Quietly Cost You Sales.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-xl"
              >
                A website that doesn&apos;t convert. Ads running with no strategy behind them. Software you paid to set up that never got fully connected. None of it looks like a crisis — it just quietly costs you customers every day it goes unfixed. ReLaunch exists to find that gap and close it.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none"
              >
                <button
                  type="button"
                  onClick={() => openContactModal({ intent: "strategy-session" })}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 bg-[#7F48ED] hover:bg-[#6D28D9] text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(127,72,237,0.35)] cursor-pointer active:scale-98 whitespace-nowrap"
                >
                  <span>Book a Strategy Call</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </button>

                <Link
                  href="/work"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/[0.12] transition-all whitespace-nowrap"
                >
                  <span>View Case Studies</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#7F48ED]" />
                </Link>
              </motion.div>

              {/* Guarantees on Left Column */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-xs text-slate-300 font-medium"
              >
                <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                  <CheckCircle2 className="w-4 h-4 text-[#7F48ED]" />
                  <span>Senior Execution</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                  <Lock className="w-4 h-4 text-[#7F48ED]" />
                  <span>100% IP Ownership</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                  <Users className="w-4 h-4 text-[#7F48ED]" />
                  <span>Senior Architects Only</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Interactive Highlights Card matching Pricing & FAQs */}
            <div className="lg:col-span-6 relative min-w-0 w-full">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="p-6 sm:p-8 xl:p-9 rounded-3xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl shadow-2xl space-y-4"
              >
                {/* Card Header */}
                <div className="flex items-center justify-between pb-3.5 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-[#7F48ED]" />
                    <span className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                      Studio Track Record
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#7F48ED]/20 text-[#A78BFA] border border-[#7F48ED]/30 text-[10px] font-mono font-semibold uppercase">
                    Est. 2004 · Phoenix
                  </span>
                </div>

                {/* 3 Highlight Tiles with Animated Counters */}
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-[#7F48ED] uppercase font-bold">Track Record</div>
                      <div className="font-heading font-bold text-white text-sm mt-0.5">Continuous Innovation</div>
                      <div className="text-xs text-slate-400 mt-0.5">Pioneering digital growth in Phoenix, AZ</div>
                    </div>
                    <div className="font-heading font-black text-2xl sm:text-3xl text-white font-mono shrink-0 text-right">
                      <NumberCounter value={22} suffix="+" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-normal">Years</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-[#7F48ED] uppercase font-bold">Shipped Products</div>
                      <div className="font-heading font-bold text-white text-sm mt-0.5">Proven Delivery Velocity</div>
                      <div className="text-xs text-slate-400 mt-0.5">Web platforms, brands &amp; AI systems</div>
                    </div>
                    <div className="font-heading font-black text-2xl sm:text-3xl text-white font-mono shrink-0 text-right">
                      <NumberCounter value={1500} suffix="+" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-normal">Projects</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-[#7F48ED] uppercase font-bold">Client Autonomy</div>
                      <div className="font-heading font-bold text-white text-sm mt-0.5">100% Asset &amp; IP Ownership</div>
                      <div className="text-xs text-slate-400 mt-0.5">You own all code, designs &amp; accounts</div>
                    </div>
                    <div className="font-heading font-black text-2xl sm:text-3xl text-white font-mono shrink-0 text-right">
                      <NumberCounter value={100} suffix="%" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-normal">Yours</span>
                    </div>
                  </div>
                </div>

                {/* Bottom Strip */}
                <div className="pt-3 border-t border-white/[0.08] text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                  <Zap className="w-3.5 h-3.5 text-[#7F48ED]" />
                  <span>Direct senior architect execution · Zero junior handoffs</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Empathy Section: The Reality Most Business Owners Face */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100 select-none">
        <div className="max-w-4xl mx-auto text-center">
          <MotionWrapper direction="up" distance={30} className="max-w-3xl mx-auto">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-3">
              THE REALITY MOST BUSINESS OWNERS FACE
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-6 leading-tight">
              We hear the same story on almost every first call.
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed mb-6 font-normal">
              A business owner who invested in the right tools and the right people, hoping it would launch real growth — then got buried running the business, the setup never got finished, and months later they&apos;re still paying for software and services that never actually started working.
            </p>
            <p className="text-[#090D16] text-base sm:text-lg font-semibold leading-relaxed">
              That&apos;s not a failure on your part. It&apos;s what happens when marketing and operations get sold as disconnected pieces instead of one plan — and it&apos;s exactly the gap ReLaunch exists to close.
            </p>
          </MotionWrapper>
        </div>
      </section>

      {/* 3. Earned Authority Block */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
              EARNED AUTHORITY · PHOENIX, AZ
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              22 Years in Phoenix. Numbers You Can See.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              No junior handoffs — every account is run by a senior architect, designer, or strategist. You own 100% of what we build: the code, the creative, the accounts. We don&apos;t need lock-in to keep you — you&apos;ll see the results in your numbers, and that&apos;s what keeps you.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustStats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <MotionWrapper
                  key={stat.label}
                  direction="up"
                  delay={idx * 0.08}
                  distance={30}
                  className="h-full"
                >
                  <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-[#7F48ED]/40 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between h-full group">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-[#7F48ED] shadow-xs group-hover:bg-[#7F48ED] group-hover:text-white transition-colors duration-300">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#7F48ED] bg-[#7F48ED]/10 px-2.5 py-1 rounded-full">
                          {stat.highlight}
                        </span>
                      </div>

                      <div className="font-heading font-black text-4xl sm:text-5xl text-[#090D16] tracking-tight group-hover:text-[#7F48ED] transition-colors">
                        <NumberCounter value={stat.numericValue} suffix={stat.suffix} />
                      </div>

                      <div className="font-heading font-bold text-base text-[#090D16] mt-2 mb-2">
                        {stat.label}
                      </div>

                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {stat.detail}
                      </p>
                    </div>
                  </div>
                </MotionWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Three Operating Principles */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={30} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
              OUR PHILOSOPHY
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              Marketing Strategically Designed to Sell.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              We strategize, create, and deliver marketing built to sell — and you can see it in your numbers.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {corePrinciples.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <MotionWrapper
                  key={p.number}
                  direction="up"
                  delay={idx * 0.1}
                  distance={30}
                  className="h-full"
                >
                  <div className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#7F48ED]/40 hover:shadow-lg transition-all flex flex-col justify-between h-full">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-purple-50/80 border border-purple-200/60 flex items-center justify-center text-[#7F48ED] shadow-xs mb-6 font-mono font-bold text-sm">
                        {p.number}
                      </div>
                      <h3 className="font-heading font-bold text-xl text-[#090D16] mb-3">
                        {p.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {p.description}
                      </p>
                    </div>
                  </div>
                </MotionWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. Streamlined Evolution Timeline */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100 select-none">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
              STUDIO EVOLUTION · 22 YEARS
            </span>
            <h3 className="font-heading font-black text-3xl sm:text-4xl text-[#090D16] tracking-tight">
              22 Years of Continuous Innovation.
            </h3>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Every era of our agency was built in direct response to what business owners actually needed.
            </p>
          </MotionWrapper>

          {/* Integrated Timeline Editorial Journey */}
          <div className="space-y-1">
            {evolutionMilestones.map((item, idx) => (
              <MotionWrapper
                key={item.period}
                direction="up"
                delay={idx * 0.06}
                distance={15}
                className="flex items-start gap-4 sm:gap-6 group"
              >
                {/* Column 1: Dot & Connecting Line (Mathematically Centered) */}
                <div className="flex flex-col items-center self-stretch shrink-0 w-6 sm:w-7">
                  <div className="w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-[#7F48ED] flex items-center justify-center shrink-0 z-10 mt-1 shadow-2xs group-hover:scale-110 transition-transform">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#7F48ED]" />
                  </div>
                  {idx < evolutionMilestones.length - 1 && (
                    <div className="w-[2px] bg-purple-200/80 grow my-2" />
                  )}
                </div>

                {/* Column 2: 2-Column Editorial Content */}
                <div className="grow min-w-0 pb-8 sm:pb-10 pt-0.5">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-4 md:gap-8 items-start">
                    {/* Left: Period & Title */}
                    <div className="md:col-span-4 space-y-1">
                      <span className="text-xs font-mono font-bold text-[#7F48ED] tracking-wider uppercase block">
                        {item.period}
                      </span>
                      <h4 className="font-heading font-bold text-lg sm:text-xl text-[#090D16]">
                        {item.title}
                      </h4>
                    </div>

                    {/* Right: Narrative & Benefit */}
                    <div className="md:col-span-8 space-y-2">
                      <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
                        {item.desc}
                      </p>
                      <p className="text-sm sm:text-base font-medium text-[#7F48ED] leading-relaxed">
                        {item.benefit}
                      </p>
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Standard Global Call to Action Banner */}
      <CtaBanner
        badgeText="Ready for Launch · Phoenix, AZ"
        titleRegular="Here's how we start: a strategy call, a plan built around your business,"
        titleHighlight="then we build it."
        description="Book a strategy call to evaluate your current setup and build a marketing plan designed around your business, or explore our real client case studies."
      />

      {/* Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
