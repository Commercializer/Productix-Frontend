import {
  ArrowRight,
  BarChart3,
  ClipboardList,
  Database,
  FileCheck,
  Fingerprint,
  FileText,
  FolderOpen,
  Globe,
  Layers,
  Leaf,
  LifeBuoy,
  Link2,
  Package,
  Palette,
  Recycle,
  Route,
  ScanLine,
  ShieldCheck,
  Smartphone,
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
  NumberedSteps,
  SectionHeading,
  Statement,
} from "@/components/landing/detail-sections";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Reveal } from "@/components/landing/reveal";

const CANONICAL = "https://www.productix.io/solutions/digital-product-passport";

export const metadata: Metadata = {
  title: "Digital Product Passport (DPP) Platform | Productix",
  description:
    "Prepare products for the Digital Product Passport with structured product data, digital identity and connected product experiences through Productix.",
  keywords: [
    "Digital Product Passport",
    "DPP platform",
    "DPP solution",
    "DPP readiness",
    "EU Digital Product Passport",
    "digital product identity",
    "product sustainability data",
    "product data platform",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Digital Product Passport | Productix",
    description:
      "Build connected digital product identities with structured product information and experiences designed for the Digital Product Passport era.",
    url: CANONICAL,
    images: [{ url: "/images/becoming-digital.jpg", alt: "Productix Digital Product Passport platform" }],
  },
};

const STRUCTURED_DATA_AREAS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Fingerprint,
    title: "Product Identity",
    description: "GTIN, product identifiers, product name, product category and product model or variant.",
  },
  {
    icon: ClipboardList,
    title: "Product Characteristics",
    description: "Technical specifications, product attributes, dimensions and functional information.",
  },
  {
    icon: Layers,
    title: "Materials & Composition",
    description: "Materials, components, composition and relevant substances.",
  },
  {
    icon: Leaf,
    title: "Sustainability",
    description:
      "Environmental information, resource information, lifecycle-related data and relevant sustainability characteristics.",
  },
  {
    icon: Route,
    title: "Traceability",
    description:
      "Manufacturer information, supply-chain information, production information and relevant lifecycle data.",
  },
  {
    icon: FileCheck,
    title: "Supporting Information",
    description: "Certificates, declarations, technical documents, instructions and supporting files.",
  },
];

const BEYOND_COMPLIANCE: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ShieldCheck, title: "Compliance", description: "Product and sustainability information." },
  { icon: Smartphone, title: "Consumer", description: "Product information and guidance." },
  { icon: Palette, title: "Brand", description: "Storytelling and campaigns." },
  { icon: LifeBuoy, title: "Service", description: "Instructions and support." },
  { icon: ScanLine, title: "Retail", description: "Product information and verification." },
  { icon: BarChart3, title: "Intelligence", description: "Interaction and engagement data." },
];

const READINESS_AREAS = [
  { index: "01", title: "Product Identity", description: "Do your products have appropriate identifiers?" },
  { index: "02", title: "Product Data", description: "Is relevant information available and structured?" },
  {
    index: "03",
    title: "Materials & Composition",
    description: "Can the required product composition information be provided?",
  },
  { index: "04", title: "Sustainability & Lifecycle", description: "Is relevant information available?" },
  { index: "05", title: "Traceability", description: "Can relevant information be connected to the product?" },
  {
    index: "06",
    title: "Digital Connectivity",
    description: "Can the product be accessed through a persistent digital identity?",
  },
];

const ENTERPRISE_SEGMENTS = [
  "Manufacturers",
  "Exporters",
  "Brands & Product Companies",
  "Packaging & Supply Chain Organizations",
  "Retail & Distribution Networks",
];

