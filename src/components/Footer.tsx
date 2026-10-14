"use client";

import Image from "next/image";
import Link from "next/link";
import { contactInfo } from "@/data/navigation";
import { Phone, Mail, MapPin, ArrowUp, ArrowUpRight } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#090D16] text-white pt-16 pb-12 select-none border-t border-slate-800/80 overflow-hidden relative">
      {/* Subtle Purple & Orange Ambient Halo */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-[#7F48ED]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-10 w-[400px] h-[300px] bg-[#FF6700]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800/80">
          {/* Col 1: Brand & Logo */}
          <div className="lg:col-span-4 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center justify-center bg-white px-3.5 py-1.5 rounded-xl shadow-xs hover:shadow-sm transition-shadow"
            >
              <Image
                src="/logos/logo-compact.png"
                alt="ReLaunch.us Logo"
                width={140}
                height={28}
                className="h-7 w-auto object-contain"
              />
            </Link>

            <p className="text-xs text-slate-300 font-semibold leading-relaxed">
              Marketing Strategically Designed to Sell.
            </p>

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              We strategize, create, and deliver marketing built to sell — and you can see it in your numbers.
            </p>

            <div className="flex items-center gap-2 text-xs font-medium text-slate-400 pt-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF6700] shrink-0" />
              <span>{contactInfo.homeBaseDisclaimer}</span>
            </div>
          </div>

          {/* Col 2: Services & Outcomes */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-slate-400">
              Outcomes &amp; Services
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/services#get-found" className="hover:text-[#FF6700] transition-colors">
                  Get Found (Local SEO &amp; AI)
                </Link>
              </li>
              <li>
                <Link href="/services#get-chosen" className="hover:text-[#FF6700] transition-colors">
                  Get Chosen (Web &amp; Social)
                </Link>
              </li>
              <li>
                <Link href="/services#get-more-customers" className="hover:text-[#FF6700] transition-colors">
                  Get More Customers (Ads &amp; Follow-up)
                </Link>
              </li>
              <li>
                <Link href="/custom-software" className="text-white hover:text-[#FF6700] transition-colors font-medium">
                  Custom Software &amp; Portals →
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-[#FF6700] transition-colors">
                  Pricing &amp; Bundle Savings
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Products (The ReLaunch Family) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-slate-400">
              Products
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/ai-recommendations" className="hover:text-[#7F48ED] transition-colors">
                  AI Recommendations
                </Link>
              </li>
              <li>
                <Link href="/social" className="hover:text-[#FF6700] transition-colors">
                  ReLaunch Social
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-[#FF6700] transition-colors font-medium">
                  ReLaunch Studio →
                </Link>
              </li>
              <li>
                <Link href="/audit" className="hover:text-[#7F48ED] transition-colors">
                  Free Social Audit
                </Link>
              </li>
              <li>
                <a
                  href="https://relaunch-social-orbit.base44.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF6700] transition-colors text-slate-400 inline-flex items-center gap-1"
                >
                  <span>Client Portal</span>
                  <ArrowUpRight className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Direct Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-slate-400">
              Direct Contact
            </h4>

            <div className="space-y-2.5 text-xs text-slate-300">
              <a
                href={contactInfo.phoneTel}
                className="flex items-center gap-2 hover:text-[#FF6700] transition-colors font-mono"
              >
                <Phone className="w-3.5 h-3.5 text-[#FF6700]" />
                <span>{contactInfo.phoneFormatted}</span>
              </a>

              <a
                href={contactInfo.emailMailto}
                className="flex items-center gap-2 hover:text-[#FF6700] transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-[#FF6700]" />
                <span>{contactInfo.email}</span>
              </a>

              <div className="pt-2">
                <span className="text-[11px] text-slate-500 block">30-Minute Diagnostic</span>
                <Link href="/pricing" className="text-xs text-[#FF6700] underline hover:text-[#FF6700]">
                  Book a Strategy Call
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ReLaunch. {contactInfo.homeBaseDisclaimer}.
          </div>

          <div className="flex items-center gap-6">
            <span>Month-to-Month · You Own Everything</span>
            <button
              onClick={scrollToTop}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-[#FF6700] text-white transition-colors cursor-pointer"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
