"use client";

import { useState } from "react";
import { nisGraderPillars } from "@/data/nisGrader";
import { useContactModal } from "@/context/ContactModalContext";
import NumberCounter from "./NumberCounter";
import MotionWrapper from "./MotionWrapper";
import { Award, RotateCcw, BarChart, Check, CheckCircle2, ArrowRight, ArrowUpRight } from "lucide-react";

export default function NisGraderSection() {
  const { openContactModal } = useContactModal();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSelect = (pillarId: string, optionIndex: number) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [pillarId]: optionIndex,
    }));
  };

  const answeredCount = Object.keys(selectedAnswers).length;
  const isComplete = answeredCount === nisGraderPillars.length;

  const totalScore = Object.entries(selectedAnswers).reduce((sum, [pillarId, optIdx]) => {
    const pillar = nisGraderPillars.find((p) => p.id === pillarId);
    if (!pillar) return sum;
    return sum + pillar.options[optIdx].score;
  }, 0);

  const getScoreGrade = (score: number) => {
    if (score >= 85) return { grade: "A", label: "High-Converting Engine", color: "text-[#090D16]", bg: "bg-slate-100 border-slate-300" };
    if (score >= 65) return { grade: "B", label: "Good, but Leaking Conversions", color: "text-[#FF6700]", bg: "bg-orange-50 border-[#FF6700]/30" };
    if (score >= 45) return { grade: "C", label: "Significant Funnel Leaks", color: "text-slate-800", bg: "bg-slate-100 border-slate-200" };
    return { grade: "D", label: "Urgent Marketing Overhaul Needed", color: "text-red-700", bg: "bg-red-50 border-red-200" };
  };

  const gradeInfo = getScoreGrade(totalScore);

  return (
    <section id="nis-grader" className="py-14 sm:py-16 bg-slate-50 border-b border-slate-200 select-none scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <MotionWrapper direction="up" distance={20} className="text-center max-w-3xl mx-auto mb-6 sm:mb-8">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
            INSTANT DIAGNOSTIC TOOL · 100% FREE
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.05] mb-3">
            Free NIS <span className="text-[#FF6700]">Marketing Grader</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
            Take our 60-second four-layer diagnostic. Discover exactly where your current website, ads, and brand presence fail to sell—and see what fixes will unlock immediate growth.
          </p>
        </MotionWrapper>

        {/* Diagnostic Form */}
        <MotionWrapper direction="left" distance={45} delay={0.15} className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200 shadow-xl p-5 sm:p-8">
          {!isSubmitted ? (
            <div>
              {/* Progress */}
              <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-[#FF6700]" />
                  <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-700">
                    Step {answeredCount} of {nisGraderPillars.length} Answered
                  </span>
                </div>

                <span className="font-mono text-xs font-bold text-[#FF6700]">
                  {Math.round((answeredCount / nisGraderPillars.length) * 100)}%
                </span>
              </div>

              {/* Pillars */}
              <div className="space-y-4 mb-6">
                {nisGraderPillars.map((pillar, pIdx) => {
                  const selectedOpt = selectedAnswers[pillar.id];

                  return (
                    <div
                      key={pillar.id}
                      className="p-4 sm:p-5 rounded-xl bg-slate-50 border border-slate-200"
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-heading font-bold text-xs uppercase tracking-wider text-[#FF6700]">
                          Pillar 0{pIdx + 1} · {pillar.name} ({pillar.weight})
                        </span>
                      </div>

                      <h3 className="font-heading font-bold text-xs sm:text-sm text-[#090D16] mb-3">
                        {pillar.question}
                      </h3>

                      <div className="space-y-2">
                        {pillar.options.map((opt, oIdx) => {
                          const isChosen = selectedOpt === oIdx;

                          return (
                            <button
                              key={oIdx}
                              onClick={() => handleSelect(pillar.id, oIdx)}
                              className={`w-full text-left p-3.5 rounded-xl border transition-all duration-150 flex items-start gap-3 ${
                                isChosen
                                  ? "bg-orange-50 border-[#FF6700] text-slate-900 font-semibold shadow-sm"
                                  : "bg-white border-slate-200 text-slate-700 hover:border-slate-300"
                              }`}
                            >
                              <span
                                className={`w-5 h-5 rounded-full border flex items-center justify-center mt-0.5 shrink-0 text-xs font-bold ${
                                  isChosen
                                    ? "border-[#FF6700] bg-[#FF6700] text-white"
                                    : "border-slate-300 text-slate-400"
                                }`}
                              >
                                {isChosen ? (
                                  <Check className="w-3 h-3 text-white" />
                                ) : (
                                  String.fromCharCode(65 + oIdx)
                                )}
                              </span>
                              <span className="text-xs sm:text-sm leading-snug font-normal">
                                {opt.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-slate-100">
                <span className="inline-flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                  {isComplete ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#FF6700]" />
                      <span>All 4 pillars answered. Ready for diagnosis!</span>
                    </>
                  ) : (
                    "Please select an answer for each question above."
                  )}
                </span>

                <button
                  disabled={!isComplete}
                  onClick={() => isComplete && setIsSubmitted(true)}
                  className={`px-7 py-3.5 rounded-xl font-heading font-bold text-xs uppercase tracking-wider transition-all shadow-sm ${
                    isComplete
                      ? "bg-[#FF6700] hover:bg-[#E55C00] text-white cursor-pointer active:translate-y-0.5"
                      : "bg-slate-200 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  <span>Calculate My NIS Score</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ) : (
            /* Results */
            <div className="animate-in fade-in duration-200">
              <div className="text-center pb-8 border-b border-slate-200 mb-8">
                <span className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold block mb-2">
                  YOUR 4-LAYER DIAGNOSTIC SCORE
                </span>

                <div className="inline-flex items-baseline gap-2 mb-3">
                  <span className="font-heading font-black text-6xl sm:text-7xl text-[#090D16]">
                    <NumberCounter value={totalScore} duration={1.2} />
                  </span>
                  <span className="text-xl text-slate-400 font-bold">/ 100</span>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border font-heading font-bold text-sm ${gradeInfo.bg} ${gradeInfo.color}`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Grade {gradeInfo.grade}: {gradeInfo.label}</span>
                  </span>
                </div>
              </div>

              <div className="space-y-3 mb-8">
                {nisGraderPillars.map((pillar) => {
                  const optIdx = selectedAnswers[pillar.id] ?? 0;
                  const option = pillar.options[optIdx];

                  return (
                    <div
                      key={pillar.id}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <span className="font-heading font-bold text-xs text-[#090D16] block">
                          {pillar.name}
                        </span>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {option.feedback}
                        </p>
                      </div>

                      <span className="font-heading font-black text-sm text-[#FF6700] shrink-0">
                        {option.score} pts
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="p-8 bg-slate-50 text-slate-900 border border-slate-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
                <div>
                  <h5 className="font-heading font-black text-xl text-slate-950">
                    Want our team to fix these gaps for you?
                  </h5>
                  <p className="text-xs text-slate-600 mt-1">
                    Book a free 15-minute diagnostic strategy walkthrough.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setSelectedAnswers({});
                    }}
                    className="p-3.5 rounded-xl bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs font-bold transition-all cursor-pointer"
                    title="Retake Grader"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      openContactModal({
                        intent: "strategy-session",
                        serviceInterest: "A full bundle",
                        notes: `NIS Diagnostic Grader Result: ${totalScore}/100 (${gradeInfo.grade} Grade - ${gradeInfo.label}). Requesting audit walkthrough.`,
                      })
                    }
                    className="px-7 py-3.5 bg-[#FF6700] hover:bg-[#E55C00] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm transition-all text-center whitespace-nowrap active:translate-y-0.5"
                  >
                    <span>Book Free Strategy Call</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </MotionWrapper>
      </div>
    </section>
  );
}

