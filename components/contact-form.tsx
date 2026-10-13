"use client";

import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { CircleAlert, CircleCheck, LoaderCircle, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocale } from "@/components/locale-provider";
import type { Locale } from "@/lib/i18n";
import {
  CONTACT_LIMITS,
  fieldErrors,
  localizeContactMessage,
  makeContactSchema,
  type ContactField,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";

type Values = Record<ContactField, string>;
type FieldErrorMap = Partial<Record<ContactField, string>>;
type Status = "idle" | "submitting" | "success" | "error";
type FailureKind = "validation" | "rate_limited" | "not_configured" | "generic";

const STRINGS = {
  en: {
    name: "Name",
    namePlaceholder: "Your name",
    email: "Email",
    emailPlaceholder: "you@company.com",
    company: "Company",
    optional: "(optional)",
    companyPlaceholder: "Where you work",
    message: "Message",
    messagePlaceholder: "What are you building, where is it failing, and what does success look like?",
    minimumChars: `Minimum ${CONTACT_LIMITS.messageMin} characters`,
    honeypot: "Website",
    send: "Send message",
    sending: "Sending",
    sendingSr: "Sending your message.",
    sentTitle: "Message sent.",
    sentBody: "I reply within one business day.",
    sendAnother: "Send another",
    fieldInvalid: "Check this field.",
  },
  fr: {
    name: "Nom",
    namePlaceholder: "Votre nom",
    email: "Courriel",
    emailPlaceholder: "vous@entreprise.com",
    company: "Entreprise",
    optional: "(facultatif)",
    companyPlaceholder: "Où vous travaillez",
    message: "Message",
    messagePlaceholder: "Que construisez-vous, où est-ce que ça bloque, et à quoi ressemble la réussite?",
    minimumChars: `Minimum ${CONTACT_LIMITS.messageMin} caractères`,
    honeypot: "Site web",
    send: "Envoyer",
    sending: "Envoi en cours",
    sendingSr: "Envoi de votre message.",
    sentTitle: "Message envoyé.",
    sentBody: "Je réponds dans un délai d'un jour ouvrable.",
    sendAnother: "Envoyer un autre message",
    fieldInvalid: "Vérifiez ce champ.",
  },
} satisfies Record<Locale, Record<string, string>>;

const FAILURE_MESSAGES: Record<Locale, Record<FailureKind, string>> = {
  en: {
    validation: "Some fields need attention. Fix the highlighted fields and send again.",
    rate_limited: "Too many messages from this network. Try again in a few minutes.",
    not_configured: "The form is not configured yet. Email me directly instead.",
    generic: "The message could not be sent. Try again in a moment, or email me directly.",
  },
  fr: {
    validation:
      "Certains champs demandent votre attention. Corrigez les champs signalés, puis renvoyez le message.",
    rate_limited: "Trop de messages envoyés depuis ce réseau. Réessayez dans quelques minutes.",
    not_configured: "Le formulaire n'est pas encore configuré. Écrivez-moi plutôt directement par courriel.",
    generic:
      "Le message n'a pas pu être envoyé. Réessayez dans un instant ou écrivez-moi directement par courriel.",
  },
};

const EMPTY_VALUES: Values = { name: "", email: "", company: "", message: "", website: "" };

/** Visible fields in tab order; drives error focus and server error mapping. */
const FIELD_ORDER = ["name", "email", "company", "message"] as const satisfies readonly ContactField[];

const FAILURES_WITH_MAILTO: ReadonlySet<FailureKind> = new Set(["not_configured", "generic"]);

interface ApiErrorBody {
  error?: string;
  fields?: Record<string, string>;
}

function isStringRecord(value: unknown): value is Record<string, string> {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;
  return Object.values(value).every((entry) => typeof entry === "string");
}

async function readErrorBody(response: Response): Promise<ApiErrorBody | null> {
  try {
    const data: unknown = await response.json();
    if (typeof data !== "object" || data === null) return null;
    const record = data as Record<string, unknown>;
    return {
      error: typeof record.error === "string" ? record.error : undefined,
      fields: isStringRecord(record.fields) ? record.fields : undefined,
    };
  } catch {
    return null;
  }
}

/** Mirrors the server's view of the payload before validation. */
function toCandidate(values: Values) {
  return { ...values, email: values.email.trim() };
}

/** Runs the shared rules with messages in the visitor's locale. */
function validate(values: Values, locale: Locale): Record<string, string> {
  const result = makeContactSchema(locale).safeParse(toCandidate(values));
  return result.success ? {} : fieldErrors(result.error);
}

function pickFieldErrors(source: Record<string, string>): FieldErrorMap {
  const next: FieldErrorMap = {};
  for (const field of FIELD_ORDER) {
    const message: string | undefined = source[field];
    if (message) next[field] = message;
  }
  return next;
}

/**
 * The API route answers 400 with English messages. Translate each flagged
 * field by message lookup first, then by re-running the localized schema on the
 * same values, and finally with a neutral per-field fallback so the server's
 * English text is never shown.
 */
function localizeServerErrors(
  fields: Record<string, string>,
  values: Values,
  locale: Locale,
  fallback: string
): FieldErrorMap {
  const local = validate(values, locale);
  const next: FieldErrorMap = {};
  for (const field of FIELD_ORDER) {
    const serverMessage: string | undefined = fields[field];
    if (!serverMessage) continue;
    const localMessage: string | undefined = local[field];
    next[field] = localizeContactMessage(serverMessage, locale) ?? localMessage ?? fallback;
  }
  return next;
}

function formatNumber(value: number, locale: Locale): string {
  return value.toLocaleString(locale === "fr" ? "fr-CA" : "en-CA");
}

function describedBy(...ids: Array<string | false | undefined>): string | undefined {
  const list = ids.filter((id): id is string => Boolean(id));
  return list.length > 0 ? list.join(" ") : undefined;
}

interface FieldErrorProps {
  id: string;
  message?: string;
}

function FieldError({ id, message }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p id={id} className="flex items-start gap-1.5 text-xs text-destructive">
      <CircleAlert className="mt-px size-3.5 shrink-0" aria-hidden="true" />
      <span>{message}</span>
    </p>
  );
}

