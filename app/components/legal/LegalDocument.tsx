import { Separator } from "@/components/ui/separator";

export type LegalSection = {
    title: string;
    paragraphs?: string[];
    bullets?: string[];
};

export default function LegalDocument({
    title,
    summary,
    sections,
}: {
    title: string;
    summary: string;
    sections: LegalSection[];
}) {
    return (
        <main className="mx-auto w-full max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
            <header className="flex flex-col gap-3">
                <p className="text-sm font-medium text-primary">Legal · DERforyou</p>
                <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{title}</h1>
                <p className="max-w-2xl text-base leading-7 text-muted-foreground">{summary}</p>
                <p className="text-xs text-muted-foreground">Effective 1 October 2026 · Operator: DERforyou · Indonesia</p>
            </header>

            <Separator className="my-8" />

            <div className="flex flex-col gap-8">
                {sections.map((section) => (
                    <section key={section.title} className="flex flex-col gap-3">
                        <h2 className="text-lg font-semibold tracking-tight">{section.title}</h2>
                        {section.paragraphs?.map((paragraph) => (
                            <p key={paragraph} className="text-sm leading-7 text-muted-foreground">{paragraph}</p>
                        ))}
                        {section.bullets && (
                            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm leading-7 text-muted-foreground">
                                {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                            </ul>
                        )}
                    </section>
                ))}
            </div>

            <Separator className="my-8" />
            <p className="text-sm leading-6 text-muted-foreground">
                Questions or requests: <a className="font-medium text-foreground underline underline-offset-4" href="mailto:hostmaster@der.my.id">hostmaster@der.my.id</a>.
            </p>
        </main>
    );
}