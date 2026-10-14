"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
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

      {/* 1. Hero Section */}
      <section className="relative w-full pt-36 sm:pt-44 pb-14 sm:pb-20 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(127,72,237,0.18),transparent_75%)]" />
          <div className="absolute top-1/4 right-1/4 w-[450px] h-[350px] bg-[#7F48ED]/20 rounded-full blur-[140px]" />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold mb-3">
            ABOUT RELAUNCH
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4">
            Bad marketing doesn&apos;t look broken. <span className="text-[#7F48ED]">It just quietly costs you sales.</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            A website that doesn&apos;t convert. Ads with no plan behind them. Software you paid for that never got fully set up. We exist to find those gaps and close them.
          </p>

          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#7F48ED] hover:bg-[#6C34DE] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(127,72,237,0.35)] cursor-pointer active:scale-98"
          >
            <span>Book a Strategy Call</span>
            <ArrowUpRight className="w-4 h-4 text-white" />
          </button>
        </MotionWrapper>
      </section>

      {/* 2. Empathy Story Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
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
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-4xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
              TIMELINE
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              How we got here.
            </h2>
          </MotionWrapper>

          <div className="space-y-6">
            {timelineSteps.map((step, idx) => (
              <MotionWrapper key={step.year} direction="up" delay={idx * 0.08} distance={20}>
                <div className="p-6 sm:p-7 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="px-3.5 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-[#7F48ED] font-heading font-black text-base shrink-0">
                    {step.year}
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-lg text-[#090D16] mb-1">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-2 font-normal">
                      {step.desc}
                    </p>
                    <p className="text-xs text-slate-500 font-mono">
                      <span className="text-[#7F48ED] font-bold">Why it matters:</span> {step.whyItMatters}
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>

          {/* Proof Strip under timeline */}
          <MotionWrapper direction="up" distance={15}>
            <div className="mt-12 p-6 rounded-3xl bg-slate-50 border border-slate-200 text-[#090D16] flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
              <div>
                <span className="text-xs font-mono uppercase text-slate-500 font-bold block mb-0.5">Defensible Track Record</span>
                <span className="font-heading font-black text-lg text-[#090D16]">
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
