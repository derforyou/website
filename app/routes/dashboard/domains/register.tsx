import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Globe2 } from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { toast } from "sonner";

type AvailabilityState = {
    state: "idle" | "checking" | "available" | "unavailable";
    message: string;
};

export default function RegisterDomainPage() {
    const [subdomain, setSubdomain] = useState("");
    const [notes, setNotes] = useState("");
    const [dnsMode, setDnsMode] = useState<"managed" | "custom">("managed");
    const [customNameservers, setCustomNameservers] = useState("");
    const [availability, setAvailability] = useState<AvailabilityState>({ state: "idle", message: "" });
    const [pending, setPending] = useState(false);

    const nameserverList = useMemo(() =>
        customNameservers
            .split(",")
            .map((item) => item.trim().toLowerCase())
            .filter(Boolean), [customNameservers]);

    useEffect(() => {
        const value = subdomain.trim().toLowerCase();
        if (!value) {
            setAvailability({ state: "idle", message: "" });
            return;
        }

        const controller = new AbortController();
        setAvailability({ state: "checking", message: "Checking host availability…" });

        void fetch(`/api/v1/domains/availability?subdomain=${encodeURIComponent(value)}`, { signal: controller.signal })
            .then(async (response) => {
                const result = await response.json() as { data?: { available?: boolean; detail?: string; reason?: string; hostname?: string }; detail?: string };
                if (!response.ok) {
                    throw new Error(result.detail ?? "Unable to validate the subdomain.");
                }

                const available = result.data?.available ?? false;
                setAvailability({
                    state: available ? "available" : "unavailable",
                    message: available
                        ? `${result.data?.hostname ?? value}.der.my.id is available for review.`
                        : result.data?.reason ?? "This hostname is not available.",
                });
            })
            .catch((fetchError: unknown) => {
                if ((fetchError as { name?: string }).name === "AbortError") return;
                setAvailability({
                    state: "unavailable",
                    message: fetchError instanceof Error ? fetchError.message : "Unable to validate the hostname right now.",
                });
            });

        return () => controller.abort();
    }, [subdomain]);

    async function submitRegistration(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const normalizedSubdomain = subdomain.trim().toLowerCase();
        if (!normalizedSubdomain) {
            toast.error("Choose a subdomain name first.");
            return;
        }

        if (dnsMode === "custom") {
            const nameserverCount = nameserverList.length;
            if (nameserverCount < 2 || nameserverCount > 4) {
                toast.error("Custom nameservers require between 2 and 4 valid hostnames.");
                return;
            }
        }

        if (availability.state !== "available") {
            toast.error("This hostname is not currently available or it is reserved.");
            return;
        }

        setPending(true);
        try {
            const response = await fetch("/api/v1/domains", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    subdomain: normalizedSubdomain,
                    notes,
                    dnsMode,
                    customNameservers: dnsMode === "custom" ? nameserverList.join(",") : "",
                }),
            });
            const result = await response.json() as { data?: { hostname?: string; status?: string; detail?: string }; detail?: string };
            if (!response.ok) throw new Error(result.detail ?? "The registration request could not be created.");
            toast.success(`${result.data?.hostname ?? normalizedSubdomain + ".der.my.id"} has been submitted for administrator approval.`);
            setSubdomain("");
            setNotes("");
            setCustomNameservers("");
            setAvailability({ state: "idle", message: "" });
        } catch (submitError) {
            toast.error(submitError instanceof Error ? submitError.message : "Unable to create the registration request.");
        } finally {
            setPending(false);
        }
    }

    const canSubmit = subdomain.trim() && availability.state === "available" && !pending && (dnsMode !== "custom" || nameserverList.length >= 2);

    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">Register a subdomain</h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    Choose a hostname for a development project. All requests are reviewed by an administrator before activation.
                </p>
            </header>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <form onSubmit={submitRegistration} className="flex flex-col gap-6 rounded-lg border bg-card p-5 sm:p-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="subdomain">Subdomain name</FieldLabel>
                            <div className="flex min-w-0 items-stretch">
                                <Input id="subdomain" value={subdomain} onChange={(event) => setSubdomain(event.target.value)} placeholder="your-project" autoComplete="off" />
                                <span className="flex shrink-0 items-center border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
                                    .der.my.id
                                </span>
                            </div>
                            <FieldDescription>Use lowercase letters, numbers, and hyphens. Service-reserved names are blocked.</FieldDescription>
                        </Field>

                        <Field>
                            <FieldLabel>DNS configuration</FieldLabel>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <Button type="button" variant={dnsMode === "managed" ? "default" : "outline"} onClick={() => setDnsMode("managed")}>
                                    Our DNS
                                </Button>
                                <Button type="button" variant={dnsMode === "custom" ? "default" : "outline"} onClick={() => setDnsMode("custom")}>
                                    Custom nameservers
                                </Button>
                            </div>
                            <FieldDescription>
                                {dnsMode === "managed"
                                    ? "We will prepare the DNS records only after the hostname is approved."
                                    : "Add 2-4 nameservers to be stored for moderation and later configuration review."}
                            </FieldDescription>
                        </Field>

                        {dnsMode === "custom" && (
                            <Field>
                                <FieldLabel htmlFor="custom-nameservers">Custom nameservers</FieldLabel>
                                <Input
                                    id="custom-nameservers"
                                    value={customNameservers}
                                    onChange={(event) => setCustomNameservers(event.target.value)}
                                    placeholder="ns1.example.com, ns2.example.com"
                                    autoComplete="off"
                                />
                                <FieldDescription>Provide 2 to 4 valid nameserver hostnames separated by commas.</FieldDescription>
                            </Field>
                        )}

                        <Field>
                            <FieldLabel htmlFor="registration-notes">Project purpose</FieldLabel>
                            <Textarea
                                id="registration-notes"
                                value={notes}
                                onChange={(event) => setNotes(event.target.value)}
                                placeholder="Briefly describe the project that will use this hostname."
                                className="min-h-24"
                            />
                            <FieldDescription>Do not include secrets or personal data.</FieldDescription>
                        </Field>
                    </FieldGroup>

                    {availability.message && (
                        <Alert variant={availability.state === "available" ? "default" : "destructive"} className={availability.state === "available" ? "border-emerald-500/40 bg-emerald-500/5" : ""}>
                            <AlertTriangle className={availability.state === "available" ? "text-emerald-600" : ""} />
                            <AlertDescription>{availability.message}</AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-wrap items-center gap-3 border-t pt-5">
                        <Button type="submit" disabled={!canSubmit}>
                            {pending ? "Submitting…" : "Submit registration"}
                        </Button>
                        <Button asChild type="button" variant="ghost">
                            <Link to="/legal/domain-policy">Review domain policy</Link>
                        </Button>
                    </div>
                </form>

                <aside className="flex flex-col gap-4 border-t pt-5 text-sm lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <div className="flex items-center gap-2 font-medium">
                        <Globe2 />
                        Before you request a name
                    </div>
                    <ul className="flex list-disc flex-col gap-2 pl-5 leading-6 text-muted-foreground">
                        <li>Use a name you have the right to use.</li>
                        <li>Do not impersonate a person, company, or service.</li>
                        <li>Keep the hostname compliant with the acceptable-use policy.</li>
                        <li>Live DNS changes are not created until an administrator approves the registration.</li>
                    </ul>
                    <Link to="/legal/acceptable-use" className="font-medium underline underline-offset-4">
                        Read acceptable use
                    </Link>
                </aside>
            </div>
        </div>
    );
}
