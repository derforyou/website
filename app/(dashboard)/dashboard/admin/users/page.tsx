import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Users", description: "Administrative view for service operators." };

export default function AdminusersPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Adminusers</h1>
        <p className="mt-2 text-base text-muted-foreground">Administrative view for service operators.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Adminusers</CardTitle>
          <CardDescription>Admin-only area for moderation, policies, and operational review.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Only verified administrators can access this surface. Every action is still enforced server-side.</p>
        </CardContent>
      </Card>
    </>
  );
}
