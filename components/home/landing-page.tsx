import Link from "next/link";
import { SiCloudflare, SiGithub, SiResend } from "@icons-pack/react-simple-icons";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Free .der.my.id names",
    description: "Launch a lightweight identity with a memorable domain that fits your project, profile, or portfolio.",
  },
  {
    title: "Fast DNS onboarding",
    description: "Use the shared DNS stack or transition to custom nameservers with a clear, guided workflow.",
  },
  {
    title: "Simple management",
    description: "Monitor approvals, WHOIS data, and domain requests from one dashboard built for operators.",
  },
];

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
              { label: "Cloudflare", Icon: SiCloudflare },
              { label: "GitHub", Icon: SiGithub },
              { label: "Resend", Icon: SiResend },
            ].map(({ label, Icon }) => (
              <div key={label} className="flex items-center gap-2 rounded-full border border-border bg-background/70 px-3 py-1.5">
                <Icon size={14} />
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

export function HomeFeatures() {
  return (
    <section className="mt-12">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Why teams choose der.my.id</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Fast, simple, and built for real online identities.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-16 rounded-full bg-primary/70" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}

export function HomeSteps() {
  return (
    <section className="mt-12 grid gap-5 lg:grid-cols-3">
      {[
        { step: "01", title: "Check availability", text: "Search for the label that matches your identity, username, or project." },
        { step: "02", title: "Create an account", text: "Use email or GitHub sign-in and verify your address to continue." },
        { step: "03", title: "Manage and publish", text: "Adjust DNS, track status, and keep your domain aligned with your workflow." },
      ].map((item) => (
        <Card key={item.step} className="bg-muted/20">
          <CardHeader>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{item.step}</p>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.text}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}
