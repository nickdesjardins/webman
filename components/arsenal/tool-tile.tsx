"use client";

import { useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { useLocale } from "@/components/locale-provider";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import type { Tool } from "@/data/arsenal";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { STRINGS } from "./strings";
import { categoryDot } from "./category-color";

interface ToolTileProps {
  /** Stable tile id ("category/name"), exposed as data-tool-id for the grid's delegated handlers. */
  id: string;
  tool: Tool;
  /** Category id, drives the tile's colour dot. */
  categoryId: string;
  /** Whether this tile's inline detail is open. The parent keeps one open at a time. */
  expanded: boolean;
  onToggle: () => void;
  /** Disables the height animation on the inline detail. */
  reduceMotion: boolean;
  className?: string;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Frame classes shared by the live tile and its motion-free twin in arsenal-grid.tsx. */
export function tileFrameClass(expanded: boolean, className?: string) {
  return cn(
    "group/tile flex h-full flex-col rounded-lg border bg-card transition-colors duration-200",
    expanded ? "border-primary/50 bg-accent/30" : "border-border/70 hover:border-border hover:bg-accent/30",
    className
  );
}

export const TILE_BUTTON_CLASS = "flex w-full flex-1 flex-col items-start gap-3 rounded-lg p-3 text-left";

interface TileFaceProps {
  tool: Tool;
  categoryId: string;
  /** Localised tier label, read by screen readers next to the colour dot. */
  tier: string;
}

/** The always-visible face of a tile: brand glyph, category dot, tier for screen readers, name. */
export function TileFace({ tool, categoryId, tier }: TileFaceProps) {
  return (
    <>
      <span className="flex w-full items-start justify-between gap-2">
        <span
          aria-hidden="true"
          className="text-foreground/85 transition-colors duration-200 group-hover/tile:text-primary group-data-[expanded=true]/tile:text-primary"
        >
          <BrandIcon sprite icon={tool.icon} mono={tool.mono} label={tool.name} className="size-7" />
        </span>
        <span className="mt-1 inline-flex shrink-0 items-center">
          <span aria-hidden="true" className={cn("size-1.5 rounded-full", categoryDot(categoryId))} />
          <span className="sr-only">{tier}</span>
        </span>
      </span>
      <span className="line-clamp-2 text-sm font-medium leading-snug break-words text-foreground">
        {tool.name}
      </span>
    </>
  );
}

/**
 * One instrument in the arsenal panel.
 *
 * The interactive surface is a disclosure button (icon, name, tier dot).
 * The detail panel is a sibling of the button, not a child, so the optional
 * external link is never nested inside another interactive element.
 * Desktop hover shows a tooltip; click, tap, Enter or Space toggles the
 * inline detail for touch and keyboard users.
 */
export function ToolTile({ id, tool, categoryId, expanded, onToggle, reduceMotion, className }: ToolTileProps) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const { tierLabel } = getContent(locale).arsenal;
  const detailId = useId();
  const [hover, setHover] = useState(false);
  const tier = tierLabel[tool.tier];

  return (
    <div data-expanded={expanded} data-tier={tool.tier} className={tileFrameClass(expanded, className)}>
      <Tooltip open={hover && !expanded} onOpenChange={setHover}>
        <TooltipTrigger asChild>
          <button
            type="button"
            aria-expanded={expanded}
            aria-controls={expanded ? detailId : undefined}
            data-tool-id={id}
            onClick={onToggle}
            className={TILE_BUTTON_CLASS}
          >
            <TileFace tool={tool} categoryId={categoryId} tier={tier} />
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-64 text-left">
          <p>{tool.context}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] opacity-70">{tier}</p>
        </TooltipContent>
      </Tooltip>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            key="detail"
            id={detailId}
            initial={reduceMotion ? false : { height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={reduceMotion ? { opacity: 0, transition: { duration: 0 } } : { height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: EASE }}
            className="overflow-hidden"
          >
            <div className="border-t border-border/60 px-3 pt-2.5 pb-3">
              <p className="text-xs leading-relaxed text-muted-foreground">{tool.context}</p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground/80">
                  {tier}
                </span>
                {tool.href && (
                  <a
                    href={tool.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${t.openWebsite(tool.name)} ${t.newTab}`}
                    onClick={(event) => event.stopPropagation()}
                    className="inline-flex size-6 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-primary"
                  >
                    <ExternalLink className="size-3.5" aria-hidden="true" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ToolTile;
