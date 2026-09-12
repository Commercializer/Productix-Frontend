import {
  Boxes,
  Building2,
  ClipboardCheck,
  Database,
  FileCheck,
  FileText,
  FolderOpen,
  Globe,
  History,
  Layers,
  Leaf,
  Recycle,
  Route,
  ScanLine,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  DetailCta,
  DetailHero,
  DetailSection,
  FlowSteps,
  IconGrid,
  NumberedSteps,
  SectionHeading,
  Statement,
} from "@/components/landing/detail-sections";
import { ComplianceInMotion } from "@/components/landing/compliance-in-motion";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Reveal } from "@/components/landing/reveal";

const CANONICAL = "https://www.productix.io/platform/compliance";

export const metadata: Metadata = {
  title: "Product Compliance & Packaging Data Platform | Productix",
  description:
    "Structure and connect product and packaging data for DPP, PPWR and EPR requirements through Productix's connected product infrastructure.",
  keywords: [
    "product compliance data",
    "packaging compliance",
    "product compliance platform",
    "DPP data",
    "PPWR data",
    "EPR data",
    "packaging data management",
    "product sustainability data",
    "product regulatory data",
    "digital compliance",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Compliance | Product & Packaging Data | Productix",
    description:
      "Connect structured product and packaging information to support DPP, PPWR, EPR and evolving digital product requirements.",
    url: CANONICAL,
    images: [{ url: "/images/beyond-compliance.jpg", alt: "Productix product and packaging compliance data platform" }],
  },
};

const REQUIREMENTS: { icon: LucideIcon; title: string; subtitle: string; description: string }[] = [
  {
    icon: FileText,
    title: "DPP",
    subtitle: "Digital Product Passport",
    description:
      "Prepare structured product information for applicable Digital Product Passport requirements and connected digital product records.",
  },
  {
    icon: Recycle,
    title: "PPWR",
    subtitle: "Packaging & Packaging Waste Regulation",
    description:
      "Organize packaging-related information to support applicable requirements around packaging composition, materials, recyclability, recycled content and related obligations.",
  },
  {
    icon: Building2,
    title: "EPR",
    subtitle: "Extended Producer Responsibility",
    description:
      "Connect relevant producer and packaging responsibility information with the broader product data ecosystem.",
  },
];

const DPP_DATA_AREAS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ScanLine, title: "Product Identity", description: "GTIN, product identifiers and related references." },
  { icon: ClipboardCheck, title: "Product Characteristics", description: "Technical and product-specific information." },
  { icon: Layers, title: "Materials & Composition", description: "Relevant materials, components and composition data." },
  { icon: Leaf, title: "Sustainability", description: "Applicable environmental and lifecycle information." },
  { icon: Route, title: "Traceability", description: "Relevant supply-chain and product lifecycle information." },
  { icon: FileCheck, title: "Supporting Documentation", description: "Certificates, declarations and technical documents." },
];

const PACKAGING_STRUCTURE: { icon: LucideIcon; title: string; items: string[] }[] = [
  { icon: Boxes, title: "Packaging Components", items: ["Primary", "Secondary", "Tertiary"] },
  {
    icon: Recycle,
    title: "Material Information",
    items: ["Material type", "Composition", "Weight", "Recycled content where applicable"],
  },
  {
    icon: Layers,
    title: "Packaging Characteristics",
    items: [
      "Recyclability-related data",
      "Reuse information where applicable",
      "Material components",
      "Packaging layers/components",
    ],
  },
  {
    icon: Building2,
    title: "Responsibility Data",
    items: ["Producer information", "Market/country information", "EPR-related references"],
  },
];

const STRUCTURED_DATA_CAPABILITIES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Database,
    title: "Centralized Product Data",
    description: "Maintain structured information across products and variants.",
  },
  {
    icon: FolderOpen,
    title: "Reusable Data",
    description: "Use the same verified information across DPP, packaging, product experiences and other channels.",
  },
  {
    icon: FileCheck,
    title: "Document Management",
    description: "Connect relevant certificates, declarations and supporting documentation.",
  },
  {
    icon: History,
    title: "Version Management",
    description: "Maintain updated product and compliance information over time.",
  },
  {
    icon: Globe,
    title: "Multi-Market Readiness",
    description: "Support market-specific data requirements without duplicating the entire product record.",
  },
];

const ASSESSMENT_AREAS = [
  { index: "01", title: "Product Identity", description: "Do your products have the required identifiers?" },
  { index: "02", title: "Product Data", description: "Is required information available and structured?" },
  { index: "03", title: "Packaging Data", description: "Can packaging components and materials be identified?" },
  { index: "04", title: "Documentation", description: "Are supporting documents accessible and current?" },
  { index: "05", title: "Digital Connectivity", description: "Can the product data be connected to a digital identity?" },
  { index: "06", title: "Regulatory Readiness", description: "Which applicable requirements still need attention?" },
];

