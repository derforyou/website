import { AppError } from "@/lib/errors";

export type DnsMode = "shared" | "custom";

export type DomainRegistrationInput = {
  label: string;
  dnsMode: DnsMode;
  nameservers: string[];
};

const domainLabelPattern = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function normalizeNameserver(value: unknown): string {
  if (typeof value !== "string") {
    throw new AppError(400, "invalid_nameserver", "Nameservers must be hostnames.");
  }

  const hostname = value.trim().toLowerCase().replace(/\.$/, "");
  const labels = hostname.split(".");

  if (
    hostname.length > 253 ||
    labels.length < 2 ||
    labels.some((label) => !domainLabelPattern.test(label))
  ) {
    throw new AppError(400, "invalid_nameserver", "A nameserver hostname is invalid.");
  }

  return hostname;
}

export function parseDomainRegistrationInput(value: unknown): DomainRegistrationInput {
  if (!isRecord(value) || typeof value.label !== "string") {
    throw new AppError(400, "invalid_domain", "A domain label is required.");
  }

  const label = value.label.trim().toLowerCase();
  if (!domainLabelPattern.test(label)) {
    throw new AppError(400, "invalid_domain", "The domain label is invalid.");
  }

  const dnsMode = value.dnsMode === undefined ? "shared" : value.dnsMode;
  if (dnsMode !== "shared" && dnsMode !== "custom") {
    throw new AppError(400, "invalid_dns_mode", "The DNS mode is invalid.");
  }

  if (value.nameservers !== undefined && !Array.isArray(value.nameservers)) {
    throw new AppError(400, "invalid_nameservers", "Nameservers must be provided as a list.");
  }

  const nameservers = Array.isArray(value.nameservers)
    ? [...new Set(value.nameservers.map(normalizeNameserver))]
    : [];

  if (dnsMode === "custom" && nameservers.length < 2) {
    throw new AppError(400, "invalid_nameservers", "Custom DNS requires at least two nameservers.");
  }

  if (dnsMode === "shared" && nameservers.length > 0) {
    throw new AppError(400, "invalid_nameservers", "Shared DNS does not accept custom nameservers.");
  }

  return { label, dnsMode, nameservers };
}