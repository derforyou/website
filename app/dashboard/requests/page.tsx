import { DashboardPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function RequestsPage() {
  return (
    <DashboardPage title="Requests" subtitle="Protected account area for domain operations and management.">
      <Card>
        <CardHeader>
          <CardTitle>Requests</CardTitle>
          <CardDescription>Browse the current resource and take the next account action.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>This section is a route stub for the dashboard architecture and is ready to connect to the service layer.</p>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
