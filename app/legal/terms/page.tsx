import { PublicPage } from "@/components/site-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <PublicPage
      eyebrow="Legal"
      title="Terms"
      description="The governing terms and policy for the registered domain service."
      active="/legal"
    >
      <Card>
        <CardHeader>
          <CardTitle>Terms</CardTitle>
        </CardHeader>
        <CardContent className="prose prose-slate max-w-none text-sm text-muted-foreground">
          <p>These terms are provided as a concise reference for the service policy. Final legal language should be reviewed in the full published policy set and any contract governing the registration service.</p>
          <p>Use of the platform must comply with the service rules, including domain eligibility, acceptable use, and DNS policy requirements. Violations may lead to suspension, rejection, or revocation of a domain registration.</p>
          <p>Any operational changes to contact details, nameserver delegation, and account security remain the responsibility of the domain owner and the corresponding verified account holder.</p>
        </CardContent>
      </Card>
    </PublicPage>
  );
}
