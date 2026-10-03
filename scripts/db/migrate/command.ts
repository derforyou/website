import type { MigrationOptions } from "./config.ts";

export function buildMigrationCommand(options: MigrationOptions) {
  const args = [
    "d1",
    "migrations",
    "apply",
    options.databaseId,
    "--dir",
    options.directory,
  ];

  if (options.local) {
    args.push("--local");
  }

  return { command: "cf", args };
}
