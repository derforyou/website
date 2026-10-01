import type { Kyselify } from "drizzle-orm/kysely";
import type * as schema from "./schema";

export type Tables = {
  user: Kyselify<typeof schema.user>;
  session: Kyselify<typeof schema.session>;
  account: Kyselify<typeof schema.account>;
  verification: Kyselify<typeof schema.verification>;
  authOtpThrottle: Kyselify<typeof schema.authOtpThrottle>;
  twoFactor: Kyselify<typeof schema.twoFactor>;
  contact: Kyselify<typeof schema.contact>;
  domain: Kyselify<typeof schema.domain>;
  apiKey: Kyselify<typeof schema.apiKey>;
  auditLog: Kyselify<typeof schema.auditLog>;
};
