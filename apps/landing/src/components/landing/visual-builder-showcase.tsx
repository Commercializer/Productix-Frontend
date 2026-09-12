import { Blocks, Copy, LayoutGrid, MousePointer2, Palette, type LucideIcon } from "lucide-react";
import Image from "next/image";

import { Reveal } from "./reveal";
import { SectionGlow } from "./section-glow";

const BUILDER_FEATURES: { icon: LucideIcon; title: string }[] = [
  { icon: MousePointer2, title: "Drag & Drop" },
  { icon: LayoutGrid, title: "Flexible Layouts" },
  { icon: Blocks, title: "Rich Content" },
  { icon: Palette, title: "Brand Control" },
  { icon: Copy, title: "Reusable Components" },
];

export function VisualBuilderShowcase() {
  return (
    <section id="builder" className="relative overflow-hidden bg-cream px-6 py-24 md:py-28">
      <SectionGlow flip />

      <Reveal className="relative mx-auto max-w-2xl text-center">
        <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
          Visual Experience Builder
        </span>
        <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
          Build Product Experiences Without Code.
        </h2>
        <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-[1.7] text-ink/60">
          Create rich, mobile-first product pages with a visual builder designed for marketing and product teams.
        </p>
      </Reveal>

      <Reveal delay={100} className="relative mx-auto mt-16 max-w-6xl">
        <div
          className="pointer-events-none absolute -inset-16 -z-10 rounded-[3rem] bg-linear-to-br from-accent/25 via-sky/15 to-transparent blur-3xl"
          aria-hidden="true"
        />
        <div className="overflow-hidden rounded-[20px] shadow-2xl ring-1 ring-ink/10">
          <Image
            src="/images/visual-builder.png"
            alt="The Productix visual builder canvas, showing drag-and-drop blocks used to build a branded product experience page"
            width={1470}
            height={796}
            sizes="(min-width: 1024px) 1150px, 100vw"
            className="h-auto w-full"
            priority
          />
        </div>
      </Reveal>

      <Reveal
        delay={200}
        className="relative mx-auto mt-16 flex max-w-6xl flex-wrap items-center justify-center gap-3"
      >
        {BUILDER_FEATURES.map((item) => (
          <div
            key={item.title}
            className="glass-light flex items-center gap-2 rounded-full px-4 py-2.5 text-ink"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
              <item.icon className="h-3.5 w-3.5" />
            </span>
            <h3 className="text-[14px] font-medium">{item.title}</h3>
          </div>
        ))}
      </Reveal>

      <Reveal delay={260} className="relative mt-10 text-center">
        <p className="text-[17px] font-medium leading-snug text-ink">
          If you can build a page, you can build a Productix experience.
        </p>
      </Reveal>
    </section>
  );
}
