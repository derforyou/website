import { ArrowRight, ContactRound, KeyRound, UserRound } from "lucide-react";
import { Link } from "react-router";

const settingsItems = [
    {
        title: "Account",
        href: "/dashboard/settings/account",
        icon: UserRound,
        description: "Profile details and account preferences.",
    },
    {
        title: "Contact profile",
        href: "/dashboard/settings/contact",
        icon: ContactRound,
        description: "Contact details prepared for domain registration.",
    },
    {
        title: "API keys",
        href: "/dashboard/settings/api-keys",
        icon: KeyRound,
        description: "Integration credentials for developer workflows.",
    },
];

export default function SettingsPage() {
    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
                <p className="text-sm text-muted-foreground">
                    Manage the identity and developer access associated with this workspace.
                </p>
            </header>
            <nav aria-label="Settings" className="divide-y border-y">
                {settingsItems.map(({ title, href, icon: Icon, description }) => (
                    <Link
                        key={href}
                        to={href}
                        className="group flex min-h-20 items-center gap-4 py-4 transition-colors hover:bg-muted/40"
                    >
                        <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-card text-muted-foreground group-hover:text-foreground">
                            <Icon />
                        </span>
                        <span className="flex min-w-0 flex-1 flex-col gap-1">
                            <span className="font-medium">{title}</span>
                            <span className="text-sm text-muted-foreground">{description}</span>
                        </span>
                        <ArrowRight className="size-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                    </Link>
                ))}
            </nav>
        </div>
    );
}
