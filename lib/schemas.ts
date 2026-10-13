import { z } from "zod";
import type { Locale } from "@/lib/i18n";

/**
 * Field limits shared by the schema, the form hints, and the API route so
 * every layer agrees on the same numbers.
 */
export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  companyMax: 120,
  messageMin: 20,
  messageMax: 4000,
} as const;

interface ContactMessages {
  nameRequired: string;
  nameMin: string;
  nameMax: string;
  email: string;
  companyType: string;
  companyMax: string;
  messageRequired: string;
  messageMin: string;
  messageMax: string;
  honeypot: string;
}

type ContactMessageKey = keyof ContactMessages;

/**
 * Validation messages per locale. The API route always answers with the
 * English set; the form maps those back to the visitor's locale through
 * localizeContactMessage so the server never has to know the UI language.
 */
const CONTACT_MESSAGES: Record<Locale, ContactMessages> = {
  en: {
    nameRequired: "Enter your name.",
    nameMin: `Name must be at least ${CONTACT_LIMITS.nameMin} characters.`,
    nameMax: `Name must be ${CONTACT_LIMITS.nameMax} characters or fewer.`,
    email: "Enter a valid email address.",
    companyType: "Company must be text.",
    companyMax: `Company must be ${CONTACT_LIMITS.companyMax} characters or fewer.`,
    messageRequired: "Enter a message.",
    messageMin: `Message must be at least ${CONTACT_LIMITS.messageMin} characters.`,
    messageMax: `Message must be ${CONTACT_LIMITS.messageMax} characters or fewer.`,
    honeypot: "Leave this field empty.",
  },
  fr: {
    nameRequired: "Entrez votre nom.",
    nameMin: `Le nom doit contenir au moins ${CONTACT_LIMITS.nameMin} caractères.`,
    nameMax: `Le nom doit contenir au plus ${CONTACT_LIMITS.nameMax} caractères.`,
    email: "Entrez une adresse courriel valide.",
    companyType: "L'entreprise doit être du texte.",
    companyMax: `Le nom de l'entreprise doit contenir au plus ${CONTACT_LIMITS.companyMax} caractères.`,
    messageRequired: "Entrez un message.",
    messageMin: `Le message doit contenir au moins ${CONTACT_LIMITS.messageMin} caractères.`,
    messageMax: `Le message doit contenir au plus ${CONTACT_LIMITS.messageMax} caractères.`,
    honeypot: "Laissez ce champ vide.",
  },
};

/**
 * Contact form payload. The client runs it for field-level feedback and the
 * API route runs it as the authoritative check, so the rules live in one place
 * and only the message text varies by locale.
 */
function buildContactSchema(m: ContactMessages) {
  return z.object({
    name: z
      .string({ error: m.nameRequired })
      .trim()
      .min(CONTACT_LIMITS.nameMin, { error: m.nameMin })
      .max(CONTACT_LIMITS.nameMax, { error: m.nameMax }),
    email: z.email({ error: m.email }),
    company: z
      .string({ error: m.companyType })
      .trim()
      .max(CONTACT_LIMITS.companyMax, { error: m.companyMax })
      .optional()
      .transform((value) => (value === "" ? undefined : value)),
    message: z
      .string({ error: m.messageRequired })
      .trim()
      .min(CONTACT_LIMITS.messageMin, { error: m.messageMin })
      .max(CONTACT_LIMITS.messageMax, { error: m.messageMax }),
    /** Honeypot. The visible form never populates it; anything inside marks a bot. */
    website: z
      .string({ error: m.honeypot })
      .max(0, { error: m.honeypot })
      .optional(),
  });
}

/** English schema: the authoritative check in app/api/contact/route.ts. */
export const contactSchema = buildContactSchema(CONTACT_MESSAGES.en);

export type ContactSchema = typeof contactSchema;
export type ContactInput = z.infer<ContactSchema>;
export type ContactField = keyof ContactInput;

const CONTACT_SCHEMAS: Record<Locale, ContactSchema> = {
  en: contactSchema,
  fr: buildContactSchema(CONTACT_MESSAGES.fr),
};

/** Same rules as contactSchema with messages in the requested locale. */
export function makeContactSchema(locale: Locale): ContactSchema {
  return CONTACT_SCHEMAS[locale];
}

/**
 * Maps an English message produced by contactSchema (as returned by the API
 * route) to its equivalent in another locale. Unknown text yields undefined so
 * the caller can fall back instead of showing the server's English.
 */
export function localizeContactMessage(message: string, locale: Locale): string | undefined {
  const source = CONTACT_MESSAGES.en;
  for (const key of Object.keys(source) as ContactMessageKey[]) {
    if (source[key] === message) return CONTACT_MESSAGES[locale][key];
  }
  return undefined;
}

/**
 * Collapses a ZodError into one message per field path (first issue wins).
 * Issues without a path land under "form".
 */
export function fieldErrors<T>(error: z.ZodError<T>): Record<string, string> {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = issue.path.length > 0 ? issue.path.map(String).join(".") : "form";
    if (!(key in errors)) errors[key] = issue.message;
  }
  return errors;
}
