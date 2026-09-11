import {
  Boxes,
  Box,
  Building2,
  Database,
  FileCheck,
  Fingerprint,
  FlaskConical,
  Globe,
  Layers,
  Link2,
  MapPin,
  Package,
  Recycle,
  RefreshCw,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Weight,
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
import { CalButton } from "@/components/landing/cal-button";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";

const CANONICAL = "https://www.productix.io/solutions/ppwr-epr";

export const metadata: Metadata = {
  title: "PPWR & EPR Compliance Data Platform",
  description:
    "Structure and manage product and packaging information for PPWR and EPR requirements with Productix's connected product infrastructure.",
  keywords: [
    "PPWR",
    "EU PPWR",
    "Packaging and Packaging Waste Regulation",
    "EPR",
    "Extended Producer Responsibility",
    "packaging data",
    "packaging compliance",
    "packaging materials",
    "packaging structure",
    "packaging sustainability data",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "PPWR & EPR | Connected Packaging Data | Productix",
    description:
      "Connect product and packaging data to support PPWR, EPR and evolving European packaging information requirements.",
    url: CANONICAL,
    images: [{ url: "/images/beyond-compliance.jpg", alt: "Productix PPWR and EPR packaging data platform" }],
  },
};

const PPWR_DATA_AREAS: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Boxes,
    title: "Packaging Components",
    description: "Identify and structure the packaging elements associated with a product.",
  },
  {
    icon: Layers,
    title: "Materials",
    description: "Capture relevant packaging material information.",
  },
  {
    icon: FlaskConical,
    title: "Composition",
    description: "Manage applicable composition and material details.",
  },
  {
    icon: Weight,
    title: "Packaging Weight",
    description: "Maintain packaging components and material weights.",
  },
  {
    icon: Recycle,
    title: "Recycled Content",
    description: "Capture relevant recycled-content information where applicable.",
  },
  {
    icon: RefreshCw,
    title: "Recyclability & Reuse",
    description: "Manage applicable information related to packaging recyclability and reuse.",
  },
  {
    icon: Globe,
    title: "Market Information",
    description: "Associate relevant packaging data with products and markets.",
  },
];

const PACKAGING_FOUNDATION: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ScanLine,
    title: "Product Identity",
    description: "GTIN and product references.",
  },
  {
    icon: Boxes,
    title: "Packaging Components",
    description: "Primary, secondary and tertiary packaging.",
  },
  {
    icon: Layers,
    title: "Material Data",
    description: "Materials, composition and characteristics.",
  },
  {
    icon: Weight,
    title: "Quantities & Weights",
    description: "Relevant packaging measurements.",
  },
  {
    icon: FileCheck,
    title: "Documentation",
    description: "Supporting certificates and documents.",
  },
  {
    icon: Globe,
    title: "Market Information",
    description: "Country and market-specific information.",
  },
  {
    icon: Building2,
    title: "Responsibility Data",
    description: "Relevant EPR-related information.",
  },
];

const CONTINUOUS_UPDATES = [
  "Change a material",
  "Update packaging weight",
  "Add a component",
  "Update recycled-content information",
  "Add supporting documentation",
  "Update market information",
  "Publish the latest information",
];

const ASSESSMENT_AREAS = [
  { index: "01", title: "Product Identity", description: "Is each product correctly identified?" },
  { index: "02", title: "Packaging Structure", description: "Can you identify all relevant packaging components?" },
  {
    index: "03",
    title: "Material Data",
    description: "Do you have the relevant material and composition information?",
  },
  { index: "04", title: "Measurements", description: "Are weights and quantities available?" },
  { index: "05", title: "Documentation", description: "Can supporting information be accessed?" },
  {
    index: "06",
    title: "Market Data",
    description: "Can packaging information be associated with relevant markets?",
  },
  {
    index: "07",
    title: "EPR Information",
    description: "Are relevant producer-responsibility details available?",
  },
];

const SECTORS = [
  "Food & Beverage",
  "FMCG",
  "Textiles",
  "Cosmetics",
  "Electronics",
  "Consumer Products",
  "Packaging Manufacturers",
  "Industrial Products",
  "Automotive & Components",
];

