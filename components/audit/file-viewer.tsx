"use client";

import { FileCode } from "lucide-react";
import { AuditLinkButton } from "@/components/audit/link-button";
import { auditStrings, type AuditStrings } from "@/components/audit/strings";
import { CopyButton } from "@/components/copy-button";
import { InstallCommand } from "@/components/nextblock/install-command";
import { fill } from "@/components/nextblock/strings";
import { projectLabelClass } from "@/components/project-card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { AuditContent, AuditTab, AuditTabId } from "@/data/audit";
import { auditClaudeCodeFile, auditCopilotFile, auditCursorFile, auditPrompt } from "@/data/audit-prompt";
import type { Locale } from "@/lib/i18n";

/**
 * The exact bytes each tab installs or offers for pasting. This viewer is the
 * only importer of the generated module, so the prompt text ships with the
 * toolkit page alone.
 */
const FILES: Record<AuditTabId, string> = {
  claude: auditClaudeCodeFile,
  cursor: auditCursorFile,
  copilot: auditCopilotFile,
  universal: auditPrompt,
};

function FilePanel({
  tab,
  viewer,
  t,
  locale,
}: {
  tab: AuditTab;
  viewer: AuditContent["viewer"];
  t: AuditStrings;
  locale: Locale;
}) {
  const content = FILES[tab.id];

  return (
    <div className="grid min-w-0 gap-6">
      <dl className="grid min-w-0 gap-5 sm:grid-cols-2 sm:gap-6">
        <div className="min-w-0">
          <dt className={projectLabelClass}>{tab.targetLabel}</dt>
          <dd className="mt-2 font-mono text-sm leading-6 text-foreground [overflow-wrap:anywhere]">{tab.target}</dd>
        </div>
        <div className="min-w-0">
          <dt className={projectLabelClass}>{viewer.invokeLabel}</dt>
          <dd className="mt-2 text-sm leading-relaxed text-foreground/90">{tab.invoke}</dd>
        </div>
        {tab.install && (
          <div className="min-w-0 sm:col-span-2">
            <dt className={projectLabelClass}>{viewer.installLabel}</dt>
            <dd className="mt-2">
              <InstallCommand command={tab.install} locale={locale} />
            </dd>
          </div>
        )}
      </dl>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className={projectLabelClass}>{viewer.fileLabel}</p>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton text={content} copiedLabel={t.fileCopied} variant="outline" size="sm">
              {t.copyFile}
              <span className="sr-only">{fill(t.copyFileHint, { label: tab.label })}</span>
            </CopyButton>
            <AuditLinkButton
              href={tab.rawHref}
              label={viewer.rawLabel}
              icon={FileCode}
              newTabHint={t.newTabHint}
              variant="ghost"
              size="sm"
              className="w-auto"
            />
            <AuditLinkButton
              href={tab.sourceHref}
              label={viewer.sourceLabel}
              icon="github"
              newTabHint={t.newTabHint}
              variant="ghost"
              size="sm"
              className="w-auto"
            />
          </div>
        </div>
        {/* Keyboard-focusable so the bounded box can be scrolled without a mouse. */}
        <pre
          tabIndex={0}
          role="region"
          aria-label={fill(t.fileRegion, { label: tab.label })}
          className="mt-3 max-h-[28rem] max-w-full overflow-auto rounded-lg border border-border/70 bg-background/70 p-4 font-mono text-xs leading-relaxed whitespace-pre-wrap [overflow-wrap:anywhere] text-foreground/90 outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 sm:text-[13px]"
        >
          {content}
        </pre>
      </div>
    </div>
  );
}

/**
 * Four tabs, one per way to run the audit: the install target, the one-line
 * installer (not for the universal prompt), how to invoke it, and the full
 * file with a copy button. Tab values are stable ids, so the language switch
 * keeps the open tab; Radix supplies the arrow-key navigation.
 */
export function AuditFileViewer({ audit, locale }: { audit: AuditContent; locale: Locale }) {
  const t = auditStrings(locale);
  const { viewer, tabs } = audit;

  return (
    <Tabs defaultValue={tabs[0]?.id} className="min-w-0 gap-6">
      <TabsList
        aria-label={viewer.tabsLabel}
        className="grid w-full grid-cols-2 gap-1 group-data-[orientation=horizontal]/tabs:h-auto sm:grid-cols-4"
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="h-auto min-h-9 min-w-0 px-2 py-1.5 text-center text-xs leading-snug whitespace-normal sm:text-sm"
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      {/* Radix makes each panel a tab stop; the primitive sets outline-none, so restore a visible focus ring. */}
      {tabs.map((tab) => (
        <TabsContent
          key={tab.id}
          value={tab.id}
          className="min-w-0 rounded-lg focus-visible:ring-[3px] focus-visible:ring-ring/50"
        >
          <FilePanel tab={tab} viewer={viewer} t={t} locale={locale} />
        </TabsContent>
      ))}
    </Tabs>
  );
}

export default AuditFileViewer;
