import Link from "next/link";
import { ArrowRight, Globe2 } from "lucide-react";

import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="max-w-2xl">
        <p className="mb-5 inline-flex items-center gap-2 rounded-full bg-primary/15 px-3 py-1 text-sm font-medium text-foreground">
          <Globe2 className="size-4" />
          Your corner of the internet
        </p>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          A domain for every idea.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-8 text-muted-foreground">
          Claim a free name on der.my.id and give your project, portfolio, or
          community a home of its own.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/register">
              Get started <ArrowRight />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/about">How it works</Link>
          </Button>
        </div>
      </div>
      <div className="relative mx-auto w-full max-w-md" aria-label="Example domain">
        <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
          <p className="text-sm font-medium text-muted-foreground">Your new address</p>
          <p className="mt-3 break-all text-3xl font-bold sm:text-4xl">
            <span className="text-primary">yourname</span>.der.my.id
          </p>
          <div className="mt-8 grid grid-cols-3 gap-2 text-center text-xs text-muted-foreground sm:text-sm">
            <div className="rounded-lg bg-muted px-2 py-3">Choose a name</div>
            <div className="rounded-lg bg-muted px-2 py-3">Make it yours</div>
            <div className="rounded-lg bg-muted px-2 py-3">Go live</div>
          </div>
        </div>
        <div className="absolute -bottom-3 -right-3 -z-10 size-20 rounded-full bg-primary/20 blur-2xl" />
      </div>
    </section>
  );
}