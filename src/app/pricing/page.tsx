"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import BundleCalculator from "@/components/BundleCalculator";
import CtaBanner from "@/components/CtaBanner";
import { useContactModal } from "@/context/ContactModalContext";
import {
  Layers,
  ShieldCheck,
  Lock,
  RotateCcw,
} from "lucide-react";

export default function PricingPage() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Pricing Hero: Left = Fonts / Typography, Right = Interactive Bundle Savings Card */}
      <section className="relative pt-32 sm:pt-40 pb-16 sm:pb-24 px-4 sm:px-6 lg:px-8 bg-[#0A0D14] text-white overflow-hidden select-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-[#C0622A]/15 rounded-full blur-[160px] pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* LEFT COLUMN: Fonts, Badges, Typography & Guarantees */}
            <div className="lg:col-span-6 flex flex-col justify-center text-center sm:text-left items-center sm:items-start min-w-0">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-[#C0622A] text-xs font-mono uppercase tracking-widest font-semibold mb-6 shadow-xs whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-[#C0622A] shrink-0" />
                <span>Transparent Subscription Pricing</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl tracking-tight leading-[1.08] text-white"
              >
                <span className="block">Build Your Bundle.</span>
                <span className="block text-[#C0622A]">Save up to 25%.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-xl"
              >
                Select the services you need today and bundle for compounding savings. No contracts, pause or cancel anytime.
              </motion.p>

              {/* Guarantees on Left */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-wrap justify-center sm:justify-start gap-2 sm:gap-4 text-xs text-slate-300 font-medium"
              >
                <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                  <ShieldCheck className="w-4 h-4 text-[#C0622A]" />
                  <span>Zero Contracts</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                  <Lock className="w-4 h-4 text-[#C0622A]" />
                  <span>100% IP Ownership</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/[0.05] px-3 py-1.5 rounded-lg border border-white/[0.08]">
                  <RotateCcw className="w-4 h-4 text-[#C0622A]" />
                  <span>Pause Anytime</span>
                </div>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Interactive Savings Preview Card */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl shadow-2xl relative overflow-hidden"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-[#E88C52]" />
                    <span className="text-xs font-mono uppercase tracking-widest text-[#E88C52] font-bold">
                      Bundle Discount Tiering
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#C0622A] text-white text-[10px] font-mono font-bold">
                    Compounding ROI
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div>
                      <div className="font-heading font-bold text-sm text-white">2 Services Selected</div>
                      <div className="text-[11px] text-slate-400">Marketing + Web, or SEO + Ads</div>
                    </div>
                    <span className="text-sm font-bold text-[#E88C52] font-mono">10% OFF</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div>
                      <div className="font-heading font-bold text-sm text-white">3 Services Selected</div>
                      <div className="text-[11px] text-slate-400">Full-funnel digital presence</div>
                    </div>
                    <span className="text-sm font-bold text-[#E88C52] font-mono">15% OFF</span>
                  </div>

                  <div className="flex items-center justify-between p-3.5 rounded-2xl bg-white/[0.06] border border-[#C0622A]/40 shadow-sm">
                    <div>
                      <div className="font-heading font-bold text-sm text-white">4+ Services (Complete Engine)</div>
                      <div className="text-[11px] text-slate-400">Brand + Web + Ads + AI Systems</div>
                    </div>
                    <span className="text-base font-black text-[#E88C52] font-mono">25% OFF</span>
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/[0.08] text-center">
                  <a
                    href="#bundle-builder"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E88C52] hover:text-white transition-colors"
                  >
                    <span>Configure Your Custom Bundle Below ↓</span>
                  </a>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Interactive Bundle Builder Component (Pure White) */}
      <BundleCalculator />

      {/* 3. Bottom CTA */}
      <CtaBanner />

      {/* 4. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}

