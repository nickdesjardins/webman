/**
 * Scenario presets for the hero "Extraction Pipeline Simulator".
 *
 * The node order mirrors the live Invoice Extraction Service pipeline in
 * data/projects.ts (Ingest, Harden, Primary model, Fallback, Recover,
 * Validate), with an explicit JSON output node at the end.
 *
 * Timing and the phase structure are defined once in `buildScenarios`; only
 * the visible copy (labels, status lines, notes, announcements) is keyed by
 * locale in `COPY`. The JSON bodies are code and identical in every locale.
 *
 * Everything here is simulated. Vendor names, numbers and ids are
 * placeholder sample values, not real customers or real invoices.
 */
import type { Locale } from "@/lib/i18n";

export type ScenarioId = "ocr" | "email" | "receipt" | "notes";

export type NodeId =
  | "document"
  | "harden"
  | "primary"
  | "fallback"
  | "recover"
  | "validate"
  | "output";

export type EdgeId =
  | "doc-harden"
  | "harden-primary"
  | "primary-recover"
  | "primary-fallback"
  | "fallback-recover"
  | "recover-validate"
  | "validate-output"
  | "validate-fallback";

/** Semantic tones map to the design tokens of the same name. */
export type Tone = "primary" | "success" | "warning" | "destructive";

/**
 * idle: not reached yet. standby: the fallback lane waiting (dashed).
 * active: in flight (primary tone). active-warning: fallback in flight.
 * success / warning / destructive: settled outcomes.
 */
export type NodeState =
  | "idle"
  | "standby"
  | "active"
  | "active-warning"
  | "success"
  | "warning"
  | "destructive";

export const NODE_IDS: readonly NodeId[] = [
  "document",
  "harden",
  "primary",
  "fallback",
  "recover",
  "validate",
  "output",
];

export const EDGE_IDS: readonly EdgeId[] = [
  "doc-harden",
  "harden-primary",
  "primary-recover",
  "primary-fallback",
  "fallback-recover",
  "recover-validate",
  "validate-output",
  "validate-fallback",
];

/** Autoplay order; identical in every locale. */
export const SCENARIO_IDS: readonly ScenarioId[] = ["ocr", "email", "receipt", "notes"];

export interface EdgeFlow {
  id: EdgeId;
  tone: Tone;
}

interface PhaseSpec {
  id: string;
  /** Phase length in ms. */
  duration: number;
  /** Mono status line shown under the pipeline. */
  status: string;
  /** Tone of the status dot; defaults to the first edge tone or primary. */
  tone?: Tone;
  /** Node state patch applied on top of the previous phase. */
  nodes?: Partial<Record<NodeId, NodeState>>;
  /** Edges that carry particles during this phase. */
  edges?: EdgeFlow[];
  /** Particles only flow for the first N ms of the phase (default: whole phase). */
  flowMs?: number;
  /** One-shot flash overlay on a node when the phase begins. */
  flash?: { node: NodeId; tone: Tone };
  /** Sticky note shown under the Validate node once set. */
  note?: string;
  /** The JSON panel starts typing when this phase begins. */
  emit?: boolean;
}

export interface Phase {
  id: string;
  start: number;
  duration: number;
  status: string;
  tone: Tone;
  nodes: Record<NodeId, NodeState>;
  edges: EdgeFlow[];
  flowMs: number;
  /** Edges traversed before this phase, with the tone they carried. */
  lit: Partial<Record<EdgeId, Tone>>;
  flash?: { node: NodeId; tone: Tone };
  note?: string;
  emit: boolean;
}

export interface ScenarioResult {
  ok: boolean;
  httpStatus: number;
  modelUsed: "primary" | "fallback";
  fallbackTriggered: boolean;
  executionMs: number;
}

export interface Scenario {
  id: ScenarioId;
  label: string;
  /** Short description of the incoming document. */
  input: string;
  /** Index into the embedding-field clusters (0 invoices, 1 emails, 2 receipts, 3 noise). */
  cluster: 0 | 1 | 2 | 3;
  phases: Phase[];
  /** Total run length in ms, including the final hold. */
  total: number;
  /** Timestamp at which the JSON panel starts typing. */
  emitAt: number;
  /** JSON response, one entry per line, two-space indentation. */
  output: string[];
  /** Tone applied to string values in the output (error envelopes use destructive). */
  outputTone?: Tone;
  result: ScenarioResult;
  /** One sentence for the aria-live region, announced once per run. */
  announcement: string;
}

/* ------------------------------------------------------------------------ */
/* Localized copy                                                            */
/* ------------------------------------------------------------------------ */

