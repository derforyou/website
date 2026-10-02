import { PublicPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function StatusPage() {
  return (
    <PublicPage
      eyebrow="Status"
      title="Service health"
      description="Operational status, ongoing maintenance updates, and platform availability for readers and operators."
      active="/status"
    >
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
    </PublicPage>
  );
}
