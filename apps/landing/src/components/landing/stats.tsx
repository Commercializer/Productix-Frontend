import { Reveal } from "./reveal";

const STATS = [
  { value: "10M+", label: "Scans orchestrated" },
  { value: "98%", label: "Avg. Lighthouse score" },
  { value: "<40ms", label: "p95 edge latency" },
  { value: "40+", label: "Languages supported" },
];

export function Stats() {
  return (
    <section className="border-y border-ink/10 bg-[#eef1f6] px-6 py-14">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-8 sm:grid-cols-4">
        {STATS.map((s, i) => (
          <Reveal
            key={s.label}
            delay={i * 70}
            className="border-l border-ink/10 pl-6 first:border-l-0 first:pl-0 sm:pl-8 sm:first:pl-0"
          >
            <div className="font-mono text-[clamp(2rem,4vw,2.9rem)] font-medium leading-none tracking-tight text-ink">
              {s.value}
            </div>
            <div className="mt-3 text-[13px] font-medium text-ink/50">
              {s.label}
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
