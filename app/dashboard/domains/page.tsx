import Link from "next/link";

import { DashboardPage } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DashboardDomainsPage() {
  return (
    <DashboardPage
      title="Domains"
      subtitle="Review your registration and ownership lifecycle."
      actions={
        <Button asChild>
          <Link href="/dashboard/domains/new">New domain</Link>
        </Button>
      }
    >
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
    </DashboardPage>
  );
}
