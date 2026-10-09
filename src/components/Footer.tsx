"use client";

import Image from "next/image";
import Link from "next/link";
import { navLinks, contactInfo } from "@/data/navigation";
import { Phone, Mail, MapPin, ArrowUp } from "lucide-react";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="bg-[#090D16] text-white pt-16 pb-10 select-none border-t border-slate-800/80 overflow-hidden relative">
      {/* Subtle Purple & Orange Ambient Halo */}
      <div className="absolute top-0 right-1/4 w-[400px] h-[300px] bg-[#7F48ED]/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 left-10 w-[400px] h-[300px] bg-[#FF6700]/8 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-slate-800">
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

            <p className="text-xs text-slate-400 leading-relaxed max-w-sm font-normal">
              Brand, digital platforms &amp; AI marketing infrastructure for ambitious companies. Subscription-based. Zero long-term contracts. 100% asset ownership.
            </p>

            <div className="flex items-center gap-2 text-xs font-medium">
              <MapPin className="w-3.5 h-3.5 text-[#FF6700]" />
              <span className="text-slate-300">Phoenix, Arizona · Est. 2004</span>
            </div>
          </div>

          {/* Col 2: Capabilities */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-slate-400">
              Capabilities
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              <li>
                <Link href="/services#brand-strategy" className="hover:text-[#FF6700] transition-colors">
                  Brand Strategy &amp; Identity
                </Link>
              </li>
              <li>
                <Link href="/services#web-software" className="hover:text-[#7F48ED] transition-colors">
                  Web &amp; Custom Software
                </Link>
              </li>
              <li>
                <Link href="/services#performance-ads" className="hover:text-[#FF6700] transition-colors">
                  Performance &amp; Paid Media
                </Link>
              </li>
              <li>
                <Link href="/ai" className="text-purple-300 hover:text-[#7F48ED] transition-colors font-medium">
                  AI Automation &amp; GEO
                </Link>
              </li>
              <li>
                <Link href="/services#content-video" className="hover:text-[#FF6700] transition-colors">
                  Content &amp; Video Production
                </Link>
              </li>
              <li>
                <Link href="/services#local-seo" className="hover:text-[#FF6700] transition-colors">
                  Local SEO &amp; Authority
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Navigation */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-heading font-bold text-xs uppercase tracking-widest text-slate-400">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-slate-300">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-[#FF6700] transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://relaunch-social-orbit.base44.app"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#FF6700] transition-colors text-[#FF6700] font-semibold"
                >
                  Client Portal ↗
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
                <span className="text-[11px] text-slate-500 block">Custom Subscription Pricing</span>
                <Link href="/pricing" className="text-xs text-[#FF6700] underline hover:text-[#FF6700]">
                  relaunch.us/pricing
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} ReLaunch Marketing &amp; Advertising · Phoenix, AZ
          </div>

          <div className="flex items-center gap-6">
            <span>Built by ReLaunch</span>
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
