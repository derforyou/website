import { AuthNotice } from "@/components/auth/auth-notice";

export default function VerifyEmailSuccessPage() {
  return (
    <AuthNotice
      action="Continue to dashboard"
      description="Your email address has been verified. Your account is ready to use."
      href="/dashboard"
      title="Email verified"
    />
  );
}