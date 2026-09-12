import {
  Blocks,
  Building2,
  CheckCircle2,
  Copy,
  Globe,
  Layers,
  LayoutGrid,
  MousePointer2,
  Package,
  Palette,
  ScanLine,
  Send,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

import {
  CheckList,
  DetailCta,
  DetailHero,
  DetailSection,
  FlowSteps,
  IconGrid,
  SectionHeading,
  Statement,
} from "@/components/landing/detail-sections";
import { ExperienceInMotion } from "@/components/landing/experience-in-motion";
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Reveal } from "@/components/landing/reveal";

const CANONICAL = "https://www.productix.io/platform/experience";

export const metadata: Metadata = {
  title: "Digital Product Experience Platform",
  description:
    "Build branded, multilingual digital product pages with Productix's visual experience builder. Create, update and publish product experiences in seconds.",
  keywords: [
    "digital product experience platform",
    "product experience platform",
    "digital product pages",
    "product experience",
    "product content",
    "multilingual product pages",
    "connected product experience",
    "product storytelling",
    "visual page builder",
    "digital packaging experience",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Experience | Digital Product Experience Platform | Productix",
    description:
      "Build branded, multilingual digital product experiences with a flexible visual builder that lets you launch, update and evolve content in seconds.",
    url: CANONICAL,
    images: [{ url: "/images/product-intelligence.jpg", alt: "Productix digital product experience builder" }],
  },
};

const BUILDER_FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: MousePointer2, title: "Drag & Drop", description: "Build and arrange content visually." },
  {
    icon: LayoutGrid,
    title: "Flexible Layouts",
    description: "Create the structure your product needs instead of forcing content into a fixed template.",
  },
  {
    icon: Blocks,
    title: "Rich Content",
    description: "Combine text, images, video, documents, links, buttons and interactive content.",
  },
  {
    icon: Palette,
    title: "Brand Control",
    description: "Bring your visual identity, storytelling and campaign language directly into the product experience.",
  },
  {
    icon: Copy,
    title: "Reusable Components",
    description: "Create consistent building blocks across products and markets.",
  },
];

const BRAND_CONTROLS = [
  "Brand identity",
  "Typography",
  "Visual hierarchy",
  "Product storytelling",
  "Images & media",
  "Content structure",
  "Calls to action",
  "Campaign content",
  "Product-specific information",
];

const LANGUAGES = ["English", "German", "French", "Italian", "Spanish", "Arabic", "Sinhala", "Tamil"];

const VERIFICATION_STEPS = [
  { verb: "Verify", target: "product identifiers" },
  { verb: "Validate", target: "product information" },
  { verb: "Connect", target: "the correct digital experience" },
  { verb: "Maintain", target: "trusted product identity" },
];

const ENTERPRISE_CAPABILITIES: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Package, title: "Product-Level Experiences", description: "Manage a dedicated experience for every product in your portfolio." },
  { icon: Layers, title: "SKU / Variant Management", description: "Handle experiences across SKUs and product variants." },
  { icon: Building2, title: "Multi-Brand Environments", description: "Run separate brand experiences from one connected platform." },
  { icon: Globe, title: "Multi-Market Content", description: "Localize content for the markets and audiences you serve." },
  { icon: Copy, title: "Reusable Templates", description: "Standardize structure while keeping room for product-specific detail." },
  { icon: Send, title: "Centralized Publishing", description: "Launch and update experiences from one place." },
  { icon: Users, title: "Role-Based Workflows", description: "Give teams the right level of access to build and publish." },
];

