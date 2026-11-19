"use client";

import { CopyButton } from "@/components/copy-button";
import { nextblockStrings } from "@/components/nextblock/strings";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface InstallCommandProps {
  command: string;
  locale: Locale;
  className?: string;
}

/**
 * One-line install command with a copy button (the shared CopyButton: check
 * icon and a polite announcement for about 1.5 s). Also used by the
 * applied-ai-audit toolkit page and its home teaser.
 * The locale arrives as a prop from the owning component.
 */
export function InstallCommand({ command, locale, className }: InstallCommandProps) {
  const t = nextblockStrings(locale);

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-lg border border-border/70 bg-card py-2 pr-2 pl-3.5",
        className
      )}
    >
      <code className="min-w-0 flex-1 font-mono text-sm leading-6 text-foreground [overflow-wrap:anywhere]">
        <span aria-hidden="true" className="select-none text-primary">
          ${" "}
        </span>
        {command}
      </code>
      <CopyButton
        text={command}
        copiedLabel={t.copied}
        aria-label={t.copyInstall}
        className="shrink-0 text-muted-foreground hover:text-foreground"
      />
    </div>
  );
}

export default InstallCommand;
