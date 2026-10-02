import { PublicPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsDomainsPage() {
  return (
    <PublicPage
      eyebrow="Docs"
      title="Domain lifecycle"
      description="Understand domain statuses, approval rules, ownership, and the flow from submission to activation."
      active="/docs"
    >
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
    </PublicPage>
  );
}
