import { AppError } from "@/lib/errors";
import { normalizeEmailAddress } from "@/lib/validation/auth";

export type TransactionalEmail = {
  to: string;
  subject: string;
  text: string;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseTransactionalEmail(value: unknown): TransactionalEmail {
  if (!isRecord(value) || typeof value.subject !== "string" || typeof value.text !== "string") {
    throw new AppError(400, "invalid_email_message", "A valid email message is required.");
  }

  const subject = value.subject.trim();
  const text = value.text.trim();
  if (
    !subject ||
    subject.length > 200 ||
    /[\r\n\u0000]/.test(subject) ||
    !text ||
    text.length > 100_000
  ) {
    throw new AppError(400, "invalid_email_message", "The email subject or message is invalid.");
  }

  return {
    to: normalizeEmailAddress(value.to),
    subject,
    text,
  };
}