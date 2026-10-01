import abuse from "../domain-policy/abuse.json";
import brands from "../domain-policy/brands.json";
import existingHostnames from "../domain-policy/existing-hostnames.json";
import security from "../domain-policy/security.json";
import services from "../domain-policy/services.json";
import system from "../domain-policy/system.json";
import type { CloudflareRuntime } from "../services/cloudflare";
import { listDnsRecords } from "../services/cloudflare";

export const ZONE_NAME = "der.my.id";

export type DomainPolicyCategory = {
  names: string[];
};

const policyModules: DomainPolicyCategory[] = [
  abuse,
  brands,
  existingHostnames,
  security,
  services,
  system,
];

function configuredReservedNames() {
  return policyModules
    .flatMap((module) => module.names ?? [])
    .map((value) => normalizeReservedName(value))
    .filter(Boolean);
}

export function normalizeSubdomain(value: string) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/\s+/g, "")
    .replace(/\.$/, "");

  if (!cleaned) return "";

  const zoneSuffix = `.${ZONE_NAME}`;
  const candidate = cleaned.endsWith(zoneSuffix)
    ? cleaned.slice(0, -zoneSuffix.length)
    : cleaned;

  return candidate.replace(/^\.+|\.+$/g, "");
}

export function normalizeReservedName(value: string) {
  return value.trim().toLowerCase().replace(/^\.+|\.+$/g, "").replace(/\.$/, "").replace(/\s+/g, "");
}

export async function getReservedNames(env?: Partial<CloudflareRuntime>) {
  const subdomains = new Set(configuredReservedNames());

  if (!env?.CLOUDFLARE_API_TOKEN && !env?.CLOUDFLARE_ZONE_ID) {
    return { subdomains: [...subdomains].sort() };
  }

  try {
    const records = await listDnsRecords(env as CloudflareRuntime, ZONE_NAME);
    for (const record of records) {
      const recordName = typeof record?.name === "string" ? normalizeReservedName(record.name) : "";
      if (!recordName) continue;
      if (!recordName.endsWith(`.${ZONE_NAME}`)) continue;

      const label = recordName.slice(0, -(`.${ZONE_NAME}`).length);
      if (label && !label.includes(".")) {
        subdomains.add(label);
      }
    }
  } catch {
    // Fall back to the checked-in category files when Cloudflare is unavailable.
  }

  return { subdomains: [...subdomains].sort() };
}

export function validateSubdomainRequest(
  subdomain: string,
  reserved: { subdomains: string[] } = { subdomains: configuredReservedNames() },
) {
  const normalized = normalizeSubdomain(subdomain);
  const hostname = normalized ? `${normalized}.${ZONE_NAME}` : "";

  if (!normalized) {
    return { valid: false, normalized: "", hostname: "", reason: "Enter a subdomain name." };
  }

  if (normalized.length < 1 || normalized.length > 63) {
    return { valid: false, normalized, hostname, reason: "Subdomain names must be between 1 and 63 characters." };
  }

  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(normalized)) {
    return {
      valid: false,
      normalized,
      hostname,
      reason: "Use lowercase letters, numbers, and hyphens. Hyphens may not begin or end the subdomain.",
    };
  }

  const reservedNames = new Set(reserved.subdomains.map(normalizeReservedName));
  if (reservedNames.has(normalized)) {
    return { valid: false, normalized, hostname, reason: `The name ${normalized} is reserved for service use.` };
  }

  return { valid: true, normalized, hostname, reason: "" };
}
