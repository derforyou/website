import { Button } from "@/components/ui/button";
import {
    Empty,
    EmptyContent,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { FolderOpen, Globe2 } from "lucide-react";
import { Link } from "react-router";

export default function DomainsPage() {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Domains</h1>
                    <p className="text-sm text-muted-foreground">
                        Review and register domains associated with your workspace.
                    </p>
                </div>
                <Button asChild>
                    <Link to="/dashboard/domains/register">
                        <Globe2 data-icon="inline-start" />
                        Register domain
                    </Link>
                </Button>
            </header>

            <Empty className="min-h-80 rounded-lg border bg-card px-6 py-12">
                <EmptyHeader>
                    <EmptyMedia variant="icon"><FolderOpen /></EmptyMedia>
                    <EmptyTitle>No domain records to show</EmptyTitle>
                    <EmptyDescription>
                        When registry data is connected to this workspace, your domains and their status will appear here.
                    </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                    <Button asChild variant="outline">
                        <Link to="/dashboard/domains/register">Open registration</Link>
                    </Button>
                </EmptyContent>
            </Empty>
        </div>
    );
}
