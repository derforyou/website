import { BrevoClient } from "@getbrevo/brevo";
import { Resend } from "resend";
import type { RuntimeEnv } from "../lib/env";

export type EmailVerificationType =
  | "sign-in"
  | "email-verification"
  | "forget-password"
  | "change-email";

export async function sendVerificationEmail({
  email,
  otp,
  type,
}: {
  email: string;
  otp: string;
  type: EmailVerificationType;
}, env: Pick<RuntimeEnv, "RESEND_API_KEY" | "BREVO_API_KEY"> = {}) {
  const primary = await sendWithResend({ email, otp, type, apiKey: env.RESEND_API_KEY }).catch((error) => {
    console.error("Resend email provider failed", error);
    return false;
  });

  if (primary) {
    return;
  }

  await sendWithBrevo({ email, otp, type, apiKey: env.BREVO_API_KEY }).catch((error) => {
    console.error("Brevo email provider failed", error);
    throw error;
  });
}

async function sendWithResend({
  email,
  otp,
  type,
  apiKey,
}: {
  email: string;
  otp: string;
  type: EmailVerificationType;
  apiKey?: string;
}) {
  if (!apiKey) {
    return false;
  }

  const resend = new Resend(apiKey);
  const subject = type === "sign-in" ? "Your sign-in code" : "Your verification code";

  await resend.emails.send({
    from: "DER Platform <onboarding@resend.dev>",
    to: [email],
    subject,
    html: `<p>Your one-time code is <strong>${otp}</strong>. This code expires in five minutes.</p>`,
    text: `Your one-time code is ${otp}. This code expires in five minutes.`,
  });

  return true;
}

async function sendWithBrevo({
  email,
  otp,
  type,
  apiKey,
}: {
  email: string;
  otp: string;
  type: EmailVerificationType;
  apiKey?: string;
}) {
  if (!apiKey) {
    throw new Error("Brevo API key not configured");
  }

  const brevo = new BrevoClient({ apiKey });
  const subject = type === "sign-in" ? "Your sign-in code" : "Your verification code";

  await brevo.transactionalEmails.sendTransacEmail({
    subject,
    sender: { name: "DER Platform", email: "noreply@der.my.id" },
    to: [{ email, name: email }],
    textContent: `Your one-time code is ${otp}. This code expires in five minutes.`,
    htmlContent: `<p>Your one-time code is <strong>${otp}</strong>. This code expires in five minutes.</p>`,
  });

  return true;
}
