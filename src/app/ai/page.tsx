"use client";

import React from "react";
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
  Globe,
  Lightbulb,
  Workflow,
  MessageSquare,
  Star,
  Sparkles,
  BarChart3,
  Code2,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
} from "lucide-react";

const aiServices = [
  {
    id: "aeo-geo",
    title: "AI Search Visibility (AEO/GEO)",
    tagline: "Rank in ChatGPT, Perplexity & Google AI Overviews.",
    icon: Globe,
    deliverables: [
      "AI visibility audit",
      "Entity & schema optimization",
      "Citation-ready content",
    ],
  },
  {
    id: "ai-strategy",
    title: "AI Strategy & Consulting",
    tagline: "Actionable roadmap focused on immediate ROI.",
    icon: Lightbulb,
    deliverables: [
      "AI readiness assessment",
      "Opportunity mapping",
      "Tool selection & integration",
    ],
  },
  {
    id: "automation-workflows",
    title: "Automation & Workflows",
    tagline: "Automate repetitive tasks and sync your tools.",
    icon: Workflow,
    deliverables: [
      "Lead follow-up automation",
      "CRM data synchronization",
      "Custom Make & n8n builds",
    ],
  },
  {
    id: "chatbots-voice-agents",
    title: "AI Chatbots & Voice Agents",
    tagline: "24/7 agents that qualify leads and book appointments.",
    icon: MessageSquare,
    deliverables: [
      "Website chat agents",
      "Inbound phone answering",
      "Automated calendar booking",
    ],
  },
  {
    id: "reputation-reviews",
    title: "AI Reputation & Reviews",
    tagline: "Automate review requests and draft AI replies.",
    icon: Star,
    deliverables: [
      "Review request sequences",
      "Multi-platform monitoring",
      "AI response drafting",
    ],
  },
  {
    id: "content-creative",
    title: "AI Content & Creative",
    tagline: "Scale on-brand copy and assets trained on your voice.",
    icon: Sparkles,
    deliverables: [
      "Brand voice training",
      "High-converting ad copy",
      "Monthly content pipelines",
    ],
  },
  {
    id: "business-intelligence",
    title: "AI Business Intelligence",
    tagline: "Real-time performance dashboards and revenue insights.",
    icon: BarChart3,
    deliverables: [
      "Automated performance reports",
      "Competitor tracking",
      "Revenue attribution",
    ],
  },
  {
    id: "apps-tools",
    title: "AI Apps & Portals",
    tagline: "Custom web applications and portals with built-in AI.",
    icon: Code2,
    deliverables: [
      "Custom AI web apps",
      "Client service portals",
      "Internal operations tools",
    ],
  },
];

export default function AiPage() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Cinematic AI Video Hero with Explore & Book a Strategy Call */}
      <PageVideoHero
        kicker="Pragmatic AI Systems · Est. 2004"
        titleRegular="The Future Isn't Coming."
        titleHighlight="It's Here."
        description="Practical AI systems engineered to capture leads, answer customers, and automate workflows with zero technical experience required."
        videoSrc="/aipage.mp4"
        posterSrc="/hero_frames/frame_000.webp"
        exploreText="Explore AI Stack"
        exploreTargetId="all-ai-services"
        bookStrategyText="Book Strategy Call"
        bookStrategyIntent="ai-audit"
        scrollTargetId="all-ai-services"
      />

      {/* 2. Full Stack AI Services Grid */}
      <section id="all-ai-services" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white">
        <MotionWrapper direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2">
            FULL STACK AI SERVICES
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-tight mb-4">
            AI Solutions Built for Real Business Growth.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Practical AI systems engineered to capture leads, answer customers, and automate workflows.
          </p>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {aiServices.map((service, idx) => {
            const IconComp = service.icon;
            return (
              <MotionWrapper
                key={service.id}
                direction="up"
                delay={idx * 0.05}
                distance={25}
                className="h-full"
              >
                <div id={service.id} className="scroll-mt-28 h-full">
                  <SpotlightCard
                    spotlightColor="rgba(192, 98, 42, 0.12)"
                    className="h-full p-7 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] flex flex-col justify-between hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all group relative overflow-hidden"
                  >
                  <div>
                    {/* Clean, Prominent Icon Tile */}
                    <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-[#C0622A] group-hover:bg-[#C0622A] group-hover:text-white group-hover:border-[#C0622A] transition-all duration-300 mb-6 shadow-xs">
                      <IconComp className="w-6 h-6 transition-transform group-hover:scale-110" />
                    </div>

                    {/* Title & Tagline */}
                    <h3 className="font-heading font-black text-xl text-[#090D16] mb-2 group-hover:text-[#C0622A] transition-colors leading-snug">
                      {service.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5 font-normal">
                      {service.tagline}
                    </p>

                    {/* Clean Deliverables Checklist without busy labels */}
                    <div className="space-y-2 pt-4 border-t border-slate-100 mb-6">
                      {service.deliverables.map((item) => (
                        <div key={item} className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#C0622A] shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-700 leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Card Bottom: Inquire Action */}
                  <div className="pt-5 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() =>
                        openContactModal({
                          intent: "ai-audit",
                          serviceInterest: service.title,
                          notes: `Inquiry regarding ${service.title}`,
                        })
                      }
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] cursor-pointer whitespace-nowrap shrink-0 group-hover:translate-x-0.5 transition-transform"
                    >
                      <span>Deploy System</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </SpotlightCard>
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
