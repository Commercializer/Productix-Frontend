const STANDARDS = [
  "Built on GS1 Standards",
  "GS1 Digital Link Ready",
  "DPP & PPWR Aligned",
  "Designed for the Sunrise 2027 Transition",
];

export function TrustMarquee() {
  return (
    <section className="border-b border-ink/10 bg-white py-8">
      <div className="mx-auto max-w-5xl px-6">
        <div className="flex flex-wrap items-center justify-center gap-3">
          {STANDARDS.map((label) => (
            <span key={label} className="badge-pill">
              {label}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
