"use client";

import React from "react";
import { aiSectionData, aiPillarsData } from "@/data/aiServices";
import { useContactModal } from "@/context/ContactModalContext";
import Ai3DVisual from "./Ai3DVisual";
import {
  Brain,
  Zap,
  Sparkles,
  Bot,
  Rocket,
  BarChart3,
  Terminal,
  ShieldCheck,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
} from "lucide-react";

import MotionWrapper from "./MotionWrapper";
import SpotlightCard from "./SpotlightCard";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Brain,
  Zap,
  Sparkles,
  Bot,
  Rocket,
  BarChart3,
  Terminal,
  ShieldCheck,
};

export default function AiSection() {
  const { openContactModal } = useContactModal();

  return (
    <section
      id="ai"
      className="py-16 lg:py-24 bg-[#FBFBFA] border-b border-slate-200 select-none scroll-mt-20 overflow-hidden relative"
    >
      {/* Subtle Background Pattern */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: "radial-gradient(#090D16 1.5px, transparent 1.5px)",
          backgroundSize: "24px 24px",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <MotionWrapper
          direction="up"
          distance={20}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 sm:mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-slate-800 text-[10px] font-mono font-bold uppercase tracking-widest mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#C0622A]" />
              <span>{aiSectionData.badge}</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.05]">
              The future isn&apos;t coming. <br />
              <span className="text-[#C0622A]">It&apos;s here.</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm font-normal max-w-2xl mt-2 leading-relaxed">
              {aiSectionData.subheadline}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={() => openContactModal({ intent: "ai-audit" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-orange-50/80 hover:bg-orange-100 border border-orange-200/90 hover:border-orange-300 text-[#C0622A] hover:text-[#a84f1d] font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs whitespace-nowrap active:translate-y-0.5 cursor-pointer hover:scale-102"
            >
              <Bot className="w-3.5 h-3.5 text-[#C0622A] shrink-0" />
              <span>Book an AI Audit</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C0622A]" />
            </button>

            <button
              type="button"
              onClick={() => openContactModal({ intent: "start-project" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-orange-50/80 hover:bg-orange-100 border border-orange-200/90 hover:border-orange-300 text-[#C0622A] hover:text-[#a84f1d] font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs whitespace-nowrap active:translate-y-0.5 cursor-pointer hover:scale-102"
            >
              <Rocket className="w-3.5 h-3.5 text-[#C0622A] shrink-0" />
              <span>Start Your Project</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#C0622A]" />
            </button>
          </div>
        </MotionWrapper>

        {/* 8 AI Pillars Grid with Unique 3D Visual Cards & Distinct Icons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {aiPillarsData.map((item, idx) => {
            const Icon = iconMap[item.icon] || Brain;

            return (
              <MotionWrapper
                key={item.id}
                direction="left"
                delay={idx * 0.07}
                distance={35}
                className="h-full"
              >
                <SpotlightCard
                  onClick={() =>
                    openContactModal({
                      intent: "ai-audit",
                      serviceInterest: item.title,
                      notes: `Interested in deploying AI capability: ${item.title}`,
                    })
                  }
                  spotlightColor="rgba(46, 139, 122, 0.15)"
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-xs hover:shadow-2xl hover:border-[#C0622A]/60 transition-all duration-300 flex flex-col justify-between h-full group hover:-translate-y-1.5 cursor-pointer relative overflow-hidden"
                >
                  {/* Top Accent Gradient Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-gradient-to-r group-hover:from-[#C0622A] group-hover:to-[#2E8B7A] transition-all" />

                  <div>
                    {/* Top Bar: Icon + Tag */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-slate-100 flex items-center justify-center text-[#090D16] group-hover:bg-[#090D16] group-hover:text-[#C0622A] group-hover:scale-110 transition-all duration-300 border border-slate-200/80 shadow-xs shrink-0">
                        <Icon className="w-5 h-5 shrink-0" />
                      </div>
                      {item.tag && (
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 group-hover:bg-orange-50 group-hover:text-[#C0622A] transition-colors border border-slate-200/60 whitespace-nowrap">
                          {item.tag}
                        </span>
                      )}
                    </div>

                    {/* Interactive 3D Spatial Visual Graphic (Unique for each of the 8 AI pillars) */}
                    <Ai3DVisual
                      pillarId={item.id}
                      className="w-full h-32 mb-4"
                    />

                    {/* Title & Description */}
                    <h3 className="font-heading font-black text-lg text-[#090D16] mb-1.5 leading-snug group-hover:text-[#C0622A] transition-colors tracking-tight">
                      {item.title}
                    </h3>
                    <p className="text-slate-600 text-xs leading-relaxed mb-4 font-normal line-clamp-3">
                      {item.description}
                    </p>
                  </div>

                  <div>
                    {/* Features Checklist */}
                    <div className="pt-3 border-t border-slate-100 space-y-1.5 mb-4">
                      {item.features.map((feat, fIdx) => (
                        <div
                          key={fIdx}
                          className="flex items-center gap-2 text-[11px] text-slate-700 font-medium"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#2E8B7A] shrink-0" />
                          <span className="truncate">{feat}</span>
                        </div>
                      ))}
                    </div>

                    {/* Bottom Action Trigger */}
                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-heading font-bold text-[#090D16] group-hover:text-[#C0622A] transition-colors">
                      <span className="flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-full bg-[#2E8B7A] animate-pulse" />
                        <span>Deploy Capability</span>
                      </span>
                      <span className="w-7 h-7 rounded-full bg-slate-100 group-hover:bg-[#C0622A] group-hover:text-white flex items-center justify-center transition-all">
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </SpotlightCard>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
