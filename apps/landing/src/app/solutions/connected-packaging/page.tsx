import {
  ArrowRight,
  BarChart3,
  Box,
  Boxes,
  Building2,
  Database,
  Fingerprint,
  FileText,
  Globe,
  Info,
  Languages,
  Layers,
  Link2,
  Megaphone,
  MousePointerClick,
  Package,
  Radio,
  Recycle,
  ScanLine,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Truck,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

import {
  BranchDiagram,
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

const CANONICAL = "https://www.productix.io/solutions/connected-packaging";

export const metadata: Metadata = {
  title: "Connected Packaging Platform | Digital Product Experiences | Productix",
  description:
    "Turn physical packaging into connected digital experiences with product identity, compliance information, multilingual content, engagement and intelligence.",
  keywords: [
    "connected packaging",
    "connected packaging platform",
    "smart packaging",
    "digital packaging",
    "connected products",
    "digital product identity",
    "interactive packaging",
    "packaging QR code",
    "digital product experience",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Connected Packaging | Productix",
    description:
      "Connect physical packaging to digital product identity, compliance information, engaging experiences and actionable product intelligence.",
    url: CANONICAL,
    images: [{ url: "/images/beyond-compliance.jpg", alt: "Productix connected packaging platform" }],
  },
};

/** A row of small text pills, used for the brief's simple enumerated-list sections. */
function PillRow({ items }: { items: string[] }) {
  return (
    <Reveal className="mx-auto mt-8 flex max-w-3xl flex-wrap justify-center gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="glass-light rounded-full px-4 py-2 text-[13px] font-medium text-ink/70"
        >
          {item}
        </span>
      ))}
    </Reveal>
  );
}

const QR_CODE_POSSIBILITIES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Info,
    title: "Inform",
    description: "Product details, instructions, ingredients and specifications.",
  },
  {
    icon: ShieldCheck,
    title: "Comply",
    description: "Applicable DPP, PPWR and sustainability information.",
  },
  {
    icon: Megaphone,
    title: "Engage",
    description: "Brand stories, campaigns and interactive experiences.",
  },
  {
    icon: Link2,
    title: "Connect",
    description: "Feedback, support, registration and digital services.",
  },
  {
    icon: BarChart3,
    title: "Understand",
    description: "Scan activity, engagement and customer feedback.",
  },
];

const CONVERGING_FORCES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: ScanLine,
    title: "GS1 Digital Link",
    description: "The global transition toward connected product identities and 2D barcodes.",
  },
  {
    icon: FileText,
    title: "DPP",
    description: "Growing requirements for accessible product and sustainability information.",
  },
  {
    icon: Recycle,
    title: "PPWR",
    description: "Increasing focus on packaging information, design, materials and circularity.",
  },
];

