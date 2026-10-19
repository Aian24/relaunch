"use client";

import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import HowWeHelpSection from "@/components/HowWeHelpSection";
import ProofStrip from "@/components/ProofStrip";
import HowItWorksSection from "@/components/HowItWorksSection";
import HomeResultsSection from "@/components/HomeResultsSection";
import BrandsHelpedSection from "@/components/BrandsHelpedSection";
import FounderSection from "@/components/FounderSection";
import CtaBanner from "@/components/CtaBanner";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-white text-[#090D16]">
      {/* 1. Frosted Navigation Header */}
      <Navbar />

      {/* 2. Hero Section: Direct load (No preloader), standardized ~40 word copy */}
      <Hero />

      {/* Proof strip: client logos + three numbers */}
      <ProofStrip />

      {/* 3. How We Help: 4 Outcome Groups (Find the leak. Fix it. Grow.) */}
      <HowWeHelpSection />

      {/* 4. How It Works: Three steps. No long contracts. */}
      <HowItWorksSection />

      {/* 5. Results: 3 case cards */}
      <HomeResultsSection />

      {/* 6. Brands Helped: Infinite marquee with visible dark logos + 3 defensible metrics (Same as Our Work page) */}
      <BrandsHelpedSection variant="light" className="bg-white" themeColor="orange" showStats={false} />

      {/* 7. How we work: senior team, 3 promises (no founder name/photo for now) */}
      <FounderSection />

      {/* 8. Final Call: Find out where you're losing sales */}
      <CtaBanner />

      {/* 9. Minimalist Footer */}
      <Footer />
      <ScrollToTop />
    </main>
  );
}
