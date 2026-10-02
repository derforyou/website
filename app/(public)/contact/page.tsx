import Link from "next/link";
import type { Metadata } from "next";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Get in touch",
  description: "Need help with a registration, support issue, or policy question? Our team is here to assist.",
};

export default function ContactPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Contact</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Get in touch</h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Need help with a registration, support issue, or policy question? Our team is here to assist.</p>
          </div>
          <Button asChild>
            <Link href="mailto:hello@der.my.id">hello@der.my.id</Link>
          </Button>
        </div>
      </section>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Support</CardTitle>
            <CardDescription>Questions about registration, DNS, or account access.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Email: hello@der.my.id</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Abuse and policy</CardTitle>
            <CardDescription>Report misuse, suspicious activity, or policy concerns.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">Email: abuse@der.my.id</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
