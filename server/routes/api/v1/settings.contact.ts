import { eq } from "drizzle-orm";
import * as schema from "../../../../server/database/schema";
import type { ApiRouteArgs } from "../../../../server/lib/api-route";
import type { RuntimeEnv } from "../../../../server/lib/env";
import { authenticateApiUser, createApiDatabase, isRecord, jsonBody, jsonResponse, methodNotAllowed, problem, unauthorizedApiUser } from "../../../../server/services/api-auth";

const contactFields = {
  fullName: schema.contact.fullName,
  organization: schema.contact.organization,
  email: schema.contact.email,
  phone: schema.contact.phone,
  addressLine1: schema.contact.addressLine1,
  addressLine2: schema.contact.addressLine2,
  city: schema.contact.city,
  stateProvince: schema.contact.stateProvince,
  postalCode: schema.contact.postalCode,
  countryCode: schema.contact.countryCode,
};

export async function loader({ request, context }: ApiRouteArgs) {
  if (request.method !== "GET") return methodNotAllowed("GET, PUT");
  const env = context.cloudflare.env as RuntimeEnv;
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  const identity = await authenticateApiUser(request, env, db);
  if (!identity) return unauthorizedApiUser();
  const [contact] = await db.select(contactFields)
    .from(schema.contact)
    .where(eq(schema.contact.userId, identity.user.id))
    .limit(1);
  return jsonResponse({ data: contact ?? null });
}

export async function action({ request, context }: ApiRouteArgs) {
  if (request.method !== "PUT") return methodNotAllowed("GET, PUT");
  const env = context.cloudflare.env as RuntimeEnv;
  const db = createApiDatabase(env);
  if (!db) return problem(503, "Service Unavailable", "The database is not configured.");

  const identity = await authenticateApiUser(request, env, db);
  if (!identity) return unauthorizedApiUser();
  const body = await jsonBody(request);
  if (!isRecord(body)) return problem(400, "Bad Request", "A JSON contact object is required.");

  const fullName = typeof body.fullName === "string" ? body.fullName.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  if (!fullName || fullName.length > 200 || !/^\S+@\S+\.\S+$/.test(email)) {
    return problem(400, "Bad Request", "fullName and a valid email are required.");
  }

  const optionalFields = ["organization", "phone", "addressLine1", "addressLine2", "city", "stateProvince", "postalCode", "countryCode"] as const;
  const values: Record<(typeof optionalFields)[number], string | null> = {
    organization: null,
    phone: null,
    addressLine1: null,
    addressLine2: null,
    city: null,
    stateProvince: null,
    postalCode: null,
    countryCode: null,
  };
  for (const field of optionalFields) {
    const value = body[field];
    if (value !== undefined && value !== null && typeof value !== "string") {
      return problem(400, "Bad Request", `${field} must be a string or null.`);
    }
    values[field] = typeof value === "string" ? value.trim() || null : null;
  }
  if (values.countryCode && !/^[A-Za-z]{2}$/.test(values.countryCode)) {
    return problem(400, "Bad Request", "countryCode must be a two-letter ISO 3166-1 alpha-2 code.");
  }

  const now = new Date();
  const [saved] = await db.insert(schema.contact).values({
    id: crypto.randomUUID(),
    userId: identity.user.id,
    fullName,
    email,
    ...values,
    createdAt: now,
    updatedAt: now,
  }).onConflictDoUpdate({
    target: schema.contact.userId,
    set: { fullName, email, ...values, updatedAt: now },
  }).returning({ id: schema.contact.id });
  if (!saved) return problem(500, "Internal Server Error", "The contact profile could not be saved.");

  const [contact] = await db.select(contactFields)
    .from(schema.contact)
    .where(eq(schema.contact.userId, identity.user.id))
    .limit(1);
  return jsonResponse({ data: contact });
}