import React from "react";
import { render } from "ink";
import { existsSync } from "node:fs";

import { MigrationApp } from "./migrate/components/migration-app.tsx";
import { parseMigrationOptions } from "./migrate/config.ts";

async function main() {
  if (existsSync(".env")) {
    process.loadEnvFile(".env");
  }

  const args = process.argv.slice(2);
  if (args.includes("--help")) {
    console.log(
      [
        "Usage: npm run db:migrate [-- --local] [--dir <path>] [--yes]",
        "",
        "Apply pending Cloudflare D1 migrations with interactive confirmation by default.",
        "Set CLOUDFLARE_DATABASE_ID in .env or the environment.",
        "",
        "  --local       Apply migrations to the local D1 database",
        "  --dir <path>  Migration directory (default: drizzle)",
        "  --yes         Skip interactive confirmation",
        "  --help        Show this help",
      ].join("\n"),
    );
    return;
  }

  const options = parseMigrationOptions(args);

  if (!options.yes && (!process.stdin.isTTY || !process.stdout.isTTY)) {
    throw new Error("Interactive confirmation requires a TTY. Pass --yes to confirm explicitly.");
  }

  const app = render(React.createElement(MigrationApp, { options }));
  const result = await app.waitUntilExit();
  process.exitCode = typeof result === "number" ? result : 0;
}

main().catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`Database migration aborted: ${message}`);
  process.exitCode = 1;
});
