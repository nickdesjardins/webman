"use client";

import { useCallback, useImperativeHandle, useLayoutEffect, useMemo, useRef, type Ref } from "react";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/utils";
import type { Scenario } from "./scenarios";
import { heroStrings } from "./strings";

export interface JsonPanelHandle {
  /** Called once per animation frame with the simulated elapsed time in ms. */
  frame(now: number): void;
}

interface JsonPanelProps {
  scenario: Scenario;
  runId: number;
  /** True once the run has reached its emit phase (drives the footer and status). */
  emitting: boolean;
  /** Static mode: everything fully visible, scrollable, no caret. */
  reduced: boolean;
  ref?: Ref<JsonPanelHandle>;
  className?: string;
}

const CHARS_PER_SECOND = 560;
/** Pause between lines, expressed in characters of budget. */
const LINE_GAP_CHARS = 3;
const COUNTER_MS = 900;

type TokenKind = "key" | "string" | "number" | "literal" | "punct" | "space";

interface Token {
  kind: TokenKind;
  text: string;
}

const TOKEN_RE =
  /("(?:[^"\\]|\\.)*")(\s*:)?|(-?\d+(?:\.\d+)?)|\b(true|false|null)\b|([{}[\],:])|(\s+)/g;

function tokenize(line: string): Token[] {
  const out: Token[] = [];
  let last = 0;
  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = TOKEN_RE.exec(line)) !== null) {
    if (match.index > last) out.push({ kind: "punct", text: line.slice(last, match.index) });
    if (match[1] !== undefined) {
      if (match[2] !== undefined) {
        out.push({ kind: "key", text: match[1] });
        out.push({ kind: "punct", text: match[2] });
      } else {
        out.push({ kind: "string", text: match[1] });
      }
    } else if (match[3] !== undefined) {
      out.push({ kind: "number", text: match[3] });
    } else if (match[4] !== undefined) {
      out.push({ kind: "literal", text: match[4] });
    } else if (match[5] !== undefined) {
      out.push({ kind: "punct", text: match[5] });
    } else if (match[6] !== undefined) {
      out.push({ kind: "space", text: match[6] });
    }
    last = TOKEN_RE.lastIndex;
  }
  if (last < line.length) out.push({ kind: "punct", text: line.slice(last) });
  return out;
}

const TOKEN_CLASS: Record<TokenKind, string> = {
  key: "text-muted-foreground",
  string: "text-foreground",
  number: "text-primary",
  literal: "text-warning",
  punct: "text-muted-foreground/50",
  space: "",
};

interface TypingState {
  started: boolean;
  done: boolean;
  revealed: number[];
  tops: number[];
  lineHeight: number;
  viewportHeight: number;
  lastMs: number;
  scroll: number;
}

function freshState(lineCount: number): TypingState {
  return {
    started: false,
    done: false,
    revealed: new Array<number>(lineCount).fill(0),
    tops: [],
    lineHeight: 16,
    viewportHeight: 0,
    lastMs: -1,
    scroll: 0,
  };
}

/**
 * Types the response field by field. Each line is fully rendered with
 * syntax colours and revealed with a clip-path in `ch` units, so the typing
 * costs one style write per frame and never re-renders React.
 */
