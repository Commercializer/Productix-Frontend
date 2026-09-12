"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "./reveal";

/**
 * Cinematic full-bleed interlude between the hero's animated diagram and
 * "Products Are Becoming Digital" - grounds the abstract identity/layers
 * story in a real, physical shelf moment before the next section unpacks it
 * conceptually. Starts muted (autoplay requirement); the clip carries its
 * own ambient audio, so a toggle is offered rather than dropping sound entirely.
 */
export function PhysicalLayer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      videoRef.current?.pause();
    }
  }, []);

  function toggleSound() {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !video.muted;
    setMuted(video.muted);
  }

  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <video
        ref={videoRef}
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/vid1.mp4"
        poster="/images/physical-layer-poster.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink via-ink/55 to-ink/10" />
      <div className="absolute inset-0 bg-linear-to-r from-ink/85 via-ink/15 to-transparent" />

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl flex-col justify-between px-6 py-14 md:min-h-[620px] md:py-20">
        <Reveal>
          <span className="badge-pill">
            <span
              className="pulse-ring relative inline-flex h-1.5 w-1.5 rounded-full bg-teal text-teal"
              aria-hidden="true"
            />
            Live In-Store Moment
          </span>
        </Reveal>

        <Reveal delay={100} className="max-w-lg">
          <span className="text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-accent">
            The Physical Layer
          </span>
          <h2 className="mt-4 text-[clamp(1.9rem,4vw,2.9rem)] font-medium leading-[1.12] tracking-[-0.02em] text-white">
            Every Product Starts on a Shelf.
          </h2>
          <p className="mt-5 max-w-md text-[15.5px] leading-[1.7] text-white/65">
            Behind every product on a shelf is a physical object waiting to
            become something more. Productix connects that moment to a
            trusted digital identity, ready to scan, engage and inform.
          </p>
        </Reveal>
      </div>

      <button
        type="button"
        onClick={toggleSound}
        aria-label={muted ? "Unmute video" : "Mute video"}
        className="glass-light absolute bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full text-ink transition-transform hover:scale-105 md:bottom-8 md:right-8"
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
    </section>
  );
}
