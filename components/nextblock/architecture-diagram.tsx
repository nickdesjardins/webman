import { Fragment } from "react";
import { nextblockStrings } from "@/components/nextblock/strings";
import { Badge } from "@/components/ui/badge";
import type { ArchitectureLayer } from "@/data/nextblock";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ArchitectureDiagramProps {
  layers: readonly ArchitectureLayer[];
  locale: Locale;
  className?: string;
}

const railTone: Record<ArchitectureLayer["tone"], string> = {
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
  muted: "bg-muted-foreground/40",
};

/**
 * The dashed lines use a 4px dash and an 8px gap, so one period is 12px.
 * The keyframe moves the whole (clipped) svg by exactly one period and the
 * loop is seamless. Translating the svg box instead of animating
 * stroke-dashoffset keeps the animation on the compositor.
 */
const FLOW_KEYFRAMES =
  "@keyframes nb-flow{from{transform:translateY(0)}to{transform:translateY(12px)}}";

function FlowConnector() {
  return (
    <div aria-hidden="true" className="relative h-[28px] w-full overflow-hidden">
      <svg
        focusable="false"
        className="absolute inset-x-0 -top-[12px] h-[40px] w-full text-primary/60 motion-safe:[animation:nb-flow_1.2s_linear_infinite]"
      >
        {[30, 50, 70].map((x) => (
          <line
            key={x}
            x1={`${x}%`}
            x2={`${x}%`}
            y1="0"
            y2="40"
            stroke="currentColor"
            strokeWidth="1"
            strokeDasharray="4 8"
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}

function LayerCard({ layer }: { layer: ArchitectureLayer }) {
  return (
    <div className="flex gap-3 rounded-lg border border-border/70 bg-background/50 p-3 transition-colors hover:border-primary/40">
      <span className={cn("w-1 shrink-0 self-stretch rounded-full", railTone[layer.tone])} />
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium leading-snug text-foreground">{layer.label}</p>
        <ul className="mt-2 flex flex-wrap gap-1.5">
          {layer.items.map((item) => (
            <li key={item} className="min-w-0 max-w-full">
              <Badge
                variant="outline"
                className="max-w-full justify-start rounded-md whitespace-normal text-left font-mono text-[11px] font-normal leading-snug text-muted-foreground [overflow-wrap:anywhere]"
              >
                {item}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/**
 * Five stacked layers with animated flow connectors. Server Component with a
 * pure CSS animation, disabled under prefers-reduced-motion via motion-safe.
 * The panel is exposed as one image whose label summarises every layer, so
 * assistive technology hears the architecture once instead of 25 chips.
 */
export function ArchitectureDiagram({ layers, locale, className }: ArchitectureDiagramProps) {
  const t = nextblockStrings(locale);
  const summary = `${t.architectureSummary} ${layers
    .map((layer) => `${layer.label}: ${layer.items.join(", ")}`)
    .join(". ")}.`;

  return (
    <div
      role="img"
      aria-label={summary}
      className={cn("glass relative overflow-hidden rounded-2xl border p-4 sm:p-5", className)}
    >
      <style>{FLOW_KEYFRAMES}</style>
      <div className="flex items-center gap-2 border-b border-border/60 pb-3 font-mono text-[11px] tracking-wide text-muted-foreground">
        <span className="size-1.5 shrink-0 rounded-full bg-primary" />
        <span className="min-w-0 [overflow-wrap:anywhere]">{t.architectureCaption}</span>
      </div>
      <div className="mt-4 flex flex-col">
        {layers.map((layer, i) => (
          <Fragment key={layer.id}>
            {i > 0 && <FlowConnector />}
            <LayerCard layer={layer} />
          </Fragment>
        ))}
      </div>
    </div>
  );
}

export default ArchitectureDiagram;
