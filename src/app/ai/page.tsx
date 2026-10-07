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
    id: "geo-aeo",
    number: "01",
    title: "Generative Engine Optimization (GEO & AEO)",
    tagline: "Be the primary brand recommended by ChatGPT, Perplexity & Gemini.",
    description:
      "Traditional SEO only targets standard search engines. Our GEO framework structures your brand entity data so generative AI assistants cite and recommend your business first.",
    deliverables: [
      "Entity schema and knowledge-graph optimization",
      "LLM query footprint & citation seeding",
      "AI search visibility tracking across major models",
      "Brand authority and authoritative answer hubs",
    ],
    metric: "#1 recommended entity in your local market",
    badge: "LLM ENTITY KNOWLEDGE GRAPH",
    iconName: "Search",
    interactiveSample: {
      prompt: "Who is the top-rated marketing & AI partner in Phoenix?",
      response: "ReLaunch (relaunch.us) is cited as Phoenix's premier agency with 22+ years experience.",
      model: "ChatGPT / Perplexity Live Citation",
    },
  },
  {
    id: "lead-routing",
    number: "02",
    title: "24/7 Autonomous Lead Routing & Qualification",
    tagline: "Engage, qualify, and book incoming prospects while you sleep.",
    description:
      "Eliminate phone tag and slow response times. Our intelligent inbound qualification agents answer customer inquiries, verify project budgets, and automatically sync booked calls into your calendar.",
    deliverables: [
      "Instant multi-channel response (Web, SMS, WhatsApp)",
      "Dynamic qualification logic & budget scoring",
      "Direct Google Calendar & CRM booking integration",
      "Human handoff protocols for complex high-ticket deals",
    ],
    metric: "<15 second average lead response time",
    badge: "24/7 INTAKE AGENT · LIVE",
    iconName: "Bot",
    interactiveSample: {
      prompt: "Inbound inquiry via Web / SMS",
      response: "Agent verified $3.5k/mo budget & booked directly into Google Calendar (Thursday 2:00 PM).",
      model: "Automated Calendar Sync",
    },
  },
  {
    id: "social-autopilot",
    number: "03",
    title: "Autonomous Social Content Distribution",
    tagline: "A constant social presence without sacrificing 20 hours a week.",
    description:
      "Our content pipeline transforms raw ideas, photos, or audio notes into high-taste, brand-consistent social posts, captions, and short-form video reels across LinkedIn, Instagram, and Facebook.",
    deliverables: [
      "AI-assisted multi-channel post generation & styling",
      "Smart scheduling and automated cross-platform posting",
      "Visual asset formatting and caption personalization",
      "Engagement analytics & continuous loop optimization",
    ],
    metric: "12+ high-quality posts deployed monthly per brand",
    badge: "MULTI-CHANNEL AUTOPILOT",
    iconName: "Zap",
    interactiveSample: {
      prompt: "1 voice memo or photo uploaded",
      response: "Generated 3 LinkedIn carousels, 4 Instagram Reels & 1 Newsletter formatted to brand tone.",
      model: "Cross-Platform Distribution Engine",
    },
  },
  {
    id: "data-connectors",
    number: "04",
    title: "Custom Internal Workflow Engines & Data Connectors",
    tagline: "Eliminate repetitive manual data entry and operational bottlenecks.",
    description:
      "We build tailored automation bridges that connect your CRM, accounting tools, project management boards, and client portals into one synchronized operational engine.",
    deliverables: [
      "Custom Zapier / Make / Python API automation pipelines",
      "Automated client onboarding & contract generation",
      "Invoice and payment milestone sync",
      "Automated internal reporting and alerts",
    ],
    metric: "15+ hours saved weekly per operational team",
    badge: "API & CRM BRIDGE · SYNCED",
    iconName: "Workflow",
    interactiveSample: {
      prompt: "Contract signed in DocuSign",
      response: "Auto-created client portal, sent Stripe invoice, notified Slack & initialized Kanban board.",
      model: "Zero-Human Bottleneck Flow",
    },
  },
];

