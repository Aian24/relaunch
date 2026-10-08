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
import { contactInfo } from "@/data/navigation";
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
  Cpu,
  Lock,
  Globe2,
  Users,
  Compass,
} from "lucide-react";

export default function AboutPage() {
  const { openContactModal } = useContactModal();

  const coreStats = [
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
      highlight: "Proven Track Record",
    },
    {
      value: "100%",
      label: "Asset Ownership",
      detail: "You own every single line of code, design file, API key, domain, and data asset.",
      icon: ShieldCheck,
      highlight: "Zero Hostage Policy",
    },
    {
      value: "0",
      label: "Contract Lock-In",
      detail: "Flexible subscription tiers and sprint models. We earn your partnership every month.",
      icon: Lock,
      highlight: "Month-to-Month",
    },
  ];

  const timeline = [
    {
      period: "2004 – 2011",
      title: "The Founding Era",
      subtitle: "Web Development & Brand Strategy",
      description:
        "Started in Phoenix, Arizona with a straightforward mission: eliminate digital snake oil and build high-converting websites and brand identities that genuinely generate revenue.",
      badge: "Foundation",
    },
    {
      period: "2012 – 2019",
      title: "The Omnichannel Evolution",
      subtitle: "Performance Media & Full-Stack Apps",
      description:
        "Expanded into bespoke cloud web applications, conversion-rate optimization (CRO), multi-channel performance advertising, and complex database architectures.",
      badge: "Scale",
    },
    {
      period: "2020 – 2024",
      title: "The Product Studio Model",
      subtitle: "Subscription-Based Agency Replacement",
      description:
        "Pioneered our agile subscription model—giving businesses dedicated senior design and engineering capacity without bloated agency overhead or hiring friction.",
      badge: "Agility",
    },
    {
      period: "2025 – Present",
      title: "The AI & GEO Era",
      subtitle: "Custom AI Systems & Generative Search",
      description:
        "Integrating autonomous AI agents, fine-tuned LLM workflows, and Generative Engine Optimization (GEO) to keep our clients years ahead of market competition.",
      badge: "Next Gen",
    },
  ];

  const principles = [
    {
      number: "01",
      title: "Radical Transparency & Asset Autonomy",
      description:
        "We never hold code, accounts, or creative files hostage. Every build is configured in your environments from day one, with full documentation and zero proprietary traps.",
      icon: ShieldCheck,
    },
    {
      number: "02",
      title: "Senior-Level Execution Only",
      description:
        "No junior handoffs or bait-and-switch account managers. You work directly with veteran architects, product designers, and AI specialists who execute at the highest standard.",
      icon: Users,
    },
    {
      number: "03",
      title: "Velocity Over Ceremonial Bloat",
      description:
        "We ship in days and weeks, not quarters. Continuous feedback loops, rapid iterations, and instant Slack/portal collaboration ensure your product hits the market with maximum speed.",
      icon: Zap,
    },
    {
      number: "04",
      title: "Unified Strategic Ecosystem",
      description:
        "Instead of managing 4 different vendors for design, development, marketing, and AI, ReLaunch acts as your single, cohesive growth partner executing under one synchronized vision.",
      icon: Layers,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. About Hero Section: Left-aligned editorial title with warm dark theme */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-[#0A0D14] text-white overflow-hidden select-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-[#C0622A]/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0D14]/50 to-[#0A0D14] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Hero Column */}
            <div className="lg:col-span-7 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] text-[#F39C6B] text-[11px] sm:text-xs font-mono uppercase tracking-widest font-semibold mb-6 w-fit shadow-sm"
              >
                <Compass className="w-3.5 h-3.5 text-[#C0622A]" />
                <span>Phoenix, AZ · Est. 2004 · Creative &amp; AI Studio</span>
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
                Founded in 2004 in Phoenix, Arizona, ReLaunch is a full-service creative, software, and AI studio. We replace bloated legacy agency models with agile, high-velocity execution and 100% asset autonomy for ambitious businesses.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-wrap gap-4"
              >
                <button
                  type="button"
                  onClick={() => openContactModal({ intent: "strategy-session" })}
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C0622A] hover:bg-[#a84f1d] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(192,98,42,0.35)] cursor-pointer active:scale-98"
                >
                  <span>Book a Strategy Call</span>
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

            {/* Right Hero Column: Heritage & Trust Card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <Building2 className="w-5 h-5 text-[#C0622A]" />
                    <span className="text-xs font-mono uppercase tracking-widest text-[#E88C52] font-bold">
                      Studio Overview
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold uppercase">
                    Active Since 2004
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Headquarters</div>
                    <div className="font-heading font-bold text-white text-base mt-0.5">Phoenix, Arizona, USA</div>
                    <div className="text-xs text-slate-400 mt-1">Serving high-growth brands nationwide</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Core Architecture</div>
                    <div className="font-heading font-bold text-white text-base mt-0.5">Design · Full-Stack Web · AI</div>
                    <div className="text-xs text-slate-400 mt-1">One unified partner for brand to backend</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">Delivery Model</div>
                    <div className="font-heading font-bold text-white text-base mt-0.5">Agile Subscription &amp; Sprints</div>
                    <div className="text-xs text-slate-400 mt-1">Zero long retainers · Pause or cancel anytime</div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Pure White Body: The 22+ Years Core Numbers Showcase */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C0622A]/10 text-[#C0622A] text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <Award className="w-3.5 h-3.5" />
              <span>Proven Reliability</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              Numbers Built on 22 Years of Trust.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              We have withstood every wave of digital transformation—from the early web to cloud SaaS and generative AI—by staying obsessive about client ownership and tangible results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {coreStats.map((stat, idx) => {
              const IconComp = stat.icon;
              return (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-[#C0622A]/40 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between group"
                >
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

                    <div className="font-heading font-bold text-base text-[#090D16] mt-2 mb-3">
                      {stat.label}
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {stat.detail}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Pure White Body: Evolution & Journey Timeline */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C0622A]/10 text-[#C0622A] text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <Calendar className="w-3.5 h-3.5" />
              <span>Our Heritage</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              The Evolution of ReLaunch.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              How a boutique Phoenix development shop grew into a full-spectrum digital product, marketing &amp; AI automation studio.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeline.map((item, idx) => (
              <motion.div
                key={item.period}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="p-7 rounded-3xl bg-white border border-slate-200/80 hover:border-[#C0622A]/40 hover:shadow-lg transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-[#C0622A] tracking-wider uppercase">
                      {item.period}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-lg text-[#090D16] mb-1">
                    {item.title}
                  </h3>
                  <div className="text-xs font-medium text-[#C0622A] mb-3">
                    {item.subtitle}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pure White Body: 4 Core Operating Principles */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            <div className="lg:col-span-5 lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C0622A]/10 text-[#C0622A] text-xs font-mono font-bold tracking-widest uppercase mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Our Philosophy</span>
              </div>
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-tight">
                Built to Fix Everything Broken About Agencies.
              </h2>
              <p className="mt-5 text-slate-600 text-sm sm:text-base leading-relaxed">
                Traditional agencies thrive on billable hour bloat, slow turnaround times, and hostage code. We engineered ReLaunch to be the modern partner we always wished existed.
              </p>

              <div className="mt-8 p-6 rounded-2xl bg-slate-50 border border-slate-200/80">
                <div className="font-heading font-bold text-sm text-[#090D16] mb-1">
                  Ready to experience the difference?
                </div>
                <div className="text-xs text-slate-600 mb-4">
                  Schedule a 20-minute diagnostic session with our technical team.
                </div>
                <button
                  type="button"
                  onClick={() => openContactModal({ intent: "strategy-session" })}
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#C0622A] hover:bg-[#a84f1d] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <span>Book Strategy Call</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>

            <div className="lg:col-span-7 space-y-6">
              {principles.map((p, idx) => {
                const IconComp = p.icon;
                return (
                  <motion.div
                    key={p.number}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                    className="p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-[#C0622A]/40 hover:bg-white hover:shadow-xl hover:shadow-slate-100 transition-all duration-300"
                  >
                    <div className="flex items-start gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center text-[#C0622A] shadow-xs shrink-0 font-mono font-bold text-sm">
                        {p.number}
                      </div>
                      <div>
                        <h3 className="font-heading font-bold text-lg sm:text-xl text-[#090D16] mb-2">
                          {p.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                          {p.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

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
