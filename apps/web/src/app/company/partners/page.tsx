import {
  Award,
  ClipboardList,
  Cpu,
  Database,
  Globe,
  Landmark,
  Layers,
  MapPin,
  Package,
  Settings2,
  ShieldCheck,
  Sparkles,
  Store,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

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

const CANONICAL = "https://www.productix.io/company/partners";

export const metadata: Metadata = {
  title: "Productix Partner Ecosystem | Connected Product & Packaging",
  description:
    "Explore the Productix partner ecosystem connecting standards, compliance, packaging, technology and regional expertise to build connected, compliant and future-ready products.",
  keywords: [
    "connected product ecosystem",
    "connected product partnerships",
    "connected packaging ecosystem",
    "digital product ecosystem",
    "product digitalization partners",
    "connected packaging partners",
    "digital product passport ecosystem",
    "packaging technology partnerships",
    "product compliance partnerships",
    "GS1 Digital Link ecosystem",
    "future-ready product infrastructure",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Building the Productix Partner Ecosystem",
    description:
      "Productix is building an ecosystem across standards, compliance, packaging, technology and regional expertise to help enterprises create connected and future-ready products.",
    url: CANONICAL,
    images: [
      { url: "/images/becoming-digital.jpg", alt: "Productix partner ecosystem for connected, compliant and future-ready products" },
    ],
  },
};

const PLATFORM_PILLARS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Cpu, title: "Technology", description: "Connect enterprise systems and digital ecosystems." },
  { icon: Award, title: "Expertise", description: "Combine Productix with regulatory, certification and packaging knowledge." },
  { icon: Globe, title: "Reach", description: "Expand connected product infrastructure across industries and markets." },
  { icon: Settings2, title: "Implementation", description: "Turn strategy into deployable product and packaging solutions." },
];

const BUILD_WITH_US: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Landmark, title: "Standards & Industry Organizations", description: "Help shape interoperable product ecosystems." },
  { icon: ShieldCheck, title: "Certification & Consultancy", description: "Combine trusted expertise with digital product infrastructure." },
  { icon: Package, title: "Packaging & Printing", description: "Bring digital connectivity directly into physical packaging." },
  { icon: ClipboardList, title: "Packaging Consultants", description: "Help enterprises transform packaging strategies." },
  { icon: MapPin, title: "Regional Partners", description: "Take Productix into new markets and industries." },
];

const PARTNER_CATEGORIES: {
  icon: LucideIcon;
  title: string;
  description: string;
  focusAreas: string[];
}[] = [
  {
    icon: Landmark,
    title: "Standards & Industry Bodies",
    description: "Organizations shaping global product identification, data standards and the future of connected products.",
    focusAreas: [
      "Product identification",
      "Data standards",
      "GS1 Digital Link",
      "Digital Product Passport ecosystems",
      "Industry interoperability",
    ],
  },
  {
    icon: ShieldCheck,
    title: "Certification & Compliance",
    description: "Independent certification, testing, assurance and professional services organizations that complement Productix's technology with trusted compliance expertise.",
    focusAreas: [
      "Regulatory assessment",
      "Product and packaging compliance",
      "Sustainability verification",
      "Certification",
      "Assurance",
      "Enterprise compliance advisory",
    ],
  },
  {
    icon: Package,
    title: "Printing & Packaging",
    description: "Packaging manufacturers, printers, converters and label producers that take connected product infrastructure from software into the physical world.",
    focusAreas: [
      "Connected packaging",
      "QR implementation",
      "Digital identifiers",
      "Smart labels",
      "Packaging production",
      "Product-level connectivity",
    ],
  },
  {
    icon: ClipboardList,
    title: "Packaging Consultants",
    description: "Packaging consultants who understand the physical realities of packaging transformation, helping enterprises plan the transition toward digitally connected packaging.",
    focusAreas: [
      "Packaging strategy",
      "Packaging redesign",
      "Material and structure",
      "Compliance preparation",
      "Digital integration",
    ],
  },
  {
    icon: MapPin,
    title: "Regional Partners",
    description: "Regional partners bring Productix closer to manufacturers, exporters and brands within their markets.",
    focusAreas: [
      "Market development",
      "Enterprise introductions",
      "Local implementation",
      "Industry relationships",
      "Customer success",
    ],
  },
];

