import { DashboardPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function RequestsRequestPage({ params }: { params: Promise<{ request: string }> }) {
  const { request } = await params;

  return (
    <DashboardPage title="Request details" subtitle={`Request: ${request}`}>
      <Card>
        <CardHeader>
          <CardTitle>{request}</CardTitle>
          <CardDescription>Operational detail for this protected resource.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Ownership, authorization, and lifecycle checks are enforced server-side.</p>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
