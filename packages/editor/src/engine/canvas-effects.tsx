/* ─────────────────────────────────────────────
 * Canvas Effects - Particle overlay animations
 *
 * Pure CSS + React canvas effects that render as
 * absolutely-positioned overlays inside artboards.
 * Supports: snowfall, confetti, halloween, avurudu,
 * wesak, fireworks, hearts, sparkle.
 * ──────────────────────────────────────────── */

"use client";

import React, { useEffect, useRef, useCallback, useMemo } from "react";
import type { CanvasEffect } from "@productix/types";

/* ─── Types ──────────────────────────────────── */

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
  rotation: number;
  rotationSpeed: number;
  color: string;
  char?: string;
  life: number;
  maxLife: number;
  /** For fireworks: phase 0 = rising, 1 = exploding */
  phase?: number;
}

interface EffectConfig {
  particleCount: number;
  spawn: (width: number, height: number) => Particle;
  update: (p: Particle, width: number, height: number, dt: number) => boolean; // return false = remove
  render: (ctx: CanvasRenderingContext2D, p: Particle) => void;
}

/* ─── Color Palettes ─────────────────────────── */

const CONFETTI_COLORS = ["#ff6b6b", "#feca57", "#48dbfb", "#ff9ff3", "#54a0ff", "#5f27cd", "#01a3a4", "#f368e0", "#ff9f43", "#00d2d3"];
const HALLOWEEN_COLORS = ["#ff6600", "#8b00ff", "#2d1b69", "#ff3300", "#00ff00", "#ffd700"];
const AVURUDU_COLORS = ["#ff6b35", "#ffd700", "#e63946", "#fb8500", "#ff006e", "#ffb703", "#8338ec"];
const WESAK_COLORS = ["#ffd700", "#ff6347", "#4169e1", "#32cd32", "#ff69b4", "#ff8c00", "#9370db"];
const HEART_COLORS = ["#ff4757", "#ff6b81", "#ff7f8a", "#e84393", "#fd79a8", "#fab1a0"];
const SPARKLE_COLORS = ["#ffd700", "#fff9c4", "#fffde7", "#ffecb3", "#fff8e1", "#f5f5dc"];

/* ─── Effect Configurations ──────────────────── */

function createSnowConfig(): EffectConfig {
  return {
    particleCount: 60,
    spawn: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * -h * 0.3,
      vx: (Math.random() - 0.5) * 0.5,
      vy: 0.3 + Math.random() * 0.8,
      size: 2 + Math.random() * 4,
      opacity: 0.4 + Math.random() * 0.6,
      rotation: 0,
      rotationSpeed: 0,
      color: "#fff",
      life: 0,
      maxLife: Infinity,
    }),
    update: (p, w, h) => {
      p.x += p.vx + Math.sin(p.y * 0.01) * 0.3;
      p.y += p.vy;
      if (p.y > h + 10) { p.y = -10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      return true;
    },
    render: (ctx, p) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${p.opacity})`;
      ctx.fill();
      // Small glow
      ctx.shadowColor = "rgba(255,255,255,0.5)";
      ctx.shadowBlur = p.size * 2;
      ctx.fill();
      ctx.shadowBlur = 0;
    },
  };
}

function createConfettiConfig(): EffectConfig {
  return {
    particleCount: 80,
    spawn: (w, h) => ({
      x: Math.random() * w,
      y: -10 - Math.random() * h * 0.5,
      vx: (Math.random() - 0.5) * 2,
      vy: 1 + Math.random() * 2,
      size: 4 + Math.random() * 6,
      opacity: 0.8 + Math.random() * 0.2,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 8,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
      life: 0,
      maxLife: Infinity,
    }),
    update: (p, w, h) => {
      p.x += p.vx + Math.sin(p.y * 0.02) * 0.5;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.vx *= 0.999;
      if (p.y > h + 20) { p.y = -20; p.x = Math.random() * w; }
      return true;
    },
    render: (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.opacity;
      // Draw a confetti rectangle
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      ctx.restore();
    },
  };
}

function createHalloweenConfig(): EffectConfig {
  const chars = ["🦇", "🎃", "👻", "🕷️", "💀", "🕸️"];
  return {
    particleCount: 30,
    spawn: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * -h * 0.3,
      vx: (Math.random() - 0.5) * 1.5,
      vy: 0.3 + Math.random() * 0.6,
      size: 14 + Math.random() * 10,
      opacity: 0.6 + Math.random() * 0.4,
      rotation: 0,
      rotationSpeed: (Math.random() - 0.5) * 2,
      color: HALLOWEEN_COLORS[Math.floor(Math.random() * HALLOWEEN_COLORS.length)]!,
      char: chars[Math.floor(Math.random() * chars.length)]!,
      life: 0,
      maxLife: Infinity,
    }),
    update: (p, w, h) => {
      p.x += p.vx + Math.sin(p.y * 0.015) * 1;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      if (p.y > h + 30) { p.y = -30; p.x = Math.random() * w; }
      if (p.x < -30) p.x = w + 30;
      if (p.x > w + 30) p.x = -30;
      return true;
    },
    render: (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.char || "🎃", 0, 0);
      ctx.restore();
    },
  };
}

function createAvuruduConfig(): EffectConfig {
  const chars = ["🪷", "🌸", "🎋", "🏮", "🌺", "✨", "🎊", "🪔"];
  return {
    particleCount: 40,
    spawn: (w, h) => {
      const isEmoji = Math.random() > 0.4;
      return {
        x: Math.random() * w,
        y: Math.random() * -h * 0.3,
        vx: (Math.random() - 0.5) * 1,
        vy: 0.2 + Math.random() * 0.5,
        size: isEmoji ? 14 + Math.random() * 8 : 3 + Math.random() * 4,
        opacity: 0.5 + Math.random() * 0.5,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 3,
        color: AVURUDU_COLORS[Math.floor(Math.random() * AVURUDU_COLORS.length)]!,
        char: isEmoji ? chars[Math.floor(Math.random() * chars.length)]! : undefined,
        life: 0,
        maxLife: Infinity,
      };
    },
    update: (p, w, h) => {
      p.x += p.vx + Math.sin(p.y * 0.01 + p.x * 0.005) * 0.5;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      if (p.y > h + 30) { p.y = -30; p.x = Math.random() * w; }
      return true;
    },
    render: (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      if (p.char) {
        ctx.font = `${p.size}px serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(p.char, 0, 0);
      } else {
        // Petal-like particle
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.ellipse(0, 0, p.size, p.size * 0.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    },
  };
}

