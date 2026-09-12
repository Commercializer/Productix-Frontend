import {
  Activity,
  Brain,
  Briefcase,
  Building2,
  Clock,
  Compass,
  Database,
  Eye,
  FlaskConical,
  Globe,
  Laptop,
  Layers,
  LineChart,
  Lightbulb,
  Megaphone,
  MessageSquareHeart,
  Package,
  Radio,
  Repeat,
  ScanLine,
  Smartphone,
  Sparkles,
  Tag,
  TrendingUp,
  Users,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";
import type { ReactNode } from "react";

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

const CANONICAL = "https://www.productix.io/solutions/product-intelligence";

export const metadata: Metadata = {
  title: "Connected Product Intelligence & Analytics Platform | Productix",
  description:
    "Turn product scans and customer interactions into actionable intelligence with product, country, device, engagement and feedback analytics.",
  keywords: [
    "product intelligence",
    "connected product analytics",
    "product analytics",
    "product engagement analytics",
    "product scan analytics",
    "consumer product insights",
    "connected packaging analytics",
    "customer feedback",
    "product interaction data",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Connected Product Intelligence | Productix",
    description:
      "Understand how customers interact with your products through scan, product, country, device, engagement and feedback intelligence.",
    url: CANONICAL,
    images: [
      {
        url: "/images/Intelligence-image.png",
        alt: "Productix connected product intelligence and analytics",
      },
    ],
  },
};

function PillRow({ items }: { items: string[] }) {
  return (
    <Reveal className="flex flex-wrap justify-center gap-2">
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

function PillLabel({ children }: { children: ReactNode }) {
  return (
    <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
      {children}
    </p>
  );
}

function ClosingParagraph({ children }: { children: ReactNode }) {
  return (
    <Reveal className="mx-auto mt-10 max-w-xl text-center text-[15px] leading-[1.7] text-ink/60">
      {children}
    </Reveal>
  );
}

const ACCESS_INTELLIGENCE: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Smartphone, title: "Device Type", description: "Mobile · Desktop · Tablet" },
  { icon: Laptop, title: "Browser", description: "Chrome · Safari · Edge · Firefox" },
];

const ACTIONABLE_INTELLIGENCE: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Megaphone, title: "Marketing", description: "Which products and campaigns generate the most engagement?" },
  { icon: Eye, title: "Product", description: "Which product experiences attract the most attention?" },
  { icon: Globe, title: "Markets", description: "Where are customers interacting with products?" },
  { icon: Users, title: "Customer Experience", description: "How are customers engaging with product information?" },
  { icon: Lightbulb, title: "Improvement", description: "What feedback patterns should the team act on?" },
];

