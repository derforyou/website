import { AuthForm } from "@/components/auth/auth-form";
import { AuthSection } from "@/components/auth/auth-section";

export default function RegisterPage() {
  return (
    <AuthSection
      description="Create an account to claim and manage your domain."
      title="Create your account"
    >
      <AuthForm mode="sign-up" />
    </AuthSection>
  );
}