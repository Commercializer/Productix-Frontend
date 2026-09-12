import {
  BarChart3,
  Boxes,
  Eye,
  Fingerprint,
  Globe,
  Landmark,
  Layers,
  Link2,
  Megaphone,
  Package,
  RefreshCw,
  Rocket,
  ShieldCheck,
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
import { Footer } from "@/components/landing/footer";
import { Header } from "@/components/landing/header";
import { Reveal } from "@/components/landing/reveal";

const CANONICAL = "https://www.productix.io/company/about";

export const metadata: Metadata = {
  title: "About Productix | Building the Future of Connected Products",
  description:
    "Discover the story behind Productix, created to give product packaging a digital layer and evolving into future-ready infrastructure for connected products, identity and intelligence.",
  keywords: [
    "Productix connected product infrastructure",
    "connected products",
    "connected packaging",
    "digital product infrastructure",
    "digital product identity",
    "connected packaging platform",
    "product digitalization",
    "future-ready product infrastructure",
    "product intelligence",
    "GS1 Digital Link",
    "Digital Product Passport",
    "Productix company",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "The Story Behind Productix | Connected Product Infrastructure",
    description:
      "Productix began with a simple idea: give product packaging a digital layer. Today, we are building future-ready infrastructure for connected products, identity, experience and intelligence.",
    url: CANONICAL,
    images: [
      { url: "/images/becoming-digital.jpg", alt: "Productix - building future-ready infrastructure for connected products" },
    ],
  },
};

const SOFTWARE_LAYERS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Boxes, title: "ERP", description: "Managed operations." },
  { icon: Users, title: "CRM", description: "Managed relationships." },
  { icon: Megaphone, title: "Marketing Platforms", description: "Managed engagement." },
  { icon: BarChart3, title: "Analytics Platforms", description: "Managed intelligence." },
];

const IDEA_PILLARS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Fingerprint, title: "Digital Identity", description: "A package could carry a digital identity." },
  {
    icon: Sparkles,
    title: "Richer Experiences",
    description: "It could connect consumers to richer experiences.",
  },
  {
    icon: RefreshCw,
    title: "Evolving Information",
    description: "It could deliver information that evolves after printing.",
  },
  {
    icon: BarChart3,
    title: "Product Intelligence",
    description: "It could create intelligence from every interaction.",
  },
];

const VALUES: { icon: LucideIcon; title: string; description: string }[] = [
  {
    icon: Fingerprint,
    title: "Trusted Identity",
    description: "Every connected product should begin with a trusted and identifiable digital foundation.",
  },
  {
    icon: Link2,
    title: "Connected Experience",
    description: "Products should create meaningful digital experiences beyond the physical package.",
  },
  {
    icon: BarChart3,
    title: "Product Intelligence",
    description: "Every interaction can become valuable intelligence for the business.",
  },
  {
    icon: Eye,
    title: "Transparency",
    description: "Product information should be accessible, structured and meaningful across the product lifecycle.",
  },
  {
    icon: Rocket,
    title: "Future Ready",
    description: "The best product infrastructure is built not only for today's requirements, but for what comes next.",
  },
];

