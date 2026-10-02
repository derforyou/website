import Link from "next/link";
import type { Metadata } from "next";

import { AuthEmailField, AuthFormSection, AuthSecuritySection } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Forgot password", description: "Request a secure reset link for your account." };

export default function ForgotPasswordPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Forgot password</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Request a secure reset link for your account.</p>
      </section>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <AuthFormSection
          title="Reset your access"
          description="We will send a secure link to your email address."
          primaryAction="Send reset link"
          secondary={
            <>
              <Link href="/login">Back to login</Link>
              <Link href="/register">Create account</Link>
            </>
          }
        >
          <AuthEmailField />
        </AuthFormSection>

        <AuthSecuritySection />
      </div>
    </>
  );
}
