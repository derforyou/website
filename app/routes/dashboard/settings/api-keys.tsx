import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Copy, KeyRound, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";

type ApiKey = {
    id: string;
    name: string;
    prefix: string;
    createdAt: string;
    expiresAt: string | null;
    lastUsedAt: string | null;
    revokedAt: string | null;
};

type ApiResult<T> = {
    data: T;
    detail?: string;
};

async function fetchApiKeys(): Promise<ApiKey[]> {
    const response = await fetch("/api/v1/api-keys");
    const result = await response.json() as ApiResult<ApiKey[]>;
    if (!response.ok) throw new Error(result.detail ?? "Could not load API keys.");
    return result.data;
}

export default function ApiKeysPage() {
    const [keys, setKeys] = useState<ApiKey[]>([]);
    const [name, setName] = useState("");
    const [expiresAt, setExpiresAt] = useState("");
    const [newToken, setNewToken] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    useEffect(() => {
        fetchApiKeys().then(setKeys).catch((loadError: unknown) => {
            setError(loadError instanceof Error ? loadError.message : "Could not load API keys.");
        });
    }, []);

    async function createKey(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setPending(true);
        try {
            const response = await fetch("/api/v1/api-keys", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    expiresAt: expiresAt ? new Date(expiresAt).toISOString() : null,
                }),
            });
            const result = await response.json() as ApiResult<ApiKey & { token: string }>;
            if (!response.ok) throw new Error(result.detail ?? "Could not create API key.");
            setNewToken(result.data.token);
            setName("");
            setExpiresAt("");
            setKeys(await fetchApiKeys());
        } catch (createError) {
            setError(createError instanceof Error ? createError.message : "Could not create API key.");
        } finally {
            setPending(false);
        }
    }

    async function revokeKey(keyId: string) {
        setError("");
        try {
            const response = await fetch(`/api/v1/api-keys/${encodeURIComponent(keyId)}`, { method: "DELETE" });
            const result = await response.json() as ApiResult<{ id: string; revoked: boolean }>;
            if (!response.ok) throw new Error(result.detail ?? "Could not revoke API key.");
            setKeys(await fetchApiKeys());
        } catch (revokeError) {
            setError(revokeError instanceof Error ? revokeError.message : "Could not revoke API key.");
        }
    }

    return (
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">API keys</h1>
                <p className="text-sm text-muted-foreground">
                    Credentials for applications that integrate with DERforyou.
                </p>
            </header>
            <form className="flex max-w-xl flex-col gap-4 border-b pb-6" onSubmit={createKey}>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="key-name">Key name</FieldLabel>
                        <Input id="key-name" value={name} onChange={(event) => setName(event.target.value)} maxLength={100} placeholder="Production integration" required />
                    </Field>
                    <Field>
                        <FieldLabel htmlFor="key-expiry">Expires at (optional)</FieldLabel>
                        <Input id="key-expiry" type="datetime-local" value={expiresAt} onChange={(event) => setExpiresAt(event.target.value)} />
                    </Field>
                </FieldGroup>
                <Button type="submit" disabled={pending || !name.trim()} className="w-fit">
                    <KeyRound data-icon="inline-start" />
                    {pending ? "Creating..." : "Create API key"}
                </Button>
            </form>

            {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
            {newToken && (
                <Alert>
                    <AlertDescription className="flex flex-col gap-3">
                        <span>Copy this key now. It will not be shown again.</span>
                        <code className="break-all rounded border bg-muted p-3">{newToken}</code>
                        <Button type="button" variant="outline" className="w-fit" onClick={() => navigator.clipboard.writeText(newToken)}>
                            <Copy data-icon="inline-start" />
                            Copy key
                        </Button>
                    </AlertDescription>
                </Alert>
            )}

            <section className="flex flex-col gap-3" aria-label="API keys">
                {keys.length === 0 ? (
                    <p className="py-8 text-sm text-muted-foreground">No API keys have been created.</p>
                ) : keys.map((key) => (
                    <div key={key.id} className="flex flex-wrap items-center justify-between gap-4 border-b py-4">
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="font-medium">{key.name}</span>
                            <code className="text-sm text-muted-foreground">{key.prefix}...</code>
                            <span className="text-xs text-muted-foreground">
                                {key.revokedAt ? "Revoked" : key.expiresAt ? `Expires ${new Date(key.expiresAt).toLocaleString()}` : "No expiration"}
                                {key.lastUsedAt ? ` · Last used ${new Date(key.lastUsedAt).toLocaleString()}` : " · Not used"}
                            </span>
                        </div>
                        {!key.revokedAt && (
                            <Button type="button" variant="outline" size="sm" onClick={() => revokeKey(key.id)}>
                                <Trash2 data-icon="inline-start" />
                                Revoke
                            </Button>
                        )}
                    </div>
                ))}
            </section>
        </div>
    );
}
