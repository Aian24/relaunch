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
      className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white select-none border-b border-slate-200"
    >
      {/* Section Header - Center Aligned */}
      <MotionWrapper
        direction="up"
        distance={25}
        className="text-center max-w-3xl mx-auto mb-14 sm:mb-16"
      >
        <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2 sm:whitespace-nowrap">
          CORE DELIVERABLES · ONE SUBSCRIPTION
        </span>
        <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.06] mb-3">
          <span className="block whitespace-normal sm:whitespace-nowrap">Everything your business needs.</span>
          <span className="block text-[#C0622A] whitespace-normal sm:whitespace-nowrap">One subscription.</span>
        </h2>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto mb-6">
          Pick the exact services your business needs. Bundle to save, pause or cancel anytime. No long-term contracts.
        </p>

        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#a84f1d] transition-colors group whitespace-nowrap"
        >
          <span>View All Service Scopes</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
        </Link>
      </MotionWrapper>

      {/* 6 Core Deliverables Grid - Pure Orange & White */}
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
                spotlightColor="rgba(192, 98, 42, 0.08)"
                className="group flex flex-col justify-between rounded-3xl p-7 sm:p-8 bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] hover:border-[#C0622A]/40 transition-all duration-300 h-full relative"
              >
                {/* Top Orange Accent */}
                <div className="absolute top-0 left-8 right-8 h-[2px] bg-transparent group-hover:bg-[#C0622A] transition-colors rounded-full" />

                <div>
                  {/* Category Pill */}
                  <div className="flex items-center justify-between mb-5">
                    <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#C0622A] bg-orange-50 border border-orange-200/60 px-2.5 py-1 rounded-full">
                      {pillar.category}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-[#C0622A] shrink-0 group-hover:scale-105 transition-transform">
                      <Icon className="w-5 h-5 text-[#C0622A]" />
                    </div>
                    <h3 className="font-heading font-black text-xl text-[#090D16] group-hover:text-[#C0622A] transition-colors leading-snug">
                      {pillar.title}
                    </h3>
                  </div>

                  {/* Clean Deliverable Checklist - Direct & Concise without dense paragraphs or busy labels */}
                  <div className="space-y-2.5 mb-6 pt-5 border-t border-slate-100">
                    {pillar.tags.map((tag) => (
                      <div
                        key={tag}
                        className="flex items-center gap-2.5 text-xs text-slate-700"
                      >
                        <CheckCircle2 className="w-4 h-4 text-[#C0622A] shrink-0" />
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
                      className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] transition-colors cursor-pointer py-1 px-2.5 rounded-lg hover:bg-orange-50"
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
