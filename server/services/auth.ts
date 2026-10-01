import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../database/schema";
import type { RuntimeEnv } from "../lib/env";
import { sendVerificationEmail } from "./email";

export type BetterAuthRuntimeEnv = RuntimeEnv;

export function createAuth(env: BetterAuthRuntimeEnv) {
  if (!env.D1_DATABASE) {
    throw new Error("Better Auth requires the D1_DATABASE binding.");
  }
  if (!env.BETTER_AUTH_SECRET || env.BETTER_AUTH_SECRET.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must contain at least 32 characters.");
  }

  const database = drizzle(env.D1_DATABASE, { schema });
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