export function JsonPanel({ scenario, runId, emitting, reduced, ref, className }: JsonPanelProps) {
  const t = heroStrings(useLocale());
  const viewportRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const caretRef = useRef<HTMLSpanElement>(null);
  const msRef = useRef<HTMLSpanElement>(null);
  const lineRefs = useRef<Array<HTMLDivElement | null>>([]);
  const stateRef = useRef<TypingState>(freshState(0));

  const lines = useMemo(
    () => scenario.output.map((line) => ({ text: line, tokens: tokenize(line) })),
    [scenario]
  );

  // New run: new elements (keyed), so start from a clean typing state before paint.
  useLayoutEffect(() => {
    stateRef.current = freshState(scenario.output.length);
    lineRefs.current.length = scenario.output.length;
  }, [runId, scenario]);

  const frame = useCallback(
    (now: number) => {
      const st = stateRef.current;
      const t = now - scenario.emitAt;
      if (t < 0 || st.done) return;

      if (!st.started) {
        st.started = true;
        const viewport = viewportRef.current;
        st.viewportHeight = viewport?.clientHeight ?? 0;
        st.tops = lineRefs.current.map((el) => el?.offsetTop ?? 0);
        st.lineHeight = lineRefs.current[0]?.offsetHeight ?? 16;
      }

      const output = scenario.output;
      let budget = Math.floor((t * CHARS_PER_SECOND) / 1000);
      let caretLine = -1;
      let caretCol = 0;
      let allDone = true;

      for (let i = 0; i < output.length; i += 1) {
        const length = output[i].length;
        const reveal = budget <= 0 ? 0 : Math.min(length, budget);
        budget -= length + LINE_GAP_CHARS;
        if (reveal !== st.revealed[i]) {
          st.revealed[i] = reveal;
          const el = lineRefs.current[i];
          if (el) {
            el.style.clipPath = reveal >= length ? "none" : `inset(0 calc(100% - ${reveal}ch) 0 0)`;
          }
        }
        if (reveal < length) {
          if (caretLine < 0) {
            caretLine = i;
            caretCol = reveal;
          }
          allDone = false;
        }
      }

      const caret = caretRef.current;
      if (caret) {
        if (allDone) {
          caret.style.opacity = "0";
        } else {
          caret.style.opacity = "1";
          caret.style.transform = `translate(${caretCol}ch, ${st.tops[caretLine] ?? 0}px)`;
        }
      }

      const body = bodyRef.current;
      if (body && st.viewportHeight > 0) {
        const line = allDone ? output.length - 1 : caretLine;
        const target = Math.max(0, (st.tops[line] ?? 0) + st.lineHeight - st.viewportHeight);
        if (target !== st.scroll) {
          st.scroll = target;
          body.style.transform = `translateY(${-target}px)`;
        }
      }

      const k = Math.min(1, t / COUNTER_MS);
      const eased = 1 - Math.pow(1 - k, 3);
      const ms = Math.round(eased * scenario.result.executionMs);
      if (ms !== st.lastMs) {
        st.lastMs = ms;
        const el = msRef.current;
        if (el) el.textContent = String(ms);
      }

      if (allDone && k >= 1) st.done = true;
    },
    [scenario]
  );

  useImperativeHandle(ref, () => ({ frame }), [frame]);

  const { result, outputTone } = scenario;
  const stringClass = outputTone === "destructive" ? "text-destructive" : TOKEN_CLASS.string;
  const settled = emitting || reduced;

  return (
    <div className={cn("flex min-h-0 flex-col", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-border/40 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        <span className="truncate">{t.response} · application/json</span>
        <span
          className={cn(
            "shrink-0 tabular-nums transition-opacity duration-300",
            result.ok ? "text-success" : "text-destructive",
            settled ? "opacity-100" : "opacity-0"
          )}
        >
          HTTP {result.httpStatus}
        </span>
      </div>

      <div
        ref={viewportRef}
        className={cn(
          "relative min-h-0 flex-1 px-2.5 py-2",
          reduced ? "overflow-y-auto" : "overflow-hidden"
        )}
      >
        <div
          key={runId}
          ref={bodyRef}
          className="relative font-mono text-[10px] leading-4 whitespace-pre will-change-transform lg:text-[9.5px] xl:text-[11px] xl:leading-[18px]"
        >
          {lines.map((line, index) => (
            <div
              key={index}
              ref={(element) => {
                lineRefs.current[index] = element;
              }}
              className={cn(!reduced && "[clip-path:inset(0_100%_0_0)]")}
            >
              {line.tokens.map((token, tokenIndex) => (
                <span
                  key={tokenIndex}
                  className={token.kind === "string" ? stringClass : TOKEN_CLASS[token.kind]}
                >
                  {token.text}
                </span>
              ))}
            </div>
          ))}
          {!reduced && (
            <span
              ref={caretRef}
              aria-hidden
              className="absolute top-0 left-0 h-4 w-[1ch] bg-primary/80 opacity-0 animate-pulse xl:h-[18px]"
            />
          )}
        </div>
      </div>

      <div
        key={`footer-${runId}`}
        className={cn(
          "flex flex-wrap gap-x-3 gap-y-0.5 border-t border-border/40 px-3 py-1.5 font-mono text-[9px] text-muted-foreground transition-opacity duration-500 sm:text-[10px]",
          settled ? "opacity-100" : "opacity-0"
        )}
      >
        <span>
          model_used <span className="text-foreground">{result.modelUsed}</span>
        </span>
        <span>
          fallback_triggered{" "}
          <span className={result.fallbackTriggered ? "text-warning" : "text-foreground"}>
            {String(result.fallbackTriggered)}
          </span>
        </span>
        <span>
          execution_time_ms{" "}
          <span ref={msRef} className="tabular-nums text-foreground">
            {reduced ? result.executionMs : 0}
          </span>
        </span>
      </div>
    </div>
  );
}
