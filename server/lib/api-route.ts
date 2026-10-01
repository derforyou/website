import type { RuntimeEnv } from "./env";

export type ApiRouteArgs = {
  request: Request;
  context: { cloudflare: { env: RuntimeEnv } };
  params: Record<string, string>;
};

export type ApiRouteHandler = (args: ApiRouteArgs) => Promise<Response>;