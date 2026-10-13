import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n";
import {
  DEFAULT_SCENARIO_ID,
  getScenario,
  nextScenarioId,
  type Phase,
  type Scenario,
  type ScenarioId,
} from "./scenarios";

/** How long a manual scenario pick suspends autoplay. */
export const AUTOPLAY_SUSPEND_MS = 30_000;

/** Pause-aware simulated clock shared with the render loops. */
export interface SimClock {
  /** Milliseconds since the current run started, frozen while paused. */
  elapsed(): number;
}

export interface Simulation {
  scenario: Scenario;
  phase: Phase;
  phaseIndex: number;
  /** Increments on every (re)start so children can reset per-run DOM state. */
  runId: number;
  autoplaySuspended: boolean;
  clock: SimClock;
  select(id: ScenarioId): void;
}

interface RunState {
  id: ScenarioId;
  runId: number;
}

interface Options {
  /** False while offscreen or the tab is hidden: timers and the clock freeze. */
  active: boolean;
  /** prefers-reduced-motion: show the final state of the current scenario, no timers. */
  reduced: boolean;
  /** Picks the localized copy. Timings are identical in every locale. */
  locale: Locale;
}

/**
 * Small timestamp-driven state machine. Each phase boundary is a single
 * setTimeout computed from the run start, so React only re-renders on
 * phase changes (a handful per run), never per frame.
 */
export function useSimulation({ active, reduced, locale }: Options): Simulation {
  const [run, setRun] = useState<RunState>({ id: DEFAULT_SCENARIO_ID, runId: 0 });
  const [rawPhaseIndex, setRawPhaseIndex] = useState(0);
  const [autoplaySuspended, setAutoplaySuspended] = useState(false);

  const startRef = useRef<number | null>(null);
  const pausedAtRef = useRef<number | null>(null);
  const autoplayUntilRef = useRef(0);

  const scenario = getScenario(locale, run.id);
  const lastIndex = scenario.phases.length - 1;
  const phaseIndex = reduced ? lastIndex : Math.min(rawPhaseIndex, lastIndex);
  const phase = scenario.phases[phaseIndex];

  const clock = useMemo<SimClock>(
    () => ({
      elapsed() {
        const start = startRef.current;
        if (start === null) return 0;
        return (pausedAtRef.current ?? performance.now()) - start;
      },
    }),
    []
  );

  const startRun = useCallback((id: ScenarioId) => {
    startRef.current = performance.now();
    pausedAtRef.current = null;
    setRun((previous) => ({ id, runId: previous.runId + 1 }));
    setRawPhaseIndex(0);
  }, []);

  const select = useCallback(
    (id: ScenarioId) => {
      autoplayUntilRef.current = performance.now() + AUTOPLAY_SUSPEND_MS;
      setAutoplaySuspended(true);
      startRun(id);
    },
    [startRun]
  );

  // A locale switch re-arms the pending timer with the same remaining delay
  // (phase timings do not depend on the locale), so the run is not disturbed.
  useEffect(() => {
    if (reduced) return;
    const now = performance.now();

    if (!active) {
      if (startRef.current !== null && pausedAtRef.current === null) {
        pausedAtRef.current = now;
      }
      return;
    }

    if (startRef.current === null) {
      startRef.current = now;
    } else if (pausedAtRef.current !== null) {
      startRef.current += now - pausedAtRef.current;
      pausedAtRef.current = null;
    }

    const current = getScenario(locale, run.id);
    const elapsed = now - startRef.current;
    const next = rawPhaseIndex + 1;

    let delay: number;
    let fire: () => void;
    if (next < current.phases.length) {
      delay = current.phases[next].start - elapsed;
      fire = () => setRawPhaseIndex(next);
    } else {
      const resumeIn = autoplayUntilRef.current - now;
      delay = Math.max(current.total - elapsed, resumeIn);
      fire = () => {
        setAutoplaySuspended(false);
        startRun(nextScenarioId(current.id));
      };
    }

    const timer = setTimeout(fire, Math.max(0, delay));
    return () => clearTimeout(timer);
  }, [active, reduced, locale, run.id, run.runId, rawPhaseIndex, startRun]);

  return {
    scenario,
    phase,
    phaseIndex,
    runId: run.runId,
    autoplaySuspended,
    clock,
    select,
  };
}