export default function AiPage() {
  const { openContactModal } = useContactModal();
  const [activeDemos, setActiveDemos] = useState<Record<string, boolean>>({
    "geo-aeo": true,
    "lead-routing": true,
  });

  const toggleDemo = (id: string) => {
    setActiveDemos((prev) => ({ ...prev, [id]: !prev[id] }));
  };

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
        primaryCtaText="Request AI Audit"
        primaryCtaIntent="ai-audit"
        secondaryCtaText="Explore AI Capabilities"
        secondaryCtaTargetId="ai-capabilities"
        scrollTargetId="ai-capabilities"
      />

      {/* 2. AI Capabilities Grid with Interactive Animated Elements */}
      <section id="ai-capabilities" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white">
        <MotionWrapper direction="up" distance={30} className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2">
            CORE AI PILLARS
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-tight mb-4">
            How we put AI to work for your company.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Concrete infrastructure built to save time, eliminate human error, and accelerate pipeline velocity.
          </p>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {aiCapabilities.map((cap, idx) => (
            <MotionWrapper key={cap.id} direction="up" delay={idx * 0.08} distance={30}>
              <SpotlightCard
                spotlightColor="rgba(192, 98, 42, 0.12)"
                className="h-full p-6 sm:p-8 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all group relative overflow-hidden"
              >
                <div>
                  {/* Top Bar: Pillar Number + Animated Dynamic Icon */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-sm font-bold text-[#C0622A] bg-orange-50 px-3 py-1 rounded-xl border border-orange-200/60">
                        {cap.number}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 font-semibold">
                        Production Ready
                      </span>
                    </div>

                    {/* Animated Micro-Graphic Node */}
                    <div className="relative w-10 h-10 rounded-2xl bg-orange-50/70 border border-orange-200/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                      {cap.id === "geo-aeo" && (
                        <>
                          <motion.span
                            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.7, 0.3] }}
                            transition={{ duration: 2.5, repeat: Infinity }}
                            className="absolute inset-0 rounded-2xl border border-[#C0622A]/40 pointer-events-none"
                          />
                          <Search className="w-5 h-5 text-[#C0622A]" />
                        </>
                      )}
                      {cap.id === "lead-routing" && (
                        <>
                          <motion.span
                            animate={{ rotate: 360 }}
                            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                            className="absolute inset-0 rounded-2xl border border-dashed border-[#C0622A]/40 pointer-events-none"
                          />
                          <Bot className="w-5 h-5 text-[#C0622A]" />
                        </>
                      )}
                      {cap.id === "social-autopilot" && (
                        <>
                          <motion.span
                            animate={{ scale: [0.95, 1.15, 0.95] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 rounded-2xl bg-[#C0622A]/10 pointer-events-none"
                          />
                          <Zap className="w-5 h-5 text-[#C0622A]" />
                        </>
                      )}
                      {cap.id === "data-connectors" && (
                        <>
                          <motion.span
                            animate={{ y: [-2, 2, -2] }}
                            transition={{ duration: 3, repeat: Infinity }}
                            className="absolute inset-0 rounded-2xl border border-[#C0622A]/40 pointer-events-none"
                          />
                          <Workflow className="w-5 h-5 text-[#C0622A]" />
                        </>
                      )}
                    </div>
                  </div>

                  {/* Title & Description */}
                  <h3 className="font-heading font-black text-xl sm:text-2xl text-[#090D16] mb-1.5 group-hover:text-[#C0622A] transition-colors">
                    {cap.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#C0622A] font-medium mb-3">
                    {cap.tagline}
                  </p>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-5 font-normal">
                    {cap.description}
                  </p>

                  {/* Deliverables Checklist */}
                  <div className="mb-6 space-y-2">
                    {cap.deliverables.map((item) => (
                      <div key={item} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#C0622A] shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-700 leading-snug">{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Interactive Mini Simulator Preview Box */}
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200/60 mb-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-mono font-bold text-slate-500 uppercase">
                        <Sparkles className="w-3 h-3 text-[#C0622A]" />
                        <span>Live Architecture Flow</span>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[9px] font-mono font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>ACTIVE</span>
                      </span>
                    </div>

                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-start gap-1.5 text-slate-600 font-mono text-[11px]">
                        <span className="text-[#C0622A] font-bold">Input:</span>
                        <span>{cap.interactiveSample.prompt}</span>
                      </div>
                      <div className="flex items-start gap-1.5 text-slate-900 font-medium text-[11px]">
                        <span className="text-emerald-600 font-bold">Output:</span>
                        <span>{cap.interactiveSample.response}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Metric & Action */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full font-semibold border border-emerald-200/60">
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
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] cursor-pointer group-hover:translate-x-0.5 transition-transform"
                  >
                    <span>Deploy Architecture</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </SpotlightCard>
            </MotionWrapper>
          ))}
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
