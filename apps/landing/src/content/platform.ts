import { BarChart3, Radio, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";

export type PlatformPillar = {
  slug: string;
  index: string;
  name: string;
  title: string;
  description: string;
  keyTerms: string[];
  icon: LucideIcon;
};

export const PLATFORM_PILLARS: PlatformPillar[] = [
  {
    slug: "connect",
    index: "01",
    name: "Productix Connect",
    title: "Connect Every Product",
    description:
      "Establish a connected digital identity for every product and package using standards-led product identification and GS1 Digital Link.",
    keyTerms: ["GTIN", "GS1 Digital Link", "QR", "NFC", "Connected Packaging"],
    icon: Radio,
  },
  {
    slug: "compliance",
    index: "02",
    name: "Productix Compliance",
    title: "Make Products Compliance-Ready",
    description:
      "Structure the product and packaging data needed to support evolving regulatory and market requirements.",
    keyTerms: ["DPP", "PPWR", "EPR", "Sustainability Data"],
    icon: ShieldCheck,
  },
  {
    slug: "experience",
    index: "03",
    name: "Productix Experience",
    title: "Make Every Product Interactive",
    description:
      "Turn connected products into digital experiences that inform, engage and add value throughout the product journey.",
    keyTerms: ["Product Information", "Content", "Campaigns", "Consumer Engagement"],
    icon: Sparkles,
  },
  {
    slug: "intelligence",
    index: "04",
    name: "Productix Intelligence",
    title: "Turn Interactions Into Intelligence",
    description:
      "Transform product interactions into actionable insights across products, markets, channels and campaigns.",
    keyTerms: ["Analytics", "Feedback", "Engagement", "Insights"],
    icon: BarChart3,
  },
];

export function getPlatformPillar(slug: string) {
  return PLATFORM_PILLARS.find((p) => p.slug === slug);
}
