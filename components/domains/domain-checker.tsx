import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const sampleNames = ["hello", "orbit", "studio", "notes", "pixel", "atlas"];

export function DomainSearchSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Availability search</CardTitle>
        <CardDescription>Try a label from a project, personal brand, or team identity.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input defaultValue="hello" placeholder="Type a domain label" className="h-10" />
          <Button className="sm:w-auto">Check</Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {sampleNames.map((name) => (
            <Link key={name} href="/register" className="rounded-full border border-border px-3 py-1.5 text-sm text-muted-foreground hover:text-foreground">
              {name}.der.my.id
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function DomainStatusSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Result</CardTitle>
        <CardDescription>Sample availability status</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-2xl font-semibold text-green-600">Available</p>
        <p className="mt-2 text-sm text-muted-foreground">hello.der.my.id is ready for registration or pending review.</p>
      </CardContent>
    </Card>
  );
}
