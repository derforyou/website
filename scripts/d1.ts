import "dotenv/config";
import { spawnSync } from "node:child_process";
import { resolve } from "node:path";

export const DATABASE_NAME = "der";

const wranglerEntry = resolve(process.cwd(), "node_modules/wrangler/bin/wrangler.js");

export function ensureCloudflareCredentials() {
  const missing = ["CLOUDFLARE_API_TOKEN", "CLOUDFLARE_ACCOUNT_ID"].filter(
    (name) => !process.env[name]
  );

  if (missing.length > 0) {
    throw new Error(`Missing ${missing.join(", ")} in .env.`);
  }
}

export function runWrangler(args: string[], captureOutput = false) {
  const result = spawnSync(process.execPath, [wranglerEntry, ...args], {
    encoding: "utf8",
    env: process.env,
    stdio: ["inherit", captureOutput ? "pipe" : "inherit", "inherit"],
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(`Wrangler exited with status ${result.status ?? "unknown"}.`);
  }

  return result.stdout ?? "";
}

export type D1Row = Record<string, unknown>;

export function queryRemote(sql: string) {
  const output = runWrangler(
    ["d1", "execute", DATABASE_NAME, "--remote", "--json", "--command", sql],
    true
  );
  const responses = JSON.parse(output) as Array<{
    results?: D1Row[];
    success?: boolean;
  }>;

  if (!Array.isArray(responses) || responses.some((response) => !response.success)) {
    throw new Error("Wrangler returned an unsuccessful D1 query response.");
  }

  return responses.flatMap((response) => response.results ?? []);
}