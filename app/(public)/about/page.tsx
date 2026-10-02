import Link from "next/link";
import type { Metadata } from "next";

import { AboutPillarsSection } from "@/components/about/about-pillars-section";
import { AboutWorkflowSection } from "@/components/about/about-workflow-section";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "A cleaner home for your online name",
  description: "der.my.id gives individuals and teams a straightforward way to claim a short, memorable domain backed by clear policies and a simple management experience.",
};

export default function AboutPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">About</p>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">A cleaner home for your online name</h1>
            <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">der.my.id gives individuals and teams a straightforward way to claim a short, memorable domain backed by clear policies and a simple management experience.</p>
          </div>
          <Button asChild variant="outline">
            <Link href="/domains/check">Search domains</Link>
          </Button>
        </div>
      </section>
      <AboutPillarsSection />
      <AboutWorkflowSection />
    </>
  );
}
