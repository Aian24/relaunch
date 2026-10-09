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
import BrandsHelpedSection from "@/components/BrandsHelpedSection";
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
    category: "Brand Movement & E-Commerce",
    filter: "brand",
    location: "Winter Springs, FL / Scottsdale, AZ",
    gallery: [
      {
        url: "/showcase/turflife_real_1.png",
        caption: "Protect Your Turf national golf and athletic lifestyle brand movement",
      },
      {
        url: "/showcase/turflife_real_5.png",
        caption: "Custom apparel e-commerce storefront and national community hub",
      },
      {
        url: "/showcase/turflife_real_2.png",
        caption: "High-converting digital experience and automated lead capture engine",
      },
    ],
    headline: "Building a National Turf Sports & Lifestyle Brand from Scratch",
    summary:
      "Partnered with Golf Central Magazine's founder to build a national lifestyle movement competing head-to-head with Salt Life—creating the website, social presence, and national recognition across golf and turf sports.",
    results: [
      { label: "Community Growth", value: "+240%" },
      { label: "Inbound Pipeline", value: "3.8x" },
      { label: "National Reach", value: "50 States" },
    ],
    tags: ["Brand Strategy", "E-Commerce", "Community", "Lead Automation"],
  },
  {
    id: "carmen-hotel",
    title: "Carmen Hotel Collection",
    category: "Brand & Direct Booking Engine",
    filter: "brand",
    location: "Playa del Carmen, Mexico",
    gallery: [
      {
        url: "/showcase/carmen_hotel_real_1.jpg",
        caption: "Playa del Carmen luxury beachfront boutique hotel guest experience",
      },
      {
        url: "/showcase/carmen_hotel_real_2.jpg",
        caption: "Ocean-view rooftop pool at golden hour and luxury hospitality social campaigns",
      },
      {
        url: "/showcase/carmen_hotel_real_4.png",
        caption: "Direct booking promotional campaign, ad creative testing, and booking portal",
      },
    ],
    headline: "Luxury Boutique Hospitality Rebrand & Direct Booking Engine",
    summary:
      "Developed and executed full social media marketing strategy, ad design and testing, and community management for the Carmen Hotel in Quintana Roo, Mexico—reducing OTA reliance and lifting direct bookings.",
    results: [
      { label: "Direct Bookings", value: "+15%" },
      { label: "Follower Growth", value: "10k New" },
      { label: "OTA Commission Saved", value: "$120k/yr" },
    ],
    tags: ["Hospitality Marketing", "Social Ads", "Direct Booking", "Content Production"],
  },
  {
    id: "jacksonville",
    title: "City of Jacksonville",
    category: "Government Enterprise Architecture",
    filter: "software",
    location: "Duval County, FL",
    gallery: [
      {
        url: "/showcase/jacksonville_real_1.jpg",
        caption: "City of Jacksonville Duval County property appraisal records system and entity network framework",
      },
      {
        url: "/showcase/jacksonville_real_3.png",
        caption: "Enterprise architectural database modernization replacing 1998 legacy public records system",
      },
      {
        url: "/showcase/jacksonville_real_4.png",
        caption: "Modernized architectural record portal delivered a full month earlier than agreed deadline",
      },
    ],
    headline: "Modernizing Municipal Property Records for 450,000+ Citizens",
    summary:
      "Awarded county bid to engineer modern Entity Network Framework for property appraisals, land records, and inter-departmental data sync—debugged and delivered a full month ahead of schedule.",
    results: [
      { label: "Delivery Time", value: "1 Mo Early" },
      { label: "Citizen Reach", value: "450k+" },
      { label: "Contract Value", value: "$65,000" },
    ],
    tags: ["Enterprise Software", "Entity Framework", "Government", "Public Records"],
  },
  {
    id: "swing-perfect",
    title: "Swing Perfect (Golf Tech)",
    category: "Proprietary Mobile App & Kinematics",
    filter: "software",
    location: "Scottsdale / National",
    gallery: [
      {
        url: "/showcase/swing_perfect_real_1.png",
        caption: "Swing Perfect proprietary mobile application interpreting handwriting metrics and swing dynamics",
      },
      {
        url: "/showcase/swing_perfect_real_2.png",
        caption: "Kinematic data visualization screen showing swing tempo, clubface angle, and performance tracking",
      },
      {
        url: "/showcase/swing_perfect_real_4.png",
        caption: "Successful acquisition milestone: intellectual property and application acquired by Golf Galaxy",
      },
    ],
    headline: "Patented Swing Analysis Mobile App Acquired by Golf Galaxy",
    summary:
      "Engineered an innovative cross-platform mobile app capable of interpreting custom handwriting styles and swing telemetry to provide actionable feedback—rapidly developed in 2 months and subsequently acquired by Golf Galaxy.",
    results: [
      { label: "Build Time", value: "2 Months" },
      { label: "Acquisition", value: "Golf Galaxy" },
      { label: "Client Rating", value: "5.0 ★" },
    ],
    tags: ["Mobile App", "Golf Tech", "Proprietary Data", "Acquired"],
  },
  {
    id: "chicago-dog",
    title: "Chicago Dog 42",
    category: "Brand Launch & Restaurant Expansion",
    filter: "brand",
    location: "Omaha, NE / Regional",
    gallery: [
      {
        url: "/showcase/chicago_dog_real_1.jpg",
        caption: "Chicago Dog 42 signature gourmet dog, fresh fries, and restaurant dining counter",
      },
      {
        url: "/showcase/chicago_dog_real_2.png",
        caption: "Vintage 1950s diner menu collateral, modern branding, and food truck wrap",
      },
      {
        url: "/showcase/chicago_dog_real_3.png",
        caption: "CD42 splatter brand identity, viral video campaigns, and community buzz",
      },
    ],
    headline: "From Single Dying Mall Stall to 3 Locations & 5 Food Concepts",
    summary:
      "Having the creative freedom to achieve an organic 1950s diner with a modern twist, ReLaunch handled branding, social media, paid ads, and business consultation to scale from a single failing mall unit to 3 locations and 5 food concepts in 18 months.",
    results: [
      { label: "New Locations", value: "3 Units" },
      { label: "Food Concepts", value: "5 Brands" },
      { label: "Expansion Speed", value: "18 Months" },
    ],
    tags: ["Brand Launch", "Social Autopilot", "Paid Ads", "Business Consulting"],
  },
  {
    id: "aspiration-bank",
    title: "Aspiration Bank",
    category: "FinTech & Sustainable Banking",
    filter: "software",
    location: "Los Angeles, CA",
    gallery: [
      {
        url: "/showcase/aspiration_real_1.png",
        caption: "Aspiration green finance eco-friendly debit card and sustainable account architecture",
      },
      {
        url: "/showcase/aspiration_real_2.png",
        caption: "Aspiration web application interface and sustainable customer onboarding",
      },
      {
        url: "/showcase/aspiration_real_3.png",
        caption: "Interactive platform connecting emotionally with values-based customers",
      },
    ],
    headline: "Eco-Conscious Digital Banking UI/UX & Brand Story",
    summary:
      "Selected by executive leadership to architect Aspiration's digital presence and conversion funnels, distilling a complex organizational mission into an emotional brand story for customers seeking sustainable, values-based banking.",
    results: [
      { label: "Traffic Growth", value: "+340% YoY" },
      { label: "Subscription Lift", value: "+44%" },
      { label: "SOC2 Compliance", value: "100%" },
    ],
    tags: ["FinTech UI/UX", "Brand Story", "Conversion Funnels", "Web Platform"],
  },
  {
    id: "mother-truckin",
    title: "Mother Truckin Burgers",
    category: "Culinary Brand & Fleet Marketing",
    filter: "brand",
    location: "Phoenix Metro / Regional",
    gallery: [
      {
        url: "/showcase/mother_truckin_real_1.png",
        caption: "Mother Truckin Burgers food truck fleet and artisanal burger brand identity",
      },
      {
        url: "/showcase/mother_truckin_real_2.png",
        caption: "Custom truck vehicle wrap and culinary event promotional design",
      },
      {
        url: "/showcase/mother_truckin_real_3.png",
        caption: "High-volume fast casual food truck branding, social blitz, and local advertising",
      },
    ],
    headline: "High-Volume Mobile Food Fleet & Fast-Casual Brand Rollout",
    summary:
      "Engineered comprehensive culinary branding, vehicle fleet wraps, and localized social media promotion for Mother Truckin Burgers, generating lines around the block and massive catering booking growth.",
    results: [
      { label: "Fleet Expansion", value: "Multi-Truck" },
      { label: "Catering Growth", value: "+320%" },
      { label: "Social Reach", value: "High-Engagement" },
    ],
    tags: ["Food & Beverage", "Fleet Branding", "Social Blitz", "Local Marketing"],
  },
  {
    id: "volcano-resort",
    title: "Volcano Forest Resort",
    category: "Eco-Resort & Lodging Experience",
    filter: "web",
    location: "Volcano, Hawaii",
    gallery: [
      {
        url: "/showcase/volcano_resort_real_1.png",
        caption: "Volcano Forest Resort brand identity and destination retreat booking portal",
      },
      {
        url: "/brands/volcano-glamping.png",
        caption: "Luxury Glamping and Eco-Resort brand identity emblem",
      },
    ],
    headline: "High-Ticket Destination Retreat Marketing & Booking Portal",
    summary:
      "Crafted an immersive visual storytelling platform with automated guest inquiry pipelines, brand identity, and international search visibility for a secluded eco-retreat in the rainforest.",
    results: [
      { label: "Seasonal Occupancy", value: "94%" },
      { label: "Organic Search Lift", value: "3.2x" },
      { label: "Direct Revenue", value: "+310%" },
    ],
    tags: ["Visual Storytelling", "SEO Strategy", "Booking Engine", "Web Design"],
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

      {/* 1. Cinematic Work Video Hero with Explore & Book a Strategy Call */}
      <PageVideoHero
        theme="purple"
        kicker="Proven Client Impact · Est. 2004"
        titleRegular="Our Work &"
        titleHighlight="Proven Outcomes."
        description="Over 1,500 projects delivered. We partner with ambitious businesses to engineer decisive market results."
        videoSrc="/ourwork.mp4"
        posterSrc="/hero_frames/frame_000.webp"
        exploreText="Explore Our Work"
        exploreTargetId="case-studies-gallery"
        bookStrategyText="Book Strategy Call"
        bookStrategyIntent="strategy-session"
        scrollTargetId="case-studies-gallery"
      />

      {/* 1.5 The Brands We've Helped - Interactive Logo Marquee */}
      <BrandsHelpedSection variant="light" className="border-b border-slate-200" />

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
                    ? "bg-[#7F48ED] text-white shadow-md shadow-purple-500/25"
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
                  <div className="group flex flex-col rounded-3xl overflow-hidden bg-white border border-slate-200/80 hover:border-[#7F48ED]/40 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] transition-all h-full">
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
                          <span className="text-[10px] font-mono uppercase tracking-widest text-[#7F48ED] block mb-0.5 font-bold">
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
                                  ? "w-5 bg-[#7F48ED]"
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
                              <div className="font-heading font-black text-base sm:text-lg text-[#7F48ED]">
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
                          className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#7F48ED] hover:text-[#6D28D9] transition-colors cursor-pointer group/btn"
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
                <span className="px-3 py-1 rounded-full bg-[#7F48ED] text-white text-[10px] font-mono uppercase font-bold tracking-wider">
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
                  className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#7F48ED] hover:bg-[#6D28D9] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md cursor-pointer"
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
                      ? "border-[#7F48ED] scale-105 shadow-[0_0_15px_rgba(127,72,237,0.5)]"
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
