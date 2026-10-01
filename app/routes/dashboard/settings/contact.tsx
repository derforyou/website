import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Building2, Globe2 } from "lucide-react";

export default function ContactSettingsPage() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <Card className="border-border bg-card/80">
                <CardHeader>
                    <CardTitle className="text-3xl">Contact and WHOIS data</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                    <FieldGroup>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="fullName">Full name</FieldLabel>
                                <Input id="fullName" autoComplete="name" placeholder="Full name" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="organization">Organization</FieldLabel>
                                <Input id="organization" autoComplete="organization" placeholder="Organization (optional)" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input id="email" type="email" autoComplete="email" placeholder="name@example.com" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                                <Input id="phone" type="tel" autoComplete="tel" placeholder="Phone number (optional)" />
                            </Field>
                        </div>
                        <div className="grid gap-4 md:grid-cols-2">
                            <Field>
                                <FieldLabel htmlFor="address">Address</FieldLabel>
                                <Input id="address" autoComplete="street-address" placeholder="Street address" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="city">City</FieldLabel>
                                <Input id="city" autoComplete="address-level2" placeholder="City" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="state">State or province</FieldLabel>
                                <Input id="state" autoComplete="address-level1" placeholder="State or province" />
                            </Field>
                            <Field>
                                <FieldLabel htmlFor="postalCode">Postal code</FieldLabel>
                                <Input id="postalCode" autoComplete="postal-code" placeholder="Postal code" />
                            </Field>
                        </div>
                        <FieldDescription>Contact profile editing is not connected yet.</FieldDescription>
                    </FieldGroup>

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4 text-primary" />
                        Registry-style contact information is stored separately from the identity records used for sign-in.
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Globe2 className="h-4 w-4 text-primary" />
                        This data is prepared for later use with domain registration and ownership flows.
                    </div>

                    <Button type="button" disabled className="w-fit">Save changes unavailable</Button>
                </CardContent>
            </Card>
        </div>
    );
}
