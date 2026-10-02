const steps = [
  { number: "01", title: "Choose your name", body: "Find a name that represents you or your project." },
  { number: "02", title: "Register it", body: "Create an account and submit your domain request." },
  { number: "03", title: "Make it yours", body: "Manage your domain and point it to your destination." },
];

export function HowItWorksSection() {
  return (
    <section className="border-y bg-muted/40">
      <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 className="text-3xl font-bold tracking-tight">From idea to online</h2>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {steps.map((step) => (
            <article className="border-t-2 border-primary pt-5" key={step.number}>
              <p className="text-sm font-semibold text-muted-foreground">{step.number}</p>
              <h3 className="mt-3 text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">{step.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}