import { Link, Outlet } from "react-router";

export default function AuthLayout() {
    return (
        <div className="min-h-svh bg-background text-foreground">
            <header className="flex h-16 items-center justify-between border-b px-5 sm:px-8">
                <Link to="/dashboard" className="flex items-center gap-2 font-semibold">
                    <span className="flex size-8 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">
                        D
                    </span>
                    <span>DER</span>
                </Link>
                <Link
                    to="/dashboard"
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                    Back to workspace
                </Link>
            </header>
            <main className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-10">
                <Outlet />
            </main>
        </div>
    );
}