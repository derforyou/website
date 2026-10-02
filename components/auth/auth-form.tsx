import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthFormSection({
  title,
  description,
  primaryAction,
  secondary,
  children,
}: {
  title: string;
  description: string;
  primaryAction: string;
  secondary?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <Button className="w-full">{primaryAction}</Button>
        {secondary ? <div className="flex items-center justify-between text-sm text-muted-foreground">{secondary}</div> : null}
      </CardContent>
    </Card>
  );
}

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

export function AuthEmailField({ label = "Email address" }: { label?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">{label}</Label>
      <Input id="email" type="email" placeholder={label} />
    </div>
  );
}

export function AuthPasswordField({ label = "Password" }: { label?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">{label}</Label>
      <Input id="password" type="password" placeholder={label} />
    </div>
  );
}
