import Image from "next/image";

import { DigitalLayersBeam } from "./digital-layers-beam";
import { Reveal } from "./reveal";
import { SectionGlow } from "./section-glow";

export function BecomingDigital() {
  return (
    <section className="relative bg-white px-6 py-24 md:py-28">
      <SectionGlow />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-0 h-[70%] overflow-hidden opacity-[0.15] [mask-image:linear-gradient(to_bottom,transparent,black_35%,black_85%,transparent)]"
        aria-hidden="true"
      >
        <Image src="/images/becoming-digital.jpg" alt="" fill sizes="100vw" className="object-cover" />
      </div>
      <DigitalLayersBeam
        heading={
          <Reveal className="relative z-10 mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
              Products Are Becoming Digital.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-[15.5px] leading-[1.7] text-ink/60">
              Products are no longer defined by physical packaging alone.
              Identity, compliance data, sustainability information and digital
              experiences are becoming part of the product itself.
            </p>
            <p className="mx-auto mt-3 max-w-2xl text-[15.5px] leading-[1.7] text-ink/60">
              Productix connects these layers through one digital
              infrastructure for your products and packaging.
            </p>
          </Reveal>
        }
      />
    </section>
  );
}
