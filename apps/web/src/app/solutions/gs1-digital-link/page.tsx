import {
  ArrowRight,
  Building2,
  FileText,
  Globe,
  Layers,
  Link2,
  Package,
  Route,
  ScanLine,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  BranchDiagram,
  CheckList,
  DetailCta,
  DetailHero,
  DetailSection,
  FlowSteps,
  IconGrid,
  SectionHeading,
  Statement,
} from "@/components/landing/detail-sections";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Reveal } from "@/components/landing/reveal";

const CANONICAL = "https://www.productix.io/solutions/gs1-digital-link";

export const metadata: Metadata = {
  title: "GS1 Digital Link Platform | Product Identity & 2D Barcodes",
  description:
    "Connect products to digital information with GS1 Digital Link. Build trusted product identities and prepare for the GS1 2D barcode and Sunrise 2027 transition.",
  keywords: [
    "GS1 Digital Link",
    "GS1 Digital Link platform",
    "GS1 2D barcode",
    "GS1 Digital Link implementation",
    "digital product identity",
    "product identification",
    "Sunrise 2027",
    "2D barcode transition",
    "QR code powered by GS1 Digital Link",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "GS1 Digital Link | Connect Products to the Digital World",
    description:
      "Build connected product identities with GS1 Digital Link and prepare for the global transition to GS1-powered 2D barcodes and Sunrise 2027.",
    url: CANONICAL,
    images: [{ url: "/images/becoming-digital.jpg", alt: "Productix GS1 Digital Link connected product identity" }],
  },
};

