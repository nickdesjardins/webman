import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { contactSchema, fieldErrors } from "@/lib/schemas";

export const runtime = "nodejs";

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
/** Generous ceiling above the 4000-character message limit plus the other fields. */
const MAX_BODY_BYTES = 32 * 1024;
/** When the limiter map grows past this many keys, expired entries are swept. */
const SWEEP_THRESHOLD = 1000;

const NO_STORE = { "Cache-Control": "no-store" } as const;

/**
 * In-memory sliding window keyed by client IP. State is per server instance,
 * which is the right trade-off for a single-origin portfolio form.
 */
const hits = new Map<string, number[]>();
let warnedNotConfigured = false;

type JsonValue = Record<string, unknown> | unknown[] | string | number | boolean | null;

function json(body: JsonValue, status: number, headers?: Record<string, string>) {
  return NextResponse.json(body, { status, headers: { ...NO_STORE, ...headers } });
}

function clientKey(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const real = request.headers.get("x-real-ip")?.trim();
  return real || "unknown";
}

function sweep(now: number) {
  for (const [key, stamps] of hits) {
    if (stamps.every((t) => now - t >= RATE_WINDOW_MS)) hits.delete(key);
  }
}

type RateDecision = { limited: false } | { limited: true; retryAfterSeconds: number };

function rateLimit(key: string, now: number): RateDecision {
  if (hits.size > SWEEP_THRESHOLD) sweep(now);
  const recent = (hits.get(key) ?? []).filter((t) => now - t < RATE_WINDOW_MS);
  if (recent.length >= RATE_LIMIT) {
    hits.set(key, recent);
    const oldest = recent[0] ?? now;
    const retryAfterSeconds = Math.max(1, Math.ceil((oldest + RATE_WINDOW_MS - now) / 1000));
    return { limited: true, retryAfterSeconds };
  }
  recent.push(now);
  hits.set(key, recent);
  return { limited: false };
}

type BodyResult = { ok: true; value: unknown } | { ok: false; status: 400 | 413 };

async function readJsonBody(request: Request): Promise<BodyResult> {
  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > MAX_BODY_BYTES) return { ok: false, status: 413 };

  let text: string;
  try {
    text = await request.text();
  } catch {
    return { ok: false, status: 400 };
  }
  if (text.length > MAX_BODY_BYTES) return { ok: false, status: 413 };

  try {
    return { ok: true, value: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, status: 400 };
  }
}

/** True when the hidden "website" field carries anything at all. */
function honeypotTripped(raw: unknown): boolean {
  if (typeof raw !== "object" || raw === null) return false;
  const website = (raw as Record<string, unknown>).website;
  if (website === undefined || website === null) return false;
  if (typeof website === "string") return website.trim().length > 0;
  return true;
}

interface SmtpConfig {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
  to: string;
  from: string;
}

function smtpConfig(): SmtpConfig | null {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO, CONTACT_FROM } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS || !CONTACT_TO) return null;
  const parsed = Number.parseInt(SMTP_PORT ?? "", 10);
  const port = Number.isFinite(parsed) && parsed > 0 ? parsed : 587;
  return {
    host: SMTP_HOST,
    port,
    secure: port === 465,
    user: SMTP_USER,
    pass: SMTP_PASS,
    to: CONTACT_TO,
    from: CONTACT_FROM || SMTP_USER,
  };
}

/** Header values must stay on one line; collapse any whitespace runs. */
function headerSafe(value: string): string {
  return value.replace(/[\r\n\t]+/g, " ").replace(/\s{2,}/g, " ").trim();
}

function errorCode(err: unknown): string {
  if (typeof err === "object" && err !== null && "code" in err) {
    const code = (err as { code: unknown }).code;
    if (typeof code === "string") return code;
  }
  return err instanceof Error ? err.name : "unknown";
}

export async function POST(request: Request) {
  const body = await readJsonBody(request);
  if (!body.ok) {
    return json(
      { error: body.status === 413 ? "payload_too_large" : "invalid_json" },
      body.status
    );
  }

  // Bots that fill the honeypot get a quiet success and nothing else.
  if (honeypotTripped(body.value)) {
    return json({ ok: true }, 200);
  }

  const decision = rateLimit(clientKey(request), Date.now());
  if (decision.limited) {
    return json({ error: "rate_limited", retryAfter: decision.retryAfterSeconds }, 429, {
      "Retry-After": String(decision.retryAfterSeconds),
    });
  }

  const parsed = contactSchema.safeParse(body.value);
  if (!parsed.success) {
    return json({ error: "validation_error", fields: fieldErrors(parsed.error) }, 400);
  }

  const config = smtpConfig();
  if (!config) {
    if (!warnedNotConfigured) {
      warnedNotConfigured = true;
      console.warn(
        "[contact] SMTP is not configured. Set SMTP_HOST, SMTP_USER, SMTP_PASS and CONTACT_TO to enable sending."
      );
    }
    return json({ error: "not_configured" }, 503);
  }

  const { name, email, company, message } = parsed.data;
  const safeName = headerSafe(name);

  const lines = [`Name: ${name}`, `Email: ${email}`];
  if (company) lines.push(`Company: ${company}`);
  lines.push("", message, "", `Received: ${new Date().toISOString()}`, "Sent from the webman.dev contact form.");

  try {
    const transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.secure,
      auth: { user: config.user, pass: config.pass },
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });

    await transporter.sendMail({
      from: config.from,
      to: config.to,
      replyTo: `${safeName} <${email}>`,
      subject: `[webman.dev] Contact from ${safeName}`,
      text: lines.join("\n"),
    });

    return json({ ok: true }, 200);
  } catch (err) {
    // Log only the error class and SMTP code; never credentials or the message body.
    console.error("[contact] send_failed", { code: errorCode(err) });
    return json({ error: "send_failed" }, 500);
  }
}

export function GET() {
  return json({ error: "method_not_allowed" }, 405, { Allow: "POST" });
}
