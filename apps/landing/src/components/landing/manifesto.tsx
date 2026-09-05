import { Reveal } from "./reveal";

export function Manifesto() {
  return (
    <section className="bg-cream px-6 py-24 md:py-28">
      <Reveal className="mx-auto flex max-w-4xl gap-6">
        <span className="mt-3 hidden h-px w-10 shrink-0 bg-ink/30 sm:block" />
        <p className="text-[clamp(1.4rem,2.6vw,2rem)] font-medium leading-[1.35] tracking-[-0.01em] text-ink">
          Connected product data opens new ways to strengthen operations,
          engage consumers, and build trust. Productix creates{" "}
          <span className="text-accent">
            one digital thread from packaging to purchase
          </span>{" "}
          and beyond.
        </p>
      </Reveal>
    </section>
  );
}
