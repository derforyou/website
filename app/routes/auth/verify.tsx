import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp";
import { authClient } from "@/lib/auth-client";
import {
    clearOtpSession,
    readOtpSession,
    rememberOtpResend,
    rememberOtpRetry,
    SIGNUP_NAME_KEY,
} from "@/lib/auth-otp-session";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { toast } from "sonner";

export default function VerifyPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isSignUp = searchParams.get("flow") === "signup";
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [pending, setPending] = useState(false);
    const [resending, setResending] = useState(false);
    const [emailRestored, setEmailRestored] = useState(false);
    const [resendAt, setResendAt] = useState(0);
    const [now, setNow] = useState(Date.now());

    useEffect(() => {
        const pendingOtp = readOtpSession();
        if (!pendingOtp) return;

        setEmail(pendingOtp.email);
        setEmailRestored(true);
        setResendAt(pendingOtp.resendAt);
    }, []);

    useEffect(() => {
        if (!resendAt) return;

        const timer = window.setInterval(() => setNow(Date.now()), 1000);
        return () => window.clearInterval(timer);
    }, [resendAt]);

    const resendSeconds = Math.max(0, Math.ceil((resendAt - now) / 1000));

    async function verifyCode(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setPending(true);
        try {
            const result = await authClient.signIn.emailOtp({
                email,
                otp,
                ...(isSignUp ? { name: sessionStorage.getItem(SIGNUP_NAME_KEY) ?? undefined } : {}),
            });
            if (result.error) {
                toast.error(result.error.message ?? "The verification code could not be accepted.");
                return;
            }
            clearOtpSession();
            toast.success(isSignUp ? "Account created successfully." : "Signed in successfully.");
            navigate("/dashboard");
        } catch {
            toast.error("The verification code could not be accepted. Please try again.");
        } finally {
            setPending(false);
        }
    }

    async function resendCode() {
        if (!email || resendSeconds > 0) return;

        setResending(true);
        try {
            const result = await authClient.emailOtp.sendVerificationOtp({
                email,
                type: "sign-in",
            });
            if (result.error) {
                const retryAt = rememberOtpRetry(result.error.message ?? "");
                if (retryAt) setResendAt(retryAt);
                toast.error(result.error.message ?? "Unable to resend the verification code.");
                return;
            }

            const nextResendAt = rememberOtpResend(email);
            setResendAt(nextResendAt);
            setOtp("");
            toast.success("A new verification code was sent.");
        } catch {
            toast.error("Unable to resend the verification code. Please try again.");
        } finally {
            setResending(false);
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
                                <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" value={email} onChange={(event) => setEmail(event.target.value)} readOnly={emailRestored} required />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="otp">Verification code</FieldLabel>
                                <InputOTP id="otp" maxLength={6} pattern={REGEXP_ONLY_DIGITS} value={otp} onChange={setOtp} autoComplete="one-time-code" aria-label="6-digit verification code" disabled={pending}>
                                    <InputOTPGroup>
                                        <InputOTPSlot index={0} />
                                        <InputOTPSlot index={1} />
                                        <InputOTPSlot index={2} />
                                        <InputOTPSlot index={3} />
                                        <InputOTPSlot index={4} />
                                        <InputOTPSlot index={5} />
                                    </InputOTPGroup>
                                </InputOTP>
                                <FieldDescription>Codes expire five minutes after they are issued.</FieldDescription>
                            </Field>
                        </FieldGroup>

                        <Button className="w-full" type="submit" disabled={pending || otp.length !== 6}>
                            {pending ? "Verifying..." : "Verify and continue"}
                        </Button>
                        <Button className="w-full" type="button" variant="outline" onClick={resendCode} disabled={pending || resending || !email || resendSeconds > 0}>
                            {resending ? "Sending code..." : resendSeconds > 0 ? `Resend code in ${resendSeconds}s` : "Resend verification code"}
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
