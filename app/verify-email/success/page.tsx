import Link from "next/link";

import { PublicPage } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function VerifyEmailSuccessPage() {
  return (
    <PublicPage eyebrow="Account" title="Email verified" description="Your account is ready to manage domains and settings." active="/login">
      <div className="mx-auto max-w-lg">
        <Card>
          <CardHeader>
            <CardTitle>Success</CardTitle>
            <CardDescription>Your email verification has been accepted.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </PublicPage>
  );
}
