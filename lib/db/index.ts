import { drizzle } from "drizzle-orm/d1";

import { runtimeEnv } from "@/lib/cloudflare/env";
import * as schema from "@/lib/db/schema";

export function getDb() {
  return drizzle(runtimeEnv.DB, { schema });
}