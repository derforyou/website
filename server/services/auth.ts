import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { APIError, createAuthMiddleware } from "better-auth/api";
import { emailOTP } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../database/schema";
import type { RuntimeEnv } from "../lib/env";
import { sendVerificationEmail } from "./email";

export type BetterAuthRuntimeEnv = RuntimeEnv;

const OTP_INITIAL_COOLDOWN_MS = 30_000;
const OTP_COOLDOWN_RESET_MS = 24 * 60 * 60 * 1000;

async function enforceOtpCooldown(database: D1Database, email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const now = Date.now();
  const sent = await database
    .prepare(
      `INSERT INTO authOtpThrottle (email, sentCount, lastSentAt, nextAllowedAt)
       VALUES (?1, 1, ?2, ?3)
       ON CONFLICT(email) DO UPDATE SET
         sentCount = CASE
           WHEN authOtpThrottle.lastSentAt <= ?2 - ?4 THEN 1
           ELSE authOtpThrottle.sentCount + 1
         END,
         lastSentAt = ?2,
         nextAllowedAt = ?2 + CASE
           WHEN authOtpThrottle.lastSentAt <= ?2 - ?4 THEN ?3 - ?2
           WHEN authOtpThrottle.sentCount = 1 THEN 60000
           WHEN authOtpThrottle.sentCount = 2 THEN 120000
           WHEN authOtpThrottle.sentCount = 3 THEN 240000
           WHEN authOtpThrottle.sentCount = 4 THEN 480000
           ELSE 900000
         END
       WHERE authOtpThrottle.nextAllowedAt <= ?2
       RETURNING nextAllowedAt`
    )
    .bind(normalizedEmail, now, now + OTP_INITIAL_COOLDOWN_MS, OTP_COOLDOWN_RESET_MS)
    .first<{ nextAllowedAt: number }>();

  if (sent) return;

  const current = await database
    .prepare("SELECT nextAllowedAt FROM authOtpThrottle WHERE email = ?1")
    .bind(normalizedEmail)
    .first<{ nextAllowedAt: number }>();
  const retrySeconds = Math.max(
    1,
    Math.ceil(((current?.nextAllowedAt ?? now + OTP_INITIAL_COOLDOWN_MS) - now) / 1000)
  );
  throw new APIError("TOO_MANY_REQUESTS", {
    message: `Please retry in ${retrySeconds} seconds.`,
  });
}

export function createAuth(env: BetterAuthRuntimeEnv) {
  const databaseBinding = env.D1_DATABASE;
  if (!databaseBinding) {
    throw new Error("Better Auth requires the D1_DATABASE binding.");
  }
  if (!env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must contain at least 32 characters.");
  }

  const database = drizzle(databaseBinding, { schema });
  const socialProviders =
    env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
            scope: ["read:user", "user:email"],
          },
        }
      : {};

  return betterAuth({
    database: drizzleAdapter(database, { provider: "sqlite" }),
    baseURL: env.APP_URL ?? "http://localhost:5173",
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.APP_URL ?? "http://localhost:5173"],
    socialProviders,
    hooks: {
      before: createAuthMiddleware(async (ctx) => {
        if (ctx.path === "/email-otp/send-verification-otp") {
          const email = ctx.body.email;
          if (typeof email === "string") {
            await enforceOtpCooldown(databaseBinding, email);
          }
        }
      }),
    },
    plugins: [
      emailOTP({
        sendVerificationOTP: async ({ email, otp, type }) => {
          await sendVerificationEmail({ email, otp, type }, env);
        },
        otpLength: 6,
        expiresIn: 300,
      }),
    ],
    emailAndPassword: {
      enabled: false,
    },
  });
}

export default createAuth;
