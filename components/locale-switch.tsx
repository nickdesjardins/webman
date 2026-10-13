"use client";

import { useLocale, useSetLocale } from "@/components/locale-provider";
import { Button } from "@/components/ui/button";
import { localeShort, otherLocale, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

/** Accessible name of the action, written in the language it switches to. */
const SWITCH_LABEL: Record<Locale, string> = {
  en: "Switch to English",
  fr: "Passer en français",
};

interface LocaleSwitchProps {
  /** Accepted for compatibility; the live locale always comes from context. */
  locale?: Locale;
  /** "ghost" blends into the header action cluster; "outline" reads as a button inside the sheet. */
  variant?: "ghost" | "outline";
  className?: string;
}

/**
 * Compact two-letter language toggle. Shows the OTHER edition as the action
 * ("FR" on English, "EN" on French). Switching is a client state change:
 * no navigation, no reload. The choice is stored in the "lang" cookie so the
 * next visit starts in that language.
 */
export function LocaleSwitch({ variant = "ghost", className }: LocaleSwitchProps) {
  const locale = useLocale();
  const setLocale = useSetLocale();
  const target = otherLocale(locale);

  return (
    <Button
      type="button"
      variant={variant}
      size="icon-sm"
      lang={target}
      aria-label={SWITCH_LABEL[target]}
      onClick={() => setLocale(target)}
      className={cn(
        "font-mono text-xs font-semibold tracking-wider",
        variant === "ghost" && "text-muted-foreground",
        className
      )}
    >
      {localeShort[target]}
    </Button>
  );
}
