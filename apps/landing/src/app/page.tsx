import { CaseStudies } from "@/components/landing/case-studies";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Industries } from "@/components/landing/industries";
import { Manifesto } from "@/components/landing/manifesto";
import { Security } from "@/components/landing/security";
import { SolutionsList } from "@/components/landing/solutions-list";
import { Stats } from "@/components/landing/stats";
import { TrustMarquee } from "@/components/landing/trust-marquee";
import { Vision } from "@/components/landing/vision";

export default function LandingPage() {
  return (
    <div className="min-h-[100dvh] bg-paper text-ink antialiased">
      <Header />
      <Hero />
      <TrustMarquee />
      <Manifesto />
      <SolutionsList />
      <CaseStudies />
      <Industries />
      <Stats />
      <Vision />
      <Security />
      <FinalCta />
      <Footer />
    </div>
  );
}
