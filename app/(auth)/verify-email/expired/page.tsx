import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Verification expired", description: "Request a fresh verification email to continue." };

export default function VerifyEmailExpiredPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Verification expired</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Request a fresh verification email to continue.</p>
      </section>
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
    </>
  );
}
