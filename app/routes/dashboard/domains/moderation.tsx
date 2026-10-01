import { DomainStatusBadge } from "@/components/domain-status-badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { redirect } from "react-router";
import { toast } from "sonner";

export async function clientLoader() {
  const response = await fetch("/api/v1/domains/moderation", { method: "GET" });
  if (!response.ok) {
    toast.error("Only administrators can access moderation.");
    throw redirect("/dashboard");
  }

  return null;
}

type PendingRequest = {
  id: string;
  hostname: string;
  subdomain: string;
  status: "pending";
  dnsMode: "managed" | "custom";
  customNameservers: string | null;
  notes: string | null;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
};

type ActiveDomain = {
  id: string;
  hostname: string;
  subdomain: string;
  status: "active" | "suspended";
  dnsMode: "managed" | "custom";
  customNameservers: string | null;
  dnsSyncStatus: string;
  ownerId: string;
  createdAt: string;
  userName: string | null;
  userEmail: string | null;
};

function nameserverList(value: string | null) {
  if (!value) return [];
  try {
    const parsed: unknown = JSON.parse(value);
    if (Array.isArray(parsed)) return parsed.filter((entry): entry is string => typeof entry === "string");
  } catch {
    // Older rows stored comma-separated nameservers.
  }
  return value.split(",").map((entry) => entry.trim()).filter(Boolean);
}

export default function DomainModerationPage() {
  const [pendingRequests, setPendingRequests] = useState<PendingRequest[]>([]);
  const [activeDomains, setActiveDomains] = useState<ActiveDomain[]>([]);
  const [error, setError] = useState("");

  async function loadModeration() {
    const response = await fetch("/api/v1/domains/moderation");
    const result = await response.json() as { data?: { pendingRequests?: PendingRequest[]; activeDomains?: ActiveDomain[] }; detail?: string };
    if (!response.ok) throw new Error(result.detail ?? "Unable to access moderation data.");
    setPendingRequests(result.data?.pendingRequests ?? []);
    setActiveDomains(result.data?.activeDomains ?? []);
  }

  useEffect(() => {
    void loadModeration().catch((loadError: unknown) => {
      const message = loadError instanceof Error ? loadError.message : "Unable to load moderation data.";
      setError(message);
      toast.error(message);
    });
  }, []);

  async function handleModeration(registrationId: string, action: "approve" | "reject" | "delete", reason = "") {
    try {
      const response = await fetch("/api/v1/domains/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, registrationId, reason }),
      });
      const result = await response.json() as { data?: { status?: string; domainId?: string; registrationId?: string }; detail?: string };
      if (!response.ok) throw new Error(result.detail ?? "The moderation action failed.");
      await loadModeration();
      const successMessage = action === "approve"
        ? "Registration approved."
        : action === "reject"
          ? "Registration rejected."
          : "Registration removed.";
      toast.success(successMessage);
    } catch (moderationError) {
      const message = moderationError instanceof Error ? moderationError.message : "The moderation action failed.";
      setError(message);
      toast.error(message);
    }
  }

  async function handleDomainAction(domainId: string, action: "suspend" | "unsuspend" | "delete") {
    try {
      const response = await fetch("/api/v1/domains/moderation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, domainId }),
      });
      const result = await response.json() as { data?: { status?: string; domainId?: string }; detail?: string };
      if (!response.ok) throw new Error(result.detail ?? "The domain action failed.");
      await loadModeration();
      const successMessage = action === "delete"
        ? "Domain deleted."
        : action === "unsuspend"
          ? "Domain unsuspended."
          : "Domain suspended.";
      toast.success(successMessage);
    } catch (domainError) {
      const message = domainError instanceof Error ? domainError.message : "The domain action failed.";
      setError(message);
      toast.error(message);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
      <header className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">Domain moderation</h1>
        <p className="text-sm text-muted-foreground">
          Review pending registrations, approve or reject them, and manage active domains.
        </p>
      </header>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Pending registrations</h2>
        {pendingRequests.length === 0 ? (
          <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">No pending registrations.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hostname</TableHead>
                <TableHead>Applicant</TableHead>
                <TableHead>DNS mode</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Requested</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pendingRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell className="font-medium">{request.hostname}</TableCell>
                  <TableCell>{request.userEmail ?? request.userName ?? "Applicant"}</TableCell>
                  <TableCell>
                    <DomainStatusBadge status={request.dnsMode} />
                    {request.customNameservers && <div className="mt-1 max-w-xs whitespace-normal break-all text-xs text-muted-foreground">{nameserverList(request.customNameservers).join(", ")}</div>}
                  </TableCell>
                  <TableCell className="max-w-sm whitespace-normal">{request.notes ?? "—"}</TableCell>
                  <TableCell>{new Date(request.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" onClick={() => void handleModeration(request.id, "approve")}>Approve</Button>
                      <Button type="button" size="sm" variant="outline" onClick={() => void handleModeration(request.id, "reject", "Rejected by moderator.")}>Reject</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Active domains</h2>
        {activeDomains.length === 0 ? (
          <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">No domains are active.</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hostname</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>DNS mode</TableHead>
                <TableHead>Sync</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activeDomains.map((domain) => (
                <TableRow key={domain.id}>
                  <TableCell className="font-medium">{domain.hostname}</TableCell>
                  <TableCell>{domain.userEmail ?? domain.userName ?? "Unknown"}</TableCell>
                  <TableCell><DomainStatusBadge status={domain.status} /></TableCell>
                  <TableCell>
                    <DomainStatusBadge status={domain.dnsMode} />
                    {domain.customNameservers && <div className="mt-1 max-w-xs whitespace-normal break-all text-xs text-muted-foreground">{nameserverList(domain.customNameservers).join(", ")}</div>}
                  </TableCell>
                  <TableCell><DomainStatusBadge status={domain.dnsSyncStatus} /></TableCell>
                  <TableCell>{new Date(domain.createdAt).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-2">
                      <Button type="button" size="sm" variant="outline" onClick={() => void handleDomainAction(domain.id, domain.status === "suspended" ? "unsuspend" : "suspend")}>{domain.status === "suspended" ? "Unsuspend" : "Suspend"}</Button>
                      <Button type="button" size="sm" variant="destructive" onClick={() => void handleDomainAction(domain.id, "delete")}>Delete</Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </section>
    </div>
  );
}
