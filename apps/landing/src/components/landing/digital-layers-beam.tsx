"use client";

import { BarChart3, Package, Radio, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRef } from "react";

import { AnimatedBeam } from "./magicui/animated-beam";

type Layer = { label: string; icon: LucideIcon; color: string };

const LAYERS: Layer[] = [
  { label: "Physical Product", icon: Package, color: "#0a1120" },
  { label: "Digital Identity", icon: Radio, color: "#00ccc6" },
  { label: "Compliance", icon: ShieldCheck, color: "#10d6e5" },
  { label: "Experience", icon: Sparkles, color: "#26b9cc" },
  { label: "Intelligence", icon: BarChart3, color: "#39a5db" },
];

export function DigitalLayersBeam() {
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  return (
    <div
      ref={containerRef}
      className="relative flex flex-col items-center gap-8 py-6 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
    >
      {refs.slice(0, -1).map((ref, i) => (
        <AnimatedBeam
          key={LAYERS[i]!.label}
          containerRef={containerRef}
          fromRef={ref}
          toRef={refs[i + 1]!}
          duration={3.5}
          delay={i * 0.3}
          gradientStartColor={LAYERS[i]!.color}
          gradientStopColor={LAYERS[i + 1]!.color}
        />
      ))}

      {LAYERS.map((layer, i) => (
        <motion.div
          key={layer.label}
          ref={refs[i]}
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: i * 0.08 }}
          className="relative z-10 flex w-32 flex-col items-center gap-2 rounded-2xl border border-ink/10 bg-white px-3 py-4 text-center shadow-[0_12px_28px_-16px_rgba(10,17,32,0.25)]"
        >
          <span
            className="flex h-9 w-9 items-center justify-center rounded-full"
            style={{ backgroundColor: `${layer.color}1a` }}
          >
            <layer.icon className="h-4 w-4" style={{ color: layer.color }} />
          </span>
          <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-ink/70">
            {layer.label}
          </span>
        </motion.div>
      ))}
    </div>
  );
}
