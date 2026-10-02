import Link from "next/link";

import { AuthEmailField, AuthFormSection, AuthPasswordField, AuthSecuritySection } from "@/components/auth/auth-form";
import { PublicPage } from "@/components/site-shell";

export default function LoginPage() {
  return (
    <PublicPage eyebrow="Account" title="Login" description="Secure authentication for the der.my.id service." active="/login">
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
    </PublicPage>
  );
}
