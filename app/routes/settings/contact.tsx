import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building2, Globe2 } from "lucide-react";

export default function ContactSettingsPage() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <Card className="border-border bg-card/80">
                <CardHeader>
                    <CardTitle className="text-3xl">Contact and WHOIS data</CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="fullName" className="text-sm font-medium">Full name</label>
                            <Input id="fullName" defaultValue="Alex Morgan" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="organization" className="text-sm font-medium">Organization</label>
                            <Input id="organization" defaultValue="DER Studio" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">Email</label>
                            <Input id="email" type="email" defaultValue="alex@der.my.id" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="phone" className="text-sm font-medium">Phone</label>
                            <Input id="phone" defaultValue="+1 555 101 1234" />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="address" className="text-sm font-medium">Address</label>
                            <Input id="address" defaultValue="1 Registry Lane" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="city" className="text-sm font-medium">City</label>
                            <Input id="city" defaultValue="Seattle" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="state" className="text-sm font-medium">State or province</label>
                            <Input id="state" defaultValue="Washington" />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="postalCode" className="text-sm font-medium">Postal code</label>
                            <Input id="postalCode" defaultValue="98101" />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
                        <Building2 className="h-4 w-4 text-primary" />
                        Registry-style contact information is stored separately from the identity records used for sign-in.
                    </div>

                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        <Globe2 className="h-4 w-4 text-primary" />
                        This data is prepared for later use with domain registration and ownership flows.
                    </div>

                    <Button type="button">Save contact details</Button>
                </CardContent>
            </Card>
        </div>
    );
}
