import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PublicMobileMenu } from "@/components/public/public-mobile-menu";
import { publicNavigation } from "@/components/public/public-navigation";
import { ThemeToggle } from "@/components/public/theme-toggle";

export function PublicTopBar() {
  return (
    <header className="border-b bg-background/95">
      <div className="mx-auto flex min-h-16 w-full max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link className="shrink-0 text-lg font-bold tracking-tight" href="/">
          der.my.id
        </Link>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
          {publicNavigation.map((item) => (
            <Link
              className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              href={item.href}
              key={item.href}
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button asChild className="hidden sm:inline-flex">
            <Link href="/login">Sign in</Link>
          </Button>
          <div className="md:hidden">
            <PublicMobileMenu />
          </div>
        </div>
      </div>
    </header>
  );
}