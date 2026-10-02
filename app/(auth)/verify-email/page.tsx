import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Verify your email", description: "Confirm your address to complete account setup and unlock domain features." };

export default function VerifyEmailPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Verify your email</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Confirm your address to complete account setup and unlock domain features.</p>
      </section>
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
    </>
  );
}
