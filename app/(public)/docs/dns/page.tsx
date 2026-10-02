import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "DNS and delegation",
  description: "Review how shared DNS and custom delegated nameservers work in the service model.",
};

export default function DocsDnsPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Docs</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">DNS and delegation</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Review how shared DNS and custom delegated nameservers work in the service model.</p>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shared DNS</CardTitle>
            <CardDescription>Use the built-in der.my.id infrastructure for a simple, managed setup.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">DNS records are managed by the platform rather than stored in the application database.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Custom nameservers</CardTitle>
            <CardDescription>Use delegated nameservers to run your own DNS stack.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">The database stores the nameserver metadata while Cloudflare remains the source of truth for live DNS state.</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
