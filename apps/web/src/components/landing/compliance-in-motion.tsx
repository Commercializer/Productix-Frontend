"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "./reveal";

/**
 * Cinematic full-bleed interlude right after the compliance hero, mirroring
 * PhysicalLayer's autoplay/loop treatment on the homepage - grounds
 * "compliance data" in the same real, physical shelf moment before the page
 * unpacks DPP/PPWR/EPR mechanics. Unlike PhysicalLayer's dark left-side wash,
 * copy sits in a floating glass card at the bottom so the footage itself
 * stays clear across the frame. Starts muted (autoplay requirement); a
 * toggle is offered rather than dropping the clip's ambient audio entirely.
 */
export function ComplianceInMotion() {
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
        src="/videos/vid2.mp4"
        poster="/images/beyond-compliance.jpg"
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-linear-to-t from-ink/50 via-transparent to-transparent" />

      <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-6 py-14 md:min-h-[620px] md:py-20">
        <Reveal className="glass-panel max-w-lg rounded-[2rem] p-7 sm:p-9">
          <span className="badge-pill">
            <span
              className="pulse-ring relative inline-flex h-1.5 w-1.5 rounded-full bg-teal text-teal"
              aria-hidden="true"
            />
            Structured Data In Motion
          </span>
          <span className="mt-5 block text-[12px] font-semibold uppercase tracking-[0.16em] text-brand-accent-dim">
            Compliance, Connected
          </span>
          <h2 className="mt-3 text-[clamp(1.6rem,3.4vw,2.4rem)] font-medium leading-[1.15] tracking-[-0.02em] text-ink">
            Where Compliance Data Meets the Shelf.
          </h2>
          <p className="mt-4 text-[14.5px] leading-[1.7] text-ink/60">
            The same structured product and packaging data behind DPP, PPWR and
            EPR readiness connects to a live digital identity, ready to scan,
            verify and inform.
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
