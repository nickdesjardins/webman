"use client";

import {
  Fragment,
  createElement,
  useCallback,
  useDeferredValue,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactElement,
  type SyntheticEvent,
} from "react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion, type Transition } from "framer-motion";
import { LayoutGrid, RotateCcw, Search, X } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { Section } from "@/components/section";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ArsenalCategory, Tool } from "@/data/arsenal";
import { getContent } from "@/lib/content";
import { cn } from "@/lib/utils";
import { categoryText } from "./arsenal/category-color";
import { categoryIconFor } from "./arsenal/category-icon";
import { STRINGS } from "./arsenal/strings";
import { TileCell } from "./arsenal/tile-cell";
import { TILE_BUTTON_CLASS, TileFace, tileFrameClass } from "./arsenal/tool-tile";

const ALL = "all";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Module-level so the memoised cells always receive the same reference. */
const INSTANT: Transition = { duration: 0 };
const ANIMATED: Transition = {
  duration: 0.28,
  ease: EASE,
  layout: { duration: 0.36, ease: EASE },
};

const gridClass = "relative grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6";

/** Category chips: one horizontally scrolling row on phones, a wrapping cloud from md up. */
const listClass = cn(
  "flex h-auto w-full max-w-full justify-start gap-1.5 overflow-x-auto rounded-none bg-transparent p-1",
  "[scrollbar-width:none] group-data-[orientation=horizontal]/tabs:h-auto [&::-webkit-scrollbar]:hidden",
  "md:flex-wrap md:overflow-visible"
);

const triggerClass = cn(
  "group/chip h-8 flex-none gap-1.5 rounded-full border-border/60 px-3 text-xs",
  "hover:border-border hover:bg-accent/40",
  "data-[state=active]:border-primary/40 data-[state=active]:bg-primary/10 data-[state=active]:text-primary",
  "dark:data-[state=active]:border-primary/40 dark:data-[state=active]:bg-primary/10 dark:data-[state=active]:text-primary",
  "[&_svg:not([class*='size-'])]:size-3.5"
);

/** 80% alpha keeps the counts quiet while staying above 4.5:1 on the panel (70% measured 4.1:1). */
const countClass =
  "font-mono text-[10px] tabular-nums text-muted-foreground/80 group-data-[state=active]/chip:text-primary/80";

interface IndexedTool {
  tool: Tool;
  haystack: string;
}

interface IndexedCategory {
  category: ArsenalCategory;
  entries: IndexedTool[];
}

interface VisibleGroup {
  category: ArsenalCategory;
  tools: Tool[];
}

