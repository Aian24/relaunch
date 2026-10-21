"use client";

import React, { useState, useEffect } from "react";
import { useContactModal } from "@/context/ContactModalContext";
import { useScrollContext } from "./SmoothScrollProvider";
import { showErrorSwal, showSuccessSwal } from "@/utils/alerts";
import CustomSelect from "./CustomSelect";
import CustomDatePicker from "./CustomDatePicker";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Calendar,
  Send,
  Phone,
  Mail,
  MapPin,
  Clock,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Bot,
  Video,
} from "lucide-react";

const serviceOptions = [
  "Not sure yet",
  "Get Found",
  "Get Chosen",
  "Get More Customers",
  "Build Something Custom",
  "AI Recommendations",
  "ReLaunch Social",
  "ReLaunch Studio",
  "Social Audit",
  "A bundle of services",
];

const availableTimeSlots = [
  "09:00 AM MST",
  "10:00 AM MST",
  "11:30 AM MST",
  "01:00 PM MST",
  "02:30 PM MST",
  "04:00 PM MST",
];

export default function ContactModal() {
  const { isOpen, options, closeContactModal } = useContactModal();
  const { stopScroll, startScroll } = useScrollContext();

  const [activeTab, setActiveTab] = useState<"form" | "calendar">("calendar");
  const [website, setWebsite] = useState(""); // honeypot: real visitors never fill this
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    interest: "Not sure yet",
    message: "",
    preferredDate: "",
    preferredTime: "10:00 AM MST",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync options when modal opens
  useEffect(() => {
    if (isOpen) {
      const prefill = options.prefill || {};
      if (options.intent === "strategy-session" || options.intent === "ai-audit") {
        setActiveTab("calendar");
        setFormData((prev) => ({
          ...prev,
          name: prefill.name !== undefined ? prefill.name : prev.name,
          email: prefill.email !== undefined ? prefill.email : prev.email,
          phone: prefill.phone !== undefined ? prefill.phone : prev.phone,
          business: prefill.business !== undefined ? prefill.business : prev.business,
          interest: options.serviceInterest || "Not sure yet",
          message: options.notes || "",
        }));
      } else if (options.intent === "start-project") {
        setActiveTab("form");
        setFormData((prev) => ({
          ...prev,
          name: prefill.name !== undefined ? prefill.name : prev.name,
          email: prefill.email !== undefined ? prefill.email : prev.email,
          phone: prefill.phone !== undefined ? prefill.phone : prev.phone,
          business: prefill.business !== undefined ? prefill.business : prev.business,
          interest: options.serviceInterest || "Web & App Development",
          message: options.notes || "Ready to start a new project with ReLaunch.",
        }));
      } else if (options.intent === "enterprise-inquiry") {
        setActiveTab("form");
        setFormData((prev) => ({
          ...prev,
          name: prefill.name !== undefined ? prefill.name : prev.name,
          email: prefill.email !== undefined ? prefill.email : prev.email,
          phone: prefill.phone !== undefined ? prefill.phone : prev.phone,
          business: prefill.business !== undefined ? prefill.business : prev.business,
          interest: options.serviceInterest || "Enterprise & Custom Software",
          message: options.notes || "Inquiring about enterprise software development, architectural review, or RFP.",
        }));
      } else {
        setActiveTab("form");
        setFormData((prev) => ({
          ...prev,
          name: prefill.name !== undefined ? prefill.name : prev.name,
          email: prefill.email !== undefined ? prefill.email : prev.email,
          phone: prefill.phone !== undefined ? prefill.phone : prev.phone,
          business: prefill.business !== undefined ? prefill.business : prev.business,
          ...(options.serviceInterest ? { interest: options.serviceInterest } : {}),
          ...(options.notes ? { message: options.notes } : {}),
        }));
      }
    }
  }, [isOpen, options]);

  // Handle ESC key and body/html scroll lock + Lenis pause
  useEffect(() => {
    if (isOpen) {
      stopScroll();
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          closeContactModal();
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
  }, [isOpen, closeContactModal, stopScroll, startScroll]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: activeTab === "calendar" ? "strategy-call" : "message",
          ...formData,
          website,
          page: typeof window !== "undefined" ? window.location.pathname : "",
        }),
      });
      if (!res.ok) throw new Error(`Request failed (${res.status})`);

      setIsSubmitting(false);
      closeContactModal();

      if (activeTab === "calendar") {
        await showSuccessSwal(
          "Request received!",
          `Thanks, ${formData.name || "there"}! We got your strategy call request${formData.preferredDate ? ` for <strong>${formData.preferredDate} at ${formData.preferredTime}</strong>` : ""}.<br><br>We'll email <strong>${formData.email}</strong> within one business day to confirm the time.`,
          `<strong>Topic:</strong> ${formData.interest}`
        );
      } else {
        await showSuccessSwal(
          "Message sent!",
          `Thanks, ${formData.name || "there"}! We'll reply to <strong>${formData.email}</strong> within one business day.`,
          `<strong>Topic:</strong> ${formData.interest}`
        );
      }

      setFormData({
        name: "",
        email: "",
        phone: "",
        business: "",
        interest: "Not sure yet",
        message: "",
        preferredDate: "",
        preferredTime: "10:00 AM MST",
      });
    } catch (err) {
      setIsSubmitting(false);
      await showErrorSwal(
        "That didn't go through",
        "Your request couldn't be sent. Please try again, or call (480) 779-9875 or email care@relaunch.us."
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          key="contact-modal-portal"
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="fixed inset-0 z-[999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto overscroll-contain"
        >
          {/* Soft Frosted Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            onClick={closeContactModal}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity cursor-pointer"
          />

          {/* Modal Dialog Container with Apple-Style Spring Physics */}
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 35, filter: "blur(6px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 25, filter: "blur(6px)" }}
            transition={{ type: "spring", stiffness: 360, damping: 28, mass: 0.85 }}
            onClick={(e) => e.stopPropagation()}
            data-lenis-prevent="true"
            onWheel={(e) => e.stopPropagation()}
            onTouchMove={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 max-h-[88vh] flex flex-col my-auto"
          >
        {/* Modal Header */}
        <div className="shrink-0 bg-white text-slate-900 p-5 sm:p-6 flex items-start justify-between border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-purple-50 border border-purple-200/80 text-[#7F48ED] text-[9.5px] font-mono font-bold uppercase tracking-widest mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#7F48ED]" />
              <span>
                {activeTab === "calendar"
                  ? "FREE 30-MINUTE STRATEGY CALL"
                  : "CONTACT RELAUNCH"}
              </span>
            </div>
            <h3 className="font-heading font-black text-lg sm:text-2xl text-slate-950 tracking-tight leading-tight">
              {activeTab === "calendar"
                ? "Pick a time that works."
                : "Tell us about your business."}
            </h3>
            <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5 max-w-lg font-normal">
              {activeTab === "calendar"
                ? "Choose a preferred day and time. We'll email you within one business day to confirm."
                : "Send us a note and we'll reply within one business day."}
            </p>
          </div>

          <button
            onClick={closeContactModal}
            className="p-1.5 sm:p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 transition-colors shrink-0 cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="shrink-0 bg-white px-4 sm:px-6 border-b border-slate-200 flex items-center gap-4 sm:gap-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab("form")}
            className={`relative py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "form"
                ? "text-[#7F48ED]"
                : "text-slate-500 hover:text-[#090D16]"
            }`}
          >
            <Send className={`w-3.5 h-3.5 ${activeTab === "form" ? "text-[#7F48ED]" : "text-slate-400"}`} />
            <span>Send a message</span>
            {activeTab === "form" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7F48ED]" />
            )}
          </button>


          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`relative py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "calendar"
                ? "text-[#7F48ED]"
                : "text-slate-500 hover:text-[#090D16]"
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${activeTab === "calendar" ? "text-[#7F48ED]" : "text-slate-400"}`} />
            <span>Request a strategy call</span>
            {activeTab === "calendar" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#7F48ED]" />
            )}
          </button>
        </div>

        {/* Modal Body / Form */}
        <div
          data-lenis-prevent="true"
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          className="p-4 sm:p-5 overflow-y-auto overscroll-contain flex-1 min-h-0 touch-pan-y"
        >
          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Honeypot: hidden from people, catches spam bots */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              className="hidden"
              aria-hidden="true"
            />
            {/* 2-Column Row: Name & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Full Name <span className="text-[#FF6700]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  placeholder="Jane Smith"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#FF6700] focus:ring-2 focus:ring-[#FF6700]/15 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Work Email <span className="text-[#FF6700]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="jane@business.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#FF6700] focus:ring-2 focus:ring-[#FF6700]/15 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* 2-Column Row: Phone & Business Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="480-779-9875"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#FF6700] focus:ring-2 focus:ring-[#FF6700]/15 focus:outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Business / Company Name
                </label>
                <input
                  type="text"
                  name="business"
                  placeholder="Your Company LLC"
                  value={formData.business}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#FF6700] focus:ring-2 focus:ring-[#FF6700]/15 focus:outline-none transition-all"
                />
              </div>
            </div>

            {/* Service Interest Selector */}
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                What do you need help with?
              </label>
              <CustomSelect
                name="interest"
                value={formData.interest}
                onChange={(val) =>
                  setFormData((prev) => ({ ...prev, interest: val }))
                }
                options={serviceOptions}
              />
            </div>

            {/* Calendar-Specific Google Calendar Schedule Section */}
            {activeTab === "calendar" && (
              <div className="p-3 sm:p-4 bg-orange-50/70 rounded-2xl border border-[#FF6700]/30 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900">
                    Preferred time (30 minutes)
                  </span>
                  <span className="text-[9.5px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FF6700] text-white">
                    Free Session
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Custom Brand Orange Date Picker */}
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Choose Date
                    </label>
                    <CustomDatePicker
                      value={formData.preferredDate}
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferredDate: val,
                        }))
                      }
                      placeholder="Select Session Date"
                      theme="orange"
                    />
                  </div>

                  {/* Time Dropdown */}
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Time (Arizona, MST)
                    </label>
                    <CustomSelect
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={(val) =>
                        setFormData((prev) => ({
                          ...prev,
                          preferredTime: val,
                        }))
                      }
                      options={availableTimeSlots}
                      theme="orange"
                    />
                  </div>
                </div>

                {/* Quick-Click Orange Time Slot Chips */}
                <div>
                  <div className="text-[9.5px] font-bold uppercase text-slate-600 mb-1">
                    Quick pick:
                  </div>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-1.5">
                    {availableTimeSlots.map((slot) => {
                      const isSelected = formData.preferredTime === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() =>
                            setFormData((prev) => ({
                              ...prev,
                              preferredTime: slot,
                            }))
                          }
                          className={`py-1 px-1 rounded-lg text-[10px] font-bold text-center transition-all cursor-pointer truncate ${
                            isSelected
                              ? "bg-[#FF6700] text-white shadow-xs font-black"
                              : "bg-white text-slate-700 border border-orange-200/80 hover:border-[#FF6700] hover:bg-orange-50"
                          }`}
                        >
                          {slot.replace(" MST", "")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Message / Goals */}
            <div>
              <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                What's going on? (optional)
              </label>
              <textarea
                rows={2}
                name="message"
                placeholder="A few sentences about your business goals, timeline, or current challenges..."
                value={formData.message}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:border-[#FF6700] focus:ring-2 focus:ring-[#FF6700]/15 focus:outline-none transition-all resize-none"
              />
            </div>

            {/* Bottom Submit Action */}
            <div className="pt-1">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#FF6700] hover:bg-[#E55C00] disabled:opacity-60 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-[0_4px_20px_rgba(255,103,0,0.25)] active:translate-y-0.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>
                      {activeTab === "calendar"
                        ? "Request my strategy call"
                        : "Send message"}
                    </span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Direct Quick Contact Bar */}
          <div className="mt-3.5 pt-3 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-center sm:text-left">
            <a
              href="tel:4807799875"
              className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#FF6700] transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-[#FF6700] shrink-0" />
              <span>(480) 779-9875</span>
            </a>

            <a
              href="mailto:care@relaunch.us"
              className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#7F48ED] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#7F48ED] shrink-0" />
              <span>care@relaunch.us</span>
            </a>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Fully Remote · Since 2008</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    )}
  </AnimatePresence>
  );
}
