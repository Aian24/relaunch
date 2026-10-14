"use client";

import React from "react";
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
  Sparkles,
  Bot,
  Search,
  TrendingUp,
  FileText,
  ShieldCheck,
} from "lucide-react";

const AI_SUBDOMAIN_URL = "https://ai.relaunch.us";

export default function AiRecommendationsPage() {
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

  const whatWeDoList = [
    {
      title: "Check where you stand",
      desc: "We ask the major AI assistants the questions your customers ask and record who they recommend.",
      icon: Search,
    },
    {
      title: "Fix what they read",
      desc: "We clean up your listings, strengthen your reviews, and update your website so AI tools understand exactly what you do and where.",
      icon: CheckCircle2,
    },
    {
      title: "Build your reputation online",
      desc: "We get your business mentioned on the high-authority sites and knowledge graphs AI tools trust.",
      icon: Sparkles,
    },
    {
      title: "Track it every month",
      desc: "You get a simple report: where you're recommended, where you're not yet, and what we're doing next.",
      icon: TrendingUp,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Sign up online",
      desc: "Pick a 3, 6 or 9-month plan and tell us about your business and market.",
    },
    {
      step: "02",
      title: "We get to work",
      desc: "Your setup, schema updates, and citation alignment start in the first week.",
    },
    {
      step: "03",
      title: "You get a monthly report",
      desc: "See your progress in plain numbers: AI mentions, local queries, and ranking shifts.",
    },
  ];

  const faqs = [
    {
      q: "Can you guarantee AI will recommend me?",
      a: "No one can guarantee what an AI tool says. We improve everything those tools read about you and track the results every month, so you can see the progress yourself.",
    },
    {
      q: "Which AI tools do you cover?",
      a: "ChatGPT, Gemini, and Claude.",
    },
    {
      q: "Does this replace Google SEO?",
      a: "No, it builds on it. Most of what helps you on Google helps with AI too, and we cover both.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero Section with Cinematic Background Video */}
      <section className="relative w-full pt-36 sm:pt-44 pb-14 sm:pb-20 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <video
            src="/aipage.mp4"
            autoPlay
            muted
            loop
            playsInline
            onLoadedMetadata={(e) => {
              e.currentTarget.playbackRate = 0.7;
            }}
            className="absolute inset-0 w-full h-full object-cover opacity-100"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/75 via-[#07090E]/40 to-[#07090E]" />
          <div className="absolute top-1/4 right-1/4 w-[450px] h-[350px] bg-[#7F48ED]/20 rounded-full blur-[140px]" />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold mb-3">
            RELAUNCH AI RECOMMENDATIONS
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4">
            Get Recommended <span className="text-[#7F48ED]">by AI.</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            When someone asks ChatGPT, Gemini or Claude for the best business like yours, your name should be in the answer. We make that happen, and show you every month where you&apos;re showing up.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={AI_SUBDOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#7F48ED] hover:bg-[#6C34DE] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md active:scale-98"
            >
              <span>Get started</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </a>

            <button
              type="button"
              onClick={handleScrollToHow}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white font-heading font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
            >
              <span>See how it works ↓</span>
            </button>
          </div>
        </MotionWrapper>
      </section>

      {/* 2. The Shift */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <MotionWrapper direction="up" distance={20} className="max-w-3xl mx-auto text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block mb-2">
            CONSUMER BEHAVIOR SHIFT
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight mb-4">
            Your customers stopped scrolling search results.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            More and more people ask an AI assistant for a recommendation and go with what it says. AI tools pull their answers from what the web says about you: your listings, your reviews, your website and other sites that mention you. If that picture is thin or inconsistent, you don&apos;t make the list. Your competitor does.
          </p>
        </MotionWrapper>
      </section>

      {/* 3. What We Do */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              OUR PLAYBOOK
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              How we get you recommended.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {whatWeDoList.map((item, idx) => (
              <MotionWrapper key={item.title} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs">
                  <div className="w-10 h-10 rounded-2xl bg-purple-50 border border-purple-200 flex items-center justify-center mb-4">
                    <item.icon className="w-5 h-5 text-[#7F48ED]" />
                  </div>
                  <h3 className="font-heading font-bold text-lg text-[#090D16] mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal">
                    {item.desc}
                  </p>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 4. How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white scroll-mt-20">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              EXECUTION STEPS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Three simple steps.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {steps.map((st, idx) => (
              <MotionWrapper key={st.step} direction="up" delay={idx * 0.1} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-slate-50 border border-slate-200">
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

          {/* 5. Plans Banner - Light background as requested */}
          <MotionWrapper direction="up" distance={20}>
            <div className="p-8 rounded-3xl bg-purple-50/70 border border-[#7F48ED]/25 text-[#090D16] flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-mono uppercase tracking-wider text-[#7F48ED] font-bold block mb-1">
                  CAMPAIGN STRUCTURE
                </span>
                <h3 className="font-heading font-bold text-xl text-[#090D16] mb-1">
                  Flexible 3, 6 or 9-Month Plans
                </h3>
                <p className="text-xs sm:text-sm text-slate-600">
                  Each plan includes a one-time setup fee and a monthly optimization retainer.
                </p>
              </div>
              <a
                href={AI_SUBDOMAIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-[#7F48ED] hover:bg-[#6C34DE] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-[0_4px_15px_rgba(127,72,237,0.25)] whitespace-nowrap shrink-0"
              >
                <span>See plans &amp; pricing →</span>
              </a>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* 6. Questions */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-3xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              FAQ
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Questions about AI Recommendations
            </h2>
          </MotionWrapper>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <MotionWrapper key={idx} direction="up" delay={idx * 0.05} distance={15}>
                <div className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
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
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-center border-t border-slate-100">
        <MotionWrapper direction="up" distance={20} className="max-w-2xl mx-auto">
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-4">
            Be the business <span className="text-[#7F48ED]">AI recommends.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Sign up online in a few minutes. Questions first? Book a free strategy call.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={AI_SUBDOMAIN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#7F48ED] hover:bg-[#6C34DE] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md"
            >
              <span>Get started</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </a>

            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: "AI Recommendations" })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-purple-50 hover:bg-purple-100 border border-purple-200 text-[#7F48ED] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer active:scale-98"
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
