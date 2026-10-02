import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { runtimeEnv } from "@/lib/cloudflare/env";
import { getDb } from "@/lib/db";
import { queueTransactionalEmail } from "@/lib/email/service";
import {
  renderPasswordResetEmail,
  renderVerificationEmail,
} from "@/lib/email/templates/auth";
import { account, session, user, verification } from "@/lib/db/schema";
import {
  AUTH_PASSWORD_MAX_LENGTH,
  AUTH_PASSWORD_MIN_LENGTH,
  normalizeAuthName,
  normalizeEmailAddress,
} from "@/lib/validation/auth";

export function getAuth() {
  const secret = runtimeEnv.BETTER_AUTH_SECRET;

  if (!secret || secret.length < 32) {
    throw new Error("BETTER_AUTH_SECRET must be configured with at least 32 characters.");
  }

  const githubClientId = runtimeEnv.GITHUB_CLIENT_ID;
  const githubClientSecret = runtimeEnv.GITHUB_CLIENT_SECRET;

  return betterAuth({
    appName: "der.my.id",
    baseURL: runtimeEnv.BETTER_AUTH_URL,
    secret,
    advanced: { cookiePrefix: "der-my-id" },
    database: drizzleAdapter(getDb(), {
      provider: "sqlite",
      schema: { user, account, session, verification },
    }),
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
      minPasswordLength: AUTH_PASSWORD_MIN_LENGTH,
      maxPasswordLength: AUTH_PASSWORD_MAX_LENGTH,
      revokeSessionsOnPasswordReset: true,
      resetPasswordTokenExpiresIn: 30 * 60,
      sendResetPassword: async ({ user, url }) => {
        const content = renderPasswordResetEmail(user.name, url);
        await queueTransactionalEmail({
          to: user.email,
          subject: "Reset your der.my.id password",
          ...content,
        });
      },
    },
    emailVerification: {
      sendOnSignUp: true,
      autoSignInAfterVerification: true,
      expiresIn: 60 * 60,
      sendVerificationEmail: async ({ user, url }) => {
        const content = renderVerificationEmail(user.name, url);
        await queueTransactionalEmail({
          to: user.email,
          subject: "Verify your der.my.id email address",
          ...content,
        });
      },
    },
    databaseHooks: {
      user: {
        create: {
          before: async (newUser) => ({
            data: {
              ...newUser,
              email: normalizeEmailAddress(newUser.email),
              name: normalizeAuthName(newUser.name),
            },
          }),
        },
      },
    },
    user: {
      additionalFields: {
        role: { type: "string", required: false, defaultValue: "user", input: false },
        status: { type: "string", required: false, defaultValue: "active", input: false },
      },
    },
    ...(githubClientId && githubClientSecret
      ? { socialProviders: { github: { clientId: githubClientId, clientSecret: githubClientSecret } } }
      : {}),
  });
}