"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/utils/cn";

export interface MotionFadeInProps extends HTMLMotionProps<"div"> {
  children: ReactNode;
  delay?: number;
  duration?: number;
  yOffset?: number;
}

export function MotionFadeIn({
  children,
  className,
  delay = 0,
  duration = 0.4,
  yOffset = 14,
  ...props
}: MotionFadeInProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}

