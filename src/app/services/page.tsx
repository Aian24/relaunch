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
import InteractiveImage from "@/components/InteractiveImage";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Layers,
  Code2,
  TrendingUp,
  Bot,
  Video,
  Search,
  ShieldCheck,
} from "lucide-react";

const servicePillars = [
  {
    id: "brand-strategy",
    number: "01",
    title: "Brand Strategy & Visual Identity",
    tagline: "Build a brand that commands market authority and profound customer trust.",
    description:
      "We architect distinct visual languages, brand positioning frameworks, and comprehensive digital design systems that differentiate your business and accelerate conversions across every touchpoint.",
    deliverables: [
      "Brand Positioning & Market Messaging Frameworks",
      "Logo, Typography, Color & Design Systems",
      "Commercial Photography, Video & Social Assets",
    ],
    impact: "+300% brand recall & premium positioning",
    image: "/images/brand-strategy.jpg",
    icon: Layers,
  },
  {
    id: "web-software",
    number: "02",
    title: "Web Architecture & Custom Software",
    tagline: "High-performance digital products engineered for velocity and scale.",
    description:
      "From bespoke flagship websites to custom client portals and internal workflow SaaS tools, we engineer clean, ultra-fast Next.js code tailored specifically to your business operations.",
    deliverables: [
      "Next.js, React & Mobile-First Web Architecture",
      "Custom Client Dashboards & Secure Portals",
      "Database Infrastructure & Seamless API Integrations",
    ],
    impact: "<0.8s load times & 40%+ conversion lift",
    image: "/images/digital-studio.jpg",
    icon: Code2,
  },
  {
    id: "growth-media",
    number: "03",
    title: "Performance Media & Search Dominance",
    tagline: "Turn marketing spend into predictable, high-ticket customer pipeline.",
    description:
      "Data-driven multi-channel advertising, Google Local map-pack dominance, and organic search authority designed to capture high-intent buyers and maximize customer lifetime value.",
    deliverables: [
      "High-ROI Google & Meta Paid Acquisition Campaigns",
      "Local Map-Pack Dominance & Technical SEO Architecture",
      "Conversion Tracking, Funnels & Real-Time Analytics",
    ],
    impact: "3.8x verified average return on ad spend (ROAS)",
    image: "/showcase/turflife.jpg",
    icon: TrendingUp,
  },
];

export default function ServicesPage() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Cinematic Services Video Hero */}
      <PageVideoHero
        kicker="Full-Scope Capabilities · Est. 2004"
        titleRegular="Brand, Strategy &"
        titleHighlight="Digital Architecture."
        description="End-to-end design, custom web engineering, and intelligent marketing infrastructure. Built with speed, precision, and zero bloated agency retainers."
        videoSrc="/relaunch-hero2.mp4"
        posterSrc="/hero_frames/frame_000.webp"
        primaryCtaText="Start a Project"
        primaryCtaIntent="strategy-session"
        secondaryCtaText="Explore Capabilities"
        secondaryCtaTargetId="detailed-deliverables"
        scrollTargetId="detailed-deliverables"
      />

      {/* 2. Detailed Service Pillars Breakdown with Scroll-Up Reveal */}
      <section id="detailed-deliverables" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <MotionWrapper direction="up" distance={30} className="text-center max-w-2xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2">
            THREE CORE CAPABILITIES
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-tight mb-4">
            Everything your business needs to lead.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Three unified disciplines designed to elevate your market position, accelerate digital speed, and scale high-value customer acquisition.
          </p>
        </MotionWrapper>

        <div className="flex flex-col gap-12 sm:gap-16">
          {servicePillars.map((pillar, idx) => {
            const isReversed = idx % 2 === 1;

            return (
              <MotionWrapper key={pillar.id} direction="up" delay={idx * 0.08} distance={35}>
                <div
                  id={pillar.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center p-6 sm:p-10 rounded-3xl bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] transition-all hover:shadow-[0_8px_35px_rgba(0,0,0,0.06)] ${
                    isReversed ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Column */}
                  <div className={`lg:col-span-7 flex flex-col justify-between ${isReversed ? "lg:order-2" : "lg:order-1"}`}>
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <span className="font-mono text-sm font-bold text-[#C0622A] bg-orange-50 px-2.5 py-1 rounded-lg border border-orange-200/60">
                          {pillar.number}
                        </span>
                        <span className="text-xs font-mono uppercase tracking-wider text-slate-500 font-semibold">
                          Core Competency
                        </span>
                      </div>

                      <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] mb-2">
                        {pillar.title}
                      </h3>
                      <p className="text-sm sm:text-base text-[#C0622A] font-medium mb-4">
                        {pillar.tagline}
                      </p>
                      <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                        {pillar.description}
                      </p>

                      <div className="mb-6">
                        <div className="text-xs font-mono uppercase tracking-wider text-slate-800 font-bold mb-3">
                          Included Deliverables:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {pillar.deliverables.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 text-[#C0622A] shrink-0 mt-0.5" />
                              <span className="text-xs text-slate-700 leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-200/60">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{pillar.impact}</span>
                      </div>

                      <button
                        type="button"
                        onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: pillar.title })}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] transition-colors cursor-pointer group"
                      >
                        <span>Inquire About {pillar.title.split("&")[0]}</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>

                  {/* Visual Column with Interactive Hover Animation */}
                  <div className={`lg:col-span-5 ${isReversed ? "lg:order-1" : "lg:order-2"}`}>
                    <InteractiveImage
                      src={pillar.image}
                      alt={pillar.title}
                      aspectRatio="aspect-[4/3]"
                      badge={pillar.number}
                      badgeColor="bg-[#C0622A]"
                      className="border-slate-200 shadow-md"
                    />
                  </div>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </section>

      {/* 3. Bottom High-Converting CTA */}
      <CtaBanner />

      {/* 4. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
