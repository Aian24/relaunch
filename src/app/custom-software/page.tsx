"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Code2,
  Smartphone,
  Workflow,
  Cpu,
  RefreshCw,
  Server,
  Lock,
  Users,
  FileCheck,
  Globe2,
} from "lucide-react";

export default function CustomSoftwarePage() {
  const { openContactModal } = useContactModal();

  const handleScrollToProjects = () => {
    const el = document.getElementById("projects");
    if (el) {
      const headerOffset = 90;
      const elementPosition = el.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;
      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    }
  };

  const capabilities = [
    {
      title: "Web apps and portals",
      desc: "Customer portals, internal dashboards, booking and records systems, with secure logins and permissions.",
      icon: Code2,
    },
    {
      title: "Mobile apps",
      desc: "iOS and Android apps, published to the App Store and Google Play.",
      icon: Smartphone,
    },
    {
      title: "Integrations",
      desc: "Connect your CRM, payments, scheduling and accounting so data moves on its own.",
      icon: Workflow,
    },
    {
      title: "AI and automation",
      desc: "Assistants that answer customers, read documents and route work.",
      icon: Cpu,
    },
    {
      title: "Modernization",
      desc: "Replace a slow or outdated system with a clean, modern one, with no downtime during the switch.",
      icon: RefreshCw,
    },
    {
      title: "Hosting and support",
      desc: "We host, monitor, back up and maintain what we build.",
      icon: Server,
    },
  ];

  const flagshipProjects = [
    {
      client: "City of Jacksonville",
      title: "Property appraisal system",
      metric: "Delivered 1 month early · +65% engagement",
      story:
        "Replaced a system from 1998 with modern software that connects to other county departments. Delivered one month early, with user engagement up 65%.",
      image: "/showcase/jacksonville_real_1.jpg",
    },
    {
      client: "Swing Perfect",
      title: "Mobile app & motion analysis",
      metric: "Built in 2 months · Sold to Golf Galaxy",
      story:
        "A first-of-its-kind golf app for iPhone and Android, built in 2 months. The business was later sold to Golf Galaxy.",
      image: "/showcase/swing_perfect_real_1.png",
    },
    {
      client: "Aspiration Bank",
      title: "Website & conversion funnels",
      metric: "+200% traffic YoY",
      story:
        "Designed and built the site for a new online bank. Traffic grew 200% year over year.",
      image: "/showcase/aspiration_real_1.png",
    },
  ];

  const workModels = [
    {
      option: "Fixed-scope project",
      bestFor: "A defined app, portal or migration",
      howItWorks: "Written scope, milestone dates, code handed over at launch",
    },
    {
      option: "Dedicated team",
      bestFor: "Ongoing builds",
      howItWorks: "Senior developers on your project, weekly demos and progress reports",
    },
    {
      option: "Monthly support",
      bestFor: "Improvements and upkeep",
      howItWorks: "Month-to-month, fast turnaround on priority fixes",
    },
  ];

  const commitments = [
    {
      title: "You own it",
      desc: "Code, repositories and credentials are yours from day one.",
      icon: Lock,
    },
    {
      title: "Senior people",
      desc: "Experienced developers, no junior hand-offs.",
      icon: Users,
    },
    {
      title: "Clear scope",
      desc: "A written plan with milestones before work starts.",
      icon: FileCheck,
    },
    {
      title: "Remote-ready",
      desc: "We work with teams across the U.S., Canada, the UK and Australia.",
      icon: Globe2,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero */}
      <section className="relative w-full pt-36 sm:pt-44 pb-14 sm:pb-20 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,103,0,0.18),transparent_75%)]" />
          <div className="absolute top-1/4 right-1/4 w-[450px] h-[350px] bg-[#FF6700]/20 rounded-full blur-[140px]" />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold mb-3">
            CUSTOM SOFTWARE
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4">
            Software built around <span className="text-[#FF6700]">how your business works.</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Web apps, client portals, mobile apps and integrations, delivered on a fixed plan with dates you can hold us to. You own every line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: "Custom Software" })}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer active:scale-98"
            >
              <span>Book a Strategy Call</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>

            <button
              type="button"
              onClick={handleScrollToProjects}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>See projects ↓</span>
            </button>
          </div>
        </MotionWrapper>
      </section>

      {/* 2. The Problem */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <MotionWrapper direction="up" distance={20} className="max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block mb-2 text-center sm:text-left">
            THE BOTTLENECK
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight mb-4 text-center sm:text-left">
            When off-the-shelf stops fitting.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Your team copies data between systems, works around tools that don&apos;t talk to each other, and pays for software that does 80% of the job. Custom software closes that last 20%, where the hours and the mistakes pile up.
          </p>
        </MotionWrapper>
      </section>

      {/* 3. What We Build */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              CAPABILITIES
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              What we build.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {capabilities.map((c, idx) => (
              <MotionWrapper key={c.title} direction="up" delay={idx * 0.06} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-4">
                      <c.icon className="w-5 h-5 text-[#FF6700]" />
                    </div>
                    <h3 className="font-heading font-bold text-lg text-[#090D16] mb-2">
                      {c.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                      {c.desc}
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Projects Showcase */}
      <section id="projects" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              PROVEN RESULTS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Real projects delivered.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {flagshipProjects.map((proj, idx) => (
              <MotionWrapper key={proj.client} direction="up" delay={idx * 0.1} distance={20}>
                <div className="h-full rounded-3xl border border-slate-200 overflow-hidden shadow-xs bg-white flex flex-col justify-between">
                  <div>
                    <div className="relative aspect-[16/10] bg-slate-900">
                      <Image
                        src={proj.image}
                        alt={proj.client}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <span className="text-[10px] font-mono uppercase text-[#FF6700] font-bold block">
                          {proj.client}
                        </span>
                        <h3 className="font-heading font-bold text-base text-white">
                          {proj.title}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="inline-block px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF6700] text-[11px] font-mono font-bold mb-3">
                        {proj.metric}
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                        {proj.story}
                      </p>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0">
                    <Link
                      href="/work"
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6700] hover:underline"
                    >
                      <span>Read case details →</span>
                    </Link>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Ways to Work Together */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              ENGAGEMENT MODELS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Three ways to work together.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {workModels.map((m, idx) => (
              <MotionWrapper key={m.option} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs">
                  <span className="text-xs font-mono uppercase tracking-wider text-[#FF6700] font-bold block mb-2">
                    {m.option}
                  </span>
                  <div className="text-xs text-slate-500 font-mono mb-3">
                    Best for: <strong className="text-slate-800">{m.bestFor}</strong>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {m.howItWorks}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Commitments */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              OUR STANDARDS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              What you can count on.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {commitments.map((c, idx) => (
              <MotionWrapper key={c.title} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full p-6 rounded-2xl bg-slate-50 border border-slate-200">
                  <c.icon className="w-5 h-5 text-[#FF6700] mb-3" />
                  <h3 className="font-heading font-bold text-base text-[#090D16] mb-1">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {c.desc}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final Call - White Background as requested */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16] text-center border-t border-slate-200">
        <MotionWrapper direction="up" distance={20} className="max-w-2xl mx-auto">
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-4">
            Tell us what you need built.
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Book a strategy call. We&apos;ll talk through the problem, the options and a realistic timeline, then send a written scope.
          </p>
          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: "Custom Software" })}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(255,103,0,0.35)] transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Book a Strategy Call</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </button>
        </MotionWrapper>
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
