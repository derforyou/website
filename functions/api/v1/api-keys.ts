import { eq } from "drizzle-orm";
import * as schema from "../../../server/database/schema";
import type { RuntimeEnv } from "../../../server/lib/env";
import { authenticateSession, createApiDatabase, createToken, hashToken, isRecord, jsonBody, jsonResponse, keyView, methodNotAllowed, problem, unauthorizedSession } from "../../../server/services/api-auth";

export async function onRequest({ request, env }: { request: Request; env: RuntimeEnv }) {
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  if (request.method === "GET") {
    const session = await authenticateSession(request, env);
    if (!session) return unauthorizedSession();

    const keys = await db.select().from(schema.apiKey).where(eq(schema.apiKey.userId, session.user.id));
    return jsonResponse({ data: keys.map(keyView) });
  }

  if (request.method !== "POST") return methodNotAllowed("GET, POST");

  const session = await authenticateSession(request, env);
  if (!session) return unauthorizedSession();

  const body = await jsonBody(request);
  const name = isRecord(body) && typeof body.name === "string" ? body.name.trim() : "";
  if (!name || name.length > 100) {
    return problem(400, "Bad Request", "name is required and must be at most 100 characters.");
  }

  let expiresAt: Date | null = null;
  if (isRecord(body) && body.expiresAt !== undefined && body.expiresAt !== null) {
    if (typeof body.expiresAt !== "string" || !Number.isFinite(Date.parse(body.expiresAt))) {
      return problem(400, "Bad Request", "expiresAt must be a valid ISO 8601 date-time or null.");
    }
    expiresAt = new Date(body.expiresAt);
    if (expiresAt.getTime() <= Date.now()) {
      return problem(400, "Bad Request", "expiresAt must be in the future.");
    }
  }

  const token = createToken();
  const now = new Date();
  const [key] = await db.insert(schema.apiKey).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    name,
    prefix: token.slice(0, 17),
    keyHash: await hashToken(token),
    createdAt: now,
    lastUsedAt: null,
    expiresAt,
    revokedAt: null,
  }).returning();

  if (!key) return problem(500, "Internal Server Error", "The API key could not be created.");

  return jsonResponse({ data: { ...keyView(key), token } }, 201);
}
