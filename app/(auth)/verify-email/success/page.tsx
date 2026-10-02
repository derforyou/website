import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Email verified", description: "Your account is ready to manage domains and settings." };

export default function VerifyEmailSuccessPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Email verified</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Your account is ready to manage domains and settings.</p>
      </section>
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
    </>
  );
}
