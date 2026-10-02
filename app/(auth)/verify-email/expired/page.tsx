import { AuthNotice } from "@/components/auth/auth-notice";

export default function VerifyEmailExpiredPage() {
  return (
    <AuthNotice
      action="Send a new link"
      description="This verification link is no longer valid. Request a fresh link to continue."
      href="/verify-email"
      title="Verification link expired"
    />
  );
}