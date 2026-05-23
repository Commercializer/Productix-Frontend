"use client";

import { ReactNode, useEffect, useRef, useState } from "react";

interface MobileMockupProps {
  children: ReactNode;
  /** Inner screen width in CSS pixels. Must match the rendered content width. */
  screenWidth?: number;
  /** Inner screen height in CSS pixels. */
  screenHeight?: number;
  /** Page title / URL string shown in the simulated address bar. */
  urlLabel?: string;
  /** Optional favicon URL shown in the address bar. */
  faviconUrl?: string | null;
  /**
   * If true (default), the mockup scales down to fit its parent height while
   * keeping the aspect ratio. The inner content still renders at full screen
   * size - only the visual frame shrinks.
   */
  autoFit?: boolean;
  /**
   * Receives the screen element - the in-mockup container that overlays
   * (e.g. feedback sheets) should portal into so they stay inside the phone.
   */
  onScreenRef?: (el: HTMLDivElement | null) => void;
}

const BEZEL = 14; // black bezel around the screen
const STATUS_BAR_H = 44;
const ADDR_BAR_H = 44;

/**
 * iPhone-style mockup. Inner content area is scrollable.
 *
 * The frame renders at its natural size and is CSS-scaled down to fit the
 * parent container's height. Children should render at exactly `screenWidth`
 * so the page looks like an actual mobile view, not a squeezed desktop.
 */
