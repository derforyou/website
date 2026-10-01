import { and, eq } from "drizzle-orm";
import * as schema from "../../../server/database/schema";
import { getReservedNames, normalizeSubdomain, validateSubdomainRequest, ZONE_NAME } from "../../../server/lib/domain-policy";
import type { RuntimeEnv } from "../../../server/lib/env";
import { createApiDatabase, jsonResponse, methodNotAllowed, problem } from "../../../server/services/api-auth";

export async function onRequest({ request, env }: { request: Request; env: RuntimeEnv }) {
  if (request.method !== "GET") return methodNotAllowed("GET");

  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  const url = new URL(request.url);
  const requestedZone = url.searchParams.get("zone") ?? ZONE_NAME;
  const subdomain = normalizeSubdomain(url.searchParams.get("subdomain") ?? "");

  if (requestedZone !== ZONE_NAME) {
    return problem(400, "Bad Request", `Only the ${ZONE_NAME} zone is supported.`);
  }

  const reserved = await getReservedNames(env);
  const validation = validateSubdomainRequest(subdomain, reserved);
  if (!validation.valid) {
    return problem(400, "Bad Request", validation.reason);
  }

  const [existingDomain] = await db.select({ id: schema.domain.id })
    .from(schema.domain)
    .where(eq(schema.domain.hostname, validation.hostname))
    .limit(1);

  const [existingRegistration] = await db.select({ id: schema.domainRegistration.id })
    .from(schema.domainRegistration)
    .where(and(eq(schema.domainRegistration.hostname, validation.hostname), eq(schema.domainRegistration.status, "pending")))
    .limit(1);

  const available = !existingDomain && !existingRegistration;
  return jsonResponse({
    data: {
      available,
      subdomain: validation.normalized,
      hostname: validation.hostname,
      status: available ? "available" : "unavailable",
      reason: available ? "" : "This name is already reserved, in use, or pending review.",
    },
  });
}
