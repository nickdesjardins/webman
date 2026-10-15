/**
 * The Engineering Arsenal: every language, framework, database, platform, and
 * professional tool with a job in a real system, grouped by category.
 *
 * `icon` is a key into lib/icons.ts (a curated subset of simple-icons).
 * Tools without a brand icon render a typographic monogram instead (`mono`,
 * two to four characters). When both are set, the monogram wins.
 * `context` is the real-world usage shown on hover or tap: one concrete
 * sentence, no invented metrics or client names.
 * `tier` is honest depth: "production" has shipped and is in current use,
 * "active" is in the current build plan, "evaluating" has been benchmarked
 * or prototyped, "legacy" was used professionally and has since been retired.
 *
 * History the contexts lean on: web work since 2004, PcSquad IT consultancy
 * (2012 to 2018), New Roots Herbal web lead since 2018, NextBlock CMS, the
 * Invoice Extraction Service, and the Hybrid Compliance Retrieval Engine.
 */

export type ToolTier = "production" | "active" | "evaluating" | "legacy";

export interface Tool {
  name: string;
  icon?: string;
  /** Short monogram override when there is no icon (defaults to initials). */
  mono?: string;
  context: string;
  tier: ToolTier;
  href?: string;
}

export interface ArsenalCategory {
  id: string;
  label: string;
  shortLabel: string;
  description: string;
  lucide:
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
  tools: Tool[];
}

