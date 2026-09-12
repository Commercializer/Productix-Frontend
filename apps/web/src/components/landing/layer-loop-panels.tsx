"use client";

import { BarChart3, Package, Radio, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import Image from "next/image";
import { useRef, useState, type ReactNode } from "react";

type Layer = { label: string; description: string; icon: LucideIcon; color: string; image: string };

const LAYERS: Layer[] = [
  {
    label: "Physical Product",
    description:
      "The tangible product and packaging your customer holds - the starting point for every connected experience.",
    icon: Package,
    color: "#192a3a",
    image: "/images/1.png",
  },
  {
    label: "Digital Identity",
    description:
      "A unique digital identity for every product, ready to scan, verify and explore via GS1 Digital Link.",
    icon: Radio,
    color: "#00ccc6",
    image: "/images/2.png",
  },
  {
    label: "Compliance",
    description:
      "Structured, verified compliance data for DPP, PPWR and EU regulation, connected directly to the product.",
    icon: ShieldCheck,
    color: "#10d6e5",
    image: "/images/3.png",
  },
  {
    label: "Experience",
    description:
      "Branded content and storytelling delivered the moment a product is scanned, explored and remembered.",
    icon: Sparkles,
    color: "#26b9cc",
    image: "/images/4.png",
  },
  {
    label: "Intelligence",
    description:
      "Real-time analytics on scans, engagement and sustainability impact across every market.",
    icon: BarChart3,
    color: "#39a5db",
    image: "/images/5.png",
  },
];

// Each layer gets 65vh of scroll distance to itself while the row below
// stays pinned in view - the sidebar, image and copy swap as the active
// layer changes, instead of stacking all five in the normal document flow.
const STEP_VH = 65;

export function LayerLoopPanels({ heading }: { heading?: ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const idx = Math.min(LAYERS.length - 1, Math.max(0, Math.floor(latest * LAYERS.length)));
    setActive(idx);
  });

  const layer = LAYERS[active];

  return (
    <div className="relative z-10 mx-auto max-w-5xl">
      <div ref={sectionRef} className="relative" style={{ height: `${LAYERS.length * STEP_VH}vh` }}>
        <div className="sticky top-20">
          {heading}

          <div className="mt-6 grid grid-cols-1 gap-4 md:mt-8 md:grid-cols-[220px_1fr_320px] md:gap-6">
            <div className="hidden flex-col rounded-[20px] bg-[#0c1220] p-6 md:flex">
              <h3 className="text-[1.15rem] leading-tight font-semibold text-white">How Productix Works</h3>
              <ul className="mt-5 flex flex-col gap-2.5">
                {LAYERS.map((l, i) => (
                  <li
                    key={l.label}
                    className={`flex items-center gap-2.5 text-[14.5px] transition-colors duration-300 ${
                      i === active ? "font-medium text-white" : "text-white/40"
                    }`}
                  >
                    <span
                      className={`relative inline-flex h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                        i === active ? "pulse-ring bg-teal text-teal" : "bg-white/20"
                      }`}
                      aria-hidden="true"
                    />
                    {l.label}
                  </li>
                ))}
              </ul>
            </div>

            <div
              className="relative aspect-4/3 overflow-hidden rounded-[20px] transition-shadow duration-500 md:aspect-auto md:h-90"
              style={{ boxShadow: `inset 0 0 0 1px ${layer.color}40` }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={layer.image}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeInOut" }}
                  className="absolute inset-0"
                >
                  <Image
                    src={layer.image}
                    alt={layer.label}
                    fill
                    sizes="(min-width: 768px) 560px, 100vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="relative flex flex-col justify-center overflow-hidden rounded-[20px] bg-tint p-6 md:h-90">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 h-40 w-40 rounded-full blur-3xl transition-colors duration-500"
                style={{ backgroundColor: `${layer.color}33` }}
              />
              <AnimatePresence mode="wait">
                <motion.div
                  key={layer.label}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="relative"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-2xl"
                    style={{ backgroundColor: `${layer.color}1a`, color: layer.color }}
                  >
                    <layer.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-[1.6rem] leading-[1.2] font-medium tracking-[-0.01em] text-ink">
                    {layer.label}
                  </h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-ink/60">{layer.description}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
