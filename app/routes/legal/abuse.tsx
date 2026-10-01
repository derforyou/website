import { Button } from "@/components/ui/button";
import {
    Field,
    FieldDescription,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";

export default function AbuseReportingPage() {
    return (
        <main className="mx-auto grid w-full max-w-5xl gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_minmax(19rem,0.8fr)]">
            <div className="flex flex-col gap-5">
                <div className="flex flex-col gap-3">
                    <p className="text-sm font-medium text-primary">Legal · DERforyou</p>
                    <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">Report abuse</h1>
                    <p className="max-w-xl text-base leading-7 text-muted-foreground">
                        Report phishing, malware, spam, impersonation, security issues, or a rights complaint involving a DERforyou hostname.
                    </p>
                </div>
                <div className="flex flex-col gap-3 border-t pt-5">
                    <h2 className="font-semibold">What to include</h2>
                    <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-6 text-muted-foreground">
                        <li>The hostname and exact URLs involved.</li>
                        <li>A concise description and supporting evidence.</li>
                        <li>Your name, organization (if any), and a reply address.</li>
                        <li>For rights complaints, identify the work/right and your authority to report it.</li>
                    </ul>
                    <p className="text-sm leading-6 text-muted-foreground">
                        Do not send passwords, one-time codes, or unrelated sensitive data. We review reports and may take urgent action where necessary; no fixed response-time service level is offered.
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-5 rounded-lg border bg-card p-5 sm:p-6">
                <div className="flex flex-col gap-1">
                    <h2 className="font-semibold">Contact the abuse desk</h2>
                    <p className="text-sm text-muted-foreground">Email is the monitored reporting channel.</p>
                </div>
                <FieldGroup>
                    <Field>
                        <FieldLabel htmlFor="abuse-hostname">Affected hostname</FieldLabel>
                        <Input id="abuse-hostname" placeholder="example.der.my.id" readOnly />
                        <FieldDescription>Include exact URLs and evidence in your email.</FieldDescription>
                    </Field>
                </FieldGroup>
                <Button asChild>
                    <a href="mailto:hostmaster@der.my.id?subject=DERforyou%20abuse%20report">
                        <Mail data-icon="inline-start" />
                        Email hostmaster@der.my.id
                    </a>
                </Button>
                <p className="text-xs leading-5 text-muted-foreground">
                    Sending an email opens your mail application. Do not use this channel for emergencies requiring immediate assistance from local authorities.
                </p>
            </div>
        </main>
    );
}