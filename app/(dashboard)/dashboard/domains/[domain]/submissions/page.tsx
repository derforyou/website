import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  return { title: "Submissions", description: `Domain submissions for ${domain}` };
}

export default async function DomainSubmissionsPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Submissions</h1>
        <p className="mt-2 text-base text-muted-foreground">Domain submissions for {domain}</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>{domain}.der.my.id</CardTitle>
          <CardDescription>Operational detail for this protected resource.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Ownership, authorization, and lifecycle checks are enforced server-side.</p>
        </CardContent>
      </Card>
    </>
  );
}
