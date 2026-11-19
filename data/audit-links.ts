/**
 * Locale-independent addresses of the applied-ai-audit toolkit: the
 * repository, the raw files and the one-line installer. Both editions of the
 * page copy (data/audit.ts, data/fr/audit.ts) build their links from here, so
 * those two modules keep identical exports, like every other data module.
 */

export const AUDIT_REPO_URL = "https://github.com/nickdesjardins/applied-ai-audit";
const RAW_URL = "https://raw.githubusercontent.com/nickdesjardins/applied-ai-audit/main";
export const AUDIT_INSTALL_URL = `${RAW_URL}/scripts/install.sh`;

/** Raw and GitHub-page URLs of a file in the toolkit repository. */
export function auditFileUrls(path: string): { rawHref: string; sourceHref: string } {
  return { rawHref: `${RAW_URL}/${path}`, sourceHref: `${AUDIT_REPO_URL}/blob/main/${path}` };
}

/** The one-line installer, run from the root of the project to audit. */
export function auditInstallCommand(flag: "claude" | "cursor" | "copilot" | "all"): string {
  return `curl -fsSL ${AUDIT_INSTALL_URL} | bash -s -- --${flag}`;
}
