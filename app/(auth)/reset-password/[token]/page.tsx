import { AuthForm } from "@/components/auth/auth-form";
import { AuthSection } from "@/components/auth/auth-section";

export default async function ResetPasswordTokenPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  return (
    <AuthSection
      description="Choose a new password for your account."
      title="Choose a new password"
    >
      <AuthForm mode="reset-password" token={token} />
    </AuthSection>
  );
}