export default function CompliancePage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="Product & Packaging Compliance"
        title="Build Compliance Into Your Product Data."
        description="Product regulations are becoming increasingly data-driven. Productix helps enterprises structure, manage and connect the product and packaging information needed to prepare for evolving compliance requirements."
        pills={["DPP", "PPWR", "EPR", "GS1 Digital Link", "Product Data"]}
        primary={{ label: "Assess Your Readiness", href: "/book-a-demo" }}
        secondary={{ label: "Explore Productix Connect", href: "/platform/connect" }}
      />

      <ComplianceInMotion />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="The Compliance Challenge"
          title="Compliance Starts With Product Data."
          description="Regulatory requirements may differ by product, market and economic operator, but they increasingly depend on accurate, structured and accessible product information."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              {
                label: "Scattered Data",
                icon: Boxes,
                sublabels: [
                  "Product specifications",
                  "Material information",
                  "Packaging data",
                  "Sustainability information",
                  "Certificates",
                  "Supplier information",
                ],
              },
              { label: "Structured Product Data", icon: Database },
              { label: "Connected & Accessible", icon: Globe },
              { label: "Compliance-Ready Foundation", icon: ShieldCheck },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="One Data Foundation"
          title="Prepare for Multiple Requirements From One Product Foundation."
          description="Rather than presenting DPP, PPWR and EPR as three completely separate systems, Productix draws all three from a common product and packaging data foundation."
        />
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {REQUIREMENTS.map((req, i) => (
            <Reveal key={req.title} delay={i * 90}>
              <div className="glass-light flex h-full flex-col gap-3 rounded-3xl p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                  <req.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-2 text-[19px] font-medium text-ink">{req.title}</h3>
                <p className="text-[12.5px] font-medium text-ink/45">{req.subtitle}</p>
                <p className="text-[14px] leading-relaxed text-ink/55">{req.description}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={150} className="mt-10">
          <p className="mx-auto max-w-2xl text-center text-[13.5px] leading-relaxed text-ink/50">
            Requirements vary by product category, market and economic operator. Productix helps you
            organize the data foundation; applicable legal obligations remain determined by the
            relevant regulations and authorities.
          </p>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Digital Product Passport"
          title="Build the Digital Record Behind the Product."
          description="Productix provides a connected environment to structure, manage and present product information required for applicable DPP use cases."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Data areas
        </p>
        <div className="mt-6">
          <IconGrid items={DPP_DATA_AREAS} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>Connected to the product through its digital identity.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Packaging Compliance"
          title="Make Packaging Data Ready for a More Regulated Market."
          description="Productix helps enterprises structure packaging information across products, components and materials, creating a connected data foundation for evolving packaging requirements."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Possible data structure
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {PACKAGING_STRUCTURE.map((group, i) => (
            <Reveal key={group.title} delay={i * 80}>
              <div className="glass-light flex h-full flex-col gap-3 rounded-2xl p-6">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <group.icon className="h-5 w-5" />
                </span>
                <h3 className="text-[15.5px] font-medium text-ink">{group.title}</h3>
                <ul className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-full bg-white/70 px-3 py-1 text-[12px] font-medium text-ink/60"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={120} className="mt-8">
          <p className="mx-auto max-w-xl text-center text-[13px] text-ink/45">
            Depending on the applicable requirement, product category and market.
          </p>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Structured Product Data"
          title="One Source of Truth for Compliance Data."
          description="Manage compliance-relevant product information in a structured environment rather than rebuilding data for every regulation, market or digital destination."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Possible capabilities
        </p>
        <div className="mt-6">
          <IconGrid items={STRUCTURED_DATA_CAPABILITIES} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Compliance + Connectivity"
          title="Compliance Data Shouldn't Live in Isolation."
          description="When compliance information is connected to the product's digital identity, the same infrastructure can power customer experiences, product information and intelligence."
        />
        <Reveal delay={120} className="mt-8">
          <Statement>Build compliance once. Create value from it everywhere.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Productix Readiness"
          title="Know Where Your Products Stand."
          description="Assess your existing product and packaging data against the requirements relevant to your markets, products and business role."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Potential assessment areas
        </p>
        <div className="mt-8">
          <NumberedSteps steps={ASSESSMENT_AREAS} />
        </div>
        <Reveal delay={150} className="mt-12 flex justify-center">
          <div className="glass-light flex flex-col items-center gap-4 rounded-3xl px-8 py-8 text-center">
            <p className="text-[17px] font-medium text-ink">Productix Compliance Readiness Assessment</p>
            <Link
              href="/book-a-demo"
              className="inline-flex h-11 items-center rounded-full bg-accent px-6 text-[14px] font-semibold text-navy transition-colors hover:bg-teal"
            >
              Start Your Assessment
            </Link>
          </div>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          title="Regulations Will Change. Your Product Foundation Shouldn't Have To."
          description="Build a flexible product data foundation that can evolve as regulations, standards and market requirements develop."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Today", sublabels: ["GS1 Digital Link", "Product Information", "Packaging Data"] },
              { label: "Next", sublabels: ["DPP", "PPWR", "EPR"] },
              { label: "Beyond", sublabels: ["New markets", "New regulations", "New connected experiences"] },
            ]}
          />
        </div>
      </DetailSection>

      <DetailCta
        title="Is Your Product Data Ready?"
        description="Assess your product identity, compliance data and packaging information with Productix."
        primary={{ label: "Assess Your Readiness", href: "/book-a-demo" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      <Footer />
    </div>
  );
}
