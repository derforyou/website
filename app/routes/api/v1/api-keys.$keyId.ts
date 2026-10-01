import { and, eq, isNull } from "drizzle-orm";
import * as schema from "../../../../server/database/schema";
import type { RuntimeEnv } from "../../../../server/lib/env";
import { authenticateSession, createApiDatabase, jsonResponse, methodNotAllowed, problem, unauthorizedSession } from "../../../../server/services/api-auth";
import type { Route } from "./+types/api-keys.$keyId";

export async function action({ request, context, params }: Route.ActionArgs) {
  if (request.method !== "DELETE") return methodNotAllowed("DELETE");
  const env = context.cloudflare.env as RuntimeEnv;
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  const session = await authenticateSession(request, env);
  if (!session) return unauthorizedSession();
  const keyId = params.keyId;
  if (!keyId) return problem(400, "Bad Request", "keyId is required.");

  const [revoked] = await db.update(schema.apiKey)
    .set({ revokedAt: new Date() })
    .where(and(
      eq(schema.apiKey.id, keyId),
      eq(schema.apiKey.userId, session.user.id),
      isNull(schema.apiKey.revokedAt),
    ))
    .returning({ id: schema.apiKey.id });
  if (!revoked) return problem(404, "Not Found", "The API key was not found or was already revoked.");
  return jsonResponse({ data: { id: revoked.id, revoked: true } });
}