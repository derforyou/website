import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  return { title: "DNS settings", description: `DNS for ${domain}` };
}

export default async function DomainDnsPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;

  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">DNS settings</h1>
        <p className="mt-2 text-base text-muted-foreground">DNS for {domain}</p>
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
