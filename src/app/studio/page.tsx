"use client";

import React from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
import HeroScrollIndicator from "@/components/HeroScrollIndicator";
import { useContactModal } from "@/context/ContactModalContext";
import {
  ArrowUpRight,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Video,
  Clock,
  DollarSign,
  Layers,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";

const STUDIO_CTA = "Start with ReLaunch Studio";
const ACCENT = "#7F48ED";

export default function StudioPage() {
  const { openContactModal } = useContactModal();

  const handleScrollToHow = () => {
    const el = document.getElementById("how-it-works");
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

  const problemCards = [
    {
      title: "Ads wear out fast",
      desc: "Even winning creative fatigues after 2–3 weeks. When audiences stop clicking, customer acquisition costs spike.",
      icon: Clock,
    },
    {
      title: "Video is expensive",
      desc: "Traditional video shoots cost thousands, take weeks to coordinate, and leave you with just one or two angles.",
      icon: DollarSign,
    },
    {
      title: "Nobody has time to test",
      desc: "Continuous creative testing wins on Meta and TikTok, but running a business leaves zero hours for weekly video production.",
      icon: Layers,
    },
  ];

  const deliverables = [
    "New AI-powered video ad batches delivered every single week",
    "Tailored 9:16 and 4:5 vertical formats ready for Meta, TikTok & YouTube Shorts",
    "Hook testing variations (multiple intros to find the lowest CPA)",
    "Scripting, captions, subtitles, voiceover and motion design included",
    "Performance iteration: next week's batch builds on what converted this week",
    "Run directly from your own ad accounts — you retain full asset ownership",
  ];

  const workflowSteps = [
    {
      step: "01",
      title: "Onboarding & Brand Kit",
      desc: "Tell us about your offer, target customer, and brand style in one fast onboarding session.",
    },
    {
      step: "02",
      title: "Weekly Ad Batch",
      desc: "Every week, fresh video ad concepts arrive in your portal, ready for review.",
    },
    {
      step: "03",
      title: "Approve and Run",
      desc: "Give feedback or approve in one sitting. Launch them directly to your Meta and TikTok campaigns.",
    },
    {
      step: "04",
      title: "Learn and Repeat",
      desc: "We analyze performance data to sharpen hooks, angles, and CTAs for the next weekly drop.",
    },
  ];

  const faqs = [
    {
      q: "Do I have to appear on camera?",
      a: "No. We can create completely AI-generated and motion-designed video ads. If you do have your own b-roll, product clips, or footage, we can seamlessly blend it in.",
    },
    {
      q: "How does AI disclosure work with Meta and TikTok?",
      a: "We strictly follow Meta and TikTok AI transparency guidelines and labeling requirements so your accounts and campaigns remain 100% compliant and safe.",
    },
    {
      q: "Is ad spend included in the subscription?",
      a: "No. ReLaunch Studio covers creative production. Ad spend is billed directly to your own Meta, TikTok, or Google ad accounts.",
    },
    {
      q: "Can you manage the ad campaigns too?",
      a: "Yes. ReLaunch Studio can pair with our managed advertising service under the 'Get More Customers' outcome group.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero Section (Full Screen) */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center pt-32 sm:pt-36 pb-20 sm:pb-24 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(127,72,237,0.18),transparent_75%)]" />
          <div
            className="absolute top-1/4 right-1/4 w-[500px] h-[400px] rounded-full blur-[140px] pointer-events-none"
            style={{ backgroundColor: `${ACCENT}20` }}
          />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-5xl mx-auto w-full my-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column (7 cols) */}
            <div className="lg:col-span-7 text-center lg:text-left">
              <span
                className="inline-block text-xs font-mono uppercase tracking-widest font-bold mb-3"
                style={{ color: ACCENT }}
              >
                RELAUNCH STUDIO
              </span>
              <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4">
                Fresh video ads. <span style={{ color: ACCENT }}>Every week.</span>
              </h1>
              <p className="text-slate-300 text-base sm:text-lg max-w-xl leading-relaxed mb-8">
                New AI video ads for Meta and TikTok every week, improved from what performed. Never let ad fatigue kill your sales again.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5">
                <button
                  type="button"
                  onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: "ReLaunch Studio" })}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-lg active:scale-98 cursor-pointer"
                  style={{ backgroundColor: ACCENT }}
                >
                  <span>{STUDIO_CTA}</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </button>

                <button
                  type="button"
                  onClick={handleScrollToHow}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
                >
                  <span>See how it works ↓</span>
                </button>
              </div>
            </div>

            {/* Right Column: Weekly Ad Batch Card Preview (5 cols) */}
            <div className="lg:col-span-5">
              <div className="p-7 rounded-3xl bg-white/[0.04] border border-white/[0.12] backdrop-blur-xl shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/[0.08] mb-4">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Weekly Batch Preview
                  </span>
                  <span
                    className="text-[10px] font-mono px-2 py-0.5 rounded-full font-bold"
                    style={{ backgroundColor: `${ACCENT}30`, color: ACCENT }}
                  >
                    4 New Variations
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Video className="w-4 h-4" style={{ color: ACCENT }} />
                      <span className="text-white font-medium">Hook 1: Direct Problem</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">9:16 vertical</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Video className="w-4 h-4" style={{ color: ACCENT }} />
                      <span className="text-white font-medium">Hook 2: Social Proof / Review</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">9:16 vertical</span>
                  </div>
                  <div className="p-3 rounded-xl bg-white/[0.05] border border-white/[0.06] flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2.5">
                      <Video className="w-4 h-4" style={{ color: ACCENT }} />
                      <span className="text-white font-medium">Hook 3: Before vs. After</span>
                    </div>
                    <span className="text-slate-400 font-mono text-[11px]">4:5 feed</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px] text-slate-400">
                  <span>Batch arrives every Monday</span>
                  <span className="text-[#7F48ED] font-medium">One-click approval</span>
                </div>
              </div>
            </div>
          </div>
        </MotionWrapper>

        {/* Scroll Indicator */}
        <HeroScrollIndicator targetId="studio-problem" accentColor={ACCENT} />
      </section>

      {/* 2. Problem Section */}
      <section id="studio-problem" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-14">
            <span
              className="text-xs font-mono uppercase tracking-widest font-bold block mb-2"
              style={{ color: ACCENT }}
            >
              CREATIVE FATIGUE
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Your ads aren&apos;t broken. They&apos;re just tired.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {problemCards.map((p, idx) => (
              <MotionWrapper key={p.title} direction="up" delay={idx * 0.1} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-slate-50 border border-slate-200/90 shadow-xs">
                  <div
                    className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                    style={{ backgroundColor: `${ACCENT}15` }}
                  >
                    <p.icon className="w-5 h-5" style={{ color: ACCENT }} />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#090D16] mb-2">
                    {p.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 3. What You Get */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center mb-12">
            <span
              className="text-xs font-mono uppercase tracking-widest font-bold block mb-2"
              style={{ color: ACCENT }}
            >
              WEEKLY DELIVERABLES
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              What you get every week.
            </h2>
          </MotionWrapper>

          <div className="space-y-3.5 mb-10">
            {deliverables.map((item, idx) => (
              <MotionWrapper key={item} direction="up" delay={idx * 0.05} distance={15}>
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs flex items-center gap-3.5">
                  <CheckCircle2 className="w-5 h-5 shrink-0" style={{ color: ACCENT }} />
                  <span className="text-xs sm:text-sm text-slate-700 font-medium">{item}</span>
                </div>
              </MotionWrapper>
            ))}
          </div>

          <MotionWrapper direction="up" distance={20} className="text-center">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              style={{ backgroundColor: ACCENT }}
            >
              <span>View Pricing &amp; Bundles →</span>
            </Link>
          </MotionWrapper>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-14">
            <span
              className="text-xs font-mono uppercase tracking-widest font-bold block mb-2"
              style={{ color: ACCENT }}
            >
              PRODUCTION PROCESS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Four steps. Continuous results.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {workflowSteps.map((st, idx) => (
              <MotionWrapper key={st.step} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full p-6 rounded-3xl bg-slate-50 border border-slate-200 shadow-xs">
                  <span className="text-xs font-mono font-bold text-slate-400 block mb-2">
                    STEP {st.step}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#090D16] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed font-normal">
                    {st.desc}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Trust Strip - Light background as requested */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-slate-50 text-[#090D16] border-y border-slate-200">
        <MotionWrapper direction="up" distance={15} className="max-w-5xl mx-auto flex flex-wrap items-center justify-center gap-6 sm:gap-12 text-xs font-mono text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#7F48ED]" />
            <span>Compliant with Meta &amp; TikTok AI Rules</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7F48ED]" />
            <span>Runs from your own ad accounts</span>
          </div>
          <span className="text-slate-300">•</span>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-[#7F48ED]" />
            <span>Zero fake reviews or synthetic fraud</span>
          </div>
        </MotionWrapper>
      </section>

      {/* 6. FAQ Section */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center mb-12">
            <span
              className="text-xs font-mono uppercase tracking-widest font-bold block mb-2"
              style={{ color: ACCENT }}
            >
              FAQ
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Questions about ReLaunch Studio
            </h2>
          </MotionWrapper>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <MotionWrapper key={idx} direction="up" delay={idx * 0.05} distance={15}>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
                  <h3 className="font-heading font-bold text-base text-[#090D16] mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Final Call */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 text-center border-t border-slate-200">
        <MotionWrapper direction="up" distance={20} className="max-w-2xl mx-auto">
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-4">
            Stop losing leads to <span style={{ color: ACCENT }}>ad fatigue.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Get your first batch of fresh video ads running this week, or talk with us about full-funnel management.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/pricing"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md"
              style={{ backgroundColor: ACCENT }}
            >
              <span>View Plans &amp; Pricing</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>

            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: "ReLaunch Studio" })}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#090D16] font-heading font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Calendar className="w-4 h-4 text-[#7F48ED]" />
              <span>Book a Strategy Call</span>
            </button>
          </div>
        </MotionWrapper>
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
