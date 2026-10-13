/**
 * One hue per arsenal category, used for the tile dot and the filter-tab icon
 * so the colour carries meaning across the whole grid. Tailwind palette
 * classes, chosen for even perceptual spacing on the dark background.
 */
export const categoryDotClass: Record<string, string> = {
  "applied-ai": "bg-cyan-400 ring-[3px] ring-cyan-400/15",
  models: "bg-violet-400 ring-[3px] ring-violet-400/15",
  retrieval: "bg-amber-400 ring-[3px] ring-amber-400/15",
  languages: "bg-emerald-400 ring-[3px] ring-emerald-400/15",
  fullstack: "bg-sky-400 ring-[3px] ring-sky-400/15",
  infrastructure: "bg-orange-400 ring-[3px] ring-orange-400/15",
  llmops: "bg-lime-400 ring-[3px] ring-lime-400/15",
  devtools: "bg-indigo-400 ring-[3px] ring-indigo-400/15",
  design: "bg-pink-400 ring-[3px] ring-pink-400/15",
  marketing: "bg-rose-400 ring-[3px] ring-rose-400/15",
  productivity: "bg-teal-400 ring-[3px] ring-teal-400/15",
  itsupport: "bg-red-400 ring-[3px] ring-red-400/15",
};

/** Same hues as the dots, as text colour for the category icons in the filter bar and group headers. */
export const categoryTextClass: Record<string, string> = {
  "applied-ai": "text-cyan-400",
  models: "text-violet-400",
  retrieval: "text-amber-400",
  languages: "text-emerald-400",
  fullstack: "text-sky-400",
  infrastructure: "text-orange-400",
  llmops: "text-lime-400",
  devtools: "text-indigo-400",
  design: "text-pink-400",
  marketing: "text-rose-400",
  productivity: "text-teal-400",
  itsupport: "text-red-400",
};

const FALLBACK = "bg-muted-foreground/70 ring-[3px] ring-muted-foreground/10";
const TEXT_FALLBACK = "text-muted-foreground";

export function categoryDot(categoryId: string): string {
  return categoryDotClass[categoryId] ?? FALLBACK;
}

export function categoryText(categoryId: string): string {
  return categoryTextClass[categoryId] ?? TEXT_FALLBACK;
}
