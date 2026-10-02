import Link from "next/link";
import type { Metadata } from "next";

import { AuthEmailField, AuthFormSection, AuthPasswordField, AuthSecuritySection } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Register", description: "Create an account to claim and manage your der.my.id domain." };

export default function RegisterPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Register</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Create an account to claim and manage your der.my.id domain.</p>
      </section>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <AuthFormSection
          title="Create account"
          description="Use your email and password, or continue with GitHub."
          primaryAction="Create account"
          secondary={
            <>
              <Link href="/forgot-password">Forgot password?</Link>
              <Link href="/login">Already have an account?</Link>
            </>
          }
        >
          <AuthEmailField />
          <AuthPasswordField />
        </AuthFormSection>

        <AuthSecuritySection />
      </div>
    </>
  );
}
