import { BecomingDigital } from "@/components/landing/becoming-digital";
import { BeyondCompliance } from "@/components/landing/beyond-compliance";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Hero } from "@/components/landing/hero";
import { Industries } from "@/components/landing/industries";
import { PlatformPillars } from "@/components/landing/platform-pillars";
import { ProductIntelligence } from "@/components/landing/product-intelligence";
import { WhatsNext } from "@/components/landing/whats-next";

export default function LandingPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <Hero />
      <BecomingDigital />
      <PlatformPillars />
      <WhatsNext />
      <BeyondCompliance />
      <ProductIntelligence />
      <Industries />
      <FinalCta />
      <Footer />
    </div>
  );
}