interface ContactFormProps {
  /** Shown as the mailto fallback inside error states. */
  email: string;
  /** Response-time line from the locale's site data, shown beside the submit button. */
  responseTime: string;
}

export function ContactForm({ email, responseTime }: ContactFormProps) {
  const locale = useLocale();
  const t = STRINGS[locale];
  const failureMessages = FAILURE_MESSAGES[locale];

  const baseId = useId();
  const ids = {
    name: `${baseId}-name`,
    email: `${baseId}-email`,
    company: `${baseId}-company`,
    message: `${baseId}-message`,
    messageHint: `${baseId}-message-hint`,
    website: `${baseId}-website`,
  };

  const [values, setValues] = useState<Values>(EMPTY_VALUES);
  const [errors, setErrors] = useState<FieldErrorMap>({});
  const [status, setStatus] = useState<Status>("idle");
  const [failure, setFailure] = useState<FailureKind | null>(null);

  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const companyRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLDivElement>(null);
  const pendingFocus = useRef<ContactField | null>(null);

  const submitting = status === "submitting";
  const messageLength = values.message.trim().length;
  const messageMeetsMin = messageLength >= CONTACT_LIMITS.messageMin;

  /** Only called from event handlers and effects, never during render. */
  function fieldElement(field: ContactField): HTMLInputElement | HTMLTextAreaElement | null {
    switch (field) {
      case "name":
        return nameRef.current;
      case "email":
        return emailRef.current;
      case "company":
        return companyRef.current;
      case "message":
        return messageRef.current;
      default:
        return null;
    }
  }

  function focusField(field: ContactField) {
    fieldElement(field)?.focus();
  }

  useEffect(() => {
    if (status === "success") {
      successRef.current?.focus();
      return;
    }
    if (status === "idle" && pendingFocus.current) {
      fieldElement(pendingFocus.current)?.focus();
      pendingFocus.current = null;
    }
  }, [status]);

  function updateFieldError(field: ContactField, nextValues: Values) {
    const message: string | undefined = validate(nextValues, locale)[field];
    setErrors((previous) => {
      const next = { ...previous };
      if (message) next[field] = message;
      else delete next[field];
      return next;
    });
  }

  function handleChange(field: ContactField) {
    return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const nextValues = { ...values, [field]: event.target.value };
      setValues(nextValues);
      // Re-check live only once a field has already shown an error, so the
      // message clears as soon as the input becomes valid.
      if (errors[field]) updateFieldError(field, nextValues);
    };
  }

  function handleBlur(field: ContactField) {
    return () => updateFieldError(field, values);
  }

  function reset() {
    setValues(EMPTY_VALUES);
    setErrors({});
    setFailure(null);
    pendingFocus.current = "name";
    setStatus("idle");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;

    const clientErrors = pickFieldErrors(validate(values, locale));
    const firstInvalid = FIELD_ORDER.find((field) => clientErrors[field]);
    if (firstInvalid) {
      setErrors(clientErrors);
      setFailure("validation");
      setStatus("error");
      focusField(firstInvalid);
      return;
    }

    setErrors({});
    setFailure(null);
    setStatus("submitting");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(toCandidate(values)),
      });

      if (response.ok) {
        setValues(EMPTY_VALUES);
        setStatus("success");
        return;
      }

      if (response.status === 400) {
        const data = await readErrorBody(response);
        const serverErrors = data?.fields
          ? localizeServerErrors(data.fields, values, locale, t.fieldInvalid)
          : {};
        const firstServerInvalid = FIELD_ORDER.find((field) => serverErrors[field]);
        setErrors(serverErrors);
        setFailure(firstServerInvalid ? "validation" : "generic");
        setStatus("error");
        if (firstServerInvalid) focusField(firstServerInvalid);
        return;
      }

      if (response.status === 429) {
        setFailure("rate_limited");
        setStatus("error");
        return;
      }

      if (response.status === 503) {
        setFailure("not_configured");
        setStatus("error");
        return;
      }

      setFailure("generic");
      setStatus("error");
    } catch {
      setFailure("generic");
      setStatus("error");
    }
  }

  return (
    <div className="space-y-6">
      {status !== "success" && (
        <form
          noValidate
          onSubmit={handleSubmit}
          aria-busy={submitting || undefined}
          className="relative space-y-5"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={ids.name}>{t.name}</Label>
              <Input
                ref={nameRef}
                id={ids.name}
                name="name"
                type="text"
                autoComplete="name"
                required
                maxLength={CONTACT_LIMITS.nameMax}
                value={values.name}
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                disabled={submitting}
                aria-invalid={errors.name ? true : undefined}
                aria-describedby={describedBy(errors.name && `${ids.name}-error`)}
                placeholder={t.namePlaceholder}
              />
              <FieldError id={`${ids.name}-error`} message={errors.name} />
            </div>

            <div className="space-y-2">
              <Label htmlFor={ids.email}>{t.email}</Label>
              <Input
                ref={emailRef}
                id={ids.email}
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                required
                maxLength={254}
                value={values.email}
                onChange={handleChange("email")}
                onBlur={handleBlur("email")}
                disabled={submitting}
                aria-invalid={errors.email ? true : undefined}
                aria-describedby={describedBy(errors.email && `${ids.email}-error`)}
                placeholder={t.emailPlaceholder}
              />
              <FieldError id={`${ids.email}-error`} message={errors.email} />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor={ids.company}>
              {t.company}
              <span className="font-normal text-muted-foreground">{t.optional}</span>
            </Label>
            <Input
              ref={companyRef}
              id={ids.company}
              name="company"
              type="text"
              autoComplete="organization"
              maxLength={CONTACT_LIMITS.companyMax}
              value={values.company}
              onChange={handleChange("company")}
              onBlur={handleBlur("company")}
              disabled={submitting}
              aria-invalid={errors.company ? true : undefined}
              aria-describedby={describedBy(errors.company && `${ids.company}-error`)}
              placeholder={t.companyPlaceholder}
            />
            <FieldError id={`${ids.company}-error`} message={errors.company} />
          </div>

          <div className="space-y-2">
            <Label htmlFor={ids.message}>{t.message}</Label>
            <Textarea
              ref={messageRef}
              id={ids.message}
              name="message"
              rows={6}
              required
              maxLength={CONTACT_LIMITS.messageMax}
              value={values.message}
              onChange={handleChange("message")}
              onBlur={handleBlur("message")}
              disabled={submitting}
              aria-invalid={errors.message ? true : undefined}
              aria-describedby={describedBy(ids.messageHint, errors.message && `${ids.message}-error`)}
              placeholder={t.messagePlaceholder}
              className="min-h-36 resize-y"
            />
            <div className="flex flex-col gap-1.5">
              <p
                id={ids.messageHint}
                className="flex items-center justify-between gap-4 font-mono text-xs tabular-nums text-muted-foreground"
              >
                <span>{t.minimumChars}</span>
                <span className={cn(messageMeetsMin && "text-success")}>
                  {formatNumber(messageLength, locale)} / {formatNumber(CONTACT_LIMITS.messageMax, locale)}
                </span>
              </p>
              <FieldError id={`${ids.message}-error`} message={errors.message} />
            </div>
          </div>

          <div className="absolute left-0 top-0 h-0 w-0 overflow-hidden" aria-hidden="true">
            <label htmlFor={ids.website}>{t.honeypot}</label>
            <input
              id={ids.website}
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={handleChange("website")}
              className="absolute h-0 w-0 opacity-0"
            />
          </div>

          <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
            <p className="font-mono text-xs text-muted-foreground">{responseTime}</p>
            <Button type="submit" disabled={submitting} className="sm:min-w-40">
              {submitting ? (
                <LoaderCircle className="animate-spin motion-reduce:animate-none" aria-hidden="true" />
              ) : (
                <Send aria-hidden="true" />
              )}
              {submitting ? t.sending : t.send}
            </Button>
          </div>
        </form>
      )}

      <div role="status" aria-live="polite" aria-atomic="true">
        {submitting && <p className="sr-only">{t.sendingSr}</p>}

        {status === "error" && failure && (
          <div className="flex items-start gap-2.5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-foreground">
            <CircleAlert className="mt-0.5 size-4 shrink-0 text-destructive" aria-hidden="true" />
            <p>
              {failureMessages[failure]}
              {FAILURES_WITH_MAILTO.has(failure) && (
                <>
                  {" "}
                  <a
                    href={`mailto:${email}`}
                    className="font-medium text-primary underline underline-offset-4 hover:text-primary/80"
                  >
                    {email}
                  </a>
                </>
              )}
            </p>
          </div>
        )}

        {status === "success" && (
          <div
            ref={successRef}
            tabIndex={-1}
            className="flex flex-col items-start gap-4 rounded-lg border border-success/30 bg-success/5 p-5 outline-none animate-in fade-in slide-in-from-bottom-2 motion-reduce:animate-none"
          >
            <div className="flex items-start gap-3">
              <CircleCheck className="mt-0.5 size-5 shrink-0 text-success" aria-hidden="true" />
              <p className="text-sm">
                <span className="font-medium text-foreground">{t.sentTitle}</span>{" "}
                <span className="text-muted-foreground">{t.sentBody}</span>
              </p>
            </div>
            <Button type="button" variant="ghost" size="sm" onClick={reset}>
              {t.sendAnother}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactForm;