export default function DigitalProductPassportPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="Digital Product Passport"
        title="Build the Digital Foundation for Your Products."
        description="Prepare your products for the Digital Product Passport era with structured product data, trusted digital identity and connected product experiences - all through one platform."
        pills={["Product Identity", "Product Data", "GS1 Digital Link", "DPP", "Connected Experience"]}
        primary={{ label: "Assess Your DPP Readiness", href: "/book-a-demo" }}
        secondary={{ label: "Explore Productix Connect", href: "/platform/connect" }}
      />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="The Shift to Digital Products"
          title="Products Are Becoming More Transparent, Traceable and Connected."
          description="The European regulatory landscape is driving a shift toward digital product information. Products will increasingly need a persistent digital identity and accessible information covering areas such as materials, sustainability, traceability and lifecycle characteristics."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "Physical Product", icon: Package },
              { label: "Digital Identity", icon: Fingerprint },
              { label: "Structured Product Data", icon: Database },
              { label: "Digital Product Passport", icon: FileText },
              { label: "Accessible Product Information", icon: Globe },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-12">
          <Statement>
            The DPP is not simply a document. It is part of a connected digital product ecosystem.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="The Productix Approach"
          title="Build Your DPP Around a Connected Product Identity."
          description="Productix brings product identity, structured product data and digital experiences together so enterprises can build a scalable foundation for applicable DPP requirements."
        />
        <div className="mt-14">
          <NumberedSteps
            steps={[
              {
                index: "01",
                title: "Identify",
                description: "Create a persistent digital identity for your product.",
                tag: "GTIN · Product Identifier · GS1 Digital Link",
              },
              {
                index: "02",
                title: "Structure",
                description: "Organize the product information associated with that identity.",
                tag: "Product Data · Materials · Composition · Sustainability · Traceability",
              },
              {
                index: "03",
                title: "Connect",
                description: "Make relevant product information accessible through a connected digital destination.",
                tag: "QR / 2D Code · Digital Link · Digital Product Experience",
              },
              {
                index: "04",
                title: "Evolve",
                description: "Maintain and update product information as products, markets and requirements change.",
                tag: "Updates · Documents · Languages · Experiences",
              },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Structured Product Data"
          title="One Product Record. Multiple Information Layers."
          description="Productix can organize DPP relevant information into structured product data."
        />
        <div className="mt-14">
          <IconGrid items={STRUCTURED_DATA_AREAS} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Connected Product Identity"
          title="Connect the Product to Its Digital Passport."
          description="Productix uses a standards oriented product identity architecture to connect physical products with their digital information."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Product", icon: Package },
              { label: "GS1 Digital Link", icon: Link2 },
              { label: "Productix", icon: Database },
            ]}
          />
        </div>
        <div className="mt-12">
          <BranchDiagram
            root={{ label: "Productix", icon: Database }}
            branches={[
              { label: "Product Information", icon: FileText },
              { label: "DPP Information", icon: FileCheck },
              { label: "Compliance Data", icon: ShieldCheck },
              { label: "Documents", icon: FolderOpen },
              { label: "Digital Experience", icon: Smartphone },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Beyond Compliance"
          title="Turn Your DPP Into a Product Experience."
          description="A digital product passport can provide more than regulatory information. The same connected product identity can become a channel for customers, retailers, service teams and other stakeholders."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          One identity. Multiple experiences.
        </p>
        <div className="mt-6">
          <IconGrid items={BEYOND_COMPLIANCE} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
        <Reveal delay={120} className="mt-12">
          <Statement>Build once. Create value across the product lifecycle.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Living Product Data"
          title="Your Product Data Should Evolve With Your Product."
          description="Products change. Information changes. Markets change. Productix allows connected product information to be maintained and updated without rebuilding the physical connection."
        />
        <div className="mt-12">
          <CheckList
            items={[
              "Update product information",
              "Add documentation",
              "Update sustainability information",
              "Add languages",
              "Change digital experiences",
              "Publish new content",
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>Update the digital layer without reprinting the physical product.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="DPP Readiness"
          title="Know What You Need Before You Build."
          description="DPP requirements can differ depending on product category, market and the role of the organization in the value chain. Productix can help enterprises assess their current product data and identify the digital infrastructure needed for their journey."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Assessment framework
        </p>
        <div className="mt-8">
          <NumberedSteps steps={READINESS_AREAS} />
        </div>
        <Reveal delay={150} className="mt-12 flex justify-center">
          <div className="glass-light flex flex-col items-center gap-4 rounded-3xl px-8 py-8 text-center">
            <p className="text-[17px] font-medium text-ink">Productix DPP Readiness Assessment</p>
            <Link
              href="/book-a-demo"
              className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-[14px] font-semibold text-navy transition-colors hover:bg-teal"
            >
              Start Your DPP Readiness Assessment
            </Link>
          </div>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="One Foundation. More Possibilities."
          title="Start With DPP. Expand When You're Ready."
          description="Productix is designed so your DPP foundation can become the starting point for a broader connected product strategy."
        />
        <div className="mt-14">
          <BranchDiagram
            root={{ label: "Digital Product Identity", icon: Fingerprint }}
            branches={[
              { label: "PPWR", icon: Recycle, items: ["Packaging Data"] },
              { label: "Experience", icon: Smartphone, items: ["Customer Experience"] },
              { label: "Intelligence", icon: BarChart3, items: ["Analytics", "Feedback"] },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <p className="mx-auto max-w-xl text-center text-[14px] leading-relaxed text-ink/60">
            Start with the requirements that matter today. Expand into connected experiences, packaging
            intelligence and product analytics as your business evolves.
          </p>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="For Product-Based Enterprises"
          title="Designed for Businesses Preparing Products for European Markets."
        />
        <p className="mt-10 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Particularly relevant to:
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          {ENTERPRISE_SEGMENTS.map((segment) => (
            <span
              key={segment}
              className="glass-light rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink/70"
            >
              {segment}
            </span>
          ))}
        </div>
        <div className="mt-8 flex justify-center">
          <Link
            href="/industries"
            className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-ink/70 transition-colors hover:text-ink"
          >
            Explore Industries
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </DetailSection>

      <DetailCta
        title="Is Your Product Ready for the DPP Era?"
        description="Assess your product identity, data and digital readiness with Productix."
        primary={{ label: "Assess Your DPP Readiness", href: "/book-a-demo" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      <Footer />
    </div>
  );
}
