"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, contactInfo } from "@/data/navigation";
import { useContactModal } from "@/context/ContactModalContext";
import { Menu, X, ArrowUpRight, Phone } from "lucide-react";

export default function Navbar() {
  const { openContactModal } = useContactModal();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full ${
        scrolled
          ? "bg-[#0A0D14]/90 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_8px_30px_rgba(0,0,0,0.35)] py-3"
          : "bg-[#0A0D14]/40 backdrop-blur-md border-b border-white/[0.04] py-4"
      }`}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center shrink-0 group">
          <div className="relative h-8 w-32 sm:w-36 flex items-center">
            <Image
              src="/logos/logo-compact-dark.png"
              alt="ReLaunch.us Logo"
              width={160}
              height={32}
              priority
              className="object-contain object-left h-7 w-auto drop-shadow-xs transition-opacity group-hover:opacity-90 brightness-110"
            />
          </div>
        </Link>

        {/* Minimalist Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white/[0.04] px-4 py-1.5 rounded-full border border-white/[0.08] backdrop-blur-md">
          {navLinks.map((link) => {
            const isActive =
              link.href === "/"
                ? pathname === "/"
                : pathname?.startsWith(link.href);

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 px-3 text-[11px] xl:text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap group ${
                  isActive
                    ? "text-white font-bold"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                <span className="relative pb-0.5">
                  {link.label}
                  <span
                    className={`absolute bottom-0 left-0 right-0 h-[1.5px] rounded-full transition-all duration-200 ${
                      isActive
                        ? "bg-[#7F48ED] opacity-100 scale-x-100"
                        : "bg-[#7F48ED] opacity-0 scale-x-0 group-hover:opacity-70 group-hover:scale-x-100"
                    }`}
                  />
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Action Button & Contact */}
        <div className="hidden sm:flex items-center gap-4 xl:gap-6 shrink-0">
          <a
            href={contactInfo.phoneTel}
            className="hidden xl:inline-flex items-center gap-2 text-xs text-slate-300 hover:text-white font-mono transition-colors py-1.5 px-2.5 rounded-lg hover:bg-white/[0.05]"
          >
            <Phone className="w-3.5 h-3.5 text-[#FF6700]" />
            <span>{contactInfo.phoneFormatted}</span>
          </a>

          <button
            type="button"
            onClick={() => openContactModal({ intent: "strategy-session" })}
            className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-2.5 bg-[#FF6700] hover:bg-[#E55C00] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(255,103,0,0.35)] active:scale-98 cursor-pointer whitespace-nowrap"
          >
            <span>Book a Call</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-white" />
          </button>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2.5 rounded-xl bg-white/[0.08] text-white hover:bg-white/[0.15] transition-colors focus:outline-none border border-white/[0.1] shadow-xs shrink-0 cursor-pointer"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-nav-drawer"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="lg:hidden max-w-7xl mx-auto px-4 sm:px-6 mt-2 pointer-events-auto"
          >
            <div className="bg-[#0D111A]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-5 shadow-2xl overflow-hidden text-white">
              <div className="flex flex-col gap-1 mb-4">
                {navLinks.map((link) => {
                  const isActive =
                    link.href === "/"
                      ? pathname === "/"
                      : pathname?.startsWith(link.href);

                  return (
                    <Link
                      key={link.label}
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 text-xs font-semibold uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap ${
                        isActive
                          ? "bg-white/[0.1] text-white border-l-4 border-[#7F48ED]"
                          : "text-slate-300 hover:bg-white/[0.06] hover:text-white"
                      }`}
                    >
                      <span>{link.label}</span>
                      {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#7F48ED]" />}
                    </Link>
                  );
                })}
              </div>

              <div className="flex flex-col gap-2.5 pt-3 border-t border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openContactModal({ intent: "strategy-session" });
                  }}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-[#FF6700] hover:bg-[#E55C00] text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md whitespace-nowrap"
                >
                  <span>Book a Strategy Call</span>
                  <ArrowUpRight className="w-4 h-4 text-white" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
