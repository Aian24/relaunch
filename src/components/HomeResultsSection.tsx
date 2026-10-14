"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import MotionWrapper from "@/components/MotionWrapper";
import { ArrowRight, Quote } from "lucide-react";

export default function HomeResultsSection() {
  const cards = [
    {
      client: "Chicago Dog 42",
      industry: "Restaurant",
      number: "$150K → $450K revenue",
      story: "Revenue grew from $150K to $450K in a year, then the brand went national as a franchise.",
      image: "/showcase/chicago_dog_real_1.jpg",
    },
    {
      client: "Aspiration Bank",
      industry: "Online banking",
      number: "+200% website traffic",
      story: "A new brand story and website that tripled traffic year over year.",
      image: "/showcase/aspiration_real_1.png",
    },
    {
      client: "Swing Perfect",
      industry: "Golf technology",
      number: "App built in 2 months",
      story: "A first-of-its-kind app built in 2 months. The business was later sold to Golf Galaxy.",
      image: "/showcase/swing_perfect_real_1.png",
    },
  ];

  return (
    <section id="results" className="py-16 sm:py-24 px-4 sm:px-6 lg:px-8 bg-slate-50 text-[#090D16]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <MotionWrapper direction="up" distance={20} className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-xs font-mono uppercase tracking-widest text-[#FF6700] font-bold block mb-2">
            PROVEN WORK
          </span>
          <h2 className="font-heading font-black text-3xl sm:text-5xl text-[#090D16] tracking-tight leading-[1.1] mb-3">
            Results you can <span className="text-[#FF6700]">see.</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            Real clients. Real numbers. No mockups.
          </p>
        </MotionWrapper>

        {/* 3 Case Study Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {cards.map((item, idx) => (
            <MotionWrapper key={item.client} direction="up" delay={idx * 0.1} distance={25}>
              <div className="h-full flex flex-col justify-between rounded-3xl bg-white border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md transition-all">
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <Image
                      src={item.image}
                      alt={item.client}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-[#FF6700] font-bold block">
                        {item.industry}
                      </span>
                      <h3 className="font-heading font-bold text-lg text-white">
                        {item.client}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6">
                    <div className="inline-block px-2.5 py-1 rounded-full bg-orange-50 border border-orange-200 text-[#FF6700] text-xs font-mono font-bold mb-3">
                      {item.number}
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {item.story}
                    </p>
                  </div>
                </div>

                <div className="px-6 pb-6 pt-0">
                  <Link
                    href="/work"
                    className="inline-flex items-center gap-1 text-xs font-bold text-[#FF6700] hover:text-[#E55C00]"
                  >
                    <span>Read case study →</span>
                  </Link>
                </div>
              </div>
            </MotionWrapper>
          ))}
        </div>

        {/* Featured Testimonial Card */}
        <MotionWrapper direction="up" delay={0.2} distance={20} className="max-w-4xl mx-auto mb-10">
          <div className="p-7 sm:p-9 rounded-3xl bg-white border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center shrink-0">
              <Quote className="w-6 h-6 text-[#FF6700]" />
            </div>
            <div>
              <blockquote className="text-sm sm:text-base text-slate-800 leading-relaxed font-normal mb-3">
                &ldquo;Bobby and his team didn&apos;t just build a pretty site — they engineered it to close commercial deals. Within 60 days of launching the new platform, our qualified inbound buyer inquiries jumped 340%.&rdquo;
              </blockquote>
              <div className="text-xs text-slate-500 font-semibold">
                — Jerry Q., <span className="text-slate-700">QuinnLan Realty Group</span>
              </div>
            </div>
          </div>
        </MotionWrapper>

        {/* Link to all work */}
        <div className="text-center">
          <Link
            href="/work"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-wider text-[#FF6700] hover:text-[#E55C00] transition-colors group"
          >
            <span>See all our work</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}
