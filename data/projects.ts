/**
 * Enterprise Applied AI projects.
 *
 * Projects 1 and 2 are live. Their proof points are taken from each
 * repository's own README and dated records (the 7 October 2026 benchmark for
 * project 1, the runs recorded on 14 October 2026 for project 2), so every
 * number here can be checked. Projects 3 and 4 are scheduled milestone
 * architectures from a 120-day delivery plan; their metrics are explicit
 * design targets, labelled as such.
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
    phase: "Phase 2 · Shipped",
    title: "Context-Aware Hybrid Compliance Retrieval Engine",
    shortTitle: "Hybrid Retrieval Engine",
    status: "live",
    statusLabel: "Live Demo & Open Source",
    summary:
      "A retrieval engine for SOPs and regulatory manuals that answers only by quoting the source. Vector and keyword search run in one PostgreSQL statement and are fused, a cross-encoder keeps the three best passages, and every quote the model returns is checked against the stored document before anyone sees it. When the documents do not say it, the answer says so. The public demo runs at zero cost on free models.",
    problem:
      "Naive RAG cuts text by character count and ranks by cosine similarity alone. It blurs exact identifiers such as 21 CFR Part 11 or SOP-QA-017, strips a clause of the document it came from, and leaves the model free to misquote a number or cite a page it never saw. In a compliance setting that is not a quality issue, it is a liability.",
    architecture:
      "PyMuPDF extracts layout blocks per page, and a structural chunker packs them along headings into 400-token chunks with a 60-token overlap. Following Anthropic's Contextual Retrieval pattern, every chunk is stored with a situational preamble, and both its embedding and a generated tsvector column are built from that text. One SQL statement runs a pgvector cosine search over an HNSW index (m=16, ef_construction=64) and a full-text search over a GIN index, then fuses the two lists with Reciprocal Rank Fusion (k=60) in a CTE. A cross-encoder reads the question with each of up to 50 fused candidates and keeps 3. The model must return strict JSON with an answer, a confidence score, and verbatim quotes, or an explicit insufficient-context verdict. The server re-anchors every quote to the stored chunk text, drops what does not match, fills titles and page numbers from the database, and withholds any answer with no surviving quote. Generation runs on an ordered chain of free OpenRouter models with fallback; Claude, OpenAI embeddings, and Cohere Rerank v3.5 are drop-in settings.",
    stack: [
      "Python 3.12",
      "FastAPI",
      "Pydantic v2",
      "PostgreSQL",
      "pgvector (HNSW)",
      "tsvector (GIN)",
      "Reciprocal Rank Fusion",
      "fastembed (ONNX)",
      "OpenRouter",
      "PyMuPDF",
      "Render",
    ],
    pipeline: [
      {
        name: "Ingest",
        detail: "PyMuPDF blocks, heading-aware 400-token chunks, contextual preamble",
      },
      { name: "Index", detail: "pgvector HNSW and a generated tsvector GIN index, one table" },
      { name: "Retrieve", detail: "Dense cosine and full-text search in one SQL statement" },
      { name: "Fuse", detail: "Reciprocal Rank Fusion CTE, k=60, up to 50 candidates" },
      { name: "Rerank", detail: "Cross-encoder reads question and passage together, keeps 3" },
      {
        name: "Verify",
        detail: "Strict JSON answer, quotes re-anchored to stored text, pages from the database",
      },
    ],
    proofPoints: [
      "Seven real runs recorded on 14 October 2026 and published as the service returned them. They show that the pipeline works, not how often it is right, and a test re-finds every recorded quote verbatim in the sample PDF, on the page it cites.",
      "A citation cannot be invented. Quotes are matched against the stored chunk, never the generated preamble, after Unicode and typographic folding, and the model never supplies a page number.",
      "The hermetic suite needs no network, database, or API key, and runs with ruff on every push. Opt-in live PostgreSQL tests assert that the SQL fusion matches its Python twin to 1e-9 and that EXPLAIN uses the HNSW index.",
      "Fits a 512 MB free instance: three memory changes, including turning off ONNX Runtime's memory arena, took the service from 856 MB to 441 MB at peak with both local models loaded.",
      "Closed by design for the open internet: uploads need the operator's key, questions are budgeted per visitor and per day, and the day's free allowance is read from OpenRouter itself, so a restart cannot erase it.",
      "Median over the seven runs: 1.4 s retrieval (embed, SQL, re-rank) and 6.8 s end to end on free models. The SQL itself takes about 170 ms; generation is most of the rest.",
    ],
    metrics: [
      {
        value: "6 / 6",
        label: "recorded questions answered with verified citations",
        kind: "measured",
      },
      {
        value: "1 / 1",
        label: "out-of-corpus question declined, not guessed",
        kind: "measured",
      },
      {
        value: "441 MB",
        label: "peak memory with both local models, on a 512 MB instance",
        kind: "measured",
      },
      {
        value: "$0.00",
        label: "marginal cost per question on the free stack",
        kind: "measured",
      },
    ],
    links: [
      {
        label: "Project page",
        href: "https://nickdesjardins.github.io/hybrid-knowledge-rag/",
        kind: "docs",
      },
      {
        label: "Live demo",
        href: "https://hybrid-retrieval-engine.onrender.com/",
        kind: "demo",
      },
      {
        label: "Source on GitHub",
        href: "https://github.com/nickdesjardins/hybrid-knowledge-rag",
        kind: "github",
      },
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
