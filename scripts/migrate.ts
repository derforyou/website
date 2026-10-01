import { DATABASE_NAME, ensureCloudflareCredentials, runWrangler } from "./d1";

ensureCloudflareCredentials();
runWrangler(["d1", "migrations", "apply", DATABASE_NAME, "--remote"]);