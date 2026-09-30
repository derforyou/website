import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { BadgeCheck, ShieldCheck } from "lucide-react";

export default function AccountSettingsPage() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <Card className="border-border bg-card/80">
                <CardHeader>
                    <CardTitle className="text-3xl">Account configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="displayName" className="text-sm font-medium">Display name</label>
                        <Input id="displayName" defaultValue="Alex Morgan" />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="role" className="text-sm font-medium">Role</label>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-primary" />
                            Authorization is evaluated server-side using role and ownership checks.
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Optional 2FA is available when supported by the Better Auth version in use.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
