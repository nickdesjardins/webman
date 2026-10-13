import { getBrandIcon } from "@/lib/icons";
import { cn } from "@/lib/utils";

/** Built by scripts/brand-sprite.mjs from the arsenal data; served from /public. */
const SPRITE_URL = "/brand-sprite.svg";

interface BrandIconProps {
  /** simple-icons key, e.g. "siPython". Inline icons must also exist in lib/icons.ts. */
  icon?: string;
  /** Monogram fallback; defaults to the first letters of `label`. */
  mono?: string;
  label: string;
  className?: string;
  /** Use the brand colour instead of currentColor (inline icons only). */
  tinted?: boolean;
  /**
   * Reference the glyph from the shared sprite instead of inlining its path.
   * The arsenal's 124 brand paths would otherwise add 65 KB (gzip) to the HTML
   * and as much again to the bundle; the sprite ships them once, cached.
   */
  sprite?: boolean;
}

function initials(label: string) {
  const words = label.replace(/[()/]/g, " ").split(" ").filter(Boolean);
  const letters = words.slice(0, 2).map((w) => w[0]?.toUpperCase() ?? "");
  return letters.join("") || label.slice(0, 2).toUpperCase();
}

/**
 * Renders a simple-icons brand glyph when one exists, otherwise a clean
 * typographic monogram so every tile in a grid has the same visual weight.
 */
export function BrandIcon({ icon, mono, label, className, tinted, sprite }: BrandIconProps) {
  const svgClass = cn("size-6 shrink-0 fill-current", className);
  if (sprite && icon && !mono) {
    return (
      <svg role="img" aria-label={label} viewBox="0 0 24 24" className={svgClass}>
        <use href={`${SPRITE_URL}#${icon}`} />
      </svg>
    );
  }
  const svg = getBrandIcon(icon);
  if (svg && !mono) {
    return (
      <svg
        role="img"
        aria-label={label}
        viewBox="0 0 24 24"
        className={svgClass}
        style={tinted ? { color: `#${svg.hex}` } : undefined}
      >
        <path d={svg.path} />
      </svg>
    );
  }
  return (
    <span
      role="img"
      aria-label={label}
      className={cn(
        "inline-flex size-6 shrink-0 items-center justify-center rounded-md border border-border/70 bg-secondary font-mono text-[10px] font-semibold tracking-tight text-foreground/90",
        className
      )}
    >
      {mono ?? initials(label)}
    </span>
  );
}
