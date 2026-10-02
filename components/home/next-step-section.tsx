import Link from "next/link";

import { Button } from "@/components/ui/button";

export function NextStepSection() {
  return (
    <section className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-4 py-16 sm:px-6 sm:py-20 md:flex-row md:items-center">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Ready to put your name on it?</h2>
        <p className="mt-2 text-muted-foreground">Create an account and start with your first domain.</p>
      </div>
      <Button asChild>
        <Link href="/register">Create your account</Link>
      </Button>
    </section>
  );
}