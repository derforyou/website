import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { toUnix } from "$/lib/dates";

export const user = sqliteTable("users", {
  id: text("id").primaryKey().notNull(),
  name: text("name").notNull(),
  namespace: text("namespace").notNull(),
  loginId: integer("loginId")
    .references(() => login.id)
    .notNull(),
  verified: integer("verified", {
    mode: "boolean",
  })
    .default(true)
    .notNull(),
  verificationCode: text("verificationCode").notNull(),
  createdOn: integer("createdOn").default(toUnix(new Date())).notNull(),
});

export const login = sqliteTable("logins", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
});
