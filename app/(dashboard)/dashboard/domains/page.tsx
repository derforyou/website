import Link from "next/link";

import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Domains", description: "Review your registration and ownership lifecycle." };

export default function DashboardDomainsPage() {
  return (
    <>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Domains</h1>
          <p className="mt-2 text-base text-muted-foreground">Review your registration and ownership lifecycle.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/domains/new">New domain</Link>
        </Button>
      </header>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {[
          { name: "hello.der.my.id", status: "Approved", dns: "Shared" },
          { name: "studio.der.my.id", status: "Pending", dns: "Custom" },
          { name: "notes.der.my.id", status: "Rejected", dns: "Shared" },
        ].map((domain) => (
          <Card key={domain.name}>
            <CardHeader>
              <CardTitle>{domain.name}</CardTitle>
              <CardDescription>{domain.status}</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between text-sm text-muted-foreground">
              <span>{domain.dns}</span>
              <Link href={`/dashboard/domains/${encodeURIComponent(domain.name.replace('.der.my.id', ''))}`} className="text-primary">Open</Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
