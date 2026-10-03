import { readFileSync } from "node:fs";

export type MigrationOptions = {
  databaseId: string;
  directory: string;
  local: boolean;
  yes: boolean;
};

export function parseMigrationOptions(
  args: string[],
  databaseId = readD1DatabaseId(),
): MigrationOptions {
  let directory = "drizzle";
  let local = false;
  let yes = false;

  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];

    if (argument === "--local") {
      local = true;
    } else if (argument === "--yes") {
      yes = true;
    } else if (argument === "--dir") {
      const value = args[index + 1];
      if (!value || value.startsWith("--")) {
        throw new Error("--dir requires a migration directory.");
      }
      directory = value;
      index += 1;
    } else {
      throw new Error(`Unknown migration option: ${argument}`);
    }
  }

  const normalizedDatabaseId = databaseId.trim();
  if (!normalizedDatabaseId) throw new Error("D1 binding DB has an empty database ID.");

  return { databaseId: normalizedDatabaseId, directory, local, yes };
}

export function readD1DatabaseId(configPath = "cloudflare.config.ts"): string {
  let config: string;
  try {
    config = readFileSync(configPath, "utf8");
  } catch (error) {
    throw new Error(`Could not read Cloudflare config at ${configPath}.`, { cause: error });
  }

  const databaseBinding = config.match(
    /\bDB\s*:\s*bindings\.d1\(\s*\{\s*id\s*:\s*["']([^"']+)["']/,
  );
  const databaseId = databaseBinding?.[1];
  if (!databaseId) {
    throw new Error(`Could not find a static DB: bindings.d1({ id: "..." }) binding in ${configPath}.`);
  }

  return databaseId;
}
