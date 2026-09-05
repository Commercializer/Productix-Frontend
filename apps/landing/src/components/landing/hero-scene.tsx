"use client";

import {
  BarChart3,
  Megaphone,
  MessageSquareHeart,
  QrCode,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useRef } from "react";

import { AuroraCanvas } from "./aurora-canvas";
import { Reveal } from "./reveal";

const NODES = [
  { label: "Packaging", icon: QrCode, x: 48.7, y: 14, curve: "58,28" },
  { label: "Intelligence", icon: BarChart3, x: 82.8, y: 41.2, curve: "72,26" },
  { label: "Campaigns", icon: Megaphone, x: 70.1, y: 82.2, curve: "66,70" },
  { label: "Feedback", icon: MessageSquareHeart, x: 24, y: 73.4, curve: "30,66" },
  { label: "Compliance", icon: ShieldCheck, x: 17.3, y: 32.6, curve: "26,38" },
];

export function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const scene = sceneRef.current;
    if (!wrap || !scene) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let raf = 0;

    function handleMove(e: PointerEvent) {
      const rect = wrap!.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        scene!.style.transform = `translate3d(${(px * -14).toFixed(2)}px, ${(py * -14).toFixed(2)}px, 0)`;
      });
    }
    function handleLeave() {
      cancelAnimationFrame(raf);
      scene!.style.transform = "translate3d(0, 0, 0)";
    }

    wrap.addEventListener("pointermove", handleMove);
    wrap.addEventListener("pointerleave", handleLeave);
    return () => {
      wrap.removeEventListener("pointermove", handleMove);
      wrap.removeEventListener("pointerleave", handleLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative mx-auto aspect-square w-full max-w-[440px]"
    >
      <AuroraCanvas />

      <div
        ref={sceneRef}
        className="absolute inset-0 transition-transform duration-300 ease-out"
      >
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 h-full w-full overflow-visible"
        >
          <defs>
            <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.85" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
            <filter id="hero-line-glow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="1.1" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          <circle
            cx="50"
            cy="50"
            r="34"
            fill="none"
            stroke="var(--color-ink)"
            strokeOpacity="0.08"
            strokeWidth="0.4"
            strokeDasharray="1.2 2.4"
            vectorEffect="non-scaling-stroke"
          />

          {NODES.map((n) => (
            <path
              key={n.label}
              d={`M 50 50 Q ${n.curve} ${n.x} ${n.y}`}
              fill="none"
              stroke="url(#hero-line)"
              strokeWidth="1.5"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#hero-line-glow)"
              className="anim-flow"
            />
          ))}
        </svg>

        {/* Central hub: positioning, ambient motion, and content each live
            on their own nested element so no two transforms compete. */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2">
            <div className="anim-glow h-full w-full rounded-full bg-accent/30 blur-2xl" />
          </div>
          <div className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2">
            <div className="anim-pulse-ring h-full w-full rounded-full border border-accent/50" />
          </div>
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/60 bg-gradient-to-br from-white to-white/70 shadow-[0_12px_30px_-8px_rgba(10,17,32,0.35)] backdrop-blur-sm">
            <span className="text-[15px] font-semibold text-ink">Px</span>
          </div>
        </div>

        {NODES.map((n, i) => (
          <div
            key={n.label}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${n.x}%`, top: `${n.y}%` }}
          >
            <div className="anim-float" style={{ animationDelay: `${i * 0.4}s` }}>
              <Reveal delay={i * 90}>
                <div className="glass-light flex w-24 flex-col items-center gap-1.5 rounded-2xl px-3 py-3 text-center">
                  <n.icon className="h-4 w-4 text-accent" />
                  <span className="text-[10.5px] font-medium leading-tight text-ink/80">
                    {n.label}
                  </span>
                </div>
              </Reveal>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
