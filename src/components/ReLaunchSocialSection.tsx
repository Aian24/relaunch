"use client";

import { useState } from "react";
import { socialData } from "@/data/socialSubBrand";
import { useContactModal } from "@/context/ContactModalContext";
import MotionWrapper from "./MotionWrapper";
import NumberCounter from "./NumberCounter";
import { CheckCircle2, ExternalLink, Rocket, ArrowRight, Zap, Share2 } from "lucide-react";

export default function ReLaunchSocialSection() {
  const { openContactModal } = useContactModal();
  const [activeTrack, setActiveTrack] = useState<"Track B" | "Track A">("Track B");

  const filteredTiers = socialData.tiers.filter((tier) =>
    tier.track.startsWith(activeTrack)
  );

  return (
    <section id="social" className="py-20 sm:py-28 bg-white text-[#090D16] border-b border-slate-200 select-none scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header - Centered with no awkward wrapping */}
        <MotionWrapper direction="up" distance={20} className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#C0622A] text-[10px] font-mono font-bold uppercase tracking-widest mb-3 whitespace-nowrap">
            <Share2 className="w-3.5 h-3.5 text-[#C0622A]" />
            <span>Autopilot Sub-Brand</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.05] mb-3">
            <span className="block whitespace-normal sm:whitespace-nowrap">Your Social Media,</span>
            <span className="block text-[#C0622A] whitespace-normal sm:whitespace-nowrap">Running Itself.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto">
            Hands-off social media content created, scheduled, and published across 5 platforms. Just 30 minutes a month to approve.
          </p>
        </MotionWrapper>

        {/* 2-Column Overview & Process Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 mb-12 sm:mb-16">
          {/* Left Card: Brand Overview & Stats */}
          <MotionWrapper
            direction="left"
            delay={0.08}
            distance={45}
            className="lg:col-span-6 bg-[#FAF9F6] border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-1.5 whitespace-nowrap">
                HANDS-OFF AUTOMATION
              </span>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-[#090D16] mb-3">
                Full-Service Content Engine
              </h3>
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                Done-for-you monthly content creation tailored to your brand, scheduled and published automatically across your channels.
              </p>

              {/* Supported Platforms */}
              <div className="mb-6">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 block mb-2">
                  Supported Platforms:
                </span>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  {socialData.platforms.map((p) => (
                    <span
                      key={p}
                      className="px-2.5 py-1 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold uppercase tracking-wider shadow-2xs whitespace-nowrap"
                    >
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div>
              {/* Action Buttons: Clean Symmetrical 2-Button Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <button
                  type="button"
                  onClick={() =>
                    openContactModal({
                      intent: "start-project",
                      serviceInterest: "ReLaunch Social",
                      notes: "Interested in getting started with ReLaunch Social Autopilot.",
                    })
                  }
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#C0622A] hover:bg-[#a84f1d] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-xs transition-all active:translate-y-0.5 whitespace-nowrap cursor-pointer"
                >
                  <span>Start Your Project</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={socialData.portalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 bg-white hover:bg-slate-100 border border-slate-200 text-[#090D16] font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all active:translate-y-0.5 whitespace-nowrap"
                >
                  <span>Login to Portal</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C0622A]" />
                </a>
              </div>

              {/* Stats Counter Strip */}
              <div className="grid grid-cols-3 gap-3 pt-5 border-t border-slate-200">
                <div>
                  <div className="font-heading font-black text-xl sm:text-2xl text-[#C0622A]">
                    <NumberCounter value={30} suffix="min" />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
                    Your time / mo
                  </div>
                </div>
                <div>
                  <div className="font-heading font-black text-xl sm:text-2xl text-[#C0622A]">
                    <NumberCounter value={6} />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
                    Plan Tiers
                  </div>
                </div>
                <div>
                  <div className="font-heading font-black text-xl sm:text-2xl text-[#C0622A]">
                    <NumberCounter value={5} />
                  </div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500 mt-0.5">
                    Platforms
                  </div>
                </div>
              </div>
            </div>
          </MotionWrapper>

          {/* Right Card: 4-Step Process */}
          <MotionWrapper
            direction="left"
            delay={0.16}
            distance={45}
            className="lg:col-span-6 bg-[#FAF9F6] border border-slate-200/90 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.06)] transition-all"
          >
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-1.5 whitespace-nowrap">
                THE 4-STEP PROCESS
              </span>
              <h3 className="font-heading font-black text-xl sm:text-2xl text-[#090D16] mb-4">
                How It Works
              </h3>

              <ul className="space-y-3">
                {socialData.steps.map((step, i) => (
                  <li
                    key={step.num}
                    className="flex items-start gap-3 pb-3 border-b border-slate-200 last:border-none last:pb-0"
                  >
                    <div className="w-7 h-7 rounded-lg bg-[#C0622A] text-white font-heading font-black text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-heading font-bold text-xs sm:text-sm text-[#090D16] mb-0.5">
                        {step.title}
                      </h4>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {step.description}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 pt-3 border-t border-slate-200 text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-[#C0622A] shrink-0" />
              <span>5-minute setup · Instant portal access upon checkout</span>
            </div>
          </MotionWrapper>
        </div>

        {/* Social Plan Tiers Selector */}
        <div className="pt-8 border-t border-slate-200">
          <MotionWrapper direction="up" className="text-center max-w-3xl mx-auto mb-8 sm:mb-10">
            <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] mb-2">
              ReLaunch Social Plan Options
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 mb-6">
              Select between done-for-you production or raw client content scheduling.
            </p>

            <div className="inline-flex p-1 bg-slate-100 rounded-xl border border-slate-200 gap-1 mx-auto">
              <button
                onClick={() => setActiveTrack("Track B")}
                className={`px-4 sm:px-5 py-2 rounded-lg font-heading font-bold text-xs uppercase tracking-wider transition-all text-center whitespace-nowrap cursor-pointer ${
                  activeTrack === "Track B"
                    ? "bg-[#C0622A] text-white shadow-xs"
                    : "text-slate-600 hover:text-[#090D16]"
                }`}
              >
                Track B (Done-For-You)
              </button>
              <button
                onClick={() => setActiveTrack("Track A")}
                className={`px-4 sm:px-5 py-2 rounded-lg font-heading font-bold text-xs uppercase tracking-wider transition-all text-center whitespace-nowrap cursor-pointer ${
                  activeTrack === "Track A"
                    ? "bg-[#C0622A] text-white shadow-xs"
                    : "text-slate-600 hover:text-[#090D16]"
                }`}
              >
                Track A (Client Photos)
              </button>
            </div>
          </MotionWrapper>

          {/* Tiers Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {filteredTiers.map((tier, idx) => (
              <MotionWrapper
                key={tier.id}
                direction="up"
                delay={idx * 0.1}
                distance={35}
                className={`p-7 sm:p-8 rounded-3xl border transition-all ${
                  tier.popular
                    ? "bg-white border-[#C0622A] shadow-[0_12px_40px_rgba(192,98,42,0.12)] relative"
                    : "bg-white border-slate-200/90 hover:border-slate-300 shadow-[0_4px_25px_rgba(0,0,0,0.03)]"
                } flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-heading font-bold text-lg text-[#090D16]">
                      {tier.name}
                    </span>
                    {tier.popular && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#C0622A] text-white whitespace-nowrap">
                        Popular
                      </span>
                    )}
                  </div>

                  <div className="mb-4">
                    <div className="font-heading font-black text-3xl sm:text-4xl text-[#090D16]">
                      ${tier.price}
                      <span className="text-xs text-slate-500 font-normal"> /month</span>
                    </div>
                    <span className="text-xs font-semibold text-[#C0622A] block mt-1 whitespace-nowrap">
                      {tier.postsPerMonth}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed mb-6">
                    {tier.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {tier.features.map((f, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C0622A] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      openContactModal({
                        intent: "start-project",
                        serviceInterest: "ReLaunch Social",
                        notes: `Selected ReLaunch Social Plan: ${tier.name} ($${tier.price}/mo - ${tier.track}).`,
                      })
                    }
                    className={`w-full py-3.5 px-4 rounded-xl font-heading font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all text-center whitespace-nowrap cursor-pointer ${
                      tier.popular
                        ? "bg-[#C0622A] hover:bg-[#a84f1d] text-white shadow-xs active:translate-y-0.5"
                        : "bg-slate-100 text-slate-800 hover:bg-slate-200 active:translate-y-0.5"
                    }`}
                  >
                    <span>Select Plan &amp; Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
