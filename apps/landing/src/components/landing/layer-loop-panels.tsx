"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BarChart3, ChevronDown, Package, Radio, ShieldCheck, Sparkles, type LucideIcon } from "lucide-react";
import { useRef, type ReactNode } from "react";

gsap.registerPlugin(ScrollTrigger);

type Layer = { label: string; icon: LucideIcon; color: string };

const LAYERS: Layer[] = [
  { label: "Physical Product", icon: Package, color: "#0a1120" },
  { label: "Digital Identity", icon: Radio, color: "#00ccc6" },
  { label: "Compliance", icon: ShieldCheck, color: "#10d6e5" },
  { label: "Experience", icon: Sparkles, color: "#26b9cc" },
  { label: "Intelligence", icon: BarChart3, color: "#39a5db" },
];

// Layered pinning, adapted from GSAP's own demo
// (https://codepen.io/GreenSock/pen/VwbywPd): each full-viewport panel pins
// in place ("pinSpacing: false") as the next one scrolls up to cover it.
// This runs on the real page scroll and isn't looped - once "Intelligence"
// has covered the rest, scrolling continues straight into whatever section
// comes next on the page.
export function LayerLoopPanels({ heading }: { heading?: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const panelRefs = useRef<HTMLElement[]>([]);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();

      mm.add("(prefers-reduced-motion: no-preference)", () => {
        panelRefs.current.forEach((panel) => {
          ScrollTrigger.create({
            trigger: panel,
            start: "top top",
            pin: true,
            pinSpacing: false,
          });
        });

        // Snap the section's own scroll range to the nearest panel.
        ScrollTrigger.create({
          trigger: stackRef.current,
          start: "top top",
          end: "bottom bottom",
          snap: 1 / LAYERS.length,
        });
      });

      return () => mm.revert();
    },
    { scope: rootRef },
  );

  return (
    <div ref={rootRef} className="relative">
      {heading}

      {/* -mx-6 cancels the parent section's px-6 so panels reach the true
          viewport edges - full-bleed, matching the reference demo. */}
      <div ref={stackRef} className="relative -mx-6 mt-16">
        {LAYERS.map((layer, i) => (
          <section
            key={layer.label}
            ref={(el) => {
              if (el) panelRefs.current[i] = el;
            }}
            className="relative flex h-screen w-full flex-col items-center justify-center gap-6 overflow-hidden px-6 text-center"
            style={{
              background: `radial-gradient(120% 90% at 50% -10%, ${layer.color}40, transparent 60%), linear-gradient(180deg, #101c28 0%, #0a1120 100%)`,
            }}
          >
            <span
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 flex items-center justify-center text-[14rem] leading-none font-black select-none sm:text-[18rem]"
              style={{ color: layer.color, opacity: 0.12 }}
            >
              {String(i + 1).padStart(2, "0")}
            </span>

            <span
              className="relative z-10 flex h-20 w-20 items-center justify-center rounded-full"
              style={{ backgroundColor: `${layer.color}26`, boxShadow: `inset 0 0 0 1px ${layer.color}40` }}
            >
              <layer.icon className="h-9 w-9" style={{ color: layer.color }} />
            </span>
            <span className="relative z-10 text-[11px] font-semibold tracking-[0.2em] text-white/50 uppercase">
              Layer {i + 1} / {LAYERS.length}
            </span>
            <span className="relative z-10 text-[2rem] leading-[1.15] font-medium tracking-[-0.01em] text-white sm:text-[2.75rem]">
              {layer.label}
            </span>

            {i === 0 && (
              <span className="absolute bottom-10 z-10 flex flex-col items-center gap-1 text-[11px] font-medium tracking-[0.2em] text-white/40 uppercase">
                Scroll
                <ChevronDown className="h-4 w-4 animate-bounce" />
              </span>
            )}
          </section>
        ))}
      </div>
    </div>
  );
}
