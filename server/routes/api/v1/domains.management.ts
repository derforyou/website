import { and, eq } from "drizzle-orm";
import * as schema from "../../../../server/database/schema";
import type { ApiRouteArgs } from "../../../../server/lib/api-route";
import { ZONE_NAME } from "../../../../server/lib/domain-policy";
import type { RuntimeEnv } from "../../../../server/lib/env";
import {
    authenticateSession,
    createApiDatabase,
    jsonResponse,
    methodNotAllowed,
    problem,
    unauthorizedSession,
} from "../../../../server/services/api-auth";
import {
    createManagedDnsRecord,
    deleteManagedDnsRecord,
    listZoneDnsRecords,
    updateManagedDnsRecord,
    type CloudflareDnsRecordType,
} from "../../../../server/services/cloudflare";

type CloudflareRecord = {
  id: string;
  type: CloudflareDnsRecordType;
  name: string;
  content?: string;
  ttl: number;
  proxied?: boolean;
  priority?: number;
  data?: Record<string, unknown>;
  comment?: string | null;
  tags?: string[];
  settings?: Record<string, unknown>;
};

const recordTypes = new Set<CloudflareDnsRecordType>([
  "A", "AAAA", "CAA", "CERT", "CNAME", "DNSKEY", "DS", "HTTPS", "LOC",
  "MX", "NAPTR", "NS", "OPENPGPKEY", "PTR", "SMIMEA", "SRV", "SSHFP",
  "SVCB", "TLSA", "TXT", "URI",
]);
const proxyableTypes = new Set<CloudflareDnsRecordType>(["A", "AAAA", "CNAME"]);

function parseNameservers(value: unknown): string[] | null {
  let entries: unknown[];
  if (Array.isArray(value)) {
    entries = value;
  } else if (typeof value === "string") {
    try {
      const parsed: unknown = JSON.parse(value);
      entries = Array.isArray(parsed) ? parsed : value.split(",");
    } catch {
      entries = value.split(",");
    }
  } else {
    return null;
  }

  if (entries.some((entry) => typeof entry !== "string")) return null;
  const nameservers = (entries as string[]).map((entry) => entry.trim().toLowerCase().replace(/\.$/, ""));
  const validName = /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/;
  if (nameservers.length < 2 || nameservers.length > 5 || nameservers.some((name) => !validName.test(name))) return null;
  if (new Set(nameservers).size !== nameservers.length) return null;
  return nameservers;
}

function nameserverList(value: string | null) {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((entry): entry is string => typeof entry === "string");
  } catch {
    // Existing records used comma-separated nameservers.
  }
  return value.split(",").map((entry) => entry.trim()).filter(Boolean);
}

function normalizedRecordName(value: unknown, hostname: string) {
  if (typeof value !== "string") return null;
  const cleaned = value.trim().toLowerCase().replace(/\.$/, "");
  const fullName = !cleaned || cleaned === "@" ? hostname : cleaned.includes(".") ? cleaned : `${cleaned}.${hostname}`;
  const labels = fullName.split(".");
  if (labels.some((label) => !/^[a-z0-9_*](?:[a-z0-9_-]*[a-z0-9_*])?$/.test(label) || label.length > 63)) return null;
  if (fullName.length > 253 || (fullName !== hostname && !fullName.endsWith(`.${hostname}`))) return null;
  return fullName;
}

function recordView(record: CloudflareRecord) {
  return {
    id: record.id,
    type: record.type,
    name: record.name,
    content: record.content ?? "",
    ttl: record.ttl,
    proxied: record.proxied ?? false,
    priority: record.priority ?? null,
    data: record.data ?? null,
    comment: record.comment ?? null,
    tags: record.tags ?? [],
    settings: record.settings ?? {},
  };
}

function recordPayload(value: unknown, hostname: string, current?: CloudflareRecord) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const input = value as Record<string, unknown>;
  const typeValue = input.type ?? current?.type;
  if (typeof typeValue !== "string" || !recordTypes.has(typeValue as CloudflareDnsRecordType)) return null;
  const type = typeValue as CloudflareDnsRecordType;
  const name = normalizedRecordName(input.name ?? current?.name, hostname);
  const contentValue = input.content ?? current?.content;
  const content = typeof contentValue === "string" ? contentValue.trim() : "";
  const dataValue = input.data ?? current?.data;
  const data = dataValue && typeof dataValue === "object" && !Array.isArray(dataValue)
    ? dataValue as Record<string, unknown>
    : undefined;
  const ttlValue = input.ttl ?? current?.ttl ?? 1;
  if (!name || (!content && !data) || typeof ttlValue !== "number" || !Number.isInteger(ttlValue) || ttlValue < 1 || ttlValue > 86400) return null;

  const proxied = input.proxied === undefined ? current?.proxied ?? false : input.proxied === true;
  if (proxied && (name !== hostname || !proxyableTypes.has(type))) return null;
  if (type === "NS" && name === hostname) return null;

  const payload: Record<string, unknown> = { type, name, content, ttl: ttlValue, proxied };
  if (data) payload.data = data;
  for (const key of ["priority", "comment", "tags", "settings"]) {
    const field = input[key] ?? current?.[key as keyof CloudflareRecord];
    if (field !== undefined) payload[key] = field;
  }
  if (payload.priority !== undefined && (typeof payload.priority !== "number" || !Number.isInteger(payload.priority))) return null;
  if (payload.comment !== undefined && payload.comment !== null && typeof payload.comment !== "string") return null;
  if (payload.tags !== undefined && (!Array.isArray(payload.tags) || payload.tags.some((tag) => typeof tag !== "string"))) return null;
  if (payload.settings !== undefined && (!payload.settings || typeof payload.settings !== "object" || Array.isArray(payload.settings))) return null;
  return payload;
}

