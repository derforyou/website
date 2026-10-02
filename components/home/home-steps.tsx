import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function HomeSteps() {
  return (
    <section className="mt-12 grid gap-5 lg:grid-cols-3">
      {[
        { step: "01", title: "Check availability", text: "Search for the label that matches your identity, username, or project." },
        { step: "02", title: "Create an account", text: "Use email or GitHub sign-in and verify your address to continue." },
        { step: "03", title: "Manage and publish", text: "Adjust DNS, track status, and keep your domain aligned with your workflow." },
      ].map((item) => (
        <Card key={item.step} className="bg-muted/20">
          <CardHeader>
            <p className="text-sm font-semibold uppercase tracking-[0.14em] text-primary">{item.step}</p>
            <CardTitle>{item.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{item.text}</p>
          </CardContent>
        </Card>
      ))}
    </section>
  );
}