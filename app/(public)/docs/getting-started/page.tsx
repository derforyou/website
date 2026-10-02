import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Getting started",
  description: "A quick guide for registering a domain, managing your account, and monitoring your request status.",
};

export default function DocsGettingStartedPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Docs</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Getting started</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">A quick guide for registering a domain, managing your account, and monitoring your request status.</p>
      </section>
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
    </>
  );
}
