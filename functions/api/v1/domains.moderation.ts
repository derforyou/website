import { eq } from "drizzle-orm";
import * as schema from "../../../server/database/schema";
import { isAdminEmail } from "../../../server/lib/admin";
import type { RuntimeEnv } from "../../../server/lib/env";
import { authenticateSession, createApiDatabase, jsonResponse, methodNotAllowed, problem, unauthorizedSession } from "../../../server/services/api-auth";

export async function onRequest({ request, env }: { request: Request; env: RuntimeEnv }) {
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  if (request.method === "GET") {
    const session = await authenticateSession(request, env);
    if (!session) return unauthorizedSession();
    if (!isAdminEmail(session.user.email, env.ADMIN_EMAIL)) {
      return problem(403, "Forbidden", "Only authorized administrators can moderate domain registrations.");
    }

    const [pendingRequests, activeDomains] = await Promise.all([
      db.select({
        id: schema.domainRegistration.id,
        hostname: schema.domainRegistration.hostname,
        subdomain: schema.domainRegistration.subdomain,
        status: schema.domainRegistration.status,
        dnsMode: schema.domainRegistration.dnsMode,
        customNameservers: schema.domainRegistration.customNameservers,
        notes: schema.domainRegistration.notes,
        createdAt: schema.domainRegistration.createdAt,
        userName: schema.user.name,
        userEmail: schema.user.email,
      }).from(schema.domainRegistration)
        .leftJoin(schema.user, eq(schema.user.id, schema.domainRegistration.userId))
        .where(eq(schema.domainRegistration.status, "pending"))
        .orderBy(schema.domainRegistration.createdAt),
      db.select({
        id: schema.domain.id,
        hostname: schema.domain.hostname,
        subdomain: schema.domain.subdomain,
        status: schema.domain.status,
        dnsMode: schema.domain.dnsMode,
        customNameservers: schema.domain.customNameservers,
        dnsSyncStatus: schema.domain.dnsSyncStatus,
        ownerId: schema.domain.ownerId,
        createdAt: schema.domain.createdAt,
        userName: schema.user.name,
        userEmail: schema.user.email,
      }).from(schema.domain)
        .leftJoin(schema.user, eq(schema.user.id, schema.domain.ownerId))
        .orderBy(schema.domain.createdAt),
    ]);

    return jsonResponse({ data: { pendingRequests, activeDomains } });
  }

  if (request.method !== "POST") return methodNotAllowed("GET, POST");

  const session = await authenticateSession(request, env);
  if (!session) return unauthorizedSession();
  if (!isAdminEmail(session.user.email, env.ADMIN_EMAIL)) {
    return problem(403, "Forbidden", "Only authorized administrators can moderate domain registrations.");
  }

  const payload = await request.json().catch(() => null);
  if (!payload || typeof payload !== "object") {
    return problem(400, "Bad Request", "A JSON payload is required.");
  }

  const body = payload as Record<string, unknown>;
  const actionName = typeof body.action === "string" ? body.action : "";
  const registrationId = typeof body.registrationId === "string" ? body.registrationId : null;
  const domainId = typeof body.domainId === "string" ? body.domainId : null;
  const reason = typeof body.reason === "string" ? body.reason : "";

  if (actionName === "approve") {
    if (!registrationId) return problem(400, "Bad Request", "A registration id is required.");

    const [registration] = await db.select().from(schema.domainRegistration).where(eq(schema.domainRegistration.id, registrationId)).limit(1);
    if (!registration) return problem(404, "Not Found", "The registration request could not be found.");

    const [existingDomain] = await db.select({ id: schema.domain.id }).from(schema.domain).where(eq(schema.domain.hostname, registration.hostname)).limit(1);
    if (existingDomain) {
      return problem(409, "Conflict", "That hostname is already active or reserved.");
    }

    const [existingContact] = await db.select().from(schema.contact).where(eq(schema.contact.userId, registration.userId)).limit(1);
    const contactId = existingContact?.id ?? crypto.randomUUID();
    if (!existingContact) {
      await db.insert(schema.contact).values({
        id: contactId,
        userId: registration.userId,
        fullName: session.user.name || "DERforyou user",
        organization: null,
        email: session.user.email || "",
        phone: null,
        addressLine1: null,
        addressLine2: null,
        city: null,
        stateProvince: null,
        postalCode: null,
        countryCode: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }

    const createdAt = new Date();
    const [domainRecord] = await db.insert(schema.domain).values({
      id: crypto.randomUUID(),
      subdomain: registration.subdomain,
      hostname: registration.hostname,
      ownerId: registration.userId,
      contactId,
      registrationId: registration.id,
      status: "active",
      dnsMode: registration.dnsMode,
      customNameservers: registration.customNameservers,
      dnsSyncStatus: "not-configured",
      createdAt,
      updatedAt: createdAt,
    }).returning();

    await db.update(schema.domainRegistration)
      .set({
        status: "approved",
        decidedByUserId: session.user.id,
        decisionAt: createdAt,
        rejectedReason: null,
        updatedAt: createdAt,
      })
      .where(eq(schema.domainRegistration.id, registration.id));

    return jsonResponse({
      data: {
        registrationId: registration.id,
        domainId: domainRecord?.id ?? null,
        status: "approved",
        hostname: registration.hostname,
      },
    });
  }

  if (actionName === "reject") {
    if (!registrationId) return problem(400, "Bad Request", "A registration id is required.");

    const decisionAt = new Date();
    await db.update(schema.domainRegistration)
      .set({
        status: "rejected",
        rejectedReason: reason.trim() || "Rejected by an administrator.",
        decidedByUserId: session.user.id,
        decisionAt,
        updatedAt: decisionAt,
      })
      .where(eq(schema.domainRegistration.id, registrationId));

    return jsonResponse({ data: { registrationId, status: "rejected" } });
  }

  if (actionName === "suspend") {
    if (!domainId) return problem(400, "Bad Request", "A domain id is required.");

    await db.update(schema.domain)
      .set({ status: "suspended", updatedAt: new Date() })
      .where(eq(schema.domain.id, domainId));

    return jsonResponse({ data: { domainId, status: "suspended" } });
  }

  if (actionName === "delete") {
    if (domainId) {
      await db.delete(schema.domain).where(eq(schema.domain.id, domainId));
      return jsonResponse({ data: { domainId, deleted: true } });
    }

    if (registrationId) {
      await db.delete(schema.domainRegistration).where(eq(schema.domainRegistration.id, registrationId));
      return jsonResponse({ data: { registrationId, deleted: true } });
    }

    return problem(400, "Bad Request", "A domain or registration id is required.");
  }

  return problem(400, "Bad Request", "Unsupported moderation action.");
}