function createWesakConfig(): EffectConfig {
  const chars = ["🪷", "🏮", "🕯️", "✨", "🌟", "🪔", "⭐"];
  return {
    particleCount: 35,
    spawn: (w, h) => {
      const isLantern = Math.random() > 0.5;
      return {
        x: Math.random() * w,
        y: isLantern ? h + 10 + Math.random() * h * 0.3 : Math.random() * -h * 0.3,
        vx: (Math.random() - 0.5) * 0.5,
        vy: isLantern ? -(0.2 + Math.random() * 0.4) : 0.15 + Math.random() * 0.3,
        size: 14 + Math.random() * 10,
        opacity: 0.5 + Math.random() * 0.5,
        rotation: 0,
        rotationSpeed: (Math.random() - 0.5) * 1,
        color: WESAK_COLORS[Math.floor(Math.random() * WESAK_COLORS.length)]!,
        char: chars[Math.floor(Math.random() * chars.length)]!,
        life: 0,
        maxLife: Infinity,
      };
    },
    update: (p, w, h) => {
      p.x += p.vx + Math.sin(p.y * 0.008) * 0.3;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      // Gentle opacity pulse
      p.opacity = 0.4 + Math.abs(Math.sin(p.life * 0.02)) * 0.6;
      p.life++;
      if (p.vy < 0 && p.y < -30) { p.y = h + 30; p.x = Math.random() * w; }
      if (p.vy > 0 && p.y > h + 30) { p.y = -30; p.x = Math.random() * w; }
      return true;
    },
    render: (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      // Glow effect
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 12;
      ctx.fillText(p.char || "🪷", 0, 0);
      ctx.shadowBlur = 0;
      ctx.restore();
    },
  };
}

function createFireworksConfig(): EffectConfig {
  return {
    particleCount: 50,
    spawn: (w, h) => {
      const isRocket = Math.random() > 0.7;
      if (isRocket) {
        return {
          x: Math.random() * w,
          y: h,
          vx: (Math.random() - 0.5) * 1,
          vy: -(3 + Math.random() * 3),
          size: 3,
          opacity: 1,
          rotation: 0,
          rotationSpeed: 0,
          color: "#ffd700",
          life: 0,
          maxLife: 60 + Math.random() * 40,
          phase: 0,
        };
      }
      // Explosion spark
      const cx = Math.random() * w;
      const cy = h * 0.2 + Math.random() * h * 0.4;
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 3;
      return {
        x: cx,
        y: cy,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 2 + Math.random() * 3,
        opacity: 1,
        rotation: 0,
        rotationSpeed: 0,
        color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!,
        life: 0,
        maxLife: 40 + Math.random() * 30,
        phase: 1,
      };
    },
    update: (p, w, h) => {
      p.life++;
      if (p.phase === 0) {
        // Rising rocket
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.02; // gravity
        if (p.life >= p.maxLife || p.vy >= 0) {
          // Explode: become a spark
          p.phase = 1;
          p.life = 0;
          p.maxLife = 40 + Math.random() * 30;
          const angle = Math.random() * Math.PI * 2;
          const speed = 1 + Math.random() * 3;
          p.vx = Math.cos(angle) * speed;
          p.vy = Math.sin(angle) * speed;
          p.color = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)]!;
          p.size = 2 + Math.random() * 3;
        }
      } else {
        // Exploding spark
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.04; // gravity
        p.vx *= 0.98;
        p.opacity = Math.max(0, 1 - p.life / p.maxLife);
        if (p.life >= p.maxLife) {
          // Reset as rocket
          p.phase = 0;
          p.x = Math.random() * w;
          p.y = h;
          p.vx = (Math.random() - 0.5) * 1;
          p.vy = -(3 + Math.random() * 3);
          p.life = 0;
          p.maxLife = 60 + Math.random() * 40;
          p.opacity = 1;
          p.color = "#ffd700";
          p.size = 3;
        }
      }
      return true;
    },
    render: (ctx, p) => {
      ctx.save();
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = p.phase === 0 ? 6 : 8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    },
  };
}

