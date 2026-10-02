import { getAuth } from "@/lib/auth";
import { AppError } from "@/lib/errors";

export async function getCurrentUser(headers: Headers) {
  const session = await getAuth().api.getSession({ headers });
  return session?.user.status === "active" ? session.user : null;
}

export async function requireUser(request: Request | Headers) {
  const headers = request instanceof Request ? request.headers : request;
  const session = await getAuth().api.getSession({ headers });

  if (!session) {
    throw new AppError(401, "unauthenticated", "Authentication is required.");
  }

  if (session.user.status !== "active") {
    throw new AppError(403, "account_inactive", "This account is not active.");
  }

  return session.user;
}

export async function requireAdmin(request: Request) {
  const user = await requireUser(request);

  if (user.role !== "admin") {
    throw new AppError(403, "admin_required", "Administrator access is required.");
  }

  return user;
}