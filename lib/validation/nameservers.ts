import { AppError } from "@/lib/errors";

const hostnameLabelPattern = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

export function isValidHostnameLabel(value: string) {
  return hostnameLabelPattern.test(value);
}

export function normalizeNameserver(value: unknown): string {
  if (typeof value !== "string") {
    throw new AppError(400, "invalid_nameserver", "Nameservers must be hostnames.");
  }

  const hostname = value.trim().toLowerCase().replace(/\.$/, "");
  const labels = hostname.split(".");

  if (
    hostname.length > 253 ||
    labels.length < 2 ||
    labels.some((label) => !isValidHostnameLabel(label))
  ) {
    throw new AppError(400, "invalid_nameserver", "A nameserver hostname is invalid.");
  }

  return hostname;
}

export function parseCustomNameservers(value: unknown): string[] {
  if (!Array.isArray(value)) {
    throw new AppError(400, "invalid_nameservers", "Custom nameservers must be provided as a list.");
  }

  const nameservers = [...new Set(value.map(normalizeNameserver))];
  if (nameservers.length < 2) {
    throw new AppError(400, "invalid_nameservers", "Custom DNS requires at least two nameservers.");
  }

  return nameservers;
}

export function normalizeManagedDomainName(value: unknown): string {
  if (typeof value !== "string") {
    throw new AppError(400, "invalid_domain", "A managed domain name is required.");
  }

  const domainName = value.trim().toLowerCase().replace(/\.$/, "");
  const suffix = ".der.my.id";
  const label = domainName.endsWith(suffix) ? domainName.slice(0, -suffix.length) : "";

  if (!label || label.includes(".") || !isValidHostnameLabel(label)) {
    throw new AppError(400, "invalid_domain", "Only a single-label der.my.id domain can be managed.");
  }

  return domainName;
}