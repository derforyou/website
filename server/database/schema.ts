import { relations, sql } from "drizzle-orm";
import {
    check,
    index,
    integer,
    sqliteTable,
    text,
} from "drizzle-orm/sqlite-core";

const timestamp = (name: string) => integer(name, { mode: "timestamp_ms" });

export const user = sqliteTable(
  "user",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull().unique(),
    emailVerified: integer("emailVerified", { mode: "boolean" })
      .notNull()
      .default(false),
    image: text("image"),
    role: text("role", { enum: ["user", "moderator", "admin", "owner"] })
      .notNull()
      .default("user"),
    twoFactorEnabled: integer("twoFactorEnabled", { mode: "boolean" })
      .notNull()
      .default(false),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [
    check(
      "user_role_check",
      sql`${table.role} in ('user', 'moderator', 'admin', 'owner')`
    ),
  ]
);

export const session = sqliteTable(
  "session",
  {
    id: text("id").primaryKey(),
    expiresAt: timestamp("expiresAt").notNull(),
    token: text("token").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
  },
  (table) => [index("session_user_id_idx").on(table.userId)]
);

export const account = sqliteTable(
  "account",
  {
    id: text("id").primaryKey(),
    accountId: text("accountId").notNull(),
    providerId: text("providerId").notNull(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accessToken: text("accessToken"),
    refreshToken: text("refreshToken"),
    idToken: text("idToken"),
    accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
    refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
    scope: text("scope"),
    password: text("password"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)]
);

export const verification = sqliteTable(
  "verification",
  {
    id: text("id").primaryKey(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: timestamp("expiresAt").notNull(),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)]
);

export const authOtpThrottle = sqliteTable("authOtpThrottle", {
  email: text("email").primaryKey(),
  sentCount: integer("sentCount").notNull(),
  lastSentAt: integer("lastSentAt").notNull(),
  nextAllowedAt: integer("nextAllowedAt").notNull(),
});

export const twoFactor = sqliteTable(
  "twoFactor",
  {
    id: text("id").primaryKey(),
    secret: text("secret").notNull(),
    backupCodes: text("backupCodes").notNull(),
    userId: text("userId")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    verified: integer("verified", { mode: "boolean" }).notNull().default(true),
    failedVerificationCount: integer("failedVerificationCount")
      .notNull()
      .default(0),
    lockedUntil: timestamp("lockedUntil"),
  },
  (table) => [index("two_factor_secret_idx").on(table.secret)]
);

export const contact = sqliteTable(
  "contact",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    fullName: text("fullName").notNull(),
    organization: text("organization"),
    email: text("email").notNull(),
    phone: text("phone"),
    addressLine1: text("addressLine1"),
    addressLine2: text("addressLine2"),
    city: text("city"),
    stateProvince: text("stateProvince"),
    postalCode: text("postalCode"),
    countryCode: text("countryCode", { length: 2 }),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [index("contact_email_idx").on(table.email)]
);

export const domainRegistration = sqliteTable(
  "domainRegistration",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    subdomain: text("subdomain").notNull(),
    hostname: text("hostname").notNull(),
    status: text("status", { enum: ["pending", "approved", "rejected"] })
      .notNull()
      .default("pending"),
    dnsMode: text("dnsMode", { enum: ["managed", "custom"] })
      .notNull()
      .default("managed"),
    customNameservers: text("customNameservers"),
    notes: text("notes"),
    rejectedReason: text("rejectedReason"),
    decidedByUserId: text("decidedByUserId").references(() => user.id, { onDelete: "set null" }),
    decisionAt: timestamp("decisionAt"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [
    check("domain_registration_subdomain_lowercase", sql`${table.subdomain} = lower(${table.subdomain})`),
    index("domain_registration_user_id_idx").on(table.userId),
    index("domain_registration_status_idx").on(table.status),
    index("domain_registration_hostname_idx").on(table.hostname),
  ]
);

export const domain = sqliteTable(
  "domain",
  {
    id: text("id").primaryKey(),
    subdomain: text("subdomain").notNull().unique(),
    hostname: text("hostname").notNull().unique(),
    ownerId: text("ownerId")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    contactId: text("contactId")
      .notNull()
      .references(() => contact.id, { onDelete: "restrict" }),
    registrationId: text("registrationId").references(() => domainRegistration.id, { onDelete: "set null" }),
    status: text("status", { enum: ["active", "suspended"] })
      .notNull()
      .default("active"),
    dnsMode: text("dnsMode", { enum: ["managed", "custom"] })
      .notNull()
      .default("managed"),
    customNameservers: text("customNameservers"),
    dnsSyncStatus: text("dnsSyncStatus", {
      enum: ["not-configured", "pending", "synced", "failed"],
    })
      .notNull()
      .default("not-configured"),
    createdAt: timestamp("createdAt").notNull(),
    updatedAt: timestamp("updatedAt").notNull(),
  },
  (table) => [
    check("domain_subdomain_lowercase", sql`${table.subdomain} = lower(${table.subdomain})`),
    index("domain_owner_id_idx").on(table.ownerId),
    index("domain_registration_id_idx").on(table.registrationId),
  ]
);

export const apiKey = sqliteTable(
  "apiKey",
  {
    id: text("id").primaryKey(),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    prefix: text("prefix").notNull(),
    keyHash: text("keyHash").notNull().unique(),
    createdAt: timestamp("createdAt").notNull(),
    lastUsedAt: timestamp("lastUsedAt"),
    expiresAt: timestamp("expiresAt"),
    revokedAt: timestamp("revokedAt"),
  },
  (table) => [index("api_key_user_id_idx").on(table.userId)]
);

export const auditLog = sqliteTable(
  "auditLog",
  {
    id: text("id").primaryKey(),
    actorId: text("actorId").references(() => user.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    resourceType: text("resourceType").notNull(),
    resourceId: text("resourceId"),
    metadata: text("metadata"),
    createdAt: timestamp("createdAt").notNull(),
  },
  (table) => [
    index("audit_log_actor_id_idx").on(table.actorId),
    index("audit_log_resource_idx").on(table.resourceType, table.resourceId),
    index("audit_log_created_at_idx").on(table.createdAt),
  ]
);

export const userRelations = relations(user, ({ many, one }) => ({
  sessions: many(session),
  accounts: many(account),
  contact: one(contact),
  domains: many(domain),
  apiKeys: many(apiKey),
  registrations: many(domainRegistration),
  moderatedDecisions: many(domainRegistration, { relationName: "decidedBy" }),
}));

export const domainRegistrationRelations = relations(domainRegistration, ({ one, many }) => ({
  user: one(user, { fields: [domainRegistration.userId], references: [user.id] }),
  decidedBy: one(user, { fields: [domainRegistration.decidedByUserId], references: [user.id], relationName: "moderatedDecisions" }),
  domains: many(domain),
}));

export const domainRelations = relations(domain, ({ one, many }) => ({
  owner: one(user, { fields: [domain.ownerId], references: [user.id] }),
  contact: one(contact, { fields: [domain.contactId], references: [contact.id] }),
  registration: one(domainRegistration, { fields: [domain.registrationId], references: [domainRegistration.id] }),
}));

export const contactRelations = relations(contact, ({ one }) => ({
  user: one(user, { fields: [contact.userId], references: [user.id] }),
}));

export const schema = {
  user,
  session,
  account,
  verification,
  twoFactor,
  contact,
  domainRegistration,
  domain,
  apiKey,
  auditLog,
  userRelations,
  domainRegistrationRelations,
  domainRelations,
  contactRelations,
};