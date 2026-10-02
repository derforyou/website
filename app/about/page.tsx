import Link from "next/link";

import { PublicPage } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AboutPage() {
  return (
    <PublicPage
      eyebrow="About"
      title="A cleaner home for your online name"
      description="der.my.id gives individuals and teams a straightforward way to claim a short, memorable domain backed by clear policies and a simple management experience."
      active="/about"
      actions={
        <Button asChild variant="outline">
          <Link href="/domains/check">Search domains</Link>
        </Button>
      }
    >
      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Built for identity", description: "Short, human-friendly domains for projects, portfolios, and communities." },
          { title: "Transparent policies", description: "Clear domain terms backed by open documentation and a straightforward review flow." },
          { title: "Operator-friendly", description: "A guided dashboard for status, submissions, DNS, and ownership management." },
        ].map((item) => (
          <Card key={item.title}>
            <CardHeader>
              <CardTitle>{item.title}</CardTitle>
              <CardDescription>{item.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </PublicPage>
  );
}
