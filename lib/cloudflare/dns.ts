import { createCloudflareClient } from "@/lib/cloudflare/client";
import { runtimeEnv } from "@/lib/cloudflare/env";
import { AppError } from "@/lib/errors";
import {
  normalizeManagedDomainName,
  normalizeNameserver,
} from "@/lib/validation/nameservers";

type ManagedNameserverRecord = {
  id: string;
  content: string;
};

export async function syncNameserverDelegation(
  domainNameInput: string,
  managedNameserversInput: string[],
  desiredNameserversInput: string[],
) {
  const domainName = normalizeManagedDomainName(domainNameInput);
  const managedNameservers = new Set(managedNameserversInput.map(normalizeNameserver));
  const desiredNameservers = [...new Set(desiredNameserversInput.map(normalizeNameserver))];

  if (desiredNameservers.length === 1) {
    throw new AppError(400, "invalid_nameservers", "Custom DNS requires at least two nameservers.");
  }

  const apiToken = runtimeEnv.CLOUDFLARE_API_TOKEN;
  const zoneId = runtimeEnv.CLOUDFLARE_ZONE_ID;
  if (!apiToken || !zoneId) {
    throw new AppError(503, "cloudflare_not_configured", "Cloudflare DNS is not configured.");
  }

  const client = createCloudflareClient(apiToken);

  try {
    const zone = await client.zones.get({ zone_id: zoneId });
    if (zone.name.toLowerCase() !== "der.my.id") {
      throw new AppError(503, "cloudflare_zone_mismatch", "The configured Cloudflare zone is invalid.");
    }

    const records: ManagedNameserverRecord[] = [];
    for await (const record of client.dns.records.list({
      zone_id: zone.id,
      type: "NS",
      name: { exact: domainName },
      per_page: 100,
    })) {
      if (
        record.type === "NS" &&
        record.name.toLowerCase() === domainName &&
        typeof record.content === "string"
      ) {
        records.push({
          id: record.id,
          content: normalizeNameserver(record.content),
        });
      }
    }

    const desired = new Set(desiredNameservers);
    const current = new Set(records.map((record) => record.content));
    const recordsToDelete = records.filter(
      (record) => managedNameservers.has(record.content) && !desired.has(record.content),
    );
    const recordsCreated: ManagedNameserverRecord[] = [];
    const recordsDeleted: ManagedNameserverRecord[] = [];

    try {
      for (const nameserver of desiredNameservers) {
        if (current.has(nameserver)) {
          continue;
        }

        const record = await client.dns.records.create({
          zone_id: zone.id,
          type: "NS",
          name: domainName,
          content: nameserver,
          ttl: 1,
        });
        recordsCreated.push({ id: record.id, content: nameserver });
      }

      for (const record of recordsToDelete) {
        await client.dns.records.delete(record.id, { zone_id: zone.id });
        recordsDeleted.push(record);
      }
    } catch {
      let rollbackFailed = false;

      for (const record of recordsDeleted) {
        try {
          await client.dns.records.create({
            zone_id: zone.id,
            type: "NS",
            name: domainName,
            content: record.content,
            ttl: 1,
          });
        } catch {
          rollbackFailed = true;
        }
      }

      for (const record of recordsCreated) {
        try {
          await client.dns.records.delete(record.id, { zone_id: zone.id });
        } catch {
          rollbackFailed = true;
        }
      }

      if (rollbackFailed) {
        throw new AppError(503, "cloudflare_dns_rollback_failed", "Cloudflare DNS could not be restored.");
      }

      throw new AppError(502, "cloudflare_dns_sync_failed", "Cloudflare DNS could not be synchronized.");
    }
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(502, "cloudflare_dns_unavailable", "Cloudflare DNS is temporarily unavailable.");
  }
}