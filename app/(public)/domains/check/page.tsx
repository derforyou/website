import { DomainSearchSection, DomainStatusSection } from "@/components/domains/domain-checker";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Check your preferred label",
  description: "Search for a .der.my.id label to see whether it is available for registration or still pending review.",
};

export default function DomainCheckPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Domain check</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Check your preferred label</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Search for a .der.my.id label to see whether it is available for registration or still pending review.</p>
      </section>
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <DomainSearchSection />
        <DomainStatusSection />
      </div>
    </>
  );
}
