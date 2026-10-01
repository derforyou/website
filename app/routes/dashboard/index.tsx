import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { ArrowRight, ArrowUpRight, ContactRound, Globe2, KeyRound } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router";

export default function DashboardPage() {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="mb-2 w-fit">Developer workspace</Badge>
                    <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
                    <p className="text-sm text-muted-foreground">
                        Manage domain registrations and developer access from one place.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/dashboard/domains/register">
                        Register domain
                        <ArrowUpRight data-icon="inline-end" />
                    </Link>
                </Button>
            </header>

            <section aria-labelledby="domain-overview-title" className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                        <h2 id="domain-overview-title" className="text-base font-semibold">
                            Domain inventory
                        </h2>
                        <p className="text-sm text-muted-foreground">
                            Domain records associated with this workspace.
                        </p>
                    </div>
                    <Button asChild variant="ghost" size="sm">
                        <Link to="/dashboard/domains">
                            View domains
                            <ArrowUpRight data-icon="inline-end" />
                        </Link>
                    </Button>
                </div>
                <Empty className="min-h-64 rounded-lg border bg-card px-6 py-10">
                    <EmptyHeader>
                        <EmptyMedia variant="icon"><Globe2 /></EmptyMedia>
                        <EmptyTitle>No domain records to show</EmptyTitle>
                        <EmptyDescription>
                            Domain records will appear here when they are available for this workspace.
                        </EmptyDescription>
                    </EmptyHeader>
                    <EmptyContent>
                        <Button asChild variant="outline">
                            <Link to="/dashboard/domains/register">Start a registration</Link>
                        </Button>
                    </EmptyContent>
                </Empty>
            </section>

            <section aria-labelledby="developer-workspace-title" className="flex flex-col gap-4">
                <div>
                    <h2 id="developer-workspace-title" className="text-base font-semibold">
                        Developer workspace
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Configure identity and API access for your domain workflows.
                    </p>
                </div>
                <div className="grid gap-2 md:grid-cols-3">
                    <QuickLink
                        href="/dashboard/domains"
                        icon={<Globe2 />}
                        title="Domains"
                        description="Review the domain inventory."
                    />
                    <QuickLink
                        href="/dashboard/settings/api-keys"
                        icon={<KeyRound />}
                        title="API keys"
                        description="Manage integration credentials."
                    />
                    <QuickLink
                        href="/dashboard/settings/contact"
                        icon={<ContactRound />}
                        title="Contact profile"
                        description="Review registration contact details."
                    />
                </div>
            </section>
        </div>
    );
}

function QuickLink({
    href,
    icon,
    title,
    description,
}: {
    href: string;
    icon: ReactNode;
    title: string;
    description: string;
}) {
    return (
        <Link
            to={href}
            className="group flex min-h-24 items-start gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent"
        >
            <span className="mt-0.5 text-muted-foreground group-hover:text-foreground">{icon}</span>
            <span className="flex min-w-0 flex-1 flex-col gap-1">
                <span className="font-medium">{title}</span>
                <span className="text-sm text-muted-foreground">{description}</span>
            </span>
            <ArrowRight className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
        </Link>
    );
}
