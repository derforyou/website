import { requireUser } from "@/lib/auth/guards";
import { syncNameserverDelegation } from "@/lib/cloudflare/dns";
import { AppError } from "@/lib/errors";
import {
  findDomainDnsConfigurationForUser,
  replaceDomainDnsConfiguration,
} from "@/lib/repository/domains";
import { parseCustomNameservers } from "@/lib/validation/nameservers";

async function updateDomainDnsMode(
  request: Request,
  domainId: string,
  dnsMode: "shared" | "custom",
  desiredNameservers: string[],
) {
  const user = await requireUser(request);
  const current = await findDomainDnsConfigurationForUser(domainId, user.id);

  if (!current) {
    throw new AppError(404, "domain_not_found", "The domain was not found.");
  }

  if (current.status !== "approved") {
    throw new AppError(409, "domain_not_approved", "DNS settings require an approved domain.");
  }

  await syncNameserverDelegation(current.name, current.nameservers, desiredNameservers);

  try {
    const updated = await replaceDomainDnsConfiguration(
      current.id,
      user.id,
      user.id,
      dnsMode,
      desiredNameservers,
    );

    if (!updated) {
      throw new AppError(404, "domain_not_found", "The domain was not found.");
    }
  } catch (error) {
    try {
      await syncNameserverDelegation(current.name, desiredNameservers, current.nameservers);
    } catch {
      throw new AppError(503, "dns_state_uncertain", "DNS changes could not be fully restored.");
    }

    if (error instanceof AppError) {
      throw error;
    }

    throw new AppError(500, "dns_configuration_failed", "DNS settings could not be saved.");
  }

  return findDomainDnsConfigurationForUser(domainId, user.id);
}

export async function setCustomNameservers(
  request: Request,
  domainId: string,
  input: unknown,
) {
  const nameservers = parseCustomNameservers(input);
  return updateDomainDnsMode(request, domainId, "custom", nameservers);
}

export async function restoreSharedDns(request: Request, domainId: string) {
  return updateDomainDnsMode(request, domainId, "shared", []);
}