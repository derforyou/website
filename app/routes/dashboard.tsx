import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowUpRight, KeyRound, ShieldCheck, Ticket } from "lucide-react";
import { Link } from "react-router";

export default function DashboardPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-8 px-6 py-10">
            <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <Badge variant="secondary">Authorized access</Badge>
                    <h1 className="mt-3 text-4xl">Dashboard</h1>
                </div>
                <Link to="/domains/register">
                    <Button className="gap-2">
                        Register domain
                        <ArrowUpRight className="h-4 w-4" />
                    </Button>
                </Link>
            </header>

            <div className="grid gap-4 md:grid-cols-3">
                <Card className="border-border bg-card/80">
                    <CardHeader>
                        <CardTitle>Account status</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">Verified</div>
                        <p className="mt-2 text-sm text-muted-foreground">Email identity and GitHub login are enabled.</p>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card/80">
                    <CardHeader>
                        <CardTitle>Domains</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">3</div>
                        <p className="mt-2 text-sm text-muted-foreground">Domains registered to your account.</p>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card/80">
                    <CardHeader>
                        <CardTitle>Security</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-semibold">2FA ready</div>
                        <p className="mt-2 text-sm text-muted-foreground">Authenticator support is available when enabled.</p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <Card className="border-border bg-card/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Ticket className="h-4 w-4" />
                            Domain operations
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>Check domain availability before registration.</p>
                        <p>Manage ownership, DNS state, and propagation status.</p>
                        <Link to="/domains" className="font-medium text-primary hover:underline">View all domains</Link>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4" />
                            API access
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>Create and revoke DER API keys for client integrations.</p>
                        <Link to="/settings/api-keys" className="font-medium text-primary hover:underline">Manage keys</Link>
                    </CardContent>
                </Card>

                <Card className="border-border bg-card/80">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4" />
                            Account settings
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm text-muted-foreground">
                        <p>Review contact details, account settings, and role status.</p>
                        <Link to="/settings" className="font-medium text-primary hover:underline">Open settings</Link>
                    </CardContent>
                </Card>
            </div>

            <Card className="border-border bg-card/80">
                <CardHeader>
                    <CardTitle>Recent activity</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <div className="grid gap-3 md:grid-cols-3">
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                        <Skeleton className="h-12 w-full rounded-lg" />
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
