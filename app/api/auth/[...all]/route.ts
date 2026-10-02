import { getAuth } from "@/lib/auth";

function handleAuth(request: Request) {
  return getAuth().handler(request);
}

export const GET = handleAuth;
export const POST = handleAuth;