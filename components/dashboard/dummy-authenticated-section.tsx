"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/service/auth";

export function DummyAuthenticatedSection({
  name,
  email,
}: {
  name: string;
  email: string;
}) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignOut() {
    setIsPending(true);
    setErrorMessage("");

    try {
      await signOut();
      router.replace("/login");
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not sign out.");
      setIsPending(false);
    }
  }

  return (
    <section className="grid gap-8">
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
        <div className="grid gap-2">
          <p className="text-sm font-medium text-muted-foreground">Authenticated preview</p>
          <h1 className="text-3xl font-bold">Hello, {name}</h1>
          <p className="break-all text-muted-foreground">{email}</p>
        </div>
        <Button disabled={isPending} onClick={() => void handleSignOut()} variant="outline">
          <LogOut />
          {isPending ? "Signing out" : "Sign out"}
        </Button>
      </div>
      {errorMessage && (
        <p aria-live="polite" className="text-sm text-destructive" role="alert">
          {errorMessage}
        </p>
      )}
    </section>
  );
}