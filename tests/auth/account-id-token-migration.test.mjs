import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { DatabaseSync } from "node:sqlite";

test("D1 migration adds id_token to an existing account table", async () => {
  const migration = await readFile(
    new URL("../../drizzle/0001_curvy_the_hood.sql", import.meta.url),
    "utf8",
  );
  const db = new DatabaseSync(":memory:");

  try {
    db.exec("CREATE TABLE account (id TEXT PRIMARY KEY)");
    db.exec(migration);

    const columns = db.prepare("PRAGMA table_info(account)").all();
    assert.ok(columns.some((column) => column.name === "id_token"));
  } finally {
    db.close();
  }
});
