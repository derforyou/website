import { AuthForm } from "@/components/auth/auth-form";
import { AuthSection } from "@/components/auth/auth-section";

export default function ForgotPasswordPage() {
  return (
    <AuthSection
      description="Enter your account email and we will send a reset link if it matches."
      title="Reset your password"
    >
      <AuthForm mode="forgot-password" />
    </AuthSection>
  );
}