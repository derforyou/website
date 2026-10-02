import { DomainRegistrationFormSection, RegistrationChecklistSection } from "@/components/dashboard/domain-registration-form";
import { DashboardPage } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardNewDomainPage() {
  return (
    <DashboardPage
      title="New domain"
      subtitle="Request a new .der.my.id registration."
      actions={
        <Button asChild variant="outline">
          <Link href="/dashboard/domains">Back to domains</Link>
        </Button>
      }
    >
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <DomainRegistrationFormSection />
        <RegistrationChecklistSection />
      </div>
    </DashboardPage>
  );
}
