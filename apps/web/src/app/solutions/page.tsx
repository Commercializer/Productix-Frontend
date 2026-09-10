import type { Metadata } from "next";

import { ContentCardGrid } from "@/components/landing/content-card-grid";
import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { IndexHero } from "@/components/landing/index-hero";
import { SOLUTIONS } from "@/content/solutions";

export const metadata: Metadata = {
  title: "Solutions",
  description: "GS1 Digital Link, Digital Product Passport, PPWR & EPR, connected packaging, product experience and product intelligence.",
};

export default function SolutionsIndexPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <IndexHero
        eyebrow="Solutions"
        title="Ready for What's Next."
        description="Product regulations and product data standards are evolving rapidly. Productix gives enterprises a connected foundation to prepare for emerging requirements while building the digital infrastructure their products will need for the future."
      />
      <section className="bg-cream px-6 pb-24">
        <div className="mx-auto max-w-6xl">
          <ContentCardGrid items={SOLUTIONS} basePath="/solutions" />
        </div>
      </section>
      <FinalCta />
      <Footer />
    </div>
  );
}
