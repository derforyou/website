import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { FolderOpen, Globe2, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

const domains = [
    { name: "alex.der.my.id", status: "Active", dns: "Synced" },
    { name: "studio.der.my.id", status: "Active", dns: "Pending" },
    { name: "ops.der.my.id", status: "Suspended", dns: "Not configured" },
];

export default function DomainsPage() {
    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Domains</p>
                    <h1 className="mt-3 text-4xl">Owned resources</h1>
                </div>
                <Link to="/domains/register">
                    <Button>Register a domain</Button>
                </Link>
            </div>

            <Card className="border-border bg-card/80">
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Domain</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>DNS</TableHead>
                                <TableHead className="text-right">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {domains.map((domain) => (
                                <TableRow key={domain.name}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-3">
                                            <div className="rounded-lg bg-primary/10 p-2 text-primary">
                                                <Globe2 className="h-4 w-4" />
                                            </div>
                                            {domain.name}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={domain.status === "Active" ? "default" : "secondary"}>{domain.status}</Badge>
                                    </TableCell>
                                    <TableCell className="flex items-center gap-2 text-muted-foreground">
                                        <ShieldCheck className="h-4 w-4 text-primary" />
                                        {domain.dns}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Link to="/domains/register" className="font-medium text-primary hover:underline">
                                            Manage
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <div className="mt-8 rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    Domain ownership and authorization checks are enforced server-side before management actions are allowed.
                </div>
            </div>
        </div>
    );
}
