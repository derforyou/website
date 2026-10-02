import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const pillars = [
  { title: "Built for identity", description: "Short, human-friendly domains for projects, portfolios, and communities." },
  { title: "Transparent policies", description: "Clear domain terms backed by open documentation and a straightforward review flow." },
  { title: "Operator-friendly", description: "A guided dashboard for status, submissions, DNS, and ownership management." },
];

export function AboutPillarsSection() {
  return (
    <section className="grid gap-6 lg:grid-cols-3">
      {pillars.map((pillar) => (
        <Card key={pillar.title}>
          <CardHeader>
            <CardTitle>{pillar.title}</CardTitle>
            <CardDescription>{pillar.description}</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </section>
  );
}