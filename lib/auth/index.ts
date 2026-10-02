import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";

import { runtimeEnv } from "@/lib/cloudflare/env";
import { getDb } from "@/lib/db";
import { account, session, user, verification } from "@/lib/db/schema";

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
    database: drizzleAdapter(getDb(), {
      provider: "sqlite",
      schema: { user, account, session, verification },
    }),
    emailAndPassword: { enabled: true },
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