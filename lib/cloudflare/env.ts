import { env } from "cloudflare:workers";

type RuntimeVariables = {
  APP_URL?: string;
  BETTER_AUTH_SECRET?: string;
  BETTER_AUTH_URL?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_ZONE_ID?: string;
  RESEND_API_KEY?: string;
  BREVO_API_KEY?: string;
};

export const runtimeEnv = env as typeof env & RuntimeVariables;