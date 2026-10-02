import { requireUser } from "@/lib/auth/guards";
import { AppError } from "@/lib/errors";
import {
  createDomainRegistration,
  findDomainByLabel,
  listDomainsForUser,
} from "@/lib/repository/domains";
import { parseDomainRegistrationInput } from "@/lib/validation/domains";

export async function getUserDomains(request: Request) {
  const user = await requireUser(request);
  return listDomainsForUser(user.id);
}

export async function submitDomainRegistration(request: Request, input: unknown) {
  const user = await requireUser(request);
  const registration = parseDomainRegistrationInput(input);

  if (await findDomainByLabel(registration.label)) {
    throw new AppError(409, "domain_unavailable", "This domain label is already registered.");
  }

  try {
    return await createDomainRegistration(user.id, registration);
  } catch (error) {
    if (
      error instanceof Error &&
      /UNIQUE constraint failed: domain\.(?:name|label)/i.test(error.message)
    ) {
      throw new AppError(409, "domain_unavailable", "This domain label is already registered.");
    }

    throw error;
  }
}