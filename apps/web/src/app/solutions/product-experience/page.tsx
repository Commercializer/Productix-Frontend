import {
  Activity,
  Blocks,
  BookOpen,
  Boxes,
  Building2,
  Compass,
  Fingerprint,
  FileText,
  Globe,
  Layers,
  LayoutGrid,
  LifeBuoy,
  Link2,
  MessageSquare,
  Package,
  Palette,
  QrCode,
  Repeat,
  ScanLine,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  ArrowRight,
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

const CANONICAL = "https://www.productix.io/solutions/product-experience";

export const metadata: Metadata = {
  title: "Digital Product Experience Platform",
  description:
    "Create branded, multilingual digital product experiences with product information, campaigns, content and customer engagement through Productix.",
  keywords: [
    "digital product experience",
    "product experience platform",
    "product engagement",
    "digital product page",
    "connected product experience",
    "product information experience",
    "multilingual product content",
    "product storytelling",
    "digital packaging experience",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Digital Product Experience | Productix",
    description:
      "Create rich, branded and multilingual digital product experiences that connect customers with product information, stories and engagement.",
    url: CANONICAL,
    images: [{ url: "/images/product-intelligence.jpg", alt: "Productix digital product experience platform" }],
  },
};

function PillRow({ items }: { items: string[] }) {
  return (
    <Reveal delay={100} className="mt-6 flex flex-wrap justify-center gap-2">
      {items.map((item) => (
        <span
          key={item}
          className="glass-light rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink/70"
        >
          {item}
        </span>
      ))}
    </Reveal>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
      {children}
    </p>
  );
}

function LinkOut({ label, href }: { label: string; href: string }) {
  return (
    <Reveal delay={140} className="mt-10 flex justify-center">
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 text-[14px] font-semibold text-ink/70 transition-colors hover:text-ink"
      >
        {label}
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </Link>
    </Reveal>
  );
}

const DIGITAL_LAYER_ITEMS = [
  "Product Information",
  "Usage & Instructions",
  "Ingredients & Specifications",
  "Certifications",
  "Sustainability Information",
  "Brand Stories",
  "Campaigns",
  "Promotions",
  "Customer Feedback",
  "Support & Services",
];

const BUILDER_FEATURES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: LayoutGrid,
    title: "Visual Page Builder",
    description: "Create product experiences through a flexible visual editor.",
  },
  {
    icon: Palette,
    title: "Brand Control",
    description: "Control layouts, content, imagery and visual identity.",
  },
  {
    icon: Blocks,
    title: "Rich Content",
    description: "Combine text, images, video, documents, links and interactive content.",
  },
  {
    icon: Layers,
    title: "Flexible Layouts",
    description: "Build different experiences for different products, brands or campaigns.",
  },
];

const PRODUCT_INFO_ITEMS = [
  "Product Specifications",
  "Ingredients",
  "Instructions",
  "Usage Information",
  "Certifications",
  "Documents",
  "Product Stories",
  "FAQs",
  "Contact & Support",
];

const LIFECYCLE_STAGES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Compass,
    title: "Before Purchase · Discover",
    description: "Product information, brand story, features and specifications.",
  },
  {
    icon: ShoppingBag,
    title: "At Purchase · Inform",
    description: "Product details, certifications, promotions and relevant information.",
  },
  {
    icon: LifeBuoy,
    title: "After Purchase · Support",
    description: "Instructions, usage guidance, recipes, warranty or service information.",
  },
  {
    icon: Repeat,
    title: "Ongoing · Engage",
    description: "Campaigns, feedback, loyalty and new digital experiences.",
  },
];

const CAMPAIGN_ITEMS = [
  "Product Launches",
  "Promotions",
  "Seasonal Campaigns",
  "Product Education",
  "Sampling",
  "Contests",
  "Consumer Engagement",
  "Feedback Campaigns",
];

const UPDATE_ITEMS = [
  "Update product information",
  "Change campaign content",
  "Add a new language",
  "Replace imagery",
  "Update documents",
  "Launch new experiences",
];

const COMPLIANCE_ITEMS = [
  "DPP Information",
  "Packaging Information",
  "Material Data",
  "Sustainability Information",
  "Product Documentation",
  "Traceability Information",
];

const INSIGHT_ITEMS = ["Visitor Location", "Product Views", "Device Type", "Browser", "Time on Page", "Feedback"];

