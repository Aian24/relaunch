"use client";

import React from "react";
import Link from "next/link";
import { useContactModal } from "@/context/ContactModalContext";
import MotionWrapper from "./MotionWrapper";
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
  Bot,
  Rocket,
} from "lucide-react";

const aiServices = [
  {
    id: "aeo-geo",
    title: "AI Search Visibility (AEO/GEO)",
    category: "Search & Visibility",
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
    category: "Roadmap & Audits",
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
    category: "Make, n8n & CRM",
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
    category: "24/7 Inbound & Booking",
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
    category: "Review Growth & Replies",
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
    category: "Brand Copy & Pipelines",
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
    category: "Dashboards & Insights",
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
    category: "Custom Web Applications",
    icon: Code2,
    deliverables: [
      "Custom AI web apps",
      "Client service portals",
      "Internal operations tools",
    ],
  },
];

export default function AiSection() {
  const { openContactModal } = useContactModal();

  return (
    <section
      id="ai"
      className="py-20 sm:py-28 bg-white border-b border-slate-200 select-none scroll-mt-20 overflow-hidden relative"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header - Center Aligned */}
        <MotionWrapper
          direction="up"
          distance={20}
          className="text-center max-w-3xl mx-auto mb-12 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#C0622A] text-[10px] font-mono font-bold uppercase tracking-widest mb-3 whitespace-nowrap">
            <Sparkles className="w-3.5 h-3.5 text-[#C0622A]" />
            <span>FULL STACK AI SERVICES</span>
          </div>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.05] mb-3">
            <span className="block whitespace-normal sm:whitespace-nowrap">The future isn&apos;t coming.</span>
            <span className="block text-[#C0622A] whitespace-normal sm:whitespace-nowrap">It&apos;s here.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base font-normal max-w-2xl mx-auto mt-2 leading-relaxed mb-6">
            Practical AI systems engineered to capture leads, answer customers, and automate workflows.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => openContactModal({ intent: "ai-audit" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-orange-50 hover:bg-orange-100 border border-orange-200 hover:border-orange-300 text-[#C0622A] hover:text-[#a84f1d] font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs whitespace-nowrap active:translate-y-0.5 cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5 text-[#C0622A] shrink-0" />
              <span>Book an AI Audit</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-[#C0622A]" />
            </button>

            <Link
              href="/ai"
              className="inline-flex items-center justify-center gap-2 px-5 py-3 bg-[#C0622A] hover:bg-[#a84f1d] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs whitespace-nowrap active:translate-y-0.5 cursor-pointer"
            >
              <Rocket className="w-3.5 h-3.5 text-white shrink-0" />
              <span>Explore Full AI Stack</span>
              <ArrowRight className="w-3.5 h-3.5 text-white" />
            </Link>
          </div>
        </MotionWrapper>

        {/* 8 AI Services Grid with Bullet Checks */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {aiServices.map((service, idx) => {
            const IconComp = service.icon;
            return (
              <MotionWrapper
                key={service.id}
                direction="up"
                delay={idx * 0.04}
                distance={20}
                className="h-full"
              >
                <Link
                  href={`/ai#${service.id}`}
                  className="h-full p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-[0_4px_25px_rgba(0,0,0,0.02)] hover:border-[#C0622A]/40 hover:shadow-[0_12px_35px_rgba(192,98,42,0.08)] transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-5">
                      <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#C0622A] group-hover:bg-[#C0622A] group-hover:text-white transition-all duration-300 shadow-xs">
                        <IconComp className="w-6 h-6 transition-transform group-hover:scale-110" />
                      </div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#C0622A] bg-orange-50/80 px-2.5 py-1 rounded-full border border-orange-200/60 font-semibold">
                        {service.category}
                      </span>
                    </div>

                    <h3 className="font-heading font-black text-lg text-[#090D16] group-hover:text-[#C0622A] transition-colors leading-snug mb-4">
                      {service.title}
                    </h3>

                    {/* Bullet Checks */}
                    <div className="space-y-2 pt-3 border-t border-slate-100">
                      {service.deliverables.map((item) => (
                        <div key={item} className="flex items-start gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#C0622A] shrink-0 mt-0.5" />
                          <span className="text-xs text-slate-600 leading-snug">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#C0622A]">
                    <span className="font-heading uppercase tracking-wider text-[11px]">View Scope on AI Page</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}
