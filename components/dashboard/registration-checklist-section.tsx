import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function RegistrationChecklistSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Before you submit</CardTitle>
        <CardDescription>Keep your domain request ready for the approval flow.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-muted-foreground">
        <p>• Confirm the label matches your project, brand, or identity.</p>
        <p>• Select shared DNS if you want a managed setup.</p>
        <p>• Use custom nameservers only when you need explicit delegation.</p>
        <Link href="/dashboard/domains" className="inline-flex text-primary">Return to domains →</Link>
      </CardContent>
    </Card>
  );
}