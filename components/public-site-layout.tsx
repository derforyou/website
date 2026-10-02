import { SiteFooter } from "@/components/site-shell";
import { SiteHeader } from "@/components/site-header";

export function PublicSiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">{children}</main>
      <SiteFooter />
    </div>
  );
}