interface ScenarioCopy {
  /** Status lines shared by several scenarios. */
  dispatch: string;
  inflight: string;
  recover: string;
  fallback: string;
  hardenDefault: string;
  validateTotals: string;
  validateStrict: string;
  ocr: {
    label: string;
    input: string;
    ingest: string;
    emit: string;
    announcement: string;
  };
  email: {
    label: string;
    input: string;
    ingest: string;
    harden: string;
    rateLimit: string;
    emit: string;
    announcement: string;
  };
  receipt: {
    label: string;
    input: string;
    ingest: string;
    mismatch: string;
    validateRecalc: string;
    note: string;
    emit: string;
    announcement: string;
  };
  notes: {
    label: string;
    input: string;
    ingest: string;
    refuse: string;
    announcement: string;
  };
}

/**
 * Code identifiers (POST /extract, json_schema, model_validate, ISO-4217,
 * Retry-After, InvoiceData, not_an_invoice, HTTP status lines) are the same
 * in both languages. French thousands separators use a no-break space.
 */
const COPY: Record<Locale, ScenarioCopy> = {
  en: {
    dispatch: "Dispatch · primary · strict json_schema · temp 0",
    inflight: "primary · constrained decode in flight · hard timeout armed",
    recover: "Recover · strip fences · drop preamble · JSON decoded",
    fallback: "fallback · different provider · strict json_schema · temp 0",
    hardenDefault: "Harden · injection defanging · request-id · call budget ok",
    validateTotals: "Validate · model_validate · recalc totals · ISO-4217",
    validateStrict: "Validate · InvoiceData.model_validate",
    ocr: {
      label: "OCR scan",
      input: "OCR scan · 2 pages · 11,204 chars",
      ingest: "POST /extract · OCR scan · 2 pages · 11,204 chars",
      emit: "200 OK · schema valid · InvoiceData emitted",
      announcement:
        "OCR scan: the primary model answered on the first try, the invoice passed schema validation, 1842 milliseconds.",
    },
    email: {
      label: "Email thread",
      input: "forwarded email thread · 3 replies · 6,912 chars",
      ingest: "POST /extract · forwarded thread · 3 replies · 6,912 chars",
      harden: "Harden · 1 injection phrase defanged · call budget ok",
      rateLimit: "primary · 429 rate limit · Retry-After honoured · cascading",
      emit: "200 OK · schema valid · emitted via fallback",
      announcement:
        "Email thread: the primary model was rate limited with a 429, the fallback model answered, the invoice passed schema validation, 4310 milliseconds.",
    },
    receipt: {
      label: "Foreign receipt",
      input: "till receipt · de-DE · EUR · 1,418 chars",
      ingest: "POST /extract · till receipt · de-DE · 1,418 chars",
      mismatch: "schema mismatch · line_items[1].total: str · next model",
      validateRecalc: "Validate · recalc 2 line totals · € -> EUR · ISO-4217",
      note: "recalc: 2 line totals, currency € -> EUR",
      emit: "200 OK · schema valid · normalised · emitted via fallback",
      announcement:
        "Foreign receipt: the primary model returned a schema mismatch, the fallback model answered, validation recalculated two line totals and mapped the euro symbol to EUR, 5126 milliseconds.",
    },
    notes: {
      label: "Meeting notes",
      input: "meeting notes · not an invoice · 2,044 chars",
      ingest: "POST /extract · meeting notes · 2,044 chars",
      refuse: "422 Unprocessable · not_an_invoice · no vendor, no totals",
      announcement:
        "Meeting notes: the document is not an invoice, the pipeline refused it with a 422 not_an_invoice verdict, 1203 milliseconds.",
    },
  },
  fr: {
    dispatch: "Envoi · primaire · json_schema strict · temp 0",
    inflight: "primaire · décodage contraint en cours · délai maximal armé",
    recover: "Réparer · fences retirées · préambule supprimé · JSON décodé",
    fallback: "repli · autre fournisseur · json_schema strict · temp 0",
    hardenDefault: "Blinder · injections neutralisées · request-id · budget d'appels ok",
    validateTotals: "Valider · model_validate · recalcul des totaux · ISO-4217",
    validateStrict: "Valider · InvoiceData.model_validate",
    ocr: {
      label: "Numérisation OCR",
      input: "numérisation OCR · 2 pages · 11\u00a0204 caractères",
      ingest: "POST /extract · numérisation OCR · 2 pages · 11\u00a0204 caractères",
      emit: "200 OK · schéma valide · InvoiceData émis",
      announcement:
        "Numérisation OCR: le modèle primaire a répondu du premier coup, la facture a passé la validation du schéma, 1842 millisecondes.",
    },
    email: {
      label: "Fil de courriels",
      input: "fil de courriels transféré · 3 réponses · 6\u00a0912 caractères",
      ingest: "POST /extract · fil transféré · 3 réponses · 6\u00a0912 caractères",
      harden: "Blinder · 1 phrase d'injection neutralisée · budget d'appels ok",
      rateLimit: "primaire · 429 limite de débit · Retry-After respecté · bascule",
      emit: "200 OK · schéma valide · émis via le repli",
      announcement:
        "Fil de courriels: le modèle primaire a été limité par un 429, le modèle de repli a répondu, la facture a passé la validation du schéma, 4310 millisecondes.",
    },
    receipt: {
      label: "Reçu étranger",
      input: "reçu de caisse · de-DE · EUR · 1\u00a0418 caractères",
      ingest: "POST /extract · reçu de caisse · de-DE · 1\u00a0418 caractères",
      mismatch: "schéma non conforme · line_items[1].total: str · modèle suivant",
      validateRecalc: "Valider · recalcul de 2 totaux de ligne · € -> EUR · ISO-4217",
      note: "recalcul: 2 totaux de ligne, devise € -> EUR",
      emit: "200 OK · schéma valide · normalisé · émis via le repli",
      announcement:
        "Reçu étranger: le modèle primaire a retourné un schéma non conforme, le modèle de repli a répondu, la validation a recalculé deux totaux de ligne et converti le symbole euro en EUR, 5126 millisecondes.",
    },
    notes: {
      label: "Notes de réunion",
      input: "notes de réunion · pas une facture · 2\u00a0044 caractères",
      ingest: "POST /extract · notes de réunion · 2\u00a0044 caractères",
      refuse: "422 Unprocessable · not_an_invoice · aucun fournisseur, aucun total",
      announcement:
        "Notes de réunion: le document n'est pas une facture, le pipeline l'a refusé avec un verdict 422 not_an_invoice, 1203 millisecondes.",
    },
  },
};

