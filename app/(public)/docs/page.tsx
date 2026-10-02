import Link from "next/link";
import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Developer and operator docs",
  description: "Reference material for domain registration, DNS, account setup, and API usage across the service.",
};

export default function DocsHomePage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Documentation</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Developer and operator docs</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Reference material for domain registration, DNS, account setup, and API usage across the service.</p>
      </section>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {[
          { title: "Getting started", href: "/docs/getting-started", description: "Set up your account and begin a new domain request." },
          { title: "Domains", href: "/docs/domains", description: "Review the lifecycle, ownership model, and approval flow." },
          { title: "DNS", href: "/docs/dns", description: "Understand shared DNS and custom delegation options." },
          { title: "API", href: "/docs/api", description: "Use the OpenAPI-oriented API for automation and integrations." },
        ].map((doc) => (
          <Link key={doc.href} href={doc.href}>
            <Card className="h-full transition-transform hover:-translate-y-0.5">
              <CardHeader>
                <CardTitle>{doc.title}</CardTitle>
                <CardDescription>{doc.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <span className="text-sm font-medium text-primary">Read more →</span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
