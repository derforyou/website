import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ user: string }> }): Promise<Metadata> {
  const { user } = await params;
  return { title: "User review", description: `Admin user: ${user}` };
}

export default async function AdminUserPage({ params }: { params: Promise<{ user: string }> }) {
  const { user } = await params;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">User review</h1>
        <p className="mt-2 text-base text-muted-foreground">Admin user: {user}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{user}</CardTitle>
          <CardDescription>Operational detail for this protected resource.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Ownership, authorization, and lifecycle checks are enforced server-side.</p>
        </CardContent>
      </Card>
    </>
  );
}
