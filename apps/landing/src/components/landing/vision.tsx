import { Reveal } from "./reveal";

const PILLARS = [
  "Connected packaging",
  "Product intelligence",
  "Consumer interaction infrastructure",
  "Packaging-led commerce",
  "Product engagement ecosystems",
];

export function Vision() {
  return (
    <section className="bg-navy px-6 py-24 md:py-28">
      <div className="mx-auto max-w-3xl text-center">
        <Reveal>
          <h2 className="text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-white">
            Building the digital layer of physical products.
          </h2>
          <p className="mx-auto mt-6 max-w-xl text-[15.5px] leading-[1.6] text-white/55">
            As physical products become increasingly interactive and
            data-driven, brands need scalable systems to manage engagement
            beyond the shelf.
          </p>
        </Reveal>

        <Reveal delay={120} className="mt-9 flex flex-wrap items-center justify-center gap-2.5">
          {PILLARS.map((p) => (
            <span
              key={p}
              className="rounded-full border border-white/15 px-4 py-2 text-[13px] font-medium text-white/75"
            >
              {p}
            </span>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