export function MobileMockup({
  children,
  screenWidth = 428,
  screenHeight = 880,
  urlLabel,
  faviconUrl,
  autoFit = true,
  onScreenRef,
}: MobileMockupProps) {
  const frameW = screenWidth + BEZEL * 2;
  const frameH = screenHeight + BEZEL * 2;

  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!autoFit) return;
    const el = containerRef.current?.parentElement;
    if (!el) return;
    const recompute = () => {
      const rect = el.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      // Leave a little breathing room
      const fitW = (rect.width - 32) / frameW;
      const fitH = (rect.height - 32) / frameH;
      setScale(Math.min(1, fitW, fitH));
    };
    recompute();
    const ro = new ResizeObserver(recompute);
    ro.observe(el);
    return () => ro.disconnect();
  }, [autoFit, frameW, frameH]);

  return (
    <div
      ref={containerRef}
      className="relative"
      style={{
        // Reserve space at the scaled size so the parent's flex centering works.
        width: frameW * scale,
        height: frameH * scale,
      }}
    >
      <div
        style={{
          width: frameW,
          height: frameH,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        {/* Outer frame */}
        <div
          className="relative"
          style={{
            width: frameW,
            height: frameH,
            borderRadius: 60,
            background: "linear-gradient(160deg, #1a1d22 0%, #0a0c10 60%, #1a1d22 100%)",
            padding: BEZEL,
            boxShadow:
              "0 0 0 1.5px rgba(255,255,255,0.06), 0 30px 60px -20px rgba(15,23,42,0.55), 0 12px 24px -10px rgba(15,23,42,0.35)",
          }}
        >
          {/* Bezel inner highlight */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              borderRadius: 60,
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,0.08), inset 0 0 0 2.5px rgba(0,0,0,0.7)",
            }}
          />

          {/* Side buttons */}
          <span
            className="absolute"
            style={{
              left: -2,
              top: 120,
              width: 3,
              height: 32,
              borderRadius: 2,
              background: "#1a1d22",
            }}
          />
          <span
            className="absolute"
            style={{
              left: -2,
              top: 170,
              width: 3,
              height: 56,
              borderRadius: 2,
              background: "#1a1d22",
            }}
          />
          <span
            className="absolute"
            style={{
              left: -2,
              top: 240,
              width: 3,
              height: 56,
              borderRadius: 2,
              background: "#1a1d22",
            }}
          />
          <span
            className="absolute"
            style={{
              right: -2,
              top: 180,
              width: 3,
              height: 80,
              borderRadius: 2,
              background: "#1a1d22",
            }}
          />

          {/* Screen */}
          <div
            ref={onScreenRef}
            className="relative overflow-hidden bg-white"
            style={{
              width: screenWidth,
              height: screenHeight,
              borderRadius: 46,
            }}
          >
            {/* Status bar */}
            <div
              className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between text-black"
              style={{
                height: STATUS_BAR_H,
                paddingLeft: 28,
                paddingRight: 28,
                fontSize: 14,
                fontWeight: 600,
                fontFamily:
                  "-apple-system, BlinkMacSystemFont, 'SF Pro Text', Helvetica, Arial, sans-serif",
              }}
            >
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                {/* Cellular bars */}
                <span className="flex items-end gap-[2px]">
                  <span className="block bg-black rounded-[0.5px]" style={{ width: 3, height: 4 }} />
                  <span className="block bg-black rounded-[0.5px]" style={{ width: 3, height: 6 }} />
                  <span className="block bg-black rounded-[0.5px]" style={{ width: 3, height: 8 }} />
                  <span className="block bg-black rounded-[0.5px]" style={{ width: 3, height: 10 }} />
                </span>
                {/* Wifi */}
                <svg width="15" height="11" viewBox="0 0 15 11" fill="black">
                  <path d="M7.5 0a10.4 10.4 0 0 1 7.34 3.04l-1.06 1.06A8.9 8.9 0 0 0 7.5 1.5 8.9 8.9 0 0 0 1.22 4.1L.16 3.04A10.4 10.4 0 0 1 7.5 0Zm0 3.6a6.8 6.8 0 0 1 4.79 1.98l-1.06 1.06a5.3 5.3 0 0 0-3.73-1.54 5.3 5.3 0 0 0-3.73 1.54L2.71 5.58A6.8 6.8 0 0 1 7.5 3.6Zm0 3.6a3.2 3.2 0 0 1 2.27.94L7.5 10.4 5.23 8.14A3.2 3.2 0 0 1 7.5 7.2Z" />
                </svg>
                {/* Battery */}
                <span className="relative inline-block" style={{ width: 24, height: 11 }}>
                  <span
                    className="absolute inset-0 rounded-[3px] border border-black/70"
                    style={{ borderWidth: 1 }}
                  />
                  <span
                    className="absolute bg-black rounded-[1px]"
                    style={{ left: 1, top: 1, right: 4, bottom: 1 }}
                  />
                  <span
                    className="absolute bg-black/70 rounded-r-sm"
                    style={{ right: -1.5, top: 3, width: 1.5, height: 5 }}
                  />
                </span>
              </div>
            </div>

            {/* Dynamic island */}
            <div
              className="absolute z-30 bg-black"
              style={{
                top: 11,
                left: "50%",
                transform: "translateX(-50%)",
                width: 124,
                height: 36,
                borderRadius: 999,
              }}
            />

            {/* Browser chrome (Safari-style address bar) */}
            <div
              className="absolute left-0 right-0 z-10 flex items-center gap-2 bg-[#f5f5f7] border-b border-black/5"
              style={{
                top: STATUS_BAR_H,
                height: ADDR_BAR_H,
                paddingLeft: 12,
                paddingRight: 12,
              }}
            >
              <span className="text-[#5e6470] text-[18px] leading-none">‹</span>
              <span className="text-[#c7cad1] text-[18px] leading-none">›</span>
              <div
                className="flex-1 mx-1 flex items-center gap-1.5 px-3 truncate"
                style={{
                  height: 32,
                  borderRadius: 10,
                  background: "#dadce0",
                }}
              >
                {faviconUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={faviconUrl}
                    alt=""
                    className="rounded-[2px] object-cover shrink-0"
                    style={{ width: 14, height: 14 }}
                  />
                ) : (
                  <svg width="12" height="12" viewBox="0 0 12 12" className="shrink-0 text-[#5e6470]" fill="currentColor">
                    <path d="M9 5V4a3 3 0 0 0-6 0v1H2v6h8V5H9ZM4 4a2 2 0 1 1 4 0v1H4V4Z" />
                  </svg>
                )}
                <span className="text-[12px] text-[#1d1d1f] truncate">{urlLabel ?? "preview"}</span>
              </div>
              <span className="text-[#5e6470] text-[14px] leading-none">⤴</span>
              <span className="text-[#5e6470] text-[14px] leading-none">⎘</span>
            </div>

            {/* Scrollable page content */}
            <div
              className="absolute left-0 right-0 bottom-0 overflow-y-auto overflow-x-hidden bg-white"
              style={{
                top: STATUS_BAR_H + ADDR_BAR_H,
                WebkitOverflowScrolling: "touch",
                scrollbarWidth: "thin",
              }}
            >
              {children}
            </div>

            {/* Home indicator */}
            <div
              className="absolute left-1/2 z-40 -translate-x-1/2 pointer-events-none"
              style={{
                bottom: 8,
                width: 134,
                height: 5,
                borderRadius: 3,
                background: "rgba(0,0,0,0.85)",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
