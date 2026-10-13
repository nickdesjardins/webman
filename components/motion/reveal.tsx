"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface RevealProps extends Omit<HTMLMotionProps<"div">, "children"> {
  children?: React.ReactNode;
  /** Stagger index; multiplies the base delay. */
  index?: number;
  /** Base delay in seconds between staggered siblings. */
  step?: number;
  /** Vertical travel in px. */
  y?: number;
  once?: boolean;
}

/**
 * Scroll-triggered fade-up. Honors prefers-reduced-motion by rendering
 * the final state immediately with no transform.
 */
export function Reveal({
  index = 0,
  step = 0.08,
  y = 24,
  once = true,
  className,
  children,
  ...props
}: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) {
    const { id, style, role } = props;
    return (
      <div id={id} role={role} style={style as React.CSSProperties | undefined} className={className}>
        {children}
      </div>
    );
  }
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: "0px 0px -10% 0px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: index * step }}
      className={cn(className)}
      {...props}
    >
      {children}
    </motion.div>
  );
}
