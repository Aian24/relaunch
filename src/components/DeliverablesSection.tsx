"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import MotionWrapper from "./MotionWrapper";
import SpotlightCard from "./SpotlightCard";
import { useContactModal } from "@/context/ContactModalContext";
import {
  Megaphone,
  Palette,
  Cpu,
  Code2,
  Film,
  MailCheck,
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

interface DeliverablePillar {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  category: string;
  tags: string[];
  rate: string;
  href: string;
}

const pillars: DeliverablePillar[] = [
  {
    icon: Megaphone,
    title: "Marketing & Advertising",
    category: "Paid & Organic Acquisition",
    tags: [
      "Google Ads & Paid Search",
      "Social Ads (Meta & TikTok)",
      "Local SEO & Map-Pack",
      "Conversion Tracking & Attribution",
    ],
    rate: "From $790/mo",
    href: "/services#marketing-ads",
  },
  {
    icon: Palette,
    title: "Brand & Design",
    category: "Visual Authority & Systems",
    tags: [
      "Logo & Visual Identity",
      "Brand Guidelines & Typography",
      "UX/UI Web & App Design",
      "Sales Collateral & Print",
    ],
    rate: "From $490/mo",
    href: "/services#brand-design",
  },
  {
    icon: Cpu,
    title: "AI Services",
    category: "Next-Gen Automation",
    tags: [
      "AI Search Visibility (AEO/GEO)",
      "24/7 Chatbots & Voice Agents",
      "Lead & Workflow Automations",
      "Custom AI Dashboards",
    ],
    rate: "From $690/mo",
    href: "/ai",
  },
  {
    icon: Code2,
    title: "Web & App Development",
    category: "High-Performance Platforms",
    tags: [
      "Custom Next.js Web Platforms",
      "E-Commerce Storefronts",
      "Mobile & Web Applications",
      "Client Portals & CRMs",
    ],
    rate: "From $1,250/mo",
    href: "/services#web-app-development",
  },
  {
    icon: Film,
    title: "Video & Content",
    category: "Attention & Storytelling",
    tags: [
      "Short-Form Reels & Shorts",
      "Brand & Explainer Films",
      "SEO Copywriting & Articles",
      "Monthly Content Calendars",
    ],
    rate: "From $590/mo",
    href: "/services#video-content",
  },
  {
    icon: MailCheck,
    title: "Email & SMS Marketing",
    category: "Lifecycle Nurturing",
    tags: [
      "Automated Lifecycle Flows",
      "High-Converting Broadcasts",
      "List Growth & Opt-In Funnels",
      "Reactivation Sequences",
    ],
    rate: "From $450/mo",
    href: "/services#email-sms-marketing",
  },
];

export default function DeliverablesSection() {
  const { openContactModal } = useContactModal();

  return (
    <section
      id="services"
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none scroll-mt-20 border-b border-slate-200"
    >
      {/* Section Header - Center Aligned */}
      <MotionWrapper
        direction="up"
        distance={25}
        className="text-center max-w-3xl mx-auto mb-14 sm:mb-16"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2 sm:whitespace-nowrap">
          EVERYTHING INCLUDED · ZERO FLUFF
        </span>
        <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.06] mb-3">
          <span className="whitespace-normal sm:whitespace-nowrap">All your marketing, </span>
          <span className="text-[#FF6700] whitespace-normal sm:whitespace-nowrap">handled.</span>
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto mb-6">
          Everything your business needs to build authority, capture demand, and close clients — delivered by one unified team.
        </p>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FF6700] hover:text-[#E55C00] transition-colors group whitespace-nowrap"
        >
          <span>View All Service Scopes</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </MotionWrapper>

      {/* 6 Core Deliverables Grid - Unified Orange Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {pillars.map((pillar, idx) => {
          const Icon = pillar.icon;

          return (
            <MotionWrapper
              key={pillar.title}
              direction="up"
              delay={idx * 0.08}
              distance={30}
              className="h-full"
            >
              <SpotlightCard
                spotlightColor="rgba(255,103,0, 0.08)"
                className="group flex flex-col justify-between rounded-3xl p-7 sm:p-8 bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] hover:border-[#FF6700]/40 transition-all duration-300 h-full relative"
              >
                {/* Top Brand Accent Bar */}
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-transparent group-hover:bg-[#FF6700] transition-colors rounded-full" />

                <div>
                  {/* Category Pill */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold px-2.5 py-1 rounded-full text-[#FF6700] bg-orange-50 border border-orange-200/60">
                      {pillar.category}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-all bg-orange-50 border border-orange-100 text-[#FF6700] group-hover:bg-[#FF6700] group-hover:text-white">
                      <Icon className="w-5 h-5 transition-colors" />
                    </div>
                    <h3 className="font-heading font-black text-xl text-[#090D16] group-hover:text-[#FF6700] transition-colors leading-snug">
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Clean Deliverable Checklist */}
                  <div className="space-y-2.5 mb-6 pt-5 border-t border-slate-100">
                    {pillar.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2.5 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-[#FF6700]" />
                        <span className="font-medium">{tag}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer with Starting Price & Actions */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                  <span className="text-xs font-heading font-bold text-slate-900">
                    {pillar.rate}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        openContactModal({
                          intent: "strategy-session",
                          serviceInterest: pillar.title,
                          notes: `Interested in ReLaunch Deliverable: ${pillar.title} (${pillar.rate}).`,
                        })
                      }
                      className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#FF6700] hover:text-[#CC5200] hover:bg-orange-50 transition-colors cursor-pointer py-1 px-2.5 rounded-lg"
                    >
                      <span>Inquire</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                    <Link
                      href={pillar.href}
                      className="inline-flex items-center text-[11px] font-bold uppercase tracking-wider text-slate-400 hover:text-slate-900 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100"
                    >
                      <span>Details →</span>
                    </Link>
                  </div>
                </div>
              </SpotlightCard>
            </MotionWrapper>
          );
        })}
      </div>
    </section>
  );
}
