import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: ".my.id terms", description: "The governing terms and policy for the registered domain service." };

export default function MyidPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Legal</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Myid</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">The governing terms and policy for the registered domain service.</p>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>Myid</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none text-sm text-muted-foreground">
          <p>These terms are provided as a concise reference for the service policy. Final legal language should be reviewed in the full published policy set and any contract governing the registration service.</p>
          <p>Use of the platform must comply with the service rules, including domain eligibility, acceptable use, and DNS policy requirements. Violations may lead to suspension, rejection, or revocation of a domain registration.</p>
          <p>Any operational changes to contact details, nameserver delegation, and account security remain the responsibility of the domain owner and the corresponding verified account holder.</p>
        </CardContent>
      </Card>
    </>
  );
}
