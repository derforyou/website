import Link from "next/link";

import { Button } from "@/components/ui/button";
import { AuthSection } from "@/components/auth/auth-section";

export function AuthNotice({
  title,
  description,
  href,
  action,
}: {
  title: string;
  description: string;
  href: string;
  action: string;
}) {
  return (
    <AuthSection description={description} title={title}>
      <div className="grid gap-4">
        <Button asChild>
          <Link href={href}>{action}</Link>
        </Button>
        <Link className="text-center text-sm underline underline-offset-4" href="/">
          Return to der.my.id
        </Link>
      </div>
    </AuthSection>
  );
}