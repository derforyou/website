import { DomainStatusBadge } from "@/components/domain-status-badge";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { ArrowRight, Globe2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

type DomainRecord = {
    id: string;
    hostname: string;
    status: "active" | "suspended";
    dnsMode: "managed" | "custom";
    customNameservers: string | null;
    dnsSyncStatus: string;
    createdAt: string;
};

type RegistrationRecord = {
    id: string;
    hostname: string;
    status: "pending" | "approved" | "rejected";
    dnsMode: "managed" | "custom";
    customNameservers: string | null;
    notes: string | null;
    rejectedReason: string | null;
    decisionAt: string | null;
    createdAt: string;
};

function nameserverList(value: string | null) {
    if (!value) return [];
    try {
        const parsed: unknown = JSON.parse(value);
        if (Array.isArray(parsed)) return parsed.filter((entry): entry is string => typeof entry === "string");
    } catch {
        // Existing registrations stored comma-separated nameservers.
    }
    return value.split(",").map((entry) => entry.trim()).filter(Boolean);
}

async function loadDomainData() {
    const response = await fetch("/api/v1/domains");
    const result = await response.json() as { data?: { domains?: DomainRecord[]; registrations?: RegistrationRecord[] }; detail?: string };
    if (!response.ok) throw new Error(result.detail ?? "Unable to load domain data.");
    return {
        domains: result.data?.domains ?? [],
        registrations: result.data?.registrations ?? [],
    };
}

export default function DomainsPage() {
    const [domains, setDomains] = useState<DomainRecord[]>([]);
    const [registrations, setRegistrations] = useState<RegistrationRecord[]>([]);
    const [canAccessModeration, setCanAccessModeration] = useState(false);

    useEffect(() => {
        void loadDomainData()
            .then(({ domains: nextDomains, registrations: nextRegistrations }) => {
                setDomains(nextDomains);
                setRegistrations(nextRegistrations);
            })
            .catch((loadError: unknown) => {
                toast.error(loadError instanceof Error ? loadError.message : "Unable to load domain data.");
            });

        void fetch("/api/v1/domains/moderation", { method: "GET" })
            .then((response) => {
                setCanAccessModeration(response.ok);
            })
            .catch(() => {
                setCanAccessModeration(false);
            });
    }, []);

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div className="flex flex-col gap-1">
                    <h1 className="text-2xl font-semibold tracking-tight">Domains</h1>
                    <p className="text-sm text-muted-foreground">
                        Review your active hostnames and track administrators' approval decisions.
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button asChild>
                        <Link to="/dashboard/domains/register">
                            <Globe2 data-icon="inline-start" />
                            Register domain
                        </Link>
                    </Button>
                    {canAccessModeration && (
                        <Button asChild variant="outline">
                            <Link to="/dashboard/domains/moderation">
                                <ShieldCheck data-icon="inline-start" />
                                Moderation
                            </Link>
                        </Button>
                    )}
                </div>
            </header>

            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-medium">Registration status</h2>
                {registrations.length === 0 ? (
                    <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                        No registrations have been submitted yet.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Hostname</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>DNS mode</TableHead>
                                <TableHead>Details</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {registrations.map((registration) => (
                                <TableRow key={registration.id}>
                                    <TableCell className="font-medium">{registration.hostname}</TableCell>
                                    <TableCell><DomainStatusBadge status={registration.status} /></TableCell>
                                    <TableCell>{registration.dnsMode === "managed" ? "Managed" : "Custom NS"}</TableCell>
                                    <TableCell className="max-w-sm whitespace-normal text-muted-foreground">
                                        {registration.rejectedReason ?? registration.notes ?? (registration.status === "pending" ? "Awaiting administrator review" : "No additional details")}
                                        {registration.customNameservers && <div className="mt-1 break-all">NS: {nameserverList(registration.customNameservers).join(", ")}</div>}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </section>

            <section className="flex flex-col gap-4">
                <h2 className="text-lg font-medium">Active domains</h2>
                {domains.length === 0 ? (
                    <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                        No active domains are associated with this account yet.
                    </p>
                ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Hostname</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>DNS mode</TableHead>
                                <TableHead>Sync</TableHead>
                                <TableHead className="text-right">Management</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {domains.map((domain) => (
                                <TableRow key={domain.id}>
                                    <TableCell className="font-medium">{domain.hostname}</TableCell>
                                    <TableCell><DomainStatusBadge status={domain.status} /></TableCell>
                                    <TableCell>
                                        <DomainStatusBadge status={domain.dnsMode} />
                                        {domain.customNameservers && <div className="mt-1 max-w-sm whitespace-normal break-all text-xs text-muted-foreground">{nameserverList(domain.customNameservers).join(", ")}</div>}
                                    </TableCell>
                                    <TableCell><DomainStatusBadge status={domain.dnsSyncStatus} /></TableCell>
                                    <TableCell className="text-right">
                                        <Button asChild size="sm" variant="outline">
                                            <Link to={`/dashboard/domains/${encodeURIComponent(domain.id)}`}>Manage</Link>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                )}
            </section>

            <div className="flex items-center justify-end pt-2">
                <Button asChild variant="outline">
                    <Link to="/dashboard/domains/register">
                        Request another hostname
                        <ArrowRight data-icon="inline-start" />
                    </Link>
                </Button>
            </div>
        </div>
    );
}
