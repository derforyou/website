import type { RuntimeEnv } from "../../../../server/lib/env";
import { authenticateBearer, createApiDatabase, jsonResponse, problem, unauthorizedBearer } from "../../../../server/services/api-auth";
import type { Route } from "./+types/me";

export async function loader({ request, context }: Route.LoaderArgs) {
  const env = context.cloudflare.env as RuntimeEnv;
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  const identity = await authenticateBearer(request, db);
  if (!identity) return unauthorizedBearer();
  return jsonResponse({ data: identity.user });
}