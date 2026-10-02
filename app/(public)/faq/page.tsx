import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Common questions",
  description: "Answers to the most common questions about registration, DNS, and account management.",
};

export default function FaqPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">FAQ</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Common questions</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Answers to the most common questions about registration, DNS, and account management.</p>
      </section>
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { q: "Is the service really free?", a: "The .der.my.id space is designed for accessible registration and lightweight identity hosting under the service terms." },
          { q: "Can I use custom nameservers?", a: "Yes. Domains may move to delegated custom nameservers when the policy and operational flow allows it." },
          { q: "How long does approval take?", a: "Most registrations complete quickly, with status updated inside the dashboard as the review proceeds." },
          { q: "Can I update my contact details?", a: "Users can manage their profile and contact information from the account dashboard after sign-in." },
        ].map((item) => (
          <Card key={item.q}>
            <CardHeader>
              <CardTitle>{item.q}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
