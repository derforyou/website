import Link from "next/link";

import { PublicPage } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailExpiredPage() {
  return (
    <PublicPage eyebrow="Account" title="Verification expired" description="Request a fresh verification email to continue." active="/login">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Link expired</CardTitle>
            <CardDescription>Your verification link has expired or is no longer valid.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button asChild className="w-full">
              <Link href="/verify-email">Send a new link</Link>
            </Button>
            <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">Back to sign in</Link>
          </CardContent>
        </Card>
      </div>
    </PublicPage>
  );
}
