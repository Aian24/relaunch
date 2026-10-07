"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CtaBanner from "@/components/CtaBanner";
import MotionWrapper from "@/components/MotionWrapper";
import { faqData } from "@/data/faq";
import { useContactModal } from "@/context/ContactModalContext";
import {
  HelpCircle,
  ArrowUpRight,
  ArrowRight,
  ChevronDown,
  Sparkles,
  Phone,
} from "lucide-react";

export default function FaqPage() {
  const { openContactModal } = useContactModal();
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", "Pricing & Billing", "Services & Delivery", "ReLaunch Method"];

  const filteredFaqs =
    selectedCategory === "All"
      ? faqData
      : faqData.filter((item) => item.category === selectedCategory);

  const toggleFaq = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. FAQ Hero: Left = Fonts / Typography, Right = Interactive Assistance Card */}
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
                <HelpCircle className="w-3.5 h-3.5 text-[#C0622A]" />
                <span>Knowledge Base &amp; FAQ</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-black text-4xl sm:text-6xl xl:text-7xl tracking-tight leading-[1.04] text-white"
              >
                Frequently Asked <br />
                <span className="bg-gradient-to-r from-white via-[#FAF9F6] to-[#E88C52] bg-clip-text text-transparent">
                  Questions.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-xl"
              >
                Everything you need to know about our subscription model, delivery timelines, AI workflows, and client ownership guarantees.
              </motion.p>

              {/* Action Buttons */}
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
                  <span>Ask a Specific Question</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </button>

                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/[0.12] transition-all"
                >
                  <span>View Pricing Breakdown</span>
                  <ArrowRight className="w-4 h-4 text-slate-400" />
                </Link>
              </motion.div>
            </div>

            {/* RIGHT COLUMN: Interactive Quick Assistance Card */}
            <div className="lg:col-span-6 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl shadow-2xl space-y-5"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#E88C52]" />
                    <span className="text-xs font-mono uppercase tracking-widest text-white font-bold">
                      Instant Answers
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-semibold border border-emerald-500/30">
                    Live Support
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-[10px] uppercase font-mono text-[#E88C52] font-bold">Contracts &amp; Lock-in</div>
                    <div className="text-xs text-white mt-1">Zero long-term contracts. 100% month-to-month flexibility.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-[10px] uppercase font-mono text-[#E88C52] font-bold">Turnaround Speed</div>
                    <div className="text-xs text-white mt-1">AI pipelines deploy in 24–48h. Custom Next.js sites in 2–3 weeks.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.04] border border-white/[0.06]">
                    <div className="text-[10px] uppercase font-mono text-[#E88C52] font-bold">Client IP Ownership</div>
                    <div className="text-xs text-white mt-1">You own 100% of all code, designs, domains, and ad accounts.</div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <a
                    href="tel:4807799875"
                    className="inline-flex items-center gap-2 text-xs font-mono text-slate-300 hover:text-white transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5 text-[#C0622A]" />
                    <span>Direct phone: (480) 779-9875</span>
                  </a>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Interactive FAQ Category Filter & Accordion List (Pure White) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        {/* Category Pills */}
        <MotionWrapper direction="up" distance={25} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-12">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setOpenIndex(null);
                }}
                className={`px-5 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#C0622A] text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </MotionWrapper>

        {/* Accordion Items with Scroll-Up Reveal */}
        <div className="space-y-4">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <MotionWrapper key={faq.question} direction="up" delay={index * 0.06} distance={25}>
                <div className="rounded-2xl sm:rounded-3xl bg-white border border-slate-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.02)] overflow-hidden transition-all hover:border-[#C0622A]/30">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between p-6 sm:p-7 text-left cursor-pointer focus:outline-none"
                    aria-expanded={isOpen}
                  >
                    <div className="pr-4">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-1">
                        {faq.category}
                      </span>
                      <h3 className="font-heading font-black text-base sm:text-lg text-[#090D16] leading-snug">
                        {faq.question}
                      </h3>
                    </div>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen ? "bg-[#C0622A] text-white rotate-180" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 },
                        }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      >
                        <div className="px-6 sm:px-7 pb-6 sm:pb-7 pt-1 border-t border-slate-100">
                          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </section>

      {/* 3. Bottom CTA Banner */}
      <CtaBanner />

      {/* 4. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