/** Lower-cases and strips diacritics so "evaluation" also finds "évaluation". */
function fold(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function toolKey(category: ArsenalCategory, tool: Tool) {
  return `${category.id}/${tool.name}`;
}

/**
 * How the tile matrix is rendered. The 195 tiles are the heaviest part of the
 * page to hydrate (a motion wrapper, a tooltip and a disclosure each), and
 * they sit far below the fold, so they are not hydrated on load at all.
 *
 * - "ssr": the server-rendered tiles stay exactly as delivered; hydration
 *   treats the wrapper as opaque HTML and skips its children.
 * - "static": React-owned, motion-free tiles. Used after a client-side mount
 *   (no server HTML) or a language switch while the matrix is still far away.
 * - "interactive": the live matrix with layout animation and tooltips. Entered
 *   as the section nears the viewport, on the first click or focus inside the
 *   grid, or on the first filter change.
 */
type GridMode = "ssr" | "static" | "interactive";

/** With this prop, hydration leaves the element's existing children untouched. */
const OPAQUE_HTML = { __html: "" };

/** Mount the live tiles one and a half viewports ahead, so they are ready on arrival. */
const PRELOAD_MARGIN = "150% 0px";

function headerClass(first: boolean) {
  return cn(
    "col-span-full flex items-center gap-2 pb-1 font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground",
    !first && "mt-4"
  );
}

/** The icon table is static, so resolving the component here is stable across renders. */
function CategoryGlyph({ category }: { category: ArsenalCategory }) {
  return createElement(categoryIconFor(category.lucide), {
    "aria-hidden": "true",
    className: cn("size-3.5 shrink-0", categoryText(category.id)),
  });
}

function GroupHeaderBody({ category, count }: { category: ArsenalCategory; count: string }) {
  return (
    <>
      <CategoryGlyph category={category} />
      <h3 className="text-xs font-medium tracking-[0.18em]">{category.label}</h3>
      <span className="text-muted-foreground/80 tabular-nums">{count}</span>
    </>
  );
}

interface StaticGridProps {
  groups: VisibleGroup[];
  showGroupHeaders: boolean;
  fmt: (n: number) => string;
}

/**
 * Markup-identical, motion-free twin of the live matrix. It is what the server
 * renders and what the "static" mode shows, so the swap to the live tiles is
 * invisible.
 */
function StaticGrid({ groups, showGroupHeaders, fmt }: StaticGridProps) {
  const locale = useLocale();
  const { tierLabel } = getContent(locale).arsenal;
  return groups.map((group, groupIndex) => (
    <Fragment key={group.category.id}>
      {showGroupHeaders && (
        <div className={headerClass(groupIndex === 0)}>
          <GroupHeaderBody category={group.category} count={fmt(group.tools.length)} />
        </div>
      )}
      {group.tools.map((tool) => {
        const id = toolKey(group.category, tool);
        return (
          <div key={id} className="min-w-0">
            <div data-expanded={false} data-tier={tool.tier} className={tileFrameClass(false)}>
              <button type="button" aria-expanded={false} data-tool-id={id} className={TILE_BUTTON_CLASS}>
                <TileFace tool={tool} categoryId={group.category.id} tier={tierLabel[tool.tier]} />
              </button>
            </div>
          </div>
        );
      })}
    </Fragment>
  ));
}

/**
 * The Engineering Arsenal: a filterable, searchable instrument panel of the
 * production stack. Category chips and a text search narrow the matrix; tiles
 * slide into place with a layout animation that only runs on filter changes.
 * One tile at a time can be expanded to show its real-world context inline.
 */
export function ArsenalGrid() {
  const locale = useLocale();
  const t = STRINGS[locale];
  const { arsenal, arsenalIntro } = getContent(locale).arsenal;
  const reduce = useReducedMotion() ?? false;

  const [category, setCategory] = useState<string>(ALL);
  const [query, setQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const [mode, setMode] = useState<GridMode>("ssr");
  const gridRef = useRef<HTMLDivElement>(null);
  const ssrLocaleRef = useRef(locale);
  /** Tool whose button had focus (or was clicked) when the grid went live; it gets focus back. */
  const pendingFocusRef = useRef<string | null>(null);

  /** The input stays responsive; the matrix filters on a deferred copy of the query. */
  const deferredQuery = useDeferredValue(query);
  const q = fold(deferredQuery.trim());

  const index = useMemo<IndexedCategory[]>(
    () =>
      arsenal.map((c) => ({
        category: c,
        entries: c.tools.map((tool) => ({ tool, haystack: fold(`${tool.name} ${tool.context}`) })),
      })),
    [arsenal]
  );

  /** Every category with its matching tools, in data order; the lengths feed the chip counts. */
  const filtered = useMemo<VisibleGroup[]>(
    () =>
      index.map(({ category: c, entries }) => ({
        category: c,
        tools: q ? entries.filter((e) => e.haystack.includes(q)).map((e) => e.tool) : c.tools,
      })),
    [index, q]
  );

  const groups = useMemo(
    () =>
      filtered.filter(
        (g) => g.tools.length > 0 && (category === ALL || g.category.id === category)
      ),
    [filtered, category]
  );

  const allCount = filtered.reduce((n, g) => n + g.tools.length, 0);
  const total = groups.reduce((n, g) => n + g.tools.length, 0);
  const active = arsenal.find((c) => c.id === category);
  const summary = active ? active.description : t.allSummary;
  const showGroupHeaders = category === ALL;
  /** Layout is re-measured only when this changes, never when a tile expands. */
  const filterKey = `${category}|${q}`;
  const tileTransition = reduce ? INSTANT : ANIMATED;
  const fmt = (n: number) => n.toLocaleString(t.numberLocale);

  /* Client-side mount without server HTML (a route change, for instance): render the static tiles for real. */
  useLayoutEffect(() => {
    if (mode === "ssr" && gridRef.current && gridRef.current.childElementCount === 0) setMode("static");
  }, [mode]);

  /* The untouched server HTML is in the language it was rendered in; a switch needs React-owned tiles. */
  useLayoutEffect(() => {
    if (mode === "ssr" && locale !== ssrLocaleRef.current) setMode("static");
  }, [locale, mode]);

  /*
   * Mount the live matrix as it approaches, so it is interactive on arrival.
   * The section is observed rather than the grid: while content-visibility
   * skips the section's contents the grid has no layout box.
   */
  useEffect(() => {
    const grid = gridRef.current;
    if (mode === "interactive" || !grid) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) setMode("interactive");
      },
      { rootMargin: PRELOAD_MARGIN }
    );
    observer.observe(grid.closest("section") ?? grid);
    return () => observer.disconnect();
  }, [mode]);

  /* Keyboard focus survives the swap: the same tool's new button takes it. */
  useLayoutEffect(() => {
    const id = pendingFocusRef.current;
    if (mode !== "interactive" || !id) return;
    pendingFocusRef.current = null;
    gridRef.current?.querySelector<HTMLElement>(`[data-tool-id="${CSS.escape(id)}"]`)?.focus();
  }, [mode]);

  /* A click or focus on a tile that is not live yet brings the matrix up and carries the intent over. */
  const activate = useCallback((event: SyntheticEvent<HTMLDivElement>) => {
    const button = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-tool-id]") : null;
    const id = button?.dataset.toolId;
    if (!id) return;
    pendingFocusRef.current = id;
    if (event.type === "click") setExpandedId(id);
    setMode("interactive");
  }, []);

  const toggle = useCallback(
    (id: string) => setExpandedId((current) => (current === id ? null : id)),
    []
  );

  function changeCategory(value: string) {
    setCategory(value);
    setExpandedId(null);
    setMode("interactive");
  }

  function changeQuery(value: string) {
    setQuery(value);
    setExpandedId(null);
    setMode("interactive");
  }

  function reset() {
    changeQuery("");
    setCategory(ALL);
  }

  /** On phones the chip row scrolls: keep the active chip in view when it changes. */
  useEffect(() => {
    const list = listRef.current;
    if (!list || list.scrollWidth <= list.clientWidth) return;
    const chip = list.querySelector<HTMLElement>('[data-state="active"]');
    if (!chip) return;
    const listRect = list.getBoundingClientRect();
    const chipRect = chip.getBoundingClientRect();
    const left =
      chipRect.left - listRect.left + list.scrollLeft - (listRect.width - chipRect.width) / 2;
    list.scrollTo({ left: Math.max(0, left), behavior: reduce ? "auto" : "smooth" });
  }, [category, reduce]);

  return (
    <Section
      id="arsenal"
      eyebrow={arsenalIntro.eyebrow}
      title={arsenalIntro.heading}
      description={arsenalIntro.description}
      /* The grid defers its own tiles (see GridMode), so the shell hydrates normally. */
      lazy={false}
      /* Placeholder height while deferred: 195 tiles at 2 / 3 / 4 / 6 columns plus the panel. */
      className="[--defer-size:9700px] sm:[--defer-size:6900px] lg:[--defer-size:5400px] xl:[--defer-size:5000px]"
    >
      <Tabs value={category} onValueChange={changeCategory} className="gap-0">
        {/* Control panel */}
        <div className="rounded-2xl border border-border/70 bg-card/40 p-3 sm:p-4">
          <div className="flex min-w-0 flex-col gap-3 lg:flex-row lg:items-start lg:gap-6">
            <div className="min-w-0 flex-1">
              <TabsList ref={listRef} aria-label={t.categories} className={listClass}>
                <TabsTrigger value={ALL} className={triggerClass}>
                  <LayoutGrid aria-hidden="true" />
                  {t.all}
                  <span className={countClass}>{fmt(allCount)}</span>
                </TabsTrigger>
                {filtered.map(({ category: c, tools }) => {
                  const Icon = categoryIconFor(c.lucide);
                  return (
                    <TabsTrigger key={c.id} value={c.id} className={triggerClass}>
                      <Icon aria-hidden="true" className={categoryText(c.id)} />
                      {c.shortLabel}
                      <span className={countClass}>{fmt(tools.length)}</span>
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </div>

            <div className="relative w-full lg:mt-0.5 lg:w-72 lg:shrink-0">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                type="text"
                inputMode="search"
                enterKeyHint="search"
                autoComplete="off"
                spellCheck={false}
                aria-label={t.search}
                placeholder={t.search}
                value={query}
                onChange={(event) => changeQuery(event.target.value)}
                className="pr-9 pl-9"
              />
              {query && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={t.clearSearch}
                  onClick={() => changeQuery("")}
                  className="absolute top-1/2 right-1.5 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X aria-hidden="true" />
                </Button>
              )}
            </div>
          </div>

          <div className="mt-3 flex flex-col gap-2 border-t border-border/50 pt-3 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
            <p className="text-sm leading-relaxed text-muted-foreground">{summary}</p>
            <span
              role="status"
              aria-live="polite"
              className="shrink-0 font-mono text-xs tabular-nums text-foreground/80"
            >
              {t.toolCount(total)}
            </span>
          </div>
        </div>

        <TabsContent value={category} className="mt-6 sm:mt-8">
          {mode === "interactive" ? (
            <LayoutGroup id="arsenal">
              <div ref={gridRef} className={gridClass}>
                <AnimatePresence mode="popLayout" initial={false}>
                  {groups.flatMap((group, groupIndex) => {
                    const items: ReactElement[] = [];

                    if (showGroupHeaders) {
                      items.push(
                        <motion.div
                          key={`header/${group.category.id}`}
                          layout={reduce ? false : "position"}
                          layoutDependency={filterKey}
                          initial={reduce ? false : { opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          transition={tileTransition}
                          className={headerClass(groupIndex === 0)}
                        >
                          <GroupHeaderBody category={group.category} count={fmt(group.tools.length)} />
                        </motion.div>
                      );
                    }

                    for (const tool of group.tools) {
                      const id = toolKey(group.category, tool);
                      items.push(
                        <TileCell
                          key={id}
                          id={id}
                          tool={tool}
                          categoryId={group.category.id}
                          expanded={expandedId === id}
                          onToggle={toggle}
                          reduceMotion={reduce}
                          layoutDependency={filterKey}
                          transition={tileTransition}
                        />
                      );
                    }

                    return items;
                  })}
                </AnimatePresence>
              </div>
            </LayoutGroup>
          ) : mode === "ssr" && typeof window !== "undefined" ? (
            /* Hydrating: keep the server's tiles as they are, zero hydration cost. */
            <div
              key="ssr"
              ref={gridRef}
              className={gridClass}
              onClick={activate}
              onFocus={activate}
              suppressHydrationWarning
              dangerouslySetInnerHTML={OPAQUE_HTML}
            />
          ) : (
            /* Server render, or React-owned static tiles after a client-side mount or a language switch. */
            <div key={mode} ref={gridRef} className={gridClass} onClick={activate} onFocus={activate}>
              <StaticGrid groups={groups} showGroupHeaders={showGroupHeaders} fmt={fmt} />
            </div>
          )}

          {total === 0 && (
            <motion.div
              role="status"
              initial={reduce ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: reduce ? 0 : 0.15 }}
              className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-12 text-center"
            >
              <p className="text-sm text-muted-foreground">{t.noMatch}</p>
              <Button type="button" variant="outline" size="sm" onClick={reset}>
                <RotateCcw aria-hidden="true" />
                {t.reset}
              </Button>
            </motion.div>
          )}

        </TabsContent>
      </Tabs>
    </Section>
  );
}

export default ArsenalGrid;
