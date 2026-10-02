import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Find a name that fits your identity",
  description: "Explore the service and the processes behind domain registration, DNS delegation, and ownership management.",
};

export default function DomainsPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Domains</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Find a name that fits your identity</h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Explore the service and the processes behind domain registration, DNS delegation, and ownership management.</p>
          </div>
          <Button asChild>
            <Link href="/domains/check">Check availability</Link>
          </Button>
        </div>
      </section>
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
    </>
  );
}
