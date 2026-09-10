"use client";

import { BarChart3, Package, Radio, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";
import { useRef, type ReactNode, type RefObject } from "react";

import { AnimatedBeam } from "./magicui/animated-beam";

type Layer = { label: string; icon: LucideIcon; color: string };

const LAYERS: Layer[] = [
  { label: "Physical Product", icon: Package, color: "#0a1120" },
  { label: "Digital Identity", icon: Radio, color: "#00ccc6" },
  { label: "Compliance", icon: ShieldCheck, color: "#10d6e5" },
  { label: "Experience", icon: Sparkles, color: "#26b9cc" },
  { label: "Intelligence", icon: BarChart3, color: "#39a5db" },
];

const STEPS = LAYERS.length;

// Manual clamped linear interpolation, used instead of useTransform's
// array-range form. Motion's native WAAPI/ScrollTimeline acceleration for
// array-range transforms doesn't hold the final value for the rest of the
// scroll timeline - it decays back toward the first keyframe instead of
// clamping, so every scroll-linked value here is computed via a callback
// (which always takes the JS-driven update path) rather than an array range.
function interpolate(value: number, input: number[], output: number[]) {
  if (value <= input[0]!) return output[0]!;
  const last = input.length - 1;
  if (value >= input[last]!) return output[last]!;
  for (let i = 0; i < last; i++) {
    const a = input[i]!;
    const b = input[i + 1]!;
    if (value >= a && value <= b) {
      const t = b === a ? 1 : (value - a) / (b - a);
      return output[i]! + t * (output[i + 1]! - output[i]!);
    }
  }
  return output[last]!;
}

function LayerCard({
  layer,
  index,
  scrollYProgress,
  cardRef,
}: {
  layer: Layer;
  index: number;
  scrollYProgress: MotionValue<number>;
  cardRef: RefObject<HTMLDivElement | null>;
}) {
  const start = index / STEPS;
  const end = (index + 1) / STEPS;
  const rampStart = Math.max(0, start - 0.08);
  const rampEnd = Math.max(rampStart + 0.05, start);

  const opacity = useTransform(scrollYProgress, (v) => interpolate(v, [rampStart, rampEnd], [0.25, 1]));
  const y = useTransform(scrollYProgress, (v) => interpolate(v, [rampStart, rampEnd], [18, 0]));
  const scale = useTransform(scrollYProgress, (v) =>
    interpolate(v, [rampStart, rampEnd, end], [0.9, 1.08, 1]),
  );
  const focus = useTransform(scrollYProgress, (v) =>
    interpolate(v, [rampStart, rampEnd, end, end + 0.08], [0, 1, 1, 0.3]),
  );
  const boxShadow = useTransform(
    focus,
    (f) => `0 0 ${(26 * f).toFixed(0)}px ${layer.color}${Math.round(f * 55)
      .toString(16)
      .padStart(2, "0")}`,
  );

  return (
    <motion.div
      ref={cardRef}
      style={{ opacity, y, scale, boxShadow }}
      className="glass-light relative z-10 flex w-32 flex-col items-center gap-2 rounded-2xl px-3 py-4 text-center"
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
  );
}

function BeamSegment({
  index,
  fromRef,
  toRef,
  containerRef,
  scrollYProgress,
}: {
  index: number;
  fromRef: RefObject<HTMLDivElement | null>;
  toRef: RefObject<HTMLDivElement | null>;
  containerRef: RefObject<HTMLDivElement | null>;
  scrollYProgress: MotionValue<number>;
}) {
  const start = (index + 0.15) / STEPS;
  const end = (index + 0.6) / STEPS;
  const opacity = useTransform(scrollYProgress, (v) => interpolate(v, [start, end], [0, 1]));

  return (
    <motion.div style={{ opacity }}>
      <AnimatedBeam
        containerRef={containerRef}
        fromRef={fromRef}
        toRef={toRef}
        duration={3.5}
        delay={index * 0.3}
        gradientStartColor={LAYERS[index]!.color}
        gradientStopColor={LAYERS[index + 1]!.color}
      />
    </motion.div>
  );
}

export function DigitalLayersBeam({ heading }: { heading?: ReactNode }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const refs = [
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
    useRef<HTMLDivElement>(null),
  ];

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  return (
    <div ref={scrollRef} className="relative sm:h-[450vh]">
      <div className="sticky top-0 flex min-h-screen flex-col items-center justify-center gap-12 px-6 py-16">
        {heading}
        <div
          ref={containerRef}
          className="relative flex w-full max-w-4xl flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
        >
          {refs.slice(0, -1).map((ref, i) => (
            <BeamSegment
              key={LAYERS[i]!.label}
              index={i}
              fromRef={ref}
              toRef={refs[i + 1]!}
              containerRef={containerRef}
              scrollYProgress={scrollYProgress}
            />
          ))}

          {LAYERS.map((layer, i) => (
            <LayerCard
              key={layer.label}
              layer={layer}
              index={i}
              scrollYProgress={scrollYProgress}
              cardRef={refs[i]!}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
