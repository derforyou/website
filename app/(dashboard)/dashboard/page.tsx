import Link from "next/link";

import type { Metadata } from "next";

import { StatCard } from "@/components/site-shell";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Overview",
  description: "Your domain operations, account health, and account activity in one place.",
};

export default function DashboardOverviewPage() {
  return (
    <>
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-2 text-base text-muted-foreground">Your domain operations, account health, and account activity in one place.</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/domains/new">Register a domain</Link>
        </Button>
      </header>
      <div className="grid gap-4 md:grid-cols-3">
        <StatCard label="Domains" value="3" detail="1 approved and 2 pending review" />
        <StatCard label="API tokens" value="2" detail="1 active token remains" />
        <StatCard label="Verification" value="Verified" detail="Your account is trusted" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card>
          <CardHeader>
            <CardTitle>Recent activity</CardTitle>
            <CardDescription>Latest domain and account events</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>• hello.der.my.id was approved.</p>
            <p>• Updated account security settings.</p>
            <p>• Created a new API token for automation.</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account status</CardTitle>
            <CardDescription>Current security posture</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>Role: user</p>
            <p>Email: verified</p>
            <p>Session: active</p>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
