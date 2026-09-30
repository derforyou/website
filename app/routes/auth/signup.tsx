import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowRight, CheckCircle2, Mail, ShieldCheck } from "lucide-react";
import { Link } from "react-router";

export default function SignUpPage() {
    return (
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
            <Card className="w-full max-w-xl border-border bg-card/80">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl">Create your account</CardTitle>
                    <p className="text-sm text-muted-foreground">Use one-time email verification and follow it with a secure sign-in flow.</p>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="space-y-2">
                        <label htmlFor="fullName" className="text-sm font-medium">Full name</label>
                        <Input id="fullName" placeholder="Alex Morgan" />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" placeholder="alex@der.my.id" className="pl-9" />
                        </div>
                    </div>

                    <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-primary" />
                            The verification code is short-lived and single-use.
                        </div>
                    </div>

                    <Button className="w-full gap-2" type="button">
                        Start email verification
                        <ArrowRight className="h-4 w-4" />
                    </Button>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        GitHub OAuth is supported for the same account flow.
                    </div>

                    <div className="flex justify-between text-sm text-muted-foreground">
                        <Link to="/auth/signin" className="font-medium text-primary hover:underline">
                            Already have an account?
                        </Link>
                        <Link to="/auth/verify" className="font-medium text-primary hover:underline">
                            Verify code
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