export default function ProductIntelligencePage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="Product Intelligence · Connected Product Data"
        title="Turn Product Interactions Into Actionable Intelligence."
        description="Understand how your products are discovered, accessed and experienced across markets with intelligence generated from connected product interactions."
        pills={["Scans", "Products", "Countries", "Devices", "Engagement", "Feedback"]}
        primary={{ label: "Explore Product Intelligence", href: "#metrics" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      {/* 1. FROM PRODUCT TO DATA */}
      <DetailSection bg="white">
        <SectionHeading
          eyebrow="From Product to Data"
          title="Your Products Are Already Creating Signals."
          description="Every interaction with a connected product can reveal something about your customers, markets and product experiences. Productix turns those interactions into structured intelligence you can understand and act on."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Product", icon: Package },
              { label: "Scan", icon: ScanLine },
              { label: "Digital Experience", icon: Sparkles },
              { label: "Interaction", icon: Activity },
              { label: "Data", icon: Database },
              { label: "Intelligence", icon: Brain },
              { label: "Action", icon: TrendingUp },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-14">
          <Statement>Turn every product interaction into a source of insight.</Statement>
        </Reveal>
      </DetailSection>

      {/* 2. THE DIGITAL SIGNAL */}
      <DetailSection bg="cream" flip maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="The Digital Signal"
          title="See What Happens After the Scan."
          description="Product intelligence is the layer of insight generated from interactions with digitally connected products."
        />
        <PillLabel>Productix helps enterprises understand</PillLabel>
        <div className="mt-6">
          <PillRow
            items={[
              "Where Products Are Accessed",
              "Which Products Get Attention",
              "How Long Visitors Engage",
              "What Customers Tell You",
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>
            Move from knowing that a product was scanned to understanding what happened next.
          </Statement>
        </Reveal>
      </DetailSection>

      {/* 3. FROM SCAN TO INSIGHT — metrics anchor */}
      <DetailSection id="metrics" bg="white">
        <SectionHeading
          eyebrow="From Scan to Insight"
          title="Every Scan Creates a Data Point."
          description="Each interaction moves through a consistent process, from connection to action."
        />
        <div className="mt-14">
          <NumberedSteps
            steps={[
              {
                index: "01",
                title: "Connect",
                description: "A product is linked to its digital identity.",
                tag: "Product + Digital Identity",
              },
              {
                index: "02",
                title: "Scan",
                description: "A customer or partner interacts with the connected product.",
                tag: "Customer / Partner Interaction",
              },
              {
                index: "03",
                title: "Experience",
                description: "The interaction opens the Productix digital experience.",
                tag: "Productix Digital Experience",
              },
              {
                index: "04",
                title: "Capture",
                description: "The interaction is captured as structured data.",
                tag: "Interaction Data",
              },
              {
                index: "05",
                title: "Analyze",
                description: "Productix surfaces patterns across interactions.",
                tag: "Patterns & Performance",
              },
              {
                index: "06",
                title: "Act",
                description: "Teams use the intelligence to improve the product and experience.",
                tag: "Improve Product & Experience",
              },
            ]}
          />
        </div>
        <ClosingParagraph>
          Productix creates a continuous feedback loop between the physical product and its digital
          experience.
        </ClosingParagraph>
      </DetailSection>

      {/* 4. GEOGRAPHIC INTELLIGENCE */}
      <DetailSection bg="cream" flip maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="Geographic Intelligence"
          title="Know Where Your Products Are Being Engaged With."
          description="Understand connected product interactions across markets and countries."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Product", icon: Package },
              { label: "Country", icon: Globe },
              { label: "Engagement", icon: Activity },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-14">
          <Statement>
            Identify markets generating engagement and understand where your digital product
            experiences are reaching customers.
          </Statement>
        </Reveal>
      </DetailSection>

      {/* 5. PRODUCT PERFORMANCE */}
      <DetailSection bg="white" maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Product Performance"
          title="Know Which Products Are Getting Attention."
          description="Compare digital interactions across products to understand where customers are engaging most."
        />
        <Reveal delay={80} className="mx-auto mt-5 max-w-md text-center text-[13px] leading-relaxed text-ink/45">
          As your portfolio grows, this view can extend across product families and brands.
        </Reveal>
        <Reveal delay={140} className="mt-10">
          <Statement>See your product portfolio through the lens of real-world interaction.</Statement>
        </Reveal>
      </DetailSection>

      {/* 6. ACCESS INTELLIGENCE */}
      <DetailSection bg="cream" flip maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Access Intelligence"
          title="Know How Customers Reach Your Products."
          description="Understand the technology customers use when interacting with connected products."
        />
        <div className="mt-10">
          <IconGrid items={ACCESS_INTELLIGENCE} columns="sm:grid-cols-2" />
        </div>
        <ClosingParagraph>
          Connected product experiences are often accessed directly from packaging in real-world
          environments. Understanding the access environment helps teams optimize the experience
          for how customers actually interact.
        </ClosingParagraph>
      </DetailSection>

      {/* 7. EXPERIENCE INTELLIGENCE */}
      <DetailSection bg="white" maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Experience Intelligence"
          title="A Scan Is Only the Beginning."
          description="A scan tells you that someone arrived. Engagement tells you what happened after they arrived."
        />
        <PillLabel>Productix can surface</PillLabel>
        <div className="mt-6">
          <PillRow items={["Average Visitor Duration", "Interaction Trends"]} />
        </div>
        <Reveal delay={120} className="mt-10">
          <Statement>Measure attention, not just traffic.</Statement>
        </Reveal>
      </DetailSection>

      {/* 8. VOICE OF THE PRODUCT */}
      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Voice of the Product"
          title="Let the Product Start the Conversation."
          description="Connected products can create a direct digital channel for customers to provide feedback, helping brands understand experiences closer to the point of product interaction."
        />
        <PillLabel>Feedback can help identify</PillLabel>
        <div className="mt-6">
          <PillRow
            items={[
              "Customer Satisfaction",
              "Product Issues",
              "Experience Gaps",
              "Customer Needs",
              "Improvement Opportunities",
            ]}
          />
        </div>
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Product", icon: Package },
              { label: "Scan", icon: ScanLine },
              { label: "Experience", icon: Sparkles },
              { label: "Feedback", icon: MessageSquareHeart },
              { label: "Insight", icon: Compass },
              { label: "Improvement", icon: TrendingUp },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-14">
          <Statement>Turn customer feedback into product intelligence.</Statement>
        </Reveal>
      </DetailSection>

      {/* 9. CONTINUOUS IMPROVEMENT */}
      <DetailSection bg="white" maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Continuous Improvement"
          title="Connect. Learn. Improve. Repeat."
          description="Each cycle strengthens how the product and its digital experience work together."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "Product", icon: Package },
              { label: "Connect", icon: Radio },
              { label: "Experience", icon: Sparkles },
              { label: "Engage", icon: Activity },
              { label: "Measure", icon: LineChart },
              { label: "Learn", icon: Compass },
              { label: "Improve", icon: TrendingUp },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-14">
          <Statement>
            Product intelligence turns the connected product into a continuous learning loop, not a
            static digital destination.
          </Statement>
        </Reveal>
      </DetailSection>

      {/* 10. ACTIONABLE INTELLIGENCE */}
      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="Actionable Intelligence"
          title="Data Is Valuable When It Changes a Decision."
          description="Productix intelligence can help teams explore questions such as:"
        />
        <div className="mt-14">
          <IconGrid items={ACTIONABLE_INTELLIGENCE} columns="sm:grid-cols-2 lg:grid-cols-3" />
        </div>
      </DetailSection>

      {/* 11. ENTERPRISE VISIBILITY */}
      <DetailSection bg="white">
        <SectionHeading
          eyebrow="Enterprise Visibility"
          title="One View Across Your Connected Product Ecosystem."
          description="Bring product interaction data together across brands, products, markets and digital experiences."
        />
        <div className="mt-14">
          <BranchDiagram
            root={{ label: "Enterprise", icon: Building2 }}
            branches={[
              { label: "Brand A", icon: Layers, items: ["Products"] },
              { label: "Brand B", icon: Layers, items: ["Products"] },
              { label: "Brand C", icon: Layers, items: ["Products"] },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-14">
          <Statement>One connected data layer across your product portfolio.</Statement>
        </Reveal>
      </DetailSection>

      {/* 12. CLOSE THE LOOP */}
      <DetailSection bg="cream" flip maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Close the Loop"
          title="Build Better Experiences With What You Learn."
          description="Product intelligence shouldn't sit separately from the product experience. The insights generated from connected products can inform how digital experiences evolve."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "Intelligence", icon: Brain },
              { label: "Insight", icon: Compass },
              { label: "Experience Change", icon: Sparkles },
              { label: "Customer Interaction", icon: Users },
              { label: "New Data", icon: Database },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-14">
          <Statement>Your product experience gets smarter with every interaction.</Statement>
        </Reveal>
      </DetailSection>

      {/* 13. CONNECTED COMPLIANCE */}
      <DetailSection bg="white" maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Connected Compliance"
          title="Understand How Digital Product Information Is Being Accessed."
          description="As enterprises create digital product information for regulatory and market requirements, connected product intelligence can provide visibility into how that information is being accessed."
        />
        <PillLabel>Visibility includes</PillLabel>
        <div className="mt-6">
          <PillRow items={["Country", "Product", "Engagement"]} />
        </div>
      </DetailSection>

      {/* 14. THE FUTURE OF PRODUCT DATA */}
      <DetailSection bg="cream" flip>
        <SectionHeading
          eyebrow="The Future of Product Data"
          title="Products Are Becoming Digital Data Sources."
          description="As GS1 Digital Link, 2D barcodes, connected packaging and digital product initiatives become increasingly important, products can become active digital touchpoints rather than static physical objects."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Traditional Product", icon: Package },
              { label: "Identification", icon: Tag },
              { label: "Connected Product", icon: Radio },
              { label: "Interaction", icon: Activity },
              { label: "Intelligence", icon: Brain },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-14">
          <Statement>
            The connected product doesn&apos;t just deliver information. It generates insight.
          </Statement>
        </Reveal>
      </DetailSection>

      {/* 15. FROM ONE PRODUCT TO PORTFOLIO */}
      <DetailSection bg="white" maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="From One Product to Portfolio"
          title="Start With One Product. Learn at Scale."
          description="Begin with a product or campaign, understand the interaction data and expand connected intelligence across your portfolio."
        />
        <div className="mt-14">
          <FlowSteps
            vertical
            steps={[
              { label: "One Product", icon: Package },
              { label: "Pilot", icon: FlaskConical },
              { label: "Product Family", icon: Layers },
              { label: "Brand", icon: Tag },
              { label: "Portfolio", icon: Briefcase },
              { label: "Enterprise Intelligence", icon: Brain },
            ]}
          />
        </div>
        <Reveal delay={120} className="mt-14">
          <Statement>One connected infrastructure. A growing intelligence layer.</Statement>
        </Reveal>
      </DetailSection>

      {/* 16. THE PRODUCTIX MODEL */}
      <DetailSection bg="cream" flip>
        <SectionHeading eyebrow="The Productix Model" title="Connect. Capture. Understand. Improve." />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Connect", icon: Radio, sublabels: ["Physical Product"] },
              { label: "Capture", icon: Database, sublabels: ["Product Interactions"] },
              { label: "Understand", icon: Brain, sublabels: ["Analytics + Feedback"] },
              { label: "Improve", icon: TrendingUp, sublabels: ["Experience + Product"] },
              { label: "Repeat", icon: Repeat },
            ]}
          />
        </div>
        <ClosingParagraph>
          Productix turns connected product interactions into a continuous source of actionable
          intelligence.
        </ClosingParagraph>
      </DetailSection>

      <DetailCta
        title="Turn Every Product Interaction Into Intelligence."
        description="Discover what your connected products can tell you about your customers, markets and product experiences."
        primary={{ label: "Book a Demo", href: "/book-a-demo" }}
        secondary={{ label: "Talk to Productix", href: "/company/contact" }}
      />

      <Footer />
    </div>
  );
}
