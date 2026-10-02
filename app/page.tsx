import Link from "next/link";

import { HomeFeatures, HomeHero, HomeSteps } from "@/components/home/landing-page";
import { PublicPage } from "@/components/site-shell";
import { Button } from "@/components/ui/button";

export const revalidate = 300;

export default function Home() {
  return (
    <PublicPage
      title="Free domains for builders and communities"
      description="Launch a clean, memorable online identity with a .der.my.id domain and a dashboard built for fast management."
      active="/"
      actions={
        <>
          <Button asChild variant="outline">
            <Link href="/domains/check">Check a domain</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Get started</Link>
          </Button>
        </>
      }
    >
      <HomeHero />
      <HomeFeatures />
      <HomeSteps />
    </PublicPage>
  );
}
