import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { ArrowRight, Globe2, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router";

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
    const [error, setError] = useState("");

    useEffect(() => {
        void loadDomainData()
            .then(({ domains: nextDomains, registrations: nextRegistrations }) => {
                setDomains(nextDomains);
                setRegistrations(nextRegistrations);
            })
            .catch((loadError: unknown) => {
                setError(loadError instanceof Error ? loadError.message : "Unable to load domain data.");
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
                    <Button asChild variant="outline">
                        <Link to="/dashboard/domains/moderation">
                            <ShieldCheck data-icon="inline-start" />
                            Moderation
                        </Link>
                    </Button>
                </div>
            </header>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Registration status</h2>
                </div>
                {registrations.length === 0 ? (
                    <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                        No registrations have been submitted yet.
                    </p>
                ) : registrations.map((registration) => (
                    <div key={registration.id} className="rounded-lg border bg-card p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="font-medium">{registration.hostname}</div>
                                <div className="text-sm text-muted-foreground">
                                    {registration.status === "pending" ? "Pending administrator review" : registration.status === "approved" ? "Approved and active" : "Rejected"}
                                </div>
                            </div>
                            <span className="inline-flex rounded-full border px-2 py-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                                {registration.status}
                            </span>
                        </div>
                        {registration.rejectedReason && (
                            <p className="mt-3 text-sm text-muted-foreground">Reason: {registration.rejectedReason}</p>
                        )}
                        {registration.notes && (
                            <p className="mt-2 text-sm text-muted-foreground">Purpose: {registration.notes}</p>
                        )}
                    </div>
                ))}
            </section>

            <section className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-lg font-medium">Active domains</h2>
                </div>
                {domains.length === 0 ? (
                    <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">
                        No active domains are associated with this account yet.
                    </p>
                ) : domains.map((domain) => (
                    <div key={domain.id} className="rounded-lg border bg-card p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <div className="font-medium">{domain.hostname}</div>
                                <div className="text-sm text-muted-foreground">DNS: {domain.dnsMode === "managed" ? "Service-managed" : "Custom nameservers"}</div>
                            </div>
                            <span className="inline-flex rounded-full border px-2 py-1 text-xs font-medium uppercase tracking-[0.12em] text-muted-foreground">
                                {domain.status}
                            </span>
                        </div>
                        {domain.customNameservers && (
                            <p className="mt-3 text-sm text-muted-foreground">Nameservers: {domain.customNameservers}</p>
                        )}
                    </div>
                ))}
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
