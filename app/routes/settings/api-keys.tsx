import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { KeyRound, ShieldAlert, Trash2 } from "lucide-react";

const apiKeys = [
    { name: "Production client", created: "2026-09-23", lastUsed: "2026-09-28", status: "Active" },
    { name: "Internal tooling", created: "2026-09-15", lastUsed: "2026-09-21", status: "Revoked" },
];

export default function ApiKeysPage() {
    return (
        <div className="mx-auto max-w-5xl space-y-6 px-6 py-10">
            <Card className="border-border bg-card/80">
                <CardHeader>
                    <CardTitle className="text-3xl">API key management</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="keyName" className="text-sm font-medium">New key name</label>
                        <Input id="keyName" placeholder="dashboard-client" />
                    </div>
                    <Button className="gap-2" type="button">
                        <KeyRound className="h-4 w-4" />
                        Generate key
                    </Button>
                </CardContent>
            </Card>

            <div className="space-y-4">
                {apiKeys.map((key) => (
                    <Card key={key.name} className="border-border bg-card/80">
                        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <div className="text-xl font-semibold">{key.name}</div>
                                <div className="mt-1 text-sm text-muted-foreground">
                                    Created: {key.created} · Last used: {key.lastUsed}
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <span className="rounded-full bg-muted px-2 py-1 text-xs font-medium text-foreground">
                                    {key.status}
                                </span>
                                <Button variant="outline" type="button" className="gap-2">
                                    <ShieldAlert className="h-4 w-4" />
                                    Revoke
                                </Button>
                                <Button variant="ghost" type="button" className="gap-2 text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
