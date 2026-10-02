import { NextResponse, type NextRequest } from "next/server";

import { getAuth } from "@/lib/auth";

const authPagePaths = new Set([
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
]);

function isAuthPage(pathname: string) {
  return (
    authPagePaths.has(pathname) ||
    pathname === "/verify-email" ||
    pathname.startsWith("/verify-email/")
  );
}

function redirect(request: NextRequest, pathname: string) {
  const response = NextResponse.redirect(new URL(pathname, request.url));
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

function forbidden() {
  const response = NextResponse.json(
    { error: "account_inactive" },
    { status: 403 },
  );
  response.headers.set("Cache-Control", "private, no-store");
  return response;
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isDashboard = pathname === "/dashboard" || pathname.startsWith("/dashboard/");
  const isAdminPage = pathname === "/dashboard/admin" || pathname.startsWith("/dashboard/admin/");
  const isAuthenticationPage = isAuthPage(pathname);

  if (!isDashboard && !isAuthenticationPage) {
    return NextResponse.next();
  }

  const session = await getAuth().api.getSession({ headers: request.headers });
  const hasSession = session !== null;
  const isActiveUser = session?.user.status === "active";

  if (isDashboard) {
    if (!hasSession) {
      return redirect(request, "/login");
    }

    if (!isActiveUser) {
      return forbidden();
    }

    if (isAdminPage && session.user.role !== "admin") {
      return redirect(request, "/dashboard");
    }

    return NextResponse.next();
  }

  if (hasSession && !isActiveUser) {
    return forbidden();
  }

  if (isActiveUser) {
    return redirect(request, "/dashboard");
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
    "/verify-email/:path*",
  ],
};