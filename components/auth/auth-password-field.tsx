import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AuthPasswordField({ label = "Password" }: { label?: string }) {
  return (
    <div className="space-y-2">
      <Label htmlFor="password">{label}</Label>
      <Input id="password" type="password" placeholder={label} />
    </div>
  );
}