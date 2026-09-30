import Cloudflare from "cloudflare";

export type CloudflareRuntime = {
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_ZONE_ID?: string;
};

export type CloudflareDnsRecordType =
  | "A"
  | "AAAA"
  | "CAA"
  | "CNAME"
  | "DNSKEY"
  | "HTTPS"
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
  const apiToken = env.CLOUDFLARE_API_TOKEN;
  if (!apiToken) {
    return null;
  }

  return new Cloudflare({ apiToken });
}

export async function listDnsRecords(env: CloudflareRuntime, zoneName: string) {
  const client = getCloudflareClient(env);
  if (!client) {
    return [];
  }

  const zone = await client.zones.list({ name: zoneName });
  const zoneId = zone.result[0]?.id ?? env.CLOUDFLARE_ZONE_ID;
  if (!zoneId) {
    return [];
  }

  return client.dns.records.list({ zone_id: zoneId });
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
  const client = getCloudflareClient(env);
  if (!client) {
    return null;
  }

  const zone = await client.zones.list({ name: zoneName });
  const zoneId = zone.result[0]?.id ?? env.CLOUDFLARE_ZONE_ID;
  if (!zoneId) {
    return null;
  }

  return client.dns.records.create({
    zone_id: zoneId,
    type,
    name,
    content,
    ttl,
    proxied,
  });
}
