import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "../database/schema";
import type { RuntimeEnv } from "../lib/env";
import { createAuth } from "./auth";

export type ApiDatabase = ReturnType<typeof drizzle<typeof schema>>;
type ApiKeyRecord = typeof schema.apiKey.$inferSelect;

export function createApiDatabase(env: RuntimeEnv) {
  return env.D1_DATABASE ? drizzle(env.D1_DATABASE, { schema }) : null;
}

export function jsonResponse(body: unknown, status = 200, headers: HeadersInit = {}) {
  return Response.json(body, {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export function problem(status: number, title: string, detail: string, headers: HeadersInit = {}) {
  return new Response(JSON.stringify({
    type: `https://www.der.my.id/problems/${status}`,
    title,
    status,
    detail,
  }), {
    status,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/problem+json; charset=utf-8",
      "Cache-Control": "no-store",
      ...headers,
    },
  });
}

export function methodNotAllowed(allow: string) {
  return problem(405, "Method Not Allowed", "The HTTP method is not supported for this resource.", { Allow: allow });
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function jsonBody(request: Request) {
  return request.json().catch(() => null) as Promise<unknown>;
}

export function keyView(key: ApiKeyRecord) {
  return {
    id: key.id,
    name: key.name,
    prefix: key.prefix,
    createdAt: key.createdAt.toISOString(),
    expiresAt: key.expiresAt?.toISOString() ?? null,
    lastUsedAt: key.lastUsedAt?.toISOString() ?? null,
    revokedAt: key.revokedAt?.toISOString() ?? null,
  };
}

export async function hashToken(token: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(token));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

export function createToken() {
  const bytes = crypto.getRandomValues(new Uint8Array(32));
  const secret = Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
  return `der_live_${secret}`;
}

export async function authenticateSession(request: Request, env: RuntimeEnv) {
  if (!env.D1_DATABASE) return null;
  const result = await createAuth(env).api.getSession({ headers: request.headers });
  return result?.user ? result : null;
}

export async function authenticateBearer(request: Request, db: ApiDatabase) {
  const authorization = request.headers.get("Authorization");
  const match = authorization?.match(/^Bearer (der_live_[a-f0-9]{64})$/);
  if (!match) return null;

  const [key] = await db
    .select()
    .from(schema.apiKey)
    .where(eq(schema.apiKey.keyHash, await hashToken(match[1])))
    .limit(1);
  if (!key || key.revokedAt || (key.expiresAt && key.expiresAt.getTime() <= Date.now())) {
    return null;
  }

  await db.update(schema.apiKey)
    .set({ lastUsedAt: new Date() })
    .where(eq(schema.apiKey.id, key.id));
  const [user] = await db
    .select({ id: schema.user.id, name: schema.user.name, email: schema.user.email })
    .from(schema.user)
    .where(eq(schema.user.id, key.userId))
    .limit(1);
  return user ? { key, user } : null;
}

export async function authenticateApiUser(request: Request, env: RuntimeEnv, db: ApiDatabase) {
  if (request.headers.has("Authorization")) {
    const identity = await authenticateBearer(request, db);
    return identity ? { user: identity.user } : null;
  }

  const session = await authenticateSession(request, env);
  return session?.user
    ? {
        user: {
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
        },
      }
    : null;
}

export function unauthorizedApiUser() {
  return problem(401, "Unauthorized", "A valid Bearer API key or Better Auth session is required.", {
    "WWW-Authenticate": 'Bearer realm="DERforyou API"',
  });
}

export function unauthorizedBearer() {
  return problem(401, "Unauthorized", "A valid Bearer API key is required.", {
    "WWW-Authenticate": 'Bearer realm="DERforyou API", error="invalid_token"',
  });
}

export function unauthorizedSession() {
  return problem(401, "Unauthorized", "A valid Better Auth session is required.", {
    "WWW-Authenticate": 'Session realm="DERforyou"',
  });
}