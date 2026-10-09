"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { caseStudiesData, clientLogos, CaseStudy } from "@/data/caseStudies";
import { useContactModal } from "@/context/ContactModalContext";
import { useScrollContext } from "./SmoothScrollProvider";
import MotionWrapper from "./MotionWrapper";
import SpotlightCard from "./SpotlightCard";
import Work3DShowcase from "./Work3DShowcase";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  ExternalLink,
  TrendingUp,
  X,
  Globe,
  Quote,
} from "lucide-react";

const categories = ["All Work", "Websites & Platforms", "Custom Software", "Brand & Ads"];

export default function CaseStudiesSection() {
  const { openContactModal } = useContactModal();
  const { stopScroll, startScroll } = useScrollContext();
  const [activeCategory, setActiveCategory] = useState("All Work");
  const [activeStudy, setActiveStudy] = useState<CaseStudy | null>(null);

  // Lock background body scroll and pause Lenis scroll when case study modal is open
  useEffect(() => {
    if (activeStudy) {
      stopScroll();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setActiveStudy(null);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        startScroll();
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      startScroll();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [activeStudy, stopScroll, startScroll]);

  const filteredStudies = caseStudiesData.filter((study) => {
    if (activeCategory === "All Work") return true;
    if (activeCategory === "Websites & Platforms")
      return (
        study.category.includes("Web") ||
        study.category.includes("Publishing") ||
        study.category.includes("Lodging") ||
        study.category.includes("Public")
      );
    if (activeCategory === "Custom Software")
      return (
        study.category.includes("Software") ||
        study.category.includes("FinTech")
      );
    if (activeCategory === "Brand & Ads")
      return (
        study.category.includes("Food") ||
        study.category.includes("Contracting") ||
        study.category.includes("Travel")
      );
    return true;
  });

  const handleStartSimilarProject = (study: CaseStudy) => {
    setActiveStudy(null);
    openContactModal({
      intent: "start-project",
      serviceInterest: study.title,
      notes: `Interested in achieving results similar to case study: ${study.title} (${study.metricValue} ${study.metricLabel} in ${study.industry}).`,
    });
  };

  return (
    <section
      id="work"
      className="py-16 sm:py-20 bg-white border-b border-slate-200 select-none scroll-mt-20 relative overflow-hidden"
    >
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.02]"
        style={{
          backgroundImage: "radial-gradient(#090D16 1.5px, transparent 1.5px)",
          backgroundSize: "28px 28px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <MotionWrapper
          direction="up"
          distance={20}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-8 sm:mb-10"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-[#FF6700] text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700]" />
              <span>FEATURED WORK &amp; CLIENT PROOF</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.05]">
              Real builds. <span className="text-[#FF6700]">Proven growth.</span>
            </h2>
          </div>

          <p className="text-slate-600 text-xs sm:text-sm max-w-md font-normal leading-relaxed">
            Click any case study below to open the complete 3D interactive project showcase, verified impact metrics, and client deliverables.
          </p>
        </MotionWrapper>

        {/* Category Filter Pills */}
        <MotionWrapper direction="up" delay={0.1} className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeCategory === cat
                  ? "bg-[#090D16] text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 border border-slate-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </MotionWrapper>

        {/* Showcase Grid of 3D Perspective Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredStudies.map((study, idx) => (
            <MotionWrapper
              key={study.id}
              direction="left"
              delay={idx * 0.08}
              distance={40}
            >
              <SpotlightCard
                onClick={() => setActiveStudy(study)}
                spotlightColor="rgba(255,103,0, 0.12)"
                className="group bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-sm hover:shadow-2xl hover:border-[#FF6700]/60 transition-all duration-300 hover:-translate-y-1.5 cursor-pointer flex flex-col h-full overflow-hidden"
              >
                {/* 3D Perspective Browser & Image Showcase Component */}
                <Work3DShowcase
                  image={study.image}
                  title={study.title}
                  displayUrl={study.displayUrl}
                  industry={study.industry}
                  metricValue={study.metricValue}
                  metricLabel={study.metricLabel}
                />

                {/* Card Content Body */}
                <div className="p-5 sm:p-6 flex flex-col flex-1 justify-between bg-white">
                  <div>
                    {/* Title */}
                    <h3 className="font-heading font-bold text-lg sm:text-xl text-[#090D16] group-hover:text-[#FF6700] transition-colors mb-2">
                      {study.title}
                    </h3>

                    {/* Dedicated Spacious Metric Box */}
                    <div className="my-3 p-3 rounded-xl bg-orange-50/70 border border-[#FF6700]/20 flex items-center justify-between gap-3">
                      <div>
                        <span className="font-heading font-black text-2xl text-[#FF6700] block leading-tight">
                          {study.metricValue}
                        </span>
                        <span className="text-xs font-semibold text-slate-700 block leading-tight mt-0.5">
                          {study.metricLabel}
                        </span>
                      </div>
                      <div className="w-8 h-8 rounded-lg bg-[#FF6700]/10 text-[#FF6700] flex items-center justify-center shrink-0">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                    </div>

                    <p className="text-slate-600 text-xs sm:text-sm font-normal leading-relaxed mb-3">
                      {study.description}
                    </p>

                    {/* Client Quote Chip */}
                    {study.clientQuote && (
                      <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200/80 text-[11px] text-slate-600 italic leading-relaxed mb-3">
                        &ldquo;{study.clientQuote}&rdquo;
                      </div>
                    )}
                  </div>

                  <div>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-3 border-t border-slate-100 mb-4">
                      {study.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] font-medium px-2.5 py-0.5 rounded-lg bg-slate-50 text-slate-600 border border-slate-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Bottom Action Trigger */}
                    <div className="w-full flex items-center justify-between pt-2 text-xs font-heading font-bold text-[#090D16] group-hover:text-[#FF6700] transition-colors">
                      <span>Explore Case Showcase</span>
                      <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#FF6700] group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </SpotlightCard>
            </MotionWrapper>
          ))}
        </div>

        {/* Client Logos Ribbon */}
        <MotionWrapper
          direction="up"
          delay={0.2}
          className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-200 text-center"
        >
          <div className="text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-4">
            Trusted by 1,500+ Businesses Nationwide Since 2004
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 max-w-5xl mx-auto">
            {clientLogos.map((logo) => (
              <span
                key={logo}
                className="px-3.5 py-1.5 bg-white rounded-full border border-slate-200 text-slate-700 text-xs font-semibold hover:border-[#FF6700] hover:text-[#FF6700] transition-colors shadow-xs"
              >
                {logo}
              </span>
            ))}
          </div>
        </MotionWrapper>

        {/* Bottom Call to Action */}
        <div className="mt-10 text-center">
          <button
            type="button"
            onClick={() =>
              openContactModal({
                intent: "start-project",
                serviceInterest: "Web & App Development",
                notes: "Interested in starting a new build with ReLaunch.",
              })
            }
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:translate-y-0.5 cursor-pointer"
          >
            <span>Start Your Project With ReLaunch</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dedicated Full Case Study Showcase Modal (Spring Morph + Scroll Locked) */}
      <AnimatePresence>
        {activeStudy && (
          <div
            key="case-study-showcase-modal"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[998] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain"
          >
            {/* Soft Frosted Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => setActiveStudy(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity cursor-pointer"
            />

            {/* Modal Dialog Container with Spring Physics */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 35, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, y: 25, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="relative w-full max-w-4xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[85vh] sm:max-h-[88vh] flex flex-col my-auto"
            >
              {/* Header (Fixed shrink-0) */}
              <div className="shrink-0 bg-white text-slate-900 p-5 sm:p-6 flex items-start justify-between border-b border-slate-100">
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.05 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200/80 text-[#FF6700] text-[10px] font-mono font-bold uppercase tracking-widest mb-2"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700]" />
                    <span>Case Study Showcase</span>
                  </motion.div>
                  <motion.h3
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.1 }}
                    className="font-heading font-black text-2xl sm:text-3xl text-slate-950 tracking-tight"
                  >
                    {activeStudy.title}
                  </motion.h3>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.14 }}
                    className="flex flex-wrap items-center gap-3 mt-1.5 text-xs text-slate-600"
                  >
                    <span className="font-semibold text-[#2E8B7A]">
                      {activeStudy.category}
                    </span>
                    <span>·</span>
                    <span className="font-mono text-slate-500">
                      https://{activeStudy.displayUrl}
                    </span>
                  </motion.div>
                </div>

                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveStudy(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Scrollable Body (Pure Scroll Area) */}
              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="p-5 sm:p-7 overflow-y-auto overscroll-contain space-y-6 flex-1 min-h-0 touch-pan-y"
              >
                {/* 3D Interactive Spatial Browser Mockup */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.12 }}
                >
                  <Work3DShowcase
                    image={activeStudy.image}
                    title={activeStudy.title}
                    displayUrl={activeStudy.displayUrl}
                    industry={activeStudy.industry}
                    metricValue={activeStudy.metricValue}
                    metricLabel={activeStudy.metricLabel}
                    isModal
                  />
                </motion.div>

                {/* Key Metric & Quote Highlight Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.18 }}
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4"
                >
                  <div className="p-4 rounded-2xl bg-orange-50 border border-[#FF6700]/20 flex flex-col justify-center">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                      {activeStudy.metricLabel}
                    </span>
                    <span className="font-heading font-black text-3xl sm:text-4xl text-[#FF6700]">
                      {activeStudy.metricValue}
                    </span>
                  </div>

                  <div className="sm:col-span-2 p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-800 mb-1.5">
                      <Quote className="w-4 h-4 text-[#FF6700]" />
                      <span>Verified Client Outcome</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 italic leading-relaxed">
                      &ldquo;{activeStudy.clientQuote || activeStudy.description}&rdquo;
                    </p>
                  </div>
                </motion.div>

                {/* Project Scope & Deliverables */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.22 }}
                >
                  <h4 className="text-xs font-heading font-bold uppercase tracking-wider text-slate-800 mb-2.5">
                    What ReLaunch Engineered:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {activeStudy.tags.map((tag, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.24 + idx * 0.03 }}
                        className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 hover:bg-white hover:border-[#FF6700]/40 transition-colors"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#2E8B7A] shrink-0" />
                        <span>{tag}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Bottom Actions */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.26 }}
                  className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3"
                >
                  {activeStudy.liveUrl ? (
                    <a
                      href={activeStudy.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#090D16] hover:text-[#FF6700] transition-colors"
                    >
                      <Globe className="w-4 h-4 text-[#2E8B7A]" />
                      <span>Visit Live Website ({activeStudy.displayUrl})</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  ) : (
                    <div className="text-xs text-slate-500">
                      Phoenix, AZ · Enterprise Delivery
                    </div>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => handleStartSimilarProject(activeStudy)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:translate-y-0.5 cursor-pointer"
                  >
                    <span>Start Similar Project</span>
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </motion.div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
