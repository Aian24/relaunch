"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CtaBanner from "@/components/CtaBanner";
import PageVideoHero from "@/components/PageVideoHero";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import {
  Code2,
  Layers,
  Database,
  Cpu,
  Server,
  ShieldCheck,
  CheckCircle2,
  ArrowUpRight,
  Lock,
  Users,
  Calendar,
  Zap,
} from "lucide-react";

const capabilities = [
  {
    icon: Code2,
    title: "Custom Web Applications",
    deliverables: [
      "Custom portals & dashboards",
      "High-speed Next.js web platforms",
      "Secure user logins & permissions",
    ],
  },
  {
    icon: Layers,
    title: "Mobile Applications",
    deliverables: [
      "iOS & Android cross-platform apps",
      "App Store & Google Play setup",
      "Real-time notifications & offline sync",
    ],
  },
  {
    icon: Database,
    title: "System Integrations & APIs",
    deliverables: [
      "CRM & payment processor integration",
      "Automated data sync between tools",
      "Custom API connections",
    ],
  },
  {
    icon: Cpu,
    title: "Enterprise AI & Automation",
    deliverables: [
      "24/7 intelligent customer assistants",
      "Automated document processing",
      "Private, secure business data handling",
    ],
  },
  {
    icon: Server,
    title: "Cloud Hosting & 99.9% Uptime",
    deliverables: [
      "99.9% guaranteed uptime SLA",
      "Automated daily backups",
      "Fast global loading speeds",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Legacy Code Modernization",
    deliverables: [
      "Replace slow WordPress or legacy systems",
      "Clean, modern database upgrades",
      "Zero-downtime transition plan",
    ],
  },
];

const caseStudies = [
  {
    client: "City of Jacksonville",
    badge: "Civic Portal & Records",
    title: "Duval County Property Records System",
    description:
      "Engineered an accessible public records portal serving over 450,000 citizens with fast property lookups and 99.98% uptime.",
    image: "/showcase/jacksonville_real_1.jpg",
    metric1: "450,000+",
    label1: "Citizens Reached",
    metric2: "1 Month",
    label2: "Ahead of Schedule",
  },
  {
    client: "Aspiration Bank",
    badge: "FinTech & Banking",
    title: "Secure Customer Onboarding Platform",
    description:
      "Built high-converting digital onboarding funnels that streamlined account creation while passing strict financial security audits.",
    image: "/showcase/aspiration_real_1.png",
    metric1: "+44%",
    label1: "Signup Lift",
    metric2: "100%",
    label2: "Bank Security Passed",
  },
  {
    client: "Swing Perfect",
    badge: "Sports Technology",
    title: "Mobile Motion Analysis App",
    description:
      "Built a proprietary mobile app that calculates athletic movement in real time. Successfully acquired by Golf Galaxy.",
    image: "/showcase/swing_perfect_real_1.png",
    metric1: "60 Days",
    label1: "Build to Launch",
    metric2: "Acquired",
    label2: "by Golf Galaxy",
  },
];

const engagementOptions = [
  {
    badge: "Most Popular",
    title: "Fixed-Scope Project",
    bestFor: "Best for defined apps, portals, or website builds.",
    deliverables: [
      "Guaranteed delivery date & milestones",
      "Fixed pricing with zero scope creep",
      "100% source code handover on launch",
    ],
  },
  {
    badge: "Dedicated Pod",
    title: "Dedicated Engineering Team",
    bestFor: "Best for ongoing software builds & rapid scale.",
    deliverables: [
      "Senior developers embedded in your sprints",
      "Weekly demos and progress reports",
      "Direct Slack/Teams technical access",
    ],
  },
  {
    badge: "No Contracts",
    title: "Flexible Monthly Subscription",
    bestFor: "Best for continuous improvements & support.",
    deliverables: [
      "Month-to-month agile flexibility",
      "Pause or cancel anytime with one click",
      "Fast turnaround on priority tasks",
    ],
  },
];

export default function EnterprisePage() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Cinematic Video Hero matching /services, /ai & /work */}
      <PageVideoHero
        theme="orange"
        kicker="Enterprise Software · Est. 2004"
        titleRegular="Custom Software &"
        titleHighlight="Enterprise Systems."
        description="High-performance web platforms, mobile apps, and custom software engineered for scale. No bloated retainers. 100% code ownership."
        videoSrc="/enterprise.mp4"
        posterSrc="/hero_frames/frame_000.webp"
        exploreText="Explore Capabilities"
        exploreTargetId="enterprise-capabilities"
        bookStrategyText="Book a Strategy Call"
        bookStrategyIntent="enterprise-inquiry"
        scrollTargetId="enterprise-capabilities"
      />

      {/* 2. Core Capabilities (Clean White Background) */}
      <section
        id="enterprise-capabilities"
        className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none scroll-mt-20"
      >
        <MotionWrapper direction="up" distance={25} className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
            CORE SERVICES
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-tight">
            Software Built for How You Work.
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Simple, reliable, and tailored to your business goals. Zero confusing tech jargon.
          </p>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {capabilities.map((item, idx) => {
            const Icon = item.icon;
            return (
              <MotionWrapper
                key={item.title}
                direction="up"
                delay={idx * 0.06}
                distance={25}
                className="h-full"
              >
                <div className="p-7 sm:p-8 rounded-3xl bg-slate-50/70 border border-slate-200/80 hover:border-[#FF6700]/40 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between h-full group">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center mb-5 text-[#FF6700] shadow-xs group-hover:bg-[#FF6700] group-hover:text-white transition-colors duration-300">
                      <Icon className="w-6 h-6" />
                    </div>

                    <h3 className="font-heading font-bold text-xl text-[#090D16] mb-5 group-hover:text-[#FF6700] transition-colors">
                      {item.title}
                    </h3>

                    <div className="space-y-2.5">
                      {item.deliverables.map((d) => (
                        <div key={d} className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0" />
                          <span>{d}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            );
          })}
        </div>
      </section>

      {/* 3. Real Work & Results (Light Slate Background, Clean Cards) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/60 select-none">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={25} className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              PROVEN RESULTS
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-tight">
              Real Projects. Measurable Impact.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              From civic portals serving hundreds of thousands of residents to fast-growing digital software.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {caseStudies.map((study, idx) => (
              <MotionWrapper
                key={study.client}
                direction="up"
                delay={idx * 0.1}
                distance={25}
                className="h-full"
              >
                <div className="rounded-3xl bg-white border border-slate-200/80 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full group hover:border-[#FF6700]/40">
                  <div>
                    <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                      <Image
                        src={study.image}
                        alt={study.title}
                        fill
                        className="object-cover group-hover:scale-103 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[#FF6700] text-[10px] font-mono font-bold uppercase tracking-wider shadow-xs">
                          {study.badge}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 sm:p-7">
                      <div className="text-xs font-mono text-slate-400 uppercase font-semibold mb-1">
                        {study.client}
                      </div>
                      <h3 className="font-heading font-bold text-lg text-[#090D16] mb-3 leading-snug">
                        {study.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {study.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 sm:p-7 pt-0">
                    <div className="grid grid-cols-2 gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-100 mb-5">
                      <div>
                        <div className="font-heading font-black text-lg text-[#090D16]">
                          {study.metric1}
                        </div>
                        <div className="text-[10px] font-mono uppercase text-slate-400">
                          {study.label1}
                        </div>
                      </div>
                      <div>
                        <div className="font-heading font-black text-lg text-[#FF6700]">
                          {study.metric2}
                        </div>
                        <div className="text-[10px] font-mono uppercase text-slate-400">
                          {study.label2}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Ready for similar growth?</span>
                      <button
                        type="button"
                        onClick={() =>
                          openContactModal({
                            intent: "enterprise-inquiry",
                            serviceInterest: "Enterprise & Custom Software",
                            notes: `Inquiry inspired by ${study.client} case study.`,
                          })
                        }
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6700] hover:text-[#E55C00] transition-colors cursor-pointer group/btn"
                      >
                        <span>Inquire Now</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Simple Ways to Partner */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full select-none">
        <MotionWrapper direction="up" distance={25} className="text-center max-w-3xl mx-auto mb-14 sm:mb-16">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
            ENGAGEMENT MODELS
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-tight">
            Simple Ways to Work Together.
          </h2>
          <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
            Choose the model that fits your scope and timeline. No confusing retainers or surprise costs.
          </p>
        </MotionWrapper>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {engagementOptions.map((opt, idx) => (
            <MotionWrapper
              key={opt.title}
              direction="up"
              delay={idx * 0.1}
              distance={25}
              className="h-full"
            >
              <div className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#FF6700]/40 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full">
                <div>
                  <span className="inline-flex px-3 py-1 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-orange-50 text-[#FF6700] border border-orange-200/60 mb-5">
                    {opt.badge}
                  </span>

                  <h3 className="font-heading font-black text-xl text-[#090D16] mb-1.5">
                    {opt.title}
                  </h3>

                  <div className="text-xs text-slate-500 font-medium mb-6">
                    {opt.bestFor}
                  </div>

                  <div className="space-y-2.5 mb-8">
                    {opt.deliverables.map((item) => (
                      <div key={item} className="flex items-center gap-2.5 text-xs sm:text-[13px] text-slate-700 font-medium">
                        <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    openContactModal({
                      intent: "enterprise-inquiry",
                      serviceInterest: "Enterprise & Custom Software",
                      notes: `Inquiring about ${opt.title}.`,
                    })
                  }
                  className="w-full py-3 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:translate-y-0.5"
                >
                  <span>Get Started</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </MotionWrapper>
          ))}
        </div>
      </section>

      {/* 5. Four Pillars of Confidence (Clean Light Slate) */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50/70 select-none">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <ShieldCheck className="w-6 h-6 text-[#FF6700] mb-3 mx-auto sm:mx-0" />
              <div className="font-heading font-bold text-sm text-[#090D16] mb-1">
                100% IP Ownership
              </div>
              <p className="text-xs text-slate-500">
                You own all code, repositories, and credentials from day one.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <Users className="w-6 h-6 text-[#FF6700] mb-3 mx-auto sm:mx-0" />
              <div className="font-heading font-bold text-sm text-[#090D16] mb-1">
                Senior Engineers
              </div>
              <p className="text-xs text-slate-500">
                Direct collaboration with senior architects. Zero junior handoffs.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <Zap className="w-6 h-6 text-[#FF6700] mb-3 mx-auto sm:mx-0" />
              <div className="font-heading font-bold text-sm text-[#090D16] mb-1">
                Rapid Velocity
              </div>
              <p className="text-xs text-slate-500">
                We ship in days and weeks, not quarters. No red tape or delays.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              <Calendar className="w-6 h-6 text-[#FF6700] mb-3 mx-auto sm:mx-0" />
              <div className="font-heading font-bold text-sm text-[#090D16] mb-1">
                22 Years in Business
              </div>
              <p className="text-xs text-slate-500">
                Founded in Phoenix in 2004 with 1,500+ successful digital projects.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Bottom CTA */}
      <CtaBanner />

      {/* 7. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
