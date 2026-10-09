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

      {/* 1. Cinematic Background Video Hero */}
      <Hero />

      {/* 2. CORE PILLAR 1: Services (Deliverables Section) */}
      <DeliverablesSection />

      {/* 4. CORE PILLAR 2: AI Capabilities Section */}
      <AiSection />

      {/* 5. CORE PILLAR 3: Our Work & Case Studies Showcase - 100% Real Client Works */}
      <section id="work" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-white text-[#090D16] border-b border-slate-200">
        <div className="max-w-7xl mx-auto">
          {/* Section Header - Center Aligned */}
          <MotionWrapper
            direction="up"
            distance={25}
            className="text-center max-w-3xl mx-auto mb-14 sm:mb-16"
          >
            <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2 sm:whitespace-nowrap">
              OUR WORK &amp; CASE STUDIES
            </span>
            <h2 className="font-heading font-black text-3xl sm:text-5xl lg:text-6xl text-[#090D16] tracking-tight leading-[1.06] mb-3">
              <span className="whitespace-normal sm:whitespace-nowrap">Results you can </span>
              <span className="text-[#FF6700] whitespace-normal sm:whitespace-nowrap">see.</span>
            </h2>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed font-normal max-w-2xl mx-auto mb-6">
              Real businesses we have launched, scaled, and built predictable sales pipelines for over 22+ years. Zero AI mockups.
            </p>
            <Link
              href="/work"
              className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FF6700] hover:text-[#E55C00] transition-colors group whitespace-nowrap"
            >
              <span>View Full Case Studies Gallery</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
            </Link>
          </MotionWrapper>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Project 1: TurfLife */}
            <MotionWrapper direction="up" delay={0.06} distance={30}>
              <Link href="/work" className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] hover:border-[#FF6700]/30 transition-all h-full">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <Image
                      src="/showcase/turflife_real_1.png"
                      alt="TurfLife Case Study"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#FF6700] font-semibold block">Winter Springs, FL · Sports Lifestyle</span>
                      <h3 className="font-heading font-bold text-xl text-white">TurfLife</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6700] border border-orange-200 text-[10px] font-bold font-mono">
                        <NumberCounter value={240} prefix="+" suffix="%" /> COMMUNITY GROWTH
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      National &quot;Protect Your Turf&quot; movement, custom e-commerce hub, and national athletic lifestyle brand rollout.
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6700] group-hover:underline">
                    View Case Study →
                  </span>
                </div>
              </Link>
            </MotionWrapper>

            {/* Project 2: Carmen Hotel */}
            <MotionWrapper direction="up" delay={0.12} distance={30}>
              <Link href="/work" className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] hover:border-[#FF6700]/30 transition-all h-full">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <Image
                      src="/showcase/carmen_hotel_real_1.jpg"
                      alt="Carmen Hotel Case Study"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#FF6700] font-semibold block">Playa del Carmen, Mexico · Luxury Boutique</span>
                      <h3 className="font-heading font-bold text-xl text-white">Carmen Hotel Collection</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6700] border border-orange-200 text-[10px] font-bold font-mono">
                        <NumberCounter value={15} prefix="+" suffix="%" /> DIRECT BOOKINGS
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      Targeted social media ad testing, guest acquisition campaigns, and $120k/yr saved in OTA commissions.
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6700] group-hover:underline">
                    View Case Study →
                  </span>
                </div>
              </Link>
            </MotionWrapper>

            {/* Project 3: Chicago Dog 42 */}
            <MotionWrapper direction="up" delay={0.18} distance={30}>
              <Link href="/work" className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] hover:border-[#FF6700]/30 transition-all h-full">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <Image
                      src="/showcase/chicago_dog_real_1.jpg"
                      alt="Chicago Dog 42 Case Study"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#FF6700] font-semibold block">Omaha, NE · Fast Casual Dining</span>
                      <h3 className="font-heading font-bold text-xl text-white">Chicago Dog 42</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6700] border border-orange-200 text-[10px] font-bold font-mono">
                        3 UNITS · 5 CONCEPTS
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      Scaled from a single struggling mall stall in Omaha to 3 locations and 5 food concepts in 18 months.
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6700] group-hover:underline">
                    View Case Study →
                  </span>
                </div>
              </Link>
            </MotionWrapper>

            {/* Project 4: Swing Perfect */}
            <MotionWrapper direction="up" delay={0.24} distance={30}>
              <Link href="/work" className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] hover:border-[#FF6700]/30 transition-all h-full">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <Image
                      src="/showcase/swing_perfect_real_1.png"
                      alt="Swing Perfect Golf Tech Case Study"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#FF6700] font-semibold block">National · Mobile App &amp; Kinematics</span>
                      <h3 className="font-heading font-bold text-xl text-white">Swing Perfect</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6700] border border-orange-200 text-[10px] font-bold font-mono">
                        ACQUIRED BY GOLF GALAXY
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      Built proprietary mobile kinematics app in 2 months. Validated by PGA coaches and acquired by national retailer Golf Galaxy.
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6700] group-hover:underline">
                    View Case Study →
                  </span>
                </div>
              </Link>
            </MotionWrapper>

            {/* Project 5: City of Jacksonville */}
            <MotionWrapper direction="up" delay={0.3} distance={30}>
              <Link href="/work" className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] hover:border-[#FF6700]/30 transition-all h-full">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <Image
                      src="/showcase/jacksonville_real_1.jpg"
                      alt="City of Jacksonville Portal Case Study"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#FF6700] font-semibold block">Duval County, FL · Enterprise Portal</span>
                      <h3 className="font-heading font-bold text-xl text-white">City of Jacksonville</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6700] border border-orange-200 text-[10px] font-bold font-mono">
                        450,000+ CITIZEN USERS
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      Enterprise architectural software and Entity Network Framework for Duval County property records, delivered 1 month ahead of schedule.
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6700] group-hover:underline">
                    View Case Study →
                  </span>
                </div>
              </Link>
            </MotionWrapper>

            {/* Project 6: Aspiration Bank */}
            <MotionWrapper direction="up" delay={0.36} distance={30}>
              <Link href="/work" className="group flex flex-col justify-between rounded-3xl overflow-hidden bg-white border border-slate-200 shadow-[0_4px_25px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_45px_rgba(0,0,0,0.08)] hover:border-[#FF6700]/30 transition-all h-full">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <Image
                      src="/showcase/aspiration_real_1.png"
                      alt="Aspiration Bank Case Study"
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-[10px] uppercase font-mono tracking-wider text-[#FF6700] font-semibold block">FinTech · Values-Based Banking</span>
                      <h3 className="font-heading font-bold text-xl text-white">Aspiration Bank</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#FF6700] border border-orange-200 text-[10px] font-bold font-mono">
                        <NumberCounter value={340} prefix="+" suffix="%" /> TRAFFIC GROWTH
                      </span>
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-4">
                      Brand positioning strategy, interactive landing page architectures, and automated customer onboarding funnels.
                    </p>
                  </div>
                </div>
                <div className="px-6 pb-6 pt-0">
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6700] group-hover:underline">
                    View Case Study →
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
