import { Resend } from "resend";

import { runtimeEnv } from "@/lib/cloudflare/env";
import { TRANSACTIONAL_EMAIL_FROM, type TransactionalEmail } from "@/lib/email/types";

export async function sendWithResend(message: TransactionalEmail) {
  const apiKey = runtimeEnv.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error("Resend is not configured.");
  }

  const resend = new Resend(apiKey);
  const { error } = await resend.emails.send({
    from: TRANSACTIONAL_EMAIL_FROM,
    to: message.to,
    subject: message.subject,
    text: message.text,
  });

  if (error) {
    throw new Error("Resend rejected the email request.");
  }
}