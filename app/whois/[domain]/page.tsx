import { PublicPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function DomainWhoisPage({ params }: { params: Promise<{ domain: string }> }) {
  const { domain } = await params;

  return (
    <PublicPage
      eyebrow="WHOIS"
      title={`${domain}`}
      description="Public registration details for this domain, displayed according to the service WHOIS policy."
      active="/whois"
    >
      <Card>
        <CardHeader>
          <CardTitle>Domain record</CardTitle>
          <CardDescription>Example output for a registered .der.my.id domain.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>Domain: {domain}</p>
          <p>Status: active</p>
          <p>Registrar: der.my.id</p>
          <p>Nameservers: ns1.der.my.id, ns2.der.my.id</p>
        </CardContent>
      </Card>
    </PublicPage>
  );
}
