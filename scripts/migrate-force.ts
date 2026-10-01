import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
    DATABASE_NAME,
    ensureCloudflareCredentials,
    queryRemote,
    runWrangler,
} from "./d1";

const INTERNAL_TABLES = new Set(["_cf_KV"]);

function quoteIdentifier(identifier: string) {
  return `"${identifier.replaceAll('"', '""')}"`;
}

function orderForDrop(tables: string[], dependencies: Map<string, Set<string>>) {
  const remaining = new Set(tables.filter((table) => table !== "d1_migrations"));
  const ordered: string[] = [];

  while (remaining.size > 0) {
    const leaf = [...remaining].find((parent) =>
      [...remaining].every(
        (child) => child === parent || !dependencies.get(child)?.has(parent)
      )
    );

    if (!leaf) {
      throw new Error("Cannot safely drop tables with cyclic foreign-key dependencies.");
    }

    ordered.push(leaf);
    remaining.delete(leaf);
  }

  if (tables.includes("d1_migrations")) ordered.push("d1_migrations");
  return ordered;
}

function main() {
  if (!process.argv.includes("--confirm-reset")) {
    throw new Error(
      "This deletes all remote application data. Re-run with --confirm-reset to continue."
    );
  }

  ensureCloudflareCredentials();

  const tableRows = queryRemote(
    "SELECT name FROM sqlite_master WHERE type = 'table' AND name NOT LIKE 'sqlite_%' ORDER BY name"
  );
  const tables = tableRows
    .map((row) => row.name)
    .filter(
      (name): name is string =>
        typeof name === "string" && !INTERNAL_TABLES.has(name)
    );
  const tableSet = new Set(tables);
  const dependencies = new Map<string, Set<string>>();

  for (const table of tables) {
    if (table === "d1_migrations") continue;

    const references = queryRemote(`PRAGMA foreign_key_list(${quoteIdentifier(table)})`)
      .map((row) => row.table)
      .filter(
        (name): name is string => typeof name === "string" && tableSet.has(name)
      );
    dependencies.set(table, new Set(references));
  }

  const orderedTables = orderForDrop(tables, dependencies);
  console.log(`Remote D1 database: ${DATABASE_NAME}`);
  console.log(`Tables to drop: ${orderedTables.join(", ") || "none"}`);

  if (process.argv.includes("--dry-run")) return;

  const temporaryDirectory = mkdtempSync(join(tmpdir(), "d1-force-migrate-"));
  const sqlPath = join(temporaryDirectory, "drop-tables.sql");

  try {
    const dropStatements = orderedTables
      .map((table) => `DROP TABLE IF EXISTS ${quoteIdentifier(table)};`)
      .join("\n");
    writeFileSync(sqlPath, dropStatements, "utf8");
    if (dropStatements) {
      runWrangler([
        "d1",
        "execute",
        DATABASE_NAME,
        "--remote",
        "--yes",
        "--file",
        sqlPath,
      ]);
    }
  } finally {
    rmSync(temporaryDirectory, { recursive: true, force: true });
  }

  runWrangler(["d1", "migrations", "apply", DATABASE_NAME, "--remote"]);
}

main();