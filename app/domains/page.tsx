import Link from "next/link";

import { PublicPage } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DomainsPage() {
  return (
    <PublicPage
      eyebrow="Domains"
      title="Find a name that fits your identity"
      description="Explore the service and the processes behind domain registration, DNS delegation, and ownership management."
      active="/domains"
      actions={
        <Button asChild>
          <Link href="/domains/check">Check availability</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Shared DNS", description: "Use the standard der.my.id nameservers for a low-maintenance setup." },
          { title: "Custom delegation", description: "Move to custom nameservers when you need a more advanced DNS structure." },
          { title: "WHOIS visibility", description: "Review and understand the public registration metadata available under policy." },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PublicPage>
  );
}