export default function ExperiencePage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="Connected Product Experience"
        title="Turn Every Product Into a Digital Experience."
        description="Build branded, interactive product experiences that live beyond the physical package - without rebuilding your website or relying on rigid templates."
        pills={["Visual page builder", "Custom languages", "Brand control", "GTIN verification", "Instant publishing"]}
        primary={{ label: "Explore the Experience Builder", href: "#builder" }}
        secondary={{ label: "Book a Demo", href: "/book-a-demo" }}
      />

      <ExperienceInMotion />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Your Product. Your Story."
          title="Your Product Deserves More Than a QR Code."
          description="A connected product shouldn't lead to a generic information page. Productix gives brands the freedom to create a digital experience that reflects the product, the brand and the customer journey."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Physical Product", icon: Package },
              { label: "Scan / Tap", icon: ScanLine },
              { label: "Productix Experience", icon: Sparkles },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-8 flex flex-wrap justify-center gap-1.5">
          {["Inform", "Engage", "Inspire", "Convert"].map((word) => (
            <span
              key={word}
              className="rounded-full bg-brand-accent/10 px-3.5 py-1.5 text-[12px] font-bold text-ink/70"
            >
              {word}
            </span>
          ))}
        </Reveal>
      </DetailSection>

      <DetailSection id="builder" bg="cream" flip>
        <SectionHeading
          eyebrow="Visual Experience Builder"
          title="Build Product Experiences Without Code."
          description="Create rich, mobile-first product pages with a visual builder designed for marketing and product teams."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Feature points
        </p>
        <div className="mt-6">
          <IconGrid items={BUILDER_FEATURES} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
        <Reveal delay={150} className="mt-10">
          <Statement>If you can build a page, you can build a Productix experience.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="Brand Your Way"
          title="Your Product. Your Brand. Your Experience."
          description="Productix doesn't force your products into a generic compliance interface. Build the digital experience around your own brand, product and audience."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          You can control
        </p>
        <div className="mt-6">
          <CheckList items={BRAND_CONTROLS} columns="sm:grid-cols-3" />
        </div>
        <Reveal delay={150} className="mt-10">
          <Statement>Compliance information can be structured. The way you tell your product story is yours.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="Global Products. Local Experiences."
          title="Speak to Every Market."
          description="Create localized product experiences for the markets and audiences you serve - while managing them from one connected platform."
        />
        <Reveal delay={100} className="mt-8 flex flex-wrap justify-center gap-1.5">
          {LANGUAGES.map((lang) => (
            <span key={lang} className="glass-light rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink/70">
              {lang}
            </span>
          ))}
        </Reveal>
        <Reveal delay={160} className="mt-10">
          <Statement>One product identity. Multiple market experiences.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="Identity Verification"
          title="Connect the Right Experience to the Right Product."
          description="Validate product identifiers and maintain confidence that your digital experience is connected to the correct product identity."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          GTIN verification
        </p>
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {VERIFICATION_STEPS.map((step, i) => (
            <Reveal key={step.verb} delay={i * 80}>
              <div className="glass-light flex items-center gap-3 rounded-2xl p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-accent/10 text-brand-accent">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                <p className="text-[14px] text-ink/70">
                  <span className="font-semibold text-ink">{step.verb}</span> {step.target}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal delay={150} className="mt-10">
          <Statement>Built to work with the product identity layer - not around it.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Beyond Compliance"
          title="Turn Compliance Into a Customer Touchpoint."
          description="The same connected product infrastructure used to provide regulatory information can also deliver useful, engaging experiences to customers and other product stakeholders."
        />
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Built for Enterprise Teams"
          title="Manage Experiences Across Your Product Portfolio."
          description="Create and manage connected experiences across products, variants, brands, markets and campaigns from one platform."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Potential capabilities
        </p>
        <div className="mt-6">
          <IconGrid items={ENTERPRISE_CAPABILITIES} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </DetailSection>

      <DetailCta
        title="Give Your Products a Digital Story."
        description="Connect your product identity to an experience built around your brand."
        primary={{ label: "Explore Product Intelligence", href: "/platform/intelligence" }}
        secondary={{ label: "Book an Assessment", href: "/book-a-demo" }}
      />

      <Footer />
    </div>
  );
}
