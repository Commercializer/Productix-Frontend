import { Handshake } from "lucide-react";
import type { Metadata } from "next";

import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { StubPage } from "@/components/landing/stub-page";

export const metadata: Metadata = {
  title: "Partners | Productix",
  description: "Partner with Productix to bring connected product infrastructure to your customers.",
};

export default function PartnersPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />
      <StubPage
        eyebrow="Company"
        title="Partners"
        description="We work with GS1 member organizations, systems integrators and packaging technology partners to bring connected product infrastructure to more brands."
        icon={Handshake}
      />
      <Footer />
    </div>
  );
}
