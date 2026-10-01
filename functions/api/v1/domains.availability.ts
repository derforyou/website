import { eq } from "drizzle-orm";
import * as schema from "../../../server/database/schema";
import type { RuntimeEnv } from "../../../server/lib/env";
import { createApiDatabase, jsonResponse, methodNotAllowed, problem } from "../../../server/services/api-auth";

const zoneName = "der.my.id";

export async function onRequest({ request, env }: { request: Request; env: RuntimeEnv }) {
  if (request.method !== "GET") return methodNotAllowed("GET");

  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  const url = new URL(request.url);
  const subdomain = url.searchParams.get("subdomain")?.trim().toLowerCase() ?? "";
  const requestedZone = url.searchParams.get("zone") ?? zoneName;

  if (!/^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/.test(subdomain)) {
    return problem(400, "Bad Request", "subdomain must be 1 to 63 lowercase letters, numbers, or interior hyphens.");
  }

  if (requestedZone !== zoneName) {
    return problem(400, "Bad Request", `Only the ${zoneName} zone is supported.`);
  }

  const [existing] = await db.select({ id: schema.domain.id })
    .from(schema.domain)
    .where(eq(schema.domain.subdomain, subdomain))
    .limit(1);

  const available = !existing;

  return jsonResponse({
    data: {
      available,
      subdomain,
      hostname: `${subdomain}.${zoneName}`,
      status: available ? "available" : "unavailable",
    },
  });
}