function createHeartsConfig(): EffectConfig {
  return {
    particleCount: 25,
    spawn: (w, h) => ({
      x: Math.random() * w,
      y: h + 10 + Math.random() * h * 0.3,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(0.5 + Math.random() * 1),
      size: 12 + Math.random() * 12,
      opacity: 0.5 + Math.random() * 0.5,
      rotation: (Math.random() - 0.5) * 20,
      rotationSpeed: (Math.random() - 0.5) * 1,
      color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)]!,
      char: "❤️",
      life: 0,
      maxLife: Infinity,
    }),
    update: (p, w, h) => {
      p.x += p.vx + Math.sin(p.y * 0.01) * 0.5;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      // Pulse
      p.opacity = 0.3 + Math.abs(Math.sin(p.life * 0.03)) * 0.7;
      p.life++;
      if (p.y < -30) { p.y = h + 30; p.x = Math.random() * w; }
      return true;
    },
    render: (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.font = `${p.size}px serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(p.char || "❤️", 0, 0);
      ctx.restore();
    },
  };
}

function createSparkleConfig(): EffectConfig {
  return {
    particleCount: 40,
    spawn: (w, h) => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: 0,
      vy: 0,
      size: 2 + Math.random() * 4,
      opacity: 0,
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 4,
      color: SPARKLE_COLORS[Math.floor(Math.random() * SPARKLE_COLORS.length)]!,
      life: Math.random() * 100, // stagger start
      maxLife: 60 + Math.random() * 60,
    }),
    update: (p, w, h) => {
      p.life++;
      const progress = (p.life % p.maxLife) / p.maxLife;
      // Fade in and out
      p.opacity = progress < 0.5 ? progress * 2 : (1 - progress) * 2;
      p.rotation += p.rotationSpeed;
      // Occasionally respawn elsewhere
      if (p.life % p.maxLife === 0) {
        p.x = Math.random() * w;
        p.y = Math.random() * h;
        p.size = 2 + Math.random() * 4;
      }
      return true;
    },
    render: (ctx, p) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 8;
      // Four-pointed star
      const s = p.size;
      ctx.beginPath();
      ctx.moveTo(0, -s);
      ctx.lineTo(s * 0.3, -s * 0.3);
      ctx.lineTo(s, 0);
      ctx.lineTo(s * 0.3, s * 0.3);
      ctx.lineTo(0, s);
      ctx.lineTo(-s * 0.3, s * 0.3);
      ctx.lineTo(-s, 0);
      ctx.lineTo(-s * 0.3, -s * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.restore();
    },
  };
}

/* ─── Config Lookup ──────────────────────────── */

function getEffectConfig(effect: CanvasEffect): EffectConfig | null {
  switch (effect) {
    case "snowfall":  return createSnowConfig();
    case "confetti":  return createConfettiConfig();
    case "halloween": return createHalloweenConfig();
    case "avurudu":   return createAvuruduConfig();
    case "wesak":     return createWesakConfig();
    case "fireworks": return createFireworksConfig();
    case "hearts":    return createHeartsConfig();
    case "sparkle":   return createSparkleConfig();
    default:          return null;
  }
}

/* ─── Canvas Effects Component ───────────────── */

interface CanvasEffectsProps {
  effect: CanvasEffect;
  width: number;
  height: number;
}

export function CanvasEffects({ effect, width, height }: CanvasEffectsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const configRef = useRef<EffectConfig | null>(null);

  // Memoize to prevent re-creating config every render
  const effectKey = effect;

  const initParticles = useCallback((config: EffectConfig, w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(config.spawn(w, h));
    }
    return particles;
  }, []);

  useEffect(() => {
    const config = getEffectConfig(effectKey);
    configRef.current = config;

    if (!config || !canvasRef.current) {
      particlesRef.current = [];
      return;
    }

    particlesRef.current = initParticles(config, width, height);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    const animate = () => {
      if (!running || !configRef.current) return;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]!;
        const alive = configRef.current.update(p, width, height, 1);
        if (!alive) {
          particles.splice(i, 1);
          continue;
        }
        configRef.current.render(ctx, p);
      }

      // Replenish particles
      while (particles.length < configRef.current.particleCount) {
        particles.push(configRef.current.spawn(width, height));
      }

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      running = false;
      cancelAnimationFrame(animFrameRef.current);
    };
  }, [effectKey, width, height, initParticles]);

  if (effect === "none" || !effect) return null;

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width,
        height,
        pointerEvents: "none",
        zIndex: 99990,
      }}
    />
  );
}
