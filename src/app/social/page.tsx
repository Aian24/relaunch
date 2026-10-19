"use client";

import React, { useState } from "react";
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
  Camera,
  Layers,
  Palette,
  Clock,
  ShieldCheck,
} from "lucide-react";

const PORTAL_CHECKOUT_URL = "https://relaunch-social-orbit.base44.app";

export default function SocialPage() {
  const { openContactModal } = useContactModal();
  const [activeTab, setActiveTab] = useState<"create-everything" | "send-photos">(
    "create-everything"
  );

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

  const steps = [
    {
      step: "01",
      title: "Sign up and get portal access",
      desc: "Pick a plan and you're in your client portal in minutes.",
    },
    {
      step: "02",
      title: "Set up your brand",
      desc: "Tell us about your business, pick your style and connect your social accounts.",
    },
    {
      step: "03",
      title: "Approve the month",
      desc: "We send the whole month's posts. Review and approve in one sitting.",
    },
    {
      step: "04",
      title: "We publish",
      desc: "Posts go out on schedule, and you get a monthly report in plain numbers.",
    },
  ];

  const faqs = [
    {
      q: "Do I own the posts?",
      a: "Yes. Every graphic and post is yours from day one.",
    },
    {
      q: "Can I cancel?",
      a: "Yes. Month-to-month, cancel anytime with zero cancellation penalties.",
    },
    {
      q: "What if I don't like a post?",
      a: "Ask for changes before you approve. Nothing goes live without your OK.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero Section with Cinematic Background Video (Full Screen) */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center pt-32 sm:pt-36 pb-20 sm:pb-24 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            src="/relaunch-hero2.mp4"
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 0.75;
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-100"
          />
          {/* Crisp balanced overlay: reduced black so video is luminous & HD */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/30 via-transparent to-[#07090E]/65 z-1" />
          {/* Targeted Center Radial Scrim: lightened to eliminate heavy black fog */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(7,9,14,0.40)_0%,rgba(7,9,14,0.15)_60%,transparent_100%)] z-1 pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-[#FF6700]/20 rounded-full blur-[140px] z-1" />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center my-auto flex flex-col items-center">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold mb-4 px-4 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-[#FF6700]/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all">
            RELAUNCH SOCIAL · DONE-FOR-YOU SOCIAL MEDIA
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            Your social media, handled. <span className="text-[#FF6700] drop-shadow-[0_4px_24px_rgba(255,103,0,0.45)]">Every week.</span>
          </h1>
          <p className="text-white/95 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed mb-10 drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-medium">
            We create your posts, you approve them once a month, and we publish them to Instagram, Facebook, LinkedIn, TikTok and Google Business. About 30 minutes a month of your time.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={PORTAL_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,103,0,0.35)] active:scale-98"
            >
              <span>Choose a plan</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </a>

            <button
              type="button"
              onClick={handleScrollToHow}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.18] border border-white/20 hover:border-white/45 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all duration-300 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:shadow-[0_8px_32px_rgba(255,255,255,0.1)] cursor-pointer"
            >
              <span>See how it works ↓</span>
            </button>
          </div>
        </MotionWrapper>

        {/* Scroll Indicator */}
        <HeroScrollIndicator targetId="how-it-works" accentColor="#FF6700" />
      </section>

      {/* 2. The Problem */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <MotionWrapper direction="up" distance={20} className="max-w-3xl mx-auto text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block mb-2">
            THE PROBLEM
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight mb-4">
            Quiet social pages make a busy business look closed.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Customers check your social media before they call. When the last post is from months ago, they wonder if you&apos;re still open. Posting every week takes time you don&apos;t have.
          </p>
        </MotionWrapper>
      </section>

      {/* 3. Two Ways to Work */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              TWO WAYS TO WORK
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Pick the workflow that fits your team.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <MotionWrapper direction="up" delay={0} distance={20}>
              <div className="h-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-4">
                    <Palette className="w-5 h-5 text-[#FF6700]" />
                  </div>
                  <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">
                    We create everything
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    No content needed from you. We design branded graphics, carousels and short videos from scratch.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">Starting at</span>
                  <span className="font-heading font-black text-xl text-[#090D16]">From $597/mo</span>
                </div>
              </div>
            </MotionWrapper>

            <MotionWrapper direction="up" delay={0.1} distance={20}>
              <div className="h-full p-8 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-10 h-10 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center mb-4">
                    <Camera className="w-5 h-5 text-[#FF6700]" />
                  </div>
                  <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">
                    You send the photos
                  </h3>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6">
                    Upload your photos and videos to the portal. We write the captions, design the graphics and schedule everything.
                  </p>
                </div>
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-mono text-slate-500">Starting at</span>
                  <span className="font-heading font-black text-xl text-[#090D16]">From $297/mo</span>
                </div>
              </div>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
        <div className="max-w-6xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              HOW IT WORKS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Four steps. 30 minutes a month.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((st, idx) => (
              <MotionWrapper key={st.step} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full p-6 rounded-3xl bg-slate-50 border border-slate-200">
                  <span className="text-xs font-mono font-bold text-slate-400 block mb-2">
                    STEP {st.step}
                  </span>
                  <h3 className="font-heading font-bold text-base text-[#090D16] mb-2">
                    {st.title}
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {st.desc}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Plans Table (2 Tabs) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              PLANS &amp; PRICING
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight mb-6">
              Choose your monthly plan.
            </h2>

            {/* Tab Switcher */}
            <div className="inline-flex items-center p-1.5 rounded-2xl bg-slate-200 border border-slate-300">
              <button
                type="button"
                onClick={() => setActiveTab("create-everything")}
                className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "create-everything"
                    ? "bg-[#FF6700] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#090D16]"
                }`}
              >
                We create everything (Default)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("send-photos")}
                className={`px-5 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all cursor-pointer ${
                  activeTab === "send-photos"
                    ? "bg-[#FF6700] text-white shadow-sm"
                    : "text-slate-600 hover:text-[#090D16]"
                }`}
              >
                You send the photos
              </button>
            </div>
          </MotionWrapper>

          {/* Tab 1: We create everything */}
          {activeTab === "create-everything" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <MotionWrapper direction="up" delay={0} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 block mb-1">STARTER</span>
                    <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">Ignite</h3>
                    <div className="font-heading font-black text-3xl text-[#090D16] mb-3">$597<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <p className="text-xs text-slate-600 mb-6">12 custom branded posts a month.</p>
                  </div>
                  <a
                    href={PORTAL_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98"
                  >
                    Choose Ignite
                  </a>
                </div>
              </MotionWrapper>

              <MotionWrapper direction="up" delay={0.08} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border-2 border-[#FF6700] shadow-md flex flex-col justify-between relative">
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-[#FF6700] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
                    Most Popular
                  </span>
                  <div>
                    <span className="text-xs font-mono font-bold text-[#FF6700] block mb-1">GROWTH</span>
                    <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">Amplify</h3>
                    <div className="font-heading font-black text-3xl text-[#090D16] mb-3">$997<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <p className="text-xs text-slate-600 mb-6">20 posts plus 4 short videos a month.</p>
                  </div>
                  <a
                    href={PORTAL_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98"
                  >
                    Choose Amplify
                  </a>
                </div>
              </MotionWrapper>

              <MotionWrapper direction="up" delay={0.16} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 block mb-1">SCALE</span>
                    <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">Command</h3>
                    <div className="font-heading font-black text-3xl text-[#090D16] mb-3">$1,497<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <p className="text-xs text-slate-600 mb-6">Daily posts plus priority production.</p>
                  </div>
                  <a
                    href={PORTAL_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98"
                  >
                    Choose Command
                  </a>
                </div>
              </MotionWrapper>
            </div>
          )}

          {/* Tab 2: You send the photos */}
          {activeTab === "send-photos" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <MotionWrapper direction="up" delay={0} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 block mb-1">ENTRY</span>
                    <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">Launch</h3>
                    <div className="font-heading font-black text-3xl text-[#090D16] mb-3">$297<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <p className="text-xs text-slate-600 mb-6">12 posts a month from your photos. We write, design and schedule.</p>
                  </div>
                  <a
                    href={PORTAL_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98"
                  >
                    Choose Launch
                  </a>
                </div>
              </MotionWrapper>

              <MotionWrapper direction="up" delay={0.08} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 block mb-1">STANDARD</span>
                    <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">Presence</h3>
                    <div className="font-heading font-black text-3xl text-[#090D16] mb-3">$497<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <p className="text-xs text-slate-600 mb-6">20 posts a month from your photos. We write, design and schedule.</p>
                  </div>
                  <a
                    href={PORTAL_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98"
                  >
                    Choose Presence
                  </a>
                </div>
              </MotionWrapper>

              <MotionWrapper direction="up" delay={0.16} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs flex flex-col justify-between">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-400 block mb-1">ACCELERATED</span>
                    <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">Velocity</h3>
                    <div className="font-heading font-black text-3xl text-[#090D16] mb-3">$797<span className="text-xs font-normal text-slate-500">/mo</span></div>
                    <p className="text-xs text-slate-600 mb-6">Daily posts (30 a month) from your photos. We write, design and schedule.</p>
                  </div>
                  <a
                    href={PORTAL_CHECKOUT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full text-center py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm active:scale-98"
                  >
                    Choose Velocity
                  </a>
                </div>
              </MotionWrapper>
            </div>
          )}

          {/* Upsell to ReLaunch Studio */}
          <div className="text-center pt-2">
            <Link
              href="/studio"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF6700] hover:underline"
            >
              <span>Want weekly video ads too? Add ReLaunch Studio →</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Questions */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-3xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              FAQ
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Questions about ReLaunch Social
            </h2>
          </MotionWrapper>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <MotionWrapper key={idx} direction="up" delay={idx * 0.05} distance={15}>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/90 shadow-xs">
                  <h3 className="font-heading font-bold text-base text-[#090D16] mb-2">
                    {faq.q}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
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
            Get your social media <span className="text-[#FF6700]">running this week.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Pick a plan and get portal access today. Want advice first? Book a free strategy call.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={PORTAL_CHECKOUT_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <span>Choose a plan</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </a>

            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: "ReLaunch Social" })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-[#090D16] font-heading font-bold text-xs uppercase tracking-wider transition-all"
            >
              <Calendar className="w-4 h-4 text-[#FF6700]" />
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
