"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { nextblockStrings } from "@/components/nextblock/strings";
import { Button } from "@/components/ui/button";
import type { Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface InstallCommandProps {
  command: string;
  locale: Locale;
  className?: string;
}

const RESET_AFTER_MS = 1500;

/**
 * One-line install command with a copy button. The only client leaf in the
 * intro row: it needs state for the copied indicator and the Clipboard API.
 * The locale arrives as a prop from the owning Server Component.
 */
export function InstallCommand({ command, locale, className }: InstallCommandProps) {
  const t = nextblockStrings(locale);
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), RESET_AFTER_MS);
    } catch {
      // Clipboard unavailable (insecure context or permission denied).
      // The command stays selectable, so there is nothing else to do.
    }
  }

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
      <Button
        type="button"
        variant="ghost"
        size="icon-sm"
        onClick={copy}
        aria-label={t.copyInstall}
        className="shrink-0 text-muted-foreground hover:text-foreground"
      >
        {copied ? (
          <Check aria-hidden="true" className="text-success" />
        ) : (
          <Copy aria-hidden="true" />
        )}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? t.copied : ""}
      </span>
    </div>
  );
}

export default InstallCommand;
