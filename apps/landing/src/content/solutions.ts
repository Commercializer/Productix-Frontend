import {
  FileText,
  QrCode,
  Recycle,
  ScanLine,
  Smartphone,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type Solution = {
  slug: string;
  name: string;
  title: string;
  description: string;
  keyTerms: string[];
  icon: LucideIcon;
};

export const SOLUTIONS: Solution[] = [
  {
    slug: "gs1-digital-link",
    name: "GS1 Digital Link",
    title: "Connect Products to the Digital World",
    description:
      "Create standards-based digital identities that connect physical products and packaging to trusted online information.",
    keyTerms: ["GS1 Standards", "GTIN", "Digital Link", "2D Codes"],
    icon: ScanLine,
  },
  {
    slug: "digital-product-passport",
    name: "Digital Product Passport",
    title: "Prepare Products for Digital Compliance",
    description:
      "Structure, manage and present product data for Digital Product Passport requirements across applicable product categories and markets.",
    keyTerms: ["Product Data", "Sustainability", "Traceability", "Compliance"],
    icon: FileText,
  },
  {
    slug: "ppwr-epr",
    name: "PPWR & EPR",
    title: "Make Packaging Data Ready",
    description:
      "Organize packaging composition, material and related data to support evolving packaging compliance requirements and connected packaging initiatives.",
    keyTerms: ["Packaging Data", "Materials", "Components", "EPR", "Circularity"],
    icon: Recycle,
  },
  {
    slug: "connected-packaging",
    name: "Connected Packaging",
    title: "Make Packaging Interactive",
    description:
      "Turn existing packaging into a digital touchpoint using QR codes, GS1 Digital Link and other connected technologies.",
    keyTerms: ["Product Discovery", "Usage & Care", "Promotions", "Brand Storytelling"],
    icon: QrCode,
  },
  {
    slug: "product-experience",
    name: "Product Experience",
    title: "Give Every Product a Digital Home",
    description:
      "Create mobile-first digital product pages connected directly to the product or package.",
    keyTerms: ["Product Information", "Documentation", "Certifications", "Multi-language"],
    icon: Smartphone,
  },
  {
    slug: "product-intelligence",
    name: "Product Intelligence",
    title: "Turn Interactions Into Intelligence",
    description:
      "Transform product-level engagement data into actionable insights across products, markets, channels and campaigns.",
    keyTerms: ["Analytics", "Feedback", "Engagement", "Insights"],
    icon: TrendingUp,
  },
];

export function getSolution(slug: string) {
  return SOLUTIONS.find((s) => s.slug === slug);
}
