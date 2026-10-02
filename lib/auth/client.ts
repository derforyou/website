import { createAuthClient } from "better-auth/react";

import type { getAuth } from "@/lib/auth";

export const authClient = createAuthClient<ReturnType<typeof getAuth>>();