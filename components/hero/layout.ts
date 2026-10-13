import type { Bezier, Point } from "./particles";
import type { EdgeId, NodeId } from "./scenarios";

export interface NodeDef {
  id: NodeId;
  /** Centre as a fraction of the stage width / height. */
  x: number;
  y: number;
}

/** Main lane at 40% height, fallback lane below it. Labels come from strings.ts. */
export const NODE_DEFS: readonly NodeDef[] = [
  { id: "document", x: 0.07, y: 0.4 },
  { id: "harden", x: 0.242, y: 0.4 },
  { id: "primary", x: 0.414, y: 0.4 },
  { id: "fallback", x: 0.5, y: 0.76 },
  { id: "recover", x: 0.586, y: 0.4 },
  { id: "validate", x: 0.758, y: 0.4 },
  { id: "output", x: 0.93, y: 0.4 },
];

export interface Box {
  left: number;
  top: number;
  right: number;
  bottom: number;
  cx: number;
  cy: number;
}

export interface StageGeometry {
  width: number;
  height: number;
  edges: Record<EdgeId, Bezier>;
}

function horizontal(a: Box, b: Box): Bezier {
  const p0: Point = { x: a.right, y: a.cy };
  const p3: Point = { x: b.left, y: b.cy };
  const dx = (p3.x - p0.x) * 0.5;
  return { p0, p1: { x: p0.x + dx, y: p0.y }, p2: { x: p3.x - dx, y: p3.y }, p3 };
}

/**
 * Builds the connector curves from measured node tiles. All coordinates are
 * CSS pixels relative to the stage, shared by the SVG paths and the canvas.
 */
export function computeGeometry(
  width: number,
  height: number,
  boxes: Record<NodeId, Box>
): StageGeometry {
  const { document, harden, primary, fallback, recover, validate, output } = boxes;

  const primaryFallback: Bezier = (() => {
    const p0 = { x: primary.cx + 4, y: primary.bottom };
    const p3 = { x: fallback.left, y: fallback.cy - 4 };
    return {
      p0,
      p1: { x: p0.x, y: p0.y + (p3.y - p0.y) * 0.65 },
      p2: { x: p0.x + (p3.x - p0.x) * 0.35, y: p3.y },
      p3,
    };
  })();

  const fallbackRecover: Bezier = (() => {
    const p0 = { x: fallback.right, y: fallback.cy - 4 };
    const p3 = { x: recover.cx - 4, y: recover.bottom };
    return {
      p0,
      p1: { x: p0.x + (p3.x - p0.x) * 0.65, y: p0.y },
      p2: { x: p3.x, y: p3.y + (p0.y - p3.y) * 0.35 },
      p3,
    };
  })();

  const validateFallback: Bezier = (() => {
    const p0 = { x: validate.cx, y: validate.bottom };
    const p3 = { x: fallback.right, y: fallback.cy + 6 };
    const floor = height - 6;
    return {
      p0,
      p1: { x: p0.x, y: floor },
      p2: { x: p3.x + (p0.x - p3.x) * 0.45, y: floor },
      p3,
    };
  })();

  return {
    width,
    height,
    edges: {
      "doc-harden": horizontal(document, harden),
      "harden-primary": horizontal(harden, primary),
      "primary-recover": horizontal(primary, recover),
      "primary-fallback": primaryFallback,
      "fallback-recover": fallbackRecover,
      "recover-validate": horizontal(recover, validate),
      "validate-output": horizontal(validate, output),
      "validate-fallback": validateFallback,
    },
  };
}
