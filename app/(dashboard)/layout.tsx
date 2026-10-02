import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { default: "Dashboard", template: "%s | Dashboard | der.my.id" },
};

const navigation = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/domains", label: "Domains" },
  { href: "/dashboard/requests", label: "Requests" },
  { href: "/dashboard/api-tokens", label: "API tokens" },
  { href: "/dashboard/security", label: "Security" },
  { href: "/dashboard/settings", label: "Settings" },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary">Dashboard</p>
          <nav className="flex flex-wrap gap-2">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md border border-border bg-card px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</main>
    </div>
  );
}