export default function ConnectedPackagingPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="Connected Packaging · Digital Product Identity"
        title="Turn Every Package Into a Connected Product Experience."
        description="Connect physical packaging to trusted product information, compliance data, digital experiences and actionable intelligence through one connected product infrastructure."
        pills={["Product Identity", "GS1 Digital Link", "DPP", "PPWR", "Experience", "Intelligence"]}
        primary={{ label: "Connect Your Products", href: "/book-a-demo" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="From Physical to Digital"
          title="Your Packaging Can Do More Than Carry a Product."
          description="Packaging is one of the most powerful physical touchpoints between a brand and its customers. By connecting that physical touchpoint to a digital identity, brands can extend the product experience far beyond the package itself."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "Physical Product", icon: Package },
              { label: "Packaging", icon: Box },
              { label: "Digital Identity", icon: Fingerprint },
              { label: "Connected Experience", icon: Radio },
              { label: "Data & Intelligence", icon: BarChart3 },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>Turn the package into a gateway to the digital product.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="The Concept"
          title="A Physical Package With a Digital Layer."
          description="Connected packaging links a physical product or package to relevant digital information and experiences through a scannable digital connection. That connection can lead customers, partners or other stakeholders to:"
        />
        <PillRow
          items={[
            "Product Information",
            "Digital Product Passport",
            "Sustainability Information",
            "Usage & Instructions",
            "Brand Experiences",
            "Campaigns",
            "Feedback",
            "Product Services",
          ]}
        />
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="How Connected Packaging Works"
          title="From Package to Digital Experience in Seconds."
        />
        <div className="mt-14">
          <NumberedSteps
            steps={[
              { index: "01", title: "Identify", description: "GTIN / Product ID" },
              { index: "02", title: "Connect", description: "GS1 Digital Link" },
              { index: "03", title: "Package", description: "QR / 2D Code" },
              { index: "04", title: "Scan", description: "Customer / Partner" },
              { index: "05", title: "Experience", description: "Productix Digital Layer" },
              { index: "06", title: "Intelligence", description: "Analytics · Feedback · Insights" },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-12">
          <p className="mx-auto max-w-xl text-center text-[14px] leading-relaxed text-ink/60">
            Productix provides the digital infrastructure behind the connected package, allowing
            enterprises to manage what happens before, during and after the scan.
          </p>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="More Than a QR Code"
          title="One Connected Package. Multiple Digital Possibilities."
          description="A connected package can become a gateway to:"
        />
        <div className="mt-14">
          <IconGrid items={QR_CODE_POSSIBILITIES} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>Connect once. Build more experiences over time.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Packaging Data"
          title="Connect the Digital Layer to the Packaging Structure."
          description="Modern products can contain multiple packaging components across primary, secondary and tertiary packaging. Productix helps enterprises structure relevant packaging information and associate it with the product."
        />
        <div className="mt-14">
          <BranchDiagram
            root={{ label: "Product", icon: Package }}
            branches={[
              { label: "Primary Packaging", icon: Box, items: ["Container", "Closure", "Label"] },
              { label: "Secondary Packaging", icon: Boxes, items: ["Carton"] },
              { label: "Tertiary Packaging", icon: Truck, items: ["Shipping Case"] },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            Keep the product, packaging components and relevant digital information connected.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Compliance-Ready Packaging"
          title="Connect Packaging Information to the Digital Product."
          description="As product and packaging information requirements evolve, enterprises need structured data that can be maintained and connected to the product. Productix can provide a digital foundation for relevant:"
        />
        <PillRow
          items={[
            "DPP Information",
            "PPWR Data",
            "Packaging Materials",
            "Packaging Composition",
            "Product Information",
            "Sustainability Information",
            "Supporting Documentation",
          ]}
        />
        <Reveal delay={150} className="mt-8">
          <p className="mx-auto max-w-xl text-center text-[12.5px] text-ink/45">
            Applicable information depends on the product, market, economic operator and relevant
            regulatory requirements.
          </p>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Product Experience"
          title="Give Customers More Than What's Printed on the Pack."
          description="Packaging has limited physical space. A connected digital experience removes that limitation, allowing brands to provide richer and continuously updated product information."
        />
        <PillRow
          items={[
            "Product Story",
            "How-To & Usage",
            "Recipes",
            "Ingredients & Specifications",
            "Multiple Languages",
            "Certifications",
            "Sustainability Information",
            "Campaigns",
            "Promotions",
            "Customer Feedback",
          ]}
        />
        <Reveal delay={150} className="mt-10">
          <Statement>Print the essential. Connect the rest.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Global Product Delivery"
          title="One Product. Multiple Languages."
          description="Serve the same connected product across markets while delivering localized digital experiences."
        />
        <div className="mt-14">
          <BranchDiagram
            root={{ label: "Connected Identity", icon: Globe }}
            branches={[
              { label: "English", icon: Languages, items: ["Experience"] },
              { label: "German", icon: Languages, items: ["Experience"] },
              { label: "French", icon: Languages, items: ["Experience"] },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            Update and expand digital product information without redesigning the physical package
            for every change.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Brand Activation"
          title="Turn Packaging Into a Marketing Touchpoint."
          description="Use connected packaging to extend campaigns beyond the physical package and create measurable interactions directly from the product."
        />
        <PillRow
          items={[
            "Launch Campaigns",
            "Promotions",
            "Product Education",
            "Sampling Experiences",
            "Contests",
            "Consumer Feedback",
            "Loyalty & Engagement",
          ]}
        />
        <Reveal delay={150} className="mt-10">
          <Statement>Every package can become a measurable brand touchpoint.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="From Scans to Insight"
          title="Know What Happens After the Package Is Scanned."
          description="Connected packaging creates a new layer of interaction between products and consumers. Productix turns those interactions into actionable product intelligence."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Analytics
        </p>
        <PillRow
          items={["Country", "Product", "Device", "Browser", "Visitor Duration", "Scan Activity", "Feedback"]}
        />
        <div className="mt-12">
          <FlowSteps
            steps={[
              { label: "Package", icon: Package },
              { label: "Scan", icon: ScanLine },
              { label: "Digital Experience", icon: Smartphone },
              { label: "Interaction", icon: MousePointerClick },
              { label: "Data", icon: Database },
              { label: "Intelligence", icon: BarChart3 },
            ]}
          />
        </div>
        <Reveal delay={150} className="mt-10 flex justify-center">
          <Link
            href="/solutions/product-intelligence"
            className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-accent-dim transition-colors hover:text-ink"
          >
            Explore Product Intelligence
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Scale Across Your Portfolio"
          title="From One Connected Package to an Entire Product Ecosystem."
          description="Start with a single product, validate the experience and scale connected packaging across products, brands, markets and packaging formats."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "One Product", icon: Package },
              { label: "Product Family", icon: Boxes },
              { label: "Brand", icon: Building2 },
              { label: "Portfolio", icon: Layers },
              { label: "Global Product Ecosystem", icon: Globe },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>One connected infrastructure for your entire product portfolio.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="The Productix Model"
          title="Identity. Compliance. Experience. Intelligence."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Physical Product", icon: Package },
              { label: "Digital Identity", icon: Fingerprint },
              { label: "Productix", icon: Sparkles },
            ]}
          />
        </div>
        <div className="mt-10">
          <BranchDiagram
            root={{ label: "Productix", icon: Sparkles }}
            branches={[
              { label: "Compliance", icon: ShieldCheck, items: ["DPP", "PPWR", "Product Data"] },
              {
                label: "Experience",
                icon: Smartphone,
                items: ["Content", "Brand", "Languages", "Activations"],
              },
              { label: "Intelligence", icon: BarChart3, items: ["Analytics", "Feedback"] },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            Productix transforms packaging from a static surface into a connected digital product
            layer.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="The Next Generation of Packaging"
          title="Build for the Product Experience Beyond the Package."
          description="Three forces are converging:"
        />
        <div className="mt-14">
          <IconGrid items={CONVERGING_FORCES} columns="sm:grid-cols-2 md:grid-cols-3" />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            Connected packaging brings these digital requirements and customer experiences closer
            to the physical product.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailCta
        title="Ready to Make Your Products More Connected?"
        description="Explore how Productix can connect your packaging to digital identity, compliance information, engaging experiences and actionable intelligence."
        primary={{ label: "Connect Your Products", href: "/book-a-demo" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      <Footer />
    </div>
  );
}
