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
import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

export default function VerifyPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isSignUp = searchParams.get("flow") === "signup";
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [error, setError] = useState("");
    const [pending, setPending] = useState(false);

    async function verifyCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setError("");
        setPending(true);
        try {
            const result = await authClient.signIn.emailOtp({
                email,
                otp,
                ...(isSignUp ? { name: sessionStorage.getItem("der:auth-signup-name") ?? undefined } : {}),
            });
            if (result.error) {
                setError(result.error.message ?? "The verification code could not be accepted.");
                return;
            }
            sessionStorage.removeItem("der:auth-signup-name");
            navigate("/dashboard");
        } catch {
            setError("The verification code could not be accepted. Please try again.");
        } finally {
            setPending(false);
        }
    }

    return (
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
            <Card className="w-full max-w-xl border-border bg-card/80">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl">Verify your email</CardTitle>
                    <p className="text-sm text-muted-foreground">Enter the one-time code sent to your address to continue.</p>
                </CardHeader>
                <CardContent className="space-y-5">
                    <form className="flex flex-col gap-5" onSubmit={verifyCode}>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email address</FieldLabel>
                                <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                                <Input id="otp" inputMode="numeric" autoComplete="one-time-code" placeholder="6-digit code" value={otp} onChange={(event) => setOtp(event.target.value)} minLength={6} maxLength={6} required />
                                <FieldDescription>Codes expire five minutes after they are issued.</FieldDescription>
                            </Field>
                        </FieldGroup>

                        {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
                        <Button className="w-full" type="submit" disabled={pending}>
                            {pending ? "Verifying..." : "Verify and continue"}
                        </Button>
                    </form>

                    <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4 text-primary" />
                            Single-use OTP with a short expiry window.
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            Secure session
                        </div>
                        <Link to="/dashboard" className="font-medium text-primary hover:underline">
                            Open dashboard
                        </Link>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        The code is valid only for a single sign-in or verification event.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
