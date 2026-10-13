"use client";

import { useLocale } from "@/components/locale-provider";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";

interface AvailabilityBadgeProps {
  /** "full" renders site.availability.label; "compact" renders site.availability.short. */
  variant?: "full" | "compact";
  className?: string;
}

/**
 * Availability pill linking to the contact section. Server Component: no
 * state, the pulse is pure CSS and is disabled under prefers-reduced-motion.
 * Rendered by both the header (client) and the footer (server), so the
 * locale arrives as a prop rather than through context.
 */
export function AvailabilityBadge({ variant = "compact", className }: AvailabilityBadgeProps) {
  const locale = useLocale();
  const { availability } = getContent(locale).site;
  const text = variant === "full" ? availability.label : availability.short;
  return (
    <a
      href="#contact"
      title={availability.label}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium whitespace-nowrap text-success transition-colors hover:bg-success/15",
        className
      )}
    >
      <span className="relative flex size-2 shrink-0" aria-hidden="true">
        <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75 motion-reduce:hidden" />
        <span className="relative inline-flex size-2 rounded-full bg-success" />
      </span>
      <span>{text}</span>
    </a>
  );
}