async function ownedDomain(request: Request, context: ApiRouteArgs["context"], domainId: string) {
  const env = context.cloudflare.env as RuntimeEnv;
  const db = createApiDatabase(env);
  if (!db) return { response: problem(503, "Service Unavailable", "The database is not configured.") } as const;
  const session = await authenticateSession(request, env);
  if (!session) return { response: unauthorizedSession() } as const;
  const [domain] = await db.select().from(schema.domain)
    .where(and(eq(schema.domain.id, domainId), eq(schema.domain.ownerId, session.user.id)))
    .limit(1);
  if (!domain) return { response: problem(404, "Not Found", "The domain could not be found.") } as const;
  return { env, db, domain } as const;
}

function managedRecordRows(records: CloudflareRecord[], hostname: string) {
  return records.filter((record) => record.name === hostname || record.name.endsWith(`.${hostname}`));
}

export async function loader({ request, context, params }: ApiRouteArgs): Promise<Response> {
  if (request.method !== "GET") return methodNotAllowed("GET");
  const domainId = params.domainId;
  if (!domainId) return problem(400, "Bad Request", "A domain id is required.");
  const owned = await ownedDomain(request, context, domainId);
  if ("response" in owned && owned.response) return owned.response;

  if (params.recordId) {
    if (owned.domain.dnsMode !== "managed") return problem(409, "Conflict", "Managed DNS is disabled while custom nameservers are active.");
    try {
      const records = await listZoneDnsRecords(owned.env, ZONE_NAME) as unknown as CloudflareRecord[];
      const record = managedRecordRows(records, owned.domain.hostname).find((entry) => entry.id === params.recordId);
      return record ? jsonResponse({ data: recordView(record) }) : problem(404, "Not Found", "The DNS record could not be found.");
    } catch (error) {
      return problem(502, "Bad Gateway", error instanceof Error ? error.message : "Unable to load DNS records from Cloudflare.");
    }
  }

  if (request.url.includes("/dns-records")) {
    if (owned.domain.dnsMode !== "managed") return jsonResponse({ data: { records: [], disabled: true } });
    try {
      const records = await listZoneDnsRecords(owned.env, ZONE_NAME) as unknown as CloudflareRecord[];
      return jsonResponse({ data: { records: managedRecordRows(records, owned.domain.hostname).map(recordView) } });
    } catch (error) {
      return problem(502, "Bad Gateway", error instanceof Error ? error.message : "Unable to load DNS records from Cloudflare.");
    }
  }

  return jsonResponse({
    data: {
      domain: { ...owned.domain, customNameservers: nameserverList(owned.domain.customNameservers) },
    },
  });
}

