import Link from "next/link";

import { PublicPage } from "@/components/site-shell";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const pages = [
  ["Terms", "/legal/terms"],
  ["Privacy", "/legal/privacy"],
  ["Acceptable use", "/legal/acceptable-use"],
  ["Domain policy", "/legal/domain-policy"],
  ["Domain rules", "/legal/domain-rules"],
  ["WHOIS policy", "/legal/whois-policy"],
  ["DNS policy", "/legal/dns-policy"],
  ["Abuse", "/legal/abuse"],
  ["Disclaimer", "/legal/disclaimer"],
  ["Cookies", "/legal/cookies"],
  ["Security", "/legal/security"],
  ["Refund", "/legal/refund"],
  ["Registrant agreement", "/legal/registrant-agreement"],
  [".my.id terms", "/legal/myid"],
  ["Registrar", "/legal/registrar"],
];

export default function LegalHomePage() {
  return (
    <PublicPage
      eyebrow="Legal"
      title="Policies and terms"
      description="A single place to review the domain policy, acceptable-use rules, and legal terms for the service."
      active="/legal"
    >
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {pages.map(([title, href]) => (
          <Link key={href} href={href}>
            <Card className="h-full transition-colors hover:bg-muted/20">
              <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>Review the related terms and requirements.</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </PublicPage>
  );
}
