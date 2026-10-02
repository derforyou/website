import { AppError } from "@/lib/errors";
import { isValidHostnameLabel, parseCustomNameservers } from "@/lib/validation/nameservers";

export type DnsMode = "shared" | "custom";

export type DomainRegistrationInput = {
  label: string;
  dnsMode: DnsMode;
  nameservers: string[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function parseDomainRegistrationInput(value: unknown): DomainRegistrationInput {
  if (!isRecord(value) || typeof value.label !== "string") {
    throw new AppError(400, "invalid_domain", "A domain label is required.");
  }

  const label = value.label.trim().toLowerCase();
  if (!isValidHostnameLabel(label)) {
    throw new AppError(400, "invalid_domain", "The domain label is invalid.");
  }

  const dnsMode = value.dnsMode === undefined ? "shared" : value.dnsMode;
  if (dnsMode !== "shared" && dnsMode !== "custom") {
    throw new AppError(400, "invalid_dns_mode", "The DNS mode is invalid.");
  }

  let nameservers: string[] = [];
  if (dnsMode === "custom") {
    nameservers = parseCustomNameservers(value.nameservers);
  } else if (value.nameservers !== undefined) {
    if (!Array.isArray(value.nameservers)) {
      throw new AppError(400, "invalid_nameservers", "Nameservers must be provided as a list.");
    }
    if (value.nameservers.length > 0) {
      throw new AppError(400, "invalid_nameservers", "Shared DNS does not accept custom nameservers.");
    }
  }

  return { label, dnsMode, nameservers };
}