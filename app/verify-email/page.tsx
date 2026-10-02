import Link from "next/link";

import { PublicPage } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <PublicPage eyebrow="Account" title="Verify your email" description="Confirm your address to complete account setup and unlock domain features." active="/login">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Check your inbox</CardTitle>
            <CardDescription>We sent a verification link to your email address.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/verify-email/success">Continue to success</Link>
            </Button>
            <Link href="/verify-email/expired" className="text-sm text-muted-foreground hover:text-foreground">Expired link?</Link>
          </CardContent>
        </Card>
      </div>
    </PublicPage>
  );
}
