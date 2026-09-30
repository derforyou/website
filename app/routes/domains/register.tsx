import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle2, Search, ShieldCheck } from "lucide-react";

export default function RegisterDomainPage() {
    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <Card className="border-border bg-card/80">
                <CardHeader>
                    <CardTitle className="text-3xl">Register a subdomain</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <label htmlFor="subdomain" className="text-sm font-medium">Requested subdomain</label>
                        <div className="flex gap-3">
                            <Input id="subdomain" placeholder="alex" className="flex-1" />
                            <Button type="button" variant="outline" className="gap-2">
                                <Search className="h-4 w-4" />
                                Check availability
                            </Button>
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label htmlFor="domain-zone" className="text-sm font-medium">Domain zone</label>
                            <Select defaultValue="der.my.id">
                                <SelectTrigger id="domain-zone" className="w-full">
                                    <SelectValue placeholder="Select a zone" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="der.my.id">der.my.id</SelectItem>
                                    <SelectItem value="registry.der.my.id">registry.der.my.id</SelectItem>
                                    <SelectItem value="dev.der.my.id">dev.der.my.id</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="registration-notes" className="text-sm font-medium">Registration notes</label>
                            <Textarea id="registration-notes" placeholder="Optional use case or deployment note" className="min-h-[42px]" />
                        </div>
                    </div>

                    <Alert className="border-primary/30 bg-primary/5">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        <AlertDescription>
                            Availability is checked server-side before registration is finalized.
                        </AlertDescription>
                    </Alert>

                    <div className="space-y-2 rounded-lg border border-border bg-background p-4">
                        <div className="text-sm uppercase tracking-[0.2em] text-muted-foreground">Preview</div>
                        <div className="text-2xl font-semibold">alex.der.my.id</div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        Ownership is recorded on the server and validated for all domain management actions.
                    </div>

                    <Button type="button" className="w-full">
                        Register domain
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
