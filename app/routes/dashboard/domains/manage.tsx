import { DomainStatusBadge } from "@/components/domain-status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Pencil, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router";
import { toast } from "sonner";

type DnsMode = "managed" | "custom";
type Domain = {
    id: string;
    hostname: string;
    status: "active" | "suspended";
    dnsMode: DnsMode;
    customNameservers: string[];
    dnsSyncStatus: string;
};
type DnsRecord = {
    id: string;
    type: string;
    name: string;
    content: string;
    ttl: number;
    proxied: boolean;
    priority: number | null;
    data: Record<string, unknown> | null;
    comment: string | null;
    tags: string[];
    settings: Record<string, unknown>;
};
type RecordForm = {
    type: string;
    name: string;
    content: string;
    ttl: string;
    proxied: boolean;
    extraFields: string;
};

const recordTypes = [
    "A", "AAAA", "CAA", "CERT", "CNAME", "DNSKEY", "DS", "HTTPS", "LOC", "MX",
    "NAPTR", "NS", "OPENPGPKEY", "PTR", "SMIMEA", "SRV", "SSHFP", "SVCB", "TLSA", "TXT", "URI",
];
const emptyRecord: RecordForm = { type: "A", name: "@", content: "", ttl: "1", proxied: false, extraFields: "" };

async function readJson(response: Response) {
    const result = await response.json() as { data?: { domain?: Domain; records?: DnsRecord[]; record?: DnsRecord }; detail?: string };
    if (!response.ok) throw new Error(result.detail ?? "The request failed.");
    return result;
}

