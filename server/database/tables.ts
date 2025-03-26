import type * as schema from "./schema";
import type { Kyselify } from "drizzle-orm/kysely";

export type Tables = {
  users: Kyselify<typeof schema.user>;
  logins: Kyselify<typeof schema.login>;
};
