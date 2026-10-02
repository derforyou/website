import { env } from "cloudflare:workers";

type RuntimeVariables = {
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_ZONE_ID?: string;
};

export const runtimeEnv = env as typeof env & RuntimeVariables;