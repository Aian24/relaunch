"use client";

import { useState } from "react";
import Link from "next/link";
import { twoHeroesData } from "@/data/sellingFramework";
import { motion, AnimatePresence } from "framer-motion";
import MotionWrapper from "./MotionWrapper";
import SpotlightCard from "./SpotlightCard";
import {
  Store,
  Layers,
  ArrowRight,
  AlertCircle,
  TrendingDown,
  CheckCircle2,
  Check,
} from "lucide-react";

export default function TwoHeroesSection() {
  const [activeTab, setActiveTab] = useState<"local-business" | "enterprise-tech">(
    "local-business"
  );

  const activeHero = twoHeroesData.find((h) => h.id === activeTab)!;

  return (
    <section id="two-doors" className="py-16 sm:py-20 bg-white border-b border-slate-200/80 select-none scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Scroll Reveal */}
        <MotionWrapper direction="up" distance={20} className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
            STRATEGIC POSITIONING · TWO DOORS
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.05] mb-3">
            Two Paths to Growth. <br />
            <span className="text-[#FF6700] italic">Which Door Fits You?</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
            Whether you need more inbound customer calls for your local service business or custom software that actually ships on time—we have a dedicated path designed for you.
          </p>
        </MotionWrapper>

        {/* Tab Switcher with Scroll Animation */}
        <MotionWrapper direction="up" delay={0.1} className="flex justify-center mb-8 w-full">
          <div className="w-full sm:w-auto grid grid-cols-2 sm:inline-flex p-1.5 bg-slate-100 rounded-xl sm:rounded-2xl border border-slate-200 gap-1.5 shadow-xs">
            {twoHeroesData.map((hero) => {
              const isSelected = activeTab === hero.id;
              return (
                <button
                  key={hero.id}
                  onClick={() => setActiveTab(hero.id as any)}
                  className={`flex items-center justify-center gap-1.5 sm:gap-2.5 px-4 sm:px-8 py-2.5 rounded-lg sm:rounded-xl font-heading font-bold text-[11px] sm:text-xs md:text-sm uppercase tracking-wider transition-all duration-200 cursor-pointer sm:whitespace-nowrap ${
                    isSelected
                      ? "bg-[#FF6700] text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
                  }`}
                >
                  {hero.id === "local-business" ? (
                    <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  ) : (
                    <Layers className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  )}
                  <span className="truncate sm:overflow-visible sm:whitespace-nowrap">{hero.title}</span>
                </button>
              );
            })}
          </div>
        </MotionWrapper>

        {/* Comparison Card with Scroll Reveal & Animated Tab Switch */}
        <MotionWrapper direction="up" delay={0.2} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] overflow-hidden w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeHero.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
            >
              <div className="bg-slate-50 p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-0.5 rounded-full bg-[#FF6700] text-white shadow-xs">
                    {activeHero.badge}
                  </span>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl lg:text-4xl text-[#090D16] mt-2">
                    {activeHero.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {activeHero.subtitle} · {activeHero.targetExamples}
                  </p>
                </div>

                <div className="sm:text-right">
                  <span className="text-[10px] uppercase tracking-widest text-[#FF6700] font-bold block mb-0.5">
                    Primary Goal
                  </span>
                  <span className="font-heading font-black text-base sm:text-xl text-[#090D16]">
                    {activeHero.primaryDesire}
                  </span>
                </div>
              </div>

              <div className="p-5 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 bg-white">
                <div className="space-y-3">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <SpotlightCard
                      spotlightColor="rgba(255,103,0, 0.08)"
                      className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-colors shadow-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-xs uppercase tracking-wider mb-1">
                        <AlertCircle className="w-4 h-4 text-[#FF6700]" />
                        <span>The External Problem</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {activeHero.externalProblem}
                      </p>
                    </SpotlightCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.12, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <SpotlightCard
                      spotlightColor="rgba(255,103,0, 0.08)"
                      className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-colors shadow-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-xs uppercase tracking-wider mb-1">
                        <AlertCircle className="w-4 h-4 text-[#FF6700]" />
                        <span>The Internal Frustration</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {activeHero.internalProblem}
                      </p>
                    </SpotlightCard>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.19, ease: [0.16, 1, 0.3, 1] }}
                  >
                    <SpotlightCard
                      spotlightColor="rgba(255,103,0, 0.08)"
                      className="p-4 bg-white rounded-2xl border border-slate-200/80 hover:border-slate-300 transition-colors shadow-xs"
                    >
                      <div className="flex items-center gap-2 text-slate-900 font-heading font-bold text-xs uppercase tracking-wider mb-1">
                        <TrendingDown className="w-4 h-4 text-[#FF6700]" />
                        <span>What Is At Stake</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {activeHero.whatIsAtStake}
                      </p>
                    </SpotlightCard>
                  </motion.div>
                </div>

                <motion.div
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.22, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full"
                >
                  <SpotlightCard
                    spotlightColor="rgba(255,103,0, 0.12)"
                    className="bg-orange-50/40 p-6 sm:p-7 rounded-2xl border border-orange-200/60 flex flex-col justify-between h-full shadow-xs"
                  >
                    <div>
                      <div className="flex items-center gap-2 text-[#FF6700] font-heading font-bold text-xs uppercase tracking-wider mb-3">
                        <CheckCircle2 className="w-5 h-5 text-[#FF6700]" />
                        <span>What Success Looks Like</span>
                      </div>

                      <p className="font-heading font-black text-xl sm:text-2xl text-[#090D16] mb-5 leading-snug">
                        &ldquo;{activeHero.successLooksLike}&rdquo;
                      </p>

                      <div className="space-y-2.5 mb-6 text-xs text-slate-600">
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#FF6700] mt-0.5 shrink-0" />
                          <span>Engineered on the 4-layer selling framework (SB7, Hero&apos;s Journey, Draper)</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <Check className="w-4 h-4 text-[#FF6700] mt-0.5 shrink-0" />
                          <span>Single flexible monthly subscription — pause or cancel anytime</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      href={activeHero.ctaHref}
                      className="w-full inline-flex items-center justify-center gap-2 py-3.5 px-6 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-[0_0_20px_rgba(255,103,0,0.3)] hover:shadow-[0_0_25px_rgba(255,103,0,0.45)] transition-all text-center active:translate-y-0.5 hover:scale-[1.01]"
                    >
                      <span>{activeHero.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </SpotlightCard>
                </motion.div>
              </div>
            </motion.div>
          </AnimatePresence>
        </MotionWrapper>
      </div>
    </section>
  );
}
