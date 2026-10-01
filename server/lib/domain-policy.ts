import type { CloudflareRuntime } from "../services/cloudflare";
import { listDnsRecords } from "../services/cloudflare";

export const ZONE_NAME = "der.my.id";

export const DEFAULT_RESERVED_SUBDOMAINS = [
  "api",
  "app",
  "auth",
  "cdn",
  "contact",
  "coolify",
  "dashboard",
  "der",
  "developer",
  "dev",
  "docs",
  "files",
  "help",
  "hostmaster",
  "labs",
  "legal",
  "login",
  "mail",
  "moderation",
  "mx",
  "notify",
  "ns",
  "online",
  "pve",
  "privacy",
  "profile",
  "register",
  "sga",
  "send",
  "settings",
  "signin",
  "signup",
  "status",
  "support",
  "terms",
  "verify",
  "www",
  "_acme-challenge",
  "01-dns",
  "brevo1",
  "brevo2",
  "clk2",
  "em56",
  "img",
  "lagarde-cdn",
  "r",
  "rsend",
  "sso",
];

export const DEFAULT_RESERVED_HOSTNAMES = [
  "der.my.id",
  "www.der.my.id",
  "api.der.my.id",
  "auth.der.my.id",
  "dashboard.der.my.id",
  "legal.der.my.id",
  "privacy.der.my.id",
  "terms.der.my.id",
  "signin.der.my.id",
  "signup.der.my.id",
  "verify.der.my.id",
  "settings.der.my.id",
  "account.der.my.id",
  "contact.der.my.id",
  "support.der.my.id",
  "status.der.my.id",
  "mail.der.my.id",
  "admin.der.my.id",
  "moderation.der.my.id",
  "docs.der.my.id",
  "dev.der.my.id",
  "online.der.my.id",
  "labs.der.my.id",
  "notify.der.my.id",
  "send.der.my.id",
  "coolify.der.my.id",
  "sga.der.my.id",
  "pve.der.my.id",
  "lagarde-cdn.der.my.id",
  "em56.notify.der.my.id",
  "img.em56.notify.der.my.id",
  "r.em56.notify.der.my.id",
  "rsend.notify.der.my.id",
  "brevo1._domainkey.labs.der.my.id",
  "brevo2._domainkey.labs.der.my.id",
  "brevo1._domainkey.notify.der.my.id",
  "brevo2._domainkey.notify.der.my.id",
  "clk2._domainkey.next-lms.der.my.id",
  "send.coolify.der.my.id",
  "resend._domainkey.der.my.id",
  "resend._domainkey.notify.der.my.id",
  "01-dns.der.my.id",
  "_acme-challenge.der.my.id",
];

export function normalizeSubdomain(value: string) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .replace(/^\.+|\.+$/g, "")
    .replace(/\s+/g, "");

  if (!cleaned) return "";

  const zoneSuffix = `.${ZONE_NAME}`;
  const candidate = cleaned.endsWith(zoneSuffix)
    ? cleaned.slice(0, -zoneSuffix.length)
    : cleaned;

  if (candidate === ZONE_NAME) return "";
  return candidate.replace(/\.$/, "").replace(/^\.+|\.+$/g, "");
}

export function normalizeHostname(value: string) {
  return value.trim().toLowerCase().replace(/\.$/, "").replace(/\s+/g, "");
}

export async function getReservedNames(env?: Partial<CloudflareRuntime>) {
  const subdomains = new Set(DEFAULT_RESERVED_SUBDOMAINS.map((entry) => normalizeSubdomain(entry)));
  const hostnames = new Set(DEFAULT_RESERVED_HOSTNAMES.map((entry) => normalizeHostname(entry)));

  if (!env?.CLOUDFLARE_API_TOKEN && !env?.CLOUDFLARE_ZONE_ID) {
    return {
      subdomains: [...subdomains].filter(Boolean).sort(),
      hostnames: [...hostnames].filter(Boolean).sort(),
    };
  }

  try {
    const records = await listDnsRecords(env as CloudflareRuntime, ZONE_NAME);
    for (const record of records) {
      const name = typeof record?.name === "string" ? record.name : "";
      const normalizedHost = normalizeHostname(name);
      if (!normalizedHost) continue;

      hostnames.add(normalizedHost);
      if (normalizedHost === ZONE_NAME) {
        subdomains.add("der");
        continue;
      }

      if (normalizedHost.endsWith(`.${ZONE_NAME}`)) {
        const subdomain = normalizeSubdomain(normalizedHost);
        if (subdomain && subdomain !== "der") {
          subdomains.add(subdomain);
        }
      }
    }
  } catch {
    // Cloudflare access may fail in local or preview environments. We fall back to the static
    // policy list and treat it as a service-reserved baseline until the zone is confirmed.
  }

  return {
    subdomains: [...subdomains].filter(Boolean).sort(),
    hostnames: [...hostnames].filter(Boolean).sort(),
  };
}

export function validateSubdomainRequest(subdomain: string, reserved = getReservedNames()) {
  const normalized = normalizeSubdomain(subdomain);
  if (!normalized) {
    return { valid: false, normalized: "", hostname: "", reason: "Enter a subdomain name." };
  }

  if (normalized.length < 1 || normalized.length > 63) {
    return { valid: false, normalized, hostname: `${normalized}.${ZONE_NAME}`, reason: "Subdomain names must be between 1 and 63 characters." };
  }

  if (!/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/.test(normalized)) {
    return {
      valid: false,
      normalized,
      hostname: `${normalized}.${ZONE_NAME}`,
      reason: "Use lowercase letters, numbers, and hyphens. Hyphens may not begin or end the subdomain.",
    };
  }

  const allowed = reserved instanceof Promise ? [] : reserved;
  const subdomainSet = new Set(allowed.subdomains ?? []);
  const hostnameSet = new Set(allowed.hostnames ?? []);

  if (subdomainSet.has(normalized)) {
    return { valid: false, normalized, hostname: `${normalized}.${ZONE_NAME}`, reason: `The name ${normalized} is reserved for service use.` };
  }

  const hostname = `${normalized}.${ZONE_NAME}`;
  if (hostnameSet.has(hostname)) {
    return { valid: false, normalized, hostname, reason: `The hostname ${hostname} is already reserved or assigned to a service.` };
  }

  return { valid: true, normalized, hostname, reason: "" };
}
