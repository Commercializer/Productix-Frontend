import {
  Armchair,
  BatteryCharging,
  Blocks,
  Car,
  Cpu,
  Droplet,
  FlaskConical,
  HardHat,
  HeartPulse,
  Package,
  Settings2,
  Shirt,
  ShoppingBag,
  Utensils,
  type LucideIcon,
} from "lucide-react";

export type IndustryGroup =
  | "Consumer Products"
  | "Industrial & Materials"
  | "Technology & Mobility"
  | "Healthcare";

export type Industry = {
  slug: string;
  name: string;
  group: IndustryGroup;
  description: string;
  icon: LucideIcon;
};

export const INDUSTRY_GROUPS: IndustryGroup[] = [
  "Consumer Products",
  "Industrial & Materials",
  "Technology & Mobility",
  "Healthcare",
];

export const INDUSTRIES: Industry[] = [
  {
    slug: "fmcg-cpg",
    name: "FMCG & CPG",
    group: "Consumer Products",
    description: "Connected identity and compliance data for fast-moving consumer goods at SKU scale.",
    icon: ShoppingBag,
  },
  {
    slug: "food-beverage",
    name: "Food & Beverage",
    group: "Consumer Products",
    description: "Ingredient transparency, sourcing data and consumer engagement for food and drink brands.",
    icon: Utensils,
  },
  {
    slug: "cosmetics",
    name: "Cosmetics & Personal Care",
    group: "Consumer Products",
    description: "Usage guidance, ingredient disclosure and digital experiences for beauty and personal care.",
    icon: Droplet,
  },
  {
    slug: "textiles-footwear",
    name: "Textiles & Footwear",
    group: "Consumer Products",
    description: "Material composition, care instructions and traceability across apparel and footwear.",
    icon: Shirt,
  },
  {
    slug: "toys",
    name: "Toys",
    group: "Consumer Products",
    description: "Safety, compliance and engaging product experiences for toys and children's products.",
    icon: Blocks,
  },
  {
    slug: "furniture",
    name: "Furniture",
    group: "Consumer Products",
    description: "Material and assembly data, plus digital experiences for furniture and home goods.",
    icon: Armchair,
  },
  {
    slug: "chemicals",
    name: "Chemicals",
    group: "Industrial & Materials",
    description: "Safety data, handling information and regulatory compliance for chemical products.",
    icon: FlaskConical,
  },
  {
    slug: "batteries",
    name: "Batteries",
    group: "Industrial & Materials",
    description: "Battery passport data, material composition and lifecycle compliance.",
    icon: BatteryCharging,
  },
  {
    slug: "construction",
    name: "Construction",
    group: "Industrial & Materials",
    description: "Product data and compliance documentation for construction materials and components.",
    icon: HardHat,
  },
  {
    slug: "machinery-industrial",
    name: "Machinery & Industrial Equipment",
    group: "Industrial & Materials",
    description: "Connected identity, documentation and service data for industrial equipment.",
    icon: Settings2,
  },
  {
    slug: "packaging",
    name: "Packaging",
    group: "Industrial & Materials",
    description: "Packaging composition, material and PPWR/EPR-ready compliance data.",
    icon: Package,
  },
  {
    slug: "electronics-ict",
    name: "Electronics & ICT",
    group: "Technology & Mobility",
    description: "Digital product passports, repairability and compliance data for electronics.",
    icon: Cpu,
  },
  {
    slug: "tyres-mobility",
    name: "Tyres & Mobility",
    group: "Technology & Mobility",
    description: "Connected identity and compliance data for tyres, vehicles and mobility products.",
    icon: Car,
  },
  {
    slug: "medical-healthcare",
    name: "Medical & Healthcare Products",
    group: "Healthcare",
    description: "Traceability, compliance and product information for medical and healthcare products.",
    icon: HeartPulse,
  },
];

export function getIndustry(slug: string) {
  return INDUSTRIES.find((i) => i.slug === slug);
}

export function industriesByGroup() {
  return INDUSTRY_GROUPS.map((group) => ({
    group,
    items: INDUSTRIES.filter((i) => i.group === group),
  }));
}
