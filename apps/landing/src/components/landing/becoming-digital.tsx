import { DigitalLayersBeam } from "./digital-layers-beam";
import { Reveal } from "./reveal";

export function BecomingDigital() {
  return (
    <section className="bg-white px-6 py-24 md:py-28">
      <div className="mx-auto max-w-4xl">
        <Reveal className="text-center">
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

        <div className="mt-16">
          <DigitalLayersBeam />
        </div>
      </div>
    </section>
  );
}
