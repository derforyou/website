import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const navigation = [
  { href: "/about", label: "About" },
  { href: "/domains", label: "Domains" },
  { href: "/status", label: "Status" },
  { href: "/docs", label: "Docs" },
  { href: "/whois", label: "WHOIS" },
  { href: "/faq", label: "FAQ" },
  { href: "/dashboard", label: "Dashboard" },
];

export function SiteHeader({ active }: { active?: string }) {
  return (
    <header className="border-b border-border/80 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3 text-sm font-semibold tracking-[0.14em] text-foreground uppercase">
          <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-sm">
            d
          </span>
          der.my.id
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const isActive = active === item.href || (active && item.href !== "/" && active.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/80 hover:text-foreground",
                ].join(" ")}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm">
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/register">Create account</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}

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

export function PublicPage({
  eyebrow,
  title,
  description,
  children,
  actions,
  active,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: React.ReactNode;
  actions?: React.ReactNode;
  active?: string;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader active={active} />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <section className="mb-10 flex flex-col gap-5 border-b border-border pb-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              {eyebrow ? (
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">{eyebrow}</p>
              ) : null}
              <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{title}</h1>
            </div>
            {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
          </div>
          {description ? <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">{description}</p> : null}
        </section>
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}

export function DashboardPage({
  title,
  subtitle,
  actions,
  children,
}: {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  children: React.ReactNode;
}) {
  const nav = [
    { href: "/dashboard", label: "Overview" },
    { href: "/dashboard/domains", label: "Domains" },
    { href: "/dashboard/requests", label: "Requests" },
    { href: "/dashboard/api-tokens", label: "API tokens" },
    { href: "/dashboard/security", label: "Security" },
    { href: "/dashboard/settings", label: "Settings" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Dashboard</p>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          </div>
          <div className="flex items-center gap-2">{actions}</div>
        </div>
        <nav className="mx-auto flex max-w-7xl flex-wrap gap-2 px-4 pb-4 sm:px-6 lg:px-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {subtitle ? <p className="mb-6 text-base text-muted-foreground">{subtitle}</p> : null}
        {children}
      </main>
    </div>
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
