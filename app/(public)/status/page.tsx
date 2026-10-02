import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Service health",
  description: "Operational status, ongoing maintenance updates, and platform availability for readers and operators.",
};

export default function StatusPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Status</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Service health</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Operational status, ongoing maintenance updates, and platform availability for readers and operators.</p>
      </section>
      <div className="grid gap-6 md:grid-cols-3">
        {[
          { title: "API", value: "Operational", detail: "99.99% availability" },
          { title: "DNS", value: "Healthy", detail: "No active incidents" },
          { title: "Registration flow", value: "Normal", detail: "Average response under two seconds" },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.value}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.detail}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
