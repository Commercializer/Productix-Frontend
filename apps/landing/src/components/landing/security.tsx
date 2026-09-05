import { Activity, Cpu, Globe2, Lock, ShieldCheck } from "lucide-react";

import { Reveal } from "./reveal";

const PILLARS = [
  { icon: Cpu, label: "Scalable cloud infrastructure" },
  { icon: ShieldCheck, label: "Enterprise permission management" },
  { icon: Lock, label: "Secure data handling" },
  { icon: Globe2, label: "Global content scalability" },
  { icon: Activity, label: "High-volume engagement architecture" },
];

export function Security() {
  return (
    <section id="security" className="bg-white px-6 py-24 md:py-28">
      <div className="mx-auto max-w-5xl">
        <Reveal className="mx-auto max-w-2xl text-center">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-accent-dim">
            Security & scalability
          </span>
          <h2 className="mt-3 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.1] tracking-[-0.02em] text-ink">
            Enterprise-grade foundation.
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[15px] leading-[1.6] text-ink/55">
            Built for operational scalability, organizational control, and
            enterprise deployment readiness.
          </p>
        </Reveal>

        <div className="mt-12 grid grid-cols-2 gap-2.5 md:grid-cols-5">
          {PILLARS.map((p, i) => (
            <Reveal key={p.label} delay={i * 80}>
              <div className="flex h-full flex-col items-center gap-3 rounded-xl border border-ink/10 bg-paper px-4 py-6 text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ink text-white">
                  <p.icon className="h-4.5 w-4.5" />
                </div>
                <span className="text-[12.5px] font-medium leading-snug text-ink/75">
                  {p.label}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