/* ------------------------------------------------------------------------ */
/* Timing and state machine (locale independent)                             */
/* ------------------------------------------------------------------------ */

const INITIAL_NODES: Record<NodeId, NodeState> = {
  document: "idle",
  harden: "idle",
  primary: "idle",
  fallback: "standby",
  recover: "idle",
  validate: "idle",
  output: "idle",
};

function resolvePhases(specs: PhaseSpec[]): Pick<Scenario, "phases" | "total" | "emitAt"> {
  let nodes = INITIAL_NODES;
  let lit: Partial<Record<EdgeId, Tone>> = {};
  let note: string | undefined;
  let start = 0;
  let emitAt = -1;

  const phases = specs.map<Phase>((spec) => {
    nodes = { ...nodes, ...spec.nodes };
    note = spec.note ?? note;
    const edges = spec.edges ?? [];
    const phase: Phase = {
      id: spec.id,
      start,
      duration: spec.duration,
      status: spec.status,
      tone: spec.tone ?? edges[0]?.tone ?? "primary",
      nodes,
      edges,
      flowMs: spec.flowMs ?? spec.duration,
      lit,
      flash: spec.flash,
      note,
      emit: spec.emit ?? false,
    };
    const nextLit: Partial<Record<EdgeId, Tone>> = { ...lit };
    for (const edge of edges) nextLit[edge.id] = edge.tone;
    lit = nextLit;
    if (phase.emit && emitAt < 0) emitAt = start;
    start += spec.duration;
    return phase;
  });

  return { phases, total: start, emitAt: emitAt < 0 ? start : emitAt };
}

/** Hold time at the end of a run while the JSON is readable. */
const HOLD = 3600;

function ingest(status: string): PhaseSpec {
  return {
    id: "ingest",
    duration: 600,
    status,
    nodes: { document: "active" },
    edges: [{ id: "doc-harden", tone: "primary" }],
  };
}

function harden(status: string): PhaseSpec {
  return {
    id: "harden",
    duration: 550,
    status,
    nodes: { document: "success", harden: "active" },
  };
}

function dispatch(status: string): PhaseSpec {
  return {
    id: "dispatch",
    duration: 600,
    status,
    nodes: { harden: "success", primary: "active" },
    edges: [{ id: "harden-primary", tone: "primary" }],
  };
}

function inflight(status: string, duration: number): PhaseSpec {
  return {
    id: "inflight",
    duration,
    status,
  };
}

