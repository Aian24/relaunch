"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import Preloader from "@/components/Preloader";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TwoHeroesSection from "@/components/TwoHeroesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import InteractiveImage from "@/components/InteractiveImage";
import MotionWrapper from "@/components/MotionWrapper";
import { useContactModal } from "@/context/ContactModalContext";
import {
  ArrowRight,
  ArrowUpRight,
  Layers,
  Code2,
  Bot,
  Sparkles,
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";

export default function Home() {
  const { openContactModal } = useContactModal();

  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      {/* 0. Brand Video Intro Preloader */}
      <Preloader />

      {/* Fixed Frosted Navigation Header */}
      <Navbar />

      {/* 1. Cinematic Background Video Hero */}
      <Hero />

      {/* 2. Strategic Positioning ("Which Door Fits You?") */}
      <TwoHeroesSection />

      {/* 3. Editorial Capabilities Teaser (Links to /services) */}
      <section className="py-24 sm:py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full bg-white">
        <MotionWrapper direction="up" distance={30} className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6 border-b border-slate-200/80 pb-8">
          <div className="max-w-2xl">
            <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-3">
              WHAT WE DO · FULL-SCOPE STUDIO
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-[1.08]">
              Strategy, Digital &amp; AI <br />
              <span className="text-[#C0622A] italic">Under One Roof.</span>
            </h2>
          </div>
          <Link
            href="/services"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] transition-colors group"
          >
            <span>Explore All 6 Core Services</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
          </Link>
        </MotionWrapper>

        {/* 3 Streamlined Pillar Cards with Staggered Scroll Up */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Card 1: Brand & Strategy */}
          <MotionWrapper direction="up" delay={0.1} distance={35}>
            <div className="group flex flex-col justify-between rounded-3xl p-8 bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all h-full">
              <div>
                <InteractiveImage
                  src="/images/brand-strategy.jpg"
                  alt="Brand Strategy & Physical Artifacts"
                  aspectRatio="aspect-[16/10]"
                  badge="Pillar 01"
                  className="mb-6 border-slate-200"
                />
                <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">
                  Brand Strategy &amp; Identity
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Bespoke brand positioning, distinct visual identity systems, and high-impact physical and digital touchpoints that command market authority.
                </p>
              </div>
              <Link
                href="/services#brand-strategy"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] transition-colors"
              >
                <span>Learn More</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </MotionWrapper>

          {/* Card 2: Web & Software */}
          <MotionWrapper direction="up" delay={0.2} distance={35}>
            <div className="group flex flex-col justify-between rounded-3xl p-8 bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all h-full">
              <div>
                <InteractiveImage
                  src="/images/digital-studio.jpg"
                  alt="Web & Custom Software Workspace"
                  aspectRatio="aspect-[16/10]"
                  badge="Pillar 02"
                  className="mb-6 border-slate-200"
                />
                <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">
                  Web &amp; Custom Software
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Lightning-fast Next.js web applications, client portals, and bespoke database backends built for high conversions and scale.
                </p>
              </div>
              <Link
                href="/services#web-software"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] transition-colors"
              >
                <span>Learn More</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </MotionWrapper>

          {/* Card 3: AI & Automation */}
          <MotionWrapper direction="up" delay={0.3} distance={35}>
            <div className="group flex flex-col justify-between rounded-3xl p-8 bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all h-full">
              <div>
                <InteractiveImage
                  src="/images/ai-engineering.jpg"
                  alt="AI Automation & Workflows"
                  aspectRatio="aspect-[16/10]"
                  badge="Pillar 03"
                  className="mb-6 border-slate-200"
                />
                <h3 className="font-heading font-black text-xl text-[#090D16] mb-2">
                  AI &amp; Workflow Automation
                </h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 font-normal">
                  Generative Engine Optimization (GEO/AEO), autonomous 24/7 lead qualification, and automated CRM pipeline infrastructure.
                </p>
              </div>
              <Link
                href="/ai"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] transition-colors"
              >
                <span>Learn More</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </MotionWrapper>
        </div>
      </section>

      {/* 4. Featured Work Showcase Teaser (Links to /work) */}
      <section className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16] border-t border-slate-200/80">
        <div className="max-w-7xl mx-auto">
          <MotionWrapper direction="up" distance={30} className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6 border-b border-slate-200/80 pb-8">
            <div className="max-w-2xl">
              <span className="text-xs font-mono uppercase tracking-widest text-[#C0622A] font-bold block mb-3">
                OUR WORK &amp; CASE STUDIES
              </span>
              <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-[1.08]">
                Proven Transformations &amp; <br />
                <span className="text-[#C0622A] italic">
                  Real Business Metrics.
                </span>
              </h2>
            </div>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#C0622A] hover:text-[#9c4314] transition-colors group"
            >
              <span>View Full Case Studies Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Project 1 */}
            <MotionWrapper direction="up" delay={0.1} distance={35}>
              <Link href="/work" className="group block rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src="/showcase/turflife.jpg"
                    alt="TurfLife Case Study"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#F39C6B] font-semibold block">Phoenix, AZ</span>
                    <h3 className="font-heading font-bold text-xl text-white">TurfLife</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    +240% inbound leads with sub-second Next.js architecture and targeted search dominance.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C0622A] group-hover:underline">
                    View Outcome →
                  </span>
                </div>
              </Link>
            </MotionWrapper>

            {/* Project 2 */}
            <MotionWrapper direction="up" delay={0.2} distance={35}>
              <Link href="/work" className="group block rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src="/showcase/carmen_hotel.jpg"
                    alt="Carmen Hotel Case Study"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#F39C6B] font-semibold block">Hospitality</span>
                    <h3 className="font-heading font-bold text-xl text-white">Carmen Hotel Collection</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    +180% direct bookings &amp; $120k/yr saved in third-party OTA commissions through custom booking UX.
                  </p>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#C0622A] group-hover:underline">
                    View Outcome →
                  </span>
                </div>
              </Link>
            </MotionWrapper>

            {/* Project 3 */}
            <MotionWrapper direction="up" delay={0.3} distance={35}>
              <Link href="/work" className="group block rounded-3xl overflow-hidden bg-white border border-slate-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] transition-all">
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <Image
                    src="/showcase/volcano_resort.jpg"
                    alt="Volcano Retreat Case Study"
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-106"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-[10px] uppercase font-mono tracking-wider text-[#F39C6B] font-semibold block">Destination</span>
                    <h3 className="font-heading font-bold text-xl text-white">Volcano Rainforest Retreat</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                    94% seasonal occupancy achieved with immersive cinematic storytelling and dynamic booking pipelines.
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

      {/* 5. Client Testimonials & Social Proof */}
      <TestimonialsSection />

      {/* 6. High-Converting Bottom CTA */}
      <CtaBanner />

      {/* 7. Minimalist Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
