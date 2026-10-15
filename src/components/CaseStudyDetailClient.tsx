"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import { CaseStudy } from "@/data/caseStudies";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  ExternalLink,
  MapPin,
  Quote,
  TrendingUp,
  X,
  Globe,
  Layers,
  Video,
} from "lucide-react";

interface CaseStudyDetailClientProps {
  study: CaseStudy;
  nextStudy?: CaseStudy;
  prevStudy?: CaseStudy;
}

export default function CaseStudyDetailClient({
  study,
  nextStudy,
  prevStudy,
}: CaseStudyDetailClientProps) {
  const { openContactModal } = useContactModal();
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);

  // Safe access to images
  const img1 = study.galleryImages?.[0] || { src: study.image, alt: study.title, caption: "Project Overview" };
  const img2 = study.galleryImages?.[1] || img1;
  const img3 = study.galleryImages?.[2] || img1;
  const img4 = study.galleryImages?.[3] || img2;

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      <Navbar />

      {/* 1. Hero Section (Clean dark banner; video ONLY if present on relaunch.us e.g. Carmen Hotel; no book buttons in hero) */}
      <section className="relative w-full pt-36 sm:pt-44 pb-14 sm:pb-20 bg-[#07090E] text-white px-4 sm:px-6 lg:px-8 overflow-hidden select-none">
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
          {study.heroVideo && (
            <>
              <video
                src={study.heroVideo}
                autoPlay
                muted
                loop
                playsInline
                className="absolute inset-0 w-full h-full object-cover opacity-45"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-[#07090E]/80 via-[#07090E]/55 to-[#07090E]" />
            </>
          )}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,rgba(127,72,237,0.18),transparent_75%)]" />
          <div className="absolute top-1/4 right-1/4 w-[450px] h-[350px] bg-[#7F48ED]/15 rounded-full blur-[140px]" />
        </div>

        <MotionWrapper direction="up" distance={25} className="relative z-10 max-w-4xl mx-auto text-center">
          {/* Breadcrumb back to all work */}
          <div className="mb-4">
            <Link
              href="/work"
              className="inline-flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to all work</span>
            </Link>
          </div>

          {/* Category Tag */}
          <span className="inline-block text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold mb-3">
            CASE STUDY · {study.category}
          </span>

          {/* Heading */}
          <h1 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight leading-[1.08] mb-4">
            {study.title}
          </h1>

          {/* Subtitle / Description */}
          <p className="text-slate-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mb-6">
            {study.description}
          </p>

          {/* Headline Metric Callout Pill */}
          {study.hasNumberBadge && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.08] border border-white/[0.12] text-purple-300 text-xs sm:text-sm font-mono font-bold">
              <TrendingUp className="w-4 h-4 text-[#7F48ED]" />
              <span>{study.headlineNumber}</span>
            </div>
          )}

          {/* Location & Industry Meta */}
          <div className="flex items-center justify-center gap-3 mt-6 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#7F48ED]" />
              {study.location}
            </span>
            <span>·</span>
            <span>{study.industry}</span>
            <span>·</span>
            <span>{study.timeline}</span>
            {study.liveUrl && (
              <>
                <span>·</span>
                <a
                  href={study.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[#7F48ED] hover:underline"
                >
                  <span>Visit site</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </>
            )}
          </div>
        </MotionWrapper>
      </section>

      {/* 2. Alternating Zigzag Layout: Each detail paired directly with an authentic image (No numbers) */}

      {/* ROW 1: Image Left, Details Right (The Challenge) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Image (Left) */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <MotionWrapper direction="up" distance={20}>
                <div
                  onClick={() => setSelectedGalleryImage(img1.src)}
                  className="rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-sm cursor-zoom-in group hover:border-[#7F48ED]/50 transition-all"
                >
                  <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 bg-white px-3 py-0.5 rounded border border-slate-200 truncate max-w-[220px]">
                      {study.displayUrl}
                    </span>
                    <Globe className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7F48ED] transition-colors" />
                  </div>
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={img1.src}
                      alt={img1.alt}
                      fill
                      priority
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    {img1.caption && (
                      <div className="absolute bottom-2.5 left-3 right-3 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-md text-[11px] font-mono text-white/90">
                        {img1.caption}
                      </div>
                    )}
                  </div>
                </div>
              </MotionWrapper>
            </div>

            {/* Details (Right) */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <MotionWrapper direction="up" distance={20}>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
                  THE CHALLENGE
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] tracking-tight mb-4">
                  The Problem &amp; Market Context
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-6">
                  {study.challenge}
                </p>

                {/* Highlighted Baseline Quote or Metric */}
                <div className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold block mb-1">
                    PROJECT FOCUS
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    {study.subtitle}
                  </p>
                </div>
              </MotionWrapper>
            </div>

          </div>
        </div>
      </section>

      {/* ROW 2: Details Left, Image Right (Our Strategy & Approach) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Details (Left) */}
            <div className="lg:col-span-6 space-y-4">
              <MotionWrapper direction="up" distance={20}>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
                  OUR STRATEGY
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] tracking-tight mb-4">
                  The Approach &amp; Execution Roadmap
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-6">
                  {study.strategy}
                </p>

                {/* Strategy Highlight */}
                <div className="p-5 rounded-2xl bg-purple-50/60 border border-purple-200 shadow-xs">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-[#7F48ED] font-bold block mb-1">
                    STRATEGIC SCOPE
                  </span>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium">
                    Full lifecycle partnership from day one across creative, paid acquisition, and technology.
                  </p>
                </div>
              </MotionWrapper>
            </div>

            {/* Image or Video (Right) */}
            <div className="lg:col-span-6">
              <MotionWrapper direction="up" delay={0.1} distance={20}>
                {study.bodyVideo ? (
                  <div className="rounded-3xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-sm group hover:border-[#7F48ED]/50 transition-all">
                    <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                        Video Campaign Deliverable
                      </span>
                      <Video className="w-3.5 h-3.5 text-[#7F48ED]" />
                    </div>
                    <div className="relative aspect-[16/10] w-full bg-slate-950 overflow-hidden flex items-center justify-center">
                      <video
                        src={study.bodyVideo}
                        controls
                        playsInline
                        preload="metadata"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => setSelectedGalleryImage(img2.src)}
                    className="rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-sm cursor-zoom-in group hover:border-[#7F48ED]/50 transition-all"
                  >
                    <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                        Strategic Deliverable &amp; Execution
                      </span>
                      <Layers className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7F48ED] transition-colors" />
                    </div>
                    <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                      <Image
                        src={img2.src}
                        alt={img2.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                      {img2.caption && (
                        <div className="absolute bottom-2.5 left-3 right-3 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-md text-[11px] font-mono text-white/90">
                          {img2.caption}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </MotionWrapper>
            </div>

          </div>
        </div>
      </section>

      {/* ROW 3: Image Left, Details Right (The Results) */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Image (Left) */}
            <div className="lg:col-span-6 order-2 lg:order-1">
              <MotionWrapper direction="up" distance={20}>
                <div
                  onClick={() => setSelectedGalleryImage(img3.src)}
                  className="rounded-3xl overflow-hidden bg-white border border-slate-200/90 shadow-sm cursor-zoom-in group hover:border-[#7F48ED]/50 transition-all"
                >
                  <div className="px-4 py-2.5 bg-slate-100 border-b border-slate-200 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider font-bold">
                      Platform Impact &amp; Growth
                    </span>
                    <TrendingUp className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#7F48ED] transition-colors" />
                  </div>
                  <div className="relative aspect-[16/10] w-full bg-slate-900 overflow-hidden">
                    <Image
                      src={img3.src}
                      alt={img3.alt}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                    {img3.caption && (
                      <div className="absolute bottom-2.5 left-3 right-3 bg-black/60 backdrop-blur-xs px-3 py-1 rounded-md text-[11px] font-mono text-white/90">
                        {img3.caption}
                      </div>
                    )}
                  </div>
                </div>
              </MotionWrapper>
            </div>

            {/* Details (Right) */}
            <div className="lg:col-span-6 order-1 lg:order-2 space-y-4">
              <MotionWrapper direction="up" distance={20}>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
                  THE RESULTS
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] tracking-tight mb-4">
                  Measurable Business Impact
                </h2>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal mb-6">
                  {study.resultsNarrative}
                </p>

                {/* Headline Number Callout */}
                <div className="p-6 rounded-2xl bg-white border border-purple-200 shadow-xs">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold mb-1">
                    KEY OUTCOME
                  </div>
                  <div className="font-heading font-black text-2xl sm:text-3xl text-[#7F48ED] tracking-tight">
                    {study.headlineNumber}
                  </div>
                </div>
              </MotionWrapper>
            </div>

          </div>
        </div>
      </section>

      {/* ROW 4: Deliverables Left, Testimonial & 4th Image Right */}
      <section className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
            
            {/* Scope / Deliverables (Left 6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              <MotionWrapper direction="up" distance={20}>
                <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-2">
                  SERVICES PROVIDED
                </span>
                <h2 className="font-heading font-black text-2xl sm:text-3xl text-[#090D16] tracking-tight mb-3">
                  Scope of Services Provided
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mb-6">
                  The complete suite of agency solutions executed for {study.client}.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {study.fullDeliverables.map((item) => (
                    <div
                      key={item}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-50 border border-slate-200/90 text-xs font-medium text-slate-700"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#7F48ED] shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </MotionWrapper>
            </div>

            {/* Testimonial & 4th Image (Right 6 cols) */}
            <div className="lg:col-span-6 space-y-6">
              {/* Testimonial */}
              {study.testimonialQuote && (
                <MotionWrapper direction="up" delay={0.08} distance={20}>
                  <div className="p-6 sm:p-8 rounded-3xl bg-purple-50/60 border border-purple-200 shadow-xs">
                    <Quote className="w-8 h-8 text-[#7F48ED] opacity-60 mb-3" />
                    <blockquote className="text-xs sm:text-sm text-slate-800 leading-relaxed font-normal mb-4">
                      &ldquo;{study.testimonialQuote.quote}&rdquo;
                    </blockquote>
                    <div className="pt-3 border-t border-purple-200/60">
                      <div className="font-heading font-bold text-sm text-[#090D16]">
                        {study.testimonialQuote.author}
                      </div>
                      {study.testimonialQuote.role && (
                        <div className="text-xs text-[#7F48ED] font-mono mt-0.5">
                          {study.testimonialQuote.role}
                        </div>
                      )}
                    </div>
                  </div>
                </MotionWrapper>
              )}

              {/* 4th Image Card */}
              {img4 && (
                <MotionWrapper direction="up" delay={0.14} distance={20}>
                  <div
                    onClick={() => setSelectedGalleryImage(img4.src)}
                    className="rounded-2xl overflow-hidden bg-slate-900 border border-slate-200/90 shadow-xs cursor-zoom-in group hover:border-[#7F48ED]/50 transition-all"
                  >
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={img4.src}
                        alt={img4.alt}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                      {img4.caption && (
                        <div className="absolute bottom-2.5 left-3 right-3 text-[11px] font-mono text-white/90">
                          {img4.caption}
                        </div>
                      )}
                    </div>
                  </div>
                </MotionWrapper>
              )}
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox Modal for gallery zoom */}
      {selectedGalleryImage && (
        <div
          onClick={() => setSelectedGalleryImage(null)}
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
        >
          <button
            type="button"
            onClick={() => setSelectedGalleryImage(null)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center">
            <Image
              src={selectedGalleryImage}
              alt="Project Showcase Full View"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}

      {/* 3. Previous / Next Project Navigation Cards */}
      {(prevStudy || nextStudy) && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 border-t border-slate-200">
          <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-stretch justify-between gap-4">
            {prevStudy ? (
              <Link
                href={`/work/${prevStudy.slug}`}
                className="flex-1 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#7F48ED]/50 transition-all group"
              >
                <div className="flex items-center gap-1.5 text-xs font-mono text-slate-400 mb-1">
                  <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                  <span>Previous Project</span>
                </div>
                <div className="font-heading font-bold text-sm sm:text-base text-[#090D16]">
                  {prevStudy.title}
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}

            {nextStudy ? (
              <Link
                href={`/work/${nextStudy.slug}`}
                className="flex-1 p-5 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-[#7F48ED]/50 transition-all text-right group"
              >
                <div className="flex items-center justify-end gap-1.5 text-xs font-mono mb-1 text-[#7F48ED]">
                  <span>Next Project</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
                <div className="font-heading font-bold text-sm sm:text-base text-[#090D16]">
                  {nextStudy.title}
                </div>
              </Link>
            ) : (
              <div className="flex-1" />
            )}
          </div>
        </section>
      )}

      {/* 4. Final Call to Action */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-center border-t border-slate-100">
        <MotionWrapper direction="up" distance={20} className="max-w-2xl mx-auto">
          <span className="text-xs font-mono uppercase tracking-widest text-[#7F48ED] font-bold block mb-3">
            START YOUR STORY
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight mb-4">
            Ready to engineer <span className="text-[#7F48ED]">real results?</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-8">
            Whether scaling a franchise, launching a disruptive platform, or overhauling enterprise software, our team delivers.
          </p>
          <button
            type="button"
            onClick={() =>
              openContactModal({
                intent: "strategy-session",
                serviceInterest: study.title,
                notes: `Inquiry after reviewing ${study.title} case study.`,
              })
            }
            className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-[#7F48ED] hover:bg-[#6C34DE] shadow-[0_4px_20px_rgba(127,72,237,0.25)] text-white font-heading font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all cursor-pointer hover:scale-105"
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
