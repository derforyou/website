import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthEmailField({ label = "Email address" }: { label?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="email">{label}</Label>
      <Input id="email" type="email" placeholder={label} />
    </div>
  );
}