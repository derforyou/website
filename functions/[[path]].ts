import type { RuntimeEnv } from "../server/lib/env";
import createAuth from "../server/services/auth";

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
    return next();
  }

  if (pathname.startsWith("/api/")) {
    return Response.json({ error: "API route not found." }, { status: 404 });
  }

  return next();
};