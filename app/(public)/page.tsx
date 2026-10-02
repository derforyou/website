import { BenefitsSection } from "@/components/home/benefits-section";
import { HeroSection } from "@/components/home/hero-section";
import { NextStepSection } from "@/components/home/next-step-section";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <BenefitsSection />
      <NextStepSection />
    </>
  );
}