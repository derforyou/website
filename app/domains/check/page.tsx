import { DomainSearchSection, DomainStatusSection } from "@/components/domains/domain-checker";
import { PublicPage } from "@/components/site-shell";

export default function DomainCheckPage() {
  return (
    <PublicPage
      eyebrow="Domain check"
      title="Check your preferred label"
      description="Search for a .der.my.id label to see whether it is available for registration or still pending review."
      active="/domains/check"
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <DomainSearchSection />
        <DomainStatusSection />
      </div>
    </PublicPage>
  );
}
