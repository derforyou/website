export type MigrationOptions = {
  databaseId: string;
  directory: string;
  local: boolean;
  yes: boolean;
};

export function parseMigrationOptions(
  args: string[],
  environment: Record<string, string | undefined> = process.env,
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

  const databaseId = environment.CLOUDFLARE_DATABASE_ID?.trim();
  if (!databaseId) {
    throw new Error("CLOUDFLARE_DATABASE_ID is required. Set it in .env or the environment.");
  }

  return { databaseId, directory, local, yes };
}
