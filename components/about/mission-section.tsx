import { Globe2 } from "lucide-react";

export function MissionSection() {
  return (
    <section className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-16 sm:px-6 sm:py-24 md:grid-cols-[0.8fr_1.2fr] md:items-start">
      <div>
        <p className="text-sm font-semibold text-primary">About der.my.id</p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight">A little space to build something big.</h1>
      </div>
      <div className="max-w-2xl">
        <Globe2 className="size-8 text-primary" />
        <p className="mt-5 text-lg leading-8 text-muted-foreground">
          der.my.id makes it easier to give your ideas a home on the internet.
          We provide free subdomains and the tools to manage ownership and DNS
          delegation without getting in the way of what you want to create.
        </p>
      </div>
    </section>
  );
}