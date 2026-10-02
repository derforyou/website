import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ request: string }> }): Promise<Metadata> {
  const { request } = await params;
  return { title: "Request details", description: `Request: ${request}` };
}

export default async function RequestsRequestPage({ params }: { params: Promise<{ request: string }> }) {
  const { request } = await params;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Request details</h1>
        <p className="mt-2 text-base text-muted-foreground">Request: {request}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{request}</CardTitle>
          <CardDescription>Operational detail for this protected resource.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Ownership, authorization, and lifecycle checks are enforced server-side.</p>
        </CardContent>
      </Card>
    </>
  );
}
