import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Domain lifecycle",
  description: "Understand domain statuses, approval rules, ownership, and the flow from submission to activation.",
};

export default function DocsDomainsPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Docs</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Domain lifecycle</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Understand domain statuses, approval rules, ownership, and the flow from submission to activation.</p>
      </section>
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Pending", description: "A domain request is submitted and awaiting processing." },
          { title: "Approved", description: "The domain has been accepted and is live under the service policy." },
          { title: "Rejected", description: "The submission does not meet the rules and was not accepted." },
        ].map((status) => (
          <Card key={status.title}>
            <CardHeader>
              <CardTitle>{status.title}</CardTitle>
              <CardDescription>{status.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
