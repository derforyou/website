import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertTriangle, Globe2 } from "lucide-react";
import { Link } from "react-router";

export default function RegisterDomainPage() {
    return (
        <div className="mx-auto flex w-full max-w-5xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8">
            <header className="flex flex-col gap-1">
                <h1 className="text-2xl font-semibold tracking-tight">Register a subdomain</h1>
                <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                    Choose a hostname for a development project. Requests are subject to the domain policy and acceptable-use rules.
                </p>
            </header>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
                <form className="flex flex-col gap-6 rounded-lg border bg-card p-5 sm:p-6">
                    <FieldGroup>
                        <Field>
                            <FieldLabel htmlFor="subdomain">Subdomain name</FieldLabel>
                            <div className="flex min-w-0 items-stretch">
                                <Input id="subdomain" placeholder="your-project" autoComplete="off" />
                                <span className="flex shrink-0 items-center border border-l-0 bg-muted px-3 text-sm text-muted-foreground">
                                    .der.my.id
                                </span>
                            </div>
                            <FieldDescription>Use lowercase letters, numbers, and hyphens.</FieldDescription>
                        </Field>
                        <Field>
                            <FieldLabel htmlFor="registration-notes">Project purpose</FieldLabel>
                            <Textarea
                                id="registration-notes"
                                placeholder="Briefly describe the project that will use this hostname."
                                className="min-h-24"
                            />
                            <FieldDescription>Do not include secrets or personal data.</FieldDescription>
                        </Field>
                    </FieldGroup>

                    <Alert>
                        <AlertTriangle />
                        <AlertDescription>
                            Registration submission and live availability checks are not connected yet. A hostname shown as an example is not reserved.
                        </AlertDescription>
                    </Alert>

                    <div className="flex flex-wrap items-center gap-3 border-t pt-5">
                        <Button type="button" disabled>Registration unavailable</Button>
                        <Button asChild type="button" variant="ghost">
                            <Link to="/legal/domain-policy">Review domain policy</Link>
                        </Button>
                    </div>
                </form>

                <aside className="flex flex-col gap-4 border-t pt-5 text-sm lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
                    <div className="flex items-center gap-2 font-medium">
                        <Globe2 />
                        Before you request a name
                    </div>
                    <ul className="flex list-disc flex-col gap-2 pl-5 leading-6 text-muted-foreground">
                        <li>Use a name you have the right to use.</li>
                        <li>Do not impersonate a person, company, or service.</li>
                        <li>Keep the hostname compliant with the acceptable-use policy.</li>
                    </ul>
                    <Link to="/legal/acceptable-use" className="font-medium underline underline-offset-4">
                        Read acceptable use
                    </Link>
                </aside>
            </div>
        </div>
    );
}
