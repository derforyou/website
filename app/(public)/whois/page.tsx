import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export const metadata: Metadata = {
  title: "Look up public registration details",
  description: "Search for a registered domain to view the public metadata available under the service policy and privacy guidelines.",
};

export default function WhoisPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">WHOIS</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Look up public registration details</h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Search for a registered domain to view the public metadata available under the service policy and privacy guidelines.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/legal/whois-policy">Read policy</Link>
          </Button>
        </div>
      </section>
      <Card>
        <CardHeader>
          <CardTitle>WHOIS lookup</CardTitle>
          <CardDescription>Search for a domain name and review the public contact metadata available under policy.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Input
              className="h-10"
              placeholder="example.der.my.id"
              defaultValue="example.der.my.id"
            />
            <Button asChild>
              <Link href="/whois/example.der.my.id">Search</Link>
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">Public output is limited to the information permitted by our WHOIS policy.</p>
        </CardContent>
      </Card>
    </>
  );
}
