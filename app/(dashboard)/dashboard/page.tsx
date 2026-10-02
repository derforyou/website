import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { DummyAuthenticatedSection } from "@/components/dashboard/dummy-authenticated-section";
import { getCurrentUser } from "@/lib/auth/guards";

export default async function DashboardPage() {
  const user = await getCurrentUser(await headers());

  if (!user) redirect("/login");

  return <DummyAuthenticatedSection email={user.email} name={user.name} />;
}