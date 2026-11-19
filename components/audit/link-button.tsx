import { ExternalLink, type LucideIcon } from "lucide-react";
import { BrandIcon } from "@/components/brand-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AuditLinkButtonProps {
  href: string;
  label: string;
  /** Lucide glyph, or "github" for the brand mark. Decorative: the label names the destination. */
  icon: LucideIcon | "github";
  /** Visually hidden suffix such as " (opens in a new tab)". */
  newTabHint: string;
  variant?: "default" | "outline" | "ghost";
  size?: "default" | "sm";
  className?: string;
}

/** External link styled as a button, opening in a new tab, like ProjectLinkButton. */
export function AuditLinkButton({
  href,
  label,
  icon: Icon,
  newTabHint,
  variant = "outline",
  size = "default",
  className,
}: AuditLinkButtonProps) {
  return (
    <Button asChild variant={variant} size={size} className={cn("w-full sm:w-auto", className)}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        {Icon === "github" ? (
          <span aria-hidden="true" className="inline-flex shrink-0">
            <BrandIcon icon="siGithub" label="GitHub" className="size-4" />
          </span>
        ) : (
          <Icon aria-hidden="true" />
        )}
        {label}
        <ExternalLink aria-hidden="true" className="size-3.5 opacity-70" />
        <span className="sr-only">{newTabHint}</span>
      </a>
    </Button>
  );
}

export default AuditLinkButton;
