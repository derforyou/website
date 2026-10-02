import { BrevoClient } from "@getbrevo/brevo";

import { runtimeEnv } from "@/lib/cloudflare/env";
import { TRANSACTIONAL_EMAIL_SENDER, type TransactionalEmail } from "@/lib/email/types";

export async function sendWithBrevo(message: TransactionalEmail) {
  const apiKey = runtimeEnv.BREVO_API_KEY;
  if (!apiKey) {
    throw new Error("Brevo is not configured.");
  }

  const brevo = new BrevoClient({
    apiKey,
    timeoutInSeconds: 15,
    maxRetries: 0,
  });

  await brevo.transactionalEmails.sendTransacEmail(
    {
      sender: TRANSACTIONAL_EMAIL_SENDER,
      to: [{ email: message.to }],
      subject: message.subject,
      textContent: message.text,
      ...(message.html ? { htmlContent: message.html } : {}),
    },
    { timeoutInSeconds: 15, maxRetries: 0 },
  );
}