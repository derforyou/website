import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router";

const navItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Domains", href: "/domains" },
  { label: "Register", href: "/domains/register" },
  { label: "Settings", href: "/settings" },
];

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-lg font-semibold">
            DER
          </Link>
          <nav className="hidden items-center gap-6 md:flex">
            {navItems.map((item) => (
              <Link key={item.href} to={item.href} className="text-sm text-muted-foreground transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-3">
            <Link to="/auth/signin">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/auth/signup">
              <Button size="sm">Join</Button>
            </Link>
          </div>
        </div>
      </header>
      <Outlet />
    </div>
  );
}
