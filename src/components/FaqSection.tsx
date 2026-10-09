"use client";

import { useState } from "react";
import { faqData } from "@/data/faq";
import MotionWrapper from "./MotionWrapper";
import { Plus, Minus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section id="faq" className="py-16 sm:py-20 bg-white border-b border-slate-200 select-none scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
            FREQUENTLY ASKED QUESTIONS
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.05] mb-3">
            Everything You <span className="text-[#7F48ED]">Need to Know.</span>
          </h2>
          <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal">
            Clear answers on our subscription model, bundle savings, contracts, and delivery.
          </p>
        </MotionWrapper>

        {/* Accordion */}
        <div className="space-y-3 max-w-4xl mx-auto">
          {faqData.map((item, idx) => {
            const isOpen = openIndex === idx;

            return (
              <MotionWrapper
                key={item.question}
                direction="left"
                delay={idx * 0.05}
                distance={30}
                className="bg-slate-50 rounded-2xl border border-slate-200/90 overflow-hidden transition-all duration-200 hover:border-slate-300 shadow-xs"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 select-none focus:outline-none cursor-pointer group"
                  aria-expanded={isOpen}
                >
                  <span className={`font-heading font-bold text-sm sm:text-base transition-colors ${isOpen ? "text-[#7F48ED]" : "text-[#090D16] group-hover:text-[#7F48ED]"}`}>
                    {item.question}
                  </span>

                  <span
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-all ${
                      isOpen
                        ? "bg-[#7F48ED] text-white shadow-sm rotate-180"
                        : "bg-white text-slate-600 border border-slate-200 group-hover:border-[#7F48ED]/40"
                    }`}
                  >
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeInOut" }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 sm:px-5 pb-5 pt-0 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-200/50 font-normal">
                        <p className="mt-3">{item.answer}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </MotionWrapper>
            );
          })}
        </div>
      </div>
    </section>
  );
}


