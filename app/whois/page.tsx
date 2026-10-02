import Link from "next/link";

import { PublicPage } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function WhoisPage() {
  return (
    <PublicPage
      eyebrow="WHOIS"
      title="Look up public registration details"
      description="Search for a registered domain to view the public metadata available under the service policy and privacy guidelines."
      active="/whois"
      actions={
        <Button asChild variant="outline">
          <Link href="/legal/whois-policy">Read policy</Link>
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>WHOIS lookup</CardTitle>
          <CardDescription>Search for a domain name and review the public contact metadata available under policy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              className="h-10"
              placeholder="example.der.my.id"
              defaultValue="example.der.my.id"
            />
            <Button asChild>
              <Link href="/whois/example.der.my.id">Search</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Public output is limited to the information permitted by our WHOIS policy.</p>
        </CardContent>
      </Card>
    </PublicPage>
  );
}
