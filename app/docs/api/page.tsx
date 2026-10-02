import { PublicPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsApiPage() {
  return (
    <PublicPage
      eyebrow="Docs"
      title="API reference"
      description="Overview of the OpenAPI-style endpoints and integration patterns for application automation."
      active="/docs"
    >
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
    </PublicPage>
  );
}
