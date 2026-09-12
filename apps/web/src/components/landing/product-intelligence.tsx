import { ArrowRight, BarChart3, MessageSquareHeart, Target, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "./reveal";
import { SectionGlow } from "./section-glow";

const ITEMS = [
  {
    icon: BarChart3,
    name: "Product Analytics",
    description: "Understand how products are discovered and accessed.",
  },
  {
    icon: Users,
    name: "Consumer Engagement",
    description: "See how customers interact with your products and content.",
  },
  {
    icon: MessageSquareHeart,
    name: "Feedback & Insights",
    description: "Capture customer feedback and identify meaningful patterns.",
  },
  {
    icon: Target,
    name: "Campaign Intelligence",
    description: "Measure the performance of product-connected campaigns and activations.",
  },
];

export function ProductIntelligence() {
  return (
    <section id="intelligence" className="relative overflow-hidden bg-white px-6 py-24 md:py-28">
      <SectionGlow flip />
      <div className="relative mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-accent-dim">
            Product Intelligence
          </span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
            Turn Product Interactions Into Intelligence.
          </h2>
          <p className="mx-auto mt-5 max-w-xl text-[15px] leading-[1.7] text-ink/60">
            Every scan, interaction and response creates a signal. Productix
            turns product-level engagement data into actionable insights
            across products, markets, channels and campaigns.
          </p>
        </Reveal>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          <Reveal className="h-full">
            <div className="relative h-full min-h-80 overflow-hidden rounded-3xl ring-1 ring-ink/10">
              <Image
                src="/images/Intelligence-image.png"
                alt="A laptop screen displaying a soft, glowing analytics dashboard with charts"
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <div className="grid grid-cols-1 gap-5">
            {ITEMS.map((item, i) => (
              <Reveal key={item.name} delay={i * 80}>
                <div className="glass-light flex items-start gap-4 rounded-2xl p-6">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-accent/10 text-brand-accent">
                    <item.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-[16px] font-medium text-ink">{item.name}</h3>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-ink/55">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={150} className="mt-14 flex flex-col items-center gap-5 text-center">
          <p className="text-[18px] font-medium text-ink">
            Know what happens after the product leaves the factory.
          </p>
          <Link
            href="/solutions/product-intelligence"
            className="group inline-flex h-11 items-center gap-2 rounded-full border border-ink/15 px-6 text-[14px] font-medium text-ink/80 transition-colors hover:border-ink/30"
          >
            Explore Product Intelligence
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
