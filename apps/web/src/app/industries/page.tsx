import type { Metadata } from "next";

import { FinalCta } from "@/components/landing/final-cta";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Industries } from "@/components/landing/industries";

export const metadata: Metadata = {
  title: "Industries",
  description: "Connected product infrastructure for consumer products, industrial & materials, technology & mobility, and healthcare.",
};

export default function IndustriesIndexPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <Industries />
      <FinalCta />
      <Footer />
    </div>
  );
}
