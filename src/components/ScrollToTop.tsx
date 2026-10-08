"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility, { passive: true });
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          key="scroll-to-top"
          onClick={scrollToTop}
          initial={{ opacity: 0, scale: 0.7, y: 20 }}
          animate={{
            opacity: 1,
            scale: 1,
            y: [0, -4, 0],
          }}
          exit={{ opacity: 0, scale: 0.7, y: 20 }}
          transition={{
            y: {
              repeat: Infinity,
              duration: 2.4,
              ease: "easeInOut",
            },
            duration: 0.25,
            ease: "easeOut",
          }}
          aria-label="Scroll to top"
          className="fixed bottom-10 left-6 sm:bottom-12 sm:left-8 z-40 p-3.5 rounded-2xl bg-white hover:bg-[#C0622A] text-slate-700 hover:text-white border border-slate-200/90 hover:border-[#C0622A] shadow-xl hover:shadow-[0_4px_20px_rgba(192,98,42,0.3)] transition-all duration-300 hover:scale-110 active:scale-95 group flex items-center justify-center cursor-pointer"
          style={{
            marginBottom: "max(0px, env(safe-area-inset-bottom, 0px))",
            marginLeft: "max(0px, env(safe-area-inset-left, 0px))",
          }}
        >
          <ArrowUp className="w-5 h-5 text-[#C0622A] group-hover:text-white transition-colors" />
          <span className="sr-only">Scroll to top</span>
        </motion.button>
      )}
    </AnimatePresence>
  );
}
