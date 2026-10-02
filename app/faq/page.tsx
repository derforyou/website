import { PublicPage } from "@/components/site-shell";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function FaqPage() {
  return (
    <PublicPage
      eyebrow="FAQ"
      title="Common questions"
      description="Answers to the most common questions about registration, DNS, and account management."
      active="/faq"
    >
      <div className="grid gap-6 md:grid-cols-2">
        {[
          { q: "Is the service really free?", a: "The .der.my.id space is designed for accessible registration and lightweight identity hosting under the service terms." },
          { q: "Can I use custom nameservers?", a: "Yes. Domains may move to delegated custom nameservers when the policy and operational flow allows it." },
          { q: "How long does approval take?", a: "Most registrations complete quickly, with status updated inside the dashboard as the review proceeds." },
          { q: "Can I update my contact details?", a: "Users can manage their profile and contact information from the account dashboard after sign-in." },
        ].map((item) => (
          <Card key={item.q}>
            <CardHeader>
              <CardTitle>{item.q}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{item.a}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </PublicPage>
  );
}
