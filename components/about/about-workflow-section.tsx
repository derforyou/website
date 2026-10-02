const workflow = [
  {
    step: "01",
    title: "Choose a name",
    description: "Check a label and send a registration request from your account.",
  },
  {
    step: "02",
    title: "Manage ownership",
    description: "Keep registrant contact details and domain status together in one dashboard.",
  },
  {
    step: "03",
    title: "Connect DNS",
    description: "Use shared DNS for a managed setup or delegate to custom nameservers.",
  },
];

export function AboutWorkflowSection() {
  return (
    <section className="mt-12 border-t border-border pt-8">
      <div className="mb-6 max-w-2xl">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">A clear path to launch</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">From a name to a working domain.</h2>
        <p className="mt-3 text-muted-foreground">
          Registration, ownership, and DNS stay connected, so each step is easy to understand and manage.
        </p>
      </div>
      <ol className="grid gap-6 md:grid-cols-3">
        {workflow.map((item) => (
          <li key={item.step} className="border-l-2 border-primary/40 pl-4">
            <p className="text-sm font-semibold text-primary">{item.step}</p>
            <h3 className="mt-2 font-semibold">{item.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}