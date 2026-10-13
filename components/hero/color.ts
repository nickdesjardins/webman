import type { Tone } from "./scenarios";

export type Rgb = readonly [number, number, number];

export interface TonePalette {
  /** Raw CSS colour strings as defined on :root (oklch). */
  css: Record<Tone, string> & { foreground: string; muted: string };
  /** The same colours resolved to 0..1 sRGB components. */
  rgb: Record<Tone, Rgb> & { foreground: Rgb; muted: Rgb };
}

const TOKENS: Record<Tone | "foreground" | "muted", string> = {
  primary: "--primary",
  success: "--success",
  warning: "--warning",
  destructive: "--destructive",
  foreground: "--foreground",
  muted: "--muted-foreground",
};

let probeContext: CanvasRenderingContext2D | null | undefined;

/**
 * Resolves any CSS colour the browser understands (including oklch) to sRGB
 * by painting one pixel. Used so canvas and WebGL layers share the exact
 * design tokens from globals.css instead of hard-coded hex values.
 */
export function cssColorToRgb(color: string): Rgb {
  if (probeContext === undefined) {
    const canvas = document.createElement("canvas");
    canvas.width = 1;
    canvas.height = 1;
    probeContext = canvas.getContext("2d", { willReadFrequently: true });
  }
  const ctx = probeContext;
  if (!ctx || !color) return [1, 1, 1];
  ctx.clearRect(0, 0, 1, 1);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return [r / 255, g / 255, b / 255];
}

/** Reads the semantic colour tokens as seen from `element`. */
export function readTonePalette(element: Element): TonePalette {
  const style = getComputedStyle(element);
  const css = {} as TonePalette["css"];
  const rgb = {} as TonePalette["rgb"];
  for (const key of Object.keys(TOKENS) as Array<keyof typeof TOKENS>) {
    const value = style.getPropertyValue(TOKENS[key]).trim() || "currentColor";
    css[key] = value;
    rgb[key] = cssColorToRgb(value);
  }
  return { css, rgb };
}
