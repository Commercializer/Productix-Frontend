export function IndexHero({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <section className="bg-cream px-6 pb-16 pt-40 md:pt-48">
      <div className="mx-auto max-w-2xl text-center">
        <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-accent-dim">
          {eyebrow}
        </span>
        <h1 className="mt-3 text-[clamp(2rem,4.5vw,3.2rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
          {title}
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-[15.5px] leading-[1.7] text-ink/60">
          {description}
        </p>
      </div>
    </section>
  );
}
