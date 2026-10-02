import { PublicPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function DocsGettingStartedPage() {
  return (
    <PublicPage
      eyebrow="Docs"
      title="Getting started"
      description="A quick guide for registering a domain, managing your account, and monitoring your request status."
      active="/docs"
    >
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>1. Sign up</CardTitle>
            <CardDescription>Create an account with a verified email address.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Use your preferred account method and complete the email verification flow to unlock domain actions.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>2. Search for a label</CardTitle>
            <CardDescription>Check the availability of the domain name you want.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Use the availability checker to confirm whether the label is open and review any policy constraints.</p>
          </CardContent>
        </Card>
      </div>
    </PublicPage>
  );
}
