/**
 * Copies the applied-ai-audit toolkit's prompt and its three IDE integration
 * files into data/audit-prompt.ts, so the toolkit page shows byte for byte
 * what the installer writes into a project.
 *
 *   npm run audit-prompt                      (reads ../applied-ai-audit)
 *   node scripts/sync-audit-prompt.mjs <dir>  (any other checkout)
 *
 * Every integration file must be exactly "---\n" + its frontmatter + "\n---\n\n"
 * + the prompt; anything else (a stale copy, CRLF endings, a BOM, an em dash)
 * stops the script before it writes. It also counts the prompt's pillars and
 * checks and holds the counts in data/audit.ts and data/fr/audit.ts to them.
 *
 * Not part of prebuild: the deploy build has no sibling toolkit folder, so the
 * generated file is committed. Re-run this whenever the toolkit changes.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const toolkit = resolve(root, process.argv[2] ?? "../applied-ai-audit");
const OUTPUT = "data/audit-prompt.ts";
const COPY_SOURCES = ["data/audit.ts", "data/fr/audit.ts"];

const PROMPT_FILE = "prompts/applied-ai-audit.md";
/** Built from its code point so this file itself never contains the character. */
const EM_DASH = String.fromCharCode(0x2014);

/** Each integration: its file in the toolkit, the export name, and its exact frontmatter lines. */
const INTEGRATIONS = [
  {
    exportName: "auditClaudeCodeFile",
    file: "integrations/claude-code/audit-ai.md",
    installsTo: ".claude/commands/audit-ai.md",
    frontmatter: ["description: Run a 7-pillar Applied AI and Database architecture audit on this codebase"],
  },
  {
    exportName: "auditCursorFile",
    file: "integrations/cursor/applied-ai-audit.mdc",
    installsTo: ".cursor/rules/applied-ai-audit.mdc",
    frontmatter: [
      "description: Universal Applied AI and Database architectural audit checklist (invoke manually)",
      "alwaysApply: false",
    ],
  },
  {
    exportName: "auditCopilotFile",
    file: "integrations/copilot/audit-ai.prompt.md",
    installsTo: ".github/prompts/audit-ai.prompt.md",
    frontmatter: ["mode: ask", "description: Audit codebase and database for Applied AI production readiness"],
  },
];

function fail(message) {
  console.error(`audit-prompt: ${message}`);
  process.exit(1);
}

/** Reads a toolkit file as UTF-8 and rejects a BOM, CR characters and em dashes. */
function readToolkitFile(file) {
  const path = join(toolkit, file);
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch {
    fail(`cannot read ${path}. Pass the applied-ai-audit folder as the first argument.`);
  }
  if (text.charCodeAt(0) === 0xfeff) fail(`${file} starts with a byte order mark.`);
  if (text.includes("\r")) fail(`${file} has CR characters; LF line endings only.`);
  if (text.includes(EM_DASH)) fail(`${file} contains an em dash (U+2014).`);
  if (text.trim().length === 0) fail(`${file} is empty.`);
  return text;
}

/** Index and a short excerpt of the first difference between two strings, for the error message. */
function firstDifference(actual, expected) {
  let i = 0;
  while (i < actual.length && i < expected.length && actual[i] === expected[i]) i += 1;
  const excerpt = (text) => JSON.stringify(text.slice(Math.max(0, i - 30), i + 30));
  return `at character ${i}: found ${excerpt(actual)}, expected ${excerpt(expected)}`;
}

