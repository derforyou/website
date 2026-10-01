import { Badge } from "@/components/ui/badge";

const statusColors: Record<string, string> = {
    active: "border-status-success/30 bg-status-success/10 text-status-success",
    approved: "border-status-success/30 bg-status-success/10 text-status-success",
    synced: "border-status-success/30 bg-status-success/10 text-status-success",
    pending: "border-status-warning/30 bg-status-warning/10 text-status-warning",
    "not-configured": "border-status-warning/30 bg-status-warning/10 text-status-warning",
    rejected: "border-destructive/30 bg-destructive/10 text-destructive",
    failed: "border-destructive/30 bg-destructive/10 text-destructive",
    suspended: "border-destructive/30 bg-destructive/10 text-destructive",
    custom: "border-status-info/30 bg-status-info/10 text-status-info",
};

export function DomainStatusBadge({ status }: { status: string }) {
    const label = status.replaceAll("-", " ");
    return (
        <Badge variant="outline" className={statusColors[status] ?? "text-muted-foreground"}>
            {label}
        </Badge>
    );
}