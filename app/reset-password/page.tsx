import Link from "next/link";

import { AuthFormSection, AuthPasswordField, AuthSecuritySection } from "@/components/auth/auth-form";
import { PublicPage } from "@/components/site-shell";

export default function ResetPasswordPage() {
  return (
    <PublicPage eyebrow="Account" title="Reset password" description="Choose a new password and return to the account dashboard." active="/login">
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
    </PublicPage>
  );
}
