import type { Metadata } from "next";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "API tokens",
  description: "Protected account area for domain operations and management.",
};

export default function ApiTokensPage() {
  return (
    <>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Api Tokens</h1>
        <p className="mt-2 text-base text-muted-foreground">Protected account area for domain operations and management.</p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Api Tokens</CardTitle>
          <CardDescription>Browse the current resource and take the next account action.</CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <p>This section is a route stub for the dashboard architecture and is ready to connect to the service layer.</p>
        </CardContent>
      </Card>
    </>
  );
}
