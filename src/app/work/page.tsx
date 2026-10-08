"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
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
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Sparkles,
  Layers,
  CheckCircle2,
  Eye,
  SlidersHorizontal,
} from "lucide-react";

interface GalleryImage {
  url: string;
  caption: string;
}

interface CaseStudy {
  id: string;
  title: string;
  category: string;
  filter: string;
  location: string;
  gallery: GalleryImage[];
  headline: string;
  summary: string;
  results: { label: string; value: string }[];
  tags: string[];
}

const caseStudies: CaseStudy[] = [
  {
    id: "turflife",
    title: "TurfLife",
    category: "Web & Performance Ads",
    filter: "web",
    location: "Phoenix, AZ",
    gallery: [
      {
        url: "/showcase/turflife.jpg",
        caption: "Commercial synthetic turf installation in Scottsdale with luxury architectural landscaping",
      },
      {
        url: "/showcase/turflife_2.jpg",
        caption: "Custom residential putting green with pristine desert mountain backdrop",
      },
      {
        url: "/showcase/turflife_3.jpg",
        caption: "High-converting Next.js web application and Google Ads lead capture dashboard",
      },
    ],
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
    gallery: [
      {
        url: "/showcase/carmen_hotel.jpg",
        caption: "Playa del Carmen luxury boutique beachfront hotel and hospitality rebrand",
      },
      {
        url: "/showcase/carmen_hotel_2.jpg",
        caption: "Ocean-view rooftop infinity pool at golden hour sunset with ambient deck lighting",
      },
      {
        url: "/showcase/carmen_hotel_3.jpg",
        caption: "Bespoke gold-embossed brand collateral, keycard, and mobile direct booking engine",
      },
    ],
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
    gallery: [
      {
        url: "/showcase/volcano_resort.jpg",
        caption: "Volcano Rainforest Retreat destination overview in lush tropical Hawaii",
      },
      {
        url: "/showcase/volcano_resort_2.jpg",
        caption: "Secluded luxury eco-treehouse villa surrounded by giant fern trees and volcanic mist",
      },
      {
        url: "/showcase/volcano_resort_3.jpg",
        caption: "Private steaming volcanic basalt stone soaking tub under evening jungle canopy",
      },
    ],
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
    gallery: [
      {
        url: "/showcase/chicago_dog.jpg",
        caption: "Chicago Dog House fast-casual brand identity and multi-channel marketing",
      },
      {
        url: "/showcase/chicago_dog_2.jpg",
        caption: "Artisanal Chicago-style hot dog loaded with green relish, sport peppers, and crispy fries",
      },
      {
        url: "/showcase/chicago_dog_3.jpg",
        caption: "Vibrant restaurant dining counter with glowing neon signage and high foot traffic",
      },
    ],
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
    gallery: [
      {
        url: "/showcase/aspiration_bank.jpg",
        caption: "Aspiration green finance web platform and enterprise security architecture",
      },
      {
        url: "/images/service-software.jpg",
        caption: "Ultra-fast Next.js engineering, client dashboard UX, and SOC2 compliance API",
      },
      {
        url: "/images/digital-studio.jpg",
        caption: "Modern digital analytics workstation and sustainable onboarding user experience",
      },
    ],
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
    gallery: [
      {
        url: "/showcase/ehr_migration.jpg",
        caption: "Scottsdale Healthcare EHR intelligence and clinical data migration platform",
      },
      {
        url: "/images/ai-engineering.jpg",
        caption: "AI-assisted clinical analytics, data harmonization pipeline, and HIPAA security",
      },
      {
        url: "/images/service-ai.jpg",
        caption: "Specialist diagnostic workstation displaying automated patient workflow intelligence",
      },
    ],
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

  // Lightbox Modal State
  const [activeModalStudy, setActiveModalStudy] = useState<CaseStudy | null>(null);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Active preview image index per card
  const [cardImageIndices, setCardImageIndices] = useState<Record<string, number>>({});

  const getCardImageIndex = (id: string) => cardImageIndices[id] || 0;

  const setCardImage = (id: string, index: number, total: number) => {
    const safeIndex = (index + total) % total;
    setCardImageIndices((prev) => ({ ...prev, [id]: safeIndex }));
  };

  const openModalGallery = (study: CaseStudy, initialIndex = 0) => {
    setActiveModalStudy(study);
    setModalImageIndex(initialIndex);
  };

  const closeModalGallery = () => {
    setActiveModalStudy(null);
  };

  const nextModalImage = useCallback(() => {
    if (!activeModalStudy) return;
    setModalImageIndex((prev) => (prev + 1) % activeModalStudy.gallery.length);
  }, [activeModalStudy]);

  const prevModalImage = useCallback(() => {
    if (!activeModalStudy) return;
    setModalImageIndex((prev) => (prev - 1 + activeModalStudy.gallery.length) % activeModalStudy.gallery.length);
  }, [activeModalStudy]);

  // Keyboard navigation for lightbox modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeModalStudy) return;
      if (e.key === "ArrowRight") nextModalImage();
      if (e.key === "ArrowLeft") prevModalImage();
      if (e.key === "Escape") closeModalGallery();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeModalStudy, nextModalImage, prevModalImage]);

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

      {/* 2. Portfolio Gallery Grid with Interactive Multi-Photo Showcase */}
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

        {/* Case Studies Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10">
          <AnimatePresence>
            {filteredStudies.map((study, idx) => {
              const currentImgIdx = getCardImageIndex(study.id);
              const currentImg = study.gallery[currentImgIdx] || study.gallery[0];
              const totalImgs = study.gallery.length;

              return (
                <MotionWrapper key={study.id} direction="up" delay={idx * 0.07} distance={30}>
                  <div className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] transition-all h-full">
                    {/* Interactive Multi-Image Gallery Card Header */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 select-none">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={currentImg.url}
                          initial={{ opacity: 0, scale: 1.04 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                          className="relative w-full h-full cursor-pointer"
                          onClick={() => openModalGallery(study, currentImgIdx)}
                        >
                          <Image
                            src={currentImg.url}
                            alt={currentImg.caption}
                            fill
                            priority={idx < 2}
                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        </motion.div>
                      </AnimatePresence>

                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 z-10">
                        <span className="px-3 py-1 rounded-full bg-black/65 backdrop-blur-md text-white text-[10px] font-mono uppercase tracking-wider font-semibold border border-white/20">
                          {study.category}
                        </span>
                      </div>

                      {/* Left / Right Quick Image Flip Buttons on Hover */}
                      <div className="absolute inset-y-0 left-2 flex items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardImage(study.id, currentImgIdx - 1, totalImgs);
                          }}
                          className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-transform active:scale-90 cursor-pointer"
                          title="Previous image"
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="absolute inset-y-0 right-2 flex items-center z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setCardImage(study.id, currentImgIdx + 1, totalImgs);
                          }}
                          className="w-8 h-8 rounded-full bg-black/60 hover:bg-black/90 backdrop-blur-md text-white flex items-center justify-center border border-white/20 transition-transform active:scale-90 cursor-pointer"
                          title="Next image"
                        >
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* Bottom Info & Thumbnail Dots */}
                      <div className="absolute bottom-3 left-4 right-4 z-10 flex items-end justify-between">
                        <div className="text-white pr-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#E88C52] block mb-0.5 font-bold">
                            {study.location}
                          </span>
                          <h3 className="font-heading font-black text-lg sm:text-xl drop-shadow-sm">
                            {study.title}
                          </h3>
                        </div>

                        {/* Interactive Photo Switcher Dots */}
                        <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-full border border-white/20 shrink-0">
                          {study.gallery.map((_, dotIdx) => (
                            <button
                              key={dotIdx}
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setCardImage(study.id, dotIdx, totalImgs);
                              }}
                              className={`h-2 rounded-full transition-all cursor-pointer ${
                                dotIdx === currentImgIdx
                                  ? "w-5 bg-[#E88C52]"
                                  : "w-2 bg-white/40 hover:bg-white/80"
                              }`}
                              title={`View photo ${dotIdx + 1}`}
                            />
                          ))}
                        </div>
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
                          onClick={() =>
                            openContactModal({
                              intent: "strategy-session",
                              notes: `Inquiry inspired by ${study.title} case study.`,
                            })
                          }
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] transition-colors cursor-pointer group/btn"
                        >
                          <span>Inquire Now</span>
                          <ArrowUpRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
                        </button>
                      </div>
                    </div>
                  </div>
                </MotionWrapper>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 3. Interactive Full-Screen Lightbox Gallery Modal */}
      <AnimatePresence>
        {activeModalStudy && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col justify-between p-4 sm:p-6 md:p-8"
            onClick={closeModalGallery}
          >
            {/* Modal Top Header Bar */}
            <div
              className="max-w-6xl mx-auto w-full flex items-center justify-between text-white pb-4 border-b border-white/10 z-20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#C0622A] text-white text-[10px] font-mono uppercase font-bold tracking-wider">
                  {activeModalStudy.category}
                </span>
                <div>
                  <h3 className="font-heading font-black text-lg sm:text-xl text-white">
                    {activeModalStudy.title}
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">
                    {activeModalStudy.location} · {modalImageIndex + 1} of {activeModalStudy.gallery.length}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    const s = activeModalStudy;
                    closeModalGallery();
                    openContactModal({
                      intent: "strategy-session",
                      notes: `Inquiry from full gallery view: ${s.title}`,
                    });
                  }}
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#C0622A] hover:bg-[#a84f1d] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
                >
                  <span>Inquire About Project</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={closeModalGallery}
                  className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
                  title="Close gallery (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Center Showcase View with Animated Transitions */}
            <div
              className="max-w-5xl mx-auto w-full flex-1 flex items-center justify-center relative py-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Prev Button */}
              <button
                type="button"
                onClick={prevModalImage}
                className="absolute left-2 sm:-left-6 lg:-left-12 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95"
                title="Previous image (Left Arrow)"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              {/* Main Image Frame */}
              <div className="relative w-full h-[55vh] sm:h-[65vh] rounded-2xl sm:rounded-3xl overflow-hidden bg-black/60 border border-white/10 shadow-2xl flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeModalStudy.gallery[modalImageIndex].url}
                    initial={{ opacity: 0, scale: 0.96 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    className="relative w-full h-full"
                  >
                    <Image
                      src={activeModalStudy.gallery[modalImageIndex].url}
                      alt={activeModalStudy.gallery[modalImageIndex].caption}
                      fill
                      priority
                      className="object-contain sm:object-cover"
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Floating Caption Overlay */}
                <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white">
                  <p className="font-heading font-medium text-xs sm:text-sm text-slate-200 max-w-3xl">
                    {activeModalStudy.gallery[modalImageIndex].caption}
                  </p>
                </div>
              </div>

              {/* Next Button */}
              <button
                type="button"
                onClick={nextModalImage}
                className="absolute right-2 sm:-right-6 lg:-right-12 z-20 w-11 h-11 rounded-full bg-black/60 hover:bg-black/90 border border-white/20 text-white flex items-center justify-center transition-all cursor-pointer shadow-2xl hover:scale-105 active:scale-95"
                title="Next image (Right Arrow)"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Bottom Thumbnail Strip */}
            <div
              className="max-w-6xl mx-auto w-full pt-3 border-t border-white/10 flex items-center justify-center gap-3 z-20 overflow-x-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {activeModalStudy.gallery.map((img, thumbIdx) => (
                <button
                  key={thumbIdx}
                  type="button"
                  onClick={() => setModalImageIndex(thumbIdx)}
                  className={`relative w-20 sm:w-24 h-12 sm:h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    thumbIdx === modalImageIndex
                      ? "border-[#E88C52] scale-105 shadow-[0_0_15px_rgba(232,140,82,0.5)]"
                      : "border-white/20 opacity-50 hover:opacity-100"
                  }`}
                >
                  <Image
                    src={img.url}
                    alt={img.caption}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Bottom CTA Banner */}
      <CtaBanner />

      {/* 5. Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
