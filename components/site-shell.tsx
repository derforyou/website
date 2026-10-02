import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[1.2fr_0.8fr_0.8fr_1fr] lg:px-8">
        <div>
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold tracking-[0.14em] text-foreground uppercase">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">d</span>
            der.my.id
          </div>
          <p className="max-w-xs text-sm text-muted-foreground">
            Free .der.my.id domains for developers, communities, and lightweight online identities.
          </p>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Explore</h3>
          <div className="space-y-2 text-sm text-foreground/80">
            <Link href="/domains" className="block hover:text-foreground">Domains</Link>
            <Link href="/docs" className="block hover:text-foreground">Documentation</Link>
            <Link href="/status" className="block hover:text-foreground">Status</Link>
            <Link href="/whois" className="block hover:text-foreground">WHOIS lookup</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Company</h3>
          <div className="space-y-2 text-sm text-foreground/80">
            <Link href="/about" className="block hover:text-foreground">About</Link>
            <Link href="/contact" className="block hover:text-foreground">Contact</Link>
            <Link href="/faq" className="block hover:text-foreground">FAQ</Link>
            <Link href="/legal" className="block hover:text-foreground">Legal</Link>
          </div>
        </div>

        <div>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.1em] text-muted-foreground">Policies</h3>
          <div className="space-y-2 text-sm text-foreground/80">
            <Link href="/legal/terms" className="block hover:text-foreground">Terms</Link>
            <Link href="/legal/privacy" className="block hover:text-foreground">Privacy</Link>
            <Link href="/legal/domain-policy" className="block hover:text-foreground">Domain policy</Link>
            <Link href="/legal/acceptable-use" className="block hover:text-foreground">Acceptable use</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function StatCard({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle>{value}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}
