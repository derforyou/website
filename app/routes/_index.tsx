import { ArrowRight, ArrowUpRight, Globe2, KeyRound, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

export default function Index() {
  return (
    <main>
      <section className="mx-auto grid w-full max-w-7xl gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[minmax(0,1.1fr)_minmax(20rem,0.9fr)] lg:items-center lg:gap-16 lg:py-24">
        <div className="flex flex-col items-start gap-7">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="" className="size-10" />
            <div className="flex flex-col leading-tight">
              <span className="font-semibold">DERforyou</span>
              <span className="text-xs text-muted-foreground">Developer domains</span>
            </div>
          </div>
          <div className="flex flex-col items-start gap-5">
            <p className="text-sm font-medium text-primary">Free subdomains for developers</p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              Give your next project a place on the web.
            </h1>
            <p className="max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
              Get a developer-friendly subdomain and manage your domain workspace from one place.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/auth/signup"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Create account
              <ArrowRight data-icon="inline-end" />
            </Link>
            <Link
              to="/legal/domain-policy"
              className="inline-flex h-10 items-center justify-center gap-2 rounded-md border bg-background px-4 text-sm font-medium transition-colors hover:bg-accent"
            >
              Domain policy
              <ArrowUpRight data-icon="inline-end" />
            </Link>
          </div>
          <p className="max-w-lg text-xs leading-5 text-muted-foreground">
            Domain availability, eligibility, and continued use are subject to the service terms and domain policy.
          </p>
        </div>

        <div className="relative flex min-h-72 flex-col justify-between overflow-hidden rounded-lg border bg-card p-6 sm:min-h-80 sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b pb-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <Globe2 className="size-4 text-primary" />
              Domain workspace
            </div>
            <span className="rounded-full border px-2.5 py-1 text-xs text-muted-foreground">DER</span>
          </div>
          <div className="flex flex-col gap-4 py-8">
            <p className="text-sm text-muted-foreground">Example hostname</p>
            <p className="break-all font-mono text-2xl font-semibold tracking-normal sm:text-3xl">
              project.der.my.id
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Use a clear hostname for demos, tools, and personal projects.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t pt-4 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2"><ShieldCheck className="size-4" /> Policy-led access</span>
            <span className="inline-flex items-center gap-2"><KeyRound className="size-4" /> Developer workspace</span>
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30">
        <div className="mx-auto grid w-full max-w-7xl divide-y px-5 sm:px-8 md:grid-cols-3 md:divide-x md:divide-y-0">
          <LandingFeature
            title="One domain workspace"
            description="Keep domain inventory and account settings together as the service grows."
          />
          <LandingFeature
            title="Built for projects"
            description="Use a memorable subdomain for development, demos, and personal tools."
          />
          <LandingFeature
            title="Clear service rules"
            description="Review privacy, acceptable use, and domain policies before registering."
          />
        </div>
      </section>

      <section className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-14 sm:px-8 sm:py-16">
        <h2 className="text-xl font-semibold tracking-tight">A straightforward way to get started</h2>
        <div className="grid gap-6 border-t pt-6 md:grid-cols-3">
          <Step number="01" title="Create an account" description="Sign in with email verification. GitHub sign-in is available when enabled." />
          <Step number="02" title="Review the rules" description="Read the domain policy and acceptable-use requirements before requesting a name." />
          <Step number="03" title="Manage your workspace" description="Use the workspace to review domains, profile settings, and developer access." />
        </div>
      </section>
    </main>
  );
}

function LandingFeature({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2 py-6 md:px-6 md:first:pl-0 md:last:pr-0">
      <h2 className="font-medium">{title}</h2>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}

function Step({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="flex flex-col gap-2">
      <span className="font-mono text-xs text-muted-foreground">{number}</span>
      <h3 className="font-medium">{title}</h3>
      <p className="text-sm leading-6 text-muted-foreground">{description}</p>
    </div>
  );
}
