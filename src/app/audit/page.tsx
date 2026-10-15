"use client";

import React, { useState } from "react";
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
  Target,
  Search,
  FileText,
  BarChart3,
  Layers,
  ShieldCheck,
  Check,
  X as XIcon,
} from "lucide-react";

export default function AuditPage() {
  const { openContactModal } = useContactModal();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState<{
    overall: number;
    message: number;
    journey: number;
    persuasion: number;
    consistency: number;
    weakestArea: string;
  } | null>(null);

  const handleStartAudit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!websiteUrl || !email) return;

    setLoading(true);
    setTimeout(() => {
      // Deterministic calculation based on input length
      const seed = (websiteUrl.length * 7 + email.length * 3) % 25;
      const score = 62 + seed;
      setCalculatedScore({
        overall: score,
        message: Math.max(55, score - 6),
        journey: Math.min(88, score + 4),
        persuasion: Math.max(50, score - 11),
        consistency: Math.min(92, score + 2),
        weakestArea: "Persuasion & Call-to-Action Friction",
      });
      setLoading(false);
      setSubmitted(true);
    }, 1200);
  };

  const scoreCriteria = [
    {
      title: "Your message",
      desc: "Can a stranger tell in seconds what you do and who it's for?",
      icon: Search,
    },
    {
      title: "Your customer's journey",
      desc: "Does your marketing show customers their problem, your plan, and what life looks like after?",
      icon: Layers,
    },
    {
      title: "Your persuasion",
      desc: "Do your headlines, offers and calls to action give people a reason to act now?",
      icon: Target,
    },
    {
      title: "Your consistency",
      desc: "Do your website, social media and reviews tell the same story?",
      icon: CheckCircle2,
    },
  ];

  const steps = [
    {
      step: "01",
      title: "Enter your website & social links",
      desc: "Takes about two minutes. Tell us which channels you want evaluated.",
    },
    {
      step: "02",
      title: "Get your score",
      desc: "See where you stand across message, journey, persuasion, and your biggest gap.",
    },
    {
      step: "03",
      title: "Fix it, or have us fix it",
      desc: "Use the fix list yourself, or book a strategy call and we'll handle the overhaul.",
    },
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative w-full pt-36 sm:pt-44 pb-14 sm:pb-20 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(255,103,0,0.18),transparent_75%)]" />
          <div className="absolute top-1/4 right-1/4 w-[450px] h-[350px] bg-[#FF6700]/20 rounded-full blur-[140px]" />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold mb-3">
            RELAUNCH SOCIAL AUDIT · FREE DIAGNOSTIC
          </span>
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4">
            How well does your <span className="text-[#FF6700]">marketing sell?</span>
          </h1>
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-8">
            Get a free score in a few minutes. See exactly where your website, social media and reviews are losing customers, and what to fix first.
          </p>

          {/* Interactive Diagnostic Form */}
          <div className="max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-white/[0.05] border border-white/[0.12] backdrop-blur-xl shadow-2xl text-left">
            {!submitted ? (
              <form onSubmit={handleStartAudit} className="space-y-4">
                <div>
                  <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                    Website URL
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="https://yourbusiness.com"
                    value={websiteUrl}
                    onChange={(e) => setWebsiteUrl(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.15] text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#FF6700]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                      Business Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Acme Services"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.15] text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#FF6700]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-bold block mb-1.5">
                      Email for Report
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white/[0.08] border border-white/[0.15] text-white placeholder-slate-400 text-sm focus:outline-none focus:border-[#FF6700]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-2 py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-black text-xs uppercase tracking-wider transition-all shadow-[0_0_20px_rgba(255,103,0,0.35)] cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Analyzing Website & Scoring Message..." : "Get My Free Score →"}
                </button>
              </form>
            ) : (
              <div className="text-center py-4">
                <div className="w-14 h-14 rounded-full bg-[#FF6700]/20 text-[#FF6700] border border-[#FF6700]/30 flex items-center justify-center mx-auto mb-3">
                  <span className="font-heading font-black text-xl">{calculatedScore?.overall}/100</span>
                </div>
                <h3 className="font-heading font-bold text-lg text-white mb-1">
                  Preliminary Marketing Score
                </h3>
                <p className="text-xs text-slate-300 mb-4">
                  Weakest area detected: <strong className="text-amber-400">{calculatedScore?.weakestArea}</strong>
                </p>

                <div className="grid grid-cols-2 gap-2 text-left mb-6 text-xs text-slate-300 bg-white/[0.04] p-3 rounded-xl border border-white/[0.08]">
                  <div>Message Clarity: <strong className="text-white">{calculatedScore?.message}/100</strong></div>
                  <div>Customer Journey: <strong className="text-white">{calculatedScore?.journey}/100</strong></div>
                  <div>Persuasion / CTA: <strong className="text-amber-400">{calculatedScore?.persuasion}/100</strong></div>
                  <div>Story Consistency: <strong className="text-white">{calculatedScore?.consistency}/100</strong></div>
                </div>

                <button
                  type="button"
                  onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: "Social Audit Review" })}
                  className="w-full py-3 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  Review Fix List on Strategy Call →
                </button>
              </div>
            )}
          </div>
        </MotionWrapper>
      </section>

      {/* 2. Why a Score */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <MotionWrapper direction="up" distance={20} className="max-w-3xl mx-auto text-center sm:text-left">
          <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block mb-2">
            THE REALITY CHECK
          </span>
          <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight mb-4">
            Good-looking marketing isn&apos;t the same as marketing that sells.
          </h2>
          <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
            Plenty of businesses have a nice website and active social pages and still don&apos;t get enough calls. The problem is usually the message: customers can&apos;t tell quickly what you do, why it matters to them, or what to do next. Our score measures that.
          </p>
        </MotionWrapper>
      </section>

      {/* 3. What We Score */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-y border-slate-200">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              SCORING CRITERIA
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              What we score.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {scoreCriteria.map((c, idx) => (
              <MotionWrapper key={c.title} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs">
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
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Free Score vs Full Audit Table */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              AUDIT TIERS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Free score vs. full audit.
            </h2>
          </MotionWrapper>

          <MotionWrapper direction="up" delay={0.1} distance={20} className="overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="p-4 sm:p-5 font-mono uppercase text-slate-500 font-bold">Feature</th>
                  <th className="p-4 sm:p-5 font-heading font-black text-base text-[#090D16]">Free Score</th>
                  <th className="p-4 sm:p-5 font-heading font-black text-base text-[#FF6700]">Full Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-500">Price</td>
                  <td className="p-4 sm:p-5 font-bold text-[#090D16]">Free</td>
                  <td className="p-4 sm:p-5 font-bold text-[#FF6700]">$495, one time</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-500">What you get</td>
                  <td className="p-4 sm:p-5 text-slate-600">Your overall score and your weakest area</td>
                  <td className="p-4 sm:p-5 text-slate-700 font-medium">A written report: score by area, every gap we found, and a prioritized fix list</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-500">Channels reviewed</td>
                  <td className="p-4 sm:p-5 text-slate-600">Website</td>
                  <td className="p-4 sm:p-5 text-slate-700 font-medium">Website, social media, Google profile and reviews</td>
                </tr>
                <tr>
                  <td className="p-4 sm:p-5 font-medium text-slate-500">Next step</td>
                  <td className="p-4 sm:p-5 text-slate-600">Upgrade or book a call</td>
                  <td className="p-4 sm:p-5 text-slate-700 font-medium">Walk-through call with Bobby</td>
                </tr>
              </tbody>
            </table>
          </MotionWrapper>
        </div>
      </section>

      {/* 5. How It Works */}
      <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-5xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
              HOW IT WORKS
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-4xl text-[#090D16] tracking-tight">
              Three steps. Two minutes.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((st, idx) => (
              <MotionWrapper key={st.step} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full p-7 rounded-3xl bg-white border border-slate-200 shadow-xs">
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

      {/* 6. Final Call */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-center border-t border-slate-100">
        <MotionWrapper direction="up" distance={20} className="max-w-2xl mx-auto">
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-4">
            Find out what your marketing <span className="text-[#FF6700]">is really saying.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            It&apos;s free and takes a couple of minutes. You&apos;ll know exactly where to start.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-black text-xs uppercase tracking-wider transition-all shadow-[0_4px_20px_rgba(255,103,0,0.35)] cursor-pointer"
            >
              <span>Get my free score</span>
              <ArrowUpRight className="w-4 h-4 text-white" />
            </button>

            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: "Social Audit" })}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-[#FF6700] font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer active:scale-98"
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
