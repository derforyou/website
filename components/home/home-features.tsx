import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Free .der.my.id names",
    description: "Launch a lightweight identity with a memorable domain that fits your project, profile, or portfolio.",
  },
  {
    title: "Fast DNS onboarding",
    description: "Use the shared DNS stack or transition to custom nameservers with a clear, guided workflow.",
  },
  {
    title: "Simple management",
    description: "Monitor approvals, WHOIS data, and domain requests from one dashboard built for operators.",
  },
];

export function HomeFeatures() {
  return (
    <section className="mt-12">
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">Why teams choose der.my.id</p>
        <h2 className="mt-3 text-3xl font-semibold tracking-tight">Fast, simple, and built for real online identities.</h2>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {features.map((feature) => (
          <Card key={feature.title}>
            <CardHeader>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-2 w-16 rounded-full bg-primary/70" />
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}