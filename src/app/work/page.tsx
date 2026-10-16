"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import { caseStudiesData } from "@/data/caseStudies";
import { testimonialsData } from "@/data/testimonials";
import BrandsHelpedSection from "@/components/BrandsHelpedSection";
import HeroScrollIndicator from "@/components/HeroScrollIndicator";
import { ArrowUpRight, ArrowRight, Quote, Calendar, MapPin, Tag } from "lucide-react";

const WORK_VIDEOS = ["/ourworknew.mp4", "/ourworknew2.mp4"];

export default function WorkPage() {
  const { openContactModal } = useContactModal();
  const [selectedFilter, setSelectedFilter] = useState<string>("All");
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);
  const videoRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)];

  useEffect(() => {
    const currentRef = videoRefs[activeVideoIdx].current;
    if (currentRef) {
      currentRef.playbackRate = 0.75;
      currentRef.play().catch(() => {});
    }
  }, [activeVideoIdx]);

  const handleEnded = () => {
    setActiveVideoIdx((prev) => (prev + 1) % WORK_VIDEOS.length);
  };

  const filterTabs = [
    "All",
    "Small business",
    "Websites & brand",
    "Custom software",
  ];

  const filteredStudies =
    selectedFilter === "All"
      ? caseStudiesData
      : caseStudiesData.filter((cs) => cs.category === selectedFilter);

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero Section with Cinematic Background Video (Full Screen) */}
      <section className="relative w-full min-h-[92vh] sm:min-h-screen flex flex-col justify-center items-center pt-32 sm:pt-36 pb-20 sm:pb-24 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {WORK_VIDEOS.map((src, idx) => (
            <video
              key={src}
              ref={videoRefs[idx]}
              src={src}
              autoPlay={idx === 0}
              muted
              playsInline
              onEnded={handleEnded}
              onLoadedMetadata={(e) => {
                e.currentTarget.playbackRate = 0.75;
              }}
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
                activeVideoIdx === idx ? "opacity-85 z-1" : "opacity-0 z-0"
              }`}
            />
          ))}
          {/* Crisp balanced overlay: reduced black so video is luminous & HD */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/30 via-transparent to-[#07090E]/65 z-2" />
          {/* Targeted Center Radial Scrim: lightened to eliminate heavy black fog */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_70%_at_50%_50%,rgba(7,9,14,0.40)_0%,rgba(7,9,14,0.15)_60%,transparent_100%)] z-2 pointer-events-none" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(127,72,237,0.22),transparent_75%)] z-2" />
          <div className="absolute top-1/4 right-1/4 w-[500px] h-[400px] bg-[#7F48ED]/20 rounded-full blur-[140px] z-2" />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center my-auto flex flex-col items-center">
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold mb-4 px-4 py-1.5 rounded-full bg-white/[0.08] hover:bg-white/[0.12] border border-[#7F48ED]/50 backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.25)] transition-all">
            OUR WORK
          </span>
          <h1 className="font-heading font-black text-4xl sm:text-6xl lg:text-7xl tracking-tight leading-[1.05] mb-5 drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
            Results you can <span className="text-[#7F48ED] drop-shadow-[0_4px_24px_rgba(127,72,237,0.45)]">see.</span>
          </h1>
          <p className="text-white/95 text-base sm:text-xl max-w-2xl mx-auto leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.95)] font-medium">
            Real businesses, real numbers. From a hot dog restaurant to a city records system, here&apos;s what changed after we got to work.
          </p>
        </MotionWrapper>

        {/* Scroll Indicator */}
        <HeroScrollIndicator targetId="work-grid" accentColor="#7F48ED" />
      </section>

      {/* 2. Verified Case Studies Grid */}
      <section id="work-grid" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-7xl mx-auto">
          {/* Filter Tabs in Body */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-12 sm:mb-16">
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 p-1.5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setSelectedFilter(tab)}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    selectedFilter === tab
                      ? "bg-[#7F48ED] text-white shadow-xs font-bold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredStudies.map((item, idx) => (
              <MotionWrapper key={item.id} direction="up" delay={idx * 0.08} distance={20}>
                <div className="h-full flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:border-[#7F48ED]/50 transition-all group">
                  <div>
                    {/* Image Header with Clickable Link */}
                    <Link href={`/work/${item.slug}`} className="block relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                      <div className="absolute bottom-3 left-4 right-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-wider font-bold text-[#A78BFA]">
                          <MapPin className="w-3 h-3 text-[#A78BFA]" />
                          <span>{item.location} · {item.industry}</span>
                        </div>
                        <h3 className="font-heading font-bold text-xl text-white mt-0.5 group-hover:text-[#A78BFA] transition-colors">
                          {item.title}
                        </h3>
                      </div>
                    </Link>

                    <div className="p-6">
                      {/* Metric Line / Badge */}
                      {item.hasNumberBadge && (
                        <div className="inline-block px-3 py-1 rounded-full text-xs font-mono font-bold mb-3 border bg-purple-50 border-purple-200 text-[#7F48ED]">
                          {item.headlineNumber}
                        </div>
                      )}

                      {/* Story */}
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-5">
                        {item.story}
                      </p>

                      {/* Services Chips */}
                      <div className="flex flex-wrap items-center gap-1.5 pt-3 border-t border-slate-100">
                        {item.services.map((svc) => (
                          <span
                            key={svc}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 text-[10px] font-medium"
                          >
                            {svc}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="px-6 pb-6 pt-0 flex items-center justify-between border-t border-slate-50 pt-4">
                    <Link
                      href={`/work/${item.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-[#7F48ED] hover:text-[#6C34DE] group-hover:underline"
                    >
                      <span>Read the story →</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => openContactModal({ intent: "strategy-session", serviceInterest: item.title })}
                      className="text-[11px] font-semibold text-slate-400 hover:text-slate-700 transition-colors"
                    >
                      Ask How
                    </button>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Brands Helped Infinite Scrolling Logo Marquee */}
      <BrandsHelpedSection variant="light" className="bg-white" />

      {/* 3. What Clients Say */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
              CLIENT TESTIMONIALS
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-[1.1]">
              What clients say.
            </h2>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {testimonialsData.map((t, idx) => (
              <MotionWrapper key={t.id} direction="up" delay={idx * 0.1} distance={20}>
                <div className="h-full flex flex-col justify-between p-7 rounded-3xl bg-slate-50 border border-slate-200/90">
                  <div>
                    <Quote className="w-8 h-8 text-[#7F48ED]/40 mb-4" />
                    <blockquote className="text-xs sm:text-sm text-slate-700 leading-relaxed font-normal mb-4">
                      &ldquo;{t.quote}&rdquo;
                    </blockquote>
                  </div>

                  <div className="pt-4 border-t border-slate-200">
                    <div className="font-heading font-bold text-sm text-[#090D16]">
                      {t.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      {t.role}, {t.company}
                    </div>
                  </div>
                </div>
              </MotionWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Final Call */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-slate-50 text-center border-t border-slate-200">
        <MotionWrapper direction="up" distance={20} className="max-w-2xl mx-auto">
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-4">
            Your business could be <span className="text-[#7F48ED]">the next story.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Book a free strategy call. We&apos;ll show you where the biggest gain is hiding and what it would take to get it.
          </p>
          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#7F48ED] hover:bg-[#6C34DE] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl shadow-[0_4px_20px_rgba(127,72,237,0.25)] transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-white" />
            <span>Book a Strategy Call</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </button>
        </MotionWrapper>
      </section>

      <Footer />
      <ScrollToTop />
    </main>
  );
}
