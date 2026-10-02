import Link from "next/link";

import { AuthEmailField, AuthFormSection, AuthPasswordField, AuthSecuritySection } from "@/components/auth/auth-form";
import { PublicPage } from "@/components/site-shell";

export default function RegisterPage() {
  return (
    <PublicPage eyebrow="Account" title="Register" description="Create an account to claim and manage your der.my.id domain." active="/login">
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
    </PublicPage>
  );
}