export const arsenal: ArsenalCategory[] = [
  {
    id: "applied-ai",
    label: "Applied AI & LLM Orchestration",
    shortLabel: "Applied AI",
    description:
      "Deterministic model integration: constrained decoding, schema validation, fallback routing, and stateful agent graphs.",
    lucide: "brain-circuit",
    tools: [
      { name: "FastAPI", icon: "siFastapi", tier: "production", context: "Invoice Extraction Service: async endpoints, request-id middleware, uniform error envelope, body-size ceilings.", href: "https://fastapi.tiangolo.com/" },
      { name: "Pydantic v2", icon: "siPydantic", tier: "production", context: "Strict JSON-schema generation for constrained decoding; validators that recompute invoice totals to the cent.", href: "https://docs.pydantic.dev/" },
      { name: "LangGraph", icon: "siLanggraph", tier: "active", context: "Cyclic multi-agent graphs with typed state, reducers, PostgreSQL checkpointers, and HITL interrupts.", href: "https://www.langchain.com/langgraph" },
      { name: "LangChain", icon: "siLangchain", tier: "active", context: "Tool abstractions and document loaders feeding LangGraph nodes.", href: "https://www.langchain.com/" },
      { name: "Tiktoken", mono: "TK", tier: "production", context: "Pre-flight token estimation so a request's cost is known before it is dispatched.", href: "https://github.com/openai/tiktoken" },
      { name: "Anthropic SDK", icon: "siAnthropic", tier: "production", context: "Claude Messages API, tool use, and prompt caching with static, cache-aligned prefixes.", href: "https://docs.anthropic.com/" },
      { name: "OpenAI SDK", mono: "OAI", tier: "production", context: "Structured Outputs with strict JSON schema; exponential backoff with jitter on rate limits.", href: "https://platform.openai.com/docs" },
      { name: "Google GenAI SDK", icon: "siGooglegemini", tier: "production", context: "Gemini in the internal asset pipeline that cut catalog turnaround from weeks to 40 minutes per SKU.", href: "https://ai.google.dev/" },
      { name: "Groq", mono: "GQ", tier: "evaluating", context: "Low-latency inference tier for classification and routing steps where time-to-first-token dominates.", href: "https://groq.com/" },
      { name: "OpenRouter", icon: "siOpenrouter", tier: "production", context: "One vendor, many models: the multi-provider fallback chain behind all three live AI services.", href: "https://openrouter.ai/" },
      { name: "Ollama", icon: "siOllama", tier: "production", context: "Local models for offline evaluation runs and privacy-sensitive prototypes.", href: "https://ollama.com/" },
      { name: "Model Context Protocol", mono: "MCP", tier: "production", context: "NextBlock's Cortex AI exposes the CMS as a Streamable HTTP MCP server with 56 tools, scoped bearer tokens, and confirmation-gated mutations. Listed in the official MCP Registry.", href: "https://modelcontextprotocol.io/" },
      { name: "Vercel AI SDK", icon: "siVercel", mono: "AI", tier: "production", context: "generateText over an OpenAI-compatible provider pointed at OpenRouter, behind NextBlock's free-model fallback runner and rate-limit detection.", href: "https://ai-sdk.dev/" },
    ],
  },
  {
    id: "models",
    label: "Frontier & Open Models",
    shortLabel: "Models",
    description:
      "No favourites. Each model is a component with a measured failure profile, chosen per task by cost, latency, and correctness.",
    lucide: "sparkles",
    tools: [
      { name: "Claude", icon: "siClaude", tier: "production", context: "Default for synthesis and compliance reasoning. Tool use and prompt caching in production.", href: "https://claude.ai/" },
      { name: "ChatGPT / GPT", mono: "GPT", tier: "production", context: "Structured Outputs for extraction; GPT-4o-mini as the cost-efficient routing tier.", href: "https://openai.com/" },
      { name: "Gemini", icon: "siGooglegemini", tier: "production", context: "Image and asset generation inside the internal catalog pipeline.", href: "https://gemini.google.com/" },
      { name: "DeepSeek", icon: "siDeepseek", tier: "evaluating", context: "Open-weights reasoning tier for cost-sensitive batch jobs.", href: "https://www.deepseek.com/" },
      { name: "Qwen", icon: "siQwen", tier: "evaluating", context: "Multilingual extraction tests, including foreign-language receipts.", href: "https://qwenlm.github.io/" },
      { name: "Perplexity", icon: "siPerplexity", tier: "production", context: "Grounded research with citations during architecture reviews.", href: "https://www.perplexity.ai/" },
      { name: "Mistral", icon: "siMistralai", tier: "evaluating", context: "European-hosted option when data residency is a constraint.", href: "https://mistral.ai/" },
      { name: "Llama", icon: "siMeta", tier: "evaluating", context: "Self-hosted through Ollama for offline evaluation runs.", href: "https://www.llama.com/" },
      { name: "Nemotron", icon: "siNvidia", tier: "production", context: "Primary model of the first two live AI services: 21 of 21 fully correct in the extraction snapshot, and the generator behind all seven recorded retrieval runs; second model of the operations pipeline's chain.", href: "https://www.nvidia.com/en-us/ai-data-science/foundation-models/nemotron/" },
    ],
  },
  {
    id: "retrieval",
    label: "Retrieval, Vectors & Data",
    shortLabel: "Retrieval & Data",
    description:
      "Hybrid search that respects exact identifiers and semantic meaning, fused and re-ranked before a model ever sees a token. Relational discipline underneath it all.",
    lucide: "database",
    tools: [
      { name: "PostgreSQL", icon: "siPostgresql", tier: "production", context: "System of record since 2018. NextBlock stores every content block as JSONB under row-level security; the retrieval engine adds vectors and lexical search to the same database.", href: "https://www.postgresql.org/" },
      { name: "pgvector (HNSW / IVFFlat)", icon: "siPostgresql", mono: "PGV", tier: "production", context: "The live retrieval engine's dense arm: cosine search over HNSW (m=16, ef_construction=64), fused with full-text search in one SQL statement. IVFFlat where memory is the constraint.", href: "https://github.com/pgvector/pgvector" },
      { name: "tsvector / BM25", mono: "BM25", tier: "production", context: "A generated tsvector column under a GIN index: the keyword arm of the live retrieval engine, so identifiers like 21 CFR Part 11 are never lost to cosine similarity.", href: "https://www.postgresql.org/docs/current/textsearch.html" },
      { name: "Cohere Rerank", mono: "CO", tier: "active", context: "Default re-ranker of the retrieval engine (rerank-v3.5), cutting up to 50 fused candidates to 3; the free public demo swaps in a local ONNX cross-encoder.", href: "https://cohere.com/rerank" },
      { name: "ChromaDB", mono: "CH", tier: "evaluating", context: "Lightweight local vector store for evaluation harnesses and prototypes.", href: "https://www.trychroma.com/" },
      { name: "Qdrant", icon: "siQdrant", tier: "evaluating", context: "Benchmarked for payload filtering at scale; pgvector preferred when one database is enough.", href: "https://qdrant.tech/" },
      { name: "Redis", icon: "siRedis", tier: "active", context: "Semantic cache keyed by prompt embedding; rate-limit counters; LangGraph checkpoint store.", href: "https://redis.io/" },
      { name: "MySQL", icon: "siMysql", tier: "production", context: "Relational store behind the New Roots Herbal Laravel platform: catalog, orders, campaign content, and the inventory sync tables.", href: "https://www.mysql.com/" },
      { name: "phpMyAdmin", icon: "siPhpmyadmin", tier: "production", context: "Schema inspection and one-off queries on cPanel-hosted MySQL databases when a shell is not the fastest route.", href: "https://www.phpmyadmin.net/" },
      { name: "SQLite", icon: "siSqlite", tier: "production", context: "Zero-setup database for local tooling, prototypes, and test fixtures that must never touch a shared server.", href: "https://www.sqlite.org/" },
      { name: "MongoDB", icon: "siMongodb", tier: "legacy", context: "Document store for MEAN-stack projects in the consultancy years, before PostgreSQL JSONB covered the same ground with transactions.", href: "https://www.mongodb.com/" },
    ],
  },
  {
    id: "languages",
    label: "Languages & Markup",
    shortLabel: "Languages",
    description:
      "Polyglot by necessity: the right language for the layer, from PHP backends and TypeScript interfaces to Python services and shell automation.",
    lucide: "code-2",
    tools: [
      { name: "Python", icon: "siPython", tier: "production", context: "Primary language for every AI service: async FastAPI apps, Pydantic models, pytest suites.", href: "https://www.python.org/" },
      { name: "TypeScript", icon: "siTypescript", tier: "production", context: "Strict mode everywhere; one schema shared by the API route and the form that calls it.", href: "https://www.typescriptlang.org/" },
      { name: "PHP", icon: "siPhp", tier: "production", context: "Since the consultancy years; today it is the Laravel backends behind the New Roots Herbal CMS, store, store locator, and inventory sync.", href: "https://www.php.net/" },
      { name: "JavaScript", icon: "siJavascript", tier: "production", context: "Browser and Node code since 2004: progressive enhancement on Blade views, build tooling, and the glue between third-party APIs.", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
      { name: "SQL", mono: "SQL", tier: "production", context: "Hand-written queries, indexes, and CHECK constraints for PostgreSQL and MySQL; the schema is the contract, not the ORM.", href: "https://www.postgresql.org/docs/current/sql.html" },
      { name: "HTML5", icon: "siHtml5", tier: "production", context: "Semantic landmarks, native form validation, and accessible markup on every property since the table-layout days.", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
      { name: "CSS3", icon: "siCss", tier: "production", context: "Custom properties, grid, and container queries; Tailwind v4 compiles to it, and the hard layouts are still written by hand.", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
      { name: "Sass / SCSS", icon: "siSass", tier: "production", context: "Nested partials and mixins for the Laravel platform's stylesheets and the Angular applications before utility CSS took over.", href: "https://sass-lang.com/" },
      { name: "Bash", icon: "siGnubash", tier: "production", context: "Deployment scripts, cron jobs, and the server migration runbooks that moved 30+ properties with zero downtime.", href: "https://www.gnu.org/software/bash/" },
      { name: "PowerShell", mono: "PS", tier: "production", context: "Windows automation for client machines in the consultancy years; still the daily shell on the Windows side of the dual boot.", href: "https://learn.microsoft.com/powershell/" },
      { name: "Batch", mono: "BAT", tier: "legacy", context: "Login scripts and repair toolkits that ran from a USB stick on client machines during the PcSquad years.", href: "https://en.wikipedia.org/wiki/Batch_file" },
      { name: "C++", icon: "siCplusplus", tier: "legacy", context: "Data structures and systems courses at John Abbott and Concordia; the mental model for everything that followed.", href: "https://isocpp.org/" },
      { name: "C#", mono: "C#", tier: "legacy", context: "Windows desktop utilities for consultancy clients, written against the .NET Framework in Visual Studio.", href: "https://learn.microsoft.com/dotnet/csharp/" },
      { name: "Java", icon: "siOpenjdk", tier: "legacy", context: "Android applications and university coursework; Eclipse and Android Studio were the editors of the day.", href: "https://www.java.com/" },
      { name: "Dart", icon: "siDart", tier: "evaluating", context: "Written for Flutter prototypes; the web stack won for the projects that shipped.", href: "https://dart.dev/" },
      { name: "Visual Basic", mono: "VB", tier: "legacy", context: "Early automation inside Microsoft Access and Excel for small-business clients; retired with the move to web applications.", href: "https://learn.microsoft.com/dotnet/visual-basic/" },
      { name: "XML", icon: "siXml", tier: "production", context: "Sitemaps, feeds, and the data interchange formats that legacy partners still send.", href: "https://www.w3.org/XML/" },
      { name: "JSON", icon: "siJson", tier: "production", context: "The wire format for everything: strict json_schema constrained decoding, JSONB content blocks, and API contracts shared between client and server.", href: "https://www.json.org/" },
      { name: "YAML", icon: "siYaml", tier: "production", context: "GitHub Actions workflows, Docker Compose stacks, and configuration files reviewed like code.", href: "https://yaml.org/" },
      { name: "Blade", mono: "BLD", tier: "production", context: "Laravel's templating layer for the New Roots Herbal platform and its campaign landing pages.", href: "https://laravel.com/docs/blade" },
      { name: "Markdown", icon: "siMarkdown", tier: "production", context: "Documentation for every repository, NextBlock's docs folder, and the format agents read and write over MCP.", href: "https://commonmark.org/" },
    ],
  },
  {
    id: "fullstack",
    label: "Frameworks & Modern Web",
    shortLabel: "Frameworks",
    description:
      "Interfaces and APIs that put AI output in front of real users, with the same type safety end to end. The older frameworks are listed because they shipped.",
    lucide: "layout-template",
    tools: [
      { name: "Next.js (App Router)", icon: "siNextdotjs", tier: "production", context: "NextBlock CMS (200k+ lines of TypeScript, 59 CMS screens, 39 API routes) and this site both run on the App Router with React Server Components.", href: "https://nextjs.org/" },
      { name: "React", icon: "siReact", tier: "production", context: "Production UI since 2018, from Angular migrations to Server Components.", href: "https://react.dev/" },
      { name: "Tailwind CSS", icon: "siTailwindcss", tier: "production", context: "v4 design tokens in oklch. This site's entire style layer is one CSS file.", href: "https://tailwindcss.com/" },
      { name: "shadcn/ui", icon: "siShadcnui", tier: "production", context: "Accessible Radix primitives themed with CSS variables, owned in-repo rather than imported.", href: "https://ui.shadcn.com/" },
      { name: "Supabase", icon: "siSupabase", tier: "production", context: "NextBlock's database layer: Postgres, GoTrue auth, Storage, and an RLS model kept Supabase Advisor clean. Published as @nextblock-cms/db.", href: "https://supabase.com/" },
      { name: "Tiptap", mono: "TT", tier: "production", context: "NextBlock's Notion-style block editor with slash commands, drag and drop, and inline AI, published as @nextblock-cms/editor.", href: "https://tiptap.dev/" },
      { name: "Laravel", icon: "siLaravel", tier: "production", context: "The New Roots Herbal CMS, store locator, and e-commerce backends.", href: "https://laravel.com/" },
      { name: "Node.js", icon: "siNodedotjs", tier: "production", context: "Build tooling, inventory sync services, and third-party API integrations.", href: "https://nodejs.org/" },
      { name: "Nx Monorepo", mono: "NX", tier: "production", context: "NextBlock's workspace: enforced module boundaries, Vite library builds, and one release pipeline for eight published packages.", href: "https://nx.dev/" },
      { name: "Stripe / Freemius", icon: "siStripe", tier: "production", context: "NextBlock Commerce Pro: Stripe checkout and webhooks for physical goods, Freemius licensing for digital products and premium module activation.", href: "https://stripe.com/" },
      { name: "Zod", icon: "siZod", tier: "production", context: "Strict tool arguments for NextBlock's Cortex AI agents, and the contact-form schema shared by this site's API route and the form that calls it.", href: "https://zod.dev/" },
      { name: "Three.js / React Three Fiber", icon: "siThreedotjs", tier: "production", context: "This site's hero: an embedding field rendered through @react-three/fiber, paused when offscreen and when the tab is hidden.", href: "https://threejs.org/" },
      { name: "Vite", icon: "siVite", tier: "production", context: "Library builds for NextBlock's eight published packages inside the Nx workspace, and the engine under Vitest.", href: "https://vite.dev/" },
      { name: "Angular", icon: "siAngular", tier: "production", context: "Internal applications at New Roots Herbal, and the Angular-to-React migrations that followed.", href: "https://angular.dev/" },
      { name: "Bootstrap", icon: "siBootstrap", tier: "production", context: "Responsive grid and form components for the Laravel platform's back-office screens before Tailwind took over the public pages.", href: "https://getbootstrap.com/" },
      { name: "jQuery", icon: "siJquery", tier: "production", context: "Still present in the oldest Blade views; replaced with vanilla JavaScript or React as each page is touched.", href: "https://jquery.com/" },
      { name: "WordPress", icon: "siWordpress", tier: "production", context: "Client sites and blogs since the consultancy years, and the yardstick NextBlock CMS is designed to beat.", href: "https://wordpress.org/" },
      { name: "WooCommerce", icon: "siWoocommerce", tier: "legacy", context: "Storefronts for consultancy clients when a custom store would have been overkill; NextBlock Commerce is the modern answer.", href: "https://woocommerce.com/" },
      { name: "Drupal", icon: "siDrupal", tier: "legacy", context: "Content-heavy client sites in the consultancy years where WordPress ran out of structure.", href: "https://www.drupal.org/" },
      { name: "SuiteCRM", mono: "CRM", tier: "legacy", context: "Open-source CRM deployed and customised for small-business clients: custom modules, workflows, and hosting.", href: "https://suitecrm.com/" },
      { name: "Gatsby", icon: "siGatsby", tier: "legacy", context: "Static React sites in the pre-Next.js era; retired once the App Router made the trade-off unnecessary.", href: "https://www.gatsbyjs.com/" },
      { name: "Scully", mono: "SCU", tier: "legacy", context: "Static site generation for Angular projects, prerendered for speed and SEO.", href: "https://scully.io/" },
      { name: "Flutter", icon: "siFlutter", tier: "evaluating", context: "Cross-platform mobile prototypes in Dart; the web stack won for the projects that shipped.", href: "https://flutter.dev/" },
    ],
  },
  {
    id: "infrastructure",
    label: "Infrastructure & Systems",
    shortLabel: "Infrastructure",
    description:
      "Thirty-plus production properties, zero-downtime migrations, and a 40% lower hosting bill. Reliability is a habit, not a feature.",
    lucide: "server",
    tools: [
      { name: "Docker", icon: "siDocker", tier: "production", context: "Reproducible images for FastAPI services, and NextBlock's self-hosted stack: Postgres, GoTrue, PostgREST, Kong, MinIO, and the app in one compose file.", href: "https://www.docker.com/" },
      { name: "Docker Compose", icon: "siDocker", mono: "DC", tier: "production", context: "Local stacks in one command: API, Postgres, Redis, and Langfuse.", href: "https://docs.docker.com/compose/" },
      { name: "Linux", icon: "siLinux", tier: "production", context: "Daily driver and production host OS across 30+ properties.", href: "https://www.kernel.org/" },
      { name: "Debian", icon: "siDebian", tier: "production", context: "The work side of the dual boot and the base image for most of the Docker containers.", href: "https://www.debian.org/" },
      { name: "Ubuntu", icon: "siUbuntu", tier: "production", context: "LTS releases on the VPS hosts and under WSL on the Windows workstation.", href: "https://ubuntu.com/" },
      { name: "Windows", mono: "WIN", tier: "production", context: "Daily workstation OS and the client desktop fleet of the consultancy years; dual-booted with Debian.", href: "https://www.microsoft.com/windows" },
      { name: "Android", icon: "siAndroid", tier: "production", context: "Java applications built in Android Studio for coursework and prototypes; today it is the test device for every PWA.", href: "https://www.android.com/" },
      { name: "Red Hat", icon: "siRedhat", tier: "legacy", context: "Enterprise Linux for client servers in the consultancy years, and the RPM habits that CentOS and Fedora shared.", href: "https://www.redhat.com/" },
      { name: "CentOS", icon: "siCentos", tier: "legacy", context: "Free Red Hat clone under cPanel servers for years, retired along with the distribution itself.", href: "https://www.centos.org/" },
      { name: "Fedora", icon: "siFedora", tier: "legacy", context: "Desktop distribution for a stretch of the consultancy years; useful for seeing where Red Hat was heading.", href: "https://fedoraproject.org/" },
      { name: "cPanel / WHM", icon: "siCpanel", tier: "production", context: "Multi-tenant hosting administration and zero-downtime server migrations.", href: "https://cpanel.net/" },
      { name: "VPS Hosting", mono: "VPS", tier: "production", context: "Right-sized servers that cut cloud infrastructure spend by over 40%." },
      { name: "Apache", icon: "siApache", tier: "production", context: "HTTP server under the cPanel fleet: virtual hosts, .htaccess rewrites, and TLS for the PHP properties.", href: "https://httpd.apache.org/" },
      { name: "Nginx", icon: "siNginx", tier: "production", context: "Reverse proxy and TLS termination in front of the FastAPI services and Node applications on the VPS hosts.", href: "https://nginx.org/" },
      { name: "WAMP / LAMP", mono: "LAMP", tier: "production", context: "The classic PHP stack: Windows for local development, Linux for every server since the consultancy years.", href: "https://en.wikipedia.org/wiki/LAMP_(software_bundle)" },
      { name: "GitHub Actions", icon: "siGithubactions", tier: "production", context: "Test suites on every push, a scheduled job that re-tests free models and publishes the tested chain, and NextBlock's daily upstream sync and MCP registry publish.", href: "https://github.com/features/actions" },
      { name: "Vercel", icon: "siVercel", tier: "production", context: "Edge deployment for Next.js properties, including this one. NextBlock's one-click deploy provisions Supabase and injects keys before the first build.", href: "https://vercel.com/" },
      { name: "Cloudflare (Workers, R2)", icon: "siCloudflare", tier: "production", context: "SmartStack, the New Roots Herbal supplement-tracking PWA, runs on Workers; NextBlock stores media in R2 or MinIO.", href: "https://www.cloudflare.com/" },
      { name: "Render", icon: "siRender", tier: "production", context: "Hosts the three live AI services as FastAPI containers deployed straight from their repositories; the retrieval engine fits two local ONNX models into a 512 MB free instance.", href: "https://render.com/" },
      { name: "DigitalOcean", icon: "siDigitalocean", tier: "production", context: "Droplets for right-sized VPS hosting and short-lived staging boxes.", href: "https://www.digitalocean.com/" },
      { name: "Google Cloud Platform", icon: "siGooglecloud", tier: "production", context: "Project, billing, and API quota management for the Maps Platform store locator and the Gemini asset pipeline.", href: "https://cloud.google.com/" },
      { name: "Tailscale", icon: "siTailscale", tier: "production", context: "Zero-config private networking between the home lab, servers, and CI runners.", href: "https://tailscale.com/" },
      { name: "Netlify", icon: "siNetlify", tier: "legacy", context: "Static deploys for Gatsby and Angular sites before Vercel and Cloudflare took over the role.", href: "https://www.netlify.com/" },
      { name: "Google App Engine", mono: "GAE", tier: "legacy", context: "Early Node and PHP deployments on the platform-as-a-service model, before containers and VPS hosting won on cost.", href: "https://cloud.google.com/appengine" },
      { name: "Firebase", icon: "siFirebase", tier: "legacy", context: "Hosting, auth, and realtime database for small client apps in the consultancy years.", href: "https://firebase.google.com/" },
      { name: "VirtualBox", icon: "siVirtualbox", tier: "production", context: "Disposable Linux and Windows guests for testing installers, drivers, and clean-OS reproductions.", href: "https://www.virtualbox.org/" },
      { name: "Hyper-V", mono: "HV", tier: "production", context: "Windows-native virtual machines for Linux guests and isolated test environments on the workstation.", href: "https://learn.microsoft.com/virtualization/hyper-v-on-windows/" },
      { name: "VMware Workstation / vSphere", icon: "siVmware", tier: "legacy", context: "Desktop virtualisation for client-environment reproductions, and ESXi hosts consolidating several small-business workloads onto one box.", href: "https://www.vmware.com/" },
      { name: "WinSCP", mono: "SCP", tier: "production", context: "Scripted SFTP transfers and quick file edits on the Linux hosts from the Windows workstation.", href: "https://winscp.net/" },
      { name: "PuTTY", mono: "PTY", tier: "legacy", context: "SSH and serial console sessions to client servers and network gear before Windows shipped OpenSSH.", href: "https://www.putty.org/" },
      { name: "FileZilla", icon: "siFilezilla", tier: "legacy", context: "FTP and SFTP deploys to shared hosting in the consultancy years, before Git-based deployment pipelines.", href: "https://filezilla-project.org/" },
    ],
  },
  {
    id: "llmops",
    label: "LLMOps & Evaluation",
    shortLabel: "LLMOps",
    description:
      "Monitoring tells you what happened. Evaluation tells you whether you may merge. Both are automated.",
    lucide: "gauge",
    tools: [
      { name: "Langfuse Tracing", mono: "LF", tier: "active", context: "Distributed traces with token, cost, and latency attribution for every model call.", href: "https://langfuse.com/" },
      { name: "DeepEval", mono: "DE", tier: "active", context: "Hallucination and faithfulness assertions written as pytest cases and run in CI.", href: "https://docs.confident-ai.com/" },
      { name: "Ragas", mono: "RG", tier: "active", context: "RAG Triad scoring (context relevance, faithfulness, answer relevance) on golden datasets.", href: "https://docs.ragas.io/" },
      { name: "Pytest", icon: "siPytest", tier: "production", context: "Offline-by-construction suites. A test that reaches the network fails, on purpose.", href: "https://docs.pytest.org/" },
      { name: "Vitest", mono: "VT", tier: "production", context: "146 test files across NextBlock's monorepo, covering the MCP server, agent tool executors, schemas, and the setup wizard.", href: "https://vitest.dev/" },
    ],
  },
  {
    id: "devtools",
    label: "Developer Tools & AI Coding",
    shortLabel: "Dev Tools",
    description:
      "Editors, version control, API clients, and the coding agents that now sit beside them. The terminal is still the primary interface.",
    lucide: "terminal",
    tools: [
      { name: "VS Code", mono: "VSC", tier: "production", context: "Primary editor since 2018, with remote SSH sessions into the Linux hosts and the Claude Code and Codex extensions alongside.", href: "https://code.visualstudio.com/" },
      { name: "Git", icon: "siGit", tier: "production", context: "Centralised workflows, protected branches, and architectural review checkpoints.", href: "https://git-scm.com/" },
      { name: "GitHub", icon: "siGithub", tier: "production", context: "Home of NextBlock CMS, the three live AI services, and this site: issues, pull requests, protected branches, releases, and the GitHub Pages project sites.", href: "https://github.com/nickdesjardins" },
      { name: "Git Bash", mono: "GB", tier: "production", context: "POSIX shell on the Windows workstation so the same scripts run locally and on the Linux hosts.", href: "https://gitforwindows.org/" },
      { name: "Claude Code", icon: "siClaude", tier: "production", context: "Agentic coding in the terminal; NextBlock ships a Claude Code plugin so the agent can build pages over MCP.", href: "https://claude.com/claude-code" },
      { name: "Cursor", icon: "siCursor", tier: "production", context: "AI-first editor for exploratory refactors; NextBlock ships a Cursor agent plugin over MCP.", href: "https://cursor.com/" },
      { name: "OpenAI Codex", mono: "CDX", tier: "production", context: "Part of the multi-model asset pipeline at New Roots Herbal, and a NextBlock agent plugin target.", href: "https://openai.com/codex/" },
      { name: "Jules", icon: "siGooglejules", tier: "evaluating", context: "Google's asynchronous coding agent, tried on scoped maintenance tasks in the open-source repositories.", href: "https://jules.google/" },
      { name: "npm", icon: "siNpm", tier: "production", context: "Publishes NextBlock's eight packages at one version, including create-nextblock with 191 releases.", href: "https://www.npmjs.com/" },
      { name: "Postman", icon: "siPostman", tier: "production", context: "Collections for the Laravel APIs and the FastAPI extraction endpoints, with environment files per stage.", href: "https://www.postman.com/" },
      { name: "Chrome DevTools", icon: "siGooglechrome", tier: "production", context: "Performance traces, layout debugging, and network inspection; the first stop for a layout shift or a slow request.", href: "https://developer.chrome.com/docs/devtools" },
      { name: "Lighthouse", icon: "siLighthouse", tier: "production", context: "Performance, accessibility, best-practice, and SEO audits; NextBlock's production build scores 100 in all four.", href: "https://developer.chrome.com/docs/lighthouse" },
      { name: "Jira", icon: "siJira", tier: "production", context: "Sprint boards and issue tracking on team projects; the ticket is the spec.", href: "https://www.atlassian.com/software/jira" },
      { name: "Asana", icon: "siAsana", tier: "production", context: "Cross-team task tracking with marketing stakeholders who will never open a Git issue.", href: "https://asana.com/" },
      { name: "Notepad++", icon: "siNotepadplusplus", tier: "production", context: "Still the quickest way to open a very large log or a stray config file on Windows.", href: "https://notepad-plus-plus.org/" },
      { name: "GitHub Desktop", mono: "GHD", tier: "legacy", context: "Visual staging and history for the first Git repositories; replaced by the command line and the editor's Git panel.", href: "https://desktop.github.com/" },
      { name: "Visual Studio", mono: "VS", tier: "legacy", context: "C# and Visual Basic desktop utilities for consultancy clients; retired with the move to web applications.", href: "https://visualstudio.microsoft.com/" },
      { name: "Android Studio", icon: "siAndroidstudio", tier: "legacy", context: "Java Android applications for coursework and prototypes.", href: "https://developer.android.com/studio" },
      { name: "Eclipse", icon: "siEclipseide", tier: "legacy", context: "Java coursework at John Abbott and Concordia, and the first Android projects before Android Studio.", href: "https://eclipseide.org/" },
      { name: "Sublime Text", icon: "siSublimetext", tier: "legacy", context: "The fast editor of the consultancy years for PHP and JavaScript, before VS Code.", href: "https://www.sublimetext.com/" },
      { name: "Internet Explorer", mono: "IE", tier: "legacy", context: "Supported down to IE11 on client sites until the plug was pulled; conditional comments and polyfills were a line item.", href: "https://en.wikipedia.org/wiki/Internet_Explorer" },
    ],
  },
  {
    id: "design",
    label: "Design & Media",
    shortLabel: "Design",
    description:
      "Layouts, imagery, motion, and sound for the properties that ship. Engineering that respects the designer's intent, and sometimes is the designer.",
    lucide: "palette",
    tools: [
      { name: "Figma", icon: "siFigma", tier: "production", context: "Layouts and component specs for campaign microsites and the NextBlock editor before a line of CSS is written.", href: "https://www.figma.com/" },
      { name: "Adobe Photoshop", mono: "Ps", tier: "production", context: "Product imagery retouching and web export presets for the New Roots Herbal catalog and campaigns.", href: "https://www.adobe.com/products/photoshop.html" },
      { name: "Adobe Illustrator", mono: "Ai", tier: "production", context: "Logos, icons, and vector assets exported as SVG for the web properties.", href: "https://www.adobe.com/products/illustrator.html" },
      { name: "Adobe InDesign", mono: "Id", tier: "legacy", context: "Print layouts for consultancy clients: brochures, business cards, and the occasional catalog.", href: "https://www.adobe.com/products/indesign.html" },
      { name: "Adobe Premiere Pro", mono: "Pr", tier: "production", context: "Cutting product and campaign video for the web and social channels.", href: "https://www.adobe.com/products/premiere.html" },
      { name: "Adobe After Effects", mono: "Ae", tier: "production", context: "Motion graphics and short animated loops for campaign pages and social cuts.", href: "https://www.adobe.com/products/aftereffects.html" },
      { name: "Adobe Acrobat", mono: "PDF", tier: "production", context: "Form-fillable PDFs, print-ready exports, and the sample invoices fed to the extraction service.", href: "https://www.adobe.com/acrobat.html" },
      { name: "GIMP", icon: "siGimp", tier: "production", context: "Open-source raster editing on the Linux side of the dual boot when Photoshop is on the other partition.", href: "https://www.gimp.org/" },
      { name: "Blender", icon: "siBlender", tier: "evaluating", context: "3D product mockups and renders explored for campaign visuals.", href: "https://www.blender.org/" },
      { name: "OBS Studio", icon: "siObsstudio", tier: "production", context: "Screen recordings for NextBlock walkthroughs and bug reproductions.", href: "https://obsproject.com/" },
      { name: "Audacity", icon: "siAudacity", tier: "production", context: "Voice-over cleanup and audio trims for product videos and recordings.", href: "https://www.audacityteam.org/" },
      { name: "Studio One", mono: "S1", tier: "production", context: "PreSonus DAW for music production outside work hours; the same ear for signal and noise applies to logs.", href: "https://www.presonus.com/products/studio-one" },
      { name: "Melodyne", mono: "MEL", tier: "production", context: "Pitch and timing correction inside Studio One sessions.", href: "https://www.celemony.com/" },
      { name: "Google Fonts", icon: "siGooglefonts", tier: "production", context: "Typefaces for the campaign microsites and this site, self-hosted through next/font so there is no third-party request.", href: "https://fonts.google.com/" },
      { name: "Adobe Fonts", mono: "Af", tier: "production", context: "Brand typefaces licensed for New Roots Herbal print and web material.", href: "https://fonts.adobe.com/" },
      { name: "Font Awesome", icon: "siFontawesome", tier: "production", context: "Icon sets on the Laravel platform and older client sites; lucide and inline SVG on the newer builds.", href: "https://fontawesome.com/" },
      { name: "SketchUp", icon: "siSketchup", tier: "legacy", context: "3D layouts for office and server-room planning during the consultancy years.", href: "https://www.sketchup.com/" },
      { name: "Adobe Dreamweaver", mono: "Dw", tier: "legacy", context: "Where the first websites were built in the mid-2000s; retired for a text editor and a terminal.", href: "https://www.adobe.com/products/dreamweaver.html" },
      { name: "Adobe Flash", mono: "Fl", tier: "legacy", context: "Animated intros and interactive banners in the pre-HTML5 web; retired along with the plugin.", href: "https://www.adobe.com/products/flashplayer/end-of-life.html" },
    ],
  },
  {
    id: "marketing",
    label: "Marketing, Analytics & Payments",
    shortLabel: "Marketing",
    description:
      "Telemetry, attribution, and acquisition treated as engineering: every campaign is a tracked funnel with a measurable result.",
    lucide: "megaphone",
    tools: [
      { name: "Google Analytics", icon: "siGoogleanalytics", tier: "production", context: "GA4 properties and custom events on every New Roots Herbal property; the telemetry behind a campaign that captured over $300,000 in 30 days.", href: "https://marketingplatform.google.com/about/analytics/" },
      { name: "Google Tag Manager", icon: "siGoogletagmanager", tier: "production", context: "One container per property; conversion tags, consent logic, and campaign pixels ship without a code deploy.", href: "https://tagmanager.google.com/" },
      { name: "Google Search Console", icon: "siGooglesearchconsole", tier: "production", context: "Index coverage, Core Web Vitals, and query data for the 30+ properties; sitemaps submitted from code.", href: "https://search.google.com/search-console/about" },
      { name: "SEO / SEM", mono: "SEO", tier: "production", context: "Technical SEO as an engineering discipline: structured data, hreflang, Core Web Vitals, and paid search tied to the same analytics.", href: "https://developers.google.com/search/docs" },
      { name: "Google Ads", icon: "siGoogleads", tier: "production", context: "Paid acquisition for the consultancy and for New Roots Herbal campaigns, with conversions tied back to analytics.", href: "https://ads.google.com/" },
      { name: "Meta Ads", icon: "siMeta", tier: "production", context: "Facebook and Instagram campaigns with the pixel wired through Tag Manager and attribution reconciled against analytics.", href: "https://www.facebook.com/business/ads" },
      { name: "Google Maps Platform", icon: "siGooglemaps", tier: "production", context: "The New Roots Herbal store locator: Places, Geocoding, and the Maps JavaScript API behind a Laravel backend.", href: "https://mapsplatform.google.com/" },
      { name: "Google Business Profile", mono: "GBP", tier: "production", context: "Local listings, reviews, and hours, first for the consultancy and later for properties with a storefront.", href: "https://www.google.com/business/" },
      { name: "Google Trends", mono: "GT", tier: "production", context: "Seasonality checks before a campaign calendar is locked, so a cough and cold funnel launches when people are searching for one.", href: "https://trends.google.com/" },
      { name: "PayPal", icon: "siPaypal", tier: "production", context: "Checkout alternative on storefronts since the consultancy years; IPN and webhook handling for order confirmation.", href: "https://www.paypal.com/" },
      { name: "Google AdSense", icon: "siGoogleadsense", tier: "legacy", context: "Monetised content sites in the consultancy years; retired with them.", href: "https://adsense.google.com/" },
    ],
  },
  {
    id: "productivity",
    label: "Productivity & Collaboration",
    shortLabel: "Productivity",
    description:
      "The suites and channels that keep stakeholders, writers, and collaborators in the loop without a pull request.",
    lucide: "briefcase",
    tools: [
      { name: "Microsoft 365", mono: "M365", tier: "production", context: "Word, Outlook, PowerPoint, OneNote, Publisher, and OneDrive: the everyday suite for proposals, documentation, and client communication.", href: "https://www.microsoft.com/microsoft-365" },
      { name: "Microsoft Excel", mono: "XLS", tier: "production", context: "Pivot tables and Power Query for inventory reconciliation, and the CSV exports that feed Laravel import jobs.", href: "https://www.microsoft.com/microsoft-365/excel" },
      { name: "Microsoft Teams", mono: "TMS", tier: "production", context: "Meetings, channels, and screen shares with stakeholders inside Microsoft 365.", href: "https://www.microsoft.com/microsoft-teams" },
      { name: "Microsoft SharePoint", mono: "SP", tier: "production", context: "Document libraries and intranet pages for teams already inside Microsoft 365.", href: "https://www.microsoft.com/microsoft-365/sharepoint" },
      { name: "Microsoft Visio", mono: "VSD", tier: "legacy", context: "Network and rack diagrams for client offices; architecture diagrams have since moved to code and Figma.", href: "https://www.microsoft.com/microsoft-365/visio" },
      { name: "Microsoft Access", mono: "ACC", tier: "legacy", context: "Departmental databases inherited from clients, maintained until they could be migrated to MySQL.", href: "https://www.microsoft.com/microsoft-365/access" },
      { name: "Google Workspace", mono: "GWS", tier: "production", context: "Docs, Slides, Drive, Forms, Calendar, and Meet for shared documents and scheduling across teams.", href: "https://workspace.google.com/" },
      { name: "Google Sheets", icon: "siGooglesheets", tier: "production", context: "Quick data pipelines: IMPORTRANGE joins, Apps Script automations, and the spreadsheet a marketer actually opens.", href: "https://www.google.com/sheets/about/" },
      { name: "Slack", mono: "SLK", tier: "production", context: "Project channels with collaborators and the webhook sink for CI and deployment notifications.", href: "https://slack.com/" },
      { name: "Discord", icon: "siDiscord", tier: "production", context: "Community channels for open-source projects and quick voice calls with collaborators.", href: "https://discord.com/" },
      { name: "Zoom", icon: "siZoom", tier: "production", context: "Client meetings and screen-shared debugging sessions.", href: "https://zoom.us/" },
      { name: "LibreOffice", icon: "siLibreoffice", tier: "production", context: "Office suite on the Linux side of the dual boot, and headless document conversion in scripts.", href: "https://www.libreoffice.org/" },
      { name: "OpenOffice", icon: "siApacheopenoffice", tier: "legacy", context: "Free office suite installed for budget-conscious clients before LibreOffice took the lead.", href: "https://www.openoffice.org/" },
      { name: "Evernote", icon: "siEvernote", tier: "legacy", context: "Client notes and runbooks in the consultancy years, since migrated to Markdown in Git.", href: "https://evernote.com/" },
      { name: "Skype", mono: "SKY", tier: "legacy", context: "Client calls and remote support in the consultancy years; retired with the product.", href: "https://www.skype.com/" },
    ],
  },
  {
    id: "itsupport",
    label: "IT Support & Security",
    shortLabel: "IT & Security",
    description:
      "Six years of PcSquad house calls: malware removal, hardware diagnostics, network setup, and the toolkit that lived on a bootable USB stick.",
    lucide: "shield",
    tools: [
      { name: "Malwarebytes", icon: "siMalwarebytes", tier: "production", context: "The second-opinion scanner on every PcSquad clean-up, and still the first tool run on a machine that misbehaves.", href: "https://www.malwarebytes.com/" },
      { name: "ESET NOD32", mono: "ESET", tier: "legacy", context: "Lightweight endpoint protection recommended and deployed on client machines for its low footprint.", href: "https://www.eset.com/" },
      { name: "Kaspersky", icon: "siKaspersky", tier: "legacy", context: "Endpoint protection deployed on small-business fleets, with central licence tracking.", href: "https://www.kaspersky.com/" },
      { name: "Norton", icon: "siNorton", tier: "legacy", context: "Consumer security suite installed, renewed, and troubleshot on client machines.", href: "https://us.norton.com/" },
      { name: "McAfee", icon: "siMcafee", tier: "legacy", context: "OEM-bundled security on new client machines: configured when wanted, cleanly removed when not.", href: "https://www.mcafee.com/" },
      { name: "Avira", icon: "siAvira", tier: "legacy", context: "Free antivirus recommended for home clients on a budget during the consultancy years.", href: "https://www.avira.com/" },
      { name: "Microsoft Security Essentials", mono: "MSE", tier: "legacy", context: "The default recommendation for Windows 7 clients before Defender became built in.", href: "https://support.microsoft.com/" },
      { name: "CCleaner", icon: "siCcleaner", tier: "legacy", context: "Startup entries, temp files, and registry clean-up on slow client machines.", href: "https://www.ccleaner.com/" },
      { name: "AdwCleaner", mono: "ADW", tier: "legacy", context: "Adware and browser-hijacker removal in the standard PcSquad clean-up sequence.", href: "https://www.malwarebytes.com/adwcleaner" },
      { name: "Ultimate Boot CD", mono: "UBCD", tier: "legacy", context: "Bootable diagnostics for drives, memory, and password resets when Windows would not start.", href: "https://www.ultimatebootcd.com/" },
      { name: "DxDiag", mono: "DX", tier: "legacy", context: "First-pass hardware and driver report on client machines with display or audio faults.", href: "https://support.microsoft.com/" },
      { name: "Chrome Remote Desktop", mono: "CRD", tier: "production", context: "Remote support sessions for clients, and remote access to the workstation from anywhere.", href: "https://remotedesktop.google.com/" },
      { name: "WatchGuard", mono: "WG", tier: "legacy", context: "Firebox firewalls configured for small-business clients: VPN tunnels, content filtering, and port policies.", href: "https://www.watchguard.com/" },
      { name: "Cisco Packet Tracer", icon: "siCisco", tier: "legacy", context: "Network simulation for coursework and for planning client office networks before buying hardware.", href: "https://www.netacad.com/cisco-packet-tracer" },
      { name: "7-Zip", icon: "si7zip", tier: "production", context: "Archive handling on Windows, from client backups to the release bundles that ship as .zip.", href: "https://www.7-zip.org/" },
      { name: "VLC", icon: "siVlcmediaplayer", tier: "production", context: "Plays anything a client hands over, and transcodes the odd video for the web.", href: "https://www.videolan.org/" },
    ],
  },
];

export const tierLabel: Record<ToolTier, string> = {
  production: "In production",
  active: "Active build",
  evaluating: "Benchmarked",
  legacy: "Legacy, retired",
};

export interface ArsenalIntro {
  eyebrow: string;
  heading: string;
  description: string;
}

export const arsenalIntro: ArsenalIntro = {
  eyebrow: "Skills and tools",
  heading: "What I work with, and how deep it goes.",
  description:
    "Nearly two hundred tools, and every one of them has a job in a real system, from the 2012 consultancy years to the current Applied AI work. Hover or tap a tile to see where it is used and how deep the experience runs.",
};
