import { PublicPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsDnsPage() {
  return (
    <PublicPage
      eyebrow="Docs"
      title="DNS and delegation"
      description="Review how shared DNS and custom delegated nameservers work in the service model."
      active="/docs"
    >
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Shared DNS</CardTitle>
            <CardDescription>Use the built-in der.my.id infrastructure for a simple, managed setup.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">DNS records are managed by the platform rather than stored in the application database.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Custom nameservers</CardTitle>
            <CardDescription>Use delegated nameservers to run your own DNS stack.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">The database stores the nameserver metadata while Cloudflare remains the source of truth for live DNS state.</p>
          </CardContent>
        </Card>
      </div>
    </PublicPage>
  );
}
