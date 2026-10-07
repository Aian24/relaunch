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
    tagline: "Build a brand that commands authority and stands the test of time.",
    description:
      "We architect enduring brand positioning, distinct visual languages, and comprehensive design systems that set you apart from competitors and build profound trust.",
    deliverables: [
      "Brand Positioning & Market Differentiation",
      "Logo, Typography & Color Systems",
      "Brand Style Guides & Digital Toolkits",
      "Stationery, Packaging & Physical Collateral",
      "Messaging Frameworks & Tone of Voice",
    ],
    impact: "+300% brand recall & premium market positioning",
    image: "/images/brand-strategy.jpg",
    icon: Layers,
  },
  {
    id: "web-software",
    number: "02",
    title: "Web Architecture & Custom Software",
    tagline: "High-performance digital products engineered for scale.",
    description:
      "From bespoke marketing flagships to complex internal portals and SaaS platforms, we write clean, scalable, and ultra-fast code tailored precisely to your operational workflow.",
    deliverables: [
      "Next.js, React & Modern Web Applications",
      "Custom Client Portals & Dashboards",
      "E-Commerce & High-Converting Funnels",
      "API Integrations & Database Architecture",
      "Zero-Bloat, Lightning-Fast Web Vitals",
    ],
    impact: "<0.8s load times & 40%+ conversion lift",
    image: "/images/digital-studio.jpg",
    icon: Code2,
  },
  {
    id: "performance-ads",
    number: "03",
    title: "Performance Marketing & Paid Media",
    tagline: "Profitable customer acquisition channels with predictable ROI.",
    description:
      "Data-driven advertising campaigns across Google, Meta, and high-intent search networks designed to turn ad spend into high-ticket pipeline and revenue.",
    deliverables: [
      "Google Ads (Search, Display, Performance Max)",
      "Meta Ads (Facebook & Instagram Acquisition)",
      "High-Converting Landing Page Design",
      "Multi-Touch Attribution & Analytics",
      "Continuous A/B Creative Testing",
    ],
    impact: "3.8x average verified return on ad spend (ROAS)",
    image: "/showcase/carmen_hotel.jpg",
    icon: TrendingUp,
  },
  {
    id: "ai-automation",
    number: "04",
    title: "AI Automation & Custom Workflows",
    tagline: "Replace repetitive manual bottlenecks with automated intelligence.",
    description:
      "We design autonomous lead qualification pipelines, CRM integrations, and Generative Engine Optimization (GEO) strategies that accelerate your business 24/7.",
    deliverables: [
      "24/7 Inbound Qualified Lead Routing",
      "Generative Engine Optimization (GEO/AEO)",
      "CRM & Database Workflow Automations",
      "Custom AI Internal Copilots",
      "Automated Social Distribution Systems",
    ],
    impact: "15+ weekly operational hours saved per team",
    image: "/images/ai-engineering.jpg",
    icon: Bot,
  },
  {
    id: "content-video",
    number: "05",
    title: "Creative Content & Video Production",
    tagline: "Cinematic media that stops the scroll and builds authentic connection.",
    description:
      "High-production brand documentaries, product showcases, social video reels, and editorial photography that bring your story to life across every digital touchpoint.",
    deliverables: [
      "Cinematic Brand Films & Commercials",
      "Short-Form Social Video Production (Reels, TikTok)",
      "Product & Commercial Photography",
      "Motion Graphics & 3D Visual Assets",
      "Ongoing Monthly Content Engine",
    ],
    impact: "5.2x higher organic social engagement",
    image: "/showcase/volcano_resort.jpg",
    icon: Video,
  },
  {
    id: "local-seo",
    number: "06",
    title: "Search Authority & Local Dominance",
    tagline: "Capture high-intent buyers when they search for what you do.",
    description:
      "Comprehensive search engine optimization combining technical site architecture, local map-pack dominance, and AI-powered entity building to secure top search rankings.",
    deliverables: [
      "Google Business Profile Optimization",
      "Local Citation Building & Review Systems",
      "Technical SEO & Core Web Vitals",
      "High-Intent Keyword Content Strategy",
      "Competitor Search Share Conquesting",
    ],
    impact: "#1 rankings across high-ticket local search terms",
    image: "/showcase/turflife.jpg",
    icon: Search,
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
            DETAILED DELIVERABLES
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-tight mb-4">
            Everything your business needs to lead.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            Pick individual core competencies or bundle them together under one predictable monthly partnership.
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
