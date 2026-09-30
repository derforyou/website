import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { KeyRound, ShieldCheck, UserCircle2 } from "lucide-react";
import { Link } from "react-router";

const sections = [
    { title: "Account", href: "/settings/account", icon: UserCircle2, description: "View role, profile, and security configuration." },
    { title: "Contact", href: "/settings/contact", icon: ShieldCheck, description: "Maintain WHOIS and registry-style identity details." },
    { title: "API keys", href: "/settings/api-keys", icon: KeyRound, description: "Create or revoke key pairs for DER SDK consumption." },
];

export default function SettingsPage() {
    return (
        <div className="mx-auto max-w-6xl space-y-6 px-6 py-10">
            <div>
                <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Settings</p>
                <h1 className="mt-3 text-4xl">Account controls</h1>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList className="grid w-full max-w-xl grid-cols-3">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="identity">Identity</TabsTrigger>
                    <TabsTrigger value="keys">Keys</TabsTrigger>
                </TabsList>
                <Separator />
                <TabsContent value="overview">
                    <div className="grid gap-4 md:grid-cols-3">
                        {sections.map(({ title, href, icon: Icon, description }) => (
                            <Link key={title} to={href} className="block">
                                <Card className="border-border bg-card/80 transition hover:border-primary/40">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-2">
                                            <Icon className="h-4 w-4 text-primary" />
                                            {title}
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-sm text-muted-foreground">{description}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="identity">
                    <Card className="border-border bg-card/80">
                        <CardContent className="p-4 text-sm text-muted-foreground">
                            Identity and WHOIS settings sync to the contact profile used for your DER registrations.
                        </CardContent>
                    </Card>
                </TabsContent>
                <TabsContent value="keys">
                    <Card className="border-border bg-card/80">
                        <CardContent className="p-4 text-sm text-muted-foreground">
                            API keys are issued for applications and SDK clients that need scoped access to the DER platform.
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
