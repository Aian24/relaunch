"use client";

import { useEffect, useState, useRef } from "react";
import { useInView } from "framer-motion";

interface NumberCounterProps {
  value: number | string;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  immediate?: boolean;
}

export default function NumberCounter({
  value,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals,
  className = "",
  immediate = false,
}: NumberCounterProps) {
  // Parse string values if provided (e.g. "+240%", "3.8x", "1,500+", "+340% YoY", "450,000+")
  let targetNumber = 0;
  let parsedPrefix = prefix;
  let parsedSuffix = suffix;
  let parsedDecimals = decimals ?? 0;
  let isStaticString = false;

  if (typeof value === "number") {
    targetNumber = value;
  } else {
    const trimmed = String(value).trim();
    // Match prefix, number with commas/decimals, and suffix
    const match = trimmed.match(/^([^0-9.-]*)([-+]?[0-9,]+(?:\.[0-9]+)?)(.*)$/);
    if (match) {
      if (!prefix && match[1]) parsedPrefix = match[1];
      const rawNum = match[2].replace(/,/g, "");
      targetNumber = parseFloat(rawNum);
      if (!suffix && match[3]) parsedSuffix = match[3];

      if (decimals === undefined) {
        const dotIdx = rawNum.indexOf(".");
        parsedDecimals = dotIdx !== -1 ? rawNum.length - dotIdx - 1 : 0;
      }
    } else {
      isStaticString = true;
    }
  }

  const [displayValue, setDisplayValue] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);

  // Positive root margin (80px) so it triggers smoothly before or upon viewport entry
  const isInView = useInView(ref, { once: true, margin: "80px" });

  useEffect(() => {
    if (isStaticString) return;

    // Trigger if immediate is true, if in view, or if already in viewport rect
    const isAlreadyInViewport =
      typeof window !== "undefined" &&
      ref.current !== null &&
      ref.current.getBoundingClientRect().top < window.innerHeight &&
      ref.current.getBoundingClientRect().bottom > 0;

    const shouldStart = immediate || isInView || isAlreadyInViewport;

    if (shouldStart && !hasStarted) {
      setHasStarted(true);

      let startTime: number | null = null;
      let animationFrame: number;

      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

        // Easing: easeOutExpo
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = easeProgress * targetNumber;

        setDisplayValue(current);

        if (progress < 1) {
          animationFrame = requestAnimationFrame(step);
        } else {
          setDisplayValue(targetNumber);
        }
      };

      animationFrame = requestAnimationFrame(step);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [isInView, immediate, hasStarted, targetNumber, duration, isStaticString]);

  // Safety fallback: if for any reason the counter hasn't started or reached target after 1.2s, force real value so it NEVER shows 0
  useEffect(() => {
    if (isStaticString) return;
    const timer = setTimeout(() => {
      setDisplayValue((prev) => (prev === 0 ? targetNumber : prev));
    }, 1200);
    return () => clearTimeout(timer);
  }, [targetNumber, isStaticString]);

  if (isStaticString) {
    return <span className={className}>{value}</span>;
  }

  const formattedNumber =
    parsedDecimals > 0
      ? displayValue.toFixed(parsedDecimals)
      : Math.floor(displayValue).toLocaleString();

  return (
    <span ref={ref} className={className}>
      {parsedPrefix}
      {formattedNumber}
      {parsedSuffix}
    </span>
  );
}
