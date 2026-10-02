import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function AuthSecuritySection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account protection</CardTitle>
        <CardDescription>Trusted security checks for your registration flow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <div className="rounded-lg border border-border bg-muted/30 p-3">Verified email required before domain requests are approved.</div>
        <div className="rounded-lg border border-border bg-muted/30 p-3">GitHub or email sign-in keeps the session tied to the verified account.</div>
        <div className="rounded-lg border border-border bg-muted/30 p-3">All admin changes are enforced server-side and audited.</div>
      </CardContent>
    </Card>
  );
}