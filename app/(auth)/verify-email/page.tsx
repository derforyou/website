import { AuthForm } from "@/components/auth/auth-form";
import { AuthSection } from "@/components/auth/auth-section";

export default function VerifyEmailPage() {
  return (
    <AuthSection
      description="Enter your email and we will send a fresh verification link if needed."
      title="Verify your email"
    >
      <AuthForm mode="verify-email" />
    </AuthSection>
  );
}