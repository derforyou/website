import Link from "next/link";

import { BrandIcon } from "@/components/brand-icon";
import { Button } from "@/components/ui/button";

const stats = [
  { label: "Domains active", value: "12.4k+" },
  { label: "Avg. approval", value: "< 1 min" },
  { label: "Uptime", value: "99.99%" },
];

export function HomeHero() {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-border bg-card">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.12),transparent_35%)]" />
      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_0.8fr] lg:p-12">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">Free domain registration</p>
          <h1 className="max-w-xl text-4xl font-semibold tracking-tight sm:text-5xl">
            Your next digital identity starts with a memorable .der.my.id domain.
          </h1>
          <p className="max-w-lg text-base text-muted-foreground sm:text-lg">
            Build a personal brand, project namespace, or community identity with a clean, secure, low-friction domain service.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/domains/check">Check availability</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/docs/getting-started">Read docs</Link>
            </Button>
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-2 text-sm text-muted-foreground">
            {[
              { label: "Cloudflare", name: "cloudflare" as const },
              { label: "GitHub", name: "github" as const },
              { label: "Resend", name: "resend" as const },
            ].map(({ label, name }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5">
                <BrandIcon name={name} />
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-2xl border border-border bg-muted/30 p-5">
              <p className="text-sm uppercase tracking-[0.14em] text-muted-foreground">{stat.label}</p>
              <p className="mt-2 text-3xl font-semibold tracking-tight">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}