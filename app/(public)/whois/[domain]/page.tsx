import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export async function generateMetadata({ params }: { params: Promise<{ domain: string }> }): Promise<Metadata> {
  const { domain } = await params;
  return {
    title: domain,
    description: `Public registration details for ${domain}, displayed according to the service WHOIS policy.`,
  };
}

export default async function DomainWhoisPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;

  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">WHOIS</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{domain}</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Public registration details for this domain, displayed according to the service WHOIS policy.</p>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Domain record</CardTitle>
          <CardDescription>Example output for a registered .der.my.id domain.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Domain: {domain}</p>
          <p>Status: active</p>
          <p>Registrar: der.my.id</p>
          <p>Nameservers: ns1.der.my.id, ns2.der.my.id</p>
        </CardContent>
      </Card>
    </>
  );
}
