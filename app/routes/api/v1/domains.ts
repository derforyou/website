import { eq } from "drizzle-orm";
import * as schema from "../../../../server/database/schema";
import type { RuntimeEnv } from "../../../../server/lib/env";
import { authenticateBearer, createApiDatabase, jsonResponse, methodNotAllowed, problem, unauthorizedBearer } from "../../../../server/services/api-auth";
import type { Route } from "./+types/domains";

export async function loader({ request, context }: Route.LoaderArgs) {
  if (request.method !== "GET") return methodNotAllowed("GET");
  const env = context.cloudflare.env as RuntimeEnv;
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  const identity = await authenticateBearer(request, db);
  if (!identity) return unauthorizedBearer();
  const domains = await db.select({
    id: schema.domain.id,
    name: schema.domain.hostname,
    status: schema.domain.status,
    dnsSyncStatus: schema.domain.dnsSyncStatus,
    createdAt: schema.domain.createdAt,
  }).from(schema.domain)
    .where(eq(schema.domain.ownerId, identity.user.id))
    .orderBy(schema.domain.createdAt);
  return jsonResponse({ data: domains });
}