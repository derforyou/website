import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, KeyRound, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

export default function VerifyPage() {
    return (
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
            <Card className="w-full max-w-xl border-border bg-card/80">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl">Verify your email</CardTitle>
                    <p className="text-sm text-muted-foreground">Enter the one-time code sent to your address to continue.</p>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="otp" className="text-sm font-medium">Verification code</label>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4 text-primary" />
                            Single-use OTP with a short expiry window.
                        </div>
                    </div>

                    <Button className="w-full" type="button">
                        Verify and continue
                    </Button>

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
