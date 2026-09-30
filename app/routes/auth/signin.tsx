import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SiGithub } from "@icons-pack/react-simple-icons";
import { GitBranch, LockKeyhole, Mail } from "lucide-react";
import { Link } from "react-router";

export default function SignInPage() {
    return (
        <div className="mx-auto flex min-h-screen max-w-5xl items-center justify-center px-6 py-10">
            <Card className="w-full max-w-xl border-border bg-card/80">
                <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl">Sign in</CardTitle>
                    <p className="text-sm text-muted-foreground">Use a one-time email code or continue with GitHub.</p>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium">Email</label>
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input id="email" type="email" placeholder="you@der.my.id" className="pl-9" />
                        </div>
                    </div>

                    <Button className="w-full" type="button">
                        Send verification code
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase tracking-[0.2em] text-muted-foreground">
                            <span className="bg-background px-2">or</span>
                        </div>
                    </div>

                    <Button className="w-full" variant="outline" type="button">
                        <SiGithub className="mr-2 h-4 w-4" />
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
