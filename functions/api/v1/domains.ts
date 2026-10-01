import { and, eq } from "drizzle-orm";
import * as schema from "../../../server/database/schema";
import { getReservedNames, normalizeSubdomain, validateSubdomainRequest } from "../../../server/lib/domain-policy";
import type { RuntimeEnv } from "../../../server/lib/env";
import { authenticateSession, createApiDatabase, jsonResponse, methodNotAllowed, problem, unauthorizedSession } from "../../../server/services/api-auth";

function parseNameservers(value: string | null | undefined) {
  if (!value) return [];

  return value
    .split(",")
    .map((entry) => entry.trim().toLowerCase())
    .filter(Boolean)
    .filter((entry, index, entries) => entries.indexOf(entry) === index)
    .filter((entry) => /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(entry));
}

export async function onRequest({ request, env }: { request: Request; env: RuntimeEnv }) {
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  if (request.method === "GET") {
    const session = await authenticateSession(request, env);
    if (!session) return unauthorizedSession();

    const [domains, registrations] = await Promise.all([
      db.select({
        id: schema.domain.id,
        hostname: schema.domain.hostname,
        status: schema.domain.status,
        dnsMode: schema.domain.dnsMode,
        customNameservers: schema.domain.customNameservers,
        dnsSyncStatus: schema.domain.dnsSyncStatus,
        createdAt: schema.domain.createdAt,
      }).from(schema.domain)
        .where(eq(schema.domain.ownerId, session.user.id))
        .orderBy(schema.domain.createdAt),
      db.select({
        id: schema.domainRegistration.id,
        hostname: schema.domainRegistration.hostname,
        status: schema.domainRegistration.status,
        dnsMode: schema.domainRegistration.dnsMode,
        customNameservers: schema.domainRegistration.customNameservers,
        notes: schema.domainRegistration.notes,
        rejectedReason: schema.domainRegistration.rejectedReason,
        decisionAt: schema.domainRegistration.decisionAt,
        createdAt: schema.domainRegistration.createdAt,
      }).from(schema.domainRegistration)
        .where(eq(schema.domainRegistration.userId, session.user.id))
        .orderBy(schema.domainRegistration.createdAt),
    ]);

    return jsonResponse({ data: { domains, registrations } });
  }

  if (request.method !== "POST") return methodNotAllowed("GET, POST");

  const session = await authenticateSession(request, env);
  if (!session) return unauthorizedSession();

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return problem(400, "Bad Request", "A JSON payload is required.");
  }

  const body = payload as Record<string, unknown>;
  const subdomain = normalizeSubdomain(typeof body.subdomain === "string" ? body.subdomain : "");
  const dnsMode = body.dnsMode === "custom" ? "custom" : "managed";
  const notes = typeof body.notes === "string" ? body.notes : "";
  const nameservers = parseNameservers(typeof body.customNameservers === "string" ? body.customNameservers : "");

  if (dnsMode === "custom" && (nameservers.length < 2 || nameservers.length > 4)) {
    return problem(400, "Bad Request", "Custom nameservers require between 2 and 4 valid hostnames.");
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

  if (existingDomain || existingRegistration) {
    return problem(409, "Conflict", "That hostname is already registered or pending review.");
  }

  const createdAt = new Date();
  const [created] = await db.insert(schema.domainRegistration).values({
    id: crypto.randomUUID(),
    userId: session.user.id,
    subdomain: validation.normalized,
    hostname: validation.hostname,
    status: "pending",
    dnsMode,
    customNameservers: nameservers.length ? nameservers.join(",") : null,
    notes: notes.trim() || null,
    createdAt,
    updatedAt: createdAt,
  }).returning();

  return jsonResponse({
    data: {
      id: created.id,
      subdomain: created.subdomain,
      hostname: created.hostname,
      status: created.status,
      dnsMode: created.dnsMode,
      customNameservers: created.customNameservers,
      notes: created.notes,
      createdAt: created.createdAt.toISOString(),
    },
  });
}
