import { AuthForm } from "@/components/auth/auth-form";
import { AuthSection } from "@/components/auth/auth-section";

export default function ResetPasswordPage() {
  return (
    <AuthSection
      description="Use the token from your reset email to choose a new password."
      title="Choose a new password"
    >
      <AuthForm mode="reset-password" />
    </AuthSection>
  );
}