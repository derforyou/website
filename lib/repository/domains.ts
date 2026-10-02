import { and, asc, desc, eq } from "drizzle-orm";

import { getDb } from "@/lib/db";
import {
  domainEvents,
  domainNameservers,
  domainSubmissions,
  domains,
} from "@/lib/db/schema";
import type { DomainRegistrationInput } from "@/lib/validation/domains";

export type DomainRecord = Pick<
  typeof domains.$inferSelect,
  "id" | "userId" | "name" | "label" | "status" | "dnsMode" | "createdAt"
>;

export type DomainDnsConfiguration = Pick<
  typeof domains.$inferSelect,
  "id" | "userId" | "name" | "status" | "dnsMode"
> & { nameservers: string[] };

export async function findDomainByLabel(label: string): Promise<DomainRecord | null> {
  const [domain] = await getDb()
    .select({
      id: domains.id,
      userId: domains.userId,
      name: domains.name,
      label: domains.label,
      status: domains.status,
      dnsMode: domains.dnsMode,
      createdAt: domains.createdAt,
    })
    .from(domains)
    .where(eq(domains.label, label))
    .limit(1);

  return domain ?? null;
}

export async function listDomainsForUser(userId: string): Promise<DomainRecord[]> {
  return getDb()
    .select({
      id: domains.id,
      userId: domains.userId,
      name: domains.name,
      label: domains.label,
      status: domains.status,
      dnsMode: domains.dnsMode,
      createdAt: domains.createdAt,
    })
    .from(domains)
    .where(eq(domains.userId, userId))
    .orderBy(desc(domains.createdAt));
}

export async function findDomainDnsConfigurationForUser(
  domainId: string,
  userId: string,
): Promise<DomainDnsConfiguration | null> {
  const rows = await getDb()
    .select({
      id: domains.id,
      userId: domains.userId,
      name: domains.name,
      status: domains.status,
      dnsMode: domains.dnsMode,
      nameserver: domainNameservers.nameserver,
    })
    .from(domains)
    .leftJoin(domainNameservers, eq(domainNameservers.domainId, domains.id))
    .where(and(eq(domains.id, domainId), eq(domains.userId, userId)))
    .orderBy(asc(domainNameservers.position));

  if (rows.length === 0) {
    return null;
  }

  return {
    id: rows[0].id,
    userId: rows[0].userId,
    name: rows[0].name,
    status: rows[0].status,
    dnsMode: rows[0].dnsMode,
    nameservers: rows.flatMap((row) => (row.nameserver ? [row.nameserver] : [])),
  };
}

export async function replaceDomainDnsConfiguration(
  domainId: string,
  userId: string,
  actorUserId: string,
  dnsMode: "shared" | "custom",
  nameservers: string[],
): Promise<boolean> {
  const db = getDb();
  const [ownedDomain] = await db
    .select({ id: domains.id })
    .from(domains)
    .where(and(eq(domains.id, domainId), eq(domains.userId, userId)))
    .limit(1);

  if (!ownedDomain) {
    return false;
  }

  const updateDomain = db
    .update(domains)
    .set({ dnsMode, updatedAt: new Date() })
    .where(and(eq(domains.id, domainId), eq(domains.userId, userId)))
    .returning({ id: domains.id });
  const deleteNameservers = db
    .delete(domainNameservers)
    .where(eq(domainNameservers.domainId, domainId));
  const insertEvent = db.insert(domainEvents).values({
    id: crypto.randomUUID(),
    domainId,
    actorUserId,
    event: "dns_mode_changed",
    metadata: { dnsMode, nameservers },
  });

  const results = nameservers.length > 0
    ? await db.batch([
        updateDomain,
        deleteNameservers,
        db.insert(domainNameservers).values(
          nameservers.map((nameserver, position) => ({
            id: crypto.randomUUID(),
            domainId,
            nameserver,
            position,
          })),
        ),
        insertEvent,
      ])
    : await db.batch([updateDomain, deleteNameservers, insertEvent]);

  return results[0].length > 0;
}

export async function createDomainRegistration(
  userId: string,
  input: DomainRegistrationInput,
): Promise<DomainRecord> {
  const db = getDb();
  const domainId = crypto.randomUUID();
  const submissionId = crypto.randomUUID();
  const domainName = `${input.label}.der.my.id`;

  const domainInsert = db.insert(domains).values({
    id: domainId,
    userId,
    name: domainName,
    label: input.label,
    status: "pending",
    dnsMode: input.dnsMode,
  });
  const submissionInsert = db.insert(domainSubmissions).values({
    id: submissionId,
    domainId,
    userId,
    dnsMode: input.dnsMode,
    status: "pending",
  });
  const eventInsert = db.insert(domainEvents).values({
    id: crypto.randomUUID(),
    domainId,
    actorUserId: userId,
    event: "registration_submitted",
    toStatus: "pending",
    metadata: { dnsMode: input.dnsMode },
  });

  if (input.nameservers.length > 0) {
    await db.batch([
      domainInsert,
      submissionInsert,
      eventInsert,
      db.insert(domainNameservers).values(
        input.nameservers.map((nameserver, position) => ({
          id: crypto.randomUUID(),
          domainId,
          nameserver,
          position,
        })),
      ),
    ]);
  } else {
    await db.batch([domainInsert, submissionInsert, eventInsert]);
  }

  const domain = await findDomainByLabel(input.label);
  if (!domain) {
    throw new Error("Created domain could not be loaded.");
  }

  return domain;
}