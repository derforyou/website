"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { LoaderCircle } from "lucide-react";

import { useAuthForm } from "@/hooks/use-auth-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AuthFormMode, AuthFormValues } from "@/types/auth";

const emptyValues: AuthFormValues = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
  token: "",
};

export function AuthForm({ mode, token = "" }: { mode: AuthFormMode; token?: string }) {
  const [values, setValues] = useState(emptyValues);
  const { isPending, errorMessage, successMessage, submit, continueWithGitHub } =
    useAuthForm(mode, token);

  function update(field: keyof AuthFormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void submit(values);
  }

  const isSignIn = mode === "sign-in";
  const isSignUp = mode === "sign-up";
  const isReset = mode === "reset-password";
  const needsPassword = isSignIn || isSignUp || isReset;

  return (
    <div className="grid gap-5">
      <form className="grid gap-4" onSubmit={handleSubmit}>
        {isSignUp && (
          <div className="grid gap-2">
            <Label htmlFor="name">Full name</Label>
            <Input
              autoComplete="name"
              id="name"
              maxLength={80}
              onChange={(event) => update("name", event.target.value)}
              required
              value={values.name}
            />
          </div>
        )}

        {isReset && !token && (
          <div className="grid gap-2">
            <Label htmlFor="token">Reset token</Label>
            <Input
              autoComplete="off"
              id="token"
              onChange={(event) => update("token", event.target.value)}
              required
              value={values.token}
            />
          </div>
        )}

        {(isSignIn || isSignUp) && (
          <div className="grid gap-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="password">Password</Label>
              {isSignIn && (
                <Link className="text-sm underline underline-offset-4" href="/forgot-password">
                  Forgot password?
                </Link>
              )}
            </div>
            <Input
              autoComplete={isSignIn ? "current-password" : "new-password"}
              id="password"
              minLength={12}
              maxLength={128}
              onChange={(event) => update("password", event.target.value)}
              required
              type="password"
              value={values.password}
            />
          </div>
        )}

        {isReset && (
          <>
            <div className="grid gap-2">
              <Label htmlFor="password">New password</Label>
              <Input
                autoComplete="new-password"
                id="password"
                minLength={12}
                maxLength={128}
                onChange={(event) => update("password", event.target.value)}
                required
                type="password"
                value={values.password}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm password</Label>
              <Input
                autoComplete="new-password"
                id="confirm-password"
                minLength={12}
                maxLength={128}
                onChange={(event) => update("confirmPassword", event.target.value)}
                required
                type="password"
                value={values.confirmPassword}
              />
            </div>
          </>
        )}

        {!isReset && (
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              autoComplete="email"
              id="email"
              onChange={(event) => update("email", event.target.value)}
              required
              type="email"
              value={values.email}
            />
          </div>
        )}

        {errorMessage && (
          <p aria-live="polite" className="text-sm text-destructive" role="alert">
            {errorMessage}
          </p>
        )}
        {successMessage && (
          <p aria-live="polite" className="text-sm text-muted-foreground" role="status">
            {successMessage}
          </p>
        )}

        <Button disabled={isPending} type="submit">
          {isPending && <LoaderCircle className="animate-spin" />}
          {isSignIn && "Sign in"}
          {isSignUp && "Create account"}
          {mode === "forgot-password" && "Send reset link"}
          {isReset && "Update password"}
          {mode === "verify-email" && "Resend verification email"}
        </Button>
      </form>

      {needsPassword && (
        <div className="grid gap-4">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="h-px flex-1 bg-border" />
            <span>or continue with</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button
            disabled={isPending}
            onClick={() => void continueWithGitHub()}
            type="button"
            variant="outline"
          >
            <SiGithub />
            GitHub
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-t pt-4 text-sm text-muted-foreground">
        {isSignIn && (
          <>
            <span>New here?</span>
            <Link className="text-foreground underline underline-offset-4" href="/register">
              Create an account
            </Link>
          </>
        )}
        {isSignUp && (
          <>
            <span>Already registered?</span>
            <Link className="text-foreground underline underline-offset-4" href="/login">
              Sign in
            </Link>
          </>
        )}
        {(mode === "forgot-password" || mode === "reset-password" || mode === "verify-email") && (
          <Link className="text-foreground underline underline-offset-4" href="/login">
            Back to sign in
          </Link>
        )}
        {isSignIn && (
          <Link className="w-full underline underline-offset-4" href="/verify-email">
            Need a new verification email?
          </Link>
        )}
      </div>
    </div>
  );
}