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

export type EnableItem = { label: string; description?: string };

export type IndustrySeo = {
  title: string;
  description: string;
  keywords: string[];
  ogTitle: string;
  ogDescription: string;
  ogImageAlt: string;
};

export type Industry = {
  slug: string;
  name: string;
  group: IndustryGroup;
  description: string;
  icon: LucideIcon;
  // Rich detail-page content. Optional: industries without a content brief yet
  // fall back to the generic StubPage.
  headline?: string;
  intro?: string;
  whyItMatters?: { heading: string; paragraphs: string[] };
  enables?: EnableItem[];
  closingStatement?: { heading: string; paragraph: string };
  relevantSolutions?: string[];
  ctaLabel?: string;
  seo?: IndustrySeo;
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
    headline: "Make Every Consumer Product Connected.",
    intro:
      "Productix connects FMCG and CPG products to trusted digital identity, product information, packaging data, consumer experiences and actionable intelligence.",
    whyItMatters: {
      heading: "The Opportunity",
      paragraphs: [
        "Consumer products increasingly need to communicate more than what fits on a physical package.",
        "Productix creates a digital layer behind the product, allowing brands to deliver richer information and experiences while keeping product data connected and manageable across markets.",
      ],
    },
    enables: [
      { label: "Digital Product Identity", description: "Connect products to trusted identifiers and digital destinations." },
      { label: "Packaging & Compliance Data", description: "Structure product and packaging information for evolving regulatory requirements." },
      { label: "Rich Product Experiences", description: "Turn product scans into branded digital experiences." },
      { label: "Multilingual Delivery", description: "Deliver relevant product information across markets and languages." },
      { label: "Product Intelligence", description: "Understand how, where and when consumers interact with products." },
    ],
    relevantSolutions: [
      "digital-product-passport",
      "ppwr-epr",
      "gs1-digital-link",
      "connected-packaging",
      "product-experience",
      "product-intelligence",
    ],
    ctaLabel: "Connect Your Products",
    seo: {
      title: "FMCG & CPG Connected Products & Digital Identity | Productix",
      description:
        "Connect FMCG and CPG products with digital identity, packaging data, DPP readiness, GS1 Digital Link, digital experiences and product intelligence.",
      keywords: [
        "FMCG connected products",
        "CPG digital product identity",
        "FMCG digital product passport",
        "connected packaging FMCG",
        "GS1 Digital Link FMCG",
        "FMCG product information",
        "CPG product experience",
        "FMCG product intelligence",
      ],
      ogTitle: "FMCG & CPG | Connected Product Infrastructure | Productix",
      ogDescription:
        "Connect consumer products with trusted digital identity, product data, compliance information, digital experiences and actionable intelligence.",
      ogImageAlt: "Productix connected product platform for FMCG and CPG brands",
    },
  },
  {
    slug: "food-beverage",
    name: "Food & Beverage",
    group: "Consumer Products",
    description: "Ingredient transparency, sourcing data and consumer engagement for food and drink brands.",
    icon: Utensils,
    headline: "Connect Every Product From Package to Experience.",
    intro:
      "Give food and beverage products a digital identity that connects product information, packaging data, consumer experiences and intelligence.",
    whyItMatters: {
      heading: "Why It Matters",
      paragraphs: [
        "Food and beverage brands manage extensive product information across ingredients, packaging, markets, languages and consumer touchpoints.",
        "Productix brings this information into a connected digital layer accessible directly from the product.",
      ],
    },
    enables: [
      { label: "Digital product and packaging identity" },
      { label: "Product and packaging information" },
      { label: "Multilingual consumer information" },
      { label: "Connected packaging experiences" },
      { label: "Product storytelling and education" },
      { label: "Campaigns and product activations" },
      { label: "Scan and engagement analytics" },
      { label: "Consumer feedback" },
    ],
    closingStatement: {
      heading: "Built for the Next Generation of Product Data",
      paragraph:
        "Productix helps brands prepare their product infrastructure for evolving requirements around GS1 Digital Link, Digital Product Passports and packaging-related regulations.",
    },
    ctaLabel: "Connect Your Food & Beverage Products",
    seo: {
      title: "Food & Beverage Digital Product & Connected Packaging | Productix",
      description:
        "Connect food and beverage products with digital identity, product and packaging information, GS1 Digital Link, digital experiences and intelligence.",
      keywords: [
        "food and beverage connected packaging",
        "food digital product passport",
        "food product digital identity",
        "beverage digital product identity",
        "GS1 Digital Link food",
        "food packaging digitalization",
        "connected packaging food",
        "food product information platform",
      ],
      ogTitle: "Food & Beverage | Connected Products & Packaging | Productix",
      ogDescription:
        "Give food and beverage products a connected digital layer for product information, packaging data, consumer experiences and intelligence.",
      ogImageAlt: "Productix connected packaging solution for food and beverage products",
    },
  },
  {
    slug: "cosmetics-personal-care",
    name: "Cosmetics & Personal Care",
    group: "Consumer Products",
    description: "Usage guidance, ingredient disclosure and digital experiences for beauty and personal care.",
    icon: Droplet,
    headline: "Turn Every Product Into a Connected Brand Experience.",
    intro:
      "Connect cosmetic and personal care products with trusted product information, ingredient transparency, digital experiences and consumer intelligence.",
    whyItMatters: {
      heading: "Why It Matters",
      paragraphs: [
        "Consumers increasingly expect transparency, accessible product information and meaningful digital experiences beyond the physical package.",
        "Productix gives brands a flexible digital layer behind every product.",
      ],
    },
    enables: [
      { label: "Product identity and digital product information" },
      { label: "Ingredient and product information delivery" },
      { label: "Packaging and sustainability information" },
      { label: "Multilingual experiences" },
      { label: "Product education and storytelling" },
      { label: "Consumer engagement" },
      { label: "Product feedback" },
      { label: "Scan analytics" },
    ],
    relevantSolutions: ["digital-product-passport", "gs1-digital-link", "connected-packaging", "product-experience", "product-intelligence"],
    ctaLabel: "Build Connected Product Experiences",
    seo: {
      title: "Cosmetics Digital Product Passport & Connected Packaging | Productix",
      description:
        "Connect cosmetics and personal care products with digital identity, ingredient information, packaging data, digital experiences and DPP readiness.",
      keywords: [
        "cosmetics digital product passport",
        "cosmetics connected packaging",
        "cosmetic product digital identity",
        "personal care digital product passport",
        "cosmetics product information",
        "cosmetic packaging data",
        "GS1 Digital Link cosmetics",
        "cosmetics digital experience",
      ],
      ogTitle: "Cosmetics & Personal Care | Connected Products | Productix",
      ogDescription:
        "Connect cosmetic and personal care products with trusted product information, packaging data, digital identity and engaging consumer experiences.",
      ogImageAlt: "Productix connected product and packaging solution for cosmetics",
    },
  },
  {
    slug: "textiles-footwear",
    name: "Textiles & Footwear",
    group: "Consumer Products",
    description: "Material composition, care instructions and traceability across apparel and footwear.",
    icon: Shirt,
    headline: "Give Every Product a Digital Identity.",
    intro:
      "Connect apparel, footwear and textile products with trusted product information, sustainability data, digital experiences and future-ready product infrastructure.",
    whyItMatters: {
      heading: "Why It Matters",
      paragraphs: [
        "Products increasingly need to communicate information beyond the physical label - from materials and product details to sustainability and lifecycle information.",
        "Productix provides the digital infrastructure to connect that information to the product.",
      ],
    },
    enables: [
      { label: "Digital Product Identity" },
      { label: "Product and material information" },
      { label: "Sustainability information" },
      { label: "Digital Product Passport readiness" },
      { label: "Multilingual product experiences" },
      { label: "Product storytelling" },
      { label: "Consumer engagement" },
      { label: "Product intelligence" },
    ],
    relevantSolutions: ["digital-product-passport", "gs1-digital-link", "connected-packaging", "product-experience", "product-intelligence"],
    ctaLabel: "Connect Your Product Portfolio",
    seo: {
      title: "Digital Product Passport for Textiles & Footwear | Productix",
      description:
        "Prepare textile and footwear products for Digital Product Passports with connected identity, product data, sustainability information and GS1 Digital Link.",
      keywords: [
        "digital product passport textiles",
        "textile digital product passport",
        "footwear digital product passport",
        "textile product traceability",
        "textile digital identity",
        "connected textile products",
        "textile sustainability data",
        "GS1 Digital Link textiles",
      ],
      ogTitle: "Textiles & Footwear | Digital Product Identity | Productix",
      ogDescription:
        "Connect textile and footwear products with digital identity, product information, sustainability data and future-ready digital product infrastructure.",
      ogImageAlt: "Productix Digital Product Passport infrastructure for textiles and footwear",
    },
  },
  {
    slug: "toys",
    name: "Toys",
    group: "Consumer Products",
    description: "Safety, compliance and engaging product experiences for toys and children's products.",
    icon: Blocks,
    headline: "Make Every Product More Informative, Connected and Engaging.",
    intro:
      "Productix connects toy products and packaging with trusted product information, digital experiences and consumer intelligence.",
    enables: [
      { label: "Digital product identity" },
      { label: "Product information and instructions" },
      { label: "Safety and supporting information" },
      { label: "Multilingual product experiences" },
      { label: "Interactive product storytelling" },
      { label: "Campaigns and activations" },
      { label: "Consumer feedback" },
      { label: "Product analytics" },
    ],
    closingStatement: {
      heading: "The Digital Layer Behind the Product",
      paragraph: "Connect the physical package to a digital experience that can evolve after the product reaches the market.",
    },
    relevantSolutions: ["gs1-digital-link", "connected-packaging", "product-experience", "product-intelligence"],
    ctaLabel: "Connect Your Products",
    seo: {
      title: "Connected Toys & Digital Product Information Platform | Productix",
      description:
        "Connect toy products and packaging with digital identity, product information, safety content, multilingual experiences and consumer intelligence.",
      keywords: [
        "connected toy products",
        "toy digital product identity",
        "toy product information",
        "connected packaging toys",
        "toy digital product passport",
        "toy product traceability",
        "GS1 Digital Link toys",
        "digital toy experience",
      ],
      ogTitle: "Toys | Connected Product Experiences | Productix",
      ogDescription: "Connect toy products and packaging to trusted information, engaging digital experiences and actionable product intelligence.",
      ogImageAlt: "Productix connected product solution for toy brands",
    },
  },
  {
    slug: "furniture",
    name: "Furniture",
    group: "Consumer Products",
    description: "Material and assembly data, plus digital experiences for furniture and home goods.",
    icon: Armchair,
    headline: "Connect Furniture to Its Digital Product Story.",
    intro:
      "Bring product information, materials, care guidance, sustainability data and digital experiences together through a connected product layer.",
    enables: [
      { label: "Digital product identity" },
      { label: "Product specifications" },
      { label: "Materials and component information" },
      { label: "Care and usage information" },
      { label: "Sustainability information" },
      { label: "Multilingual product experiences" },
      { label: "Customer feedback" },
      { label: "Product intelligence" },
    ],
    closingStatement: {
      heading: "Built for Products That Live Beyond the Sale",
      paragraph: "Productix gives brands a persistent digital touchpoint that can continue delivering value throughout the product lifecycle.",
    },
    ctaLabel: "Connect Your Products",
    seo: {
      title: "Furniture Digital Product Identity & Product Information | Productix",
      description:
        "Connect furniture products with digital identity, materials information, product specifications, sustainability data and lifecycle experiences.",
      keywords: [
        "furniture digital product identity",
        "furniture digital product passport",
        "furniture product information",
        "furniture sustainability data",
        "connected furniture products",
        "furniture product traceability",
        "furniture digital identity",
        "furniture product experience",
      ],
      ogTitle: "Furniture | Connected Product Infrastructure | Productix",
      ogDescription: "Bring furniture product information, materials, sustainability data and digital experiences together through a connected product layer.",
      ogImageAlt: "Productix digital product identity platform for furniture",
    },
  },
  {
    slug: "chemicals",
    name: "Chemicals",
    group: "Industrial & Materials",
    description: "Safety data, handling information and regulatory compliance for chemical products.",
    icon: FlaskConical,
    headline: "Connect Complex Product Information With Confidence.",
    intro: "Structure and connect chemical product information to trusted digital identities, compliance data and accessible digital experiences.",
    enables: [
      { label: "Digital product identity" },
      { label: "Structured product information" },
      { label: "Regulatory and compliance information" },
      { label: "Packaging data" },
      { label: "Multilingual information delivery" },
      { label: "Digital documentation access" },
      { label: "Product engagement" },
      { label: "Usage and interaction intelligence" },
    ],
    closingStatement: {
      heading: "Built for Data-Rich Products",
      paragraph: "Productix provides a digital layer for making complex product information structured, accessible and connected.",
    },
    relevantSolutions: ["digital-product-passport", "gs1-digital-link", "connected-packaging", "product-experience", "product-intelligence"],
    ctaLabel: "Connect Your Product Data",
    seo: {
      title: "Chemical Product Data & Digital Product Passport Platform | Productix",
      description:
        "Connect chemical products with structured product data, compliance information, digital identity, packaging data and accessible digital experiences.",
      keywords: [
        "chemical product data platform",
        "chemical digital product passport",
        "chemical product information",
        "chemical compliance data",
        "chemical product digital identity",
        "chemical packaging data",
        "connected chemical products",
        "GS1 Digital Link chemicals",
      ],
      ogTitle: "Chemicals | Connected Product & Compliance Data | Productix",
      ogDescription: "Structure and connect chemical product information with digital identity, compliance data, packaging information and digital experiences.",
      ogImageAlt: "Productix connected product data platform for chemical products",
    },
  },
  {
    slug: "batteries",
    name: "Batteries",
    group: "Industrial & Materials",
    description: "Battery passport data, material composition and lifecycle compliance.",
    icon: BatteryCharging,
    headline: "Build the Digital Foundation for Battery Products.",
    intro:
      "Connect battery products with structured product information, digital identity, lifecycle data and future-ready digital product infrastructure.",
    whyItMatters: {
      heading: "Why It Matters",
      paragraphs: [
        "Battery products are moving toward increasingly structured digital information requirements across their lifecycle.",
        "Productix provides the infrastructure to connect physical products with the digital information ecosystem around them.",
      ],
    },
    enables: [
      { label: "Digital product identity" },
      { label: "Structured product information" },
      { label: "Lifecycle information" },
      { label: "Compliance data" },
      { label: "Digital Passport readiness" },
      { label: "GS1 Digital Link connectivity" },
      { label: "Product experiences" },
      { label: "Product intelligence" },
    ],
    relevantSolutions: ["digital-product-passport", "gs1-digital-link", "connected-packaging", "product-intelligence"],
    ctaLabel: "Prepare Your Battery Products",
    seo: {
      title: "Digital Battery Passport & Connected Product Infrastructure | Productix",
      description:
        "Build the digital foundation for battery products with connected identity, structured product data, lifecycle information and Battery Passport readiness.",
      keywords: [
        "digital battery passport",
        "battery passport platform",
        "digital battery passport solution",
        "battery product identity",
        "battery product data",
        "battery traceability",
        "battery lifecycle data",
        "GS1 Digital Link batteries",
      ],
      ogTitle: "Batteries | Digital Battery Passport Infrastructure | Productix",
      ogDescription:
        "Connect battery products with digital identity, structured product data, lifecycle information and future-ready digital product infrastructure.",
      ogImageAlt: "Productix Digital Battery Passport and connected product infrastructure",
    },
  },
  {
    slug: "construction",
    name: "Construction",
    group: "Industrial & Materials",
    description: "Product data and compliance documentation for construction materials and components.",
    icon: HardHat,
    headline: "Connect Building Products to Trusted Digital Information.",
    intro:
      "Give construction products a digital identity that connects product information, documentation, compliance data and lifecycle information.",
    enables: [
      { label: "Digital product identity" },
      { label: "Product specifications" },
      { label: "Technical information" },
      { label: "Compliance documentation" },
      { label: "Material information" },
      { label: "Multilingual information" },
      { label: "Digital product experiences" },
      { label: "Product intelligence" },
    ],
    closingStatement: {
      heading: "One Digital Layer. Multiple Product Touchpoints.",
      paragraph: "Connect physical construction products to information that can be accessed, updated and delivered digitally throughout their lifecycle.",
    },
    ctaLabel: "Connect Your Products",
    seo: {
      title: "Construction Product Digital Identity & Product Data | Productix",
      description:
        "Connect construction products with digital identity, technical information, compliance data, documentation and lifecycle product information.",
      keywords: [
        "construction product digital identity",
        "construction product passport",
        "construction product information",
        "construction product digital passport",
        "construction product data",
        "construction material information",
        "construction product traceability",
        "digital product identity construction",
      ],
      ogTitle: "Construction | Connected Product Information | Productix",
      ogDescription: "Connect construction products with trusted product information, technical documentation, compliance data and digital experiences.",
      ogImageAlt: "Productix digital product information infrastructure for construction",
    },
  },
  {
    slug: "machinery-industrial-equipment",
    name: "Machinery & Industrial Equipment",
    group: "Industrial & Materials",
    description: "Connected identity, documentation and service data for industrial equipment.",
    icon: Settings2,
    headline: "Give Industrial Products a Digital Identity.",
    intro: "Connect machinery and industrial equipment with structured product data, documentation, digital experiences and lifecycle intelligence.",
    enables: [
      { label: "Digital product identity" },
      { label: "Technical product information" },
      { label: "Manuals and documentation" },
      { label: "Maintenance information" },
      { label: "Compliance data" },
      { label: "Multilingual product information" },
      { label: "Product support experiences" },
      { label: "Product interaction analytics" },
    ],
    closingStatement: {
      heading: "Built for Complex Product Ecosystems",
      paragraph: "Productix creates a digital layer that connects the physical product with the information required by customers, partners and service teams.",
    },
    ctaLabel: "Connect Your Equipment",
    seo: {
      title: "Industrial Equipment Digital Product Identity & Data | Productix",
      description:
        "Connect machinery and industrial equipment with digital identity, technical data, documentation, compliance information and lifecycle intelligence.",
      keywords: [
        "industrial product digital identity",
        "industrial equipment digital passport",
        "machinery product information",
        "industrial product data",
        "machinery digital identity",
        "industrial equipment traceability",
        "connected industrial products",
        "digital product passport machinery",
      ],
      ogTitle: "Machinery & Industrial Equipment | Productix",
      ogDescription: "Connect industrial products with structured product data, technical documentation, compliance information and lifecycle intelligence.",
      ogImageAlt: "Productix connected product infrastructure for industrial equipment",
    },
  },
  {
    slug: "packaging",
    name: "Packaging",
    group: "Industrial & Materials",
    description: "Packaging composition, material and PPWR/EPR-ready compliance data.",
    icon: Package,
    headline: "Turn Packaging Into a Connected Digital Touchpoint.",
    intro: "Connect packaging with product identity, packaging data, compliance information, consumer experiences and actionable intelligence.",
    whyItMatters: {
      heading: "Why Packaging Matters",
      paragraphs: [
        "Packaging is one of the most powerful physical touchpoints between a product and its digital ecosystem.",
        "Productix transforms that touchpoint into a connected digital gateway.",
      ],
    },
    enables: [
      { label: "Connected packaging" },
      { label: "GS1 Digital Link" },
      { label: "Packaging information" },
      { label: "Material and component data" },
      { label: "Compliance information" },
      { label: "Digital Product Passport connectivity" },
      { label: "Consumer experiences" },
      { label: "Scan analytics and feedback" },
    ],
    closingStatement: {
      heading: "From Physical Packaging to Digital Infrastructure",
      paragraph: "Connect the package once and continuously evolve the digital experience behind it.",
    },
    relevantSolutions: ["ppwr-epr", "gs1-digital-link", "digital-product-passport", "connected-packaging", "product-experience", "product-intelligence"],
    ctaLabel: "Connect Your Packaging",
    seo: {
      title: "Connected Packaging & Digital Product Identity Platform | Productix",
      description:
        "Transform packaging into a connected digital touchpoint with GS1 Digital Link, packaging data, compliance information, DPP connectivity and analytics.",
      keywords: [
        "connected packaging",
        "connected packaging platform",
        "smart packaging digital identity",
        "digital packaging solution",
        "packaging digital product passport",
        "GS1 Digital Link packaging",
        "packaging compliance data",
        "packaging QR code platform",
        "digital packaging experience",
      ],
      ogTitle: "Packaging | Connected Packaging Infrastructure | Productix",
      ogDescription: "Connect packaging with product identity, packaging data, compliance information, digital experiences and actionable intelligence.",
      ogImageAlt: "Productix connected packaging and digital product identity platform",
    },
  },
  {
    slug: "electronics-ict",
    name: "Electronics & ICT",
    group: "Technology & Mobility",
    description: "Digital product passports, repairability and compliance data for electronics.",
    icon: Cpu,
    headline: "Connect Every Device to Its Digital Product Identity.",
    intro:
      "Create a connected digital layer for electronics and ICT products containing product information, compliance data, support resources and engaging digital experiences.",
    enables: [
      { label: "Digital product identity" },
      { label: "Product specifications" },
      { label: "Compliance and sustainability information" },
      { label: "Product documentation" },
      { label: "Warranty and support information" },
      { label: "Multilingual product experiences" },
      { label: "Product engagement" },
      { label: "Product intelligence" },
    ],
    closingStatement: {
      heading: "Built for Connected Product Ecosystems",
      paragraph:
        "Productix helps electronics brands connect physical products with the digital information consumers and businesses need throughout the product lifecycle.",
    },
    relevantSolutions: ["digital-product-passport", "gs1-digital-link", "connected-packaging", "product-experience", "product-intelligence"],
    ctaLabel: "Connect Your Products",
    seo: {
      title: "Electronics Digital Product Passport & Product Identity | Productix",
      description:
        "Connect electronics and ICT products with digital identity, product specifications, compliance information, documentation and digital experiences.",
      keywords: [
        "electronics digital product passport",
        "electronics digital product identity",
        "electronics product passport",
        "ICT product digital identity",
        "electronics product information",
        "electronics traceability",
        "connected electronics products",
        "GS1 Digital Link electronics",
      ],
      ogTitle: "Electronics & ICT | Connected Product Infrastructure | Productix",
      ogDescription: "Create a connected digital layer for electronics and ICT products containing product information, compliance data, support resources and experiences.",
      ogImageAlt: "Productix digital product identity platform for electronics and ICT",
    },
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
