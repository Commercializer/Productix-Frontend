import { Building2 } from "lucide-react";
import type { Metadata } from "next";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { StubPage } from "@/components/landing/stub-page";

export const metadata: Metadata = {
  title: "About | Productix",
  description: "Productix builds connected product infrastructure for identity, compliance, experience and intelligence.",
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <StubPage
        eyebrow="Company"
        title="About Productix"
        description="Productix builds connected product infrastructure, giving enterprises one platform to manage product identity, compliance data, digital experiences and intelligence."
        icon={Building2}
      />
      <Footer />
    </div>
  );
}
