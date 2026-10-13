import { useCallback, useEffect, useState, useSyncExternalStore, type RefObject } from "react";

/**
 * Subscribes to a CSS media query. Server snapshot is `false` so a
 * server-rendered tree never assumes a client feature.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const media = window.matchMedia(query);
      media.addEventListener("change", onChange);
      return () => media.removeEventListener("change", onChange);
    },
    [query]
  );
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false
  );
}

function subscribeDocumentVisibility(onChange: () => void) {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
}

/** True while the tab is in the foreground. */
export function useDocumentVisible(): boolean {
  return useSyncExternalStore(
    subscribeDocumentVisibility,
    () => !document.hidden,
    () => true
  );
}

/**
 * True while the element intersects the viewport and the tab is visible.
 * Drives every animation loop in the hero so offscreen work is zero.
 */
export function useOnScreen(ref: RefObject<Element | null>, threshold = 0.12): boolean {
  const [intersecting, setIntersecting] = useState(false);
  const documentVisible = useDocumentVisible();

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[entries.length - 1];
        if (entry) setIntersecting(entry.isIntersecting);
      },
      { threshold }
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ref, threshold]);

  return intersecting && documentVisible;
}

/** Probe for a usable WebGL2 context without keeping one alive. */
export function hasWebGL2(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2", { failIfMajorPerformanceCaveat: true });
    if (!gl) return false;
    gl.getExtension("WEBGL_lose_context")?.loseContext();
    return true;
  } catch {
    return false;
  }
}

/**
 * Events that show the visitor is engaging; heavy decorative work may start
 * at once instead of waiting for the idle delay.
 */
const INTENT_EVENTS = ["pointerdown", "keydown", "touchstart", "wheel"] as const;

/**
 * True once the page has finished loading, `delayMs` has passed and the main
 * thread is idle, or earlier at the first sign of interaction. Decorative
 * work (the hero simulation, the Three.js field) waits for this so it never
 * competes with first paint, hydration and the visitor's first actions.
 */
export function useWhenIdle(delayMs: number): boolean {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (ready) return;
    let timer: number | undefined;
    let idle: number | undefined;
    const go = () => setReady(true);
    const schedule = () => {
      timer = window.setTimeout(() => {
        if ("requestIdleCallback" in window) idle = window.requestIdleCallback(go, { timeout: 2000 });
        else go();
      }, delayMs);
    };
    if (document.readyState === "complete") schedule();
    else window.addEventListener("load", schedule, { once: true });
    for (const type of INTENT_EVENTS) window.addEventListener(type, go, { once: true, passive: true });
    return () => {
      window.removeEventListener("load", schedule);
      for (const type of INTENT_EVENTS) window.removeEventListener(type, go);
      if (timer !== undefined) window.clearTimeout(timer);
      if (idle !== undefined && "cancelIdleCallback" in window) window.cancelIdleCallback(idle);
    };
  }, [delayMs, ready]);

  return ready;
}
