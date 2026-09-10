import { Newspaper } from "lucide-react";
import type { Metadata } from "next";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { StubPage } from "@/components/landing/stub-page";

export const metadata: Metadata = {
  title: "Insights",
  description: "Notes on connected products, compliance and digital identity from the Productix team.",
};

export default function InsightsPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <StubPage
        eyebrow="Resources"
        title="Insights"
        description="Notes on connected products, compliance, digital identity and where product data standards are heading, from the Productix team."
        icon={Newspaper}
      />
      <Footer />
    </div>
  );
}
