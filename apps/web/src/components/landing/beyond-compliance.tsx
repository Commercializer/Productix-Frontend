import { ArrowRight, Check, MessageSquareHeart, QrCode, Smartphone } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./reveal";
import { SectionGlow } from "./section-glow";

const COLUMNS = [
  {
    icon: Smartphone,
    name: "Product Experiences",
    title: "Give Every Product a Digital Home",
    description: "Create mobile-first digital product pages connected directly to the product or package.",
    items: [
      "Product information",
      "Instructions & documentation",
      "Certifications",
      "Sustainability information",
      "Product media",
      "Multi-language content",
    ],
  },
  {
    icon: QrCode,
    name: "Connected Packaging",
    title: "Make Packaging Interactive",
    description: "Turn existing packaging into a digital touchpoint using QR codes, GS1 Digital Link and other connected technologies.",
    items: [
      "Product discovery",
      "Usage & care",
      "Recipes & guides",
      "Promotions",
      "Brand storytelling",
      "Customer engagement",
    ],
  },
  {
    icon: MessageSquareHeart,
    name: "Engagement",
    title: "Create Meaningful Product Interactions",
    description: "Use the product as a channel to communicate with customers throughout its lifecycle.",
    items: [
      "Campaigns",
      "Feedback",
      "Reviews",
      "Loyalty",
      "Product registration",
      "Post-purchase engagement",
    ],
  },
];

export function BeyondCompliance() {
  return (
    <section id="experience" className="relative overflow-hidden bg-cream px-6 py-24 md:py-28">
      <SectionGlow />
      <div className="relative mx-auto max-w-6xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-accent-dim">
            Beyond Compliance
          </span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
            Turn Every Product Into an Experience.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-ink/60">
            A connected product can do more than provide compliance
            information. Productix transforms product identities into
            engaging digital experiences that inform customers, strengthen
            brands and create new opportunities across the product lifecycle.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <Reveal delay={0} className="h-full">
            <div className="relative h-full min-h-70 overflow-hidden rounded-3xl ring-1 ring-ink/10">
              <Image
                src="/images/beyond-compliance.jpg"
                alt="A hand holding a phone, scanning a QR code on a product package"
                fill
                sizes="(min-width: 1024px) 300px, (min-width: 640px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>
          {COLUMNS.map((col, i) => (
            <Reveal key={col.name} delay={(i + 1) * 90}>
              <div className="glass-light flex h-full flex-col rounded-3xl p-7">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-accent/10 text-brand-accent">
                  <col.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-[17px] font-medium text-ink">
                  {col.name}
                </h3>
                <p className="mt-1 text-[13px] font-medium text-ink/45">
                  {col.title}
                </p>
                <p className="mt-2 text-[14px] leading-relaxed text-ink/55">
                  {col.description}
                </p>
                <ul className="mt-5 flex flex-col gap-2">
                  {col.items.map((item) => (
                    <li key={item} className="flex items-center gap-2 text-[13.5px] text-ink/65">
                      <Check className="h-3.5 w-3.5 shrink-0 text-brand-accent" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={150} className="mt-14 flex flex-col items-center gap-5 text-center">
          <p className="text-[18px] font-medium text-ink">
            One product. One connected identity. Endless possibilities.
          </p>
          <Link
            href="/solutions/product-experience"
            className="group inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 px-6 text-[14px] font-medium text-ink/80 transition-colors hover:border-ink/30"
          >
            Explore Connected Product Experiences
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
