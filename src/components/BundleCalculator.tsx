"use client";

import { useState, useMemo } from "react";
import { bundleTiers, selectableServices } from "@/data/bundlePricing";
import { useContactModal } from "@/context/ContactModalContext";
import NumberCounter from "./NumberCounter";
import MotionWrapper from "./MotionWrapper";
import { Check, ArrowRight, RotateCcw } from "lucide-react";

export default function BundleCalculator() {
  const { openContactModal } = useContactModal();
  const [selectedIds, setSelectedIds] = useState<string[]>([
    "marketing-ads",
    "relaunch-social",
    "web-dev",
  ]);

  const toggleService = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const count = selectedIds.length;

  const currentTier = useMemo(() => {
    if (count >= 6) return bundleTiers[3];
    if (count >= 4) return bundleTiers[2];
    if (count >= 2) return bundleTiers[1];
    if (count === 1) return bundleTiers[0];
    return null;
  }, [count]);

  const discountPercent = currentTier ? currentTier.discountPercent : 0;

  const subtotal = useMemo(() => {
    return selectedIds.reduce((sum, id) => {
      const s = selectableServices.find((item) => item.id === id);
      return sum + (s ? s.basePrice : 0);
    }, 0);
  }, [selectedIds]);

  const discountAmount = Math.round(subtotal * (discountPercent / 100));
  const finalMonthlyPrice = subtotal - discountAmount;
  const annualSavings = discountAmount * 12;

  return (
    <section id="bundle-builder" className="py-14 sm:py-16 bg-white border-b border-slate-200/80 select-none scroll-mt-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header */}
        <MotionWrapper direction="up" distance={20} className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-6 sm:mb-8">
          <div className="max-w-xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2">
              TRANSPARENT PRICING
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.05]">
              Subscribe. <br />
              Bundle. <span className="text-[#C0622A] italic">Save.</span>
            </h2>
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mt-2 font-normal">
              Pick any recurring service. Add more to unlock automatic discounts. No contracts. No surprises. Pause or cancel anytime.
            </p>
          </div>

          <div className="bg-slate-50 text-slate-900 p-5 sm:p-6 rounded-2xl shadow-sm max-w-sm w-full shrink-0 border border-slate-200">
            <h3 className="font-heading font-black text-lg text-slate-950 mb-1">
              Ready to build your bundle?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mb-3">
              Choose services on the left, see your instant discount below, and lock in your rate.
            </p>
            <button
              type="button"
              onClick={() =>
                openContactModal({
                  intent: "bundle-inquiry",
                  serviceInterest: "A full bundle",
                  notes: `Configured bundle with ${count} services ($${finalMonthlyPrice.toLocaleString()}/mo):\n- ${selectedIds
                    .map(
                      (id) =>
                        selectableServices.find((s) => s.id === id)?.name || id
                    )
                    .join("\n- ")}`,
                })
              }
              className="inline-flex items-center justify-center gap-1.5 w-full py-3 bg-[#C0622A] hover:bg-[#a84f1d] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-xs active:translate-y-0.5 cursor-pointer"
            >
              <span>Lock In Bundle Rate</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </MotionWrapper>

        {/* 4 Tier Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8 w-full">
          {bundleTiers.map((tier, idx) => {
            const isActive = currentTier?.id === tier.id;
            return (
              <MotionWrapper
                key={tier.id}
                direction="left"
                delay={idx * 0.1}
                distance={45}
                className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl transition-all ${
                  isActive
                    ? "bg-white text-slate-950 border-2 border-[#C0622A] shadow-md ring-4 ring-[#C0622A]/10 scale-[1.02]"
                    : "bg-white text-[#090D16] shadow-xs border border-slate-200"
                }`}
              >
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">
                  {tier.name}
                </div>
                <div
                  className={`font-heading font-black text-2xl sm:text-3xl mb-0.5 ${
                    isActive ? "text-[#C0622A]" : "text-[#090D16]"
                  }`}
                >
                  {tier.id === "starter" ? "1" : tier.id === "growth" ? "2–3" : tier.id === "scale" ? "4–5" : "6+"}
                </div>
                <div className="text-xs font-semibold text-slate-500 mb-2">
                  {tier.countLabel}
                </div>
                <div
                  className={`inline-flex px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    tier.discountPercent === 0
                      ? "bg-slate-100 text-slate-600"
                      : "bg-[#C0622A] text-white"
                  }`}
                >
                  {tier.discountBadge}
                </div>
                <p className="text-xs mt-2 leading-relaxed text-slate-500">
                  {tier.description}
                </p>
              </MotionWrapper>
            );
          })}
        </div>

        {/* Interactive Services Selector & Summary Grid */}
        <MotionWrapper direction="up" delay={0.15} className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-start">
          {/* Services List (7 cols) */}
          <div className="lg:col-span-7 space-y-2.5">
            <div className="flex items-center justify-between pb-2">
              <span className="font-heading font-bold text-xs uppercase tracking-wider text-slate-600">
                Select Services ({count} selected)
              </span>
              {count > 0 && (
                <button
                  onClick={() => setSelectedIds([])}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#C0622A] hover:bg-[#a84f1d] text-white font-heading font-bold text-[10px] sm:text-[11px] uppercase tracking-wider transition-all shadow-xs active:translate-y-0.5 cursor-pointer"
                  title="Clear all selected services"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Clear All</span>
                </button>
              )}
            </div>

            {selectableServices.map((service) => {
              const isSelected = selectedIds.includes(service.id);
              return (
                <div
                  key={service.id}
                  onClick={() => toggleService(service.id)}
                  className={`p-4 rounded-2xl cursor-pointer select-none transition-all duration-150 border flex items-start justify-between gap-4 ${
                    isSelected
                      ? "bg-orange-50/60 border-[#C0622A] shadow-xs"
                      : "bg-white border-slate-200 hover:border-slate-300 shadow-xs"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center mt-0.5 shrink-0 transition-colors ${
                        isSelected
                          ? "bg-[#C0622A] border-[#C0622A] text-white"
                          : "bg-white border-slate-300 text-transparent"
                      }`}
                    >
                      <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <h4 className="font-heading font-bold text-sm text-[#090D16]">
                          {service.name}
                        </h4>
                        {service.popular && (
                          <span className="text-[9px] font-bold uppercase px-2 py-0.2 rounded-full bg-[#C0622A]/10 text-[#C0622A]">
                            Popular
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {service.description}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="font-heading font-black text-sm text-[#090D16] block">
                      ${service.basePrice}
                    </span>
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      /mo
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Dynamic Summary Card (5 cols) */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="bg-slate-50 text-slate-900 p-7 sm:p-8 rounded-3xl shadow-lg border border-slate-200">
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 mb-6">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#C0622A] block mb-1">
                    LIVE CALCULATION
                  </span>
                  <h3 className="font-heading font-black text-2xl text-slate-950">
                    Bundle Summary
                  </h3>
                </div>
                <div className="text-right">
                  <span className="font-heading font-black text-3xl text-[#C0622A]">
                    {count}
                  </span>
                  <span className="text-xs text-slate-500 block">
                    {count === 1 ? "Service" : "Services"}
                  </span>
                </div>
              </div>

              {count === 0 ? (
                <div className="py-10 text-center text-slate-500 text-xs">
                  Select 1 or more services on the left to calculate your monthly bundle savings.
                </div>
              ) : (
                <>
                  <div className="space-y-2 mb-6 max-h-44 overflow-y-auto pr-1 text-xs">
                    {selectedIds.map((id) => {
                      const s = selectableServices.find((item) => item.id === id);
                      if (!s) return null;
                      return (
                        <div
                          key={s.id}
                          className="flex items-center justify-between text-slate-700 py-1.5 border-b border-slate-200"
                        >
                          <span className="truncate max-w-[200px] font-medium">{s.name}</span>
                          <span className="font-mono text-slate-900 font-semibold">
                            ${s.basePrice}/mo
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-200 mb-6 text-xs">
                    <div className="flex justify-between text-slate-500">
                      <span>Standard Total</span>
                      <span className="font-mono line-through">${subtotal}/mo</span>
                    </div>

                    <div className="flex justify-between text-[#C0622A] font-bold">
                      <span>Bundle Discount ({discountPercent}%)</span>
                      <span className="font-mono">-${discountAmount}/mo</span>
                    </div>

                    {annualSavings > 0 && (
                      <div className="p-3 bg-orange-50 text-slate-900 rounded-xl border border-orange-200/80 flex items-center justify-between text-xs mt-2">
                        <span className="text-slate-700 font-medium">Annual Savings:</span>
                        <span className="font-heading font-black text-[#C0622A] text-sm">
                          ${annualSavings.toLocaleString()} / year
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Monthly Investment */}
                  <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs mb-6 text-center">
                    <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold block mb-1">
                      Discounted Monthly Rate
                    </span>
                    <div className="font-heading font-black text-4xl sm:text-5xl text-slate-950">
                      <NumberCounter value={finalMonthlyPrice} prefix="$" suffix="" duration={0.8} />
                      <span className="text-sm text-slate-500 font-normal"> /mo</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      openContactModal({
                        intent: "bundle-inquiry",
                        serviceInterest: "A full bundle",
                        notes: `Configured bundle with ${count} services ($${finalMonthlyPrice.toLocaleString()}/mo):\n- ${selectedIds
                          .map(
                            (id) =>
                              selectableServices.find((s) => s.id === id)
                                ?.name || id
                          )
                          .join("\n- ")}`,
                      })
                    }
                    className="w-full py-3.5 bg-[#C0622A] hover:bg-[#a84f1d] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl shadow-sm flex items-center justify-center gap-2 transition-all text-center active:translate-y-0.5 cursor-pointer"
                  >
                    <span>Lock In This Rate</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </MotionWrapper>
      </div>
    </section>
  );
}
