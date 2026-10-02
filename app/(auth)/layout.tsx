import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-muted/30 px-4 py-12">
      <div className="absolute left-0 top-0 h-1 w-full bg-primary" />
      <main className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-between gap-4">
          <Link className="text-lg font-bold" href="/">
            der.my.id
          </Link>
          <Link className="inline-flex items-center gap-2 text-sm text-muted-foreground" href="/">
            <ArrowLeft className="size-4" />
            Home
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}