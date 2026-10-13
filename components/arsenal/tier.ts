import type { ToolTier } from "@/data/arsenal";

/** Display order for the tier legend. Labels come from the locale's `tierLabel`. */
export const tierOrder: readonly ToolTier[] = ["production", "active", "evaluating", "legacy"];

/**
 * Tier indicator colours. Semantic tokens only:
 * success = shipped, primary = in the active build plan, muted = benchmarked,
 * dimmer muted = used professionally and since retired.
 */
export const tierDotClass: Record<ToolTier, string> = {
  production: "bg-success ring-[3px] ring-success/15",
  active: "bg-primary ring-[3px] ring-primary/15",
  evaluating: "bg-muted-foreground/70 ring-[3px] ring-muted-foreground/10",
  legacy: "bg-muted-foreground/50 ring-[3px] ring-muted-foreground/10",
};
