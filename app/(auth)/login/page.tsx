import Link from "next/link";
import type { Metadata } from "next";

import { AuthEmailField, AuthFormSection, AuthPasswordField, AuthSecuritySection } from "@/components/auth/auth-form";

export const metadata: Metadata = { title: "Login", description: "Secure authentication for the der.my.id service." };

export default function LoginPage() {
  return (
    <>
      <section className="mb-10 border-b border-border pb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Account</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">Login</h1>
        <p className="mt-4 max-w-2xl text-base text-muted-foreground sm:text-lg">Secure authentication for the der.my.id service.</p>
      </section>
      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <AuthFormSection
          title="Welcome back"
          description="Use your email and password, or continue with GitHub."
          primaryAction="Continue"
          secondary={
            <>
              <Link href="/forgot-password">Forgot password?</Link>
              <Link href="/register">Create account</Link>
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
