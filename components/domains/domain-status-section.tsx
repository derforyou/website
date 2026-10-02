import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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