"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import CtaBanner from "@/components/CtaBanner";
import PageVideoHero from "@/components/PageVideoHero";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import {
  ArrowUpRight,
  ArrowRight,
  TrendingUp,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

const caseStudies = [
  {
    id: "turflife",
    title: "TurfLife",
    category: "Web & Performance Ads",
    filter: "web",
    location: "Phoenix, AZ",
    image: "/showcase/turflife.jpg",
    headline: "Scaling Inbound Commercial Turf Inquiries by 240%",
    summary:
      "Engineered an ultra-fast Next.js digital experience paired with high-intent Google Search campaigns and local map-pack dominance.",
    results: [
      { label: "Inbound Leads", value: "+240%" },
      { label: "Cost Per Acquisition", value: "-42%" },
      { label: "Page Speed Score", value: "99/100" },
    ],
    tags: ["Next.js", "Google Ads", "Local SEO", "Lead Automation"],
  },
  {
    id: "carmen-hotel",
    title: "Carmen Hotel Collection",
    category: "Brand & Web Experience",
    filter: "brand",
    location: "Playa del Carmen / Scottsdale",
    image: "/showcase/carmen_hotel.jpg",
    headline: "Luxury Boutique Hospitality Rebrand & Direct Booking Engine",
    summary:
      "Transformed boutique hotel positioning with editorial visual identity, custom booking portal, and paid social guest acquisition.",
    results: [
      { label: "Direct Bookings", value: "+180%" },
      { label: "OTA Commission Saved", value: "$120k/yr" },
      { label: "Mobile Conversion", value: "4.2%" },
    ],
    tags: ["Brand Identity", "Booking Portal", "Meta Ads", "Content Production"],
  },
  {
    id: "volcano-resort",
    title: "Volcano Rainforest Retreat",
    category: "Full-Funnel Growth",
    filter: "web",
    location: "Hawaii",
    image: "/showcase/volcano_resort.jpg",
    headline: "High-Ticket Destination Retreat Marketing & Booking Engine",
    summary:
      "Crafted an immersive visual storytelling platform with automated guest inquiry pipelines and seasonal dynamic pricing.",
    results: [
      { label: "Seasonal Occupancy", value: "94%" },
      { label: "Average Order Value", value: "+35%" },
      { label: "Organic Search Lift", value: "3.2x" },
    ],
    tags: ["Visual Storytelling", "SEO Strategy", "Email Automation", "Web Design"],
  },
  {
    id: "chicago-dog",
    title: "Chicago Dog House",
    category: "Local SEO & Social Autopilot",
    filter: "growth",
    location: "Phoenix Metro",
    image: "/showcase/chicago_dog.jpg",
    headline: "Dominating Local Search & Autonomous Weekly Social Content",
    summary:
      "Automated multi-channel social distribution, Google Map-Pack #1 ranking, and high-converting local promotions.",
    results: [
      { label: "Google Map Views", value: "+310%" },
      { label: "Foot Traffic Lift", value: "+28%" },
      { label: "Weekly Social Posts", value: "12 / wk" },
    ],
    tags: ["Local SEO", "Social Autopilot", "Review Engine", "Video Shorts"],
  },
  {
    id: "aspiration-bank",
    title: "Aspiration Green Finance",
    category: "Custom Software & UX",
    filter: "software",
    location: "Los Angeles / Phoenix",
    image: "/showcase/aspiration_bank.jpg",
    headline: "Enterprise Financial Platform UI & Compliance Infrastructure",
    summary:
      "Architected secure, responsive dashboard interfaces for sustainable banking products with zero downtime.",
    results: [
      { label: "User Onboarding Dropoff", value: "-35%" },
      { label: "System Uptime", value: "99.99%" },
      { label: "SOC2 Compliance", value: "100%" },
    ],
    tags: ["React / TypeScript", "Financial UX", "API Integration", "Security"],
  },
  {
    id: "ehr-migration",
    title: "Healthcare EHR Intelligence",
    category: "AI & Custom Software",
    filter: "software",
    location: "Scottsdale Healthcare Network",
    image: "/showcase/ehr_migration.jpg",
    headline: "AI-Assisted Patient Workflow Migration & Clinical Analytics",
    summary:
      "Engineered automated clinical data harmonization pipeline processing over 450,000 patient records seamlessly.",
    results: [
      { label: "Records Migrated", value: "450k+" },
      { label: "Processing Time", value: "-80%" },
      { label: "Data Integrity", value: "100%" },
    ],
    tags: ["AI Pipeline", "Data Migration", "Healthcare HIPAA", "Automation"],
  },
];

const filterCategories = [
  { id: "all", label: "All Projects" },
  { id: "web", label: "Web & Digital" },
  { id: "brand", label: "Brand Strategy" },
  { id: "software", label: "Custom Software & AI" },
  { id: "growth", label: "Growth & Local SEO" },
];

export default function WorkPage() {
  const { openContactModal } = useContactModal();
  const [activeFilter, setActiveFilter] = useState("all");

  const filteredStudies =
    activeFilter === "all"
      ? caseStudies
      : caseStudies.filter((item) => item.filter === activeFilter);

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Cinematic Work Video Hero */}
      <PageVideoHero
        kicker="Proven Client Impact · Est. 2004"
        titleRegular="Our Work &"
        titleHighlight="Proven Outcomes."
        description="Over 1,500 projects delivered across 22+ years. We partner with ambitious local businesses, growing brands, and enterprise teams to engineer decisive market results."
        videoSrc="/ourwork.mp4"
        posterSrc="/hero_frames/frame_000.webp"
        primaryCtaText="Start a Project"
        primaryCtaIntent="strategy-session"
        secondaryCtaText="Browse Case Studies"
        secondaryCtaTargetId="case-studies-gallery"
        scrollTargetId="case-studies-gallery"
      />

      {/* 2. Portfolio Gallery Grid with Filter Pills & Staggered Scroll-Up Animations */}
      <section id="case-studies-gallery" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Category Filter Pills */}
        <MotionWrapper direction="up" distance={20} className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-14">
          {filterCategories.map((cat) => {
            const isSelected = activeFilter === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveFilter(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all cursor-pointer ${
                  isSelected
                    ? "bg-[#C0622A] text-white shadow-md"
                    : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200/80"
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </MotionWrapper>
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          <AnimatePresence>
            {filteredStudies.map((study, idx) => (
              <MotionWrapper key={study.id} direction="up" delay={idx * 0.07} distance={30}>
                <div
                  className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all h-full"
                >
                  {/* Image Container with Hover Animation */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <Image
                      src={study.image}
                      alt={study.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-106"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                    
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider font-semibold border border-white/20">
                        {study.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88C52] block mb-0.5">
                        {study.location}
                      </span>
                      <h3 className="font-heading font-black text-xl sm:text-2xl">
                        {study.title}
                      </h3>
                    </div>
                  </div>

                  {/* Content Details */}
                  <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                    <div>
                      <h4 className="font-heading font-bold text-base sm:text-lg text-[#090D16] mb-2 leading-snug">
                        {study.headline}
                      </h4>
                      <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                        {study.summary}
                      </p>

                      {/* Results Metrics */}
                      <div className="grid grid-cols-3 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200/80 mb-6">
                        {study.results.map((res) => (
                          <div key={res.label} className="text-center">
                            <div className="font-heading font-black text-base sm:text-lg text-[#C0622A]">
                              {res.value}
                            </div>
                            <div className="text-[10px] text-slate-500 uppercase font-mono tracking-wider mt-0.5 leading-tight">
                              {res.label}
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mb-6">
                        {study.tags.map((tag) => (
                          <span
                            key={tag}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-mono font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                      <span className="text-xs text-slate-500 font-medium">Ready for similar growth?</span>
                      <button
                        type="button"
                        onClick={() => openContactModal({ intent: "strategy-session", notes: `Inquiry inspired by ${study.title} case study.` })}
                        className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] transition-colors cursor-pointer group/btn"
                      >
                        <span>Inquire Now</span>
                        <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                      </button>
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 3. Bottom CTA Banner */}
      <CtaBanner />

      {/* 4. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
