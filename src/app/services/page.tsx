"use client";

import React from "react";
import Link from "next/link";
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
  Palette,
  Code2,
  TrendingUp,
  Bot,
  Video,
  MailCheck,
  ShieldCheck,
  PackageCheck,
  Building2,
} from "lucide-react";

const servicePillars = [
  {
    id: "marketing-advertising",
    title: "Marketing & Advertising",
    tagline: "Paid search, multi-channel ads, local SEO, and conversion tracking.",
    description:
      "Target high-intent searchers and scale inbound leads with managed paid campaigns and local SEO dominance.",
    deliverables: [
      "Paid search (Google Ads / PPC)",
      "Social advertising (Meta, TikTok, LinkedIn)",
      "Local SEO & Google Business Profile",
      "Analytics & conversion tracking",
      "Media buying & strategic retargeting",
    ],
    impact: "Verified 3.8x Avg ROAS",
    image: "/images/service-marketing.jpg",
    icon: TrendingUp,
  },
  {
    id: "brand-design",
    title: "Brand & Design",
    tagline: "Visual authority, brand identity, and cohesive digital systems.",
    description:
      "Command instant authority with memorable branding, typography systems, and high-converting interface design.",
    deliverables: [
      "Logo & full brand identity systems",
      "Brand guidelines & tone of voice",
      "Print collateral & packaging design",
      "UX/UI digital design systems",
      "Pitch decks & high-ticket sales collateral",
    ],
    impact: "+300% Brand Authority & Recall",
    image: "/images/service-brand.jpg",
    icon: Palette,
  },
  {
    id: "ai-services",
    title: "AI Services",
    tagline: "Generative search visibility, custom workflows, and autonomous bots.",
    description:
      "Deploy 24/7 intelligent agents, automate repetitive workflows, and rank in generative AI search engines.",
    deliverables: [
      "AEO / GEO — AI search visibility",
      "AI automation & intelligent workflows",
      "Chatbots & conversational voice agents",
      "AI content engines at scale",
      "Custom AI applications & operations dashboards",
    ],
    impact: "24/7 Autonomous Operations",
    image: "/images/service-ai.jpg",
    icon: Bot,
  },
  {
    id: "web-app-development",
    title: "Web & App Development",
    tagline: "Sub-second Next.js websites, mobile apps, and client portals.",
    description:
      "Engineered for sub-second speeds and high conversions with custom Next.js code — zero WordPress bloat.",
    deliverables: [
      "Custom websites (no WordPress bloat)",
      "High-converting e-commerce storefronts",
      "Mobile apps & cross-platform web software",
      "Custom client portals & secure CRMs",
      "Managed infrastructure hosting & maintenance",
    ],
    impact: "<0.8s Load Times · 100% Next.js",
    image: "/images/service-web.jpg",
    icon: Code2,
  },
  {
    id: "video-content",
    title: "Video & Content",
    tagline: "High-retention reels, brand films, SEO blogs, and copywriting.",
    description:
      "Capture audience attention across social feeds with studio-grade video reels, brand films, and strategic content.",
    deliverables: [
      "Short-form reels, TikToks & shorts",
      "Cinematic explainer & brand story videos",
      "Authoritative blog & SEO content strategy",
      "Direct-response marketing copywriting",
      "Monthly social media content calendars",
    ],
    impact: "High-Retention Organic Reach",
    image: "/images/service-video.jpg",
    icon: Video,
  },
  {
    id: "email-sms-marketing",
    title: "Email & SMS Marketing",
    tagline: "Lifecycle automation, subscriber growth, and reactivation campaigns.",
    description:
      "Automate revenue-producing lifecycle flows, list growth, and retention campaigns on autopilot.",
    deliverables: [
      "Campaign design & custom responsive builds",
      "Automated welcome & abandoned cart flows",
      "Audience list growth & high-converting capture",
      "Dormant customer reactivation campaigns",
      "Continuous reporting & revenue optimization",
    ],
    impact: "Predictable Retention Revenue",
    image: "/images/service-email.jpg",
    icon: MailCheck,
  },
];

