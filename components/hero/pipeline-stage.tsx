"use client";

import {
  BadgeCheck,
  Braces,
  BrainCircuit,
  FileText,
  GitBranch,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import { useCallback, useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";
import { readTonePalette } from "./color";
import { computeGeometry, NODE_DEFS, type Box, type StageGeometry } from "./layout";
import { bezierPath, ParticleSystem } from "./particles";
import { EDGE_IDS, phaseIndexAt, type NodeId, type Phase, type Scenario, type Tone } from "./scenarios";
import { heroStrings, nodeLabel } from "./strings";

export interface StageHandle {
  /** Called once per animation frame with the simulated elapsed time in ms. */
  frame(now: number): void;
}

interface PipelineStageProps {
  scenario: Scenario;
  phase: Phase;
  phaseIndex: number;
  runId: number;
  /** Final state only: no particles, no live clock. */
  reduced: boolean;
  /** Fewer particles and no trails (small viewports or no WebGL). */
  lightweight: boolean;
  ref?: Ref<StageHandle>;
  className?: string;
}

const ICONS: Record<NodeId, LucideIcon> = {
  document: FileText,
  harden: ShieldCheck,
  primary: BrainCircuit,
  fallback: GitBranch,
  recover: Wrench,
  validate: BadgeCheck,
  output: Braces,
};

const STROKE: Record<Tone, string> = {
  primary: "stroke-primary",
  success: "stroke-success",
  warning: "stroke-warning",
  destructive: "stroke-destructive",
};

const DOT: Record<Tone, string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  destructive: "bg-destructive",
};

const TEXT: Record<Tone, string> = {
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  destructive: "text-destructive",
};

/** Dashed lanes only carry traffic when a model call fails. */
const FAILURE_LANES = new Set<string>(["primary-fallback", "fallback-recover", "validate-fallback"]);

const TILE = cn(
  "relative grid size-[30px] place-items-center rounded-lg border border-border bg-card/90 text-muted-foreground shadow-sm transition-[color,border-color,background-color] duration-300 sm:size-9 lg:size-10",
  "group-data-[state=standby]:border-dashed group-data-[state=standby]:text-muted-foreground/60",
  "group-data-[state=active]:border-primary group-data-[state=active]:bg-primary/10 group-data-[state=active]:text-primary",
  "group-data-[state=active-warning]:border-warning group-data-[state=active-warning]:bg-warning/10 group-data-[state=active-warning]:text-warning",
  "group-data-[state=success]:border-success/70 group-data-[state=success]:text-success",
  "group-data-[state=warning]:border-warning/70 group-data-[state=warning]:text-warning",
  "group-data-[state=destructive]:border-destructive/80 group-data-[state=destructive]:bg-destructive/10 group-data-[state=destructive]:text-destructive"
);

const LABEL = cn(
  "font-mono text-[9px] uppercase tracking-wider text-muted-foreground transition-colors duration-300 sm:text-[10px]",
  "group-data-[state=standby]:text-muted-foreground/60",
  "group-data-[state=active]:text-primary",
  "group-data-[state=active-warning]:text-warning",
  "group-data-[state=success]:text-foreground/80",
  "group-data-[state=warning]:text-warning",
  "group-data-[state=destructive]:text-destructive"
);

/**
 * The pipeline graph: HTML node tiles positioned by fractions, SVG bezier
 * connectors measured from the tiles, and a 2D canvas on top for the token
 * particles. Node colours come from the phase; particles are drawn every
 * frame through the imperative `frame()` handle without touching React.
 */
export function PipelineStage({
  scenario,
  phase,
  phaseIndex,
  runId,
  reduced,
  lightweight,
  ref,
  className,
}: PipelineStageProps) {
  const t = heroStrings(useLocale());
  const stageRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clockRef = useRef<HTMLSpanElement>(null);
  const tileRefs = useRef<Partial<Record<NodeId, HTMLElement>>>({});
  const systemRef = useRef<ParticleSystem | null>(null);
  const geometryRef = useRef<StageGeometry | null>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const lastClockRef = useRef("");
  const [geometry, setGeometry] = useState<StageGeometry | null>(null);

  // Measure tiles and size the canvas whenever the stage resizes.
  useEffect(() => {
    const stage = stageRef.current;
    const canvas = canvasRef.current;
    if (!stage || !canvas) return;

    const observer = new ResizeObserver(() => {
      const rect = stage.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const boxes = {} as Record<NodeId, Box>;
      for (const def of NODE_DEFS) {
        const tile = tileRefs.current[def.id];
        if (!tile) return;
        const r = tile.getBoundingClientRect();
        const left = r.left - rect.left;
        const top = r.top - rect.top;
        boxes[def.id] = {
          left,
          top,
          right: left + r.width,
          bottom: top + r.height,
          cx: left + r.width / 2,
          cy: top + r.height / 2,
        };
      }
      const next = computeGeometry(rect.width, rect.height, boxes);
      geometryRef.current = next;
      setGeometry(next);

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        contextRef.current = ctx;
      }
    });
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  // Build the particle system from the live design tokens.
  useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    const palette = readTonePalette(stage);
    systemRef.current = new ParticleSystem(palette, {
      trails: !lightweight,
      baseSize: lightweight ? 5 : 6,
    });
    return () => {
      systemRef.current = null;
    };
  }, [lightweight, reduced]);

  // Fresh stream on every run.
  useEffect(() => {
    systemRef.current?.reset();
    const ctx = contextRef.current;
    const geo = geometryRef.current;
    if (ctx && geo) ctx.clearRect(0, 0, geo.width, geo.height);
    lastClockRef.current = "";
  }, [runId]);

  const spawnInterval = lightweight ? 170 : 95;

  const frame = useCallback(
    (now: number) => {
      const system = systemRef.current;
      const geo = geometryRef.current;
      const ctx = contextRef.current;
      if (!system || !geo || !ctx) return;

      const current = scenario.phases[phaseIndexAt(scenario, now)];
      if (now - current.start < current.flowMs) {
        for (const edge of current.edges) {
          system.maybeSpawn(edge.id, edge.tone, now, spawnInterval);
        }
      }
      system.draw(ctx, geo.edges, now, geo.width, geo.height);

      const clockEl = clockRef.current;
      if (clockEl) {
        const text = `t+${(Math.min(now, scenario.emitAt) / 1000).toFixed(2)}s`;
        if (text !== lastClockRef.current) {
          lastClockRef.current = text;
          clockEl.textContent = text;
        }
      }
    },
    [scenario, spawnInterval]
  );

  useImperativeHandle(ref, () => ({ frame }), [frame]);

  const flashKey = `${runId}-${phaseIndex}`;

  return (
    <div className={cn("relative h-full w-full", className)}>
      <div ref={stageRef} className="absolute inset-x-0 top-0 bottom-8">
        <svg aria-hidden className="absolute inset-0 h-full w-full overflow-visible">
          {geometry &&
            EDGE_IDS.map((id) => {
              const d = bezierPath(geometry.edges[id]);
              const activeTone = phase.edges.find((edge) => edge.id === id)?.tone;
              const litTone = phase.lit[id];
              const tone = activeTone ?? litTone;
              const dashed = FAILURE_LANES.has(id);
              return (
                <g key={id} fill="none">
                  <path
                    d={d}
                    className="stroke-border"
                    strokeWidth={1.25}
                    strokeDasharray={dashed ? "4 5" : undefined}
                    strokeLinecap="round"
                  />
                  <path
                    d={d}
                    className={cn(
                      "transition-opacity duration-500",
                      tone ? STROKE[tone] : "stroke-primary",
                      activeTone ? "opacity-80" : litTone ? "opacity-30" : "opacity-0"
                    )}
                    strokeWidth={1.5}
                    strokeLinecap="round"
                  />
                </g>
              );
            })}
        </svg>

        <canvas ref={canvasRef} aria-hidden className="absolute inset-0 h-full w-full" />

        {NODE_DEFS.map((def) => {
          const state = phase.nodes[def.id];
          const Icon = ICONS[def.id];
          const pinging = !reduced && (state === "active" || state === "active-warning");
          const flash = !reduced && phase.flash?.node === def.id ? phase.flash.tone : null;
          return (
            <div
              key={def.id}
              data-state={state}
              className="group absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-1"
              style={{ left: `${def.x * 100}%`, top: `${def.y * 100}%` }}
            >
              <span
                ref={(element) => {
                  tileRefs.current[def.id] = element ?? undefined;
                }}
                className={TILE}
              >
                {pinging && (
                  <span
                    aria-hidden
                    className="absolute -inset-px rounded-lg border border-current opacity-70 animate-ping motion-reduce:animate-none"
                  />
                )}
                {flash && (
                  <span
                    key={flashKey}
                    aria-hidden
                    className={cn(
                      "absolute -inset-1.5 rounded-xl bg-current opacity-50 animate-out fade-out zoom-out-95 fill-mode-forwards duration-700",
                      TEXT[flash]
                    )}
                  />
                )}
                <Icon className="relative size-3.5 sm:size-4" strokeWidth={1.75} />
              </span>
              <span className={LABEL}>{nodeLabel(t, def.id)}</span>
            </div>
          );
        })}

        {phase.note && (
          <div
            key={`${runId}-note`}
            className={cn(
              "absolute right-[2%] top-[calc(40%+32px)] max-w-[70%] rounded-md border border-success/40 bg-success/10 px-2 py-1 font-mono text-[9px] leading-tight text-success sm:top-[calc(40%+38px)] lg:top-[calc(40%+42px)]",
              !reduced && "animate-in fade-in slide-in-from-top-1 duration-500"
            )}
          >
            {phase.note}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 flex h-8 items-center gap-2 border-t border-border/40 bg-background/40 px-3 font-mono text-[10px] text-muted-foreground backdrop-blur-sm">
        <span className={cn("size-1.5 shrink-0 rounded-full", DOT[phase.tone])} />
        <span className="truncate">{phase.status}</span>
        <span ref={clockRef} className="ml-auto shrink-0 tabular-nums text-muted-foreground/70">
          {reduced ? `t+${(scenario.emitAt / 1000).toFixed(2)}s` : "t+0.00s"}
        </span>
      </div>
    </div>
  );
}
