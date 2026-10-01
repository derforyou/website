import { Button } from "@/components/ui/button";
import { Link, Outlet } from "react-router";

const legalLinks = [
    { label: "Privacy", to: "/legal/privacy" },
    { label: "Terms", to: "/legal/terms" },
    { label: "Acceptable use", to: "/legal/acceptable-use" },
    { label: "Domain policy", to: "/legal/domain-policy" },
    { label: "Report abuse", to: "/legal/abuse" },
];

export default function PublicLayout() {
    return (
        <div className="min-h-svh bg-background text-foreground">
            <header className="sticky top-0 z-20 border-b bg-background/95 backdrop-blur">
                <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-6 px-5 sm:px-8">
                    <Link to="/" className="flex shrink-0 items-center gap-2.5 font-semibold">
                        <img src="/logo.svg" alt="" className="size-8" />
                        <span>DERforyou</span>
                    </Link>
                    <nav aria-label="Main navigation" className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
                        <Link to="/legal/domain-policy" className="transition-colors hover:text-foreground">Domain policy</Link>
                        <Link to="/legal/acceptable-use" className="transition-colors hover:text-foreground">Acceptable use</Link>
                        <a href="mailto:hostmaster@der.my.id" className="transition-colors hover:text-foreground">Contact</a>
                    </nav>
                    <div className="flex shrink-0 items-center gap-2">
                        <Button asChild variant="ghost" size="sm">
                            <Link to="/auth/signin">Sign in</Link>
                        </Button>
                        <Button asChild size="sm">
                            <Link to="/auth/signup">Get started</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <Outlet />

            <footer className="border-t bg-muted/20">
                <div className="mx-auto flex w-full max-w-7xl flex-col gap-5 px-5 py-8 sm:px-8 md:flex-row md:items-center md:justify-between">
                    <div className="flex flex-col gap-1 text-sm">
                        <span className="font-medium">DERforyou</span>
                        <span className="text-muted-foreground">Developer subdomains and domain workspace</span>
                    </div>
                    <nav aria-label="Legal" className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted-foreground">
                        {legalLinks.map((item) => (
                            <Link key={item.to} to={item.to} className="transition-colors hover:text-foreground">
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </footer>
        </div>
    );
}