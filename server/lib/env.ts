export type RuntimeEnv = {
  APP_URL?: string;
  BETTER_AUTH_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  RESEND_API_KEY?: string;
  BREVO_API_KEY?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_ZONE_ID?: string;
  // D1_DATABASE is a Cloudflare binding declared in wrangler.toml.
  // It must not be duplicated in local .env files because that creates a binding name conflict during deploy.
  D1_DATABASE?: D1Database;
};

export function getRuntimeEnv(env: Partial<RuntimeEnv> = {}): RuntimeEnv {
  return {
    APP_URL: env.APP_URL ?? "http://localhost:5173",
    BETTER_AUTH_SECRET: env.BETTER_AUTH_SECRET ?? "development-secret-change-me",
    GITHUB_CLIENT_ID: env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: env.GITHUB_CLIENT_SECRET,
    RESEND_API_KEY: env.RESEND_API_KEY,
    BREVO_API_KEY: env.BREVO_API_KEY,
    CLOUDFLARE_API_TOKEN: env.CLOUDFLARE_API_TOKEN,
    CLOUDFLARE_ZONE_ID: env.CLOUDFLARE_ZONE_ID,
    D1_DATABASE: env.D1_DATABASE,
  };
}
