import { DashboardPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DomainsDomainPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;

  return (
    <DashboardPage title="Domain details" subtitle={`Domain: ${domain}`}>
      <Card>
        <CardHeader>
          <CardTitle>{domain}.der.my.id</CardTitle>
          <CardDescription>Operational detail for this protected resource.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Ownership, authorization, and lifecycle checks are enforced server-side.</p>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
