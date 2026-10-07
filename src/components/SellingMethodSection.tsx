"use client";

import { sellingFrameworkLayers, threeStepPlan } from "@/data/sellingFramework";
import MotionWrapper from "./MotionWrapper";
import SpotlightCard from "./SpotlightCard";
import { CheckCircle2 } from "lucide-react";

export default function SellingMethodSection() {
  return (
    <section id="method" className="py-14 sm:py-16 bg-white border-b border-slate-200 select-none scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <MotionWrapper direction="up" distance={20} className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2">
            THE RELAUNCH METHOD
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.05] mb-3">
            Marketing That Sells. <br />
            <span className="text-[#C0622A]">Nothing Else Ships.</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
            Every deliverable is engineered on our four-layer selling framework. Clients buy results, not methods—our framework ensures every piece moves customers toward buying.
          </p>
        </MotionWrapper>

        {/* 4 Layers Grid with Staggered Scroll Reveal */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8 sm:mb-10">
          {sellingFrameworkLayers.map((layer, idx) => (
            <MotionWrapper
              key={layer.layer}
              direction="up"
              delay={idx * 0.09}
              distance={35}
            >
              <SpotlightCard
                spotlightColor="rgba(192, 98, 42, 0.12)"
                className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200/90 flex flex-col justify-between hover:shadow-xl hover:border-[#C0622A]/40 transition-all duration-300 hover:-translate-y-1 relative overflow-hidden group h-full"
              >
                <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#C0622A] transition-colors" />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="font-heading font-black text-lg px-2.5 py-0.5 rounded-full text-white shadow-xs group-hover:scale-105 transition-transform"
                      style={{ backgroundColor: layer.color }}
                    >
                      {layer.weightPercent}
                    </span>
                    <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-[#C0622A] transition-colors">
                      Layer 0{idx + 1}
                    </span>
                  </div>

                  <h3 className="font-heading font-bold text-base text-[#090D16] mb-1.5 group-hover:text-[#C0622A] transition-colors">
                    {layer.layer}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mb-4 font-normal">
                    {layer.role}
                  </p>
                </div>

                <div className="pt-3 border-t border-slate-200">
                  <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                    Where It Applies:
                  </span>
                  <span className="text-xs font-semibold text-slate-800">
                    {layer.whereItApplies}
                  </span>
                </div>
              </SpotlightCard>
            </MotionWrapper>
          ))}
        </div>

        {/* Ironclad Standard Box */}
        <MotionWrapper direction="left" distance={40} delay={0.15} className="w-full mb-8 sm:mb-10">
          <SpotlightCard
            spotlightColor="rgba(192, 98, 42, 0.12)"
            className="p-6 sm:p-8 bg-orange-50/50 text-slate-900 rounded-2xl sm:rounded-3xl text-center shadow-md border border-orange-200/80 max-w-5xl mx-auto"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold mb-2 block">
              OUR IRONCLAD PRODUCTION STANDARD
            </span>
            <blockquote className="font-heading font-black text-xl sm:text-2xl lg:text-3xl text-slate-950 leading-snug mb-3">
              &ldquo;Standard for every deliverable: it must name the customer&apos;s problem, present the client as the answer, and ask for an action. Anything that doesn&apos;t sell doesn&apos;t ship.&rdquo;
            </blockquote>
            <p className="text-xs text-slate-500 font-medium">
              — ReLaunch Operating Principle since 2004 · Phoenix, Arizona
            </p>
          </SpotlightCard>
        </MotionWrapper>

        {/* 3-Step Execution Plan */}
        <div className="w-full">
          <MotionWrapper direction="up" className="text-center max-w-2xl mx-auto mb-6">
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] mb-1">
              The 3-Step Plan
            </h3>
            <p className="text-xs text-slate-500">
              Clear, transparent, and built for rapid turnaround.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
            {threeStepPlan.map((step, index) => (
              <MotionWrapper
                key={step.stepNumber}
                direction="left"
                delay={index * 0.12}
                distance={45}
              >
                <SpotlightCard
                  spotlightColor="rgba(46, 139, 122, 0.12)"
                  className="bg-slate-50 p-5 sm:p-6 rounded-2xl border border-slate-200 relative flex flex-col justify-between h-full hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="w-8 h-8 rounded-full bg-orange-50 border border-orange-200 text-[#C0622A] flex items-center justify-center font-heading font-black text-xs mb-3 shadow-xs">
                      {step.stepNumber}
                    </div>

                    <h4 className="font-heading font-bold text-base text-[#090D16] mb-1.5">
                      {step.title}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {step.description}
                    </p>
                  </div>

                  <div className="text-[11px] text-[#C0622A] font-semibold bg-white p-2.5 rounded-xl border border-slate-200">
                    {step.detail}
                  </div>
                </SpotlightCard>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