const CONNECTED_DESTINATIONS = [
  "Compliance Information",
  "Product Information",
  "Sustainability Information",
  "Customer Experience",
];

export default function PpwrEprPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="Packaging Compliance · PPWR · EPR"
        title="Make Your Packaging Data Ready for the European Market."
        description="Build a structured, connected foundation for packaging information and producer-responsibility data to help your business prepare for evolving PPWR and EPR requirements across European markets."
        pills={["Packaging Data", "Material Information", "EPR", "PPWR", "Product Identity", "GS1 Digital Link"]}
        primary={{ label: "Assess Your Packaging Readiness", href: "/book-a-demo" }}
        secondary={{ label: "Explore Productix Compliance", href: "/platform/compliance" }}
      />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="The New Packaging Landscape"
          title="Packaging Is Becoming a Data Requirement."
          description="Packaging is no longer only a physical component of a product. Increasingly, enterprises need accurate information about what packaging they place on markets, what it is made of, how it is designed and how related responsibilities are managed."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "Physical Packaging", icon: Package },
              { label: "Packaging Components", icon: Boxes },
              { label: "Material & Composition Data", icon: Recycle },
              { label: "Regulatory Information", icon: ShieldCheck },
              { label: "Connected Product Data", icon: Database },
            ]}
          />
        </div>
        <div className="mt-12">
          <Statement>The first step toward packaging readiness is knowing what you have.</Statement>
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="EU Packaging & Packaging Waste Regulation"
          title="Prepare Your Packaging Data for PPWR."
          description="The Packaging and Packaging Waste Regulation introduces requirements across the packaging lifecycle, including areas such as packaging design, composition, recyclability, reuse and waste prevention. Productix helps enterprises structure relevant packaging information so it can be managed, maintained and connected to the appropriate product records."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Data areas
        </p>
        <div className="mt-6">
          <IconGrid items={PPWR_DATA_AREAS} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
        <p className="mx-auto mt-10 max-w-xl text-center text-[13px] text-ink/45">
          Applicable requirements depend on the packaging, product, economic operator and relevant regulatory
          provisions.
        </p>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Extended Producer Responsibility"
          title="Connect Packaging Data With Producer Responsibility."
          description="Extended Producer Responsibility places responsibility on producers for aspects of the environmental impact of products and packaging. Implementation and registration requirements can vary across European countries. Productix helps enterprises maintain the packaging and product information needed to support their broader EPR data workflows."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          The story
        </p>
        <div className="mt-6">
          <FlowSteps
            steps={[
              { label: "Product", icon: Package },
              { label: "Packaging", icon: Boxes },
              { label: "Packaging Data", icon: Database },
              { label: "Market / Country", icon: Globe },
              { label: "EPR Information", icon: Building2 },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Packaging Structure"
          title="Map Every Layer of Your Product Packaging."
          description="Model the complete packaging structure behind each product from primary packaging to secondary and tertiary layers with the relevant materials, weights and components."
        />
        <div className="mt-14">
          <BranchDiagram
            root={{ label: "Product", icon: Package }}
            branches={[
              { label: "Primary Packaging", icon: Box, items: ["Material", "Weight", "Components"] },
              { label: "Secondary Packaging", icon: Boxes, items: ["Material", "Weight", "Components"] },
              { label: "Tertiary Packaging", icon: Layers, items: ["Material", "Weight", "Components"] },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Packaging Data Foundation"
          title="Move Packaging Data Out of Spreadsheets."
          description="Bring packaging information into a structured environment where product, packaging and compliance-related data can be maintained together."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Productix can organize
        </p>
        <div className="mt-6">
          <IconGrid items={PACKAGING_FOUNDATION} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Connected Packaging"
          title="Your Packaging Data Can Live Beyond the Spreadsheet."
          description="Connect relevant product and packaging information to the product's digital identity and make it accessible through your connected product infrastructure."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Packaging Data", icon: Database },
              { label: "Productix", icon: Layers },
              { label: "Product Identity", icon: Fingerprint },
              { label: "GS1 Digital Link", icon: Link2 },
              { label: "Digital Product Experience", icon: Smartphone },
            ]}
          />
        </div>
        <div className="mt-9 flex flex-wrap justify-center gap-1.5">
          {CONNECTED_DESTINATIONS.map((d) => (
            <span key={d} className="glass-light rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink/70">
              {d}
            </span>
          ))}
        </div>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Continuous Data Management"
          title="Packaging Changes. Your Digital Data Should Too."
          description="Packaging specifications can change across products, suppliers, markets and production cycles. Productix provides a central place to maintain and update connected packaging information."
        />
        <div className="mt-12">
          <CheckList items={CONTINUOUS_UPDATES} columns="sm:grid-cols-2" />
        </div>
        <div className="mt-12">
          <Statement>Update the digital layer without rebuilding the entire product record.</Statement>
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="EU Market Readiness"
          title="One Product Portfolio. Multiple Market Requirements."
          description="Packaging and EPR implementation can involve country-specific obligations. Productix helps enterprises maintain structured information that can be associated with the markets where products are placed on the market."
        />
        <div className="mt-14">
          <BranchDiagram
            root={{ label: "Product", icon: Package }}
            branches={[
              { label: "Germany", icon: MapPin, items: ["EPR Data", "Packaging"] },
              { label: "France", icon: MapPin, items: ["EPR Data", "Packaging"] },
              { label: "Italy", icon: MapPin, items: ["EPR Data", "Packaging"] },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Connected Regulatory Data"
          title="Don't Build Separate Data Silos for Every Requirement."
        />
        <div className="mt-14">
          <BranchDiagram
            root={{ label: "Digital Identity", icon: Fingerprint }}
            branches={[
              { label: "DPP", icon: ScanLine, items: ["Product Data", "Sustainability", "Traceability"] },
              { label: "PPWR", icon: Recycle, items: ["Packaging Data", "Materials", "Composition"] },
              { label: "EPR", icon: Building2, items: ["Producer Responsibility"] },
            ]}
          />
        </div>
        <div className="mt-10">
          <FlowSteps steps={[{ label: "Productix", icon: Layers }, { label: "Connected Product Experience", icon: Smartphone }]} />
        </div>
        <div className="mt-12">
          <Statement>One Product Data Foundation. Multiple Compliance Journeys.</Statement>
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Packaging Readiness"
          title="Know What Your Packaging Data Is Missing."
          description="Start with an assessment of your current product and packaging information and identify the gaps that may need to be addressed for your target markets and applicable requirements."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Assessment areas
        </p>
        <div className="mt-8">
          <NumberedSteps steps={ASSESSMENT_AREAS} />
        </div>
        <div className="mt-12 flex justify-center">
          <CalButton className="group inline-flex h-12 items-center gap-2 rounded-full bg-ink px-6 text-[14px] font-semibold text-white transition-colors hover:bg-navy-deep">
            Assess Your Packaging Readiness
          </CalButton>
        </div>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="For Europe-Bound Products"
          title="Prepare Before Your Products Reach the Market."
          description="Whether you're a manufacturer, brand owner, packaging company or exporter, Productix gives your teams a structured foundation for managing connected product and packaging information."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Relevant sectors
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-1.5">
          {SECTORS.map((s) => (
            <span key={s} className="glass-light rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink/70">
              {s}
            </span>
          ))}
        </div>
        <div className="mt-9 flex justify-center">
          <Link
            href="/industries"
            className="group inline-flex items-center gap-1.5 text-[14px] font-medium text-ink/70 transition-colors hover:text-ink"
          >
            Explore Industries
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </Link>
        </div>
      </DetailSection>

      <DetailCta
        title="Is Your Packaging Ready for Europe?"
        description="Understand your current data, identify the gaps and build a connected foundation for your European market journey."
        primary={{ label: "Assess Your Packaging Readiness", href: "/book-a-demo" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      <Footer />
    </div>
  );
}
