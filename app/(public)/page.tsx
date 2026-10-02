import Link from "next/link";
import type { Metadata } from "next";

import { HomeFeatures } from "@/components/home/home-features";
import { HomeHero } from "@/components/home/home-hero";
import { HomeSteps } from "@/components/home/home-steps";
import { Button } from "@/components/ui/button";

export const revalidate = 300;
export const metadata: Metadata = {
  title: "Free domains for builders and communities",
  description: "Launch a clean, memorable online identity with a .der.my.id domain and a dashboard built for fast management.",
};

export default function Home() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Free domains for builders and communities</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Launch a clean, memorable online identity with a .der.my.id domain and a dashboard built for fast management.</p>
        <div className="mt-5 flex items-center gap-2">
        <>
          <Button asChild variant="outline">
            <Link href="/domains/check">Check a domain</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </>
        </div>
      </section>
      <HomeHero />
      <HomeFeatures />
      <HomeSteps />
    </>
  );
}
