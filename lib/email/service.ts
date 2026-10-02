import { getRequestExecutionContext } from "vinext/shims/request-context";

import { sendWithBrevo } from "@/lib/email/providers/brevo";
import { sendWithResend } from "@/lib/email/providers/resend";
import { AppError } from "@/lib/errors";
import { parseTransactionalEmail } from "@/lib/validation/email";

function logProviderOutcome(provider: "resend" | "brevo", outcome: "success" | "failure") {
  const entry = JSON.stringify({ event: "transactional_email_delivery", provider, outcome });
  if (outcome === "failure") {
    console.warn(entry);
  } else {
    console.info(entry);
  }
}

export async function sendTransactionalEmail(input: unknown): Promise<void> {
  const message = parseTransactionalEmail(input);

  try {
    await sendWithResend(message);
    logProviderOutcome("resend", "success");
    return;
  } catch {
    logProviderOutcome("resend", "failure");
  }

  try {
    await sendWithBrevo(message);
    logProviderOutcome("brevo", "success");
  } catch {
    logProviderOutcome("brevo", "failure");
    throw new AppError(503, "email_delivery_failed", "Email delivery is temporarily unavailable.");
  }
}

export function queueTransactionalEmail(input: unknown): Promise<void> {
  const delivery = sendTransactionalEmail(input);
  const requestContext = getRequestExecutionContext();

  if (requestContext) {
    requestContext.waitUntil(delivery.catch(() => undefined));
    return Promise.resolve();
  }

  return delivery;
}