function PillRow({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap justify-center gap-1.5">
      {items.map((item) => (
        <span
          key={item}
          className="glass-light rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink/70"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

const BEYOND_BARCODE: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ScanLine, title: "Identify", description: "More capable product identification." },
  {
    icon: FileText,
    title: "Inform",
    description: "Connect customers and partners to richer product information.",
  },
  {
    icon: ShieldCheck,
    title: "Comply",
    description: "Support emerging information requirements and digital product initiatives.",
  },
  { icon: Sparkles, title: "Engage", description: "Create connected product experiences." },
];

export default function Gs1DigitalLinkPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="GS1 Digital Link · Sunrise 2027"
        title="Connect Every Product to the Digital World."
        description="Turn GS1 product identifiers into connected digital experiences with GS1 Digital Link - linking physical products to trusted product information, compliance data, digital experiences and more."
        pills={["GTIN", "GS1 Digital Link", "2D Barcodes", "DPP", "Connected Product"]}
        primary={{ label: "Build Your Digital Link", href: "/book-a-demo" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Sunrise 2027 · The Global 2D Transition"
          title="The Barcode Is Evolving. Is Your Product Ready?"
          description="The global retail ecosystem is moving from traditional linear barcodes toward more capable 2D barcodes. GS1's Ambition 2027 aims for retail POS systems around the world to be capable of reading and processing GS1 standard 2D barcodes by the end of 2027."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Today", icon: ScanLine, sublabels: ["1D Barcode", "Product Identification"] },
              {
                label: "The Transition",
                sublabels: ["1D + 2D", "Identification + Digital Connection"],
              },
              {
                label: "The Future",
                icon: Sparkles,
                sublabels: ["2D Barcode", "Identity + Data + Digital Experiences"],
              },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            Sunrise 2027 isn&rsquo;t simply a barcode upgrade. It&rsquo;s a transition toward a more
            connected product ecosystem.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Global Industry Momentum"
          title="The Transition Has Already Started."
          description="Brands, retailers, technology providers and GS1 organizations around the world are already testing and deploying next-generation 2D barcode solutions. GS1 reports that companies are testing next-generation barcodes in more than 45 countries, representing approximately 85% of global GDP, with pilots and initiatives spanning Europe, the US, China, Australia and African markets."
        />
        <div className="mt-12">
          <Reveal>
            <PillRow items={["Europe", "USA", "China", "Australia", "Africa", "Global Retail"]} />
          </Reveal>
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            The question is moving from &ldquo;Should we adopt 2D?&rdquo; to &ldquo;How do we
            prepare?&rdquo;
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Beyond the Barcode"
          title="One Scan Can Do More."
          description="Next-generation 2D barcodes can carry richer GS1 data and, when using GS1 Digital Link URI syntax, connect products to web based information and services."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Four benefits
        </p>
        <div className="mt-6">
          <IconGrid items={BEYOND_BARCODE} columns="sm:grid-cols-2 lg:grid-cols-4" />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>From identifying products to connecting products.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="The GS1 Digital Link Model"
          title="A GTIN Identifies the Product. GS1 Digital Link Connects It."
          description="GS1 Digital Link extends the value of a GS1 identifier into the web, allowing the product identity to become a gateway to digital information and services."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Product", icon: Package },
              { label: "GTIN", icon: ScanLine },
              { label: "GS1 Digital Link", icon: Link2 },
              { label: "Digital World", icon: Globe },
            ]}
          />
        </div>
        <div className="mt-12">
          <BranchDiagram
            root={{ label: "Digital World", icon: Globe }}
            branches={[
              { label: "Product Data" },
              { label: "DPP Information" },
              { label: "Experience Content" },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>One product identity. Multiple digital possibilities.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Productix + GS1 Digital Link"
          title="Build Your Connected Product Layer on a GS1 Foundation."
          description="Productix provides the digital infrastructure around your connected product identity helping enterprises connect identifiers with structured product information, digital experiences and intelligence."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "GTIN", icon: ScanLine },
              { label: "GS1 Digital Link", icon: Link2 },
              { label: "Productix", icon: Layers },
            ]}
          />
        </div>
        <div className="mt-12">
          <BranchDiagram
            root={{ label: "Productix", icon: Layers }}
            branches={[
              { label: "DPP", icon: FileText, items: ["Product Data"] },
              { label: "Compliance", icon: ShieldCheck, items: ["Information"] },
              { label: "Experience", icon: Sparkles, items: ["Brand Content"] },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            GS1 provides the standard. Productix provides the connected product infrastructure.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Digital Product Passport"
          title="Connect Product Identity With Digital Product Information."
          description="GS1 Digital Link can provide a standards-based connection between a product's GS1 identity and digital information, including applicable Digital Product Passport information."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Product", icon: Package },
              { label: "GTIN", icon: ScanLine },
              { label: "GS1 Digital Link", icon: Link2 },
              { label: "Productix", icon: Layers },
              {
                label: "DPP",
                icon: FileText,
                sublabels: [
                  "Product Information",
                  "Sustainability",
                  "Materials",
                  "Traceability",
                  "Supporting Information",
                ],
              },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Prepare Now · Scale Into 2027"
          title="Don't Wait for the Sunrise. Build for It."
          description="The transition to 2D is gradual, giving businesses time to test, adapt and prepare. Productix helps enterprises establish the digital foundation before 2D becomes the norm across retail environments."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          A simple roadmap
        </p>
        <div className="mt-6">
          <FlowSteps
            steps={[
              {
                label: "2026 · Prepare",
                sublabels: [
                  "Review product identifiers",
                  "Structure product data",
                  "Establish Digital Link architecture",
                  "Pilot connected products",
                ],
              },
              {
                label: "2027 · Transition",
                sublabels: [
                  "Expand 2D adoption",
                  "Integrate retail workflows",
                  "Scale connected products",
                ],
              },
              {
                label: "Post-2027 · Scale",
                sublabels: [
                  "Richer product information",
                  "Connected experiences",
                  "Compliance use cases",
                  "Product intelligence",
                ],
              },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            Prepare the digital layer today. Scale the connected product ecosystem tomorrow.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Connected Digital Services"
          title="One Product Identity. More Than One Destination."
        />
        <div className="mt-14">
          <BranchDiagram
            root={{ label: "GS1 Digital Link", icon: Link2 }}
            branches={[
              { label: "Product Data", icon: FileText, items: ["Specifications", "Instructions", "Documents"] },
              { label: "DPP", icon: ShieldCheck, items: ["Sustainability", "Materials", "Traceability"] },
              { label: "Experience", icon: Sparkles, items: ["Brand Story", "Campaigns", "Feedback"] },
            ]}
          />
        </div>
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Also part of the connected layer
        </p>
        <div className="mt-6">
          <Reveal>
            <PillRow
              items={[
                "Service & Support",
                "Authentication",
                "Product Registration",
                "Sustainability Information",
                "Consumer Information",
              ]}
            />
          </Reveal>
        </div>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="The Digital Layer Can Evolve"
          title="Keep the Product Connected as Information Changes."
          description="Your physical packaging shouldn't have to change every time your digital product information changes. With an appropriately implemented Digital Link architecture, the digital destination can evolve while the product identity remains consistent."
        />
        <div className="mt-12">
          <CheckList
            items={[
              "New product information",
              "Updated documentation",
              "New language",
              "New campaign",
              "Updated compliance information",
              "New digital service",
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>The physical identity stays. The digital experience evolves.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Connected Product Intelligence"
          title="See What Happens After the Scan."
          description="Once products become digitally connected, interactions can provide valuable insight into how products are being accessed and experienced."
        />
        <div className="mt-12">
          <Reveal>
            <PillRow
              items={["Country", "Product", "Device", "Browser", "Visitor engagement", "Feedback"]}
            />
          </Reveal>
        </div>
        <Reveal delay={120} className="mt-10 flex justify-center">
          <Link
            href="/solutions/product-intelligence"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-brand-accent-dim transition-colors hover:text-brand-accent"
          >
            Explore Product Intelligence
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="From Pilot to Product Portfolio"
          title="Start With One Product. Scale Across Your Portfolio."
          description="Build, test and expand your connected product infrastructure across products, brands, markets and packaging formats."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "One Product", icon: Package },
              { label: "Pilot", icon: Route },
              { label: "Product Family", icon: Layers },
              { label: "Brand Portfolio", icon: Building2 },
              { label: "Global Product Ecosystem", icon: Globe },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>Prepare once. Scale across your product portfolio.</Statement>
        </Reveal>
      </DetailSection>

      <DetailCta
        title="Build Your Digital Link Foundation."
        description="Prepare your products for the transition to connected 2D experiences and build a digital infrastructure that can evolve beyond the barcode."
        primary={{ label: "Build Your Digital Link", href: "/book-a-demo" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      <Footer />
    </div>
  );
}
