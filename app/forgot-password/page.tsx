import Link from "next/link";

import { AuthEmailField, AuthFormSection, AuthSecuritySection } from "@/components/auth/auth-form";
import { PublicPage } from "@/components/site-shell";

export default function ForgotPasswordPage() {
  return (
    <PublicPage eyebrow="Account" title="Forgot password" description="Request a secure reset link for your account." active="/login">
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
    </PublicPage>
  );
}
