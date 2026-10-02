import { DomainRegistrationFormSection, RegistrationChecklistSection } from "@/components/dashboard/domain-registration-form";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export const metadata: Metadata = { title: "New domain", description: "Request a new .der.my.id registration." };

export default function DashboardNewDomainPage() {
  return (
    <>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">New domain</h1>
          <p className="mt-2 text-base text-muted-foreground">Request a new .der.my.id registration.</p>
        </div>
        <Button asChild variant="outline">
          <Link href="/dashboard/domains">Back to domains</Link>
        </Button>
      </header>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <DomainRegistrationFormSection />
        <RegistrationChecklistSection />
      </div>
    </>
  );
}