function recoverFromPrimary(status: string): PhaseSpec {
  return {
    id: "recover",
    duration: 550,
    status,
    nodes: { primary: "success", recover: "active" },
    edges: [{ id: "primary-recover", tone: "primary" }],
  };
}

function recoverFromFallback(status: string): PhaseSpec {
  return {
    id: "recover",
    duration: 550,
    status,
    nodes: { fallback: "success", recover: "active" },
    edges: [{ id: "fallback-recover", tone: "warning" }],
  };
}

function validate(status: string, note?: string, duration = 600): PhaseSpec {
  return {
    id: "validate",
    duration,
    status,
    nodes: { recover: "success", validate: "active" },
    edges: [{ id: "recover-validate", tone: "primary" }],
    note,
  };
}

function emitOk(status: string): PhaseSpec {
  return {
    id: "emit",
    duration: HOLD,
    status,
    tone: "success",
    nodes: { validate: "success", output: "success" },
    edges: [{ id: "validate-output", tone: "success" }],
    flowMs: 700,
    emit: true,
  };
}

function scenario(
  base: Omit<Scenario, "phases" | "total" | "emitAt"> & { specs: PhaseSpec[] }
): Scenario {
  const { specs, ...rest } = base;
  return { ...rest, ...resolvePhases(specs) };
}

