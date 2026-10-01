import type { ApiRouteArgs } from "../../../../server/lib/api-route";
import type { RuntimeEnv } from "../../../../server/lib/env";
import { authenticateApiUser, createApiDatabase, jsonResponse, problem, unauthorizedApiUser } from "../../../../server/services/api-auth";

export async function loader({ request, context }: ApiRouteArgs) {
  const env = context.cloudflare.env as RuntimeEnv;
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  const identity = await authenticateApiUser(request, env, db);
  if (!identity) return unauthorizedApiUser();
  return jsonResponse({ data: identity.user });
}