/**
 * Enterprise Applied AI projects.
 *
 * Project 1 is live. Its proof points are taken from the repository's own
 * README and dated benchmark records, so every number here can be checked.
 * Projects 2 to 4 are scheduled milestone architectures from a 120-day
 * delivery plan; their metrics are explicit design targets, labelled as such.
 */

export type ProjectStatus = "live" | "pipeline";

export interface ProjectMetric {
  value: string;
  label: string;
  /** "measured" numbers come from saved records; "target" numbers are SLOs. */
  kind: "measured" | "target";
}

export interface PipelineStage {
  name: string;
  detail: string;
}

export interface ProjectLink {
  label: string;
  href: string;
  kind: "docs" | "github" | "demo";
}

export interface Project {
  id: string;
  index: string;
  phase: string;
  title: string;
  shortTitle: string;
  status: ProjectStatus;
  statusLabel: string;
  delivery?: string;
  summary: string;
  problem: string;
  architecture: string;
  stack: string[];
  pipeline: PipelineStage[];
  proofPoints: string[];
  metrics: ProjectMetric[];
  links?: ProjectLink[];
  featured?: boolean;
}

export const projects: Project[] = [
  {
    id: "invoice-extraction-service",
    index: "01",
    phase: "Phase 1 · Shipped",
    title: "Invoice Extraction Service",
    shortTitle: "Invoice Extraction",
    status: "live",
    statusLabel: "Production Live & Open Source",
    featured: true,
    summary:
      "An asynchronous FastAPI microservice that turns messy, unstructured documents into a guaranteed, schema-validated invoice record. Resilience comes from routing across models, not vendors: a free primary model cascades to a second provider on rate limits, timeouts, or schema exceptions, at zero marginal cost.",
    problem:
      "Accounts-payable teams receive invoices as OCR dumps, forwarded email threads, till receipts, and foreign-language PDFs. A raw LLM call returns prose, fenced code blocks, or a JSON object with the wrong shape, and a single provider outage stops the whole intake queue.",
    architecture:
      "Requests are validated by Pydantic v2 before any model is called. The dispatcher walks an ordered model chain with strict json_schema constrained decoding at temperature 0. Each attempt runs under a hard timeout and translates SDK exceptions into one error taxonomy. Raw output is stripped of fences and reasoning preambles, parsed, then normalised by validators that recompute line totals to the cent and map currency symbols to ISO-4217. The service also looks after its own chain: when a free model is withdrawn, it re-tests the free catalogue with seven sample documents and fills the gap using a published ordering rule.",
    stack: [
      "Python 3.12",
      "FastAPI",
      "Pydantic v2",
      "OpenRouter",
      "httpx",
      "Pytest",
      "GitHub Actions",
      "Render",
    ],
    pipeline: [
      {
        name: "Ingest",
        detail: "ExtractRequest, 10 to 50k chars, 1 MB body ceiling refused before read",
      },
      {
        name: "Harden",
        detail: "Prompt injection defanging, request-id middleware, call budget with Retry-After",
      },
      {
        name: "Primary model",
        detail: "Strict json_schema, temperature 0, hard timeout",
      },
      {
        name: "Fallback",
        detail: "Different provider, triggered only on a failed call",
      },
      {
        name: "Recover",
        detail: "Strip fences, drop reasoning preamble, decode JSON",
      },
      {
        name: "Validate",
        detail: "InvoiceData.model_validate, recalc totals, ISO-4217",
      },
    ],
    proofPoints: [
      "Ten failure classes exercised offline in the cascade tests: 429, 503, 404, timeout, unexpected exception, invalid JSON, schema mismatch, empty response, in-band upstream error, and truncated output.",
      "The test suite cannot reach the network by construction. Every outbound path is closed in conftest, and a test that reaches for one fails immediately.",
      "Dated benchmark snapshot (7 October 2026): 3 passes of 7 documents per model, every call saved as JSONL so the figures can be re-derived without calling a model.",
      "Every figure on the project page is checked against the recordings by a test. A sentence that is not derived from the data fails the build.",
      "Logging hygiene: the model and timing are logged, never the vendor name or invoice number above DEBUG.",
    ],
    metrics: [
      {
        value: "21 / 21",
        label: "fully correct, primary model, dated benchmark",
        kind: "measured",
      },
      {
        value: "10",
        label: "provider failure classes covered offline",
        kind: "measured",
      },
      {
        value: "0",
        label: "network calls permitted in the test suite",
        kind: "measured",
      },
      {
        value: "$0.00",
        label: "marginal cost per request on the default chain",
        kind: "measured",
      },
    ],
    links: [
      {
        label: "Live documentation",
        href: "https://nickdesjardins.github.io/Invoice-Extraction-Service/",
        kind: "docs",
      },
      {
        label: "Source on GitHub",
        href: "https://github.com/nickdesjardins/Invoice-Extraction-Service",
        kind: "github",
      },
    ],
  },
  {
    id: "hybrid-compliance-retrieval-engine",
    index: "02",
    phase: "Phase 2 · Milestone",
    title: "Context-Aware Hybrid Compliance Retrieval Engine",
    shortTitle: "Hybrid Retrieval Engine",
    status: "pipeline",
    statusLabel: "In Active Pipeline",
    delivery: "Delivery: Days 31 to 60",
    summary:
      "A retrieval engine for regulatory documents, SOPs, and product dossiers that answers with paragraph-level citations instead of plausible guesses. Dense and sparse retrieval run in parallel inside PostgreSQL, candidates are fused, then compressed to a handful of high-confidence passages by a cross-encoder.",
    problem:
      "Naive RAG chunks text by character count and ranks by cosine similarity alone. It misses exact SKU codes and regulatory terms, fragments context, and invites hallucinated citations. In a compliance setting that is not a quality issue, it is a liability.",
    architecture:
      "Multi-page documents are segmented on structural boundaries. Following Anthropic's Contextual Retrieval pattern, a model worker prepends document and section context to every chunk before indexing. Chunks are stored once in PostgreSQL with a pgvector HNSW index (m=16, ef_construction=64) and a native tsvector inverted index. Queries execute dense and BM25 retrieval concurrently, merge the lists with Reciprocal Rank Fusion (k=60), and pass the top 50 to Cohere Rerank 3. The top 3 passages reach the model, which is constrained to a Pydantic schema containing the answer, verbatim supporting quotes, and exact source identifiers, or an explicit insufficient-context verdict.",
    stack: [
      "PostgreSQL",
      "pgvector (HNSW)",
      "tsvector / BM25",
      "Reciprocal Rank Fusion",
      "Cohere Rerank 3",
      "Anthropic Contextual Retrieval",
      "Claude Sonnet",
      "FastAPI",
    ],
    pipeline: [
      { name: "Ingest", detail: "Structural chunking, contextual preamble per chunk" },
      { name: "Index", detail: "pgvector HNSW + tsvector in one PostgreSQL schema" },
      { name: "Retrieve", detail: "Dense and BM25 in parallel, top 50 each" },
      { name: "Fuse", detail: "Reciprocal Rank Fusion, k=60" },
      { name: "Rerank", detail: "Cohere Rerank 3 cross-attention, 50 to 3" },
      {
        name: "Answer",
        detail: "Schema-constrained output with verbatim quotes and source ids",
      },
    ],
    proofPoints: [
      "Hallucinated URLs and citations are eliminated structurally: the model can only cite identifiers that exist in the retrieved set.",
      "One database for vectors, lexical search, and relational metadata removes a separate vector store from the operational surface.",
      "Unit tests run against mock embedding vectors, so retrieval logic is verified without a model or an API key.",
    ],
    metrics: [
      { value: "< 800 ms", label: "p95 end-to-end latency", kind: "target" },
      { value: "98%+", label: "context faithfulness on the golden set", kind: "target" },
      { value: "50 to 3", label: "candidate compression before generation", kind: "target" },
      { value: "0", label: "ungrounded citations by construction", kind: "target" },
    ],
  },
  {
    id: "multi-agent-operations-pipeline",
    index: "03",
    phase: "Phase 3 · Milestone",
    title: "Autonomous Multi-Agent Operations Pipeline",
    shortTitle: "Multi-Agent Operations",
    status: "pipeline",
    statusLabel: "In Active Pipeline",
    delivery: "Delivery: Days 61 to 90",
    summary:
      "A cyclic LangGraph workflow that coordinates SQL inventory queries, channel-specific copy synthesis, and regulatory compliance auditing. Validation failures loop back with structured revision notes. High-risk mutations pause for a human before anything leaves the system.",
    problem:
      "Launching a product across channels means pulling SKU facts from a transactional database, drafting listings, and checking every claim against regulations such as Health Canada NHP rules. Linear chains cannot retry, cannot pause, and cannot explain what they did.",
    architecture:
      "A supervisor node parses the request and routes work across specialised sub-agents over a typed state schema with explicit reducers: an Inventory SQL Agent with deterministic, read-only tool calls; a Copy Synthesis Agent; and a Compliance Validator Agent. Non-compliant output cycles back to synthesis with structured instructions. If ambiguity persists, the graph raises a Human-in-the-Loop interrupt, persists the thread snapshot to a PostgreSQL checkpointer, and exposes a review endpoint. Only an approved state resumes and dispatches the external webhook.",
    stack: [
      "LangGraph",
      "Python",
      "PostgreSQL Checkpointers",
      "Structured Tool Calling",
      "Claude Sonnet",
      "GPT-4o-mini",
      "FastAPI",
      "Webhooks",
    ],
    pipeline: [
      { name: "Supervise", detail: "Typed state, reducers, conditional routing" },
      { name: "Query", detail: "Inventory SQL agent, read-only deterministic tools" },
      { name: "Synthesise", detail: "Channel-specific listing copy" },
      { name: "Audit", detail: "Compliance validator against regulatory rules" },
      { name: "Loop", detail: "Structured revision notes back to synthesis" },
      {
        name: "Interrupt",
        detail: "Human sign-off persisted in PostgreSQL before webhook",
      },
    ],
    proofPoints: [
      "Cyclic graph with self-correcting validation instead of a brittle DAG.",
      "Every node transition is checkpointed, giving session resumption and a complete audit trail.",
      "Cheap models handle routing and extraction; the frontier model is reserved for synthesis and compliance reasoning.",
    ],
    metrics: [
      {
        value: "100%",
        label: "of high-risk mutations gated by a human checkpoint",
        kind: "target",
      },
      { value: "Full", label: "state replay from any checkpoint", kind: "target" },
      { value: "2-tier", label: "model cascade by task complexity", kind: "target" },
    ],
  },
  {
    id: "llmops-gateway-evaluation-suite",
    index: "04",
    phase: "Phase 4 · Capstone",
    title: "Production LLMOps Gateway & Evaluation CI/CD Suite",
    shortTitle: "LLMOps Gateway",
    status: "pipeline",
    statusLabel: "In Active Pipeline",
    delivery: "Delivery: Days 91 to 120",
    summary:
      "An enterprise reverse proxy in front of every model call. Semantically similar queries resolve from a Redis vector cache in milliseconds, every transaction is traced, and a CI pipeline runs regression evaluations against golden datasets so a bad prompt change never reaches main.",
    problem:
      "API spend grows with every feature, p99 latency is unpredictable, and nobody can prove that a prompt tweak did not make answers worse. Without evaluation in CI, generative features ship on vibes.",
    architecture:
      "A FastAPI reverse proxy embeds incoming prompts and checks a Redis vector similarity cache. Hits above 0.96 cosine similarity return the stored response without an upstream call. Misses are routed by task complexity: classification and extraction to lightweight models, multi-step synthesis to frontier models. All calls emit distributed traces to Langfuse with token, cost, and latency attribution. GitHub Actions runs DeepEval and Ragas against a curated golden dataset on every pull request and fails the build if hallucination rate exceeds 5% or faithfulness drops below 95%.",
    stack: [
      "FastAPI Reverse Proxy",
      "Redis Vector Similarity Cache",
      "Langfuse Tracing",
      "DeepEval",
      "Ragas",
      "GitHub Actions CI/CD",
    ],
    pipeline: [
      { name: "Proxy", detail: "Single ingress for every model call" },
      { name: "Cache", detail: "Redis vector similarity, hit above 0.96 cosine" },
      { name: "Route", detail: "Complexity-based cascade across model tiers" },
      { name: "Trace", detail: "Langfuse spans with token, cost, latency" },
      { name: "Evaluate", detail: "DeepEval and Ragas on golden datasets in CI" },
      { name: "Gate", detail: "PR blocked above 5% hallucination rate" },
    ],
    proofPoints: [
      "Separates production telemetry from release evaluation: monitoring tells you what happened, the CI suite tells you whether you may merge.",
      "Semantic caching turns repeated enterprise questions into sub-15 ms responses with zero inference cost.",
      "The RAG Triad (context relevance, faithfulness, answer relevance) is scored automatically on every change.",
    ],
    metrics: [
      { value: "< 15 ms", label: "cache hit response time", kind: "target" },
      { value: "0.96", label: "cosine threshold for cache resolution", kind: "target" },
      { value: "5%", label: "hallucination ceiling that blocks a PR", kind: "target" },
      { value: "~65%", label: "inference cost reduction from caching", kind: "target" },
    ],
  },
];

export const featuredProject = projects.find((p) => p.featured) ?? projects[0];
