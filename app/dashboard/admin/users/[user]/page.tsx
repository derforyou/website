import { DashboardPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminUserPage({ params }: { params: Promise<{ user: string }> }) {
  const { user } = await params;

  return (
    <DashboardPage title="User review" subtitle={`Admin user: ${user}`}>
      <Card>
        <CardHeader>
          <CardTitle>{user}</CardTitle>
          <CardDescription>Operational detail for this protected resource.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Ownership, authorization, and lifecycle checks are enforced server-side.</p>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
