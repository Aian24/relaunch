"use client";

import React, { useState, useEffect } from "react";
import { useContactModal } from "@/context/ContactModalContext";
import { useScrollContext } from "./SmoothScrollProvider";
import { showSuccessSwal } from "@/utils/alerts";
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
  "Marketing & Advertising",
  "Brand & Design",
  "AI Services (AEO/GEO)",
  "Web & App Development",
  "Video & Content",
  "Email & SMS",
  "A full bundle",
  "Not sure yet",
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

  const [activeTab, setActiveTab] = useState<"form" | "ai-audit" | "calendar">(
    "form"
  );
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    business: "",
    interest: "A full bundle",
    message: "",
    preferredDate: "",
    preferredTime: "10:00 AM MST",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Sync options when modal opens
  useEffect(() => {
    if (isOpen) {
      if (options.intent === "ai-audit") {
        setActiveTab("ai-audit");
        setFormData((prev) => ({
          ...prev,
          interest: "AI Services (AEO/GEO)",
          message: options.notes || "I'd like to book an AI readiness audit for our business workflows.",
        }));
      } else if (options.intent === "strategy-session") {
        setActiveTab("calendar");
        setFormData((prev) => ({
          ...prev,
          interest: options.serviceInterest || "A full bundle",
          message: options.notes || "Booking a free strategy session to discuss marketing growth.",
        }));
      } else if (options.intent === "start-project") {
        setActiveTab("form");
        setFormData((prev) => ({
          ...prev,
          interest: options.serviceInterest || "Web & App Development",
          message: options.notes || "Ready to start a new project with ReLaunch.",
        }));
      } else {
        setActiveTab("form");
        if (options.serviceInterest) {
          setFormData((prev) => ({
            ...prev,
            interest: options.serviceInterest || "A full bundle",
          }));
        }
        if (options.notes) {
          setFormData((prev) => ({ ...prev, message: options.notes || "" }));
        }
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
    setIsSubmitting(true);

    // Simulate instant Google Calendar session confirmation
    setTimeout(async () => {
      setIsSubmitting(false);
      closeContactModal();

      if (activeTab === "calendar") {
        await showSuccessSwal(
          "Google Calendar Session Confirmed!",
          `Thanks, ${formData.name || "friend"}! Your strategy session is locked in for <strong>${formData.preferredDate || "your chosen date"} at ${formData.preferredTime}</strong>.<br><br>We sent an instant Google Calendar invite and Google Meet link to <strong>${formData.email}</strong>.`,
          `<strong>Focus:</strong> ${formData.interest} · <strong>Phone:</strong> ${formData.phone || "On file"}`
        );
      } else if (activeTab === "ai-audit") {
        await showSuccessSwal(
          "AI Audit Request Received!",
          `Thanks, ${formData.name || "friend"}! Our AI architecture team is reviewing ${formData.business || "your company"}'s profile. We will email your diagnostic roadmap to ${formData.email} within 1 business day.`,
          `<strong>Priority Track:</strong> AI & Automation Readiness · Phoenix, AZ`
        );
      } else {
        await showSuccessSwal(
          "Message Received!",
          `Thanks, ${formData.name || "friend"}! Your message is on its way. Our Phoenix team will reply to ${formData.email} within one business day.`,
          `<strong>Target Interest:</strong> ${formData.interest}`
        );
      }

      // Sync lead into ReLaunch Studio Admin Leads Storage
      try {
        const existingLeads = JSON.parse(localStorage.getItem("relaunch_admin_leads") || "[]");
        const newLeadEntry = {
          id: `LEAD-${Math.floor(1000 + Math.random() * 9000)}`,
          name: formData.name || "Website Visitor",
          email: formData.email,
          phone: formData.phone || "N/A",
          business: formData.business || "New Client",
          service: formData.interest,
          intent: activeTab === "calendar" ? "strategy-session" : activeTab === "ai-audit" ? "ai-audit" : "general",
          date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) + " " + new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }),
          status: activeTab === "calendar" ? "scheduled" : "new",
          budget: "$3,000 – $5,000 / mo",
          notes: activeTab === "calendar" ? `Booked Strategy Session for ${formData.preferredDate || "Selected Date"} at ${formData.preferredTime}. Message: ${formData.message || "None provided"}` : formData.message || "Inbound inquiry via website modal.",
          priority: "high",
          bookingDate: formData.preferredDate || "",
          bookingTime: formData.preferredTime || "10:00 AM MST",
          meetLink: activeTab === "calendar" ? `https://meet.google.com/rel-${Math.random().toString(36).substring(2, 7)}` : undefined,
          emailSubject: activeTab === "calendar" ? `Strategy Session Booking: ${formData.name}` : `Inbound Inquiry: ${formData.interest}`,
          isRead: false,
        };
        localStorage.setItem("relaunch_admin_leads", JSON.stringify([newLeadEntry, ...existingLeads]));
      } catch (err) {
        console.error("Failed to sync lead to admin storage", err);
      }

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        business: "",
        interest: "A full bundle",
        message: "",
        preferredDate: "",
        preferredTime: "10:00 AM MST",
      });
    }, 450);
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
            <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-orange-50 border border-orange-200/80 text-[#FF6700] text-[9.5px] font-mono font-bold uppercase tracking-widest mb-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6700]" />
              <span>
                {activeTab === "calendar"
                  ? "GOOGLE CALENDAR STRATEGY SESSION"
                  : "LET'S BUILD YOUR MISSION"}
              </span>
            </div>
            <h3 className="font-heading font-black text-lg sm:text-2xl text-slate-950 tracking-tight leading-tight">
              {activeTab === "calendar"
                ? "Grab a time that works."
                : activeTab === "ai-audit"
                ? "Request Your AI Readiness Audit"
                : "Tell Us About Your Business"}
            </h3>
            <p className="text-slate-500 text-[11px] sm:text-xs mt-0.5 max-w-lg font-normal">
              {activeTab === "calendar"
                ? "Pick a slot below — you'll get an instant Google Calendar confirmation."
                : "No pressure, no fluff. Just a clear roadmap tailored to your growth goals."}
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
                ? "text-[#FF6700]"
                : "text-slate-500 hover:text-[#090D16]"
            }`}
          >
            <Send className={`w-3.5 h-3.5 ${activeTab === "form" ? "text-[#FF6700]" : "text-slate-400"}`} />
            <span>Send a Message / Start Project</span>
            {activeTab === "form" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6700]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("ai-audit")}
            className={`relative py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "ai-audit"
                ? "text-[#FF6700]"
                : "text-slate-500 hover:text-[#090D16]"
            }`}
          >
            <Bot className={`w-3.5 h-3.5 ${activeTab === "ai-audit" ? "text-[#FF6700]" : "text-slate-400"}`} />
            <span>Book an AI Audit</span>
            {activeTab === "ai-audit" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6700]" />
            )}
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("calendar")}
            className={`relative py-2.5 sm:py-3 text-xs sm:text-sm font-bold flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
              activeTab === "calendar"
                ? "text-[#FF6700]"
                : "text-slate-500 hover:text-[#090D16]"
            }`}
          >
            <Calendar className={`w-3.5 h-3.5 ${activeTab === "calendar" ? "text-[#FF6700]" : "text-slate-400"}`} />
            <span>Live Calendar Slot</span>
            {activeTab === "calendar" && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6700]" />
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
                    Instant Google Calendar Confirmation (30 Min)
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
                    />
                  </div>

                  {/* Time Dropdown */}
                  <div>
                    <label className="block text-[10.5px] font-bold uppercase tracking-wider text-slate-700 mb-1">
                      Select Time (MST)
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
                    />
                  </div>
                </div>

                {/* Quick-Click Orange Time Slot Chips */}
                <div>
                  <div className="text-[9.5px] font-bold uppercase text-slate-600 mb-1">
                    Or Pick A Quick Available Time:
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
                {activeTab === "ai-audit"
                  ? "Tell us about your current tools or bottlenecks"
                  : "Message / Goals"}
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
                className="w-full flex items-center justify-center gap-2 px-5 py-3 bg-[#FF6700] hover:bg-[#E55C00] disabled:opacity-60 text-white font-heading font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md active:translate-y-0.5 cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Reserving Your Slot...</span>
                ) : (
                  <>
                    <span>
                      {activeTab === "calendar"
                        ? "Confirm Google Calendar Session Booking"
                        : activeTab === "ai-audit"
                        ? "Submit AI Audit Request"
                        : "Send Message / Start Project"}
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
              className="flex items-center justify-center sm:justify-start gap-1.5 text-xs font-semibold text-slate-700 hover:text-[#FF6700] transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-[#2E8B7A] shrink-0" />
              <span>care@relaunch.us</span>
            </a>

            <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>Phoenix, AZ · Est. 2004</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    )}
  </AnimatePresence>
  );
}