/** Pillar headings ("#### 1. Title") and the "- **Check**" bullets under each. */
function outline(prompt) {
  const pillars = [];
  for (const line of prompt.split("\n")) {
    const heading = line.match(/^#### (\d+)\. (.+)$/);
    if (heading) {
      pillars.push({ number: Number(heading[1]), title: heading[2].trim(), checks: 0 });
      continue;
    }
    if (/^#{1,3} |^---$/.test(line)) {
      // A higher-level heading or a rule closes the checklist.
      if (pillars.length > 0) pillars.push(null);
      continue;
    }
    const current = pillars.at(-1);
    if (current && /^- \*\*[^*]+\*\*/.test(line)) current.checks += 1;
  }
  const found = pillars.filter(Boolean);
  if (found.length === 0) fail(`${PROMPT_FILE} has no "#### N. Pillar" headings.`);
  found.forEach((pillar, index) => {
    if (pillar.number !== index + 1) fail(`pillar "${pillar.title}" is numbered ${pillar.number}, expected ${index + 1}.`);
    if (pillar.checks === 0) fail(`pillar "${pillar.title}" has no "- **Check**" bullets.`);
  });
  return found;
}

/** The page copy states a check count per pillar ("checks: 5"); both editions must match the prompt. */
function assertCopyCounts(pillars) {
  const expected = pillars.map((pillar) => pillar.checks);
  for (const file of COPY_SOURCES) {
    let source;
    try {
      source = readFileSync(join(root, file), "utf8");
    } catch {
      fail(`cannot read ${file}.`);
    }
    const stated = [...source.matchAll(/^\s*checks: (\d+),$/gm)].map((match) => Number(match[1]));
    if (stated.join(",") !== expected.join(",")) {
      fail(`${file} states checks [${stated.join(", ")}] but the prompt has [${expected.join(", ")}].`);
    }
  }
}

const prompt = readToolkitFile(PROMPT_FILE);
if (!prompt.endsWith("\n")) fail(`${PROMPT_FILE} must end with a newline.`);

const files = INTEGRATIONS.map((integration) => {
  const text = readToolkitFile(integration.file);
  const expected = `---\n${integration.frontmatter.join("\n")}\n---\n\n${prompt}`;
  if (text !== expected) {
    fail(
      `${integration.file} is not "---" + its frontmatter + "---" + a blank line + ${PROMPT_FILE}, ${firstDifference(text, expected)}.`
    );
  }
  return { ...integration, text };
});

const pillars = outline(prompt);
const totalChecks = pillars.reduce((sum, pillar) => sum + pillar.checks, 0);
assertCopyCounts(pillars);

const header = [
  "/**",
  " * GENERATED FILE: do not edit. Run `npm run audit-prompt` to regenerate it",
  " * from the applied-ai-audit toolkit (scripts/sync-audit-prompt.mjs).",
  " *",
  " * The universal prompt and the three IDE integration files, verbatim. Only the",
  " * toolkit page's file viewer imports this module, so the text never reaches the",
  " * bundles that read data through lib/content.ts.",
  " */",
  "",
];

const body = [
  `/** ${PROMPT_FILE}: the universal prompt, pasted into any coding agent. */`,
  `export const auditPrompt: string = ${JSON.stringify(prompt)};`,
  "",
  ...files.flatMap((file) => [
    `/** ${file.file}, installed as ${file.installsTo}. */`,
    `export const ${file.exportName}: string = ${JSON.stringify(file.text)};`,
    "",
  ]),
  "/** Pillars and checks counted in the prompt; the page copy is held to these by the sync script. */",
  `export const auditPromptOutline = ${JSON.stringify(
    { pillars: pillars.length, checks: totalChecks, checksPerPillar: pillars.map((pillar) => pillar.checks) }
  )} as const;`,
  "",
];

const output = [...header, ...body].join("\n");
if (output.includes(EM_DASH)) fail("the generated module would contain an em dash (U+2014).");
writeFileSync(join(root, OUTPUT), output, "utf8");

console.log(
  `audit-prompt: ${pillars.length} pillars, ${totalChecks} checks (${pillars
    .map((pillar) => pillar.checks)
    .join("/")}), ${files.length} integrations verified from ${relative(root, toolkit) || "."} -> ${OUTPUT}`
);
