import assert from "node:assert/strict";
import test from "node:test";

import { parseMigrationOptions } from "../../../scripts/db/migrate/config.ts";

test("migration options require a D1 database ID", () => {
  assert.throws(
    () => parseMigrationOptions([], ""),
    /D1 binding DB has an empty database ID/,
  );
});
