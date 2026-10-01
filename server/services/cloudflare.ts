import Cloudflare from "cloudflare";

export type CloudflareRuntime = {
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_ZONE_ID?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
};

export type CloudflareDnsRecordType =
  | "A"
  | "AAAA"
  | "CAA"
  | "CERT"
  | "CNAME"
  | "DNSKEY"
  | "DS"
  | "HTTPS"
  | "LOC"
  | "MX"
  | "NAPTR"
  | "NS"
  | "OPENPGPKEY"
  | "PTR"
  | "SMIMEA"
  | "SRV"
  | "SSHFP"
  | "SVCB"
  | "TLSA"
  | "TXT"
  | "URI";

export function getCloudflareClient(env: CloudflareRuntime) {
  if (!env.CLOUDFLARE_API_TOKEN) {
    throw new Error("Cloudflare API token is not configured.");
  }

  return new Cloudflare({ apiToken: env.CLOUDFLARE_API_TOKEN });
}

async function getZoneId(client: Cloudflare, env: CloudflareRuntime, zoneName: string) {
  const zone = await client.zones.list({ name: zoneName });
  const zoneId = zone.result[0]?.id ?? (zoneName === "der.my.id" ? env.CLOUDFLARE_ZONE_ID : undefined);
  if (!zoneId) throw new Error(`Cloudflare zone ${zoneName} could not be found.`);
  return zoneId;
}

export async function listZoneDnsRecords(env: CloudflareRuntime, zoneName: string) {
  const client = getCloudflareClient(env);
  const zoneId = await getZoneId(client, env, zoneName);
  const response = await client.dns.records.list({ zone_id: zoneId, per_page: 5000 });
  return Array.isArray(response) ? response : response.result;
}

export async function createManagedDnsRecord(
  env: CloudflareRuntime,
  zoneName: string,
  record: Record<string, unknown>,
) {
  const client = getCloudflareClient(env);
  const zoneId = await getZoneId(client, env, zoneName);
  return client.dns.records.create({ zone_id: zoneId, ...record } as never);
}

export async function updateManagedDnsRecord(
  env: CloudflareRuntime,
  zoneName: string,
  recordId: string,
  record: Record<string, unknown>,
) {
  const client = getCloudflareClient(env);
  const zoneId = await getZoneId(client, env, zoneName);
  return client.dns.records.update(recordId, { zone_id: zoneId, ...record } as never);
}

export async function deleteManagedDnsRecord(
  env: CloudflareRuntime,
  zoneName: string,
  recordId: string,
) {
  const client = getCloudflareClient(env);
  const zoneId = await getZoneId(client, env, zoneName);
  return client.dns.records.delete(recordId, { zone_id: zoneId });
}

export async function listDnsRecords(env: CloudflareRuntime, zoneName: string) {
  try {
    return await listZoneDnsRecords(env, zoneName) as Array<{ name?: string | null }>;
  } catch {
    return [] as Array<{ name?: string | null }>;
  }
}

export async function createDnsRecord(
  env: CloudflareRuntime,
  {
    zoneName,
    name,
    type,
    content,
    ttl = 1,
    proxied = false,
  }: {
    zoneName: string;
    name: string;
    type: CloudflareDnsRecordType;
    content: string;
    ttl?: number;
    proxied?: boolean;
  },
) {
  return createManagedDnsRecord(env, zoneName, { type, name, content, ttl, proxied });
}