"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { navLinks, contactInfo } from "@/data/navigation";
import { useContactModal } from "@/context/ContactModalContext";
import { Menu, X, ArrowUpRight, Phone, ChevronDown } from "lucide-react";

export default function Navbar() {
  const { openContactModal } = useContactModal();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [productsDropdownOpen, setProductsDropdownOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 25);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setProductsDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setProductsDropdownOpen(false);
    }, 150);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full bg-[#090D16] border-b border-white/[0.08] shadow-[0_4px_25px_rgba(0,0,0,0.35)] ${
        scrolled ? "py-2.5" : "py-3.5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo & Strapline */}
        <Link href="/" className="flex flex-col items-center justify-center shrink-0 group">
          <div className="relative h-7 w-32 sm:w-36 flex items-center justify-center">
            <Image
              src="/logos/logo-compact-dark.png"
              alt="ReLaunch.us Logo"
              width={160}
              height={28}
              priority
              className="object-contain object-center h-6.5 w-auto drop-shadow-xs transition-opacity group-hover:opacity-90 brightness-110"
            />
          </div>
          <span className="hidden sm:block text-[9px] font-medium tracking-tight text-slate-400 group-hover:text-slate-300 transition-colors whitespace-nowrap mt-0.5 select-none text-center">
            Marketing Strategically Designed to Sell.
          </span>
        </Link>

        {/* Minimalist Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2 bg-white/[0.04] px-4 py-1.5 rounded-full border border-white/[0.08] backdrop-blur-md">
          {navLinks.map((link) => {
            const hasChildren = link.children && link.children.length > 0;
            const isChildActive =
              hasChildren &&
              link.children?.some(
                (child) => pathname === child.href || pathname?.startsWith(child.href + "/")
              );
            const isActive = hasChildren
              ? Boolean(isChildActive)
              : link.href === "/"
                ? pathname === "/"
                : pathname === link.href || pathname?.startsWith(link.href + "/");

            if (hasChildren) {
              return (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={handleDropdownEnter}
                  onMouseLeave={handleDropdownLeave}
                >
                  <button
                    type="button"
                    onClick={() => setProductsDropdownOpen(!productsDropdownOpen)}
                    className={`relative py-1 px-2.5 xl:px-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap group inline-flex items-center gap-1 cursor-pointer ${
                      isActive || productsDropdownOpen
                        ? "text-white font-bold"
                        : "text-slate-300 hover:text-white"
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 transition-transform duration-200 ${
                        productsDropdownOpen ? "rotate-180 text-[#7F48ED]" : "text-slate-400"
                      }`}
                    />
                    <span
                      className={`absolute bottom-0 left-2.5 right-2.5 h-[1.5px] rounded-full transition-all duration-200 ${
                        isActive
                          ? "bg-[#7F48ED] opacity-100 scale-x-100"
                          : "bg-[#7F48ED] opacity-0 scale-x-0 group-hover:opacity-70 group-hover:scale-x-100"
                      }`}
                    />
                  </button>

                  <AnimatePresence>
                    {productsDropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-56 p-1.5 rounded-2xl bg-[#090D16]/95 backdrop-blur-2xl border border-white/[0.12] shadow-2xl z-50 flex flex-col gap-0.5"
                      >
                        {link.children?.map((child) => {
                          const isExternal = child.external || child.href.startsWith("http");
                          if (isExternal) {
                            return (
                              <a
                                key={child.label}
                                href={child.href}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={() => setProductsDropdownOpen(false)}
                                className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all text-left group/item cursor-pointer"
                              >
                                <span className="text-xs font-semibold text-slate-200 group-hover/item:text-[#FF6700] transition-colors">
                                  {child.label}
                                </span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-[#FF6700] group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all opacity-40 group-hover/item:opacity-100" />
                              </a>
                            );
                          }
                          return (
                            <Link
                              key={child.label}
                              href={child.href}
                              onClick={() => setProductsDropdownOpen(false)}
                              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-white/[0.08] transition-all text-left group/item cursor-pointer"
                            >
                              <span className="text-xs font-semibold text-slate-200 group-hover/item:text-[#FF6700] transition-colors">
                                {child.label}
                              </span>
                              <ArrowUpRight className="w-3.5 h-3.5 text-slate-500 group-hover/item:text-[#FF6700] group-hover/item:translate-x-0.5 group-hover/item:-translate-y-0.5 transition-all opacity-40 group-hover/item:opacity-100" />
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            }

            return (
              <Link
                key={link.label}
                href={link.href}
                className={`relative py-1 px-2.5 xl:px-3 text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap group ${
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
        <div className="hidden sm:flex items-center gap-3 xl:gap-5 shrink-0">
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
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#FF6700] hover:bg-[#E55C00] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-200 shadow-[0_0_20px_rgba(255,103,0,0.35)] active:scale-98 cursor-pointer whitespace-nowrap shrink-0"
          >
            <span>Book a Strategy Call</span>
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
            <div className="bg-[#0D111A]/95 backdrop-blur-2xl border border-white/[0.12] rounded-2xl p-5 shadow-2xl overflow-hidden text-white max-h-[85vh] overflow-y-auto">
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-widest text-center pb-2.5 mb-3 border-b border-white/[0.08]">
                Marketing Strategically Designed to Sell.
              </div>

              <div className="flex flex-col gap-1 mb-4">
                {navLinks.map((link) => {
                  const hasChildren = link.children && link.children.length > 0;
                  const isChildActive =
                    hasChildren &&
                    link.children?.some(
                      (child) => pathname === child.href || pathname?.startsWith(child.href + "/")
                    );
                  const isActive = hasChildren
                    ? Boolean(isChildActive)
                    : link.href === "/"
                      ? pathname === "/"
                      : pathname === link.href || pathname?.startsWith(link.href + "/");

                  if (hasChildren) {
                    return (
                      <div key={link.label} className="flex flex-col py-1">
                        <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                          {link.label}
                        </div>
                        <div className="pl-3 flex flex-col gap-1 border-l-2 border-white/[0.08] ml-4">
                          {link.children?.map((child) => {
                            const isExternal = child.external || child.href.startsWith("http");
                            if (isExternal) {
                              return (
                                <a
                                  key={child.label}
                                  href={child.href}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() => setMobileMenuOpen(false)}
                                  className="px-3 py-2 text-xs font-semibold rounded-lg text-slate-200 hover:bg-white/[0.08] hover:text-[#FF6700] transition-colors flex items-center justify-between"
                                >
                                  <span>{child.label}</span>
                                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                                </a>
                              );
                            }
                            return (
                              <Link
                                key={child.label}
                                href={child.href}
                                onClick={() => setMobileMenuOpen(false)}
                                className="px-3 py-2 text-xs font-semibold rounded-lg text-slate-200 hover:bg-white/[0.08] hover:text-[#FF6700] transition-colors flex items-center justify-between"
                              >
                                <span>{child.label}</span>
                                <ArrowUpRight className="w-3.5 h-3.5 text-slate-500" />
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    );
                  }

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

                <a
                  href={contactInfo.phoneTel}
                  className="w-full flex items-center justify-center gap-2 py-2 text-xs text-slate-400 hover:text-white font-mono"
                >
                  <Phone className="w-3.5 h-3.5 text-[#FF6700]" />
                  <span>{contactInfo.phoneFormatted}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
