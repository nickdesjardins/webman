"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";
import type { PointerState } from "./embedding-field";
import { JsonPanel, type JsonPanelHandle } from "./json-panel";
import { PipelineStage, type StageHandle } from "./pipeline-stage";
import { getScenarios } from "./scenarios";
import { heroStrings } from "./strings";
import { hasWebGL2, useMediaQuery, useOnScreen, useWhenIdle } from "./use-media";
import { useSimulation } from "./use-simulation";

/** Three.js is only fetched when the viewport and GPU qualify. */
const EmbeddingField = dynamic(() => import("./embedding-field"), {
  ssr: false,
  loading: () => null,
});

/**
 * Extraction Pipeline Simulator. Owns the state machine, the visibility
 * gating and the single requestAnimationFrame loop; children render from
 * phase state and receive per-frame ticks through imperative handles.
 */
export default function PipelineSim({ className }: { className?: string }) {
  const locale = useLocale();
  const t = heroStrings(locale);
  const scenarios = getScenarios(locale);

  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<StageHandle>(null);
  const jsonRef = useRef<JsonPanelHandle>(null);
  const pointerRef = useRef<PointerState>({ x: 0, y: 0 });

  const reduced = useMediaQuery("(prefers-reduced-motion: reduce)");
  const wide = useMediaQuery("(min-width: 768px)");
  const [webgl] = useState(() => hasWebGL2());
  const onScreen = useOnScreen(rootRef);
  const running = onScreen && !reduced;
  /* Three.js (about 240 KB compressed) waits a little longer than the simulation itself. */
  const fieldReady = useWhenIdle(2500);

  const sim = useSimulation({ active: running, reduced, locale });
  const showField = wide && webgl && !reduced && fieldReady;
  const lightweight = !showField;

  // One loop for particles, typing and the clock. Stops when offscreen.
  const { clock } = sim;
  useEffect(() => {
    if (!running) return;
    let handle = 0;
    const loop = () => {
      handle = requestAnimationFrame(loop);
      const now = clock.elapsed();
      stageRef.current?.frame(now);
      jsonRef.current?.frame(now);
    };
    handle = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(handle);
  }, [running, clock]);

  // Pointer parallax for the embedding field; written to a ref, read in the GL loop.
  useEffect(() => {
    const root = rootRef.current;
    if (!root || !showField) return;
    const pointer = pointerRef.current;
    const onMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -(((event.clientY - rect.top) / rect.height) * 2 - 1);
    };
    const onLeave = () => {
      pointer.x = 0;
      pointer.y = 0;
    };
    root.addEventListener("pointermove", onMove, { passive: true });
    root.addEventListener("pointerleave", onLeave);
    return () => {
      root.removeEventListener("pointermove", onMove);
      root.removeEventListener("pointerleave", onLeave);
    };
  }, [showField]);

  const autoplayLabel = reduced
    ? t.autoplayStatic
    : sim.autoplaySuspended
      ? t.autoplayPaused
      : t.autoplay;

  return (
    <div ref={rootRef} className={cn("flex h-full w-full flex-col", className)}>
      <div
        role="group"
        aria-label={t.scenarioGroup}
        className="flex items-center gap-1.5 overflow-x-auto border-b border-border/50 px-2 py-2 [scrollbar-width:none]"
      >
        {scenarios.map((scenario) => {
          const pressed = scenario.id === sim.scenario.id;
          return (
            <button
              key={scenario.id}
              type="button"
              aria-pressed={pressed}
              onClick={() => sim.select(scenario.id)}
              className={cn(
                "shrink-0 rounded-md border px-2.5 py-1 font-mono text-[11px] whitespace-nowrap transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
                pressed
                  ? "border-primary/60 bg-primary/10 text-primary"
                  : "border-border/60 bg-card/60 text-muted-foreground hover:border-border hover:text-foreground"
              )}
            >
              {scenario.label}
            </button>
          );
        })}
        <span className="ml-auto hidden shrink-0 pl-2 font-mono text-[10px] text-muted-foreground/70 sm:inline">
          {autoplayLabel}
        </span>
      </div>

      <div
        role="img"
        aria-label={t.panel}
        className="relative flex min-h-0 flex-1 flex-col lg:flex-row"
      >
        <div className="relative min-h-0 flex-1 bg-dots">
          {showField && (
            <EmbeddingField
              active={running}
              cluster={sim.scenario.cluster}
              runId={sim.runId}
              pointer={pointerRef}
            />
          )}
          <PipelineStage
            ref={stageRef}
            scenario={sim.scenario}
            phase={sim.phase}
            phaseIndex={sim.phaseIndex}
            runId={sim.runId}
            reduced={reduced}
            lightweight={lightweight}
            className="absolute inset-0"
          />
        </div>
        <JsonPanel
          ref={jsonRef}
          scenario={sim.scenario}
          runId={sim.runId}
          emitting={sim.phase.emit}
          reduced={reduced}
          className="h-[184px] shrink-0 border-t border-border/50 bg-background/55 lg:h-auto lg:w-[42%] lg:border-t-0 lg:border-l"
        />
      </div>

      <p className="sr-only" aria-live="polite">
        {sim.phase.emit ? sim.scenario.announcement : ""}
      </p>
    </div>
  );
}
