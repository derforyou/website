import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "API reference",
  description: "Overview of the OpenAPI-style endpoints and integration patterns for application automation.",
};

export default function DocsApiPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Docs</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">API reference</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Overview of the OpenAPI-style endpoints and integration patterns for application automation.</p>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { title: "/api/health", description: "Basic service health check." },
          { title: "/api/openapi.json", description: "Generated API specification for tools and clients." },
          { title: "/api/docs", description: "Human-friendly API documentation page." },
          { title: "/api/v1", description: "Versioned resource namespace for authenticated client requests." },
        ].map((route) => (
          <Card key={route.title}>
            <CardHeader>
              <CardTitle>{route.title}</CardTitle>
              <CardDescription>{route.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </>
  );
}
