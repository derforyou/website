import assert from "node:assert/strict";
import test from "node:test";

import { parseMigrationOptions } from "../../../scripts/db/migrate/config.ts";

test("migration options parse explicit local mode and directory", () => {
  assert.deepEqual(
    parseMigrationOptions(["--local", "--dir", "drizzle/test"], {
      CLOUDFLARE_DATABASE_ID: "d1-test-id",
    }),
    {
      databaseId: "d1-test-id",
      directory: "drizzle/test",
      local: true,
      yes: false,
    },
  );
});
