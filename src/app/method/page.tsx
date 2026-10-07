"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SellingMethodSection from "@/components/SellingMethodSection";
import CtaBanner from "@/components/CtaBanner";
import { useContactModal } from "@/context/ContactModalContext";
import {
  Compass,
  ArrowUpRight,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Workflow,
  Sparkles,
  Layers,
} from "lucide-react";

export default function MethodPage() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Method Hero: Left = Fonts / Typography, Right = Interactive 4-Layer Graphic Card */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-[#0A0D14] text-white overflow-hidden select-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-[#C0622A]/15 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* LEFT COLUMN: Fonts, Badges, Typography & CTA */}
            <div className="lg:col-span-6 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] text-[#F39C6B] text-[11px] sm:text-xs font-mono uppercase tracking-widest font-semibold mb-6 w-fit"
              >
                <Compass className="w-3.5 h-3.5 text-[#C0622A]" />
                <span>Execution Methodology</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-black text-4xl sm:text-6xl xl:text-7xl tracking-tight leading-[1.04] text-white"
              >
                The ReLaunch <br />
                <span className="bg-gradient-to-r from-white via-[#FAF9F6] to-[#E88C52] bg-clip-text text-transparent">
                  Methodology.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-xl"
              >
                We replace random marketing guesswork with an integrated 4-layer framework: Diagnostic Strategy, High-Velocity Architecture, Launch Velocity, and Continuous ROI Optimization.
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
                  <span>Book Strategy Session</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </button>

                <Link
                  href="/work"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/[0.12] transition-all"
                >
                  <span>See Proven Case Studies</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Interactive 4-Layer Process Card */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <span className="text-xs font-mono uppercase tracking-widest text-[#E88C52] font-bold">
                    4-Layer Growth Framework
                  </span>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:border-[#C0622A]/50 transition-all">
                    <div className="font-mono text-[10px] text-[#E88C52] font-bold uppercase mb-0.5">Layer 01</div>
                    <div className="font-heading font-bold text-sm text-white">Diagnostic &amp; Market Alignment</div>
                    <div className="text-[11px] text-slate-400 mt-1">Audit positioning, competitor vulnerabilities &amp; unit economics.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:border-[#C0622A]/50 transition-all">
                    <div className="font-mono text-[10px] text-[#E88C52] font-bold uppercase mb-0.5">Layer 02</div>
                    <div className="font-heading font-bold text-sm text-white">High-Velocity Architecture</div>
                    <div className="text-[11px] text-slate-400 mt-1">Build digital products, brand identities &amp; automation engines.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:border-[#C0622A]/50 transition-all">
                    <div className="font-mono text-[10px] text-[#E88C52] font-bold uppercase mb-0.5">Layer 03</div>
                    <div className="font-heading font-bold text-sm text-white">Launch &amp; Traffic Activation</div>
                    <div className="text-[11px] text-slate-400 mt-1">Deploy multi-channel performance media, SEO &amp; local maps.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.05] border border-white/[0.08] hover:border-[#C0622A]/50 transition-all">
                    <div className="font-mono text-[10px] text-[#E88C52] font-bold uppercase mb-0.5">Layer 04</div>
                    <div className="font-heading font-bold text-sm text-white">Continuous Optimization &amp; Scale</div>
                    <div className="text-[11px] text-slate-400 mt-1">Refine CAC, test new creative &amp; automate team workflows.</div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. 4-Layer Selling Framework Section */}
      <section className="py-8">
        <SellingMethodSection />
      </section>

      {/* 3. Bottom CTA */}
      <CtaBanner />

      {/* 4. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
