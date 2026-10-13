"use client";

import { memo, type Ref } from "react";
import { motion, type Transition } from "framer-motion";
import type { Tool } from "@/data/arsenal";
import { ToolTile } from "./tool-tile";

interface TileCellProps {
  /** Forwarded to the motion element so AnimatePresence (popLayout) can measure and pop it. */
  ref?: Ref<HTMLDivElement>;
  id: string;
  tool: Tool;
  categoryId: string;
  expanded: boolean;
  onToggle: (id: string) => void;
  reduceMotion: boolean;
  /** Changes only when the filter changes: layout is measured on those renders alone. */
  layoutDependency: string;
  transition: Transition;
}

/**
 * One grid cell: the layout-animated wrapper plus its tool tile. Memoised so
 * that expanding a tile re-renders two cells rather than the whole matrix, and
 * so that framer-motion only re-measures the matrix when the filter changes.
 */
export const TileCell = memo(function TileCell({
  ref,
  id,
  tool,
  categoryId,
  expanded,
  onToggle,
  reduceMotion,
  layoutDependency,
  transition,
}: TileCellProps) {
  return (
    <motion.div
      ref={ref}
      layout={reduceMotion ? false : "position"}
      layoutDependency={layoutDependency}
      initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={transition}
      className="min-w-0"
    >
      <ToolTile
        id={id}
        tool={tool}
        categoryId={categoryId}
        expanded={expanded}
        onToggle={() => onToggle(id)}
        reduceMotion={reduceMotion}
      />
    </motion.div>
  );
});
