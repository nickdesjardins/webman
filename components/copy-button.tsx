"use client";

import { useCallback, useEffect, useRef, useState, type ComponentProps, type ReactNode } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";

const RESET_AFTER_MS = 1500;

/**
 * Clipboard write with a short-lived "copied" flag. When the Clipboard API is
 * unavailable (insecure context or permission denied) nothing happens: the
 * text on the page stays selectable, so there is nothing else to do.
 */
export function useCopyToClipboard(resetAfterMs = RESET_AFTER_MS) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(
    async (text: string) => {
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setCopied(false), resetAfterMs);
      } catch {
        // Clipboard unavailable; the text stays selectable.
      }
    },
    [resetAfterMs]
  );

  return { copied, copy };
}

interface CopyButtonProps extends Omit<ComponentProps<typeof Button>, "onClick" | "children" | "asChild" | "type"> {
  /** What lands on the clipboard. */
  text: string;
  /** Announced by the polite live region for about 1.5 s after a successful copy. */
  copiedLabel: string;
  /** Visible text after the icon. Without it the button is icon-only, so pass an aria-label. */
  children?: ReactNode;
}

/**
 * Copy button: the icon turns into a check for about 1.5 s and a polite live
 * region announces `copiedLabel`. Renders the button and its status region as
 * siblings, so callers lay both out inside their own container.
 */
export function CopyButton({ text, copiedLabel, children, variant = "ghost", size, ...props }: CopyButtonProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size={size ?? (children ? "sm" : "icon-sm")}
        onClick={() => copy(text)}
        {...props}
      >
        {copied ? <Check aria-hidden="true" className="text-success" /> : <Copy aria-hidden="true" />}
        {children}
      </Button>
      <span role="status" aria-live="polite" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}

export default CopyButton;
