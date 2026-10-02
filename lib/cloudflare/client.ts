import Cloudflare from "cloudflare";

import { runtimeEnv } from "@/lib/cloudflare/env";

export function createCloudflareClient(apiToken = runtimeEnv.CLOUDFLARE_API_TOKEN) {
  if (!apiToken) {
    throw new Error("CLOUDFLARE_API_TOKEN is not configured.");
  }

  return new Cloudflare({ apiToken });
}