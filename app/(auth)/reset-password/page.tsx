import Link from "next/link";
import type { Metadata } from "next";

import { AuthFormSection, AuthPasswordField, AuthSecuritySection } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Reset password", description: "Choose a new password and return to the account dashboard." };

export default function ResetPasswordPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Reset password</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Choose a new password and return to the account dashboard.</p>
      </section>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <AuthFormSection
          title="Set a new password"
          description="Choose a strong password for your account."
          primaryAction="Update password"
          secondary={
            <>
              <Link href="/login">Back to login</Link>
              <Link href="/forgot-password">Request another reset</Link>
            </>
          }
        >
          <AuthPasswordField label="New password" />
          <AuthPasswordField label="Confirm password" />
        </AuthFormSection>

        <AuthSecuritySection />
      </div>
    </>
  );
}
