import { Globe2, ShieldCheck, SlidersHorizontal } from "lucide-react";

const benefits = [
  {
    icon: Globe2,
    title: "A name that travels",
    description: "Use your domain for a portfolio, a project, or anything you are building.",
  },
  {
    icon: SlidersHorizontal,
    title: "DNS in your hands",
    description: "Point your domain where it needs to go with shared or custom nameservers.",
  },
  {
    icon: ShieldCheck,
    title: "Clear ownership",
    description: "Manage your domains and account from one straightforward dashboard.",
  },
];

export function BenefitsSection() {
  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="max-w-xl">
          <p className="text-sm font-semibold text-primary">Built for your next thing</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight">Simple to start. Yours to shape.</h2>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {benefits.map(({ icon: Icon, title, description }) => (
            <article className="flex gap-4" key={title}>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/15">
                <Icon className="size-5" />
              </div>
              <div>
                <h3 className="font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">{description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}