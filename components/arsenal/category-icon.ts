import {
  BrainCircuit,
  Briefcase,
  Cloud,
  CodeXml,
  Database,
  Gauge,
  LayoutTemplate,
  Megaphone,
  Monitor,
  Palette,
  Server,
  Shield,
  Sparkles,
  Terminal,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { ArsenalCategory } from "@/data/arsenal";

/** Every category icon key the I18N contract allows on `ArsenalCategory.lucide`. */
export type CategoryIconKey =
  | "brain-circuit"
  | "database"
  | "layout-template"
  | "server"
  | "gauge"
  | "sparkles"
  | "code-2"
  | "palette"
  | "megaphone"
  | "monitor"
  | "cloud"
  | "wrench"
  | "terminal"
  | "shield"
  | "briefcase";

/** lucide-react exports `Code2` as an alias of `CodeXml`; the canonical name is imported. */
const categoryIcon: Record<CategoryIconKey, LucideIcon> = {
  "brain-circuit": BrainCircuit,
  database: Database,
  "layout-template": LayoutTemplate,
  server: Server,
  gauge: Gauge,
  sparkles: Sparkles,
  "code-2": CodeXml,
  palette: Palette,
  megaphone: Megaphone,
  monitor: Monitor,
  cloud: Cloud,
  wrench: Wrench,
  terminal: Terminal,
  shield: Shield,
  briefcase: Briefcase,
};

/** Resolves a category's icon. Wrench is the runtime fallback if a key ever slips past the contract. */
export function categoryIconFor(key: ArsenalCategory["lucide"]): LucideIcon {
  return categoryIcon[key] ?? Wrench;
}
