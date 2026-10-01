import type { ApiRouteArgs, ApiRouteHandler } from "../server/lib/api-route";
import type { RuntimeEnv } from "../server/lib/env";
import * as apiKeys from "../server/routes/api/v1/api-keys";
import * as apiKey from "../server/routes/api/v1/api-keys.$keyId";
import * as domains from "../server/routes/api/v1/domains";
import * as domainAvailability from "../server/routes/api/v1/domains.availability";
import * as domainManagement from "../server/routes/api/v1/domains.management";
import * as domainModeration from "../server/routes/api/v1/domains.moderation";
import * as me from "../server/routes/api/v1/me";
import * as contact from "../server/routes/api/v1/settings.contact";
import { methodNotAllowed, problem } from "../server/services/api-auth";
import createAuth from "../server/services/auth";

type ApiRoute = {
  loader?: ApiRouteHandler;
  action?: ApiRouteHandler;
  allow: string;
};

const apiRoutes: Record<string, ApiRoute> = {
  "/me": { loader: me.loader, allow: "GET" },
  "/settings/contact": { loader: contact.loader, action: contact.action, allow: "GET, PUT" },
  "/domains": { loader: domains.loader, action: domains.action, allow: "GET, POST" },
  "/domains/:domainId": { loader: domainManagement.loader, action: domainManagement.action, allow: "GET, PATCH" },
  "/domains/:domainId/dns-records": { loader: domainManagement.loader, action: domainManagement.action, allow: "GET, POST" },
  "/domains/:domainId/dns-records/:recordId": { loader: domainManagement.loader, action: domainManagement.action, allow: "GET, PUT, DELETE" },
  "/domains/availability": { loader: domainAvailability.loader, allow: "GET" },
  "/domains/moderation": { loader: domainModeration.loader, action: domainModeration.action, allow: "GET, POST" },
  "/api-keys": { loader: apiKeys.loader, action: apiKeys.action, allow: "GET, POST" },
  "/api-keys/:keyId": { action: apiKey.action, allow: "DELETE" },
};

async function handleApiRequest(request: Request, env: RuntimeEnv, pathname: string) {
  let routePath = pathname.slice("/api/v1".length);
  let params: Record<string, string> = {};

  if (!apiRoutes[routePath]) {
    const domainRecordMatch = routePath.match(/^\/domains\/([^/]+)\/dns-records(?:\/([^/]+))?$/);
    const domainMatch = routePath.match(/^\/domains\/([^/]+)$/);
    const keyMatch = routePath.match(/^\/api-keys\/([^/]+)$/);
    if (domainRecordMatch) {
      try {
        params = {
          domainId: decodeURIComponent(domainRecordMatch[1]),
          ...(domainRecordMatch[2] ? { recordId: decodeURIComponent(domainRecordMatch[2]) } : {}),
        };
        routePath = domainRecordMatch[2]
          ? "/domains/:domainId/dns-records/:recordId"
          : "/domains/:domainId/dns-records";
      } catch {
        return problem(400, "Bad Request", "The DNS record id is malformed.");
      }
    } else if (domainMatch) {
      try {
        params = { domainId: decodeURIComponent(domainMatch[1]) };
        routePath = "/domains/:domainId";
      } catch {
        return problem(400, "Bad Request", "The domain id is malformed.");
      }
    } else if (keyMatch) {
      try {
        params = { keyId: decodeURIComponent(keyMatch[1]) };
        routePath = "/api-keys/:keyId";
      } catch {
        return problem(400, "Bad Request", "The API key id is malformed.");
      }
    }
  }

  const route = apiRoutes[routePath];
  if (!route) return problem(404, "Not Found", "API route not found.");

  const handler = request.method === "GET" ? route.loader : route.action;
  if (!handler) return methodNotAllowed(route.allow);

  const args: ApiRouteArgs = {
    request,
    context: { cloudflare: { env } },
    params,
  };
  return handler(args);
}

export const onRequest: PagesFunction<RuntimeEnv> = ({ request, env, next }) => {
  const { pathname } = new URL(request.url);

  if (pathname === "/api/auth" || pathname.startsWith("/api/auth/")) {
    if (!env.D1_DATABASE) {
      return Response.json(
        { error: "Authentication database is not configured." },
        { status: 503 }
      );
    }

    return createAuth(env).handler(request);
  }

  if (pathname === "/api/v1" || pathname.startsWith("/api/v1/")) {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Authorization, Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }
    return handleApiRequest(request, env, pathname);
  }

  if (pathname.startsWith("/api/")) {
    return Response.json({ error: "API route not found." }, { status: 404 });
  }

  return next();
};