"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CtaBanner from "@/components/CtaBanner";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import {
  Share2,
  Sparkles,
  ArrowUpRight,
  ArrowRight,
  Clock,
  DollarSign,
  TrendingDown,
  HelpCircle,
  CheckCircle2,
  Upload,
  Calendar,
  Layers,
  Send,
  Sliders,
  ShieldCheck,
  Zap,
  ExternalLink,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Video,
} from "lucide-react";

export default function SocialPage() {
  const { openContactModal } = useContactModal();

  const problemPoints = [
    {
      icon: Clock,
      title: "You're doing it yourself",
      description:
        "You spend hours every week writing captions, fixing posts, and trying to stay consistent — time that should go directly into running and growing your business.",
      badge: "Time Drain",
    },
    {
      icon: DollarSign,
      title: "You hired someone",
      description:
        "Hiring an in-house social media manager is expensive ($65k+/year) — and still requires your time to manage, review, and guide. It quickly becomes a second job.",
      badge: "High Overhead",
    },
    {
      icon: TrendingDown,
      title: "Inconsistent posting hurts results",
      description:
        "Social media algorithms reward consistency. Most businesses post enthusiastically for a few weeks, then stop — and reach, engagement, and growth slow down.",
      badge: "Algorithm Penalty",
    },
    {
      icon: HelpCircle,
      title: "You're not sure what's working",
      description:
        "You're posting blindly without clear analytics or insight into what content is actually driving profile visits, brand authority, and customer inquiries.",
      badge: "Guesswork",
    },
  ];

  const fourSteps = [
    {
      step: "01",
      title: "Choose Your Plan",
      description:
        "Pick the subscription tier that fits your business goals. Everything is 100% month-to-month with zero long-term contracts.",
    },
    {
      step: "02",
      title: "Get Access",
      description:
        "You get instant access to your private client portal — a magic login link lands in your inbox within minutes after signup.",
    },
    {
      step: "03",
      title: "Set Up Your Brand",
      description:
        "Tell us about your business, visual style, and target audience. It only takes a few minutes, and you only do it once.",
    },
    {
      step: "04",
      title: "We Handle the Rest",
      description:
        "We create, schedule, and publish your content automatically. You stay active and consistent without lifting a finger.",
    },
  ];

  const platforms = [
    { name: "Instagram", desc: "Reels, Carousels & Grid Posts", icon: Instagram },
    { name: "Facebook", desc: "Page Updates & Community Reach", icon: Facebook },
    { name: "LinkedIn", desc: "B2B Thought Leadership & Articles", icon: Linkedin },
    { name: "TikTok", desc: "Short-Form High-Reach Video", icon: Video },
    { name: "X (Twitter)", desc: "Real-time Industry Authority", icon: Twitter },
    { name: "Google Business", desc: "Local Maps & Search Authority", icon: Share2 },
  ];

  const comparison = [
    {
      option: "In-House Employee",
      cost: "$5,500+ / mo",
      details: "Full-time salary + benefits + taxes + software tools ($70k-$85k/yr total). Requires daily management and hiring overhead.",
      prosCons: "❌ High financial risk · ❌ Requires onboarding & training",
    },
    {
      option: "Freelancer / VA",
      cost: "$1,500 – $3,000 / mo",
      details: "Inconsistent quality, ghosting risks, and you still need to write the strategy, review drafts, and manage deliverables.",
      prosCons: "⚠️ Variable reliability · ⚠️ Manual oversight needed",
    },
    {
      option: "Traditional Agency",
      cost: "$4,000 – $8,000 / mo",
      details: "6-to-12 month locked contracts, slow turnaround times, junior account managers, and heavy setup fees.",
      prosCons: "❌ Long contract lock-ins · ❌ Heavy retainers",
    },
    {
      option: "ReLaunch Social Orbit",
      cost: "Flat Monthly Subscription",
      details: "Done-for-you content creation, scheduling, human review, AI acceleration, client portal, and zero lock-in contracts. Live in 48 hours.",
      prosCons: "✅ 100% Done-for-You · ✅ Live in 48 Hours · ✅ Cancel Anytime",
      isHighlight: true,
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Social Hero: Atmospheric Dark Theme with Left/Center Responsive Editorial Layout */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-[#0A0D14] text-white overflow-hidden select-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-[#C0622A]/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0D14]/50 to-[#0A0D14] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            
            {/* Left Column: Headline & Subheading */}
            <div className="lg:col-span-7 flex flex-col justify-center text-center sm:text-left items-center sm:items-start">
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.12] text-[#F39C6B] text-[11px] sm:text-xs font-mono uppercase tracking-widest font-semibold mb-6 w-fit shadow-sm"
              >
                <Share2 className="w-3.5 h-3.5 text-[#C0622A]" />
                <span>ReLaunch Social · Phoenix, AZ · Always In Orbit</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-black text-4xl sm:text-6xl xl:text-7xl tracking-tight leading-[1.04] text-white"
              >
                Your Social Media, <br />
                <span className="bg-gradient-to-r from-white via-[#FAF9F6] to-[#E88C52] bg-clip-text text-transparent">
                  Always In Orbit.
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-2xl"
              >
                We create the content, schedule it, and post it for you — every single month. You run your business. We handle the rest. No contracts. No hiring. Just consistent social media, done for you.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-wrap justify-center sm:justify-start gap-4"
              >
                <Link
                  href="/pricing"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#C0622A] hover:bg-[#a84f1d] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(192,98,42,0.35)] cursor-pointer active:scale-98"
                >
                  <span>See Plans &amp; Pricing</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </Link>

                <a
                  href="https://relaunch-social-orbit.base44.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/[0.12] transition-all"
                >
                  <span>Client Portal</span>
                  <ExternalLink className="w-4 h-4 text-slate-400" />
                </a>
              </motion.div>
            </div>

            {/* Right Column: 48-Hour Guarantee Card */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="p-8 sm:p-10 rounded-3xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl shadow-2xl space-y-6"
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2.5">
                    <Zap className="w-5 h-5 text-[#C0622A]" />
                    <span className="text-xs font-mono uppercase tracking-widest text-[#E88C52] font-bold">
                      Liftoff Guarantee
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold uppercase">
                    Live in 48 Hours
                  </span>
                </div>

                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">1. Zero Hiring Hassle</div>
                    <div className="font-heading font-bold text-white text-base mt-0.5">No Interviews or Benefits</div>
                    <div className="text-xs text-slate-400 mt-1">Get an entire creative studio for less than a single part-time hire.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">2. Complete Transparency</div>
                    <div className="font-heading font-bold text-white text-base mt-0.5">Private Client Dashboard</div>
                    <div className="text-xs text-slate-400 mt-1">Review upcoming calendars, track monthly metrics, and upload assets in seconds.</div>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[11px] font-mono text-slate-400 uppercase">3. Uncompromising Freedom</div>
                    <div className="font-heading font-bold text-white text-base mt-0.5">Month-to-Month Flexibility</div>
                    <div className="text-xs text-slate-400 mt-1">Upgrade, downgrade, or cancel anytime with zero cancellation fees.</div>
                  </div>
                </div>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Pure White Body: The Problem Section */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C0622A]/10 text-[#C0622A] text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>The Reality</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              Social media takes more time — or money — than it should.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Most business owners feel stuck. You either spend hours posting yourself, or pay someone to do it — and still aren't sure it's working.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problemPoints.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <MotionWrapper
                  key={item.title}
                  direction="up"
                  delay={idx * 0.08}
                  distance={30}
                  className="h-full"
                >
                  <div className="p-8 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-[#C0622A]/40 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between h-full">
                    <div>
                      <div className="flex items-center justify-between mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200/80 flex items-center justify-center text-[#C0622A] shadow-xs">
                          <IconComp className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#C0622A] bg-[#C0622A]/10 px-2.5 py-1 rounded-full">
                          {item.badge}
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-lg text-[#090D16] mb-2">
                        {item.title}
                      </h3>
                      <p className="text-xs text-slate-600 leading-relaxed font-normal">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </MotionWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Pure White Body: Simple 4-Step Liftoff Process */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C0622A]/10 text-[#C0622A] text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <Zap className="w-3.5 h-3.5" />
              <span>Fast &amp; Simple</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              Simple. Just four steps.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              From signup to your first post live in as little as 48 hours. No complicated setup. No long calls.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fourSteps.map((step, idx) => (
              <MotionWrapper
                key={step.step}
                direction="up"
                delay={idx * 0.08}
                distance={30}
                className="h-full"
              >
                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#C0622A]/40 hover:shadow-lg transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="font-mono font-black text-2xl text-[#C0622A] mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-heading font-bold text-lg text-[#090D16] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Pure White Body: Two Working Models */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C0622A]/10 text-[#C0622A] text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <Sliders className="w-3.5 h-3.5" />
              <span>Two Flexible Tracks</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              Choose How You Want to Collaborate.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Whether you already have media assets or need us to create every graphic and caption from scratch, we have a seamless track for you.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Track 1: You Provide Content */}
            <MotionWrapper direction="up" delay={0.1} distance={35} className="h-full">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-[#C0622A]/40 transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/60 text-slate-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
                    Track A: You Provide Media
                  </div>
                  <h3 className="font-heading font-black text-2xl text-[#090D16] mb-2">
                    You provide the content. We post it.
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Already have photos, customer reels, or project snapshots? Send them over and we handle formatting, high-impact captions, hashtag targeting, scheduling, and multi-channel publishing.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/70">
                      <div className="w-8 h-8 rounded-xl bg-[#C0622A]/10 text-[#C0622A] flex items-center justify-center font-mono font-bold text-xs shrink-0">1</div>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#090D16]">Send your content</div>
                        <div className="text-xs text-slate-600 mt-0.5">Upload to your client portal or email raw media to designs@relaunch.us</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/70">
                      <div className="w-8 h-8 rounded-xl bg-[#C0622A]/10 text-[#C0622A] flex items-center justify-center font-mono font-bold text-xs shrink-0">2</div>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#090D16]">We prepare everything</div>
                        <div className="text-xs text-slate-600 mt-0.5">We format aspect ratios, write persuasive copy, and optimize for peak reach.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/70">
                      <div className="w-8 h-8 rounded-xl bg-[#C0622A]/10 text-[#C0622A] flex items-center justify-center font-mono font-bold text-xs shrink-0">3</div>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#090D16]">It goes live</div>
                        <div className="text-xs text-slate-600 mt-0.5">Your content is published automatically on schedule across all connected networks.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionWrapper>

            {/* Track 2: We Create Everything */}
            <MotionWrapper direction="up" delay={0.2} distance={35} className="h-full">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-[#C0622A]/40 transition-all flex flex-col justify-between h-full">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C0622A]/10 text-[#C0622A] text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
                    Track B: 100% Full-Service
                  </div>
                  <h3 className="font-heading font-black text-2xl text-[#090D16] mb-2">
                    We create everything for you.
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed mb-6">
                    Don't have content? No problem. We handle ideation, graphics, editorial themes, and copywriting. We combine AI-assisted research with senior designer polish to keep you always active.
                  </p>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/70">
                      <div className="w-8 h-8 rounded-xl bg-[#C0622A]/10 text-[#C0622A] flex items-center justify-center font-mono font-bold text-xs shrink-0">1</div>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#090D16]">Tell us about your business</div>
                        <div className="text-xs text-slate-600 mt-0.5">Share your brand tone, target customer, and value propositions one time during onboarding.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/70">
                      <div className="w-8 h-8 rounded-xl bg-[#C0622A]/10 text-[#C0622A] flex items-center justify-center font-mono font-bold text-xs shrink-0">2</div>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#090D16]">We build your monthly calendar</div>
                        <div className="text-xs text-slate-600 mt-0.5">We craft custom branded graphics, educational carousels, and engaging hooks.</div>
                      </div>
                    </div>

                    <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-white border border-slate-200/70">
                      <div className="w-8 h-8 rounded-xl bg-[#C0622A]/10 text-[#C0622A] flex items-center justify-center font-mono font-bold text-xs shrink-0">3</div>
                      <div>
                        <div className="font-heading font-bold text-sm text-[#090D16]">You approve, we publish</div>
                        <div className="text-xs text-slate-600 mt-0.5">Preview and approve posts with one click before anything goes live to the public.</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* 5. Pure White Body: Supported Platforms Grid */}
      <section className="py-20 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={25} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2">
              MULTI-PLATFORM REACH
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-[#090D16] tracking-tight">
              Supported Platforms &amp; Formats
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {platforms.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <MotionWrapper
                  key={p.name}
                  direction="up"
                  delay={idx * 0.05}
                  distance={20}
                >
                  <div className="p-6 rounded-2xl bg-white border border-slate-200/80 text-center hover:border-[#C0622A]/40 hover:shadow-md transition-all flex flex-col items-center justify-center h-full">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-[#C0622A] mb-3">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="font-heading font-bold text-sm text-[#090D16] mb-1">{p.name}</div>
                    <div className="text-[11px] text-slate-500 leading-tight">{p.desc}</div>
                  </div>
                </MotionWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* 6. Pure White Body: Comparison Table */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={30} className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C0622A]/10 text-[#C0622A] text-xs font-mono font-bold tracking-widest uppercase mb-3">
              <DollarSign className="w-3.5 h-3.5" />
              <span>True Cost Analysis</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              What does social media actually cost you?
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Every option has a price tag. Some are obvious — some are hidden in the hours you spend managing it. Here's the full picture.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {comparison.map((comp, idx) => (
              <MotionWrapper
                key={comp.option}
                direction="up"
                delay={idx * 0.08}
                distance={30}
                className="h-full"
              >
                <div
                  className={`p-7 rounded-3xl border transition-all flex flex-col justify-between h-full ${
                    comp.isHighlight
                      ? "bg-[#0A0D14] text-white border-[#C0622A] shadow-2xl scale-102"
                      : "bg-slate-50/70 text-[#090D16] border-slate-200/80"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className={`text-xs font-mono font-bold uppercase tracking-wider ${
                          comp.isHighlight ? "text-[#E88C52]" : "text-slate-500"
                        }`}
                      >
                        {comp.option}
                      </span>
                      {comp.isHighlight && (
                        <span className="px-2 py-0.5 rounded-full bg-[#C0622A]/20 text-[#F39C6B] text-[10px] font-mono font-bold uppercase">
                          Recommended
                        </span>
                      )}
                    </div>

                    <div
                      className={`font-heading font-black text-2xl mb-3 ${
                        comp.isHighlight ? "text-white" : "text-[#090D16]"
                      }`}
                    >
                      {comp.cost}
                    </div>

                    <p
                      className={`text-xs leading-relaxed mb-6 font-normal ${
                        comp.isHighlight ? "text-slate-300" : "text-slate-600"
                      }`}
                    >
                      {comp.details}
                    </p>
                  </div>

                  <div
                    className={`pt-4 border-t text-xs font-medium ${
                      comp.isHighlight
                        ? "border-white/10 text-emerald-400"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {comp.prosCons}
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>

          <MotionWrapper direction="up" delay={0.3} distance={20} className="text-center mt-12">
            <Link
              href="/pricing"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#C0622A] hover:bg-[#a84f1d] text-white text-xs sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_25px_rgba(192,98,42,0.35)] cursor-pointer active:scale-98"
            >
              <span>Explore Subscription Plans &amp; Pricing</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </Link>
          </MotionWrapper>
        </div>
      </section>

      {/* 7. Bottom Call to Action */}
      <CtaBanner />

      {/* 8. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
