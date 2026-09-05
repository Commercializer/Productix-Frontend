"use client";

import { useEffect, useRef } from "react";

type Blob = {
  baseX: number;
  baseY: number;
  radius: number;
  color: string;
  speed: number;
  phase: number;
  orbit: number;
};

export function AuroraCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = 0;
    let height = 0;
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      const rect = canvas!.parentElement!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = width * dpr;
      canvas!.height = height * dpr;
      canvas!.style.width = `${width}px`;
      canvas!.style.height = `${height}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    window.addEventListener("resize", resize);

    const blobs: Blob[] = [
      { baseX: 0.68, baseY: 0.34, radius: 0.42, color: "47,143,234", speed: 0.00016, phase: 0, orbit: 0.06 },
      { baseX: 0.86, baseY: 0.6, radius: 0.34, color: "125,178,232", speed: 0.00021, phase: 2.1, orbit: 0.05 },
      { baseX: 0.55, baseY: 0.72, radius: 0.3, color: "163,201,244", speed: 0.00013, phase: 4.2, orbit: 0.07 },
      { baseX: 0.8, baseY: 0.18, radius: 0.26, color: "29,111,192", speed: 0.00025, phase: 1.2, orbit: 0.055 },
    ];

    function draw(t: number) {
      ctx!.clearRect(0, 0, width, height);
      for (const b of blobs) {
        const x = (b.baseX + Math.cos(t * b.speed + b.phase) * b.orbit) * width;
        const y = (b.baseY + Math.sin(t * b.speed * 1.3 + b.phase) * b.orbit) * height;
        const r = b.radius * Math.max(width, height);
        const gradient = ctx!.createRadialGradient(x, y, 0, x, y, r);
        gradient.addColorStop(0, `rgba(${b.color}, 0.7)`);
        gradient.addColorStop(1, `rgba(${b.color}, 0)`);
        ctx!.fillStyle = gradient;
        ctx!.beginPath();
        ctx!.arc(x, y, r, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    if (reduceMotion) {
      draw(0);
      return () => window.removeEventListener("resize", resize);
    }

    let raf = 0;
    let running = true;

    function loop(t: number) {
      if (!running) return;
      draw(t);
      raf = requestAnimationFrame(loop);
    }
    raf = requestAnimationFrame(loop);

    function handleVisibility() {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(loop);
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0"
      style={{ filter: "blur(42px)" }}
      aria-hidden="true"
    />
  );
}
