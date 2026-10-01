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
}, env: Pick<RuntimeEnv, "RESEND_API_KEY" | "BREVO_API_KEY" | "EMAIL_SENDER_NAME" | "EMAIL_SENDER_EMAIL"> = {}) {
  if (!env.EMAIL_SENDER_NAME || !env.EMAIL_SENDER_EMAIL) {
    throw new Error("Email sender name and address must be configured.");
  }

  const sender = { name: env.EMAIL_SENDER_NAME, email: env.EMAIL_SENDER_EMAIL };
  const primary = await sendWithResend({ email, otp, type, apiKey: env.RESEND_API_KEY, sender }).catch((error) => {
    console.error("Resend email provider failed", error);
    return false;
  });

  if (primary) {
    return;
  }

  await sendWithBrevo({ email, otp, type, apiKey: env.BREVO_API_KEY, sender }).catch((error) => {
    console.error("Brevo email provider failed", error);
    throw error;
  });
}

async function sendWithResend({
  email,
  otp,
  type,
  apiKey,
  sender,
}: {
  email: string;
  otp: string;
  type: EmailVerificationType;
  apiKey?: string;
  sender: { name: string; email: string };
}) {
  if (!apiKey) {
    return false;
  }

  const resend = new Resend(apiKey);
  const subject = type === "sign-in" ? "Your sign-in code" : "Your verification code";

  const { data, error } = await resend.emails.send({
    from: `${sender.name} <${sender.email}>`,
    to: [email],
    subject,
    html: `<p>Your one-time code is <strong>${otp}</strong>. This code expires in five minutes.</p>`,
    text: `Your one-time code is ${otp}. This code expires in five minutes.`,
  });

  if (error) {
    throw new Error(`Resend rejected verification email: ${error.message}`);
  }
  if (!data?.id) {
    throw new Error("Resend did not confirm verification email delivery.");
  }

  return true;
}

async function sendWithBrevo({
  email,
  otp,
  type,
  apiKey,
  sender,
}: {
  email: string;
  otp: string;
  type: EmailVerificationType;
  apiKey?: string;
  sender: { name: string; email: string };
}) {
  if (!apiKey) {
    throw new Error("Brevo API key not configured");
  }

  const brevo = new BrevoClient({ apiKey });
  const subject = type === "sign-in" ? "Your sign-in code" : "Your verification code";

  await brevo.transactionalEmails.sendTransacEmail({
    subject,
    sender,
    to: [{ email, name: email }],
    textContent: `Your one-time code is ${otp}. This code expires in five minutes.`,
    htmlContent: `<p>Your one-time code is <strong>${otp}</strong>. This code expires in five minutes.</p>`,
  });

  return true;
}
