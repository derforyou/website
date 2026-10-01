import { and, eq } from "drizzle-orm";
import * as schema from "../../../../server/database/schema";
import type { ApiRouteArgs } from "../../../../server/lib/api-route";
import { getReservedNames, normalizeSubdomain, validateSubdomainRequest } from "../../../../server/lib/domain-policy";
import type { RuntimeEnv } from "../../../../server/lib/env";
import { authenticateApiUser, createApiDatabase, jsonResponse, methodNotAllowed, problem, unauthorizedApiUser } from "../../../../server/services/api-auth";

function parseNameservers(value: unknown): string[] | null {
  if (value == null || value === "") return [];
  const entries = Array.isArray(value)
    ? value
    : typeof value === "string"
      ? value.split(",")
      : null;
  if (!entries || entries.some((entry) => typeof entry !== "string")) return null;

  const nameservers = (entries as string[]).map((entry) => entry.trim().toLowerCase());
  if (nameservers.some((entry) => !entry || entry.includes(",") || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(entry))) return null;
  if (new Set(nameservers).size !== nameservers.length) return null;
  return nameservers;
}

export async function loader({ request, context }: ApiRouteArgs) {
  if (request.method !== "GET") return methodNotAllowed("GET");
  const env = context.cloudflare.env as RuntimeEnv;
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  const identity = await authenticateApiUser(request, env, db);
  if (!identity) return unauthorizedApiUser();

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
      .where(eq(schema.domain.ownerId, identity.user.id))
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
      .where(eq(schema.domainRegistration.userId, identity.user.id))
      .orderBy(schema.domainRegistration.createdAt),
  ]);

  return jsonResponse({ data: { domains, registrations } });
}

export async function action({ request, context }: ApiRouteArgs) {
  if (request.method !== "POST") return methodNotAllowed("POST");

  const env = context.cloudflare.env as RuntimeEnv;
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  const identity = await authenticateApiUser(request, env, db);
  if (!identity) return unauthorizedApiUser();

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return problem(400, "Bad Request", "A JSON payload is required.");
  }

  const rawSubdomain = typeof (payload as Record<string, unknown>).subdomain === "string"
    ? (payload as Record<string, unknown>).subdomain as string
    : "";
  const subdomain = normalizeSubdomain(rawSubdomain);
  const dnsMode = (payload as Record<string, unknown>).dnsMode === "custom" ? "custom" : "managed";
  const notes = typeof (payload as Record<string, unknown>).notes === "string" ? (payload as Record<string, unknown>).notes as string : "";
  const rawNameservers = (payload as Record<string, unknown>).customNameservers;
  const nameservers = parseNameservers(rawNameservers);

  if (!nameservers) {
    return problem(400, "Bad Request", "Nameservers must be unique valid hostnames.");
  }
  if (dnsMode === "custom" && (nameservers.length < 2 || nameservers.length > 5)) {
    return problem(400, "Bad Request", "Custom nameservers require between 2 and 5 valid hostnames.");
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

  const id = crypto.randomUUID();
  const createdAt = new Date();
  const [created] = await db.insert(schema.domainRegistration)
    .values({
      id,
      userId: identity.user.id,
      subdomain: validation.normalized,
      hostname: validation.hostname,
      status: "pending",
      dnsMode,
      customNameservers: nameservers.length ? JSON.stringify(nameservers) : null,
      notes: notes.trim() || null,
      createdAt,
      updatedAt: createdAt,
    })
    .returning();

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