const PORTFOLIO: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Landmark, title: "FinTech", description: "Technology products for financial services." },
  { icon: Megaphone, title: "MarTech", description: "Technology products for marketing and engagement." },
  {
    icon: Link2,
    title: "ConnectTech",
    description: "Productix represents this focus, creating the digital infrastructure that connects physical products with the digital world.",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="The Productix Story"
        title="We Believe Every Product Deserves More Than a Package."
        description="Productix began with a simple observation: the world built software for almost everything around a product, but the product package itself remained largely disconnected. We set out to change that."
        pills={["Connected Products", "Digital Product Identity", "Future-Ready Infrastructure"]}
        primary={{ label: "Book a Demo", href: "/book-a-demo" }}
        secondary={{ label: "Contact Us", href: "/company/contact" }}
      />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Where It Started"
          title="Born From a Gap in the Physical World."
          description="Software had become an essential layer across business, managing operations, relationships, engagement and intelligence. Yet one of the world's largest industries, product packaging, had no dedicated digital infrastructure of its own."
        />
        <div className="mt-14">
          <IconGrid items={SOFTWARE_LAYERS} columns="sm:grid-cols-2 lg:grid-cols-4" />
        </div>
        <p className="mx-auto mt-12 max-w-xl text-center text-[14.5px] leading-relaxed text-ink/60">
          Billions of products are manufactured, packaged, distributed and consumed every year. But once
          printed, most packaging remained static.
        </p>
        <div className="mx-auto mt-6 max-w-xl">
          <CheckList
            items={[
              "Information was fixed",
              "Experiences were limited",
              "Changes were expensive",
              "No dedicated digital layer behind the package",
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>That was the gap Productix was created to fill.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="The Idea"
          title="Give Packaging a Digital Layer."
          description="We started by imagining what packaging could become if it had software behind it."
        />
        <div className="mt-14">
          <IconGrid items={IDEA_PILLARS} columns="sm:grid-cols-2 lg:grid-cols-4" />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            The physical package would no longer have to carry everything itself. That idea became the
            foundation of Productix.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="The Evolution"
          title="From Connected Packaging to Future-Ready Product Infrastructure."
          description="As we developed Productix, the opportunity became much larger than creating digital experiences for packaging. The world was moving toward structured product information, global identification standards, digital product passports and new regulatory requirements. We evolved Productix accordingly."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Connected Packaging", icon: Package },
              { label: "Structured Product Data", icon: Layers },
              { label: "Global ID Standards", icon: Globe },
              { label: "Future-Ready Infrastructure", icon: ShieldCheck },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>Connect the physical product to a trusted, future-ready digital foundation.</Statement>
        </Reveal>
        <p className="mx-auto mt-8 max-w-xl text-center text-[14.5px] leading-relaxed text-ink/60">
          This evolution allows enterprises to approach digital product transformation early, rather than
          waiting for regulations, standards or market requirements to force expensive changes later.
        </p>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Why We Build It This Way"
          title="Future Readiness Should Start Before the Deadline."
          description="We believe companies should not have to rebuild their products every time the world changes."
        />
        <div className="mx-auto mt-10 max-w-lg">
          <CheckList
            items={[
              "A new regulation should not automatically mean another packaging redesign",
              "A new market should not require another disconnected system",
              "A new standard should not mean starting from zero",
            ]}
            columns="sm:grid-cols-1"
          />
        </div>
        <p className="mx-auto mt-10 max-w-xl text-center text-[14.5px] leading-relaxed text-ink/60">
          Productix is built to help enterprises prepare early, adopt global standards progressively and
          build their digital product infrastructure without unnecessary duplication.
        </p>
        <Reveal delay={120} className="mt-8">
          <Statement>Prepare Once. Build Forward.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="The Physical Reality"
          title="Packaging Changes Are Not Just Digital Changes."
          description="For many products, changing packaging is a physical and expensive process."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          It can involve
        </p>
        <div className="mx-auto mt-6 max-w-xl">
          <CheckList
            items={[
              "New artwork",
              "New printing",
              "New packaging inventory",
              "New production cycles",
              "New moulds or tooling",
              "Supply-chain coordination",
              "Product rework",
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>Let the digital layer evolve without repeatedly rebuilding the physical product.</Statement>
        </Reveal>
        <p className="mx-auto mt-8 max-w-xl text-center text-[14.5px] leading-relaxed text-ink/60">
          Where appropriate, enterprises can establish the digital foundation early and continue expanding
          the information and experiences connected to the product over time.
        </p>
        <Reveal delay={160} className="mt-6">
          <Statement>The package stays physical. The digital layer keeps evolving.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading eyebrow="Our Values" title="What We Believe." description="Productix is guided by five principles." />
        <div className="mt-14">
          <IconGrid items={VALUES} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Our Standard"
          title="Built to Move With the World."
          description="We believe future-ready product infrastructure should not be built in isolation. That's why Productix aligns with the direction of global product identification and data standards, including GS1 Digital Link, while supporting the evolving ecosystem around Digital Product Passports and product and packaging regulations."
        />
        <Reveal delay={120} className="mt-10">
          <Statement>
            Help companies move early. Move correctly. And avoid doing the same transformation twice.
          </Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Our Vision"
          title="Make Products Ready for What's Next."
          description="We are building toward a world where products can carry trusted digital identities, where packaging can become a connected information layer, and where businesses can adapt their digital product information without constantly rebuilding the physical product. A world where compliance, experience and intelligence can evolve together."
        />
        <Reveal delay={120} className="mt-10">
          <Statement>We call that future-ready product infrastructure.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Commercializer"
          title="Productix Is Part of the Commercializer Enterprise Product Portfolio."
          description="Productix is an enterprise product of Commercializer, an enterprise product portfolio company specializing in FinTech, MarTech and ConnectTech, building technology products designed to solve meaningful business challenges across emerging digital ecosystems."
        />
        <div className="mt-14">
          <IconGrid items={PORTFOLIO} columns="sm:grid-cols-1 lg:grid-cols-3" />
        </div>
      </DetailSection>

      <DetailCta
        title="Give Every Product a Digital Identity."
        description="We started with packaging. We're building for the product - and helping companies become future-ready before the future becomes a requirement."
        primary={{ label: "Book a Demo", href: "/book-a-demo" }}
        secondary={{ label: "Contact Us", href: "/company/contact" }}
      />

      <Footer />
    </div>
  );
}
