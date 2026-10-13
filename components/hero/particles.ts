import type { TonePalette } from "./color";
import type { EdgeId, Tone } from "./scenarios";

export interface Point {
  x: number;
  y: number;
}

export interface Bezier {
  p0: Point;
  p1: Point;
  p2: Point;
  p3: Point;
}

export function bezierPath(b: Bezier): string {
  const f = (n: number) => n.toFixed(1);
  return `M ${f(b.p0.x)} ${f(b.p0.y)} C ${f(b.p1.x)} ${f(b.p1.y)}, ${f(b.p2.x)} ${f(b.p2.y)}, ${f(b.p3.x)} ${f(b.p3.y)}`;
}

function bezierAt(b: Bezier, t: number, out: Point): Point {
  const mt = 1 - t;
  const a = mt * mt * mt;
  const c = 3 * mt * mt * t;
  const d = 3 * mt * t * t;
  const e = t * t * t;
  out.x = a * b.p0.x + c * b.p1.x + d * b.p2.x + e * b.p3.x;
  out.y = a * b.p0.y + c * b.p1.y + d * b.p2.y + e * b.p3.y;
  return out;
}

interface Particle {
  edge: EdgeId;
  tone: Tone;
  born: number;
  duration: number;
  size: number;
  /** Lateral offset so a stream reads as a bundle, not a line of beads. */
  jitter: number;
}

const SPRITE = 64;
const TRAIL_STEPS = 3;

/** Deterministic PRNG so the stream looks the same across reloads. */
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeSprite(color: string, core: string): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = SPRITE;
  canvas.height = SPRITE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const c = SPRITE / 2;
  const rings: Array<[number, number]> = [
    [c, 0.05],
    [c * 0.72, 0.1],
    [c * 0.5, 0.2],
    [c * 0.32, 0.45],
    [c * 0.2, 0.85],
  ];
  ctx.fillStyle = color;
  for (const [radius, alpha] of rings) {
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(c, c, radius, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 0.9;
  ctx.fillStyle = core;
  ctx.beginPath();
  ctx.arc(c, c, c * 0.11, 0, Math.PI * 2);
  ctx.fill();
  return canvas;
}

/**
 * Canvas-2D token stream. Particles travel along cubic beziers that mirror
 * the SVG connectors; everything is drawn with pre-rendered glow sprites and
 * additive compositing so a frame costs a few dozen drawImage calls.
 */
export class ParticleSystem {
  private particles: Particle[] = [];
  private lastSpawn = new Map<EdgeId, number>();
  private sprites: Record<Tone, HTMLCanvasElement>;
  private random = mulberry32(7);
  private scratch: Point = { x: 0, y: 0 };

  constructor(
    palette: TonePalette,
    private readonly options: { trails: boolean; baseSize: number }
  ) {
    const core = palette.css.foreground;
    this.sprites = {
      primary: makeSprite(palette.css.primary, core),
      success: makeSprite(palette.css.success, core),
      warning: makeSprite(palette.css.warning, core),
      destructive: makeSprite(palette.css.destructive, core),
    };
  }

  reset() {
    this.particles.length = 0;
    this.lastSpawn.clear();
  }

  get count() {
    return this.particles.length;
  }

  /** Spawns one particle on `edge` when the per-edge interval has elapsed. */
  maybeSpawn(edge: EdgeId, tone: Tone, now: number, interval: number) {
    const last = this.lastSpawn.get(edge);
    if (last !== undefined && now - last < interval) return;
    this.lastSpawn.set(edge, now);
    const r = this.random;
    this.particles.push({
      edge,
      tone,
      born: now,
      duration: 620 + r() * 220,
      size: this.options.baseSize * (0.8 + r() * 0.5),
      jitter: (r() - 0.5) * 6,
    });
  }

  /** Advances and draws every particle. Coordinates are CSS pixels. */
  draw(
    ctx: CanvasRenderingContext2D,
    edges: Partial<Record<EdgeId, Bezier>>,
    now: number,
    width: number,
    height: number
  ) {
    ctx.clearRect(0, 0, width, height);
    if (this.particles.length === 0) return;
    ctx.globalCompositeOperation = "lighter";

    const trails = this.options.trails ? TRAIL_STEPS : 0;
    let write = 0;
    for (let i = 0; i < this.particles.length; i += 1) {
      const p = this.particles[i];
      const t = (now - p.born) / p.duration;
      if (t >= 1 || t < 0) continue;
      this.particles[write] = p;
      write += 1;

      const curve = edges[p.edge];
      if (!curve) continue;
      const sprite = this.sprites[p.tone];
      const envelope = Math.min(1, t / 0.12, (1 - t) / 0.18);

      for (let k = trails; k >= 0; k -= 1) {
        const tt = t - k * 0.035;
        if (tt < 0) continue;
        const eased = tt * tt * (3 - 2 * tt) * 0.45 + tt * 0.55;
        const pos = bezierAt(curve, eased, this.scratch);
        const scale = k === 0 ? 1 : 0.7 - k * 0.12;
        const size = p.size * scale * 2;
        ctx.globalAlpha = envelope * (k === 0 ? 1 : 0.35 / k);
        ctx.drawImage(
          sprite,
          pos.x - size / 2 + p.jitter * (1 - tt),
          pos.y - size / 2 + p.jitter * tt,
          size,
          size
        );
      }
    }
    this.particles.length = write;
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
  }
}
