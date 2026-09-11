import {
  Activity,
  Clock,
  Compass,
  Database,
  Eye,
  Globe,
  Laptop,
  MessageSquareHeart,
  Package,
  Radio,
  ScanLine,
  Smartphone,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import type { Metadata } from "next";

import {
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

const CANONICAL = "https://www.productix.io/platform/intelligence";

export const metadata: Metadata = {
  title: "Product Analytics & Intelligence Platform",
  description:
    "Measure connected product interactions with scan, country, product, device, browser, visitor duration and feedback analytics through Productix.",
  keywords: [
    "product analytics platform",
    "product intelligence platform",
    "connected product analytics",
    "product scan analytics",
    "packaging analytics",
    "product engagement analytics",
    "customer feedback analytics",
    "product interaction data",
    "consumer product insights",
    "QR scan analytics",
  ],
  alternates: { canonical: CANONICAL },
  openGraph: {
    title: "Intelligence | Product Analytics & Insights | Productix",
    description:
      "Understand connected product interactions through scan, country, product, device, engagement and customer feedback analytics.",
    url: CANONICAL,
    images: [{ url: "/images/product-intelligence.jpg", alt: "Productix connected product analytics and intelligence platform" }],
  },
};

const CORE_METRICS: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ScanLine, title: "Total Scans", description: "Track the volume of product interactions." },
  { icon: Eye, title: "Product Views", description: "See which products and product pages attract the most attention." },
  { icon: TrendingUp, title: "Interaction Trends", description: "Understand how engagement changes over time." },
  { icon: Clock, title: "Average Visitor Duration", description: "See how long visitors spend with your product experiences." },
];

const PRODUCT_PERFORMANCE: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: ScanLine, title: "Scans", description: "Compare interaction volume across products and SKUs." },
  { icon: MessageSquareHeart, title: "Feedback", description: "See ratings and responses collected per product." },
  { icon: Activity, title: "Engagement Trend", description: "Watch how interaction with each product changes over time." },
];

const ACCESS_INTELLIGENCE: { icon: LucideIcon; title: string; description: string }[] = [
  { icon: Smartphone, title: "Device Type", description: "Mobile · Desktop · Tablet" },
  { icon: Laptop, title: "Browser", description: "Chrome · Safari · Edge · Firefox" },
];

const FEEDBACK_VALUE = [
  "What customers like",
  "What needs improvement",
  "Product issues",
  "Experience quality",
  "Market-specific feedback",
  "Customer sentiment",
];

export default function IntelligencePage() {
  return (
    <div className="min-h-dvh bg-paper text-ink antialiased">
      <Header />

      <DetailHero
        eyebrow="Product Intelligence · Analytics"
        title="Know How Your Products Are Being Experienced."
        description="Productix turns every product interaction into actionable intelligence, helping enterprises understand where, how and how often their connected products are being accessed."
        pills={["Scan analytics", "Product analytics", "Market insights", "Device intelligence", "Engagement", "Feedback"]}
        primary={{ label: "Explore Product Intelligence", href: "#metrics" }}
        secondary={{ label: "Book a Demo", href: "/book-a-demo" }}
      />

      <DetailSection bg="white">
        <SectionHeading
          eyebrow="From Interaction to Intelligence"
          title="Every Scan Tells a Story."
          description="When a customer scans or interacts with a connected product, Productix captures valuable signals about the product, market and digital experience."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Product", icon: Package },
              { label: "Scan / Tap", icon: ScanLine },
              { label: "Interaction", icon: Sparkles },
              { label: "Data", icon: Database },
              { label: "Insight", icon: Compass },
              { label: "Action", icon: TrendingUp },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection id="metrics" bg="cream" flip>
        <SectionHeading
          eyebrow="Product Interaction Analytics"
          title="See Every Product Interaction."
          description="Understand how your connected products are being accessed across markets, products and customer touchpoints."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Core metrics
        </p>
        <div className="mt-6">
          <IconGrid items={CORE_METRICS} columns="sm:grid-cols-2 lg:grid-cols-4" />
        </div>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="Market Intelligence"
          title="Know Where Your Products Are Being Experienced."
          description="Understand product engagement across countries and markets."
        />
        <div className="mt-12">
          <FlowSteps steps={[{ label: "Country", icon: Globe }, { label: "Scans", icon: ScanLine }, { label: "Engagement", icon: Activity }]} />
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="Product Performance"
          title="Know Which Products Get Attention."
          description="Compare engagement across products and SKUs to understand where customers are interacting most. This can eventually support product portfolio and marketing decisions."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Possible metrics
        </p>
        <div className="mt-6">
          <IconGrid items={PRODUCT_PERFORMANCE} columns="sm:grid-cols-3" />
        </div>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Experience Engagement"
          title="Understand How People Access Your Products."
          description="Productix can surface how connected experiences are actually being consumed, helping marketing and product teams design accordingly."
        />
        <div className="mt-10">
          <IconGrid items={ACCESS_INTELLIGENCE} columns="sm:grid-cols-2" />
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Product Feedback"
          title="Hear Directly From the People Using Your Products."
          description="Turn connected products into a direct feedback channel between your brand and the people interacting with your products."
        />
        <p className="mt-12 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Feedback can help you understand
        </p>
        <Reveal delay={100} className="mt-6 flex flex-wrap justify-center gap-2">
          {FEEDBACK_VALUE.map((item) => (
            <span key={item} className="rounded-full bg-white/70 px-3.5 py-1.5 text-[12.5px] font-medium text-ink/65">
              {item}
            </span>
          ))}
        </Reveal>
        <Reveal delay={160} className="mt-10">
          <Statement>Product interaction tells you what happened. Feedback helps you understand why.</Statement>
        </Reveal>
      </DetailSection>

      <DetailSection bg="white" maxWidth="max-w-3xl">
        <SectionHeading
          eyebrow="One Connected System"
          title="Intelligence Starts With Connection."
          description="Every product connected through Productix can become a source of intelligence, without requiring a separate analytics infrastructure for every campaign, package or product."
        />
        <div className="mt-14">
          <FlowSteps
            steps={[
              { label: "Connect", icon: Radio },
              { label: "Product Identity", icon: ScanLine },
              { label: "Experience", icon: Sparkles },
              { label: "Interaction", icon: Activity },
              { label: "Intelligence", icon: TrendingUp },
              { label: "Action", icon: Compass },
            ]}
          />
        </div>
      </DetailSection>

      <DetailSection bg="cream" flip maxWidth="max-w-2xl">
        <SectionHeading
          eyebrow="Built for Product Portfolios"
          title="From One Product to Thousands."
          description="Monitor connected product experiences across products, SKUs, markets and campaigns from a unified intelligence layer."
        />
        <p className="mt-10 text-center text-[13px] font-semibold uppercase tracking-[0.14em] text-ink/40">
          Potential dimensions
        </p>
        <Reveal delay={100} className="mt-6 flex flex-wrap justify-center gap-2">
          {["Product", "SKU", "Brand", "Country", "Market", "Campaign", "Time"].map((dim) => (
            <span key={dim} className="glass-light rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ink/70">
              {dim}
            </span>
          ))}
        </Reveal>
      </DetailSection>

      <DetailCta
        title="Turn Every Product Interaction Into Intelligence."
        description="Connect your products, understand their interactions and make better decisions with Productix."
        primary={{ label: "Book an Assessment", href: "/book-a-demo" }}
        secondary={{ label: "Explore the Platform", href: "/platform" }}
      />

      <Footer />
    </div>
  );
}
