"use client";

import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right" | "right-to-left" | "none";
  distance?: number;
  className?: string;
  withBlur?: boolean;
  once?: boolean;
}

export default function MotionWrapper({
  children,
  delay = 0,
  duration = 0.65,
  direction = "up",
  distance = 28,
  className = "",
  withBlur = true,
  once = false,
  ...props
}: MotionWrapperProps) {
  const getInitialPosition = () => {
    switch (direction) {
      case "up":
        return { y: distance, x: 0 };
      case "down":
        return { y: -distance, x: 0 };
      case "left":
      case "right-to-left":
        return { x: distance, y: 0 };
      case "right":
        return { x: -distance, y: 0 };
      case "none":
        return { x: 0, y: 0 };
    }
  };

  const initialOffset = getInitialPosition();

  return (
    <motion.div
      initial={{
        opacity: 0,
        scale: 0.98,
        filter: withBlur ? "blur(4px)" : "none",
        ...initialOffset,
      }}
      whileInView={{
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        x: 0,
        y: 0,
      }}
      viewport={{ once, margin: "-40px", amount: 0.12 }}
      transition={{
        duration,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}