export default function ManageDomainPage() {
    const { domainId } = useParams();
    const [domain, setDomain] = useState<Domain | null>(null);
    const [records, setRecords] = useState<DnsRecord[]>([]);
    const [dnsMode, setDnsMode] = useState<DnsMode>("managed");
    const [nameservers, setNameservers] = useState(["", ""]);
    const [recordForm, setRecordForm] = useState<RecordForm>(emptyRecord);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    async function loadDomain() {
        if (!domainId) return;
        const detailResult = await readJson(await fetch(`/api/v1/domains/${encodeURIComponent(domainId)}`));
        const nextDomain = detailResult.data?.domain;
        if (!nextDomain) throw new Error("Domain details were not returned.");
        setDomain(nextDomain);
        setDnsMode(nextDomain.dnsMode);
        setNameservers(nextDomain.customNameservers.length >= 2 ? nextDomain.customNameservers : ["", ""]);
        if (nextDomain.dnsMode === "managed") {
            const dnsResult = await readJson(await fetch(`/api/v1/domains/${encodeURIComponent(domainId)}/dns-records`));
            setRecords(dnsResult.data?.records ?? []);
        } else {
            setRecords([]);
        }
    }

    useEffect(() => {
        void loadDomain()
            .catch((loadError: unknown) => {
                const message = loadError instanceof Error ? loadError.message : "Unable to load domain management.";
                setError(message);
                toast.error(message);
            })
            .finally(() => setLoading(false));
    }, [domainId]);

    function updateNameserver(index: number, value: string) {
        setNameservers((current) => current.map((entry, itemIndex) => itemIndex === index ? value : entry));
    }

    async function saveDnsMode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!domainId) return;
        setSaving(true);
        setError("");
        try {
            const response = await fetch(`/api/v1/domains/${encodeURIComponent(domainId)}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ dnsMode, customNameservers: dnsMode === "custom" ? nameservers : [] }),
            });
            await readJson(response);
            await loadDomain();
            toast.success(dnsMode === "custom" ? "Custom nameservers are active." : "Managed DNS is active.");
        } catch (saveError) {
            const message = saveError instanceof Error ? saveError.message : "Unable to update nameservers.";
            setError(message);
            toast.error(message);
        } finally {
            setSaving(false);
        }
    }

    function editRecord(record: DnsRecord) {
        const extra: Record<string, unknown> = { ...(record.data ? { data: record.data } : {}) };
        if (record.priority !== null) extra.priority = record.priority;
        if (record.comment) extra.comment = record.comment;
        if (record.tags.length) extra.tags = record.tags;
        if (Object.keys(record.settings).length) extra.settings = record.settings;
        setRecordForm({
            type: record.type,
            name: record.name === domain?.hostname ? "@" : record.name,
            content: record.content,
            ttl: String(record.ttl),
            proxied: record.proxied,
            extraFields: Object.keys(extra).length ? JSON.stringify(extra, null, 2) : "",
        });
        setEditingId(record.id);
    }

    async function saveRecord(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!domainId) return;
        let extraFields: Record<string, unknown> = {};
        if (recordForm.extraFields.trim()) {
            try {
                const parsed: unknown = JSON.parse(recordForm.extraFields);
                if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("JSON must be an object.");
                extraFields = parsed as Record<string, unknown>;
            } catch (parseError) {
                toast.error(parseError instanceof Error ? parseError.message : "Additional fields must be valid JSON.");
                return;
            }
        }
        setSaving(true);
        setError("");
        try {
            const response = await fetch(`/api/v1/domains/${encodeURIComponent(domainId)}/dns-records${editingId ? `/${encodeURIComponent(editingId)}` : ""}`, {
                method: editingId ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...extraFields,
                    type: recordForm.type,
                    name: recordForm.name,
                    content: recordForm.content,
                    ttl: Number(recordForm.ttl),
                    proxied: recordForm.proxied,
                }),
            });
            await readJson(response);
            await loadDomain();
            setRecordForm(emptyRecord);
            setEditingId(null);
            toast.success(editingId ? "DNS record updated." : "DNS record created.");
        } catch (saveError) {
            const message = saveError instanceof Error ? saveError.message : "Unable to save DNS record.";
            setError(message);
            toast.error(message);
        } finally {
            setSaving(false);
        }
    }

    async function deleteRecord(recordId: string) {
        if (!domainId || !window.confirm("Delete this DNS record from Cloudflare?")) return;
        try {
            const response = await fetch(`/api/v1/domains/${encodeURIComponent(domainId)}/dns-records/${encodeURIComponent(recordId)}`, { method: "DELETE" });
            await readJson(response);
            await loadDomain();
            toast.success("DNS record deleted.");
        } catch (deleteError) {
            const message = deleteError instanceof Error ? deleteError.message : "Unable to delete DNS record.";
            setError(message);
            toast.error(message);
        }
    }

    if (loading) return <div className="mx-auto w-full max-w-6xl px-4 py-8 text-sm text-muted-foreground">Loading domain…</div>;
    if (!domain) return <div className="mx-auto flex w-full max-w-6xl flex-col gap-4 px-4 py-8"><p className="text-sm text-muted-foreground">{error || "Domain not found."}</p><Button asChild variant="outline"><Link to="/dashboard/domains"><ArrowLeft data-icon="inline-start" />Domains</Link></Button></div>;

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-wrap items-end justify-between gap-4">
                <div className="flex flex-col gap-3">
                    <Button asChild variant="ghost" className="w-fit px-0">
                        <Link to="/dashboard/domains"><ArrowLeft data-icon="inline-start" />Domains</Link>
                    </Button>
                    <div className="flex flex-wrap items-center gap-3">
                        <h1 className="text-2xl font-semibold tracking-tight">{domain.hostname}</h1>
                        <DomainStatusBadge status={domain.status} />
                    </div>
                    <p className="text-sm text-muted-foreground">Domain management · DNS sync <DomainStatusBadge status={domain.dnsSyncStatus} /></p>
                </div>
            </header>

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}

            <section className="flex flex-col gap-4 border-y py-6">
                <div>
                    <h2 className="text-lg font-medium">Nameserver mode</h2>
                    <p className="mt-1 text-sm text-muted-foreground">Custom mode delegates this hostname to your nameservers and disables managed DNS records.</p>
                </div>
                <form onSubmit={saveDnsMode} className="flex flex-col gap-5">
                    <div className="grid gap-3 sm:grid-cols-2">
                        <Button type="button" variant={dnsMode === "managed" ? "default" : "outline"} onClick={() => setDnsMode("managed")}>Managed DNS</Button>
                        <Button type="button" variant={dnsMode === "custom" ? "default" : "outline"} onClick={() => setDnsMode("custom")}>Custom nameservers</Button>
                    </div>
                    {dnsMode === "custom" && (
                        <FieldGroup>
                            <Field>
                                <FieldLabel>Custom nameservers</FieldLabel>
                                <div className="flex flex-col gap-2">
                                    {nameservers.map((nameserver, index) => (
                                        <div key={index} className="flex gap-2">
                                            <Input aria-label={`Nameserver ${index + 1}`} value={nameserver} onChange={(event) => updateNameserver(index, event.target.value)} placeholder={`ns${index + 1}.example.net`} />
                                            {index > 1 && <Button type="button" variant="outline" size="icon" aria-label={`Remove nameserver ${index + 1}`} onClick={() => setNameservers((current) => current.filter((_, itemIndex) => itemIndex !== index))}><Trash2 /></Button>}
                                        </div>
                                    ))}
                                </div>
                                {nameservers.length < 5 && <Button type="button" variant="outline" size="sm" className="mt-2 w-fit" onClick={() => setNameservers((current) => [...current, ""])}><Plus data-icon="inline-start" />Add NS</Button>}
                                <FieldDescription>Provide 2–5 unique nameserver hostnames. Changes update NS records in the der.my.id zone.</FieldDescription>
                            </Field>
                        </FieldGroup>
                    )}
                    <Button type="submit" className="w-fit" disabled={saving || domain.status !== "active"}>{saving ? "Saving…" : "Save nameserver mode"}</Button>
                </form>
            </section>

            {dnsMode === "managed" ? (
                <section className="flex flex-col gap-5">
                    <div>
                        <h2 className="text-lg font-medium">Managed DNS records</h2>
                        <p className="mt-1 text-sm text-muted-foreground">Records are managed in the Cloudflare zone. Subdomain records are supported; proxying is limited to this hostname's apex.</p>
                    </div>
                    <form onSubmit={saveRecord} className="flex flex-col gap-5 border-b pb-6">
                        <FieldGroup className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="record-type">Record type</FieldLabel>
                                <Select value={recordForm.type} onValueChange={(value) => setRecordForm((current) => ({ ...current, type: value }))}>
                                    <SelectTrigger id="record-type" className="w-full"><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        {recordTypes.map((type) => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="record-name">Name</FieldLabel>
                                <Input id="record-name" value={recordForm.name} onChange={(event) => setRecordForm((current) => ({ ...current, name: event.target.value }))} placeholder="@ or api" required />
                                <FieldDescription>Use @ for the domain root, a label for a subdomain, or a full hostname within this domain.</FieldDescription>
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="record-content">Content</FieldLabel>
                                <Textarea id="record-content" value={recordForm.content} onChange={(event) => setRecordForm((current) => ({ ...current, content: event.target.value }))} placeholder="Record value" className="min-h-20" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="record-ttl">TTL (seconds)</FieldLabel>
                                <Input id="record-ttl" type="number" min={1} max={86400} value={recordForm.ttl} onChange={(event) => setRecordForm((current) => ({ ...current, ttl: event.target.value }))} required />
                            </Field>
                        </FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="record-extra">Type-specific fields (JSON)</FieldLabel>
                            <Textarea id="record-extra" value={recordForm.extraFields} onChange={(event) => setRecordForm((current) => ({ ...current, extraFields: event.target.value }))} placeholder={'{"data":{"priority":10,"target":"mail.example.net"}}'} className="min-h-24 font-mono text-xs" />
                            <FieldDescription>Use Cloudflare fields such as data, priority, comment, tags, or settings for record types that need them.</FieldDescription>
                        </Field>
                        <label className="flex w-fit items-center gap-3 text-sm">
                            <Switch checked={recordForm.proxied} onCheckedChange={(checked) => setRecordForm((current) => ({ ...current, proxied: checked }))} />
                            Proxy through Cloudflare (apex A, AAAA, or CNAME only)
                        </label>
                        <div className="flex flex-wrap gap-2">
                            <Button type="submit" disabled={saving || domain.status !== "active"}>{saving ? "Saving…" : editingId ? "Update record" : "Add record"}</Button>
                            {editingId && <Button type="button" variant="outline" onClick={() => { setEditingId(null); setRecordForm(emptyRecord); }}>Cancel edit</Button>}
                        </div>
                    </form>
                    {records.length === 0 ? <p className="text-sm text-muted-foreground">No DNS records found for this domain.</p> : (
                        <Table>
                            <TableHeader><TableRow><TableHead>Type</TableHead><TableHead>Name</TableHead><TableHead>Content</TableHead><TableHead>TTL</TableHead><TableHead>Proxy</TableHead><TableHead className="text-right">Actions</TableHead></TableRow></TableHeader>
                            <TableBody>
                                {records.map((record) => (
                                    <TableRow key={record.id}>
                                        <TableCell className="font-medium">{record.type}</TableCell>
                                        <TableCell>{record.name}</TableCell>
                                        <TableCell className="max-w-md whitespace-normal break-all">{record.content || (record.data ? JSON.stringify(record.data) : "—")}</TableCell>
                                        <TableCell>{record.ttl === 1 ? "Auto" : record.ttl}</TableCell>
                                        <TableCell>{record.proxied ? "On" : "Off"}</TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button type="button" size="icon" variant="outline" aria-label={`Edit ${record.name} ${record.type}`} onClick={() => editRecord(record)}><Pencil /></Button>
                                                <Button type="button" size="icon" variant="destructive" aria-label={`Delete ${record.name} ${record.type}`} onClick={() => void deleteRecord(record.id)}><Trash2 /></Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </section>
            ) : (
                <section className="flex flex-col gap-3 border-t pt-6">
                    <h2 className="text-lg font-medium">Custom nameservers active</h2>
                    <p className="text-sm text-muted-foreground">Managed DNS records are read-only while custom nameservers are active. The existing records remain stored in Cloudflare.</p>
                    <ul className="list-inside list-disc text-sm">
                        {domain.customNameservers.map((nameserver) => <li key={nameserver}>{nameserver}</li>)}
                    </ul>
                </section>
            )}
        </div>
    );
}
