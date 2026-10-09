"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import DeliverablesSection from "@/components/DeliverablesSection";
import AiSection from "@/components/AiSection";
import ReLaunchSocialSection from "@/components/ReLaunchSocialSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import MotionWrapper from "@/components/MotionWrapper";
import NumberCounter from "@/components/NumberCounter";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      {/* 0. Brand Video Intro Preloader */}
      <Preloader />

      {/* Fixed Frosted Navigation Header */}
      <Navbar />

      {/* 1. Cinematic Background Video Hero (Clean, uncluttered, orange & white with integrated Tailored For) */}
      <Hero />

      {/* 2. CORE PILLAR 1: Services (Deliverables Section) */}
      <DeliverablesSection />

      {/* 4. CORE PILLAR 2: AI Capabilities Section */}
      <AiSection />

      {/* 5. CORE PILLAR 3: Our Work & Case Studies Showcase */}
      <section id="work" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16] border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Center Aligned */}
          <MotionWrapper
            direction="up"
            distance={25}
            className="text-center max-w-3xl mx-auto mb-14 sm:mb-16"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-2 sm:whitespace-nowrap">
              OUR WORK &amp; CASE STUDIES
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.06] mb-3">
              <span className="whitespace-normal sm:whitespace-nowrap">Results you can </span>
              <span className="text-[#C0622A] whitespace-normal sm:whitespace-nowrap">see.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto mb-6">
              Real businesses we have launched, scaled, and built predictable sales pipelines for.
            </p>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#a84f1d] transition-colors group whitespace-nowrap"
            >
              <span>View Full Case Studies Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project 1: TurfLife */}
            <MotionWrapper direction="up" delay={0.1} distance={35}>
              <Link href="/work" className="group block rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] transition-all">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src="/showcase/turflife.jpg"
                    alt="TurfLife Case Study"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#F39C6B] font-semibold block">Phoenix, AZ · Landscaping</span>
                    <h3 className="font-heading font-bold text-xl text-white">TurfLife</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C0622A] border border-orange-200 text-[10px] font-bold font-mono">
                      <NumberCounter value={240} prefix="+" suffix="%" /> INBOUND LEADS
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    Complete website redesign, sub-second Next.js architecture, and localized search dominance.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C0622A] group-hover:underline">
                    View Outcome →
                  </span>
                </div>
              </Link>
            </MotionWrapper>

            {/* Project 2: Carmen Hotel */}
            <MotionWrapper direction="up" delay={0.2} distance={35}>
              <Link href="/work" className="group block rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] transition-all">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src="/showcase/carmen_hotel.jpg"
                    alt="Carmen Hotel Case Study"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#F39C6B] font-semibold block">Hospitality · Luxury Boutique</span>
                    <h3 className="font-heading font-bold text-xl text-white">Carmen Hotel Collection</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C0622A] border border-orange-200 text-[10px] font-bold font-mono">
                      <NumberCounter value={180} prefix="+" suffix="%" /> DIRECT BOOKINGS
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    Bespoke brand positioning, high-converting direct booking engine, and $120k/yr saved in OTA fees.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C0622A] group-hover:underline">
                    View Outcome →
                  </span>
                </div>
              </Link>
            </MotionWrapper>

            {/* Project 3: Volcano Forest Resort */}
            <MotionWrapper direction="up" delay={0.3} distance={35}>
              <Link href="/work" className="group block rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] transition-all">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src="/showcase/volcano_resort.jpg"
                    alt="Volcano Retreat Case Study"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#F39C6B] font-semibold block">Destination · Eco-Resort</span>
                    <h3 className="font-heading font-bold text-xl text-white">Volcano Rainforest Retreat</h3>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#C0622A] border border-orange-200 text-[10px] font-bold font-mono">
                      <NumberCounter value={94} suffix="%" /> SEASONAL OCCUPANCY
                    </span>
                  </div>
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    Immersive cinematic storytelling, custom guest reservation pipeline, and targeted content marketing.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C0622A] group-hover:underline">
                    View Outcome →
                  </span>
                </div>
              </Link>
            </MotionWrapper>
          </div>
        </div>
      </section>

      {/* 5. Autopilot Sub-Brand: ReLaunch Social Engine */}
      <ReLaunchSocialSection />

      {/* 6. Client Stories & 5-Star Social Proof */}
      <TestimonialsSection />

      {/* 7. Bottom Strategic CTA Banner */}
      <CtaBanner />

      {/* 8. Minimalist Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
