import assert from "node:assert/strict";
import test from "node:test";

import { buildMigrationCommand } from "../../../scripts/db/migrate/command.ts";

test("migration command targets the selected local D1 database", () => {
  assert.deepEqual(
    buildMigrationCommand({
      databaseId: "d1-test-id",
      directory: "drizzle",
      local: true,
      yes: false,
    }),
    {
      command: "cf",
      args: ["d1", "migrations", "apply", "d1-test-id", "--dir", "drizzle", "--local"],
    },
  );
});
