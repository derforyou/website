import { Button } from "@/components/ui/button";
import { Link } from "react-router";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl space-y-8 px-6 py-12">
      <h1 className="text-5xl">Account home</h1>
      <p className="max-w-2xl text-muted-foreground">
        Manage your domains, contact identity, and API integrations from a single DER account.
      </p>
      <div className="flex gap-4">
        <Link to="/dashboard">
          <Button>Open dashboard</Button>
        </Link>
        <Link to="/domains/register">
          <Button variant="outline">Register domain</Button>
        </Link>
      </div>
    </div>
  );
}
