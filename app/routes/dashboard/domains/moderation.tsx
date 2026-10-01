import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

  async function handleDomainAction(domainId: string, action: "suspend" | "delete", currentStatus?: "active" | "suspended") {
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
        : currentStatus === "suspended"
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
        ) : pendingRequests.map((request) => (
          <div key={request.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-medium">{request.hostname}</div>
                <div className="text-sm text-muted-foreground">{request.userEmail ?? request.userName ?? "Applicant"}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" onClick={() => void handleModeration(request.id, "approve")}>Approve</Button>
                <Button type="button" size="sm" variant="outline" onClick={() => void handleModeration(request.id, "reject", "Rejected by moderator.")}>Reject</Button>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              DNS: {request.dnsMode === "managed" ? "Managed" : "Custom"}
              {request.customNameservers && ` · Nameservers: ${request.customNameservers}`}
              {request.notes && ` · Purpose: ${request.notes}`}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-medium">Active domains</h2>
        {activeDomains.length === 0 ? (
          <p className="rounded-lg border bg-card p-4 text-sm text-muted-foreground">No domains are active.</p>
        ) : activeDomains.map((domain) => (
          <div key={domain.id} className="rounded-lg border bg-card p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="font-medium">{domain.hostname}</div>
                <div className="text-sm text-muted-foreground">Owner: {domain.userEmail ?? domain.userName ?? "Unknown"}</div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button type="button" size="sm" variant="outline" onClick={() => void handleDomainAction(domain.id, "suspend", domain.status)}>{domain.status === "suspended" ? "Unsuspend" : "Suspend"}</Button>
                <Button type="button" size="sm" variant="destructive" onClick={() => void handleDomainAction(domain.id, "delete")}>Delete</Button>
              </div>
            </div>
            <div className="mt-3 text-sm text-muted-foreground">
              DNS: {domain.dnsMode === "managed" ? "Managed" : "Custom"}
              {domain.customNameservers && ` · Nameservers: ${domain.customNameservers}`}
              {` · Status: ${domain.status}`}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
