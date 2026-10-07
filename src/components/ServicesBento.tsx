"use client";

import { useState, useMemo, useEffect } from "react";
import { servicesData, ServiceItem } from "@/data/services";
import { useContactModal } from "@/context/ContactModalContext";
import { useScrollContext } from "./SmoothScrollProvider";
import MotionWrapper from "./MotionWrapper";
import SpotlightCard from "./SpotlightCard";
import Service3DVisual from "./Service3DVisual";
import { motion, AnimatePresence } from "framer-motion";
import {
  Megaphone,
  Palette,
  Cpu,
  Code2,
  Film,
  MailCheck,
  Database,
  Compass,
  CheckCircle2,
  ArrowUpRight,
  ArrowRight,
  Check,
  X,
  Zap,
  Clock,
} from "lucide-react";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Megaphone,
  Palette,
  Cpu,
  Code2,
  Film,
  MailCheck,
  Database,
  Compass,
  Video: Film,
  Mail: MailCheck,
  Layers: Database,
  BarChart3: Compass,
};

type CategoryFilter = "All" | "Core Marketing" | "Advanced Tech" | "Strategy & Creative";

export default function ServicesBento() {
  const { openContactModal } = useContactModal();
  const { stopScroll, startScroll } = useScrollContext();
  const [selectedService, setSelectedService] = useState<ServiceItem | null>(null);
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>("All");

  // Lock background body scroll and pause Lenis momentum scroll when modal is open
  useEffect(() => {
    if (selectedService) {
      stopScroll();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          setSelectedService(null);
        }
      };
      window.addEventListener("keydown", handleKeyDown);
      return () => {
        startScroll();
        document.body.style.overflow = "";
        document.documentElement.style.overflow = "";
        window.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      startScroll();
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
  }, [selectedService, stopScroll, startScroll]);

  // Filter services by category
  const filteredServices = useMemo(() => {
    if (activeCategory === "All") return servicesData;
    return servicesData.filter((s) => s.category === activeCategory);
  }, [activeCategory]);

  const handleBookService = (service: ServiceItem) => {
    setSelectedService(null);
    openContactModal({
      intent: "strategy-session",
      serviceInterest: service.title,
      notes: `Interested in ReLaunch service: ${service.title} (Starting at $${service.basePriceMonthly}/mo).`,
    });
  };

  const categories: { label: CategoryFilter; count: number }[] = [
    { label: "All", count: servicesData.length },
    { label: "Core Marketing", count: servicesData.filter((s) => s.category === "Core Marketing").length },
    { label: "Advanced Tech", count: servicesData.filter((s) => s.category === "Advanced Tech").length },
    { label: "Strategy & Creative", count: servicesData.filter((s) => s.category === "Strategy & Creative").length },
  ];

  return (
    <section
      id="services"
      className="py-20 sm:py-28 bg-white border-b border-slate-200 select-none scroll-mt-20 relative overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ========================================================================= */}
        {/* SECTION HEADER                                                            */}
        {/* ========================================================================= */}
        <MotionWrapper
          direction="up"
          distance={20}
          className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-100 border border-slate-200 text-[#C0622A] text-[10px] font-mono font-bold uppercase tracking-widest mb-4 whitespace-nowrap shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-[#C0622A]" />
              <span className="whitespace-nowrap">PHOENIX, AZ STUDIO · 8 CORE SERVICE LINES</span>
            </div>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.08]">
              Our Core Services. <br className="hidden sm:block" />
              <span className="text-[#C0622A]">Built to Attract &amp; Convert.</span>
            </h2>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-3 max-w-md">
            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed font-normal text-left lg:text-right">
              Explore our eight specialized marketing, creative, and software capabilities. Every capability features interactive 3D spatial models and verified deliverables.
            </p>
            <button
              type="button"
              onClick={() => openContactModal({ intent: "strategy-session" })}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#C0622A] hover:bg-[#a84f1d] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-sm active:translate-y-0.5 whitespace-nowrap cursor-pointer hover:scale-102 shrink-0"
            >
              <span className="whitespace-nowrap">Book Free Strategy Call</span>
              <ArrowRight className="w-3.5 h-3.5 shrink-0" />
            </button>
          </div>
        </MotionWrapper>

        {/* ========================================================================= */}
        {/* CATEGORY FILTER TABS                                                      */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between gap-4 mb-8 pb-2 overflow-x-auto scrollbar-none border-b border-slate-200">
          <div className="flex items-center gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat.label;
              return (
                <button
                  key={cat.label}
                  type="button"
                  onClick={() => setActiveCategory(cat.label)}
                  className={`relative px-4 py-2.5 rounded-xl text-xs font-heading font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "text-white bg-[#C0622A] shadow-md"
                      : "text-slate-600 hover:text-[#C0622A] bg-slate-100/80 hover:bg-slate-200/80 border border-slate-200/60"
                  }`}
                >
                  <span className="relative z-10 flex items-center gap-2 whitespace-nowrap">
                    <span className="whitespace-nowrap">{cat.label}</span>
                    <span
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-md whitespace-nowrap ${
                        isActive ? "bg-white/20 text-white" : "bg-white text-slate-500 border border-slate-200"
                      }`}
                    >
                      {cat.count}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          <span className="hidden md:inline-block text-[11px] font-mono text-slate-400 whitespace-nowrap">
            Showing {filteredServices.length} of 8 capabilities
          </span>
        </div>

        {/* ========================================================================= */}
        {/* 8-CARD BENTO GRID WITH 3D SPATIAL VISUALS                                 */}
        {/* ========================================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {filteredServices.map((service, idx) => {
            const IconComponent = iconMap[service.iconName] || Code2;

            return (
              <MotionWrapper
                key={service.id}
                direction="left"
                delay={idx * 0.08}
                distance={40}
                className="h-full"
              >
                <SpotlightCard
                  onClick={() => setSelectedService(service)}
                  spotlightColor="rgba(192, 98, 42, 0.08)"
                  className="group bg-slate-50/70 hover:bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 hover:border-[#C0622A]/60 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between h-full cursor-pointer relative overflow-hidden"
                >
                  {/* Top Accent Hover Line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-transparent group-hover:bg-[#C0622A] transition-colors" />

                  <div>
                    {/* Header Row: Icon, Service Number & Badges */}
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <div className="w-10 h-10 rounded-2xl bg-white border border-slate-200 group-hover:border-[#C0622A]/40 text-[#090D16] group-hover:bg-[#090D16] group-hover:text-[#C0622A] flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-xs shrink-0">
                        <IconComponent className="w-5 h-5 shrink-0" />
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        {service.badge && (
                          <span className="px-2 py-0.5 rounded-full bg-orange-50 text-[#C0622A] border border-[#C0622A]/30 text-[9px] font-mono font-bold uppercase whitespace-nowrap">
                            {service.badge}
                          </span>
                        )}
                        <span className="font-mono text-xs font-bold text-slate-400 group-hover:text-[#C0622A] transition-colors whitespace-nowrap pl-1">
                          {service.num}
                        </span>
                      </div>
                    </div>

                    {/* Interactive 3D Spatial Visual Box */}
                    <Service3DVisual
                      serviceId={service.id}
                      category={service.category}
                      className="w-full h-32 mb-4"
                    />

                    {/* Category Label */}
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block mb-1 whitespace-nowrap">
                      {service.category}
                    </span>

                    {/* Service Title */}
                    <h3 className="font-heading font-black text-lg sm:text-xl text-[#090D16] group-hover:text-[#C0622A] transition-colors mb-2 tracking-tight leading-snug">
                      {service.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-slate-600 text-xs font-normal leading-relaxed mb-4 line-clamp-2">
                      {service.shortDescription}
                    </p>

                    {/* Deliverables Scope Checklist */}
                    <div className="space-y-1.5 mb-4 pt-3 border-t border-slate-200/80">
                      {service.deliverables.slice(0, 2).map((item, dIdx) => (
                        <div key={dIdx} className="flex items-start gap-2 text-[11px] text-slate-700 leading-snug">
                          <Check className="w-3.5 h-3.5 text-[#2E8B7A] shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                      {service.deliverables.length > 2 && (
                        <span className="text-[10px] font-mono text-slate-400 block pt-0.5">
                          +{service.deliverables.length - 2} more scope items included
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Bottom: Rate & Non-Wrapping Orange CTA */}
                  <div className="pt-3.5 border-t border-slate-200 flex items-center justify-between gap-2">
                    <div className="shrink-0">
                      <span className="text-[9px] font-mono uppercase font-bold text-slate-400 block whitespace-nowrap">
                        Starting Rate
                      </span>
                      <div className="font-heading font-black text-base sm:text-lg text-[#090D16] whitespace-nowrap">
                        <span>${service.basePriceMonthly}</span>
                        <span className="text-xs font-normal text-slate-500 whitespace-nowrap">/mo</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => setSelectedService(service)}
                        className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C0622A] hover:bg-[#a84f1d] text-white text-xs font-heading font-bold uppercase tracking-wider transition-all shadow-sm hover:shadow-md whitespace-nowrap cursor-pointer shrink-0 hover:scale-102 active:translate-y-0.5"
                      >
                        <span className="whitespace-nowrap">View Scope</span>
                        <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                      </button>
                    </div>
                  </div>
                </SpotlightCard>
              </MotionWrapper>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SERVICE SCOPE & DETAILS MODAL (Spring Morph + Lenis-Prevented Inner Flow)  */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {selectedService && (
          <div
            key="service-detail-modal"
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="fixed inset-0 z-[998] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto overscroll-contain"
          >
            {/* Soft Frosted Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => setSelectedService(null)}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity cursor-pointer"
            />

            {/* Modal Dialog with Apple-Style Fluid Spring Physics */}
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 35, filter: "blur(6px)" }}
              animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
              exit={{ opacity: 0, scale: 0.9, y: 25, filter: "blur(6px)" }}
              transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.85 }}
              onClick={(e) => e.stopPropagation()}
              data-lenis-prevent="true"
              onWheel={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 my-auto flex flex-col max-h-[85vh] sm:max-h-[88vh]"
            >
              {/* Modal Top Header (Fixed shrink-0) */}
              <div className="shrink-0 bg-white text-slate-900 p-5 sm:p-7 flex items-start justify-between border-b border-slate-100 gap-4">
                <div className="flex items-start gap-4">
                  {(() => {
                    const ModalIcon = iconMap[selectedService.iconName] || Code2;
                    return (
                      <motion.div
                        initial={{ scale: 0.7, opacity: 0, rotate: -15 }}
                        animate={{ scale: 1, opacity: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 22, delay: 0.08 }}
                        className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200/80 text-[#C0622A] flex items-center justify-center shrink-0 shadow-xs"
                      >
                        <ModalIcon className="w-6 h-6 shrink-0" />
                      </motion.div>
                    );
                  })()}
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 }}
                      className="flex items-center gap-2 mb-1.5 flex-wrap"
                    >
                      <span className="px-2.5 py-0.5 rounded-full bg-teal-50 border border-teal-200/80 text-[#2E8B7A] text-[10px] font-mono font-bold uppercase tracking-wider whitespace-nowrap">
                        {selectedService.category}
                      </span>
                      <span className="font-mono text-xs font-bold text-slate-400 whitespace-nowrap">
                        Service {selectedService.num}
                      </span>
                      {selectedService.badge && (
                        <span className="px-2 py-0.5 rounded-full bg-orange-100/70 text-[#C0622A] text-[9px] font-mono font-bold uppercase whitespace-nowrap">
                          {selectedService.badge}
                        </span>
                      )}
                    </motion.div>
                    <motion.h3
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                      className="font-heading font-black text-2xl sm:text-3xl text-slate-950 tracking-tight leading-tight"
                    >
                      {selectedService.title}
                    </motion.h3>
                  </div>
                </div>

                <motion.button
                  whileHover={{ rotate: 90, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedService(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 shrink-0" />
                </motion.button>
              </div>

              {/* Modal Scrollable Content Feed (Pure Scroll Area) */}
              <div
                data-lenis-prevent="true"
                onWheel={(e) => e.stopPropagation()}
                onTouchMove={(e) => e.stopPropagation()}
                className="p-5 sm:p-7 overflow-y-auto overscroll-contain space-y-5 flex-1 min-h-0 touch-pan-y"
              >
                {/* 3D Visual Interactive Model Preview */}
                <Service3DVisual
                  serviceId={selectedService.id}
                  category={selectedService.category}
                  isModal
                  className="w-full h-36"
                />

                <motion.p
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.12 }}
                  className="text-slate-700 text-sm leading-relaxed"
                >
                  {selectedService.shortDescription}
                </motion.p>

                {/* Deliverables Scope */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.16 }}
                >
                  <h4 className="font-heading font-bold text-xs uppercase tracking-wider text-slate-900 mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#C0622A] shrink-0" />
                    <span className="whitespace-nowrap">Included Deliverables:</span>
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedService.deliverables.map((item, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.25, delay: 0.18 + i * 0.03 }}
                        className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-800 hover:bg-white hover:border-[#C0622A]/40 transition-colors"
                      >
                        <Check className="w-4 h-4 text-[#2E8B7A] shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* How This Sells Pitch */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.22 }}
                  className="p-4 sm:p-5 rounded-2xl bg-orange-50/80 border border-[#C0622A]/30 space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-[#C0622A] uppercase tracking-wider">
                    <Zap className="w-4 h-4 shrink-0" />
                    <span className="whitespace-nowrap">How This Sells For Your Business:</span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal">
                    {selectedService.howItSells}
                  </p>
                </motion.div>

                {/* SLA & Production Timeline */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35, delay: 0.26 }}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 leading-relaxed space-y-1"
                >
                  <div className="font-bold text-slate-800 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#2E8B7A] shrink-0" />
                    <span className="whitespace-nowrap">Execution &amp; Delivery:</span>
                  </div>
                  <p>
                    Engineered in recurring 14-day continuous sprints with dedicated Slack channel communication and direct access to senior engineers.
                  </p>
                </motion.div>
              </div>

              {/* Bottom Actions Bar (Fixed shrink-0) */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.28 }}
                className="shrink-0 p-5 sm:p-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div className="shrink-0">
                  <span className="text-[10px] font-mono uppercase font-bold text-slate-400 block whitespace-nowrap">
                    Monthly Retainer Rate
                  </span>
                  <span className="font-heading font-black text-2xl text-[#090D16] whitespace-nowrap">
                    ${selectedService.basePriceMonthly}
                    <span className="text-xs font-normal text-slate-500 whitespace-nowrap">/mo</span>
                  </span>
                  <span className="text-[11px] text-slate-500 block whitespace-nowrap">
                    {selectedService.pricingNote}
                  </span>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto shrink-0">
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    type="button"
                    onClick={() => handleBookService(selectedService)}
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#C0622A] hover:bg-[#a84f1d] text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:translate-y-0.5 cursor-pointer whitespace-nowrap shrink-0"
                  >
                    <span className="whitespace-nowrap">Get Started With This Service</span>
                    <ArrowRight className="w-4 h-4 shrink-0" />
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
