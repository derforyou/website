import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export function DomainRegistrationFormSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Register a domain</CardTitle>
        <CardDescription>Choose a label and confirm your desired DNS mode.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="domain-label">Domain label</Label>
          <Input id="domain-label" defaultValue="hello" placeholder="Label" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="dns-mode">DNS mode</Label>
          <Select defaultValue="shared">
            <SelectTrigger id="dns-mode" className="w-full">
              <SelectValue placeholder="Choose DNS mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="shared">Shared DNS</SelectItem>
              <SelectItem value="custom">Custom nameservers</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full">Submit request</Button>
      </CardContent>
    </Card>
  );
}