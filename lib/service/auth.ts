"use client";

import { authClient } from "@/lib/auth/client";
import {
  normalizeAuthName,
  normalizeEmailAddress,
  validateAuthPassword,
  validateAuthToken,
  validatePasswordConfirmation,
} from "@/lib/validation/auth";
import type {
  RegisterInput,
  ResetPasswordInput,
  SignInInput,
} from "@/types/auth";

export async function signInWithEmail(input: SignInInput) {
  const { error, data } = await authClient.signIn.email({
    email: normalizeEmailAddress(input.email),
    password: validateAuthPassword(input.password),
    callbackURL: "/dashboard",
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function registerWithEmail(input: RegisterInput) {
  const { error, data } = await authClient.signUp.email({
    name: normalizeAuthName(input.name),
    email: normalizeEmailAddress(input.email),
    password: validateAuthPassword(input.password),
    callbackURL: "/dashboard",
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function signInWithGitHub() {
  const { error, data } = await authClient.signIn.social({
    provider: "github",
    callbackURL: "/dashboard",
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function requestPasswordReset(email: string) {
  const { error, data } = await authClient.requestPasswordReset({
    email: normalizeEmailAddress(email),
    redirectTo: "/login",
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function resetPassword(input: ResetPasswordInput) {
  const password = validateAuthPassword(input.password);
  validatePasswordConfirmation(password, input.confirmPassword);

  const { error, data } = await authClient.resetPassword({
    newPassword: password,
    token: validateAuthToken(input.token),
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function resendVerificationEmail(email: string) {
  const { error, data } = await authClient.sendVerificationEmail({
    email: normalizeEmailAddress(email),
    callbackURL: "/verify-email/success",
  });

  if (error) throw new Error(error.message);
  return data;
}

export async function signOut() {
  const { error, data } = await authClient.signOut();

  if (error) throw new Error(error.message);
  return data;
}