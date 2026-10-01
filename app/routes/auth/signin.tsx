import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { authClient } from "@/lib/auth-client";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { GitBranch, LockKeyhole, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";

export default function SignInPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function requestCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setPending(true);
        try {
            const result = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in",
            });
            if (result.error) {
                setError(result.error.message ?? "Unable to send the verification code.");
                return;
            }
            navigate("/auth/verify?flow=signin");
        } catch {
            setError("Unable to send the verification code. Please try again.");
        } finally {
            setPending(false);
        }
    }

    async function signInWithGitHub() {
        setError("");
        const result = await authClient.signIn.social({
            provider: "github",
            callbackURL: "/dashboard",
        });
        if (result.error) {
            setError(result.error.message ?? "GitHub sign-in is unavailable.");
        }
    }

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
            <Card className="w-full max-w-xl border-border bg-card/80">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl">Sign in</CardTitle>
                    <p className="text-sm text-muted-foreground">Use a one-time email code or continue with GitHub.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <form className="flex flex-col gap-5" onSubmit={requestCode}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email address</FieldLabel>
                                <div className="relative">
                                    <Mail className="pointer-events-none absolute left-3 top-2.5 size-4 text-muted-foreground" />
                                    <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" className="pl-9" value={email} onChange={(event) => setEmail(event.target.value)} required />
                                </div>
                                <FieldDescription>We will send a one-time sign-in code.</FieldDescription>
                            </Field>
                        </FieldGroup>

                        {error && <Alert variant="destructive"><AlertDescription>{error}</AlertDescription></Alert>}
                        <Button className="w-full" type="submit" disabled={pending}>
                            {pending ? "Sending code..." : "Send verification code"}
                        </Button>
                    </form>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            <span className="bg-background px-2">or</span>
                        </div>
                    </div>

                    <Button className="w-full" variant="outline" type="button" onClick={signInWithGitHub}>
                        <SiGithub className="mr-2 size-4" />
                        Continue with GitHub
                    </Button>

                    <div className="flex items-center justify-between pt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <LockKeyhole className="h-4 w-4" />
                            Passwordless by design
                        </div>
                        <Link to="/auth/signup" className="font-medium text-primary hover:underline">
                            Create account
                        </Link>
                    </div>

                    <Alert className="border-primary/30 bg-primary/5">
                        <GitBranch className="h-4 w-4 text-primary" />
                        <AlertDescription>
                            GitHub is treated as a first-class auth provider, not a profile-only connection.
                        </AlertDescription>
                    </Alert>
                </CardContent>
            </Card>
        </div>
    );
}