function PartnerCategoryCard({
  icon: Icon,
  title,
  description,
  focusAreas,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  focusAreas: string[];
}) {
  return (
    <Reveal>
      <div className="glass-light flex h-full flex-col gap-4 rounded-2xl p-7">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
          <Icon className="h-5 w-5" />
        </span>
        <h3 className="text-[16.5px] font-medium text-ink">{title}</h3>
        <p className="text-[13.5px] leading-relaxed text-ink/55">{description}</p>
        <div className="mt-1">
          <CheckList items={focusAreas} columns="sm:grid-cols-1" />
        </div>
      </div>
    </Reveal>
  );
}

export default function PartnersPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="Productix Partner Ecosystem"
        title="Building the Ecosystem Behind Future-Ready Products."
        description="Product transformation is bigger than software. It connects standards, certification, compliance expertise, packaging, printing, technology and regional market knowledge - and Productix is building a partner ecosystem that brings these capabilities together."
        pills={["Standards", "Compliance", "Packaging", "Technology", "Regional Expertise"]}
        primary={{ label: "Become a Partner", href: "/company/contact" }}
        secondary={{ label: "Contact Productix", href: "/company/contact" }}
      />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="The Ecosystem"
          title="Connected Products Need a Connected Ecosystem."
          description="Productix sits at the intersection of several industries and capabilities."
        />
        <div className="mt-14">
          <BranchDiagram
            root={{ label: "Productix", icon: Layers }}
            branches={[
              { label: "Standards", icon: Landmark },
              { label: "Compliance", icon: ShieldCheck },
              { label: "Packaging", icon: Package },
            ]}
          />
        </div>
        <div className="mt-6">
          <FlowSteps
            vertical
            steps={[
              { label: "Product Experience", icon: Sparkles },
              { label: "Regional Expertise", icon: Globe },
            ]}
          />
        </div>
        <p className="mx-auto mt-10 max-w-xl text-center text-[14.5px] leading-relaxed text-ink/60">
          Together, these capabilities can help enterprises prepare for the next generation of product
          identity, packaging and digital product information.
        </p>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading eyebrow="The Network" title="Our Partner Ecosystem" />
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-2">
          {PARTNER_CATEGORIES.map((category) => (
            <PartnerCategoryCard key={category.title} {...category} />
          ))}
        </div>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="A Platform at the Center"
          title="A Platform at the Center of Product Transformation."
          description="Productix provides the digital infrastructure. Partners bring specialized expertise, market access, technology, manufacturing capabilities and industry knowledge."
        />
        <div className="mt-14">
          <IconGrid items={PLATFORM_PILLARS} columns="sm:grid-cols-2 lg:grid-cols-4" />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>Together, we can create solutions that are difficult to deliver independently.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="From Standards to the Shelf"
          title="Product Transformation Happens Across the Entire Chain."
          description="Product transformation does not happen in software alone."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "Standards", icon: Landmark },
              { label: "Compliance", icon: ShieldCheck },
              { label: "Product Data", icon: Database },
              { label: "Packaging", icon: Package },
              { label: "Digital Experience", icon: Sparkles },
              { label: "Market", icon: Store },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            Productix aims to connect these layers through a growing ecosystem of specialized partners.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Partner With Productix"
          title="Build With Us."
          description="We're looking to collaborate with organizations that can help accelerate the transition toward connected and future-ready products."
        />
        <div className="mt-14">
          <IconGrid items={BUILD_WITH_US} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </DetailSection>

      <DetailCta
        title="Become Part of the Productix Ecosystem."
        description="Have expertise, technology, market access or capabilities that can help enterprises build future-ready products? Let's explore what we can build together."
        primary={{ label: "Become a Partner", href: "/company/contact" }}
        secondary={{ label: "Contact Productix", href: "/company/contact" }}
      />

      <Footer />
    </div>
  );
}
