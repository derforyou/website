import { sql } from "drizzle-orm";
import {
  index,
  integer,
  sqliteTable,
  text,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

const createdAt = () =>
  integer("created_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

const updatedAt = () =>
  integer("updated_at", { mode: "timestamp_ms" })
    .notNull()
    .default(sql`(unixepoch() * 1000)`);

const generatedId = () => text("id").primaryKey().notNull().$defaultFn(() => crypto.randomUUID());

export const user = sqliteTable("user", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
  image: text("image"),
  role: text("role").notNull().default("user"),
  status: text("status").notNull().default("active"),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
});

export const account = sqliteTable(
  "account",
  {
    id: generatedId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    accountId: text("account_id").notNull(),
    providerId: text("provider_id").notNull(),
    accessToken: text("access_token"),
    refreshToken: text("refresh_token"),
    accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
    refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
    idToken: text("id_token"),
    scope: text("scope"),
    password: text("password"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("account_user_id_idx").on(table.userId)],
);

export const session = sqliteTable(
  "session",
  {
    id: generatedId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("session_user_id_idx").on(table.userId)],
);

export const verification = sqliteTable(
  "verification",
  {
    id: generatedId(),
    identifier: text("identifier").notNull(),
    value: text("value").notNull(),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("verification_identifier_idx").on(table.identifier)],
);

export const apiTokens = sqliteTable(
  "api_token",
  {
    id: generatedId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    tokenHash: text("token_hash").notNull().unique(),
    tokenPrefix: text("token_prefix").notNull(),
    lastUsedAt: integer("last_used_at", { mode: "timestamp_ms" }),
    expiresAt: integer("expires_at", { mode: "timestamp_ms" }),
    revokedAt: integer("revoked_at", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("api_token_user_id_idx").on(table.userId)],
);

export const contacts = sqliteTable(
  "contact",
  {
    id: generatedId(),
    userId: text("user_id")
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    organization: text("organization"),
    email: text("email").notNull(),
    phone: text("phone"),
    address: text("address"),
    city: text("city"),
    state: text("state"),
    postalCode: text("postal_code"),
    country: text("country"),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("contact_user_id_idx").on(table.userId)],
);

export const domains = sqliteTable(
  "domain",
  {
    id: generatedId(),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    name: text("name").notNull().unique(),
    label: text("label").notNull().unique(),
    status: text("status", {
      enum: ["pending", "approved", "rejected", "suspended", "revoked"],
    })
      .notNull()
      .default("pending"),
    dnsMode: text("dns_mode", { enum: ["shared", "custom"] }).notNull().default("shared"),
    approvedAt: integer("approved_at", { mode: "timestamp_ms" }),
    suspendedAt: integer("suspended_at", { mode: "timestamp_ms" }),
    revokedAt: integer("revoked_at", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [index("domain_user_id_idx").on(table.userId)],
);

export const domainSubmissions = sqliteTable(
  "domain_submission",
  {
    id: generatedId(),
    domainId: text("domain_id")
      .notNull()
      .references(() => domains.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => user.id, { onDelete: "restrict" }),
    dnsMode: text("dns_mode", { enum: ["shared", "custom"] }).notNull(),
    status: text("status", { enum: ["pending", "approved", "rejected", "cancelled"] })
      .notNull()
      .default("pending"),
    reason: text("reason"),
    adminNote: text("admin_note"),
    reviewedBy: text("reviewed_by").references(() => user.id, { onDelete: "set null" }),
    reviewedAt: integer("reviewed_at", { mode: "timestamp_ms" }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    index("domain_submission_domain_id_idx").on(table.domainId),
    index("domain_submission_user_id_idx").on(table.userId),
  ],
);

export const domainNameservers = sqliteTable(
  "domain_nameserver",
  {
    id: generatedId(),
    domainId: text("domain_id")
      .notNull()
      .references(() => domains.id, { onDelete: "cascade" }),
    nameserver: text("nameserver").notNull(),
    position: integer("position").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (table) => [
    uniqueIndex("domain_nameserver_domain_position_unique").on(table.domainId, table.position),
  ],
);

export const domainEvents = sqliteTable(
  "domain_event",
  {
    id: generatedId(),
    domainId: text("domain_id")
      .notNull()
      .references(() => domains.id, { onDelete: "cascade" }),
    actorUserId: text("actor_user_id").references(() => user.id, { onDelete: "set null" }),
    event: text("event").notNull(),
    fromStatus: text("from_status"),
    toStatus: text("to_status"),
    metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
    createdAt: createdAt(),
  },
  (table) => [index("domain_event_domain_id_idx").on(table.domainId)],
);

export const auditLogs = sqliteTable(
  "audit_log",
  {
    id: generatedId(),
    actorUserId: text("actor_user_id").references(() => user.id, { onDelete: "set null" }),
    action: text("action").notNull(),
    entityType: text("entity_type").notNull(),
    entityId: text("entity_id"),
    metadata: text("metadata", { mode: "json" }).$type<Record<string, unknown>>(),
    ipAddress: text("ip_address"),
    userAgent: text("user_agent"),
    createdAt: createdAt(),
  },
  (table) => [index("audit_log_actor_user_id_idx").on(table.actorUserId)],
);