/** Builds the four scenarios with one locale's copy. Order follows SCENARIO_IDS. */
function buildScenarios(t: ScenarioCopy): readonly Scenario[] {
  return [
    scenario({
      id: "ocr",
      label: t.ocr.label,
      input: t.ocr.input,
      cluster: 0,
      specs: [
        ingest(t.ocr.ingest),
        harden(t.hardenDefault),
        dispatch(t.dispatch),
        inflight(t.inflight, 1000),
        recoverFromPrimary(t.recover),
        validate(t.validateTotals),
        emitOk(t.ocr.emit),
      ],
      output: [
        "{",
        '  "vendor": "Harbourview Supply",',
        '  "invoice_number": "INV-26-04187",',
        '  "date": "2026-09-18",',
        '  "currency": "CAD",',
        '  "line_items": [',
        "    {",
        '      "description": "Exam gloves",',
        '      "quantity": 24,',
        '      "unit_price": 18.50,',
        '      "total": 444.00',
        "    },",
        "    {",
        '      "description": "Face shields",',
        '      "quantity": 12,',
        '      "unit_price": 9.75,',
        '      "total": 117.00',
        "    }",
        "  ],",
        '  "subtotal": 561.00,',
        '  "tax": 84.01,',
        '  "total": 645.01',
        "}",
      ],
      result: {
        ok: true,
        httpStatus: 200,
        modelUsed: "primary",
        fallbackTriggered: false,
        executionMs: 1842,
      },
      announcement: t.ocr.announcement,
    }),

    scenario({
      id: "email",
      label: t.email.label,
      input: t.email.input,
      cluster: 1,
      specs: [
        ingest(t.email.ingest),
        harden(t.email.harden),
        dispatch(t.dispatch),
        inflight(t.inflight, 850),
        {
          id: "ratelimit",
          duration: 750,
          status: t.email.rateLimit,
          tone: "warning",
          nodes: { primary: "warning", fallback: "active-warning" },
          edges: [{ id: "primary-fallback", tone: "warning" }],
          flash: { node: "primary", tone: "warning" },
        },
        {
          id: "fallback",
          duration: 950,
          status: t.fallback,
          tone: "warning",
        },
        recoverFromFallback(t.recover),
        validate(t.validateTotals),
        emitOk(t.email.emit),
      ],
      output: [
        "{",
        '  "vendor": "Meridian Fleet",',
        '  "invoice_number": "MFS-77120",',
        '  "date": "2026-10-02",',
        '  "currency": "USD",',
        '  "line_items": [',
        "    {",
        '      "description": "Brake pads",',
        '      "quantity": 1,',
        '      "unit_price": 389.00,',
        '      "total": 389.00',
        "    },",
        "    {",
        '      "description": "Oil change",',
        '      "quantity": 3,',
        '      "unit_price": 42.00,',
        '      "total": 126.00',
        "    }",
        "  ],",
        '  "subtotal": 515.00,',
        '  "tax": 41.20,',
        '  "total": 556.20',
        "}",
      ],
      result: {
        ok: true,
        httpStatus: 200,
        modelUsed: "fallback",
        fallbackTriggered: true,
        executionMs: 4310,
      },
      announcement: t.email.announcement,
    }),

    scenario({
      id: "receipt",
      label: t.receipt.label,
      input: t.receipt.input,
      cluster: 2,
      specs: [
        ingest(t.receipt.ingest),
        harden(t.hardenDefault),
        dispatch(t.dispatch),
        inflight(t.inflight, 850),
        recoverFromPrimary(t.recover),
        validate(t.validateStrict, undefined, 550),
        {
          id: "mismatch",
          duration: 800,
          status: t.receipt.mismatch,
          tone: "destructive",
          nodes: { primary: "destructive", validate: "destructive", fallback: "active-warning" },
          edges: [{ id: "validate-fallback", tone: "destructive" }],
          flash: { node: "validate", tone: "destructive" },
        },
        {
          id: "fallback",
          duration: 900,
          status: t.fallback,
          tone: "warning",
          nodes: { recover: "idle", validate: "idle" },
        },
        recoverFromFallback(t.recover),
        validate(t.receipt.validateRecalc, t.receipt.note, 800),
        emitOk(t.receipt.emit),
      ],
      output: [
        "{",
        '  "vendor": "Bäckerei Lindemann",',
        '  "invoice_number": "RG-2026-3391",',
        '  "date": "2026-09-27",',
        '  "currency": "EUR",',
        '  "line_items": [',
        "    {",
        '      "description": "Brezeln",',
        '      "quantity": 40,',
        '      "unit_price": 0.95,',
        '      "total": 38.00',
        "    },",
        "    {",
        '      "description": "Kaffee Kanne",',
        '      "quantity": 6,',
        '      "unit_price": 12.50,',
        '      "total": 75.00',
        "    }",
        "  ],",
        '  "subtotal": 113.00,',
        '  "tax": 21.47,',
        '  "total": 134.47',
        "}",
      ],
      result: {
        ok: true,
        httpStatus: 200,
        modelUsed: "fallback",
        fallbackTriggered: true,
        executionMs: 5126,
      },
      announcement: t.receipt.announcement,
    }),

    scenario({
      id: "notes",
      label: t.notes.label,
      input: t.notes.input,
      cluster: 3,
      specs: [
        ingest(t.notes.ingest),
        harden(t.hardenDefault),
        dispatch(t.dispatch),
        inflight(t.inflight, 850),
        recoverFromPrimary(t.recover),
        validate(t.validateStrict, undefined, 550),
        {
          id: "refuse",
          duration: HOLD,
          status: t.notes.refuse,
          tone: "destructive",
          nodes: { validate: "destructive", output: "destructive" },
          edges: [{ id: "validate-output", tone: "destructive" }],
          flowMs: 700,
          flash: { node: "validate", tone: "destructive" },
          emit: true,
        },
      ],
      output: [
        "{",
        '  "error": "not_an_invoice",',
        '  "status": 422,',
        '  "detail": "no vendor, no totals",',
        '  "request_id": "req_8c1f4a2e",',
        '  "document_kind": "meeting_notes"',
        "}",
      ],
      outputTone: "destructive",
      result: {
        ok: false,
        httpStatus: 422,
        modelUsed: "primary",
        fallbackTriggered: false,
        executionMs: 1203,
      },
      announcement: t.notes.announcement,
    }),
  ];
}

/* ------------------------------------------------------------------------ */
/* Public API                                                                */
/* ------------------------------------------------------------------------ */

/** Built once per locale so scenario objects keep a stable identity across renders. */
const cache: Partial<Record<Locale, readonly Scenario[]>> = {};

/** The four scenarios with the copy of `locale`, in autoplay order. */
export function getScenarios(locale: Locale): readonly Scenario[] {
  return (cache[locale] ??= buildScenarios(COPY[locale]));
}

export const DEFAULT_SCENARIO_ID: ScenarioId = SCENARIO_IDS[0];

export function getScenario(locale: Locale, id: ScenarioId): Scenario {
  const list = getScenarios(locale);
  return list.find((s) => s.id === id) ?? list[0];
}

export function nextScenarioId(id: ScenarioId): ScenarioId {
  const index = SCENARIO_IDS.indexOf(id);
  return SCENARIO_IDS[(index + 1) % SCENARIO_IDS.length];
}

/** Phase index for a given simulated timestamp (clamped to the last phase). */
export function phaseIndexAt(scenario: Scenario, elapsed: number): number {
  const { phases } = scenario;
  for (let i = 0; i < phases.length; i += 1) {
    if (elapsed < phases[i].start + phases[i].duration) return i;
  }
  return phases.length - 1;
}
