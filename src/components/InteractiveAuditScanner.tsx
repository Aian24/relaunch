"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";
import MotionWrapper from "./MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";

interface AuditReport {
  overall: number;
  band: string;
  bandNote: string;
  layers: {
    storybrand: number;
    herosJourney: number;
    draper: number;
    archetype: number;
  };
  primaryArchetype: string;
  headline: string;
  weakest: { area: string; score: number; fix: string };
  fixes: { area: string; score: number; fix: string }[];
  salesHook: string;
}

export default function InteractiveAuditScanner() {
  const { openContactModal } = useContactModal();
  const [name, setName] = useState("");
  const [business, setBusiness] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<AuditReport | null>(null);
  const [displayScore, setDisplayScore] = useState(0);

  const reportRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !website) {
      setError("Please fill in both your email and website URL.");
      return;
    }

    setLoading(true);
    setReport(null);

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, business, email, website }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please check the URL and try again.");
        setLoading(false);
        return;
      }

      setReport(data);
      setLoading(false);

      // Scroll smoothly to report
      setTimeout(() => {
        reportRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    } catch {
      setError("Network error. Please verify your internet connection and try again.");
      setLoading(false);
    }
  };

  // Animate number count up when report arrives
  useEffect(() => {
    if (!report) return;

    let startTime: number | null = null;
    const duration = 1200; // ms
    const target = report.overall;

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayScore(Math.round(progress * target));
      if (progress < 1) {
        requestAnimationFrame(step);
      }
    };

    requestAnimationFrame(step);
  }, [report]);

  const layerNames: Record<string, string> = {
    storybrand: "StoryBrand Clarity",
    herosJourney: "Transformation Story",
    draper: "Emotional Pull",
    archetype: "Brand Voice Consistency",
  };

  // SVG Ring calculation
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = report ? circumference * (1 - report.overall / 100) : circumference;

  return (
    <div className="w-full max-w-4xl mx-auto my-8">
      {/* 1. SCANNER FORM (When no report or resetting) */}
      {!report && (
        <MotionWrapper direction="up" distance={25} className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10">
          <div className="text-center max-w-xl mx-auto mb-8">
            <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold mb-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-200">
              LIVE NARRATIVE INTELLIGENCE SCANNER
            </span>
            <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] tracking-tight">
              Test your site right now.
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm mt-2">
              Our crawler analyzes your message the way a buyer reads it — revealing what to fix first.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-[#FF6700]/30 text-[#E65C00] text-xs sm:text-sm font-semibold flex items-center gap-3">
              <AlertCircle className="w-5 h-5 flex-shrink-0 text-[#FF6700]" />
              <span>{error}</span>
            </div>
          )}

          {loading ? (
            <div className="py-16 text-center">
              <div className="relative w-16 h-16 mx-auto mb-6">
                <div className="w-16 h-16 rounded-full border-4 border-slate-100 border-t-[#7F48ED] border-r-[#FF6700] animate-spin" />
              </div>
              <h3 className="font-heading font-black text-lg text-[#090D16] mb-1">
                Reading your site the way a customer would…
              </h3>
              <p className="text-xs text-slate-500">
                Scoring StoryBrand clarity, transformation story, emotion, and brand voice
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Jane Smith"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/20 outline-none text-sm transition-all text-[#090D16]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                    Business Name
                  </label>
                  <input
                    type="text"
                    value={business}
                    onChange={(e) => setBusiness(e.target.value)}
                    placeholder="Jane's Bakery"
                    className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/20 outline-none text-sm transition-all text-[#090D16]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Work Email <span className="text-[#FF6700]">*</span>
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane@yourcompany.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/20 outline-none text-sm transition-all text-[#090D16]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Website URL <span className="text-[#FF6700]">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="yourbusiness.com"
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 focus:border-[#7F48ED] focus:ring-2 focus:ring-[#7F48ED]/20 outline-none text-sm transition-all text-[#090D16]"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-2 py-4 px-8 rounded-full bg-[#FF6700] hover:bg-[#E65C00] text-white font-heading font-black text-sm uppercase tracking-wider transition-all shadow-[0_6px_20px_rgba(255,103,0,0.30)] hover:shadow-[0_8px_24px_rgba(255,103,0,0.40)] cursor-pointer"
              >
                Get My Free Score →
              </button>

              <p className="text-center text-xs text-slate-400 mt-3">
                Free · No obligation · Instant automated analysis
              </p>
            </form>
          )}
        </MotionWrapper>
      )}

      {/* 2. REPORT VIEW (Rendered immediately after scoring) */}
      {report && (
        <div ref={reportRef} className="space-y-8 animate-fadeIn">
          {/* Header */}
          <div className="text-center">
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-1">
              YOUR NARRATIVE INTELLIGENCE SCORE
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight">
              {name ? `${name.split(" ")[0]}, here’s` : "Here’s"} how your marketing{" "}
              <span className="text-[#7F48ED]">scores.</span>
            </h2>
            <p className="text-slate-500 text-xs sm:text-sm mt-1">
              Analyzed: <strong className="text-slate-800">{website}</strong>
            </p>
          </div>

          {/* Hero Score Card in Dark with Purple & Orange Glow */}
          <div className="relative overflow-hidden rounded-3xl bg-[#07090E] text-white p-8 sm:p-12 text-center border border-white/10 shadow-2xl">
            {/* Dual Glows */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#7F48ED]/35 rounded-full blur-[90px] pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#FF6700]/25 rounded-full blur-[90px] pointer-events-none" />

            {/* SVG Progress Ring */}
            <div className="relative w-48 h-48 mx-auto mb-4 z-10 flex items-center justify-center">
              <svg width="190" height="190" className="-rotate-90">
                <defs>
                  <linearGradient id="scoreRingGradNext" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FF6700" />
                    <stop offset="100%" stopColor="#7F48ED" />
                  </linearGradient>
                </defs>
                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="none"
                  stroke="rgba(255,255,255,0.12)"
                  strokeWidth="12"
                />
                <circle
                  cx="95"
                  cy="95"
                  r={radius}
                  fill="none"
                  stroke="url(#scoreRingGradNext)"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-out"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-heading font-black text-5xl sm:text-6xl text-white leading-none">
                  {displayScore}
                </span>
                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold mt-1">
                  out of 100
                </span>
              </div>
            </div>

            {/* Band Badge */}
            <div className="relative z-10 inline-block px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest bg-[#FF6700] text-white shadow-lg mb-3">
              {report.band}
            </div>

            <p className="relative z-10 text-slate-300 text-sm sm:text-base max-w-lg mx-auto font-normal leading-relaxed">
              {report.bandNote}
            </p>
          </div>

          {/* 4 Dimension Layers Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(report.layers).map(([key, val]) => {
              const isHigh = val >= 70;
              return (
                <div
                  key={key}
                  className="p-5 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-[#7F48ED]/40 transition-all"
                >
                  <div className="flex justify-between items-baseline mb-2.5">
                    <span className="font-bold text-xs sm:text-sm text-[#090D16]">
                      {layerNames[key] || key}
                    </span>
                    <span
                      className={`font-heading font-black text-base ${
                        isHigh ? "text-[#7F48ED]" : "text-[#FF6700]"
                      }`}
                    >
                      {val}
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-1000 ${
                        isHigh ? "bg-[#7F48ED]" : "bg-[#FF6700]"
                      }`}
                      style={{ width: `${val}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Biggest Opportunity Highlight */}
          <div className="space-y-3">
            <h3 className="font-heading font-black text-xl text-[#090D16]">
              Your biggest opportunity:{" "}
              <span className="text-[#7F48ED]">{report.weakest.area}</span>
            </h3>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 border-l-4 border-l-[#7F48ED]">
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed">
                {report.weakest.fix}
              </p>
            </div>
          </div>

          {/* Prioritized Fixes List */}
          <div className="space-y-4">
            <h3 className="font-heading font-black text-xl text-[#090D16]">
              What to fix first
            </h3>
            <div className="divide-y divide-slate-100 bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
              {report.fixes.map((f, i) => {
                const isAlt = i % 2 === 1;
                return (
                  <div key={f.area} className={`flex gap-4 py-4 ${i === 0 ? "pt-0" : ""}`}>
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center font-heading font-black text-xs text-white flex-shrink-0 shadow-sm ${
                        isAlt ? "bg-[#7F48ED]" : "bg-[#FF6700]"
                      }`}
                    >
                      {i + 1}
                    </div>
                    <div>
                      <strong className="block text-sm sm:text-base font-bold text-[#090D16] mb-1">
                        {f.area} <span className="text-[#7F48ED] font-black text-xs">· {f.score}/100</span>
                      </strong>
                      <span className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {f.fix}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sales Hook & CTAs */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#7F48ED]/8 to-[#FF6700]/8 border border-[#7F48ED]/20 shadow-md">
            <p className="font-heading font-bold text-base sm:text-lg text-[#090D16] mb-6 leading-relaxed">
              {report.salesHook}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() =>
                  openContactModal({
                    intent: "strategy-session",
                    serviceInterest: "Social Audit",
                    prefill: {
                      name,
                      email,
                      business,
                    },
                    notes: `Audit Score: ${report.overall}/100 (${report.band}) for ${website}. Weakest area: ${report.weakest.area} (${report.weakest.score}/100) — ${report.weakest.fix}`,
                  })
                }
                className="flex-1 py-4 px-6 rounded-full bg-[#FF6700] hover:bg-[#E65C00] text-white font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-center transition-all shadow-[0_6px_20px_rgba(255,103,0,0.30)] hover:shadow-[0_8px_24px_rgba(255,103,0,0.40)] cursor-pointer active:scale-98"
              >
                Book My Free Strategy Call →
              </button>
              <Link
                href="/pricing"
                className="flex-1 py-4 px-6 rounded-full bg-[#7F48ED] hover:bg-[#6B38D8] text-white font-heading font-black text-xs sm:text-sm uppercase tracking-wider text-center transition-all shadow-[0_6px_20px_rgba(127,72,237,0.30)] hover:shadow-[0_8px_24px_rgba(127,72,237,0.40)]"
              >
                See Pricing
              </Link>
            </div>
            <p className="text-center text-xs text-slate-500 mt-4">
              On the call we’ll walk your report line by line and map the fastest wins — whether you hire us or not.
            </p>
          </div>

          {/* Reset / Scan Another Button */}
          <div className="text-center pt-2">
            <button
              onClick={() => {
                setReport(null);
                setWebsite("");
              }}
              className="inline-flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-[#FF6700] uppercase tracking-wider transition-colors cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Scan another website</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
