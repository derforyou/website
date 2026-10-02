"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import {
  registerWithEmail,
  requestPasswordReset,
  resendVerificationEmail,
  resetPassword,
  signInWithEmail,
  signInWithGitHub,
} from "@/lib/service/auth";
import type { AuthFormMode, AuthFormValues } from "@/types/auth";

export function useAuthForm(mode: AuthFormMode, resetToken = "") {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  async function submit(values: AuthFormValues) {
    setIsPending(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      if (mode === "sign-in") {
        await signInWithEmail(values);
        router.replace("/dashboard");
        router.refresh();
      } else if (mode === "sign-up") {
        await registerWithEmail(values);
        router.replace("/verify-email");
      } else if (mode === "forgot-password") {
        await requestPasswordReset(values.email);
        setSuccessMessage("If an account uses that email, a reset link is on its way.");
      } else if (mode === "reset-password") {
        await resetPassword({ ...values, token: resetToken || values.token });
        router.replace("/login");
      } else {
        await resendVerificationEmail(values.email);
        setSuccessMessage("If that account needs verification, a new email is on its way.");
      }
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Something went wrong. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  }

  async function continueWithGitHub() {
    setIsPending(true);
    setErrorMessage("");

    try {
      await signInWithGitHub();
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "GitHub sign-in could not be started.",
      );
      setIsPending(false);
    }
  }

  return { isPending, errorMessage, successMessage, submit, continueWithGitHub };
}