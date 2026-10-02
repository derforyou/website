import Link from "next/link";

import { PublicPage } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function ContactPage() {
  return (
    <PublicPage
      eyebrow="Contact"
      title="Get in touch"
      description="Need help with a registration, support issue, or policy question? Our team is here to assist."
      active="/contact"
      actions={
        <Button asChild>
          <Link href="mailto:hello@der.my.id">hello@der.my.id</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Questions about registration, DNS, or account access.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Email: hello@der.my.id</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Abuse and policy</CardTitle>
            <CardDescription>Report misuse, suspicious activity, or policy concerns.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Email: abuse@der.my.id</p>
          </CardContent>
        </Card>
      </div>
    </PublicPage>
  );
}
