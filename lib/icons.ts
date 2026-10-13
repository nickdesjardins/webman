/**
 * simple-icons used inline, outside the arsenal. The arsenal tiles reference
 * public/brand-sprite.svg instead (built by scripts/brand-sprite.mjs from the
 * `icon` keys in data/arsenal.ts), so their 124 paths stay out of the bundle.
 *
 * Several brands are not in simple-icons (Microsoft, Adobe, Slack, Skype,
 * ESET, PowerShell, Visual Studio, OpenAI); those tools render a monogram.
 * Note: siSharp is the "sharp" image library, not C#, so C# is a monogram too.
 */
import { siGithub, type SimpleIcon } from "simple-icons";

export const brandIcons = {
  siGithub,
} satisfies Record<string, SimpleIcon>;

export type BrandIconKey = keyof typeof brandIcons;

export function getBrandIcon(key?: string): SimpleIcon | undefined {
  if (!key) return undefined;
  return (brandIcons as Record<string, SimpleIcon>)[key];
}