export default function ServicesPage() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Cinematic Services Video Hero */}
      <PageVideoHero
        theme="purple"
        kicker="Full-Scope Capabilities · Est. 2004"
        titleRegular="Everything Under One Roof."
        titleHighlight="Our Services."
        description="Pick the services that fit your business, bundle them into one subscription, and save. Pause or cancel anytime. No contracts."
        videoSrc="/services2.mp4"
        secondaryVideoSrc="/relaunch-hero2.mp4"
        posterSrc="/hero_frames/frame_000.webp"
        exploreText="Explore Services"
        exploreTargetId="services-overview"
        bookStrategyText="Book a Strategy Call"
        bookStrategyIntent="strategy-session"
        scrollTargetId="services-overview"
      />

      {/* 2. Choose What You Need - Centered Header */}
      <section id="services-overview" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none">
        <MotionWrapper direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2 sm:whitespace-nowrap">
            CHOOSE WHAT YOU NEED · BUNDLE &amp; SAVE
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.06] mb-3">
            <span className="block whitespace-normal sm:whitespace-nowrap">A closer look at</span>
            <span className="block text-[#7F48ED] whitespace-normal sm:whitespace-nowrap">every service.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
            Mix and match services to fit your growth goals. Bundle to save with zero long-term commitments.
          </p>
        </MotionWrapper>

        {/* Service Breakdown Cards */}
        <div className="flex flex-col gap-12 sm:gap-16">
          {servicePillars.map((pillar, idx) => {
            const isReversed = idx % 2 === 1;
            const IconComp = pillar.icon;

            return (
              <MotionWrapper key={pillar.id} direction="up" delay={idx * 0.08} distance={35}>
                <div
                  id={pillar.id}
                  className={`grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-center py-10 sm:py-14 border-b border-slate-100 last:border-b-0 ${
                    isReversed ? "lg:flex-row-reverse" : ""
                  }`}
                >
                  {/* Content Column */}
                  <div className={`lg:col-span-7 flex flex-col justify-between ${isReversed ? "lg:order-2" : "lg:order-1"}`}>
                    <div>
                      {/* Service Title & Icon */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border bg-purple-50 border-purple-200/60 text-[#7F48ED]">
                          <IconComp className="w-4 h-4 sm:w-5 sm:h-5" />
                        </div>
                        <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] leading-snug">
                          {pillar.title}
                        </h3>
                      </div>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                        {pillar.description}
                      </p>

                      {/* Clean Deliverables List */}
                      <div className="mb-6 pt-4 border-t border-slate-100">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                          {pillar.deliverables.map((item) => (
                            <div key={item} className="flex items-start gap-2">
                              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#7F48ED]" />
                              <span className="text-xs text-slate-700 leading-snug">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action Strip */}
                    <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap bg-purple-50 text-[#7F48ED] border-purple-200/60">
                        <ShieldCheck className="w-4 h-4 text-[#7F48ED]" />
                        <span>{pillar.impact}</span>
                      </div>

                      <div className="flex items-center gap-3">
                        <Link
                          href="/pricing"
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-600 hover:text-[#090D16] transition-colors whitespace-nowrap"
                        >
                          <PackageCheck className="w-3.5 h-3.5" />
                          <span>Bundle Pricing</span>
                        </Link>
                        <button
                          type="button"
                          onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: pillar.title })}
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer group whitespace-nowrap text-[#7F48ED] hover:text-[#6D28D9]"
                        >
                          <span>Book a Strategy Call</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Visual Column */}
                  <div className={`lg:col-span-5 ${isReversed ? "lg:order-1" : "lg:order-2"}`}>
                    <InteractiveImage
                      src={pillar.image}
                      alt={pillar.title}
                      aspectRatio="aspect-[4/3]"
                      className="border-slate-200 shadow-md rounded-2xl overflow-hidden hover:border-[#7F48ED]/30"
                    />
                  </div>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </section>

      {/* 2.5 Enterprise & Custom Software Pathway Banner */}
      <section className="py-10 sm:py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none">
        <MotionWrapper direction="up" distance={25}>
          <div className="relative overflow-hidden rounded-3xl bg-[#07090E] text-white p-8 sm:p-12 border border-white/[0.12] shadow-2xl">
            <div className="absolute top-0 right-0 w-[500px] h-[350px] bg-[#FF6700]/15 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[350px] bg-[#7F48ED]/15 rounded-full blur-[140px] pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-8 space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-[#FF6700] text-xs font-mono uppercase tracking-widest font-semibold shadow-xs">
                  <Building2 className="w-3.5 h-3.5 text-[#FF6700]" />
                  <span>Enterprise &amp; Civic Architecture Practice</span>
                </div>

                <h3 className="font-heading font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
                  Evaluating Custom Software or Enterprise-Scale Systems?
                </h3>

                <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                  For complex web platforms, municipal entity frameworks, or regulated FinTech systems requiring fixed-scope SOWs, SOC2 compliance, and dedicated senior engineering pods.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-300 font-medium">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FF6700]" />
                    <span>Fixed-Scope Milestone SOWs</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FF6700]" />
                    <span>Section 508 / ADA Compliant</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#FF6700]" />
                    <span>100% Client IP Ownership</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col justify-center items-stretch lg:items-end gap-3.5">
                <Link
                  href="/enterprise"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(255,103,0,0.35)] whitespace-nowrap active:scale-98"
                >
                  <span>Explore Enterprise Practice</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-white" />
                </Link>

                <button
                  type="button"
                  onClick={() =>
                    openContactModal({
                      intent: "enterprise-inquiry",
                      serviceInterest: "Enterprise & Custom Software",
                      notes: "Inquiring about enterprise software development / RFP review from Services page.",
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/[0.08] hover:bg-white/[0.15] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-all backdrop-blur-md whitespace-nowrap active:scale-98"
                >
                  <span>Request Scope Review</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-[#FF6700]" />
                </button>
              </div>
            </div>
          </div>
        </MotionWrapper>
      </section>

      {/* 3. Bottom Strategic CTA */}
      <CtaBanner />

      {/* 4. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
