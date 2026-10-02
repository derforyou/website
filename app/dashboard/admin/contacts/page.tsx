import { DashboardPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdmincontactsPage() {
  return (
    <DashboardPage title="Admincontacts" subtitle="Administrative view for service operators.">
      <Card>
        <CardHeader>
          <CardTitle>Admincontacts</CardTitle>
          <CardDescription>Admin-only area for moderation, policies, and operational review.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>Only verified administrators can access this surface. Every action is still enforced server-side.</p>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
