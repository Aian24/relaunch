"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
import HeroScrollIndicator from "@/components/HeroScrollIndicator";
import { useContactModal } from "@/context/ContactModalContext";
import { companyCreds } from "@/data/offerings";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Globe2,
  Lock,
  Users,
} from "lucide-react";

export default function AboutPage() {
  const { openContactModal } = useContactModal();

  const workingPrinciples = [
    {
      title: "Senior team only",
      desc: "You work directly with Bobby and experienced builders. No hand-offs to junior staff.",
      icon: Users,
    },
    {
      title: "You own everything",
      desc: "Your website, code, designs, ads and accounts are yours from day one.",
      icon: Lock,
    },
    {
      title: "Month-to-month",
      desc: "No long contracts. We keep clients by getting results they can see in their numbers.",
      icon: CheckCircle2,
    },
    {
      title: "Fully remote",
      desc: "Based in Phoenix, AZ, working with small businesses across the U.S., Canada, the UK and Australia.",
      icon: Globe2,
    },
  ];

  const timelineSteps = [
    {
      year: "2008",
      title: "The start",
      desc: "Web design for local businesses, before we even had a name.",
      whyItMatters: "we started by solving real owners' problems.",
    },
    {
      year: "2012",
      title: "Launch A Cloud",
      desc: "Added mobile apps and marketing.",
      whyItMatters: "we can build custom software, not just templates.",
    },
    {
      year: "2015",
      title: "Confessions of a Local Marketer",
      desc: "Learned what actually makes a small-business website convert.",
      whyItMatters: "you get what works, month-to-month.",
    },
    {
      year: "2021",
      title: "ReLaunch",
      desc: "Renamed for the work we do most: relaunching marketing that isn't working.",
      whyItMatters: "our focus is entirely on fixing what's losing you sales.",
    },
    {
      year: "Today",
      title: "AI",
      desc: "Getting clients recommended by AI tools and producing ads with AI.",
      whyItMatters: "you show up where your customers are searching now.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero Section (Full Screen) */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center pt-32 sm:pt-36 pb-20 sm:pb-24 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(127,72,237,0.18),transparent_75%)]" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-[#7F48ED]/20 rounded-full blur-[140px]" />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center my-auto">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold mb-4 px-3 py-1 rounded-full bg-[#7F48ED]/10 border border-[#7F48ED]/20 backdrop-blur-xs">
            ABOUT RELAUNCH
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5">
            Bad marketing doesn&apos;t look broken. <span className="text-[#7F48ED]">It just quietly costs you sales.</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10">
            A website that doesn&apos;t convert. Ads with no plan behind them. Software you paid for that never got fully set up. We exist to find those gaps and close them.
          </p>

          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-[#7F48ED] hover:bg-[#6C34DE] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider transition-all shadow-[0_0_30px_rgba(127,72,237,0.4)] cursor-pointer active:scale-98"
          >
            <span>Book a Strategy Call</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </button>
        </MotionWrapper>

        {/* Scroll Indicator */}
        <HeroScrollIndicator targetId="about-story" accentColor="#7F48ED" />
      </section>

      {/* 2. Empathy Story Section */}
      <section id="about-story" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <MotionWrapper direction="up" distance={20} className="max-w-3xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block mb-3 text-center sm:text-left">
            THE REAL PROBLEM
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight mb-6 text-center sm:text-left">
            The story we hear on almost every first call.
          </h2>
          <div className="space-y-4 text-slate-600 text-base leading-relaxed">
            <p>
              A business owner invests in the right tools and the right people, hoping it will finally bring real growth. Then running the business takes over. The setup never gets finished, and months later they&apos;re still paying for software and services that never started working.
            </p>
            <p>
              That&apos;s not a failure on their part. It&apos;s what happens when marketing gets sold in disconnected pieces instead of one plan. ReLaunch was built to be that one plan.
            </p>
          </div>
        </MotionWrapper>
      </section>

      {/* 3. How We Work */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
              HOW WE WORK
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Four commitments to every client.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {workingPrinciples.map((item, idx) => (
              <MotionWrapper key={item.title} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full p-6 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col justify-between">
                  <div>
                    <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4">
                      <item.icon className="w-5 h-5 text-[#7F48ED]" />
                    </div>
                    <h3 className="font-heading font-bold text-base text-[#090D16] mb-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed font-normal">
                      {item.desc}
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Meet the Founder */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <MotionWrapper direction="up" distance={20} className="max-w-5xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            <div className="lg:col-span-5 flex flex-col items-center">
              <div className="relative w-full max-w-sm aspect-square rounded-3xl overflow-hidden shadow-md border-2 border-slate-100">
                <Image
                  src={companyCreds.founder.photo}
                  alt={companyCreds.founder.name}
                  fill
                  className="object-cover object-top"
                />
              </div>
              <div className="mt-4 text-center">
                <span className="font-heading font-black text-xl text-[#090D16] block">
                  {companyCreds.founder.name}
                </span>
                <span className="text-xs text-slate-500 font-medium">Founder</span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block mb-2">
                FOUNDER NOTE
              </span>
              <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight mb-4">
                Marketing is only worth paying for if it sells.
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
                I started building websites for small businesses in 2008 because owners kept asking for help. Since then I&apos;ve built apps, run campaigns and fixed a lot of marketing that wasn&apos;t working. The lesson has stayed the same: marketing is only worth paying for if it sells.
              </p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
                <strong>Direct contact:</strong> Work directly with Bobby and senior builders. No account managers in between.
              </div>
            </div>
          </div>
        </MotionWrapper>
      </section>

      {/* 5. How We Got Here (Timeline) */}
      <section className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center mb-7">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-1">
              TIMELINE
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] tracking-tight">
              How we got here.
            </h2>
          </MotionWrapper>

          {/* Timeline Spine & Nodes */}
          <div className="relative">
            {/* Desktop Center Vertical Spine */}
            <div className="hidden md:block absolute top-5 bottom-5 left-1/2 -translate-x-1/2 w-0.5 bg-gradient-to-b from-[#7F48ED]/30 via-[#7F48ED] to-[#7F48ED]/30" />

            {/* Mobile Left Vertical Spine */}
            <div className="md:hidden absolute top-5 bottom-5 left-4 w-0.5 bg-gradient-to-b from-[#7F48ED]/30 via-[#7F48ED] to-[#7F48ED]/30" />

            {/* Timeline Steps */}
            <div className="space-y-2.5 sm:space-y-3">
              {timelineSteps.map((step, idx) => {
                const isEven = idx % 2 === 0;
                return (
                  <MotionWrapper key={step.year} direction="up" delay={idx * 0.04} distance={10}>
                    <div className="relative group">
                      {/* Desktop Center Node */}
                      <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 items-center justify-center pointer-events-none">
                        {step.year === "Today" ? (
                          <div className="relative flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-4 w-4 rounded-full bg-[#7F48ED]/40" />
                            <div className="w-3 h-3 rounded-full bg-[#7F48ED] border border-white shadow-xs" />
                          </div>
                        ) : (
                          <div className="w-2.5 h-2.5 rounded-full bg-white border-2 border-[#7F48ED] shadow-xs group-hover:bg-[#7F48ED] transition-colors" />
                        )}
                      </div>

                      {/* Mobile Left Node */}
                      <div className="md:hidden absolute left-4 -translate-x-1/2 top-1/2 -translate-y-1/2 z-20 flex items-center justify-center pointer-events-none">
                        {step.year === "Today" ? (
                          <div className="relative flex items-center justify-center">
                            <span className="animate-ping absolute inline-flex h-3.5 w-3.5 rounded-full bg-[#7F48ED]/40" />
                            <div className="w-2.5 h-2.5 rounded-full bg-[#7F48ED] border border-white shadow-xs" />
                          </div>
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-white border-2 border-[#7F48ED] shadow-xs" />
                        )}
                      </div>

                      {/* Alternating 2-Column Grid on Desktop */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-0 items-center">
                        {isEven ? (
                          /* Even index: Card on Left */
                          <>
                            <div className="relative pl-8 md:pl-0 md:pr-7">
                              {/* Connector line to center on desktop */}
                              <div className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-7 h-px bg-purple-200 group-hover:bg-[#7F48ED] transition-colors" />

                              <div className="px-4 py-3 sm:px-5 sm:py-3 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#7F48ED]/40 transition-all duration-200">
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3 mb-1">
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                                        step.year === "Today"
                                          ? "bg-[#7F48ED] text-white shadow-xs"
                                          : "bg-purple-50 text-[#7F48ED] border border-purple-200"
                                      }`}
                                    >
                                      {step.year === "Today" && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                      )}
                                      {step.year}
                                    </span>
                                    <h3 className="font-heading font-bold text-xs sm:text-sm text-[#090D16]">
                                      {step.title}
                                    </h3>
                                  </div>
                                  <p className="text-xs text-slate-600 font-normal sm:text-right leading-tight">
                                    {step.desc}
                                  </p>
                                </div>

                                <div className="text-[11px] text-slate-500 leading-tight pt-1 border-t border-slate-100 flex items-center gap-1.5">
                                  <span className="text-[#7F48ED] font-bold font-mono uppercase text-[10px] shrink-0">
                                    Why it matters:
                                  </span>
                                  <span className="truncate sm:whitespace-normal">{step.whyItMatters}</span>
                                </div>
                              </div>
                            </div>
                            <div className="hidden md:block" />
                          </>
                        ) : (
                          /* Odd index: Card on Right */
                          <>
                            <div className="hidden md:block" />
                            <div className="relative pl-8 md:pl-7 md:pr-0">
                              {/* Connector line to center on desktop */}
                              <div className="hidden md:block absolute left-0 top-1/2 -translate-y-1/2 w-7 h-px bg-purple-200 group-hover:bg-[#7F48ED] transition-colors" />

                              <div className="px-4 py-3 sm:px-5 sm:py-3 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#7F48ED]/40 transition-all duration-200">
                                <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 sm:gap-3 mb-1">
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span
                                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                                        step.year === "Today"
                                          ? "bg-[#7F48ED] text-white shadow-xs"
                                          : "bg-purple-50 text-[#7F48ED] border border-purple-200"
                                      }`}
                                    >
                                      {step.year === "Today" && (
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                      )}
                                      {step.year}
                                    </span>
                                    <h3 className="font-heading font-bold text-xs sm:text-sm text-[#090D16]">
                                      {step.title}
                                    </h3>
                                  </div>
                                  <p className="text-xs text-slate-600 font-normal sm:text-right leading-tight">
                                    {step.desc}
                                  </p>
                                </div>

                                <div className="text-[11px] text-slate-500 leading-tight pt-1 border-t border-slate-100 flex items-center gap-1.5">
                                  <span className="text-[#7F48ED] font-bold font-mono uppercase text-[10px] shrink-0">
                                    Why it matters:
                                  </span>
                                  <span className="truncate sm:whitespace-normal">{step.whyItMatters}</span>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </MotionWrapper>
                );
              })}
            </div>
          </div>

          {/* Proof Strip under timeline */}
          <MotionWrapper direction="up" distance={15}>
            <div className="mt-6 p-3.5 sm:p-4 rounded-xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
              <div>
                <span className="text-[11px] font-mono uppercase text-slate-500 font-bold block mb-0.5">Defensible Track Record</span>
                <span className="font-heading font-bold text-xs sm:text-sm text-[#090D16]">
                  1,500+ projects · 480+ campaigns · clients in 4 countries
                </span>
              </div>
              <Link
                href="/work"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#7F48ED] hover:underline shrink-0"
              >
                <span>See our work →</span>
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* 6. Final Call */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-center border-t border-slate-100">
        <MotionWrapper direction="up" distance={20} className="max-w-2xl mx-auto">
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-4">
            Let&apos;s find what&apos;s <span className="text-[#7F48ED]">costing you sales.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Book a free 30-minute call with Bobby. You&apos;ll leave with a clear next step, whether you hire us or not.
          </p>
          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#7F48ED] hover:bg-[#6C34DE] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(127,72,237,0.25)] transition-all cursor-pointer"
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
