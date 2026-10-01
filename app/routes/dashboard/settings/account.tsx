import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { BadgeCheck, ShieldCheck } from "lucide-react";

export default function AccountSettingsPage() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <Card className="border-border bg-card/80">
                <CardHeader>
                    <CardTitle className="text-3xl">Account configuration</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="displayName">Display name</FieldLabel>
                            <Input id="displayName" autoComplete="name" placeholder="Your name" />
                            <FieldDescription>Account profile editing is not connected yet.</FieldDescription>
                        </Field>
                    </FieldGroup>

                    <div className="rounded-lg border border-border bg-muted/30 p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <BadgeCheck className="h-4 w-4 text-primary" />
                            Authorization is evaluated server-side using role and ownership checks.
                        </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Two-factor authentication is not enabled for this workspace.
                    </div>
                    <Button type="button" disabled className="w-fit">Save changes unavailable</Button>
                </CardContent>
            </Card>
        </div>
    );
}
