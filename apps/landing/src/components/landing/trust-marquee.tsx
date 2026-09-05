const INDUSTRIES = [
  "FMCG brands",
  "Consumer goods manufacturers",
  "Beverage companies",
  "Cosmetics & personal care",
  "Nutrition & wellness",
  "Retail & distribution enterprises",
];

export function TrustMarquee() {
  const track = [...INDUSTRIES, ...INDUSTRIES];

  return (
    <section className="border-b border-ink/10 bg-white py-9">
      <div className="mx-auto max-w-7xl px-6">
        <p className="mb-6 text-center text-[13px] font-medium text-ink/45">
          Designed for global consumer brand ecosystems
        </p>
        <div className="relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
          <div className="marquee-track flex w-max items-center gap-12">
            {track.map((label, i) => (
              <span
                key={`${label}-${i}`}
                className="whitespace-nowrap text-[14px] font-semibold text-ink/35"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
