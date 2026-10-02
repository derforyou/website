import { AuthForm } from "@/components/auth/auth-form";
import { AuthSection } from "@/components/auth/auth-section";

export default function LoginPage() {
  return (
    <AuthSection
      description="Sign in to manage your domains and account."
      title="Welcome back"
    >
      <AuthForm mode="sign-in" />
    </AuthSection>
  );
}