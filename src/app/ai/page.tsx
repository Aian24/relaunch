"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CtaBanner from "@/components/CtaBanner";
import PageVideoHero from "@/components/PageVideoHero";
import SpotlightCard from "@/components/SpotlightCard";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import {
  Bot,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Workflow,
  Search,
  Zap,
  ShieldCheck,
  Clock,
  Database,
} from "lucide-react";

const aiCapabilities = [
  {
    id: "lead-qualification",
    number: "01",
    title: "24/7 Autonomous Lead Capture & Qualification",
    tagline: "Engage, qualify, and book high-intent prospects in under 60 seconds.",
    problem: "Inbound leads go cold when response times take hours or days.",
    solution:
      "Our conversational AI intake agents answer questions instantly across Web and SMS, verify project budget and timeline, and automatically schedule qualified calls directly into your calendar.",
    deliverables: [
      "Instant 24/7 Web & SMS Conversational Intake",
      "Dynamic Budget Verification & Prospect Scoring",
      "Direct Google Calendar & CRM Sync (HubSpot, Salesforce)",
    ],
    metric: "<15s Lead Response",
    badge: "INSTANT CONVERSION",
    icon: Bot,
  },
  {
    id: "workflow-automation",
    number: "02",
    title: "Operations & Workflow Automation",
    tagline: "Eliminate repetitive manual tasks and accelerate client delivery.",
    problem: "Teams waste dozens of weekly hours on manual data transfer and onboarding admin.",
    solution:
      "We design custom API automation bridges connecting your website forms, Stripe payments, Slack notifications, and project management boards into one continuous, zero-bottleneck engine.",
    deliverables: [
      "Custom Webhook, API & Database Automations",
      "Zero-Touch Client Onboarding & Contract Triggering",
      "Automated Milestone Invoicing & Real-time Alerts",
    ],
    metric: "15+ Hrs Saved / Wk",
    badge: "OPERATIONAL LEVERAGE",
    icon: Zap,
  },
  {
    id: "geo-search",
    number: "03",
    title: "Generative Engine Optimization (GEO & AEO)",
    tagline: "Be the top brand recommended by ChatGPT, Perplexity & Gemini.",
    problem: "Search behavior is shifting rapidly from Google blue links to AI answer engines.",
    solution:
      "We structure your website entity schema and authoritative knowledge graphs so generative AI recommendation models cite, reference, and recommend your business to high-intent searchers.",
    deliverables: [
      "Entity Knowledge-Graph & Schema Structuring",
      "LLM Search Query Footprint & Citation Seeding",
      "AI Search Visibility Tracking Across Major Models",
    ],
    metric: "#1 AI Search Rank",
    badge: "NEXT-GEN SEARCH",
    icon: Search,
  },
];

export default function AiPage() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Cinematic AI Video Hero */}
      <PageVideoHero
        kicker="Pragmatic AI Systems · 24/7 Automation"
        titleRegular="Practical AI &"
        titleHighlight="Autonomous Growth."
        description="No gimmicks or sci-fi exaggerations. We engineer battle-tested AI pipelines, Generative Engine Optimization (GEO), and autonomous lead qualification engines that run 24/7."
        videoSrc="/aipage.mp4"
        posterSrc="/hero_frames/frame_000.webp"
        scrollTargetId="ai-capabilities"
      />

      {/* 2. AI Capabilities Grid: Clean 3-Pillar Business ROI Focus */}
      <section id="ai-capabilities" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white">
        <MotionWrapper direction="up" distance={30} className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2">
            THREE PRACTICAL AI ENGINES
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-tight mb-4">
            How we put AI to work for your company.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Concrete infrastructure engineered to eliminate bottlenecks, capture lost revenue, and accelerate operational velocity.
          </p>
        </MotionWrapper>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {aiCapabilities.map((cap, idx) => {
            const IconComp = cap.icon;
            return (
              <MotionWrapper key={cap.id} direction="up" delay={idx * 0.1} distance={30} className="h-full">
                <SpotlightCard
                  spotlightColor="rgba(192, 98, 42, 0.12)"
                  className="h-full p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all group relative overflow-hidden"
                >
                  <div>
                    {/* Top Bar: Pillar Number + Icon */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-sm font-bold text-[#C0622A] bg-orange-50 px-3 py-1 rounded-xl border border-orange-200/60">
                          {cap.number}
                        </span>
                        <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                          {cap.badge}
                        </span>
                      </div>

                      <div className="w-10 h-10 rounded-2xl bg-orange-50/80 border border-orange-200/80 flex items-center justify-center text-[#C0622A] group-hover:scale-110 transition-transform">
                        <IconComp className="w-5 h-5" />
                      </div>
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="font-heading font-black text-xl sm:text-2xl text-[#090D16] mb-2 group-hover:text-[#C0622A] transition-colors">
                      {cap.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#C0622A] font-semibold mb-4">
                      {cap.tagline}
                    </p>

                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                      {cap.solution}
                    </p>

                    {/* Deliverables Checklist */}
                    <div className="mb-6 space-y-2.5 pt-4 border-t border-slate-100">
                      <div className="text-[11px] font-mono uppercase tracking-wider text-slate-800 font-bold mb-2">
                        Core Capabilities:
                      </div>
                      {cap.deliverables.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-[#C0622A] shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Bottom Metric & Action */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between gap-2">
                    <span className="text-[11px] font-mono text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full font-semibold border border-emerald-200/60 whitespace-nowrap shrink-0">
                      {cap.metric}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        openContactModal({
                          intent: "ai-audit",
                          notes: `Inquiry regarding ${cap.title}`,
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] cursor-pointer whitespace-nowrap shrink-0 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Deploy Engine</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </SpotlightCard>
              </MotionWrapper>
            );
          })}
        </div>
      </section>

      {/* 3. Bottom CTA */}
      <CtaBanner />

      {/* 4. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
