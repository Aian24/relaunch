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
  CheckCircle2,
  Zap,
  ExternalLink,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Video,
  Upload,
  Layers,
  ShieldCheck,
  Clock,
  Send,
} from "lucide-react";

export default function SocialPage() {
  const { openContactModal } = useContactModal();

  const platforms = [
    { name: "Instagram", desc: "Reels & Carousels", icon: Instagram },
    { name: "Facebook", desc: "Page & Group Reach", icon: Facebook },
    { name: "LinkedIn", desc: "B2B Authority", icon: Linkedin },
    { name: "TikTok", desc: "Viral Video Reach", icon: Video },
    { name: "X (Twitter)", desc: "Industry Voice", icon: Twitter },
    { name: "Google Maps", desc: "Local Search Trust", icon: Share2 },
  ];

  const liftoffSteps = [
    {
      step: "01",
      title: "Set Your Brand Voice",
      desc: "Share your business goals, target audience, and brand guidelines in a simple 5-minute onboarding.",
    },
    {
      step: "02",
      title: "We Build Your Monthly Calendar",
      desc: "Our team crafts custom branded graphics, high-converting hooks, and strategic captions.",
    },
    {
      step: "03",
      title: "Automated Multi-Channel Publishing",
      desc: "Content is scheduled and posted consistently across all your platforms with zero effort required.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Cinematic Social Hero */}
      <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-[#0A0D14] text-white overflow-hidden select-none">
        <div className="absolute top-0 right-1/4 w-[700px] h-[500px] bg-[#FF6700]/15 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0A0D14]/50 to-[#0A0D14] pointer-events-none" />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Left Hero Column */}
            <div className="lg:col-span-7 flex flex-col justify-center text-center sm:text-left items-center sm:items-start">
              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/[0.08] border border-white/[0.12] text-[#FF6700] text-xs font-mono uppercase tracking-widest font-semibold mb-6 shadow-xs whitespace-nowrap"
              >
                <span className="w-2 h-2 rounded-full bg-[#FF6700] shrink-0" />
                <span>ReLaunch Social · Done-for-You Content</span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
                className="font-heading font-black text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[80px] tracking-tight leading-[1.06] text-white"
              >
                <span className="block whitespace-normal sm:whitespace-nowrap">Your Social Media,</span>
                <span className="block text-[#FF6700] whitespace-normal sm:whitespace-nowrap">Always In Orbit.</span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="mt-6 text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed font-normal max-w-2xl"
              >
                We create, format, and publish high-quality content across all your channels every month. No overhead, no long-term contracts.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="mt-8 flex flex-row items-center justify-center sm:justify-start gap-2.5 sm:gap-4 w-full sm:w-auto max-w-md sm:max-w-none"
              >
                <Link
                  href="/pricing"
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 bg-[#FF6700] hover:bg-[#E55C00] text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider rounded-xl transition-all shadow-[0_0_20px_rgba(255,103,0,0.35)] cursor-pointer active:scale-98 whitespace-nowrap"
                >
                  <span>View Pricing &amp; Plans</span>
                  <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white" />
                </Link>

                <button
                  type="button"
                  onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: "Social Media Orbit" })}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 sm:gap-2 px-3.5 sm:px-6 py-3 sm:py-3.5 bg-white/[0.06] hover:bg-white/[0.12] text-slate-200 hover:text-white text-[11px] sm:text-sm font-bold uppercase tracking-wider rounded-xl border border-white/[0.12] transition-all cursor-pointer whitespace-nowrap"
                >
                  <span>Book Strategy Call</span>
                  <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                </button>
              </motion.div>
            </div>

            {/* Right Hero Highlights Box */}
            <div className="lg:col-span-5">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="p-7 sm:p-8 rounded-3xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-[#FF6700]" />
                    <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold">
                      The Social Advantage
                    </span>
                  </div>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-mono font-semibold uppercase">
                    Live in 48 Hours
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">1. Zero Hiring Friction</div>
                    <div className="font-heading font-bold text-white text-sm mt-0.5">Full Studio for Less Than 1 Hire</div>
                    <div className="text-xs text-slate-400 mt-0.5">Senior designers, copywriters, and video editors on demand.</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">2. 100% Asset Autonomy</div>
                    <div className="font-heading font-bold text-white text-sm mt-0.5">You Own Every Graphic &amp; Post</div>
                    <div className="text-xs text-slate-400 mt-0.5">All source creative, designs, and content belong completely to you.</div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
                    <div className="text-[10px] font-mono text-slate-400 uppercase">3. Month-to-Month Freedom</div>
                    <div className="font-heading font-bold text-white text-sm mt-0.5">Zero Lock-In Contracts</div>
                    <div className="text-xs text-slate-400 mt-0.5">Pause, upgrade, or cancel anytime with simple 1-click management.</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Two Collaboration Tracks (Streamlined & Clean) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={30} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              TWO FLEXIBLE WAYS TO WORK
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              Choose How You Want to Collaborate.
            </h2>
            <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
              Provide your own photos and videos, or let our studio create everything from scratch.
            </p>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Track A */}
            <MotionWrapper direction="up" delay={0.1} distance={30} className="h-full">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-[#FF6700]/40 transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/70 text-slate-800 text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
                    Track A · Media Provided
                  </div>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] mb-2">
                    You Provide Photos &amp; Video. <br />
                    We Format, Write &amp; Publish.
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                    Upload your photos and videos to the portal. We write captions, design graphics, and schedule across your channels.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">Persuasive, high-converting copywriting &amp; targeted hashtags</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">Multi-ratio formatting for Reels, Carousels, Stories &amp; Feeds</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">Automated scheduling at optimal audience engagement windows</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200/80 mt-8">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6700] hover:text-[#CC5200] transition-colors"
                  >
                    <span>View Track A Plans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </MotionWrapper>

            {/* Track B */}
            <MotionWrapper direction="up" delay={0.2} distance={30} className="h-full">
              <div className="p-8 sm:p-10 rounded-3xl bg-slate-50/80 border border-slate-200/80 hover:border-[#FF6700]/40 transition-all flex flex-col justify-between h-full group">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF6700]/10 text-[#FF6700] text-[11px] font-mono font-bold uppercase tracking-wider mb-4">
                    Track B · 100% Full-Service
                  </div>
                  <h3 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] mb-2">
                    Zero Content Needed. <br />
                    We Create Everything From Scratch.
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-6 font-normal">
                    100% hands-off. We design custom branded graphics, carousels, and video reels from scratch tailored to your business.
                  </p>

                  <div className="space-y-3 pt-2">
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">Custom branded visual graphics, typography &amp; carousels</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">Industry research, educational hooks &amp; thought-leadership posts</span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-[#FF6700] shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-700">1-click calendar approval workflow before anything goes live</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8 border-t border-slate-200/80 mt-8">
                  <Link
                    href="/pricing"
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#FF6700] hover:text-[#CC5200] transition-colors"
                  >
                    <span>View Track B Plans</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* 3. Simple 3-Step Process */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={30} className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              SEAMLESS LIFTOFF
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              Live in Three Simple Steps.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {liftoffSteps.map((step, idx) => (
              <MotionWrapper
                key={step.step}
                direction="up"
                delay={idx * 0.1}
                distance={30}
                className="h-full"
              >
                <div className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-[#FF6700]/40 hover:shadow-lg transition-all flex flex-col justify-between h-full">
                  <div>
                    <div className="font-mono font-black text-3xl text-[#FF6700] mb-4">
                      {step.step}
                    </div>
                    <h3 className="font-heading font-bold text-xl text-[#090D16] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Supported Platforms Strip */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block mb-1">
              SUPPORTED NETWORKS
            </span>
            <h3 className="font-heading font-bold text-xl text-[#090D16]">
              Publishing Everywhere Your Customers Pay Attention
            </h3>
          </MotionWrapper>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {platforms.map((p, idx) => {
              const IconComp = p.icon;
              return (
                <MotionWrapper
                  key={p.name}
                  direction="up"
                  delay={idx * 0.05}
                  distance={15}
                >
                  <div className="p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 text-center hover:border-[#FF6700]/40 transition-all flex flex-col items-center justify-center">
                    <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#FF6700] mb-2.5 shadow-xs">
                      <IconComp className="w-5 h-5" />
                    </div>
                    <div className="font-heading font-bold text-sm text-[#090D16]">{p.name}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{p.desc}</div>
                  </div>
                </MotionWrapper>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action */}
      <CtaBanner />

      {/* 6. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
