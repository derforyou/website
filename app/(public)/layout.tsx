import type { ReactNode } from "react";

import { PublicFooter } from "@/components/public/public-footer";
import { PublicTopBar } from "@/components/public/public-top-bar";

export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <PublicTopBar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  );
}