const CHANGING_FORCES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Link2,
    title: "GS1 Digital Link",
    description: "Connect physical product identity to the web.",
  },
  {
    icon: ShieldCheck,
    title: "DPP",
    description: "Provide structured digital product information where applicable.",
  },
  {
    icon: QrCode,
    title: "Connected Packaging",
    description: "Turn packaging into an accessible digital touchpoint.",
  },
];

export default function ProductExperiencePage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="Product Experience · Digital Engagement"
        title="Give Every Product an Experience Beyond the Package."
        description="Transform a product scan into a rich, branded digital experience bringing product information, stories, guidance, sustainability content and customer engagement together in one connected destination."
        pills={["Product Information", "Brand Story", "Multilingual Content", "Campaigns", "Feedback"]}
        primary={{ label: "Create Your Product Experience", href: "/book-a-demo" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Beyond the Physical Package"
          title="Your Packaging Has Limited Space. Your Digital Experience Doesn't."
          description="Product packaging can only communicate so much. Productix extends the physical package into a flexible digital experience where brands can deliver richer, more relevant and continuously updated information."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Physical Package", icon: Package },
              { label: "Scan", icon: ScanLine },
              { label: "Productix Experience", icon: Sparkles },
            ]}
          />
        </div>
        <div className="mt-12">
          <BranchDiagram
            root={{ label: "Productix Experience", icon: Sparkles }}
            branches={[
              { label: "Information", icon: FileText },
              { label: "Story", icon: BookOpen },
              { label: "Engagement", icon: MessageSquare },
            ]}
          />
        </div>
        <Reveal delay={150} className="mt-10">
          <Statement>Print what matters. Connect everything else.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="The Digital Product Layer"
          title="One Product. One Digital Destination. Endless Possibilities."
          description="A connected product experience gives each product a digital destination that can evolve throughout its lifecycle. It can bring together:"
        />
        <PillRow items={DIGITAL_LAYER_ITEMS} />
        <Reveal delay={150} className="mt-10">
          <Statement>Give customers the information they need - when and where they need it.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="From Scan to Experience"
          title="One Scan. A Complete Product Experience."
        />
        <div className="mt-14">
          <NumberedSteps
            steps={[
              { index: "01", title: "Product", description: "Physical Product" },
              { index: "02", title: "Identity", description: "GTIN / Digital Link" },
              { index: "03", title: "Scan", description: "QR / 2D Code" },
              { index: "04", title: "Experience", description: "Productix Digital Page" },
              { index: "05", title: "Engage", description: "Explore · Learn · Interact" },
              { index: "06", title: "Intelligence", description: "Measure · Understand · Improve" },
            ]}
          />
        </div>
        <Reveal delay={150} className="mt-12">
          <p className="mx-auto max-w-xl text-center text-[15px] leading-[1.7] text-ink/60">
            Productix connects the physical product to a digital experience designed around your brand,
            product and customer.
          </p>
        </Reveal>
      </DetailSection>

      <DetailSection id="builder" bg="cream" flip>
        <SectionHeading
          eyebrow="Visual Experience Builder"
          title="Your Brand. Your Story. Your Experience."
          description="Build digital product pages that look and feel like your brand - not a generic information portal."
        />
        <SectionLabel>Capabilities</SectionLabel>
        <div className="mt-6">
          <IconGrid items={BUILDER_FEATURES} columns="sm:grid-cols-2 lg:grid-cols-4" />
        </div>
        <Reveal delay={150} className="mt-10">
          <Statement>Complete freedom to build the digital story behind your product.</Statement>
        </Reveal>
        <LinkOut label="Explore the Experience Platform" href="/platform/experience" />
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="Global Product Delivery"
          title="One Product. Every Market. Every Language."
          description="Deliver localized product experiences across markets while maintaining a connected product identity."
        />
        <div className="mt-14">
          <BranchDiagram
            root={{ label: "Connected Identity", icon: Fingerprint }}
            branches={[
              { label: "English", icon: Globe, items: ["Experience"] },
              { label: "German", icon: Globe, items: ["Experience"] },
              { label: "French", icon: Globe, items: ["Experience"] },
            ]}
          />
        </div>
        <Reveal delay={150} className="mt-10">
          <Statement>Give international customers relevant product information in the language they understand.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Product Information"
          title="Put the Right Information Behind Every Product."
          description="Move beyond static packaging information with a digital product destination that can provide richer and continuously maintainable information."
        />
        <PillRow items={PRODUCT_INFO_ITEMS} />
        <Reveal delay={150} className="mt-10">
          <Statement>Make product information accessible beyond the label.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Lifecycle Experiences"
          title="The Product Experience Can Evolve With the Product."
          description="Instead of one static page forever, Productix can support different digital experiences throughout the product lifecycle."
        />
        <SectionLabel>Across the product lifecycle</SectionLabel>
        <div className="mt-6">
          <IconGrid items={LIFECYCLE_STAGES} columns="sm:grid-cols-2 lg:grid-cols-4" />
        </div>
        <Reveal delay={150} className="mt-10">
          <Statement>The physical package stays the same. The digital experience can evolve.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Packaging-Led Engagement"
          title="Turn Products Into Brand Touchpoints."
          description="Connect marketing campaigns directly to physical products and packaging, creating a measurable bridge between brand communication and real-world product interactions."
        />
        <PillRow items={CAMPAIGN_ITEMS} />
        <Reveal delay={150} className="mt-10">
          <Statement>Take the campaign from the screen to the product and back again.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="Always Up to Date"
          title="Change the Experience Without Changing the Package."
          description="Product information and digital content can be updated centrally, allowing brands to keep connected product experiences current."
        />
        <div className="mt-10">
          <CheckList items={UPDATE_ITEMS} columns="sm:grid-cols-2" />
        </div>
        <Reveal delay={150} className="mt-10">
          <Statement>Launch. Update. Improve. Repeat.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="Information + Compliance"
          title="Bring Compliance Information Into the Product Experience."
          description="Relevant regulatory and sustainability information can be presented alongside the broader digital product experience, helping customers access information through the same connected product identity."
        />
        <PillRow items={COMPLIANCE_ITEMS} />
        <Reveal delay={150} className="mt-10">
          <Statement>Compliance information doesn&apos;t have to live separately from the customer experience.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="Measure the Experience"
          title="Every Interaction Can Teach You Something."
          description="A connected product experience creates a new digital touchpoint between your product and its audience. Productix helps you understand how that experience is being accessed and engaged with."
        />
        <SectionLabel>Insights</SectionLabel>
        <PillRow items={INSIGHT_ITEMS} />
        <LinkOut label="Explore Product Intelligence" href="/solutions/product-intelligence" />
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Enterprise Scale"
          title="Create Experiences Across Your Entire Product Portfolio."
          description="Build connected experiences across individual products, product families, brands and markets from one centralized infrastructure."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "Product", icon: Package },
              { label: "Product Family", icon: Layers },
              { label: "Brand", icon: Building2 },
              { label: "Portfolio", icon: Boxes },
              { label: "Global Experience Ecosystem", icon: Globe },
            ]}
          />
        </div>
        <Reveal delay={150} className="mt-10">
          <Statement>One platform. Every product experience.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="The Connected Experience"
          title="Identity → Information → Experience → Intelligence"
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "Physical Product", icon: Package },
              { label: "Digital Identity", icon: Fingerprint },
              { label: "Product Information", icon: FileText },
              { label: "Branded Experience", icon: Sparkles },
              { label: "Customer Interaction", icon: Activity },
              { label: "Product Intelligence", icon: TrendingUp },
            ]}
          />
        </div>
        <Reveal delay={150} className="mt-12">
          <p className="mx-auto max-w-xl text-center text-[15px] leading-[1.7] text-ink/60">
            Productix connects the physical product, its information and its digital experience into
            one continuously evolving product layer.
          </p>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="The Product Experience Is Changing"
          title="Products Are Becoming Digital Touchpoints."
          description="As products become increasingly connected through 2D barcodes, GS1 Digital Link and emerging digital product requirements, the opportunity extends beyond compliance."
        />
        <SectionLabel>Three forces</SectionLabel>
        <div className="mt-6">
          <IconGrid items={CHANGING_FORCES} columns="sm:grid-cols-3" />
        </div>
        <Reveal delay={150} className="mt-10">
          <Statement>The next generation of product experience starts with the product itself.</Statement>
        </Reveal>
      </DetailSection>

      <DetailCta
        title="Give Every Product a Digital Story."
        description="Connect your products to richer information, branded experiences and meaningful customer interactions through Productix."
        primary={{ label: "Create Your Product Experience", href: "/book-a-demo" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      <Footer />
    </div>
  );
}
