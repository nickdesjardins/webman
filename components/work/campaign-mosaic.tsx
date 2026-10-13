import { Reveal } from "@/components/motion/reveal";
import { fill, numberLocale, workStrings } from "@/components/work/strings";
import { ToneDot } from "@/components/work/work-badges";
import { WorkThumb } from "@/components/work/work-thumb";
import type { WorkItem } from "@/data/work";
import { getContent } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const HEADING_ID = "work-campaigns-heading";

/**
 * Tiles stagger in waves of one xl row (six columns), so a tile deep in the
 * list never waits more than a quarter second after it scrolls into view.
 */
const WAVE = 6;

interface CampaignTileProps {
  item: WorkItem;
  locale: Locale;
}

/**
 * One campaign tile: the whole surface is the link, the image scales a touch
 * on hover and keyboard focus (motion-safe only), and a bottom gradient carries
 * the title plus the primary stack tag.
 */
function CampaignTile({ item, locale }: CampaignTileProps) {
  const t = workStrings(locale);
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.title} ${t.newTabHint}`}
      className="group relative block overflow-hidden rounded-xl border border-border/70 bg-card transition-colors hover:border-primary/60 focus-visible:border-primary/60"
    >
      <WorkThumb
        src={item.thumb}
        alt=""
        sizes="(min-width: 1280px) 16vw, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        className="rounded-none border-0"
        imageClassName="motion-safe:transition-transform motion-safe:duration-500 motion-safe:ease-out motion-safe:group-hover:scale-[1.04] motion-safe:group-focus-visible:scale-[1.04]"
      />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-background/90 to-transparent px-3 pt-8 pb-2.5 sm:pt-10">
        <p className="line-clamp-2 text-xs leading-snug font-medium text-foreground sm:text-sm">{item.title}</p>
        <p className="mt-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
          {item.stack[0]}
        </p>
      </div>
    </a>
  );
}

interface CampaignMosaicProps {
  items: WorkItem[];
  locale: Locale;
  className?: string;
}

/**
 * Heading, intro and live count for the campaign microsites, then a dense
 * uniform grid: 2 columns at 360px, 3 at sm, 4 at lg, 6 at xl.
 */
export function CampaignMosaic({ items, locale, className }: CampaignMosaicProps) {
  const { campaignsIntro } = getContent(locale).work;
  const t = workStrings(locale);
  const liveCount = fill(t.liveCount, {
    count: items.length.toLocaleString(numberLocale(locale)),
  });

  return (
    <div className={cn("min-w-0", className)}>
      <Reveal>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
          <div className="min-w-0 max-w-3xl">
            <h3 id={HEADING_ID} className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              {campaignsIntro.heading}
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {campaignsIntro.description}
            </p>
          </div>
          <p className="flex shrink-0 items-center gap-2 font-mono text-xs text-muted-foreground">
            <ToneDot tone="success" />
            {liveCount}
          </p>
        </div>
      </Reveal>

      <ul
        aria-labelledby={HEADING_ID}
        className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6"
      >
        {items.map((item, i) => (
          <li key={item.id} className="min-w-0">
            <Reveal index={i % WAVE} step={0.05} y={16}>
              <CampaignTile item={item} locale={locale} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  );
}
