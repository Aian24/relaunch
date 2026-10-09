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
      numericValue: 0,
      suffix: "",
      label: "Contract Lock-In",
      detail: "Flexible month-to-month plans. Cancel or pause anytime.",
      icon: Lock,
      highlight: "Month-to-Month",
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
      period: "2004 – 2011",
      title: "The Founding Era",
      desc: "Launched in Phoenix with a focus on high-converting websites and foundational brand identities.",
    },
    {
      period: "2012 – 2019",
      title: "Omnichannel Growth",
      desc: "Expanded into bespoke cloud software, full-stack Next.js apps, and multi-channel performance media.",
    },
    {
      period: "2020 – 2024",
      title: "The Product Studio",
      desc: "Pioneered our agile subscription model—eliminating agency overhead and lengthy retainers.",
    },
    {
      period: "2025 – Present",
      title: "AI & Generative Search",
      desc: "Integrating autonomous AI agents and Generative Engine Optimization (GEO) to dominate modern search.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Cinematic About Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-[#0A0D14] text-white overflow-hidden select-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-[#C0622A]/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0D14]/50 to-[#0A0D14] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Hero Copy, Badge & CTA */}
            <div className="lg:col-span-6 flex flex-col justify-center text-center sm:text-left items-center sm:items-start min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-[#C0622A] text-xs font-mono uppercase tracking-widest font-semibold mb-6 shadow-xs whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-[#C0622A] shrink-0" />
                <span>Phoenix, AZ · Est. 2004</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl tracking-tight leading-[1.08] text-white"
              >
                <span className="block">Two Decades of</span>
                <span className="block text-[#C0622A]">Engineering Impact.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-xl"
              >
                Founded in Phoenix in 2004, ReLaunch replaces bloated agency retainers with senior-level execution, agile speed, and 100% asset autonomy.
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
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 bg-[#C0622A] hover:bg-[#a84f1d] text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(192,98,42,0.35)] cursor-pointer active:scale-98 whitespace-nowrap"
                >
                  <span>Book Strategy Call</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </button>

                <Link
                  href="/work"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/[0.12] transition-all whitespace-nowrap"
                >
                  <span>Explore Work</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
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
                  <ShieldCheck className="w-4 h-4 text-[#C0622A]" />
                  <span>Zero Lock-In</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                  <Lock className="w-4 h-4 text-[#C0622A]" />
                  <span>100% IP Ownership</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                  <Users className="w-4 h-4 text-[#C0622A]" />
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
                    <Award className="w-4 h-4 text-[#E88C52]" />
                    <span className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                      Studio Track Record
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-[#C0622A]/20 text-[#F39C6B] border border-[#C0622A]/30 text-[10px] font-mono font-semibold uppercase">
                    Est. 2004 · Phoenix
                  </span>
                </div>

                {/* 3 Highlight Tiles with Animated Counters */}
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-between gap-4">
                    <div>
                      <div className="text-[10px] font-mono text-[#E88C52] uppercase font-bold">Track Record</div>
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
                      <div className="text-[10px] font-mono text-[#E88C52] uppercase font-bold">Shipped Products</div>
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
                      <div className="text-[10px] font-mono text-[#E88C52] uppercase font-bold">Client Autonomy</div>
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
                  <Zap className="w-3.5 h-3.5 text-[#E88C52]" />
                  <span>Direct senior architect execution · Zero junior handoffs</span>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Four Pillars of Trust */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={30} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2">
              PROVEN RELIABILITY
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              Numbers Built on 22 Years of Trust.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Prioritizing client ownership and measurable business revenue across every digital era.
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
                  <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-[#C0622A]/40 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between h-full group">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-[#C0622A] shadow-xs group-hover:bg-[#C0622A] group-hover:text-white transition-colors duration-300">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C0622A] bg-[#C0622A]/10 px-2.5 py-1 rounded-full">
                          {stat.highlight}
                        </span>
                      </div>

                      <div className="font-heading font-black text-4xl sm:text-5xl text-[#090D16] tracking-tight group-hover:text-[#C0622A] transition-colors">
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
            <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2">
              OUR PHILOSOPHY
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              Built to Fix Everything Broken About Agencies.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              No bloated retainers, no junior handoffs, and zero hostage code.
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
                  <div className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#C0622A]/40 hover:shadow-lg transition-all flex flex-col justify-between h-full">
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-orange-50/80 border border-orange-200/60 flex items-center justify-center text-[#C0622A] shadow-xs mb-6 font-mono font-bold text-sm">
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
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              STUDIO EVOLUTION
            </span>
            <h3 className="font-heading font-bold text-2xl text-[#090D16]">
              22 Years of Continuous Innovation
            </h3>
          </MotionWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {evolutionMilestones.map((item, idx) => (
              <MotionWrapper
                key={item.period}
                direction="up"
                delay={idx * 0.08}
                distance={20}
                className="h-full"
              >
                <div className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between h-full">
                  <div>
                    <span className="text-xs font-mono font-bold text-[#C0622A] tracking-wider uppercase block mb-2">
                      {item.period}
                    </span>
                    <h4 className="font-heading font-bold text-base text-[#090D16] mb-1.5">
                      {item.title}
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <CtaBanner />

      {/* 6. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
