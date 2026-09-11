import {
  FileText,
  Fingerprint,
  Globe,
  Layers,
  LifeBuoy,
  Link2,
  Megaphone,
  Package,
  QrCode,
  Radio,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

import {
  DetailCta,
  DetailHero,
  DetailSection,
  FlowSteps,
  IconGrid,
  NumberedSteps,
  SectionHeading,
} from "@/components/landing/detail-sections";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

const CANONICAL = "https://www.productix.io/platform/connect";

export const metadata: Metadata = {
  title: "Connected Product Platform | Product Identity & GS1 Digital Link",
  description:
    "Connect physical products to trusted digital identities with GTINs, GS1 Digital Link and QR or 2D codes through Productix.",
  keywords: [
    "connected product platform",
    "digital product identity",
    "product identity platform",
    "connected products",
    "GS1 Digital Link",
    "GTIN",
    "2D barcode",
    "connected packaging",
    "digital product identification",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Connect | Connected Product Infrastructure | Productix",
    description:
      "Create trusted digital identities for physical products and connect them to digital experiences through GS1 Digital Link and 2D codes.",
    url: CANONICAL,
    images: [{ url: "/images/becoming-digital.jpg", alt: "Productix connected product identity infrastructure" }],
  },
};

const CONNECTED_PACKAGING: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: FileText,
    title: "Product Information",
    description: "Give customers accurate, up-to-date product information.",
  },
  {
    icon: FileText,
    title: "Instructions & Documentation",
    description: "Extend information beyond what can fit on the physical pack.",
  },
  {
    icon: Layers,
    title: "Sustainability Information",
    description: "Connect relevant material, environmental and lifecycle information.",
  },
  {
    icon: Megaphone,
    title: "Campaigns & Promotions",
    description: "Turn packaging into a channel for engagement.",
  },
  {
    icon: LifeBuoy,
    title: "Product Support",
    description: "Create a direct post-purchase connection.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance Information",
    description: "Provide access to relevant structured product and packaging data.",
  },
];

const EXPAND_USE_CASES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Package,
    title: "Connect Products",
    description: "Give individual products, SKUs and variants a digital identity.",
  },
  {
    icon: QrCode,
    title: "Connect Packaging",
    description: "Turn packaging into a digital access point.",
  },
  {
    icon: FileText,
    title: "Connect Information",
    description: "Make product information accessible beyond the physical label.",
  },
  {
    icon: Globe,
    title: "Connect Markets",
    description: "Serve different information and experiences across markets.",
  },
  {
    icon: Users,
    title: "Connect Stakeholders",
    description:
      "Provide relevant access for consumers, retailers, distributors and other product stakeholders.",
  },
  {
    icon: Layers,
    title: "Connect Future Capabilities",
    description: "Create the foundation for DPP, PPWR, experiences and intelligence.",
  },
];

export default function ConnectPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="Product Identity · Connected Packaging"
        title="Connect Every Product to the Digital World."
        description="Productix Connect gives every product and package a persistent digital identity, built around GS1 Digital Link, creating the foundation for connected product experiences, compliance and intelligence."
        pills={["Built on GS1 standards", "GS1 Digital Link ready", "QR & 2D code compatible", "NFC supported"]}
        primary={{ label: "Book an Assessment", href: "/book-a-demo" }}
        secondary={{ label: "Explore the Productix Platform", href: "/platform" }}
      />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="The Foundation"
          title="Every Connected Product Starts With an Identity."
          description="Physical products have always carried information through labels, packaging and documentation. Productix Connect gives that product a digital identity that can remain connected to the product throughout its journey."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Physical Product", icon: Package },
              { label: "Digital Identity", icon: Fingerprint },
              { label: "Digital Destination", icon: Link2 },
              { label: "Connected Product", icon: Radio },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Standards-Based Identity"
          title="Built Around GS1 Digital Link."
          description="Productix Connect uses GS1 Digital Link as the foundation for connecting GS1 identifiers with digital information and services."
        />
        <div className="mt-14">
          <NumberedSteps
            steps={[
              {
                index: "01",
                title: "Identify",
                description: "Every product starts with its unique product identifier.",
                tag: "GTIN",
              },
              {
                index: "02",
                title: "Connect",
                description: "The identifier becomes a digital link to online resources.",
                tag: "GS1 Digital Link",
              },
              {
                index: "03",
                title: "Experience",
                description: "The same connected identity can serve different audiences and use cases.",
                tag: "Consumers · Retailers · Supply Chain · Compliance",
              },
              {
                index: "04",
                title: "Expand",
                description: "Additional Productix capabilities can be activated around the same identity.",
                tag: "Compliance · Experience · Intelligence",
              },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Connected Packaging"
          title="Make Your Packaging a Digital Touchpoint."
          description="Turn existing packaging into a connected channel without changing the way your products are manufactured or distributed."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          What can the package connect to?
        </p>
        <div className="mt-6">
          <IconGrid items={CONNECTED_PACKAGING} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Built to Expand"
          title="Connect Once. Expand Without Starting Over."
          description="Start with the digital identity your products need today. Add new capabilities as your business, markets and regulatory requirements evolve."
        />
        <div className="mt-14">
          <IconGrid items={EXPAND_USE_CASES} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </DetailSection>

      <DetailCta
        title="Start With Your Product Identity."
        description="Build the connected foundation your products can grow on."
        primary={{ label: "Book an Assessment", href: "/book-a-demo" }}
        secondary={{ label: "Explore Compliance", href: "/platform/compliance" }}
      />

      <Footer />
    </div>
  );
}
