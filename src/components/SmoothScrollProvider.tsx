"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";
import Lenis from "lenis";

interface ScrollContextType {
  lenis: Lenis | null;
  scrollProgress: number;
  scrollVelocity: number;
  activeSection: string;
  stopScroll: () => void;
  startScroll: () => void;
}

const ScrollContext = createContext<ScrollContextType>({
  lenis: null,
  scrollProgress: 0,
  scrollVelocity: 0,
  activeSection: "hero",
  stopScroll: () => {},
  startScroll: () => {},
});

export const useScrollContext = () => useContext(ScrollContext);

export default function SmoothScrollProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [scrollVelocity, setScrollVelocity] = useState(0);
  const [activeSection, setActiveSection] = useState("hero");
  const rafHandleRef = useRef<number | null>(null);
  const lenisRef = useRef<Lenis | null>(null);

  const stopScroll = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
  }, []);

  const startScroll = useCallback(() => {
    if (lenisRef.current) {
      lenisRef.current.start();
    }
  }, []);

  useEffect(() => {
    // Initialize Lenis with prevent callback for modals and overlays
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.5,
      infinite: false,
      prevent: (node) => {
        if (!node) return false;
        try {
          const el = node as HTMLElement;
          return Boolean(
            el.hasAttribute?.("data-lenis-prevent") ||
            el.closest?.("[data-lenis-prevent]") ||
            el.closest?.('[role="dialog"]') ||
            el.closest?.(".fixed.z-\\[998\\]") ||
            el.closest?.(".fixed.z-\\[999\\]") ||
            document.body.style.overflow === "hidden" ||
            document.documentElement.style.overflow === "hidden"
          );
        } catch {
          return false;
        }
      },
    });

    lenisRef.current = lenis;
    setLenisInstance(lenis);

    const onScroll = (e: any) => {
      const progress = e.progress || 0;
      const velocity = e.velocity || 0;
      setScrollProgress(progress);
      setScrollVelocity(velocity);
    };

    lenis.on("scroll", onScroll);

    function raf(time: number) {
      lenis.raf(time);
      rafHandleRef.current = requestAnimationFrame(raf);
    }

    rafHandleRef.current = requestAnimationFrame(raf);

    // Dynamic Mutation Observer to auto-pause Lenis when ANY modal is mounted or body is locked
    const checkModalState = () => {
      const isLocked =
        document.body.style.overflow === "hidden" ||
        document.documentElement.style.overflow === "hidden" ||
        document.querySelector("[data-lenis-prevent]") !== null;

      if (isLocked) {
        lenis.stop();
      } else {
        lenis.start();
      }
    };

    const observer = new MutationObserver(checkModalState);
    observer.observe(document.body, {
      attributes: true,
      childList: true,
      subtree: true,
      attributeFilter: ["style", "class"],
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["style", "class"],
    });

    // Section Observer for Active Section Tracking
    const sectionIds = [
      "hero",
      "two-doors",
      "services",
      "ai",
      "method",
      "work",
      "testimonials",
      "faq",
    ];

    const handleScrollTracking = () => {
      const scrollY = window.scrollY + window.innerHeight * 0.35;
      for (let i = sectionIds.length - 1; i >= 0; i--) {
        const el = document.getElementById(sectionIds[i]);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top = rect.top + window.scrollY;
          if (scrollY >= top) {
            setActiveSection(sectionIds[i]);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScrollTracking, { passive: true });
    handleScrollTracking();

    return () => {
      if (rafHandleRef.current) cancelAnimationFrame(rafHandleRef.current);
      observer.disconnect();
      lenis.destroy();
      lenisRef.current = null;
      window.removeEventListener("scroll", handleScrollTracking);
    };
  }, []);

  return (
    <ScrollContext.Provider
      value={{
        lenis: lenisInstance,
        scrollProgress,
        scrollVelocity,
        activeSection,
        stopScroll,
        startScroll,
      }}
    >
      {children}
    </ScrollContext.Provider>
  );
}
