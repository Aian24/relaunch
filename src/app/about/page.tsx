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
  Sparkles,
  Layers,
  Lock,
  Users,
  Compass,
} from "lucide-react";

export default function AboutPage() {
  const { openContactModal } = useContactModal();

  const trustStats = [
    {
      value: "22+",
      label: "Years in Business",
      detail: "Founded in Phoenix, AZ in 2004, pioneering digital growth across 3 technological eras.",
      icon: Calendar,
      highlight: "Est. 2004",
    },
    {
      value: "1,500+",
      label: "Projects Delivered",
      detail: "From enterprise web applications and brand overhauls to automated AI workflows.",
      icon: CheckCircle2,
      highlight: "Proven Velocity",
    },
    {
      value: "100%",
      label: "Asset Ownership",
      detail: "You own every single line of code, design file, API key, domain, and data asset.",
      icon: ShieldCheck,
      highlight: "Zero Hostage Code",
    },
    {
      value: "0",
      label: "Contract Lock-In",
      detail: "Flexible subscription tiers and sprint models. We earn your partnership every single month.",
      icon: Lock,
      highlight: "Month-to-Month",
    },
  ];

  const corePrinciples = [
    {
      number: "01",
      title: "Radical Asset Autonomy",
      description:
        "We never hold code, accounts, or creative files hostage. Every build is configured in your cloud environment from day one with zero proprietary traps.",
      icon: ShieldCheck,
    },
    {
      number: "02",
      title: "Senior-Level Execution Only",
      description:
        "No junior handoffs or bait-and-switch account managers. You work directly with veteran architects, product designers, and AI specialists.",
      icon: Users,
    },
    {
      number: "03",
      title: "Velocity Over Ceremonial Bloat",
      description:
        "We ship in days and weeks, not quarters. Continuous feedback loops, rapid iterations, and instant portal collaboration get your product to market fast.",
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
          <div className="max-w-3xl text-center sm:text-left mx-auto sm:mx-0">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] text-[#F39C6B] text-[11px] sm:text-xs font-mono uppercase tracking-widest font-semibold mb-6 shadow-sm"
            >
              <Compass className="w-3.5 h-3.5 text-[#C0622A]" />
              <span>Phoenix, AZ · Est. 2004 · Creative, Web &amp; AI Studio</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-heading font-black text-4xl sm:text-6xl xl:text-7xl tracking-tight leading-[1.04] text-white"
            >
              Two Decades of <br />
              <span className="bg-gradient-to-r from-white via-[#FAF9F6] to-[#E88C52] bg-clip-text text-transparent">
                Engineering Impact.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-2xl"
            >
              Founded in 2004 in Phoenix, Arizona, ReLaunch is a full-service creative, software, and AI studio. We replace bloated legacy agency retainers with senior-level execution, agile speed, and 100% asset autonomy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 flex flex-wrap justify-center sm:justify-start gap-4"
            >
              <button
                type="button"
                onClick={() => openContactModal({ intent: "strategy-session" })}
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C0622A] hover:bg-[#a84f1d] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(192,98,42,0.35)] cursor-pointer active:scale-98"
              >
                <span>Book Strategy Call</span>
                <ArrowUpRight className="w-4 h-4 text-white" />
              </button>

              <Link
                href="/work"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/[0.12] transition-all"
              >
                <span>Explore Case Studies</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </motion.div>
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
              We have grown through every era of digital transformation by prioritizing client ownership and measurable business revenue.
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
                        {stat.value}
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
