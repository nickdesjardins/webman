"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * Thin page-progress bar pinned to the top edge, above the fixed header.
 * Transform-only animation (scaleX) driven by scroll position through a
 * spring. Hidden entirely under prefers-reduced-motion.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 160,
    damping: 32,
    mass: 0.4,
    restDelta: 0.001,
  });

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed top-0 left-0 right-0 z-[60] h-0.5 origin-left bg-primary will-change-transform motion-reduce:hidden"
    />
  );
}
