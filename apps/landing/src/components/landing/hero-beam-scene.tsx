"use client";

import { BarChart3, Box, Leaf, ScanLine, ShieldCheck, Users, type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { useRef, type RefObject } from "react";

import { AnimatedBeam } from "./magicui/animated-beam";

type Node = {
  label: string;
  description: [string, string];
  icon: LucideIcon;
  color: string;
  side: "left" | "right";
};

const LEFT_NODES: Node[] = [
  {
    label: "Identity",
    description: ["GS1 Digital Link", "Product Identity"],
    icon: ScanLine,
    color: "#39a5db",
    side: "left",
  },
  {
    label: "Compliance",
    description: ["DPP · PPWR · EPR", "Regulatory Ready"],
    icon: ShieldCheck,
    color: "#00ccc6",
    side: "left",
  },
  {
    label: "Intelligence",
    description: ["Analytics & Insights", "Consumer Feedback"],
    icon: BarChart3,
    color: "#10d6e5",
    side: "left",
  },
];

const RIGHT_NODES: Node[] = [
  {
    label: "Experience",
    description: ["Dynamic Product Pages", "Campaign Activation"],
    icon: Box,
    color: "#26b9cc",
    side: "right",
  },
  {
    label: "Consumers",
    description: ["Engage & Build Trust", "Meaningful Connections"],
    icon: Users,
    color: "#39a5db",
    side: "right",
  },
  {
    label: "A Sustainable Future",
    description: ["Transparency", "Circular Economy"],
    icon: Leaf,
    color: "#00ccc6",
    side: "right",
  },
];

function NodeTile({ node, tileRef }: { node: Node; tileRef: RefObject<HTMLDivElement | null> }) {
  const text = (
    <div className={node.side === "left" ? "text-right" : "text-left"}>
      <p className="text-[12.5px] font-semibold uppercase tracking-[0.04em] text-ink">
        {node.label}
      </p>
      <p className="mt-0.5 hidden text-[11px] leading-snug text-ink/45 sm:block">
        {node.description[0]}
        <br />
        {node.description[1]}
      </p>
    </div>
  );

  const tile = (
    <motion.div
      ref={tileRef}
      whileHover={{ y: -3 }}
      className="octagon flex h-14 w-14 shrink-0 items-center justify-center border border-white bg-white shadow-[0_10px_24px_-12px_rgba(10,17,32,0.25)] sm:h-16 sm:w-16"
    >
      <node.icon className="h-5 w-5 sm:h-6 sm:w-6" style={{ color: node.color }} />
    </motion.div>
  );

  return (
    <div
      className={`flex items-center justify-center gap-3 sm:gap-4 ${node.side === "left" ? "sm:justify-end" : "sm:justify-start"}`}
    >
      {node.side === "left" ? (
        <>
          {text}
          {tile}
        </>
      ) : (
        <>
          {tile}
          {text}
        </>
      )}
    </div>
  );
}

export function HeroBeamScene() {
  const containerRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const leftRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];
  const rightRefs = [useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null), useRef<HTMLDivElement>(null)];

  return (
    <div ref={containerRef} className="relative mx-auto w-full max-w-4xl py-6">
      <div className="dot-grid pointer-events-none absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />

      {LEFT_NODES.map((node, i) => (
        <AnimatedBeam
          key={node.label}
          containerRef={containerRef}
          fromRef={hubRef}
          toRef={leftRefs[i]!}
          reverse
          curvature={(1 - i) * 40}
          duration={5}
          delay={i * 0.3}
          gradientStartColor={node.color}
          gradientStopColor="#39a5db"
        />
      ))}
      {RIGHT_NODES.map((node, i) => (
        <AnimatedBeam
          key={node.label}
          containerRef={containerRef}
          fromRef={hubRef}
          toRef={rightRefs[i]!}
          curvature={(1 - i) * 40}
          duration={5}
          delay={0.15 + i * 0.3}
          gradientStartColor={node.color}
          gradientStopColor="#00ccc6"
        />
      ))}

      <div className="relative grid grid-cols-1 items-center gap-y-8 sm:grid-cols-[1fr_auto_1fr] sm:gap-x-6 md:gap-x-10">
        <div className="flex flex-col gap-8 sm:gap-10">
          {LEFT_NODES.map((node, i) => (
            <NodeTile key={node.label} node={node} tileRef={leftRefs[i]!} />
          ))}
        </div>

        <div className="order-first flex items-center justify-center sm:order-none">
          <div ref={hubRef} className="relative">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/20 blur-3xl"
            />
            <div
              className="octagon relative flex h-28 w-28 items-center justify-center p-[3px] sm:h-32 sm:w-32"
              style={{ background: "linear-gradient(135deg, #00ccc6, #10d6e5, #26b9cc, #39a5db)" }}
            >
              <div className="octagon flex h-full w-full flex-col items-center justify-center gap-0.5 bg-white">
                <span className="text-[22px] font-bold leading-none text-gradient-brand sm:text-[26px]">
                  Px
                </span>
                <span className="text-[8px] font-semibold uppercase tracking-[0.1em] text-ink/50 sm:text-[9px]">
                  productix
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-8 sm:gap-10">
          {RIGHT_NODES.map((node, i) => (
            <NodeTile key={node.label} node={node} tileRef={rightRefs[i]!} />
          ))}
        </div>
      </div>
    </div>
  );
}
