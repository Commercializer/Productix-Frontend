import type { Metadata } from "next";

import { ContentCardGrid } from "@/components/landing/content-card-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { IndexHero } from "@/components/landing/index-hero";
import { PLATFORM_PILLARS } from "@/content/platform";

export const metadata: Metadata = {
  title: "Platform",
  description: "Connect, comply, engage and learn from every product with the Productix platform.",
};

export default function PlatformIndexPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <IndexHero
        eyebrow="Platform"
        title="One Platform. Every Product Layer."
        description="Productix connects product identity, compliance, digital experiences and intelligence in one connected infrastructure, giving enterprises a single foundation to manage what their products are, what they contain, how they comply and how they connect with people."
      />
      <section className="bg-cream px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <ContentCardGrid items={PLATFORM_PILLARS} basePath="/platform" columnsClassName="sm:grid-cols-2" />
        </div>
      </section>
      <FinalCta />
      <Footer />
    </div>
  );
}
