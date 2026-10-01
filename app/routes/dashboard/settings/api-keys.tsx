import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from "@/components/ui/empty";
import { KeyRound } from "lucide-react";

export default function ApiKeysPage() {
    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">API keys</h1>
                <p className="text-sm text-muted-foreground">
                    Credentials for applications that integrate with DERforyou.
                </p>
            </header>
            <Empty className="min-h-80 rounded-lg border bg-card px-6 py-12">
                <EmptyHeader>
                    <EmptyMedia variant="icon"><KeyRound /></EmptyMedia>
                    <EmptyTitle>API key management is not connected yet</EmptyTitle>
                    <EmptyDescription>
                        No key records are loaded for this workspace. Key creation, revocation, and usage tracking will appear here when the API is available.
                    </EmptyDescription>
                </EmptyHeader>
            </Empty>
        </div>
    );
}