export async function action({ request, context, params }: ApiRouteArgs): Promise<Response> {
  const domainId = params.domainId;
  if (!domainId) return problem(400, "Bad Request", "A domain id is required.");
  const owned = await ownedDomain(request, context, domainId);
  if ("response" in owned && owned.response) return owned.response;

  const { env, db, domain } = owned;
  if (domain.status !== "active") return problem(409, "Conflict", "Suspended domains cannot be changed.");
  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) return problem(400, "Bad Request", "A JSON payload is required.");
  const body = payload as Record<string, unknown>;

  if (request.url.includes("/dns-records")) {
    if (domain.dnsMode !== "managed") return problem(409, "Conflict", "Managed DNS is disabled while custom nameservers are active.");
    if (request.method !== "POST" && request.method !== "PUT" && request.method !== "DELETE") return methodNotAllowed("GET, POST, PUT, DELETE");

    try {
      const allRecords = await listZoneDnsRecords(env, ZONE_NAME) as unknown as CloudflareRecord[];
      const ownedRecords = managedRecordRows(allRecords, domain.hostname);
      const recordId = params.recordId;
      if (request.method === "DELETE") {
        if (!recordId) return problem(400, "Bad Request", "A DNS record id is required.");
        const current = ownedRecords.find((record) => record.id === recordId);
        if (!current) return problem(404, "Not Found", "The DNS record could not be found.");
        await deleteManagedDnsRecord(env, ZONE_NAME, recordId);
        await db.delete(schema.dnsRecord).where(eq(schema.dnsRecord.cloudflareRecordId, recordId));
        return jsonResponse({ data: { id: recordId, deleted: true } });
      }

      const current = recordId ? ownedRecords.find((record) => record.id === recordId) : undefined;
      if (recordId && !current) return problem(404, "Not Found", "The DNS record could not be found.");
      if (request.method === "PUT" && !recordId) return problem(400, "Bad Request", "A DNS record id is required.");
      const record = recordPayload(body, domain.hostname, current);
      if (!record) return problem(400, "Bad Request", "Check the record type, hostname, content/data, TTL, priority, and proxy settings.");
      const saved = (request.method === "POST"
        ? await createManagedDnsRecord(env, ZONE_NAME, record)
        : await updateManagedDnsRecord(env, ZONE_NAME, recordId!, record)) as unknown as CloudflareRecord;
      const now = new Date();
      const [existing] = await db.select({ id: schema.dnsRecord.id })
        .from(schema.dnsRecord)
        .where(eq(schema.dnsRecord.cloudflareRecordId, saved.id))
        .limit(1);
      const values = {
        domainId: domain.id,
        cloudflareRecordId: saved.id,
        type: saved.type,
        name: saved.name,
        content: saved.content ?? JSON.stringify(saved.data ?? {}),
        ttl: saved.ttl,
        proxied: saved.proxied ?? false,
        updatedAt: now,
      };
      if (existing) {
        await db.update(schema.dnsRecord).set(values).where(eq(schema.dnsRecord.id, existing.id));
      } else {
        await db.insert(schema.dnsRecord).values({ id: crypto.randomUUID(), ...values, createdAt: now });
      }
      return jsonResponse({ data: recordView(saved) }, request.method === "POST" ? 201 : 200);
    } catch (error) {
      return problem(502, "Bad Gateway", error instanceof Error ? error.message : "The DNS record operation failed.");
    }
  }

  if (request.method !== "PATCH") return methodNotAllowed("GET, PATCH");
  const dnsMode = body.dnsMode;
  if (dnsMode !== "managed" && dnsMode !== "custom") return problem(400, "Bad Request", "Choose a valid DNS mode.");
  const nameservers = dnsMode === "custom" ? parseNameservers(body.customNameservers) : [];
  if (dnsMode === "custom" && !nameservers) return problem(400, "Bad Request", "Custom nameservers require 2 to 5 unique, valid hostnames.");

  try {
    const records = await listZoneDnsRecords(env, ZONE_NAME) as unknown as CloudflareRecord[];
    const existingNsRecords = records.filter((record) => record.type === "NS" && record.name === domain.hostname);
    if (dnsMode === "custom") {
      const requestedNameservers = nameservers ?? [];
      const existingValues = new Set(existingNsRecords.map((record) => record.content?.toLowerCase().replace(/\.$/, "")));
      const added: string[] = [];
      for (const nameserver of requestedNameservers) {
        if (existingValues.has(nameserver)) continue;
        try {
          const created = await createManagedDnsRecord(env, ZONE_NAME, {
            type: "NS",
            name: domain.hostname,
            content: nameserver,
            ttl: 1,
            proxied: false,
          }) as unknown as CloudflareRecord;
          added.push(created.id);
        } catch (error) {
          await Promise.allSettled(added.map((id) => deleteManagedDnsRecord(env, ZONE_NAME, id)));
          throw error;
        }
      }
      const requestedSet = new Set(requestedNameservers);
      const obsolete = existingNsRecords.filter((record) => !requestedSet.has((record.content ?? "").toLowerCase().replace(/\.$/, "")));
      for (const record of obsolete) await deleteManagedDnsRecord(env, ZONE_NAME, record.id);
      await db.update(schema.domain).set({
        dnsMode: "custom",
        customNameservers: JSON.stringify(requestedNameservers),
        dnsSyncStatus: "synced",
        updatedAt: new Date(),
      }).where(eq(schema.domain.id, domain.id));
      return jsonResponse({ data: { dnsMode, customNameservers: requestedNameservers } });
    }

    for (const record of existingNsRecords) await deleteManagedDnsRecord(env, ZONE_NAME, record.id);
    await db.delete(schema.dnsRecord).where(and(eq(schema.dnsRecord.domainId, domain.id), eq(schema.dnsRecord.type, "NS")));
    await db.update(schema.domain).set({
      dnsMode: "managed",
      customNameservers: null,
      dnsSyncStatus: "synced",
      updatedAt: new Date(),
    }).where(eq(schema.domain.id, domain.id));
    return jsonResponse({ data: { dnsMode, customNameservers: [] } });
  } catch (error) {
    await db.update(schema.domain).set({ dnsSyncStatus: "failed", updatedAt: new Date() }).where(eq(schema.domain.id, domain.id));
    return problem(502, "Bad Gateway", error instanceof Error ? error.message : "Unable to update nameservers in Cloudflare.");
  }
}
