import assert from "node:assert/strict";
import test from "node:test";

import { getTableColumns } from "drizzle-orm";
import { account } from "../../lib/db/schema.ts";

test("Drizzle account schema maps Better Auth idToken to id_token", () => {
  const idTokenColumn = Object.values(getTableColumns(account)).find(
    (column) => column.name === "id_token",
  );

  assert.ok(idTokenColumn, "account schema must define the id_token column");
  assert.equal(idTokenColumn.notNull, false);
});
